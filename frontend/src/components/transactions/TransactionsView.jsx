import React, { useState, useMemo } from "react";
import { Search, Download, Plus, Filter } from "lucide-react";
import { useFinance } from "../../context/FinanceContext";
import { TransactionTable } from "./TransactionTable";
import { AddTransactionModal } from "./AddTransactionModal";
import { api } from "../../services/api";

export const TransactionsView = ({ initialCardFilter = null }) => {
  const {
    transactions,
    categories,
    creditCards,
    removeTransaction,
    toggleTransactionPaid,
    selectedMonth
  } = useFinance();

  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("all");
  const [selectedCard, setSelectedCard] = useState(initialCardFilter ? String(initialCardFilter) : "all");
  const [selectedType, setSelectedType] = useState("all"); // all, expense, income
  const [selectedStatus, setSelectedStatus] = useState("all"); // all, paid, pending
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Filter transactions in memory or by parameters
  const filteredTransactions = useMemo(() => {
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

  return (
    <div className="transactions-container">
      {/* Header & Main Actions */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700 }}>Histórico de Movimentações</h2>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
            Listagem detalhada de gastos, receitas e compras parceladas no cartão.
          </p>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn btn-secondary" onClick={handleExportCsv} title="Exportar para arquivo CSV / Excel">
            <Download size={16} />
            <span>Exportar CSV</span>
          </button>
          <button className="btn btn-primary" onClick={() => setIsAddModalOpen(true)}>
            <Plus size={18} />
            <span>Adicionar Transação</span>
          </button>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="filters-bar">
        <div className="filters-left">
          {/* Search */}
          <div className="search-input-wrapper">
            <Search size={16} />
            <input
              type="text"
              className="search-input"
              placeholder="Buscar por descrição, categoria..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Type Filter */}
          <select
            className="filter-select"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="all">Todos os Tipos</option>
            <option value="expense">Despesas (Saídas)</option>
            <option value="income">Receitas (Entradas)</option>
          </select>

          {/* Card Filter */}
          <select
            className="filter-select"
            value={selectedCard}
            onChange={(e) => setSelectedCard(e.target.value)}
          >
            <option value="all">Todos os Métodos / Cartões</option>
            {creditCards.map((c) => (
              <option key={c.id} value={c.id}>
                Cartão {c.name}
              </option>
            ))}
            <option value="none">Sem Cartão (PIX/Dinheiro/Boleto)</option>
          </select>

          {/* Category Filter */}
          <select
            className="filter-select"
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

          {/* Status Filter */}
          <select
            className="filter-select"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="all">Todos os Status</option>
            <option value="paid">Pagos / Recebidos</option>
            <option value="pending">Pendentes</option>
          </select>
        </div>

        <div className="filters-right">
          <span className="badge badge-neutral">
            {filteredTransactions.length} registros encontrados
          </span>
        </div>
      </div>

      {/* Table */}
      <TransactionTable
        transactions={filteredTransactions}
        onDelete={removeTransaction}
        onTogglePaid={toggleTransactionPaid}
      />

      <AddTransactionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
};
