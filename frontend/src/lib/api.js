const BASE_URL = "/api";

async function request(path, { method = "GET", body } = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });

  let payload = null;
  const text = await res.text();
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = { success: false, message: text, data: null };
    }
  }

  if (!res.ok) {
    const message = payload?.message || `Ошибка сервера (${res.status})`;
    const err = new Error(message);
    err.status = res.status;
    err.payload = payload;
    throw err;
  }

  return payload;
}

export const api = {
  listAccounts: () => request("/accounts"),
  getAccount: (id) => request(`/accounts/${id}`),
  createAccount: (data) =>
    request("/accounts", { method: "POST", body: data }),
  transfer: (data) => request("/transfers", { method: "POST", body: data }),

  toggleTransfers: (enable) =>
    request(`/admin/transfer/toggle?enable=${enable}`, { method: "POST" }),
  systemStatus: () => request("/admin/status"),
  auditSummary: (accountId) => request(`/admin/audit/${accountId}/summary`),
};