import React from "react";
import confetti from "canvas-confetti";
import { formatCurrency, formatDate } from "../../utils/formatters";
import { Icon } from "../common/Icon";
import { Trash2, PlusCircle, CheckCircle2, Calendar } from "lucide-react";

export const GoalCard = ({ goal, onDelete, onDeposit }) => {
  const isCompleted = goal.current_amount >= goal.target_amount;
  const pct = Math.min(100, goal.progress_percentage || 0);

  const handleCelebrate = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className="goal-card" style={{ borderTop: `4px solid ${goal.color || "#10b981"}` }}>
      <div className="goal-header">
        <div className="goal-icon-title">
          <div
            className="goal-icon-box"
            style={{
              background: `${goal.color || "#10b981"}20`,
              color: goal.color || "#10b981"
            }}
          >
            <Icon name={goal.category_icon || "Target"} size={22} color={goal.color || "#10b981"} />
          </div>
          <div>
            <div className="goal-title">{goal.title}</div>
            {goal.target_date && (
              <div className="goal-date" style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <Calendar size={12} />
                <span>Meta até {formatDate(goal.target_date)}</span>
              </div>
            )}
          </div>
        </div>

        <button
          className="action-btn-sm delete-btn"
          onClick={() => {
            if (window.confirm(`Deseja excluir a meta "${goal.title}"?`)) {
              onDelete(goal.id);
            }
          }}
          title="Excluir Meta"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <div className="goal-amounts">
        <div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Acumulado</div>
          <div className="goal-curr-amount" style={{ color: goal.color || "var(--text-primary)" }}>
            {formatCurrency(goal.current_amount)}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Alvo</div>
          <div className="goal-target-amount">{formatCurrency(goal.target_amount)}</div>
        </div>
      </div>

      <div className="progress-track" style={{ height: 10 }}>
        <div
          className="progress-fill"
          style={{
            width: `${pct}%`,
            background: isCompleted ? "linear-gradient(90deg, #10b981, #34d399)" : (goal.color || "#10b981")
          }}
        />
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.85rem" }}>
        <span style={{ fontWeight: 600, color: "var(--text-secondary)" }}>{pct}% Concluído</span>
        {isCompleted ? (
          <span
            className="badge badge-income"
            style={{ cursor: "pointer" }}
            onClick={handleCelebrate}
            title="Clique para comemorar!"
          >
            <CheckCircle2 size={14} /> Meta Atingida 🎉
          </span>
        ) : (
          <span style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>
            Faltam {formatCurrency(goal.remaining_amount)}
          </span>
        )}
      </div>

      <div className="goal-actions">
        <button
          className="btn btn-secondary"
          style={{ width: "100%", padding: "8px 12px", fontSize: "0.85rem" }}
          onClick={() => onDeposit(goal)}
        >
          <PlusCircle size={15} />
          <span>Registrar Aporte / Retirada</span>
        </button>
      </div>
    </div>
  );
};
