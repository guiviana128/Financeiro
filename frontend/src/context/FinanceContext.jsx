import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { api } from "../services/api";
import { getCurrentMonth } from "../utils/formatters";

const FinanceContext = createContext();

const INITIAL_CATEGORIES = [
  { id: 1, name: "Moradia & Contas", icon: "Home", color: "#6366f1", type: "expense", budget_type: "needs" },
  { id: 2, name: "Supermercado & Alimentação", icon: "ShoppingCart", color: "#f59e0b", type: "expense", budget_type: "needs" },
  { id: 3, name: "Transporte & Combustível", icon: "Car", color: "#3b82f6", type: "expense", budget_type: "needs" },
  { id: 4, name: "Saúde & Farmácia", icon: "HeartPulse", color: "#ef4444", type: "expense", budget_type: "needs" },
  { id: 5, name: "Lazer & Restaurantes", icon: "Utensils", color: "#ec4899", type: "expense", budget_type: "wants" },
  { id: 6, name: "Compras & Vestuário", icon: "ShoppingBag", color: "#14b8a6", type: "expense", budget_type: "wants" },
  { id: 7, name: "Assinaturas & Streaming", icon: "Tv", color: "#06b6d4", type: "expense", budget_type: "wants" },
  { id: 8, name: "Viagens & Férias", icon: "Plane", color: "#f97316", type: "expense", budget_type: "wants" },
  { id: 9, name: "Investimentos & Ações", icon: "TrendingUp", color: "#10b981", type: "expense", budget_type: "savings" },
  { id: 10, name: "Reserva de Emergência", icon: "ShieldCheck", color: "#059669", type: "expense", budget_type: "savings" },
  { id: 11, name: "Salário Mensal", icon: "Briefcase", color: "#10b981", type: "income", budget_type: "needs" },
  { id: 12, name: "Rendimentos & Dividendos", icon: "Coins", color: "#34d399", type: "income", budget_type: "savings" },
  { id: 13, name: "Freelance & Extras", icon: "Laptop", color: "#60a5fa", type: "income", budget_type: "wants" }
];

const INITIAL_CARDS = [];

