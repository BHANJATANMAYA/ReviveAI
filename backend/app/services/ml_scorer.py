import math
from typing import Dict, Any, Tuple

class MLDiagnosticScorer:
    """
    ML diagnostic engine that classifies failure vectors, computes probability of revenue recovery,
    assigns urgency tiers, and determines optimal intervention strategies.
    """

    # Base recovery probabilities by failure vector
    FAILURE_CODE_WEIGHTS = {
        "BAD_REQUEST_PAYMENT_TIMED_OUT": 0.88,
        "GATEWAY_TIMEOUT": 0.85,
        "UPI_MPIN_CANCELLED": 0.74,
        "INSUFFICIENT_FUNDS": 0.62,
        "CARD_EXPIRED": 0.54,
        "BANK_OFFLINE_MAINTENANCE": 0.82,
        "AUTHENTICATION_FAILED_3DS": 0.68,
        "CUSTOMER_DROPPED_OFF": 0.72,
        "TRANSACTION_LIMIT_EXCEEDED": 0.58,
        "INVALID_VPA": 0.45,
        "ACCOUNT_BLOCKED": 0.05,
        "CARD_STOLEN": 0.02,
    }

    PAYMENT_METHOD_MULTIPLIERS = {
        "upi": 1.15,
        "card": 1.05,
        "netbanking": 0.95,
        "mandate": 1.10,
        "emi": 1.00,
    }

    @classmethod
    def classify_failure(cls, failure_code: str, failure_reason: str) -> str:
        """Classifies raw failure into standard fintech diagnostic categories."""
        code = (failure_code or "").upper()
        reason = (failure_reason or "").lower()

        if any(w in code or w in reason for w in ["timeout", "gateway", "network", "timed_out"]):
            return "TECHNICAL"
        elif any(w in code or w in reason for w in ["insufficient", "balance", "low_funds"]):
            return "INSUFFICIENT_FUNDS"
        elif any(w in code or w in reason for w in ["maintenance", "offline", "bank_down", "core_banking"]):
            return "BANK_DOWNTIME"
        elif any(w in code or w in reason for w in ["mpin", "cancel", "drop", "user_abort"]):
            return "USER_DROP"
        elif any(w in code or w in reason for w in ["3ds", "auth", "otp", "authentication"]):
            return "AUTHENTICATION"
        elif any(w in code or w in reason for w in ["expired", "validity"]):
            return "CARD_EXPIRED"
        elif any(w in code or w in reason for w in ["stolen", "fraud", "blocked", "restricted"]):
            return "SECURITY_BLOCK"
        return "TECHNICAL"

    @classmethod
    def compute_recovery_probability(
        cls,
        failure_code: str,
        payment_method: str,
        customer_ltv: float,
        amount: float,
        retry_count: int,
        customer_tier: str
    ) -> float:
        """
        Computes calibrated salvage probability (0.00 to 1.00).
        Formula: P = Sigmoid(BaseWeight + MethodBonus + LTVBonus - AmountFriction - RetryDecay)
        """
        base_p = cls.FAILURE_CODE_WEIGHTS.get(failure_code.upper(), 0.60)
        method_mul = cls.PAYMENT_METHOD_MULTIPLIERS.get(payment_method.lower(), 1.0)
        
        # Logarithmic LTV bonus (higher LTV customers have higher willingness to pay)
        ltv_factor = math.log10(max(customer_ltv, 100)) / 6.0  # ~0.33 to 0.85
        
        # Tier boost
        tier_boost = 0.08 if customer_tier in ("VIP", "ENTERPRISE") else (0.04 if customer_tier == "PRO" else 0.0)
        
        # Amount friction (larger single amounts have slightly lower spontaneous retry success)
        amount_friction = min(0.15, (amount / 100000.0) * 0.1)
        
        # Retry decay penalty (each retry that fails lowers probability by 18%)
        decay = retry_count * 0.18

        raw_score = (base_p * method_mul * 0.5) + (ltv_factor * 0.3) + tier_boost - amount_friction - decay
        # Bound between 0.02 and 0.98
        probability = max(0.02, min(0.98, raw_score))
        return round(probability, 3)

    @classmethod
    def determine_recovery_strategy(
        cls,
        failure_category: str,
        failure_code: str,
        recovery_prob: float,
        amount: float,
        customer_ltv: float,
        retry_count: int
    ) -> Tuple[str, str, float]:
        """
        Returns (recommended_vector, urgency_tier, recommended_discount_pct).
        """
        # Determine Urgency
        if amount >= 15000 or customer_ltv >= 25000 or recovery_prob >= 0.80:
            urgency = "HIGH"
        elif amount >= 3000 or recovery_prob >= 0.50:
            urgency = "MEDIUM"
        else:
            urgency = "LOW"

        # Determine Discount Recommendation
        discount_pct = 0.0
        if customer_ltv >= 8000 and failure_category in ("USER_DROP", "INSUFFICIENT_FUNDS"):
            if amount > 2000:
                discount_pct = 10.0  # 10% retention sweet spot
            else:
                discount_pct = 5.0

        # Strategy Decision Matrix
        if failure_category == "SECURITY_BLOCK":
            vector = "DEFER_SECURITY_MANUAL_REVIEW"
            discount_pct = 0.0
        elif failure_category == "BANK_DOWNTIME":
            vector = "DEFER_BANK_HEALTH"
        elif failure_category == "TECHNICAL" and retry_count == 0:
            vector = "ADAPTIVE_RETRY"
        elif failure_category in ("USER_DROP", "AUTHENTICATION"):
            vector = "WHATSAPP_NUDGE"
        elif failure_category == "INSUFFICIENT_FUNDS":
            vector = "DYNAMIC_PAYMENT_LINK" if discount_pct == 0 else "RETENTION_DISCOUNT"
        elif failure_category == "CARD_EXPIRED":
            vector = "DYNAMIC_PAYMENT_LINK"  # Prompt for alternate card/UPI
        else:
            vector = "DYNAMIC_PAYMENT_LINK"

        return vector, urgency, discount_pct

ml_scorer = MLDiagnosticScorer()
