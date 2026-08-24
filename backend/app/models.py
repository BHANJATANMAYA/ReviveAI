import datetime
from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.database import Base

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(String(64), primary_key=True, index=True)  # txn_xxx or pay_xxx
    order_id = Column(String(64), index=True, nullable=True)  # order_xxx
    amount = Column(Float, nullable=False)  # in INR
    currency = Column(String(10), default="INR")
    
    # Customer Details
    customer_id = Column(String(64), index=True, nullable=False)
    customer_name = Column(String(128), nullable=False)
    customer_email = Column(String(128), nullable=False)
    customer_phone = Column(String(32), nullable=False)
    customer_ltv = Column(Float, default=0.0)  # Lifetime value in INR
    customer_tier = Column(String(32), default="STANDARD")  # VIP, ENTERPRISE, PRO, STANDARD
    
    # Payment & Failure Metadata
    payment_method = Column(String(32), nullable=False)  # upi, card, netbanking, mandate, emi
    failure_code = Column(String(64), nullable=False)  # BAD_REQUEST_PAYMENT_TIMED_OUT, INSUFFICIENT_FUNDS, etc.
    failure_reason = Column(String(256), nullable=False)
    failure_category = Column(String(64), default="TECHNICAL")  # TECHNICAL, USER_DROP, INSUFFICIENT_FUNDS, FRAUD_SUSPECT, BANK_DOWN
    bank_name = Column(String(64), nullable=True)  # HDFC, ICICI, SBI, AXIS, etc.
    
    # Status Pipeline: FAILED -> ANALYZED -> IN_INTERVENTION -> RECOVERED | TERMINAL_FAIL
    status = Column(String(32), default="FAILED", index=True)
    
    # AI ML Diagnostic Fields
    recovery_probability = Column(Float, default=0.0)  # 0.0 to 1.0 (e.g. 0.84 = 84%)
    recovery_tier = Column(String(16), default="MEDIUM")  # HIGH, MEDIUM, LOW
    recommended_vector = Column(String(64), nullable=True)  # ADAPTIVE_RETRY, DYNAMIC_PAYMENT_LINK, WHATSAPP_NUDGE, RETENTION_DISCOUNT, DEFER_BANK_HEALTH
    agent_confidence = Column(Float, default=0.0)
    
    # Execution Tracking
    retry_count = Column(Integer, default=0)
    max_retries = Column(Integer, default=3)
    next_retry_at = Column(DateTime, nullable=True)
    recovery_channel = Column(String(32), nullable=True)  # upi_qr, sms, whatsapp, smart_retry, payment_link
    payment_link_id = Column(String(64), nullable=True)  # plink_xxx
    payment_link_url = Column(String(256), nullable=True)
    discount_applied_pct = Column(Float, default=0.0)
    final_amount = Column(Float, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
    recovered_at = Column(DateTime, nullable=True)
    
    # Relationships
    logs = relationship("AgentLog", back_populates="transaction", cascade="all, delete-orphan")
    actions = relationship("RecoveryAction", back_populates="transaction", cascade="all, delete-orphan")
    audit_records = relationship("AuditTrail", back_populates="transaction", cascade="all, delete-orphan")


class AgentLog(Base):
    __tablename__ = "agent_logs"

    id = Column(Integer, primary_key=True, autoincrement=True)
    txn_id = Column(String(64), ForeignKey("transactions.id"), index=True, nullable=False)
    step_number = Column(Integer, default=1)
    
    thought = Column(Text, nullable=False)  # CoT Reasoning step
    action_tool = Column(String(64), nullable=True)  # Tool called
    action_input = Column(JSON, nullable=True)
    observation = Column(Text, nullable=True)
    
    confidence_score = Column(Float, default=0.0)
    guardrail_check_passed = Column(Boolean, default=True)
    guardrail_reason = Column(String(256), nullable=True)
    
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    transaction = relationship("Transaction", back_populates="logs")


class RecoveryAction(Base):
    __tablename__ = "recovery_actions"

    id = Column(String(64), primary_key=True)  # act_xxx
    txn_id = Column(String(64), ForeignKey("transactions.id"), index=True, nullable=False)
    action_type = Column(String(64), nullable=False)  # SMART_RETRY, GENERATE_PLINK, WHATSAPP_NUDGE, RETENTION_DISCOUNT, DEFER
    channel = Column(String(32), nullable=True)
    status = Column(String(32), default="PENDING")  # PENDING, EXECUTED, FAILED, CANCELLED
    payload = Column(JSON, nullable=True)
    result = Column(JSON, nullable=True)
    executed_at = Column(DateTime, default=datetime.datetime.utcnow)

    transaction = relationship("Transaction", back_populates="actions")


class AuditTrail(Base):
    __tablename__ = "audit_trail"

    id = Column(Integer, primary_key=True, autoincrement=True)
    txn_id = Column(String(64), ForeignKey("transactions.id"), index=True, nullable=False)
    event_type = Column(String(64), nullable=False)  # FAILURE_INGESTED, DIAGNOSTIC_COMPUTED, INTERVENTION_TRIGGERED, REVENUE_SALVAGED, GUARDRAIL_ENFORCED
    amount_at_risk = Column(Float, default=0.0)
    amount_recovered = Column(Float, default=0.0)
    cost_incurred = Column(Float, default=0.0)
    roi_impact = Column(Float, default=0.0)
    actor = Column(String(64), default="REVIVE_AI_AGENT")  # REVIVE_AI_AGENT, HUMAN_OPERATOR, CUSTOMER
    notes = Column(Text, nullable=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

    transaction = relationship("Transaction", back_populates="audit_records")
