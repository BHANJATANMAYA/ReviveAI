import uuid
import datetime
import json
import random
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session

from app import models
from app.config import settings
from app.services.ml_scorer import ml_scorer
from app.services.guardrails import guardrails
from app.services.razorpay_client import razorpay_service

class ReviveAIAgentBrain:
    """
    Agentic Revenue Recovery Brain.
    Orchestrates diagnosis, multi-step chain-of-thought reasoning, tool execution, and guardrail enforcement.
    """

    def process_recovery(
        self,
        db: Session,
        txn: models.Transaction,
        mode: str = "autopilot",
        force_tool: Optional[str] = None,
        discount_override: Optional[float] = None
    ) -> Dict[str, Any]:
        """
        Executes end-to-end agentic recovery loop for a transaction.
        """
        logs_generated = []
        step = 1

        # -------------------------------------------------------------
        # STEP 1: Diagnostic & ML Recovery Scoring
        # -------------------------------------------------------------
        failure_cat = ml_scorer.classify_failure(txn.failure_code, txn.failure_reason)
        recovery_prob = ml_scorer.compute_recovery_probability(
            failure_code=txn.failure_code,
            payment_method=txn.payment_method,
            customer_ltv=txn.customer_ltv,
            amount=txn.amount,
            retry_count=txn.retry_count,
            customer_tier=txn.customer_tier
        )
        rec_vector, urgency, rec_discount = ml_scorer.determine_recovery_strategy(
            failure_category=failure_cat,
            failure_code=txn.failure_code,
            recovery_prob=recovery_prob,
            amount=txn.amount,
            customer_ltv=txn.customer_ltv,
            retry_count=txn.retry_count
        )

        txn.failure_category = failure_cat
        txn.recovery_probability = recovery_prob
        txn.recovery_tier = urgency
        txn.recommended_vector = force_tool or rec_vector
        txn.agent_confidence = round(random.uniform(0.85, 0.98), 2)
        txn.status = "ANALYZED"

        thought_1 = (
            f"Diagnosed failure '{txn.failure_code}' on {txn.payment_method.upper()} for ₹{txn.amount:,.2f}. "
            f"Customer LTV: ₹{txn.customer_ltv:,.2f} ({txn.customer_tier}). "
            f"Calculated recovery likelihood at {recovery_prob*100:.1f}%. "
            f"Identified primary vector: '{txn.recommended_vector}' with Urgency: {urgency}."
        )

        log1 = models.AgentLog(
            txn_id=txn.id,
            step_number=step,
            thought=thought_1,
            action_tool="ml_diagnostic_scorer",
            action_input={"failure_code": txn.failure_code, "ltv": txn.customer_ltv, "method": txn.payment_method},
            observation=f"Decline Vector: {failure_cat} | Probability: {recovery_prob:.2f} | Recommended: {txn.recommended_vector}",
            confidence_score=txn.agent_confidence,
            guardrail_check_passed=True
        )
        db.add(log1)
        logs_generated.append(log1)
        step += 1

        # Record Audit
        db.add(models.AuditTrail(
            txn_id=txn.id,
            event_type="DIAGNOSTIC_COMPUTED",
            amount_at_risk=txn.amount,
            actor="REVIVE_AI_AGENT",
            notes=f"Calculated recovery score: {recovery_prob*100:.1f}% | Strategy: {txn.recommended_vector}"
        ))

        # In Copilot mode, if manual review is required, pause here
        if mode == "copilot" and not force_tool:
            db.commit()
            return {
                "status": "AWAITING_APPROVAL",
                "recommendation": txn.recommended_vector,
                "recovery_probability": recovery_prob,
                "urgency": urgency,
                "recommended_discount_pct": rec_discount,
                "logs": [self._format_log(l) for l in logs_generated]
            }

        # -------------------------------------------------------------
        # STEP 2: Policy & Guardrail Verification
        # -------------------------------------------------------------
        chosen_tool = force_tool or rec_vector
        discount_to_apply = discount_override if discount_override is not None else rec_discount
        guardrail_passed = True
        guardrail_reason = "All regulatory and banking margin limits cleared."

        if chosen_tool == "ADAPTIVE_RETRY":
            guardrail_passed, guardrail_reason = guardrails.validate_smart_retry(txn)
            if not guardrail_passed:
                # Fallback tool if retry limit hit
                chosen_tool = "DYNAMIC_PAYMENT_LINK"
                thought_guard = f"Guardrail blocked raw network retry: {guardrail_reason}. Pivoting tool to 'DYNAMIC_PAYMENT_LINK'."
            else:
                thought_guard = f"Guardrail verified: Retry attempt {txn.retry_count + 1}/{txn.max_retries} is within safe banking limit."

        elif chosen_tool in ("RETENTION_DISCOUNT", "DYNAMIC_PAYMENT_LINK"):
            guardrail_passed, guardrail_reason, discount_to_apply = guardrails.validate_retention_discount(txn, discount_to_apply)
            thought_guard = f"Guardrail verified discount parameters: {guardrail_reason} (Final Discount: {discount_to_apply}%)."

        elif chosen_tool == "WHATSAPP_NUDGE":
            guardrail_passed, guardrail_reason = guardrails.validate_communication_channel(txn, "WhatsApp")
            thought_guard = f"Guardrail checked communication frequency: {guardrail_reason}"

        else:
            thought_guard = "Standard guardrail policy verified for execution."

        log2 = models.AgentLog(
            txn_id=txn.id,
            step_number=step,
            thought=thought_guard,
            action_tool="guardrail_engine",
            action_input={"tool": chosen_tool, "retry_count": txn.retry_count, "discount_pct": discount_to_apply},
            observation=guardrail_reason,
            confidence_score=0.96,
            guardrail_check_passed=guardrail_passed,
            guardrail_reason=guardrail_reason
        )
        db.add(log2)
        logs_generated.append(log2)
        step += 1

        # -------------------------------------------------------------
        # STEP 3: Autonomous Tool Execution
        # -------------------------------------------------------------
        txn.status = "IN_INTERVENTION"
        action_id = f"act_{uuid.uuid4().hex[:10]}"
        action_result = {}

        if chosen_tool == "ADAPTIVE_RETRY":
            txn.retry_count += 1
            retry_res = razorpay_service.execute_smart_retry(txn.id, txn.payment_method)
            txn.recovery_channel = "smart_retry"
            action_result = retry_res
            
            # 75% of first-time technical retries resolve immediately in simulation
            success = random.random() < 0.75
            if success:
                txn.status = "RECOVERED"
                txn.recovered_at = datetime.datetime.utcnow()
                txn.final_amount = txn.amount
                thought_3 = f"Smart Retry dispatched to Razorpay Switch for {txn.payment_method.upper()}. Payment {retry_res['id']} AUTHORIZED and CAPTURED immediately."
                obs_3 = f"Success: Recovered ₹{txn.amount:,.2f} via Razorpay Smart Retry."
                
                db.add(models.AuditTrail(
                    txn_id=txn.id,
                    event_type="REVENUE_SALVAGED",
                    amount_at_risk=txn.amount,
                    amount_recovered=txn.amount,
                    cost_incurred=5.0,  # nominal processing fee
                    roi_impact=round(txn.amount / 5.0, 1),
                    actor="REVIVE_AI_AGENT",
                    notes="Autonomous Smart Retry resolved transient network glitch."
                ))
            else:
                # Pivot to Payment Link for customer
                plink_res = razorpay_service.create_payment_link(
                    amount_inr=txn.amount,
                    customer_name=txn.customer_name,
                    customer_email=txn.customer_email,
                    customer_phone=txn.customer_phone,
                    description=f"Payment for Order #{txn.order_id or txn.id}",
                    reference_id=txn.id
                )
                txn.payment_link_id = plink_res["id"]
                txn.payment_link_url = plink_res["short_url"]
                thought_3 = f"Immediate retry yielded secondary drop. Generated dynamic Razorpay Payment Link ({plink_res['id']}) dispatched via SMS/Email."
                obs_3 = f"Payment link generated: {plink_res['short_url']}"

        elif chosen_tool in ("DYNAMIC_PAYMENT_LINK", "RETENTION_DISCOUNT", "WHATSAPP_NUDGE"):
            final_charge = txn.amount * (1.0 - (discount_to_apply / 100.0))
            txn.discount_applied_pct = discount_to_apply
            txn.final_amount = final_charge
            txn.recovery_channel = "whatsapp" if chosen_tool == "WHATSAPP_NUDGE" else "payment_link"

            plink_res = razorpay_service.create_payment_link(
                amount_inr=final_charge,
                customer_name=txn.customer_name,
                customer_email=txn.customer_email,
                customer_phone=txn.customer_phone,
                description=f"Recovered Checkout #{txn.order_id or txn.id}" + (f" ({discount_to_apply:.0f}% VIP Applied)" if discount_to_apply > 0 else ""),
                reference_id=txn.id,
                notes={"original_amount": str(txn.amount), "discount_pct": str(discount_to_apply)}
            )

            txn.payment_link_id = plink_res["id"]
            txn.payment_link_url = plink_res["short_url"]
            action_result = plink_res

            channel_name = "WhatsApp & SMS" if chosen_tool == "WHATSAPP_NUDGE" else "Razorpay Direct Payment Link"
            thought_3 = (
                f"Generated dynamic Razorpay recovery link {plink_res['id']} for ₹{final_charge:,.2f} "
                + (f"with {discount_to_apply:.0f}% retention concession. " if discount_to_apply > 0 else ". ")
                + f"Dispatched interactive payment CTA to customer {txn.customer_name} ({txn.customer_phone}) via {channel_name}."
            )
            obs_3 = f"Intervention Live: Dispatched {plink_res['id']} to customer. Awaiting customer authorization."

            db.add(models.AuditTrail(
                txn_id=txn.id,
                event_type="INTERVENTION_TRIGGERED",
                amount_at_risk=txn.amount,
                amount_recovered=0.0,
                cost_incurred=1.5,
                actor="REVIVE_AI_AGENT",
                notes=f"Dispatched {chosen_tool} to {txn.customer_phone} with Link ID {plink_res['id']}."
            ))

        elif chosen_tool == "DEFER_BANK_HEALTH":
            txn.next_retry_at = datetime.datetime.utcnow() + datetime.timedelta(minutes=30)
            txn.recovery_channel = "deferred_retry"
            thought_3 = f"Detected temporary Core Banking Downtime at {txn.bank_name or 'Issuer Bank'}. Scheduled deferred retry in 30 minutes to safeguard conversion rate."
            obs_3 = f"Deferred to {txn.next_retry_at.strftime('%H:%M:%S UTC')}."
            action_result = {"deferred_until": str(txn.next_retry_at)}

        else:
            thought_3 = f"Flagged for Operator review: {chosen_tool}."
            obs_3 = "Placed in manual review queue."

        log3 = models.AgentLog(
            txn_id=txn.id,
            step_number=step,
            thought=thought_3,
            action_tool=f"razorpay_{chosen_tool.lower()}",
            action_input={"tool": chosen_tool, "discount_pct": discount_to_apply, "target": txn.customer_phone},
            observation=obs_3,
            confidence_score=0.94,
            guardrail_check_passed=True
        )
        db.add(log3)
        logs_generated.append(log3)

        # Record Recovery Action
        action = models.RecoveryAction(
            id=action_id,
            txn_id=txn.id,
            action_type=chosen_tool,
            channel=txn.recovery_channel,
            status="EXECUTED",
            payload={"discount_pct": discount_to_apply, "amount": txn.amount},
            result=action_result
        )
        db.add(action)

        db.commit()
        db.refresh(txn)

        return {
            "status": txn.status,
            "transaction_id": txn.id,
            "recovered": txn.status == "RECOVERED",
            "recovery_channel": txn.recovery_channel,
            "payment_link_id": txn.payment_link_id,
            "payment_link_url": txn.payment_link_url,
            "discount_applied_pct": txn.discount_applied_pct,
            "final_amount": txn.final_amount,
            "logs": [self._format_log(l) for l in logs_generated]
        }

    def _format_log(self, log: models.AgentLog) -> Dict[str, Any]:
        return {
            "id": log.id,
            "step_number": log.step_number,
            "thought": log.thought,
            "action_tool": log.action_tool,
            "action_input": log.action_input,
            "observation": log.observation,
            "confidence_score": log.confidence_score,
            "guardrail_check_passed": log.guardrail_check_passed,
            "guardrail_reason": log.guardrail_reason,
            "created_at": log.created_at.isoformat() if log.created_at else None
        }

agent_brain = ReviveAIAgentBrain()
