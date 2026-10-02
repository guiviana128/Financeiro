import React from "react";
import {
  X,
  Edit2,
  Trash2,
  Calendar,
  Tag,
  CreditCard,
  Building,
  CheckCircle2,
  Clock,
  FileText,
  DollarSign,
  TrendingDown,
  TrendingUp,
  ShoppingCart,
  Tv,
  Repeat,
  Utensils,
  Car,
  ShoppingBag,
  Laptop,
  HeartPulse
} from "lucide-react";
import { formatCurrency, formatDate } from "../../utils/formatters";

export const TransactionDetailDrawer = ({
  transaction,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onTogglePaid
}) => {
  if (!isOpen || !transaction) return null;

  const isIncome = transaction.type === "income";
  const isExpense = transaction.type === "expense";
  const formattedAmount = formatCurrency(Math.abs(transaction.amount || 0));

  const getCategoryIcon = (name) => {
    const n = (name || "").toLowerCase();
    if (n.includes("aliment") || n.includes("restaur") || n.includes("supermerc")) return ShoppingCart;
    if (n.includes("assinat") || n.includes("stream")) return Tv;
    if (n.includes("transf")) return Repeat;
    if (n.includes("renda") || n.includes("salár")) return DollarSign;
    if (n.includes("transp") || n.includes("uber") || n.includes("combust")) return Car;
    if (n.includes("saúde") || n.includes("farm")) return HeartPulse;
    if (n.includes("compra") || n.includes("vestu")) return ShoppingBag;
    if (n.includes("trabalh") || n.includes("freel")) return Laptop;
    return Tag;
  };

  const IconComp = transaction.icon || getCategoryIcon(transaction.categoryName || transaction.category?.name);
  const categoryName = transaction.categoryName || transaction.category?.name || "Sem categoria";
  const methodLabel = transaction.methodLabel || (transaction.credit_card ? `Cartão ${transaction.credit_card.name}` : "Conta Bancária");
  const accountName = transaction.account || (transaction.credit_card ? transaction.credit_card.bank : "Conta Corrente");
  const isPaid = transaction.status === "Confirmada" || transaction.is_paid;
  const description = transaction.description || transaction.desc || "Sem descrição";
  const notes = transaction.notes || "Compra de alimentos e itens de consumo diário.";
  const dateStr = transaction.date ? formatDate(transaction.date) : "28/09/2026";
  const createdAtStr = transaction.created_at ? formatDate(transaction.created_at) : `${dateStr} às 14:32`;

  return (
    <>
      <div className="tx-drawer-backdrop" onClick={onClose} />
      <aside className="tx-detail-drawer" aria-label="Detalhes da Transação">
        {/* Drawer Header */}
        <div className="tx-drawer-header">
          <h3 className="tx-drawer-title">Detalhes da Transação</h3>
          <button
            type="button"
            className="tx-drawer-close-btn"
            onClick={onClose}
            aria-label="Fechar painel"
          >
            <X size={18} />
          </button>
        </div>

        {/* Hero Item Box */}
        <div className="tx-drawer-hero">
          <div className="tx-drawer-icon-box" style={{ background: isIncome ? "#ecfdf5" : "#eff6ff", color: isIncome ? "#10b981" : "#3b82f6" }}>
            <IconComp size={24} />
          </div>
          <h4 className="tx-drawer-item-title">{description}</h4>
          <div className={`tx-drawer-amount ${isIncome ? "green" : "red"}`}>
            {isIncome ? `+ ${formattedAmount}` : `- ${formattedAmount}`}
          </div>
          <span className={`tx-drawer-type-badge ${isIncome ? "income" : "expense"}`}>
            {isIncome ? "Receita" : "Despesa"}
          </span>
        </div>

        {/* Details List */}
        <div className="tx-drawer-details-list">
          {/* Data */}
          <div className="tx-detail-row">
            <div className="tx-detail-label">
              <Calendar size={16} />
              <span>Data</span>
            </div>
            <span className="tx-detail-val">{dateStr}</span>
          </div>

          {/* Categoria */}
          <div className="tx-detail-row">
            <div className="tx-detail-label">
              <Tag size={16} />
              <span>Categoria</span>
            </div>
            <span className="tx-category-badge-pill" style={{ background: transaction.categoryBg || "#fef3c7", color: transaction.categoryColor || "#d97706" }}>
              {categoryName}
            </span>
          </div>

          {/* Método / Cartão */}
          <div className="tx-detail-row">
            <div className="tx-detail-label">
              <CreditCard size={16} />
              <span>Método / Cartão</span>
            </div>
            <span className="tx-detail-val">{methodLabel}</span>
          </div>

          {/* Conta */}
          <div className="tx-detail-row">
            <div className="tx-detail-label">
              <Building size={16} />
              <span>Conta</span>
            </div>
            <span className="tx-detail-val">{accountName}</span>
          </div>

          {/* Status */}
          <div className="tx-detail-row">
            <div className="tx-detail-label">
              <CheckCircle2 size={16} />
              <span>Status</span>
            </div>
            <span className={`tx-status-pill ${isPaid ? "paid" : "pending"}`} onClick={() => onTogglePaid && onTogglePaid(transaction.id)}>
              {isPaid ? "✓ Confirmada" : "⏳ Pendente"}
            </span>
          </div>

          {/* Descrição / Notas */}
          <div className="tx-detail-row full-width">
            <div className="tx-detail-label">
              <FileText size={16} />
              <span>Descrição</span>
            </div>
            <p className="tx-detail-notes">
              {transaction.notes || `Movimentação financeira referente a ${description}.`}
            </p>
          </div>

          {/* Valor */}
          <div className="tx-detail-row">
            <div className="tx-detail-label">
              <DollarSign size={16} />
              <span>Valor</span>
            </div>
            <strong className={`tx-detail-val ${isIncome ? "text-green" : "text-red"}`}>
              {isIncome ? `+ ${formattedAmount}` : `- ${formattedAmount}`}
            </strong>
          </div>

          {/* Criado em */}
          <div className="tx-detail-row">
            <div className="tx-detail-label">
              <Clock size={16} />
              <span>Criado em</span>
            </div>
            <span className="tx-detail-val text-muted">{createdAtStr}</span>
          </div>
        </div>

        {/* Drawer Footer Actions */}
        <div className="tx-drawer-footer">
          <button
            type="button"
            className="btn btn-primary"
            style={{ width: "100%", justifyContent: "center" }}
            onClick={() => onEdit && onEdit(transaction)}
          >
            <Edit2 size={16} />
            <span>Editar Transação</span>
          </button>
          
          {onDelete && (
            <button
              type="button"
              className="btn btn-outline-danger"
              style={{ width: "100%", justifyContent: "center", marginTop: "8px" }}
              onClick={() => {
                if (window.confirm("Deseja realmente excluir esta transação?")) {
                  onDelete(transaction.id);
                  onClose();
                }
              }}
            >
              <Trash2 size={16} />
              <span>Excluir Transação</span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
};