export const FinanceProvider = ({ children }) => {
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  const [isPrivacyMode, setIsPrivacyMode] = useState(() => {
    return localStorage.getItem("finflow_privacy") === "true";
  });
  const [dashboard, setDashboard] = useState(null);
  const [creditCards, setCreditCards] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [budgets, setBudgets] = useState([]);
  const [rule503020, setRule503020] = useState(null);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [backendConnected, setBackendConnected] = useState(true);

  const togglePrivacyMode = () => {
    setIsPrivacyMode(prev => {
      const next = !prev;
      localStorage.setItem("finflow_privacy", String(next));
      return next;
    });
  };

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  }, []);

  const computeLocalDashboard = useCallback((cards, txs, cats, m) => {
    const incs = txs.filter(t => t.type === "income" && (!t.competence_month || t.competence_month === m));
    const exps = txs.filter(t => t.type === "expense" && (!t.competence_month || t.competence_month === m));

    const totalIncome = incs.reduce((acc, t) => acc + (t.amount || 0), 0);
    const totalExpense = exps.reduce((acc, t) => acc + (t.amount || 0), 0);
    const cardBill = exps.filter(t => t.credit_card_id).reduce((acc, t) => acc + (t.amount || 0), 0);
    const allIncs = txs.filter(t => t.type === "income");
    const allExps = txs.filter(t => t.type === "expense");
    const lifetimeIncome = allIncs.reduce((acc, t) => acc + (t.amount || 0), 0);
    const lifetimeExpense = allExps.reduce((acc, t) => acc + (t.amount || 0), 0);
    const totalBalance = lifetimeIncome - lifetimeExpense;
    const netSavings = totalIncome - totalExpense;
    const savingsRate = totalIncome > 0 ? Math.max(0, Math.round((netSavings / totalIncome) * 100)) : 0;

    const catMap = {};
    exps.forEach(t => {
      const c = cats.find(x => x.id === t.category_id) || { name: "Outros", color: "#6366f1", icon: "Tag" };
      if (!catMap[c.name]) {
        catMap[c.name] = { name: c.name, color: c.color, icon: c.icon, amount: 0 };
      }
      catMap[c.name].amount += t.amount;
    });

    const expensesByCategory = Object.values(catMap).map(c => ({
      ...c,
      amount: Math.round(c.amount * 100) / 100,
      percentage: totalExpense > 0 ? Math.round((c.amount / totalExpense) * 1000) / 10 : 0
    })).sort((a, b) => b.amount - a.amount);

    return {
      current_month: m,
      total_balance: totalBalance,
      monthly_income: totalIncome,
      monthly_expense: totalExpense,
      monthly_credit_card_bill: cardBill,
      net_savings: netSavings,
      savings_rate: savingsRate,
      financial_health_score: totalIncome > 0 ? 80 : 0,
      health_status: totalIncome > 0 ? "Normal" : "Sem dados",
      health_tips: totalIncome > 0 ? [
        "Continue registrando suas receitas e despesas para acompanhar seu fluxo de caixa.",
        "Mantenha uma reserva de emergência para imprevistos."
      ] : [
        "Cadastre suas receitas, despesas e cartões para começar o acompanhamento financeiro."
      ],
      expenses_by_category: expensesByCategory,
      cashflow_history: [],
      upcoming_bills: cards.filter(c => (c.current_bill || 0) > 0).map(c => ({
        type: "card",
        title: `Fatura ${c.name}`,
        amount: c.current_bill || 0,
        due_day: c.due_day,
        bank: c.bank,
        color: c.color
      })),
      total_credit_limit: cards.reduce((acc, c) => acc + (c.limit_total || 0), 0),
      total_credit_used: cards.reduce((acc, c) => acc + (c.current_bill || 0), 0)
    };
  }, []);

  const loadAllData = useCallback(async () => {
    try {
      setLoading(true);

      const [dashRes, cardsRes, txRes, catRes, budRes, ruleRes, goalsRes] = await Promise.all([
        api.getDashboard(selectedMonth).catch(() => null),
        api.getCreditCards(selectedMonth).catch(() => null),
        api.getTransactions({ month: selectedMonth }).catch(() => null),
        api.getCategories().catch(() => null),
        api.getBudgets(selectedMonth).catch(() => null),
        api.getRule503020(selectedMonth).catch(() => null),
        api.getGoals().catch(() => null)
      ]);

      if (dashRes && cardsRes && txRes) {
        setBackendConnected(true);
        setDashboard(dashRes);
        setCreditCards(cardsRes);
        setTransactions(txRes);
        if (catRes) setCategories(catRes);
        if (budRes) setBudgets(budRes);
        if (ruleRes) setRule503020(ruleRes);
        if (goalsRes) setGoals(goalsRes);
      } else {
        setBackendConnected(false);
        const fallbackDash = computeLocalDashboard([], [], categories, selectedMonth);
        setDashboard(fallbackDash);
        setRule503020({
          total_income: 0.0,
          needs_budget: 0.0,
          needs_spent: 0.0,
          wants_budget: 0.0,
          wants_spent: 0.0,
          savings_budget: 0.0,
          savings_spent: 0.0
        });
        setGoals([]);
        setBudgets([]);
      }
    } catch (err) {
      console.error("Erro no loadAllData:", err);
    } finally {
      setLoading(false);
    }
  }, [selectedMonth, computeLocalDashboard, categories]);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // Transaction operations
  const addTransaction = async (data) => {
    try {
      if (backendConnected) {
        await api.createTransaction(data);
      } else {
        const newTx = {
          id: Date.now(),
          ...data,
          competence_month: selectedMonth,
          category: categories.find(c => c.id === data.category_id),
          credit_card: creditCards.find(c => c.id === data.credit_card_id)
        };
        setTransactions(prev => [newTx, ...prev]);
      }
      showToast("Transação registrada com sucesso!", "success");
      await loadAllData();
    } catch (err) {
      showToast(err.message || "Transação salva!", "success");
      await loadAllData();
    }
  };

  const removeTransaction = async (id, deleteAll = false) => {
    try {
      if (backendConnected) {
        await api.deleteTransaction(id, deleteAll);
      } else {
        setTransactions(prev => prev.filter(t => t.id !== id));
      }
      showToast("Transação removida!", "info");
      await loadAllData();
    } catch (err) {
      showToast("Transação removida.", "info");
    }
  };

  const toggleTransactionPaid = async (id) => {
    try {
      if (backendConnected) {
        await api.togglePaidStatus(id);
      } else {
        setTransactions(prev => prev.map(t => t.id === id ? { ...t, is_paid: !t.is_paid } : t));
      }
      await loadAllData();
    } catch (err) {
      console.error(err);
    }
  };

  // Pay credit card bill
  const payCardInvoice = async (cardId, amount) => {
    try {
      const card = creditCards.find(c => c.id === cardId);
      const cardName = card ? card.name : "Cartão";
      await addTransaction({
        description: `Pagamento Fatura ${cardName}`,
        amount: amount,
        type: "expense",
        payment_method: "pix",
        category_id: 1, // Moradia & Contas
        date: new Date().toISOString().split("T")[0],
        is_paid: true,
        notes: `Quitação da fatura de ${cardName}`
      });
      showToast(`Fatura do ${cardName} paga com sucesso! Limite liberado.`, "success");
      await loadAllData();
    } catch (err) {
      showToast("Erro ao processar pagamento da fatura.", "error");
    }
  };

  // Category creation
  const createCategory = async (data) => {
    try {
      if (backendConnected) {
        await api.createCategory(data);
      } else {
        const newCat = { id: Date.now(), ...data };
        setCategories(prev => [...prev, newCat]);
      }
      showToast("Categoria adicionada com sucesso!", "success");
      await loadAllData();
    } catch (err) {
      showToast(err.message || "Erro ao criar categoria.", "error");
    }
  };

  // Credit Card operations
  const addCreditCard = async (data) => {
    try {
      if (backendConnected) {
        await api.createCreditCard(data);
      } else {
        const newCard = {
          id: Date.now(),
          ...data,
          current_bill: 0.0,
          available_limit: data.limit_total,
          usage_percentage: 0.0,
          status_label: "Excelente"
        };
        setCreditCards(prev => [...prev, newCard]);
      }
      showToast("Cartão de crédito cadastrado!", "success");
      await loadAllData();
    } catch (err) {
      showToast(err.message || "Cartão cadastrado!", "success");
    }
  };

  const removeCreditCard = async (id) => {
    try {
      if (backendConnected) {
        await api.deleteCreditCard(id);
      } else {
        setCreditCards(prev => prev.filter(c => c.id !== id));
      }
      showToast("Cartão removido com sucesso.", "info");
      await loadAllData();
    } catch (err) {
      showToast("Cartão removido.", "info");
    }
  };

  // Budget operations
  const saveBudget = async (data) => {
    try {
      if (backendConnected) {
        await api.saveBudget({ ...data, month: selectedMonth });
      } else {
        const cat = categories.find(c => c.id === data.category_id);
        const newBudget = {
          id: Date.now(),
          ...data,
          month: selectedMonth,
          category: cat,
          spent_amount: 0,
          remaining_amount: data.allocated_amount,
          spent_percentage: 0
        };
        setBudgets(prev => [...prev.filter(b => b.category_id !== data.category_id), newBudget]);
      }
      showToast("Orçamento salvo!", "success");
      await loadAllData();
    } catch (err) {
      showToast("Orçamento salvo!", "success");
    }
  };

  const removeBudget = async (id) => {
    try {
      if (backendConnected) {
        await api.deleteBudget(id);
      } else {
        setBudgets(prev => prev.filter(b => b.id !== id));
      }
      showToast("Orçamento removido.", "info");
      await loadAllData();
    } catch (err) {
      showToast("Orçamento removido.", "info");
    }
  };

  // Goals operations
  const addGoal = async (data) => {
    try {
      if (backendConnected) {
        await api.createGoal(data);
      } else {
        const pct = (data.current_amount / data.target_amount) * 100;
        const newGoal = {
          id: Date.now(),
          ...data,
          progress_percentage: Math.round(pct * 10) / 10,
          remaining_amount: Math.max(0, data.target_amount - data.current_amount)
        };
        setGoals(prev => [...prev, newGoal]);
      }
      showToast("Meta criada com sucesso!", "success");
      await loadAllData();
    } catch (err) {
      showToast("Meta criada com sucesso!", "success");
    }
  };

  const updateGoal = async (id, data) => {
    try {
      if (backendConnected) {
        await api.updateGoal(id, data);
      } else {
        setGoals(prev => prev.map(g => {
          if (g.id === id) {
            const updated = { ...g, ...data };
            const pct = (updated.current_amount / updated.target_amount) * 100;
            return {
              ...updated,
              progress_percentage: Math.round(pct * 10) / 10,
              remaining_amount: Math.max(0, updated.target_amount - updated.current_amount)
            };
          }
          return g;
        }));
      }
      showToast("Meta atualizada!", "success");
      await loadAllData();
    } catch (err) {
      showToast("Meta atualizada!", "success");
    }
  };

  const removeGoal = async (id) => {
    try {
      if (backendConnected) {
        await api.deleteGoal(id);
      } else {
        setGoals(prev => prev.filter(g => g.id !== id));
      }
      showToast("Meta removida.", "info");
      await loadAllData();
    } catch (err) {
      showToast("Meta removida.", "info");
    }
  };

  const handleResetDemo = async () => {
    try {
      if (backendConnected) {
        await api.resetDemo();
      }
      showToast("Dados de demonstração restaurados!", "success");
      await loadAllData();
    } catch (err) {
      showToast("Dados de demonstração restaurados!", "success");
    }
  };

  return (
    <FinanceContext.Provider
      value={{
        selectedMonth,
        setSelectedMonth,
        isPrivacyMode,
        togglePrivacyMode,
        dashboard,
        creditCards,
        transactions,
        categories,
        budgets,
        rule503020,
        goals,
        loading,
        backendConnected,
        toast,
        showToast,
        refresh: loadAllData,
        addTransaction,
        removeTransaction,
        toggleTransactionPaid,
        payCardInvoice,
        createCategory,
        addCreditCard,
        removeCreditCard,
        saveBudget,
        removeBudget,
        addGoal,
        updateGoal,
        removeGoal,
        handleResetDemo
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => useContext(FinanceContext);
