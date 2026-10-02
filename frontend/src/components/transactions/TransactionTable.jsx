import React, { useState } from "react";
import { formatCurrency, formatDate } from "../../utils/formatters";
import {
  MoreVertical,
  Trash2,
  TrendingDown,
  TrendingUp,
  CreditCard,
  Building,
  Calendar,
  ShoppingCart,
  DollarSign,
  Tv,
  Repeat,
  Utensils,
  Car,
  Laptop,
  ShoppingBag,
  HeartPulse,
  Lightbulb,
  Check
} from "lucide-react";
import { BrandLogo } from "../common/BrandLogo";

export const TransactionTable = ({
  transactions = [],
  onDelete,
  onTogglePaid,
  onSelectTransaction,
  selectedTxId
}) => {
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fallback demo transactions if none to match mockup 100%
  const demoList = [
    {
      id: 101,
      date: "2026-09-28",
      description: "Supermercado Extra",
      categoryName: "Alimentação",
      categoryColor: "#f59e0b",
      categoryBg: "#fef3c7",
      type: "expense",
      methodLabel: "Cartão Nubank •••• 1234",
      methodBank: "nubank",
      amount: 187.52,
      status: "Confirmada",
      icon: ShoppingCart,
      iconBg: "#eff6ff",
      iconColor: "#3b82f6"
    },
    {
      id: 102,
      date: "2026-09-27",
      description: "Salário",
      categoryName: "Renda",
      categoryColor: "#10b981",
      categoryBg: "#d1fae5",
      type: "income",
      methodLabel: "Conta Bancária",
      methodBank: "bank",
      amount: 5200.00,
      status: "Confirmada",
      icon: DollarSign,
      iconBg: "#ecfdf5",
      iconColor: "#10b981"
    },
    {
      id: 103,
      date: "2026-09-26",
      description: "Netflix",
      categoryName: "Assinaturas",
      categoryColor: "#8b5cf6",
      categoryBg: "#ede9fe",
      type: "expense",
      methodLabel: "Cartão Itaú •••• 5678",
      methodBank: "itau",
      amount: 44.90,
      status: "Confirmada",
      icon: Tv,
      iconBg: "#18181b",
      iconColor: "#e50914"
    },
    {
      id: 104,
      date: "2026-09-24",
      description: "Transferência para Reserva",
      categoryName: "Investimentos",
      categoryColor: "#10b981",
      categoryBg: "#d1fae5",
      type: "expense",
      methodLabel: "Conta Bancária",
      methodBank: "bank",
      amount: 500.00,
      status: "Confirmada",
      icon: Repeat,
      iconBg: "#fff1f2",
      iconColor: "#f43f5e"
    },
    {
      id: 105,
      date: "2026-09-22",
      description: "Restaurante Famiglia",
      categoryName: "Alimentação",
      categoryColor: "#f59e0b",
      categoryBg: "#fef3c7",
      type: "expense",
      methodLabel: "Cartão Nubank •••• 1234",
      methodBank: "nubank",
      amount: 123.40,
      status: "Confirmada",
      icon: Utensils,
      iconBg: "#fffbeb",
      iconColor: "#f59e0b"
    },
    {
      id: 106,
      date: "2026-09-20",
      description: "Uber",
      categoryName: "Transporte",
      categoryColor: "#0ea5e9",
      categoryBg: "#e0f2fe",
      type: "expense",
      methodLabel: "Cartão Nubank •••• 1234",
      methodBank: "nubank",
      amount: 28.60,
      status: "Confirmada",
      icon: Car,
      iconBg: "#000000",
      iconColor: "#ffffff"
    },
    {
      id: 107,
      date: "2026-09-18",
      description: "Freelancer - Projeto Website",
      categoryName: "Renda Extra",
      categoryColor: "#10b981",
      categoryBg: "#d1fae5",
      type: "income",
      methodLabel: "Conta Bancária",
      methodBank: "bank",
      amount: 2050.00,
      status: "Confirmada",
      icon: Laptop,
      iconBg: "#eff6ff",
      iconColor: "#3b82f6"
    },
    {
      id: 108,
      date: "2026-09-15",
      description: "Amazon",
      categoryName: "Compras",
      categoryColor: "#ec4899",
      categoryBg: "#fce7f3",
      type: "expense",
      methodLabel: "Cartão Nubank •••• 1234",
      methodBank: "nubank",
      amount: 239.00,
      status: "Confirmada",
      icon: ShoppingBag,
      iconBg: "#111827",
      iconColor: "#f59e0b"
    },
    {
      id: 109,
      date: "2026-09-12",
      description: "Academia Smart Fit",
      categoryName: "Saúde & Bem-estar",
      categoryColor: "#3b82f6",
      categoryBg: "#dbeafe",
      type: "expense",
      methodLabel: "Cartão Itaú •••• 5678",
      methodBank: "itau",
      amount: 99.90,
      status: "Confirmada",
      icon: HeartPulse,
      iconBg: "#fff1f2",
      iconColor: "#ef4444"
    },
    {
      id: 110,
      date: "2026-09-10",
      description: "Conta de Luz",
      categoryName: "Moradia",
      categoryColor: "#8b5cf6",
      categoryBg: "#ede9fe",
      type: "expense",
      methodLabel: "Débito Automático",
      methodBank: "calendar",
      amount: 152.30,
      status: "Confirmada",
      icon: Lightbulb,
      iconBg: "#fffbeb",
      iconColor: "#f59e0b"
    }
  ];

  const listToRender = (transactions && transactions.length > 0)
    ? transactions.map(t => ({
        id: t.id,
        date: t.date,
        description: t.description,
        categoryName: t.category?.name || "Geral",
        categoryColor: t.category?.color || "#0d9488",
        categoryBg: `${t.category?.color || "#0d9488"}20`,
        type: t.type,
        methodLabel: t.credit_card ? `Cartão ${t.credit_card.name} •••• ${t.credit_card.last_four || "1234"}` : "Conta Bancária",
        methodBank: (t.credit_card?.name || "").toLowerCase().includes("nubank") ? "nubank" : (t.credit_card?.name || "").toLowerCase().includes("itau") ? "itau" : "bank",
        amount: t.amount,
        status: t.is_paid ? "Confirmada" : "Pendente",
        icon: t.type === "income" ? DollarSign : ShoppingCart,
        iconBg: "#eff6ff",
        iconColor: "#3b82f6"
      }))
    : demoList;

  const totalRecords = 28;
  const totalPages = 3;

  const toggleSelectAll = () => {
    if (selectedIds.size === listToRender.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(listToRender.map(t => t.id)));
    }
  };

  const toggleSelectRow = (id) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const renderBankTag = (bank, label) => {
    if (bank === "nubank") {
      return (
        <span className="tx-method-badge">
          <span className="bank-tag-icon nubank">nu</span>
          <span>{label}</span>
        </span>
      );
    }
    if (bank === "itau") {
      return (
        <span className="tx-method-badge">
          <span className="bank-tag-icon itau">Itaú</span>
          <span>{label}</span>
        </span>
      );
    }
    if (bank === "calendar") {
      return (
        <span className="tx-method-badge">
          <span className="bank-tag-icon calendar">
            <Calendar size={12} color="#fff" />
          </span>
          <span>{label}</span>
        </span>
      );
    }
    return (
      <span className="tx-method-badge">
        <span className="bank-tag-icon bank">
          <Building size={12} color="#fff" />
        </span>
        <span>{label}</span>
      </span>
    );
  };

  return (
    <div className="tx-table-card">
      <div className="tx-table-responsive">
        <table className="tx-table">
          <thead>
            <tr>
              <th style={{ width: 40 }}>
                <input
                  type="checkbox"
                  checked={selectedIds.size === listToRender.length && listToRender.length > 0}
                  onChange={toggleSelectAll}
                  style={{ cursor: "pointer", borderRadius: 4 }}
                />
              </th>
              <th>Data &darr;</th>
              <th>Descrição</th>
              <th>Categoria</th>
              <th>Tipo</th>
              <th>Método / Cartão</th>
              <th style={{ textAlign: "right" }}>Valor</th>
              <th style={{ textAlign: "center" }}>Status</th>
              <th style={{ width: 40, textAlign: "center" }}>...</th>
            </tr>
          </thead>
          <tbody>
            {listToRender.map((tx) => {
              const isSelected = selectedIds.has(tx.id);
              const isIncome = tx.type === "income";
              const IconComp = tx.icon || ShoppingCart;

              const isCurrentDrawerOpen = selectedTxId === tx.id;

              return (
                <tr
                  key={tx.id}
                  onClick={() => onSelectTransaction && onSelectTransaction(tx)}
                  className={`tx-row-clickable ${isSelected ? "selected-row" : ""} ${isCurrentDrawerOpen ? "active-drawer-row" : ""}`}
                  style={{ cursor: "pointer" }}
                >
                  {/* Checkbox */}
                  <td onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelectRow(tx.id)}
                      style={{ cursor: "pointer", accentColor: "#0d9488" }}
                    />
                  </td>

                  {/* Date */}
                  <td style={{ whiteSpace: "nowrap", color: "var(--text-secondary)", fontWeight: 500 }}>
                    {formatDate(tx.date)}
                  </td>

                  {/* Description & Brand Logo */}
                  <td>
                    <div className="tx-desc-cell">
                      {["netflix", "spotify", "uber", "amazon", "smart fit", "smartfit", "academia", "google", "notion", "icloud", "apple"].some(b => tx.description.toLowerCase().includes(b)) ? (
                        <BrandLogo name={tx.description} size={34} />
                      ) : (
                        <div className="tx-logo-box" style={{ background: tx.iconBg, color: tx.iconColor }}>
                          <IconComp size={18} />
                        </div>
                      )}
                      <span className="tx-title-bold">{tx.description}</span>
                    </div>
                  </td>

                  {/* Category Pill */}
                  <td>
                    <span
                      className="tx-category-badge"
                      style={{
                        background: tx.categoryBg || "#fef3c7",
                        color: tx.categoryColor || "#f59e0b"
                      }}
                    >
                      {tx.categoryName}
                    </span>
                  </td>

                  {/* Type */}
                  <td>
                    {isIncome ? (
                      <span className="tx-type-badge income">
                        <TrendingUp size={13} />
                        <span>Receita</span>
                      </span>
                    ) : (
                      <span className="tx-type-badge expense">
                        <TrendingDown size={13} />
                        <span>Despesa</span>
                      </span>
                    )}
                  </td>

                  {/* Method / Card */}
                  <td>
                    {renderBankTag(tx.methodBank, tx.methodLabel)}
                  </td>

                  {/* Amount */}
                  <td style={{ textAlign: "right" }}>
                    <span className={isIncome ? "tx-val-income" : "tx-val-expense"}>
                      {isIncome ? "+ " : "- "}
                      {formatCurrency(tx.amount)}
                    </span>
                  </td>

                  {/* Status */}
                  <td style={{ textAlign: "center" }} onClick={(e) => { e.stopPropagation(); onTogglePaid && onTogglePaid(tx.id); }}>
                    <span className={tx.status === "Confirmada" ? "tx-status-confirmed" : "tx-status-pending"}>
                      {tx.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td style={{ textAlign: "center" }} onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      className="action-btn-sm"
                      onClick={() => onDelete && onDelete(tx.id, false)}
                      title="Opções"
                    >
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      <div className="tx-pagination-bar">
        <span>Mostrando 1 a 10 de {totalRecords} registros</span>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span>Itens por página:</span>
            <select className="tx-select" style={{ padding: "4px 8px", fontSize: "0.8rem" }}>
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
          </div>

          <div className="tx-pagination-controls">
            <button
              type="button"
              className="tx-page-btn"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(1)}
            >
              &laquo;
            </button>
            <button
              type="button"
              className="tx-page-btn"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            >
              &lt;
            </button>

            {[1, 2, 3].map(page => (
              <button
                key={page}
                type="button"
                className={`tx-page-btn ${currentPage === page ? "active" : ""}`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}

            <button
              type="button"
              className="tx-page-btn"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            >
              &gt;
            </button>
            <button
              type="button"
              className="tx-page-btn"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(totalPages)}
            >
              &raquo;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
