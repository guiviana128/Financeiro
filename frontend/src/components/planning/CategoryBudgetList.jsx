import React from "react";
import { formatCurrency } from "../../utils/formatters";
import { Icon } from "../common/Icon";
import { Trash2, AlertTriangle, CheckCircle } from "lucide-react";

export const CategoryBudgetList = ({ budgets = [], onDelete }) => {
  if (budgets.length === 0) {
    return (
      <div className="glass-panel" style={{ padding: 32, textAlign: "center", color: "var(--text-muted)" }}>
        Nenhum orçamento configurado para este mês. Clique em "Definir Orçamento" para estipular metas por categoria.
      </div>
    );
  }

  return (
    <div className="budgets-grid">
      {budgets.map((b) => {
        const cat = b.category;
        const isOverBudget = b.spent_amount > b.allocated_amount;
        const isWarning = !isOverBudget && b.spent_percentage > 80;

        return (
          <div key={b.id} className="budget-item-card">
            <div className="budget-top">
              <div className="budget-cat-info">
                <div
                  className="cat-icon-circle"
                  style={{
                    width: 34,
                    height: 34,
                    background: cat?.color ? `${cat.color}20` : "var(--accent-glow)"
                  }}
                >
                  <Icon name={cat?.icon || "Tag"} size={16} color={cat?.color || "#6366f1"} />
                </div>
                <span>{cat?.name}</span>
              </div>

              <button
                className="action-btn-sm delete-btn"
                onClick={() => {
                  if (window.confirm(`Deseja remover o orçamento de ${cat?.name}?`)) {
                    onDelete(b.id);
                  }
                }}
                title="Excluir Orçamento"
              >
                <Trash2 size={15} />
              </button>
            </div>

            <div className="budget-values">
              <div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Gasto</div>
                <div style={{ fontWeight: 700, color: isOverBudget ? "#f43f5e" : "var(--text-primary)" }}>
                  {formatCurrency(b.spent_amount)}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Teto Mensal</div>
                <div style={{ fontWeight: 600, color: "var(--text-secondary)" }}>
                  {formatCurrency(b.allocated_amount)}
                </div>
              </div>
            </div>

            <div className="progress-track">
              <div
                className="progress-fill"
                style={{
                  width: `${Math.min(100, b.spent_percentage)}%`,
                  background: isOverBudget ? "#ef4444" : isWarning ? "#f59e0b" : "#10b981"
                }}
              />
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.8rem" }}>
              <span style={{ color: "var(--text-muted)" }}>{b.spent_percentage}% consumido</span>
              {isOverBudget ? (
                <span className="badge badge-expense" style={{ fontSize: "0.65rem" }}>
                  <AlertTriangle size={12} /> Estourado em {formatCurrency(Math.abs(b.remaining_amount))}
                </span>
              ) : (
                <span className="badge badge-income" style={{ fontSize: "0.65rem" }}>
                  <CheckCircle size={12} /> Restam {formatCurrency(b.remaining_amount)}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
