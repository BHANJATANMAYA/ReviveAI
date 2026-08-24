import random
import uuid
import datetime
from typing import List
from sqlalchemy.orm import Session
from app import models
from app.services.ml_scorer import ml_scorer

INDIAN_CUSTOMERS = [
    {"name": "Aarav Sharma", "email": "aarav.sharma@techcorp.in", "phone": "+919876543210", "tier": "ENTERPRISE", "ltv": 145000.0},
    {"name": "Priya Patel", "email": "priya.patel@fashionhub.com", "phone": "+919812345678", "tier": "VIP", "ltv": 38000.0},
    {"name": "Rohan Gupta", "email": "rohan.g@quickdeliver.in", "phone": "+919823456789", "tier": "PRO", "ltv": 12500.0},
    {"name": "Ananya Desai", "email": "ananya.d@cloudstudio.io", "phone": "+919834567890", "tier": "ENTERPRISE", "ltv": 210000.0},
    {"name": "Vikram Malhotra", "email": "vikram.m@zenithmedia.in", "phone": "+919845678901", "tier": "VIP", "ltv": 52000.0},
    {"name": "Neha Iyer", "email": "neha.iyer@healthkart.org", "phone": "+919856789012", "tier": "STANDARD", "ltv": 4200.0},
    {"name": "Aditya Verma", "email": "aditya.v@indialabs.co", "phone": "+919867890123", "tier": "PRO", "ltv": 18000.0},
    {"name": "Sneha Reddy", "email": "sneha.reddy@finprime.com", "phone": "+919878901234", "tier": "VIP", "ltv": 89000.0},
    {"name": "Kabir Mehta", "email": "kabir.m@mehtaconsulting.in", "phone": "+919889012345", "tier": "ENTERPRISE", "ltv": 340000.0},
    {"name": "Tanvi Joshi", "email": "tanvi.j@designforge.net", "phone": "+919890123456", "tier": "STANDARD", "ltv": 2800.0},
    {"name": "Siddharth Rao", "email": "siddharth.r@paylogic.in", "phone": "+919901234567", "tier": "PRO", "ltv": 15600.0},
    {"name": "Ishita Roy", "email": "ishita.roy@royalecom.com", "phone": "+919912345678", "tier": "VIP", "ltv": 47000.0},
    {"name": "Manish Chopra", "email": "manish.c@chopra-enterprises.in", "phone": "+919923456789", "tier": "ENTERPRISE", "ltv": 185000.0},
    {"name": "Deepika Sen", "email": "deepika.s@edulearn.org", "phone": "+919934567890", "tier": "STANDARD", "ltv": 3100.0},
    {"name": "Rajesh Nambiar", "email": "rajesh.n@nambiarlogistics.com", "phone": "+919945678901", "tier": "PRO", "ltv": 24000.0},
]

FAILURE_SCENARIOS = [
    {
        "code": "BAD_REQUEST_PAYMENT_TIMED_OUT",
        "reason": "UPI switch transaction timed out waiting for NPCI response",
        "method": "upi",
        "category": "TECHNICAL",
        "banks": ["HDFC Bank", "ICICI Bank", "State Bank of India", "Axis Bank"]
    },
    {
        "code": "INSUFFICIENT_FUNDS",
        "reason": "Customer bank account balance insufficient for debit amount",
        "method": "upi",
        "category": "INSUFFICIENT_FUNDS",
        "banks": ["State Bank of India", "Kotak Mahindra Bank", "Punjab National Bank"]
    },
    {
        "code": "AUTHENTICATION_FAILED_3DS",
        "reason": "Customer failed 3D Secure OTP verification within 180s",
        "method": "card",
        "category": "AUTHENTICATION",
        "banks": ["HDFC Bank", "ICICI Bank", "Axis Bank", "Citibank"]
    },
    {
        "code": "BANK_OFFLINE_MAINTENANCE",
        "reason": "Issuer CBS (Core Banking System) currently under scheduled night maintenance",
        "method": "netbanking",
        "category": "BANK_DOWNTIME",
        "banks": ["HDFC Bank", "State Bank of India", "Bank of Baroda"]
    },
    {
        "code": "UPI_MPIN_CANCELLED",
        "reason": "Customer dismissed UPI authorization prompt on mobile app",
        "method": "upi",
        "category": "USER_DROP",
        "banks": ["ICICI Bank", "Axis Bank", "Yes Bank"]
    },
    {
        "code": "CARD_EXPIRED",
        "reason": "Card expiry date validation failed on recurring recurring mandate",
        "method": "mandate",
        "category": "CARD_EXPIRED",
        "banks": ["HDFC Bank", "ICICI Bank", "Kotak Mahindra Bank"]
    },
    {
        "code": "GATEWAY_TIMEOUT",
        "reason": "Acquirer network connection timed out during clearing",
        "method": "card",
        "category": "TECHNICAL",
        "banks": ["State Bank of India", "Axis Bank", "Federal Bank"]
    }
]

