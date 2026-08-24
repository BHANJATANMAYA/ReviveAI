from typing import Dict, Any, Tuple
from datetime import datetime, timedelta
from app.config import settings

class GuardrailEngine:
    """Enforces safety, banking compliance, financial margin bounds, and customer spam limits."""

    @staticmethod
    def validate_smart_retry(txn: Any) -> Tuple[bool, str]:
        """Validates if an adaptive retry can be executed without risking card ban or rate limits."""
        if txn.retry_count >= settings.MAX_RETRY_COUNT:
            return False, f"Guardrail Triggered: Max retry limit ({settings.MAX_RETRY_COUNT}) reached. Further retries will risk card/VPA throttling."
        
        # If failure was terminal fraud / stolen card, never retry
        if txn.failure_code in ("CARD_STOLEN", "FRAUD_SUSPECT", "ACCOUNT_BLOCKED"):
            return False, f"Guardrail Triggered: Security block on failure code '{txn.failure_code}'. Automated retry prohibited."
        
        return True, "Guardrail Passed: Retry permissible within bank throttle budget."

    @staticmethod
    def validate_retention_discount(txn: Any, discount_pct: float) -> Tuple[bool, str, float]:
        """Validates if retention discount satisfies customer LTV and maximum allowable discount ceiling."""
        if discount_pct <= 0:
            return True, "No discount applied.", 0.0

        if discount_pct > settings.MAX_RETENTION_DISCOUNT_PCT:
            safe_discount = settings.MAX_RETENTION_DISCOUNT_PCT
            return False, f"Guardrail Alert: Requested discount {discount_pct}% exceeds ceiling ({settings.MAX_RETENTION_DISCOUNT_PCT}%). Capping to {safe_discount}%.", safe_discount

        # Check LTV threshold
        if txn.customer_ltv < settings.MIN_LTV_FOR_DISCOUNT_INR and txn.amount < 1500:
            return False, f"Guardrail Triggered: Customer LTV (₹{txn.customer_ltv}) is below threshold ₹{settings.MIN_LTV_FOR_DISCOUNT_INR} for retention discount.", 0.0

        return True, f"Guardrail Passed: Discount {discount_pct}% approved within margin parameters.", discount_pct

    @staticmethod
    def validate_communication_channel(txn: Any, channel: str) -> Tuple[bool, str]:
        """Prevents spamming the customer across communication channels."""
        # Check existing actions for communication attempts
        existing_nudges = [a for a in getattr(txn, 'actions', []) if a.action_type in ("WHATSAPP_NUDGE", "SMS_NUDGE")]
        if len(existing_nudges) >= 2:
            return False, "Guardrail Triggered: Frequency cap reached. Max 2 customer notifications allowed per failure cycle."
        
        return True, f"Guardrail Passed: Communication via {channel} permitted."

guardrails = GuardrailEngine()
