import React from "react";
import { formatCurrency } from "../../utils/formatters";
import { useFinance } from "../../context/FinanceContext";
import { ShoppingBag, Trash2, Cpu, Zap } from "lucide-react";

export const CreditCardItem = ({ card, onDelete, onSelect }) => {
  const { isPrivacyMode } = useFinance();

  const totalLimit = card.limit_total || 4000.00;
  const currentBill = card.current_bill || 0.00;
  const availableLimit = card.available_limit || Math.max(0, totalLimit - currentBill);
  const usagePct = totalLimit > 0 ? ((currentBill / totalLimit) * 100).toFixed(1) : "0.0";
  const lastDigits = card.last_digits || "1234";

  // Card color gradients based on card bank
  const getCardGradient = () => {
    const name = (card.name || "").toLowerCase();
    if (name.includes("nubank")) {
      return "linear-gradient(135deg, #4c1d95 0%, #6d28d9 50%, #7c3aed 100%)";
    }
    if (name.includes("itaú") || name.includes("itau")) {
      return "linear-gradient(135deg, #ea580c 0%, #f97316 100%)";
    }
    if (name.includes("santander")) {
      return "linear-gradient(135deg, #b91c1c 0%, #dc2626 100%)";
    }
    if (name.includes("inter")) {
      return "linear-gradient(135deg, #ea580c 0%, #f59e0b 100%)";
    }
    if (name.includes("c6")) {
      return "linear-gradient(135deg, #18181b 0%, #27272a 100%)";
    }
    return card.color || "linear-gradient(135deg, #0f172a 0%, #334155 100%)";
  };

  return (
    <div className="card-item-container">
      {/* Physical Realistic Credit Card View */}
      <div className="credit-card-visual" style={{ background: getCardGradient() }}>
        {/* Top: Bank Name & Mastercard Logo */}
        <div className="card-visual-top">
          <span className="card-visual-bank">{card.name?.split(" ")[0] || "Nubank"}</span>
          <div className="mastercard-logo">
            <div className="mc-circle-red" />
            <div className="mc-circle-orange" />
          </div>
        </div>

        {/* Middle: Gold Chip & Masked Number */}
        <div>
          <div className="card-visual-chip-row">
            <div className="gold-chip" />
          </div>
          <div className="card-visual-number">
            •••• •••• •••• {lastDigits}
          </div>
        </div>

        {/* Bottom: Card Name & Due Date */}
        <div className="card-visual-bottom">
          <div className="card-visual-field">
            <span className="card-visual-field-label">Nome do Cartão</span>
            <span className="card-visual-field-value">{card.name || "Nubank Gold"}</span>
          </div>

          <div className="card-visual-field" style={{ textAlign: "right" }}>
            <span className="card-visual-field-label">Vencimento da Fatura</span>
            <span className="card-visual-field-value">Dia {card.due_day || 2}/{new Date().getMonth() + 1}</span>
          </div>
        </div>
      </div>

      {/* Details Under Card */}
      <div className="card-details-box">
        {/* Automation Pill */}
        <div className="card-automation-pill">
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Zap size={13} />
            <span>Automação: OpenFinance</span>
          </div>
          <span>•••• 8108-1</span>
        </div>

        {/* Metrics Row */}
        <div className="card-metrics-row">
          <div className="card-metric-col">
            <span className="card-metric-label">FATURA ATUAL</span>
            <span className="card-metric-val" style={{ color: "#f43f5e" }}>
              {formatCurrency(currentBill, isPrivacyMode)}
            </span>
            <span className="card-metric-sub">Uso: {usagePct}%</span>
          </div>

          <div className="card-metric-col" style={{ textAlign: "right" }}>
            <span className="card-metric-label">LIMITE DISPONÍVEL</span>
            <span className="card-metric-val" style={{ color: "#10b981" }}>
              {formatCurrency(availableLimit, isPrivacyMode)}
            </span>
            <span className="card-metric-sub">Limite Total: {formatCurrency(totalLimit, isPrivacyMode)}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="kpi-progress-track">
          <div
            className="kpi-progress-fill"
            style={{
              width: `${Math.min(100, Math.max(0, usagePct))}%`,
              background: "#10b981"
            }}
          />
        </div>

        {/* Actions Row */}
        <div className="card-actions-row">
          <button
            type="button"
            className="btn-card-action view"
            onClick={() => onSelect && onSelect(card)}
          >
            <ShoppingBag size={14} />
            <span>Ver Compras &gt;</span>
          </button>

          <button
            type="button"
            className="btn-card-action delete"
            onClick={() => onDelete && onDelete(card)}
            title="Excluir Cartão"
          >
            <Trash2 size={14} />
            <span>Excluir</span>
          </button>
        </div>
      </div>
    </div>
  );
};