def seed_synthetic_dataset(db: Session, count: int = 40, reset_existing: bool = True) -> int:
    """Seeds rich synthetic Indian fintech failure data into SQLite database."""
    if reset_existing:
        db.query(models.AgentLog).delete()
        db.query(models.RecoveryAction).delete()
        db.query(models.AuditTrail).delete()
        db.query(models.Transaction).delete()
        db.commit()

    created_count = 0
    now = datetime.datetime.utcnow()

    for i in range(count):
        cust = random.choice(INDIAN_CUSTOMERS)
        scenario = random.choice(FAILURE_SCENARIOS)
        bank = random.choice(scenario["banks"])
        
        # Realistic amounts: SaaS tier vs Cart vs Quick
        r = random.random()
        if r > 0.75:
            # High ticket enterprise / b2b
            amount = round(random.uniform(25000, 185000), 2)
        elif r > 0.35:
            # Medium ticket cart
            amount = round(random.uniform(2500, 18000), 2)
        else:
            # Low ticket recurring
            amount = round(random.uniform(499, 2499), 2)

        uid = uuid.uuid4().hex[:10]
        txn_id = f"txn_{uid}"
        order_id = f"order_{uuid.uuid4().hex[:12]}"
        
        # Calculate base ML diagnostics
        prob = ml_scorer.compute_recovery_probability(
            failure_code=scenario["code"],
            payment_method=scenario["method"],
            customer_ltv=cust["ltv"],
            amount=amount,
            retry_count=0,
            customer_tier=cust["tier"]
        )
        rec_vector, urgency, _ = ml_scorer.determine_recovery_strategy(
            failure_category=scenario["category"],
            failure_code=scenario["code"],
            recovery_prob=prob,
            amount=amount,
            customer_ltv=cust["ltv"],
            retry_count=0
        )

        # Stagger created_at over last 24 hours
        time_offset = random.randint(5, 1440)
        txn_time = now - datetime.timedelta(minutes=time_offset)

        txn = models.Transaction(
            id=txn_id,
            order_id=order_id,
            amount=amount,
            currency="INR",
            customer_id=f"cust_{hash(cust['email']) % 100000:05d}",
            customer_name=cust["name"],
            customer_email=cust["email"],
            customer_phone=cust["phone"],
            customer_ltv=cust["ltv"],
            customer_tier=cust["tier"],
            payment_method=scenario["method"],
            failure_code=scenario["code"],
            failure_reason=scenario["reason"],
            failure_category=scenario["category"],
            bank_name=bank,
            status="FAILED",
            recovery_probability=prob,
            recovery_tier=urgency,
            recommended_vector=rec_vector,
            agent_confidence=round(random.uniform(0.88, 0.98), 2),
            retry_count=0,
            max_retries=3,
            created_at=txn_time,
            updated_at=txn_time
        )
        db.add(txn)

        # Initial Audit Record
        db.add(models.AuditTrail(
            txn_id=txn.id,
            event_type="FAILURE_INGESTED",
            amount_at_risk=amount,
            actor="SYSTEM_INGESTION",
            notes=f"Ingested decline code {scenario['code']} from {bank}.",
            timestamp=txn_time
        ))

        created_count += 1

    db.commit()
    return created_count
