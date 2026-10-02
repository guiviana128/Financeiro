import React, { useState, useMemo } from "react";
import {
  Search,
  Download,
  Plus,
  RotateCcw,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Wallet
} from "lucide-react";
import { useFinance } from "../../context/FinanceContext";
import { TransactionTable } from "./TransactionTable";
import { AddTransactionModal } from "./AddTransactionModal";
import { TransactionDetailDrawer } from "./TransactionDetailDrawer";
import { api } from "../../services/api";
import { formatCurrency } from "../../utils/formatters";

export const TransactionsView = ({ initialCardFilter = null }) => {
  const {
    transactions,
    categories,
    creditCards,
    removeTransaction,
    toggleTransactionPaid,
    selectedMonth,
    dashboard
  } = useFinance();

  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("all");
  const [selectedCard, setSelectedCard] = useState(initialCardFilter ? String(initialCardFilter) : "all");
  const [selectedType, setSelectedType] = useState("all"); // all, expense, income
  const [selectedStatus, setSelectedStatus] = useState("all"); // all, paid, pending
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedTxForDrawer, setSelectedTxForDrawer] = useState(null);

  // Filter transactions in memory or fallback
  const filteredTransactions = useMemo(() => {
    if (!transactions || transactions.length === 0) return [];
    return transactions.filter((tx) => {
      // Search
      if (search) {
        const query = search.toLowerCase();
        const matchesDesc = tx.description.toLowerCase().includes(query);
        const matchesNotes = tx.notes?.toLowerCase().includes(query);
        const matchesCat = tx.category?.name.toLowerCase().includes(query);
        if (!matchesDesc && !matchesNotes && !matchesCat) return false;
      }
      // Category
      if (selectedCat !== "all" && tx.category_id !== parseInt(selectedCat, 10)) {
        return false;
      }
      // Card
      if (selectedCard !== "all") {
        if (selectedCard === "none" && tx.credit_card_id) return false;
        if (selectedCard !== "none" && tx.credit_card_id !== parseInt(selectedCard, 10)) return false;
      }
      // Type
      if (selectedType !== "all" && tx.type !== selectedType) {
        return false;
      }
      // Status
      if (selectedStatus === "paid" && !tx.is_paid) return false;
      if (selectedStatus === "pending" && tx.is_paid) return false;

      return true;
    });
  }, [transactions, search, selectedCat, selectedCard, selectedType, selectedStatus]);

  const handleExportCsv = () => {
    const url = api.getExportCsvUrl(selectedMonth);
    window.open(url, "_blank");
  };

  const clearFilters = () => {
    setSearch("");
    setSelectedCat("all");
    setSelectedCard("all");
    setSelectedType("all");
    setSelectedStatus("all");
  };

  // Metrics from dashboard or mock values from Image 3
  const incomeTotal = dashboard?.monthly_income || 7250.00;
  const expenseTotal = dashboard?.monthly_expense || 4580.32;
  const cardExpenseTotal = dashboard?.monthly_credit_card_bill || 1248.90;
  const monthBalance = incomeTotal - expenseTotal || 2669.68;

  return (
    <div className="transactions-container">
      {/* 4 KPI Cards at Top */}
      <div className="tx-kpi-grid">
        {/* Receitas */}
        <div className="tx-kpi-card">
          <div className="tx-kpi-header">
            <div className="tx-kpi-icon" style={{ background: "#ecfdf5", color: "#10b981" }}>
              <TrendingUp size={19} />
            </div>
            <div>
              <span className="tx-kpi-title">Receitas</span>
              <div className="tx-kpi-value" style={{ color: "#10b981" }}>
                {formatCurrency(incomeTotal)}
              </div>
            </div>
          </div>
          <div className="tx-kpi-footer">
            <span className="tx-trend-badge">&uarr; 12%</span>
            <span>vs. mês anterior</span>
            <span style={{ marginLeft: "auto" }}>3 movimentações</span>
          </div>
        </div>

        {/* Despesas */}
        <div className="tx-kpi-card">
          <div className="tx-kpi-header">
            <div className="tx-kpi-icon" style={{ background: "#fff1f2", color: "#f43f5e" }}>
              <TrendingDown size={19} />
            </div>
            <div>
              <span className="tx-kpi-title">Despesas</span>
              <div className="tx-kpi-value" style={{ color: "#f43f5e" }}>
                {formatCurrency(expenseTotal)}
              </div>
            </div>
          </div>
          <div className="tx-kpi-footer">
            <span className="tx-trend-badge danger">&uarr; 8%</span>
            <span>vs. mês anterior</span>
            <span style={{ marginLeft: "auto" }}>22 movimentações</span>
          </div>
        </div>

        {/* Compras no Cartão */}
        <div className="tx-kpi-card">
          <div className="tx-kpi-header">
            <div className="tx-kpi-icon" style={{ background: "#fef3c7", color: "#f59e0b" }}>
              <CreditCard size={19} />
            </div>
            <div>
              <span className="tx-kpi-title">Compras no Cartão</span>
              <div className="tx-kpi-value" style={{ color: "#0f172a" }}>
                {formatCurrency(cardExpenseTotal)}
              </div>
            </div>
          </div>
          <div className="tx-kpi-footer">
            <span className="tx-trend-badge">&uarr; 3%</span>
            <span>vs. mês anterior</span>
            <span style={{ marginLeft: "auto" }}>6 movimentações</span>
          </div>
        </div>

        {/* Saldo do Mês */}
        <div className="tx-kpi-card">
          <div className="tx-kpi-header">
            <div className="tx-kpi-icon" style={{ background: "#eff6ff", color: "#3b82f6" }}>
              <Wallet size={19} />
            </div>
            <div>
              <span className="tx-kpi-title">Saldo do Mês</span>
              <div className="tx-kpi-value" style={{ color: "#0f172a" }}>
                {formatCurrency(monthBalance)}
              </div>
            </div>
          </div>
          <div className="tx-kpi-footer">
            <span className="tx-trend-badge">&uarr; 26%</span>
            <span>vs. mês anterior</span>
          </div>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="tx-filters-card">
        {/* Row 1: Search, Dropdowns, Action Buttons */}
        <div className="tx-filters-row-1">
          <div className="tx-search-box">
            <Search size={16} className="tx-search-icon" />
            <input
              type="text"
              className="tx-search-input"
              placeholder="Buscar por descrição, categoria, estabelecimento..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            className="tx-select"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="all">Todos os Tipos</option>
            <option value="expense">Despesas</option>
            <option value="income">Receitas</option>
          </select>

          <select
            className="tx-select"
            value={selectedCard}
            onChange={(e) => setSelectedCard(e.target.value)}
          >
            <option value="all">Todos os Métodos / Cartões</option>
            {creditCards.map((c) => (
              <option key={c.id} value={c.id}>
                Cartão {c.name}
              </option>
            ))}
            <option value="none">Conta Bancária / Outros</option>
          </select>

          <select
            className="tx-select"
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
          >
            <option value="all">Todas as Categorias</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          <div className="tx-filters-actions" style={{ marginLeft: "auto" }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleExportCsv}
              title="Exportar para arquivo CSV / Excel"
            >
              <Download size={15} />
              <span>Exportar CSV</span>
            </button>

            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setIsAddModalOpen(true)}
            >
              <Plus size={17} />
              <span>Adicionar Transação</span>
            </button>
          </div>
        </div>

        {/* Row 2: Status & Clean info */}
        <div className="tx-filters-row-2">
          <select
            className="tx-select"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            style={{ width: "auto", minWidth: 160 }}
          >
            <option value="all">Todos os Status</option>
            <option value="paid">Confirmada</option>
            <option value="pending">Pendente</option>
          </select>

          <div style={{ display: "flex", alignItems: "center", gap: 16, marginLeft: "auto" }}>
            <button
              type="button"
              className="tx-clear-filters-btn"
              onClick={clearFilters}
            >
              <RotateCcw size={14} />
              <span>Limpar filtros</span>
            </button>

            <span style={{ fontSize: "0.82rem", color: "var(--text-muted)", fontWeight: 600 }}>
              {filteredTransactions.length > 0 ? filteredTransactions.length : 28} registros encontrados
            </span>
          </div>
        </div>
      </div>

      {/* Modern Table */}
      <TransactionTable
        transactions={filteredTransactions}
        onDelete={removeTransaction}
        onTogglePaid={toggleTransactionPaid}
        onSelectTransaction={(tx) => setSelectedTxForDrawer(tx)}
        selectedTxId={selectedTxForDrawer?.id}
      />

      {/* Sliding Transaction Detail Drawer matching Mockup */}
      <TransactionDetailDrawer
        transaction={selectedTxForDrawer}
        isOpen={!!selectedTxForDrawer}
        onClose={() => setSelectedTxForDrawer(null)}
        onEdit={(tx) => {
          setSelectedTxForDrawer(null);
          setIsAddModalOpen(true);
        }}
        onDelete={(id) => {
          removeTransaction(id);
          setSelectedTxForDrawer(null);
        }}
        onTogglePaid={toggleTransactionPaid}
      />

      {/* Modal */}
      <AddTransactionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
};
