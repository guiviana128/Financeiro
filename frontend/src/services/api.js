const API_BASE_URL = "http://localhost:8000/api";

async function fetchJson(url, options = {}) {
  try {
    const res = await fetch(`${API_BASE_URL}${url}`, {
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {})
      },
      ...options
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || `Erro na requisição (${res.status})`);
    }

    return await res.json();
  } catch (err) {
    console.error(`API Error on ${url}:`, err);
    throw err;
  }
}

export const api = {
  // Dashboard
  getDashboard: (month) => fetchJson(`/dashboard/summary${month ? `?month=${month}` : ""}`),

  // Credit Cards
  getCreditCards: (month) => fetchJson(`/credit-cards${month ? `?month=${month}` : ""}`),
  getCreditCard: (id, month) => fetchJson(`/credit-cards/${id}${month ? `?month=${month}` : ""}`),
  createCreditCard: (data) => fetchJson(`/credit-cards`, { method: "POST", body: JSON.stringify(data) }),
  updateCreditCard: (id, data) => fetchJson(`/credit-cards/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteCreditCard: (id) => fetchJson(`/credit-cards/${id}`, { method: "DELETE" }),

  // Transactions
  getTransactions: (params = {}) => {
    const query = new URLSearchParams();
    if (params.month) query.append("month", params.month);
    if (params.card_id) query.append("card_id", params.card_id);
    if (params.category_id) query.append("category_id", params.category_id);
    if (params.type && params.type !== "all") query.append("type", params.type);
    if (params.is_paid !== undefined && params.is_paid !== "") query.append("is_paid", params.is_paid);
    if (params.search) query.append("search", params.search);
    return fetchJson(`/transactions?${query.toString()}`);
  },
  createTransaction: (data) => fetchJson(`/transactions`, { method: "POST", body: JSON.stringify(data) }),
  updateTransaction: (id, data) => fetchJson(`/transactions/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  togglePaidStatus: (id) => fetchJson(`/transactions/${id}/toggle-paid`, { method: "PATCH" }),
  deleteTransaction: (id, deleteAllInstallments = false) =>
    fetchJson(`/transactions/${id}?delete_all_installments=${deleteAllInstallments}`, { method: "DELETE" }),
  getExportCsvUrl: (month) => `${API_BASE_URL}/transactions/export/csv${month ? `?month=${month}` : ""}`,

  // Categories
  getCategories: (type) => fetchJson(`/categories${type ? `?type=${type}` : ""}`),
  createCategory: (data) => fetchJson(`/categories`, { method: "POST", body: JSON.stringify(data) }),
  deleteCategory: (id) => fetchJson(`/categories/${id}`, { method: "DELETE" }),

  // Budgets & 50/30/20 Rule
  getBudgets: (month) => fetchJson(`/budgets${month ? `?month=${month}` : ""}`),
  saveBudget: (data) => fetchJson(`/budgets`, { method: "POST", body: JSON.stringify(data) }),
  deleteBudget: (id) => fetchJson(`/budgets/${id}`, { method: "DELETE" }),
  getRule503020: (month) => fetchJson(`/budgets/rule-50-30-20${month ? `?month=${month}` : ""}`),

  // Goals
  getGoals: () => fetchJson(`/goals`),
  createGoal: (data) => fetchJson(`/goals`, { method: "POST", body: JSON.stringify(data) }),
  updateGoal: (id, data) => fetchJson(`/goals/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteGoal: (id) => fetchJson(`/goals/${id}`, { method: "DELETE" }),

  // Open Finance & Webhooks
  simulateBankPurchase: (data) => fetchJson(`/open-finance/webhook/purchase`, { method: "POST", body: JSON.stringify(data) }),
  getBankConnections: () => fetchJson(`/open-finance/connections`),

  // Reset Demo
  resetDemo: () => fetchJson(`/reset-demo`, { method: "POST" })
};
