import React, { useState } from "react";
import { Trash2, Calendar, ShieldCheck, Wifi, RotateCw, ArrowRight, Zap, Smartphone, Link2, Lock } from "lucide-react";
import { formatCurrency, maskCPF } from "../../utils/formatters";

export const CreditCardItem = ({ card, onDelete, onSelect, isSelected }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const getProgressClass = (pct) => {
    if (pct > 80) return "fill-danger";
    if (pct > 50) return "fill-warning";
    return "fill-safe";
  };

  const gradientStyle = {
    background: `linear-gradient(135deg, ${card.color || "#6366f1"} 0%, ${card.color_end || "#1e1b4b"} 100%)`
  };

  const getAutomationIcon = (type) => {
    switch (type) {
      case "push_notification":
        return <Smartphone size={12} />;
      case "bank_webhook":
        return <Link2 size={12} />;
      default:
        return <Zap size={12} />;
    }
  };

  const getAutomationLabel = (type) => {
    switch (type) {
      case "push_notification":
        return "Push Celular";
      case "bank_webhook":
        return "Webhook API";
      case "manual":
        return "Manual";
      default:
        return "Open Finance";
    }
  };

  return (
    <div className="virtual-card-wrapper">
      {/* 3D Flippable Virtual Card */}
      <div
        className={`virtual-card-3d-container ${isFlipped ? "is-flipped" : ""}`}
        onClick={() => setIsFlipped(!isFlipped)}
        title="Clique no cartão para girar e ver o verso"
      >
        {/* Card Front Face */}
        <div className="virtual-card-face" style={gradientStyle}>
          <div className="card-shimmer"></div>

          <div className="card-top">
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <span className="card-bank-name">{card.bank || card.name}</span>
              {card.is_automated && card.holder_cpf && (
                <span style={{ fontSize: "0.62rem", opacity: 0.85, display: "flex", alignItems: "center", gap: 4 }}>
                  <Lock size={10} />
                  <span>CPF: {maskCPF(card.holder_cpf)}</span>
                </span>
              )}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span className="card-brand-logo">{card.brand}</span>
              <RotateCw size={14} style={{ opacity: 0.6 }} />
            </div>
          </div>

          <div className="card-middle">
            <div className="card-chip"></div>
            <Wifi size={20} className="card-contactless" />
          </div>

          <div className="card-number">
            •••• •••• •••• {card.last_four || "0000"}
          </div>

          <div className="card-bottom">
            <div className="card-info-group">
              <span className="card-info-label">Nome do Cartão</span>
              <span className="card-info-val">{card.name}</span>
            </div>

            <div className="card-info-group" style={{ textAlign: "right" }}>
              <span className="card-info-label">Fechamento / Venc.</span>
              <span className="card-info-val">Dia {card.closing_day} / {card.due_day}</span>
            </div>
          </div>
        </div>

        {/* Card Back Face */}
        <div className="virtual-card-face virtual-card-back" style={gradientStyle}>
          <div className="card-mag-stripe"></div>

          <div>
            <div style={{ fontSize: "0.65rem", padding: "0 24px 4px 24px", opacity: 0.8, textTransform: "uppercase" }}>
              Código de Segurança (CVV)
            </div>
            <div className="card-cvv-box">
              842
            </div>
          </div>

          <div style={{ padding: "0 24px", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.75rem", opacity: 0.8 }}>
            <span>Uso Internacional Habilitado</span>
            <RotateCw size={14} />
          </div>
        </div>
      </div>

      {/* Card Stats & Limit Details */}
      <div className="card-stats-panel">
        {/* Automation Status Pill */}
        {card.is_automated ? (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "4px 10px",
              borderRadius: "var(--radius-sm)",
              background: "rgba(99, 102, 241, 0.12)",
              border: "1px solid rgba(99, 102, 241, 0.25)",
              fontSize: "0.72rem",
              color: "var(--accent-primary)",
              fontWeight: 600,
              marginBottom: 4
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              {getAutomationIcon(card.automation_type)}
              <span>Automação: <strong>{getAutomationLabel(card.automation_type)}</strong></span>
            </div>
            <span>{card.holder_cpf ? maskCPF(card.holder_cpf) : "Ativo"}</span>
          </div>
        ) : null}

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 600 }}>
              Fatura Atual
            </div>
            <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--color-expense)" }}>
              {formatCurrency(card.current_bill || 0)}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 600 }}>
              Limite Disponível
            </div>
            <div style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--color-income)" }}>
              {formatCurrency(card.available_limit || 0)}
            </div>
          </div>
        </div>

        {/* Limit Bar */}
        <div className="limit-bar-wrapper">
          <div className="limit-labels">
            <span>Uso: {card.usage_percentage || 0}%</span>
            <span>Limite Total: {formatCurrency(card.limit_total || 0)}</span>
          </div>
          <div className="progress-track">
            <div
              className={`progress-fill ${getProgressClass(card.usage_percentage || 0)}`}
              style={{ width: `${Math.min(100, card.usage_percentage || 0)}%` }}
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 10, borderTop: "1px solid var(--border-color)", gap: 10 }}>
          <button
            className="btn btn-secondary"
            style={{ padding: "6px 14px", fontSize: "0.8rem", flex: 1, justifyContent: "center" }}
            onClick={() => onSelect && onSelect(card)}
          >
            <span>Ver Compras</span>
            <ArrowRight size={14} />
          </button>

          <button
            className="btn btn-danger"
            style={{ padding: "6px 12px", fontSize: "0.8rem", display: "inline-flex", alignItems: "center", gap: 6 }}
            onClick={(e) => {
              e.stopPropagation();
              onDelete && onDelete(card);
            }}
            title={`Excluir cartão ${card.name}`}
          >
            <Trash2 size={14} />
            <span>Excluir</span>
          </button>
        </div>
      </div>
    </div>
  );
};
