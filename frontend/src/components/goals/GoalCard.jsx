import React from "react";
import confetti from "canvas-confetti";
import { formatCurrency } from "../../utils/formatters";
import { Plane, Laptop, Home, Palmtree, Calendar, MoreVertical, Sparkles } from "lucide-react";

export const GoalCard = ({ goal, onDelete, onDeposit }) => {
  const isCompleted = goal.is_completed || goal.current_amount >= goal.target_amount;
  const pct = Math.min(100, Math.round(goal.progress_percentage || (goal.current_amount / goal.target_amount) * 100));
  const remaining = Math.max(0, (goal.target_amount || 0) - (goal.current_amount || 0));

  const handleCelebrate = () => {
    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const renderIcon = (type) => {
    switch (type) {
      case "plane":
      case "viagem":
        return <Plane size={18} color="#3b82f6" />;
      case "laptop":
      case "tech":
        return <Laptop size={18} color="#8b5cf6" />;
      case "home":
      case "imovel":
        return <Home size={18} color="#f59e0b" />;
      case "palmtree":
      case "reserva":
        return <Palmtree size={18} color="#10b981" />;
      default:
        return <Sparkles size={18} color="#0d9488" />;
    }
  };

  return (
    <div
      className="glass-panel"
      style={{
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        boxShadow: "var(--shadow-sm)"
      }}
    >
      {/* Photo Header */}
      <div style={{ position: "relative", width: "100%", height: 140, overflow: "hidden" }}>
        <img
          src={goal.imageUrl || "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=600&auto=format&fit=crop&q=80"}
          alt={goal.title}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        {/* Status Pill on Top Left */}
        <div style={{ position: "absolute", top: 12, left: 12 }}>
          {isCompleted ? (
            <span
              className="badge"
              style={{ background: "#ecfdf5", color: "#059669", border: "1px solid #a7f3d0", fontWeight: 700, cursor: "pointer" }}
              onClick={handleCelebrate}
            >
              &check; Concluída
            </span>
          ) : (
            <span
              className="badge"
              style={{ background: "#f0fdf4", color: "#166534", border: "1px solid #bbf7d0", fontWeight: 700 }}
            >
              &bull; Em andamento
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "18px 20px", display: "flex", flexDirection: "column", gap: 14, flex: 1, justifyContent: "space-between" }}>
        {/* Title and Icon */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
          <div style={{ marginTop: 2 }}>{renderIcon(goal.iconType)}</div>
          <div>
            <h4 style={{ fontSize: "1rem", fontWeight: 800, color: "var(--text-primary)" }}>{goal.title}</h4>
            <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: 2 }}>{goal.subtitle}</p>
          </div>
        </div>

        {/* Progress Bar & Percent */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <span style={{ fontSize: "0.82rem", fontWeight: 800, color: "var(--text-primary)" }}>
              {pct}% <span style={{ fontWeight: 500, color: "var(--text-secondary)" }}>concluído</span>
            </span>
          </div>

          <div className="kpi-progress-track" style={{ height: 8 }}>
            <div
              className="kpi-progress-fill"
              style={{
                width: `${pct}%`,
                background: isCompleted ? "#10b981" : "#0d9488"
              }}
            />
          </div>
        </div>

        {/* Amounts */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <div style={{ fontSize: "1.05rem", fontWeight: 800, color: "var(--text-primary)" }}>
              {formatCurrency(goal.current_amount)}
            </div>
            <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
              de {formatCurrency(goal.target_amount)}
            </div>
          </div>

          <div style={{ textAlign: "right" }}>
            {isCompleted ? (
              <span style={{ fontSize: "0.82rem", fontWeight: 800, color: "#10b981", display: "inline-flex", alignItems: "center", gap: 4 }}>
                🎉 Meta atingida!
              </span>
            ) : (
              <div>
                <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Faltam</div>
                <div style={{ fontSize: "0.95rem", fontWeight: 800, color: "var(--text-primary)" }}>
                  {formatCurrency(remaining)}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer: Date & Menu */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 10, borderTop: "1px solid var(--border-light)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600 }}>
            <Calendar size={13} />
            <span>{isCompleted ? `Concluída em ${goal.targetDate || "Ago 2026"}` : `Meta para ${goal.targetDate || "Dez 2026"}`}</span>
          </div>

          <button
            type="button"
            className="action-btn-sm"
            onClick={() => onDeposit(goal)}
            title="Aporte / Opções"
          >
            <MoreVertical size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
