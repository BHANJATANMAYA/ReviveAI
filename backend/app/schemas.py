from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

class AgentLogSchema(BaseModel):
    id: int
    txn_id: str
    step_number: int
    thought: str
    action_tool: Optional[str] = None
    action_input: Optional[Dict[str, Any]] = None
    observation: Optional[str] = None
    confidence_score: float = 0.0
    guardrail_check_passed: bool = True
    guardrail_reason: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class RecoveryActionSchema(BaseModel):
    id: str
    txn_id: str
    action_type: str
    channel: Optional[str] = None
    status: str
    payload: Optional[Dict[str, Any]] = None
    result: Optional[Dict[str, Any]] = None
    executed_at: datetime

    class Config:
        from_attributes = True

class AuditTrailSchema(BaseModel):
    id: int
    txn_id: str
    event_type: str
    amount_at_risk: float
    amount_recovered: float
    cost_incurred: float
    roi_impact: float
    actor: str
    notes: Optional[str] = None
    timestamp: datetime

    class Config:
        from_attributes = True

class TransactionBase(BaseModel):
    id: str
    order_id: Optional[str] = None
    amount: float
    currency: str = "INR"
    customer_id: str
    customer_name: str
    customer_email: str
    customer_phone: str
    customer_ltv: float = 0.0
    customer_tier: str = "STANDARD"
    payment_method: str
    failure_code: str
    failure_reason: str
    failure_category: str = "TECHNICAL"
    bank_name: Optional[str] = None

class TransactionCreate(TransactionBase):
    pass

class TransactionResponse(TransactionBase):
    status: str
    recovery_probability: float
    recovery_tier: str
    recommended_vector: Optional[str] = None
    agent_confidence: float = 0.0
    retry_count: int = 0
    max_retries: int = 3
    next_retry_at: Optional[datetime] = None
    recovery_channel: Optional[str] = None
    payment_link_id: Optional[str] = None
    payment_link_url: Optional[str] = None
    discount_applied_pct: float = 0.0
    final_amount: Optional[float] = None
    created_at: datetime
    updated_at: datetime
    recovered_at: Optional[datetime] = None
    logs: List[AgentLogSchema] = []
    actions: List[RecoveryActionSchema] = []

    class Config:
        from_attributes = True

class MetricsSummary(BaseModel):
    total_processed_count: int
    total_failed_count: int
    total_recovered_count: int
    total_revenue_at_risk: float
    total_revenue_recovered: float
    net_recovery_rate_pct: float
    roi_multiplier: float
    active_interventions_count: int
    avg_recovery_time_sec: float
    failure_distribution: Dict[str, int]
    channel_efficacy: Dict[str, Dict[str, Any]]
    timeline: List[Dict[str, Any]]

class RecoverRequest(BaseModel):
    txn_id: str
    mode: str = "autopilot"  # "autopilot" or "copilot"
    force_tool: Optional[str] = None
    discount_override_pct: Optional[float] = None

class BatchRecoverRequest(BaseModel):
    txn_ids: Optional[List[str]] = None
    mode: str = "autopilot"
    limit: int = 50

class CustomerCheckoutSimulate(BaseModel):
    payment_link_id: str
    chosen_method: str = "upi"  # upi, card, netbanking
    vpa: Optional[str] = "customer@oksbi"
    card_last4: Optional[str] = "4321"

class SimulateFailureRequest(BaseModel):
    count: int = 10
    scenario: Optional[str] = "mixed"  # "upi_surge", "insufficient_funds", "bank_downtime", "mixed"
