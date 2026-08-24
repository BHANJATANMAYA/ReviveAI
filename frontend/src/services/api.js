const API_BASE = '/api';

export const api = {
  async getHealth() {
    const res = await fetch(`${API_BASE}/health`);
    return res.json();
  },

  async getMetrics() {
    const res = await fetch(`${API_BASE}/metrics`);
    if (!res.ok) throw new Error('Failed to fetch metrics');
    return res.json();
  },

  async getTransactions(filters = {}) {
    const params = new URLSearchParams();
    if (filters.status && filters.status !== 'ALL') params.append('status', filters.status);
    if (filters.failure_category && filters.failure_category !== 'ALL') params.append('failure_category', filters.failure_category);
    if (filters.urgency && filters.urgency !== 'ALL') params.append('urgency', filters.urgency);
    if (filters.search) params.append('search', filters.search);
    if (filters.limit) params.append('limit', filters.limit);

    const res = await fetch(`${API_BASE}/transactions?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch transactions');
    return res.json();
  },

  async getTransaction(id) {
    const res = await fetch(`${API_BASE}/transactions/${id}`);
    if (!res.ok) throw new Error(`Failed to fetch transaction ${id}`);
    return res.json();
  },

  async recoverTransaction({ txn_id, mode = 'autopilot', force_tool = null, discount_override_pct = null }) {
    const res = await fetch(`${API_BASE}/agent/recover`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ txn_id, mode, force_tool, discount_override_pct })
    });
    if (!res.ok) throw new Error('Failed to execute recovery');
    return res.json();
  },

  async recoverBatch({ txn_ids = null, mode = 'autopilot', limit = 50 }) {
    const res = await fetch(`${API_BASE}/agent/recover-batch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ txn_ids, mode, limit })
    });
    if (!res.ok) throw new Error('Failed to execute batch recovery');
    return res.json();
  },

  async getAgentLogs(limit = 50) {
    const res = await fetch(`${API_BASE}/agent/logs?limit=${limit}`);
    if (!res.ok) throw new Error('Failed to fetch agent logs');
    return res.json();
  },

  async getCustomerLink(linkId) {
    const res = await fetch(`${API_BASE}/customer/link/${linkId}`);
    if (!res.ok) throw new Error('Payment link invalid or expired');
    return res.json();
  },

  async payCustomerLink({ payment_link_id, chosen_method = 'upi', vpa = 'customer@oksbi', card_last4 = '4321' }) {
    const res = await fetch(`${API_BASE}/customer/pay`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ payment_link_id, chosen_method, vpa, card_last4 })
    });
    if (!res.ok) throw new Error('Payment checkout failed');
    return res.json();
  },

  async seedDataset(count = 40, reset = true) {
    const res = await fetch(`${API_BASE}/simulate/seed?count=${count}&reset=${reset}`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to seed dataset');
    return res.json();
  },

  async injectStream(count = 10, scenario = 'mixed') {
    const res = await fetch(`${API_BASE}/simulate/stream`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ count, scenario })
    });
    if (!res.ok) throw new Error('Failed to inject stream');
    return res.json();
  },

  async getAuditTrail(txnId) {
    const res = await fetch(`${API_BASE}/audit-trail/${txnId}`);
    if (!res.ok) throw new Error('Failed to fetch audit trail');
    return res.json();
  },

  getExportCsvUrl() {
    return `${API_BASE}/export/audit-csv`;
  }
};
