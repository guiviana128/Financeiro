import React from "react";
import { CreditCard, Calendar, AlertCircle } from "lucide-react";
import { formatCurrency } from "../../utils/formatters";

export const UpcomingBills = ({ bills = [] }) => {
  if (!bills || bills.length === 0) {
    return (
      <div className="glass-panel chart-panel">
        <div className="chart-header">
          <h3 className="chart-title">Próximos Vencimentos</h3>
        </div>
        <div style={{ color: "var(--text-muted)", padding: "10px 0", fontSize: "0.9rem" }}>
          Nenhuma fatura pendente para este mês.
        </div>
      </div>
    );
  }

  return (
    <div className="glass-panel chart-panel">
      <div className="chart-header">
        <h3 className="chart-title">Faturas & Vencimentos do Mês</h3>
        <span className="badge badge-warning">
          <AlertCircle size={14} /> Atenção
        </span>
      </div>

      <div className="upcoming-bills-list">
        {bills.map((bill, idx) => (
          <div key={idx} className="upcoming-bill-card">
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "var(--radius-md)",
                  background: bill.color || "var(--accent-primary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff"
                }}
              >
                <CreditCard size={18} />
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: "0.95rem" }}>{bill.title}</div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 4 }}>
                  <Calendar size={12} />
                  <span>Vence dia {bill.due_day}</span>
                </div>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontWeight: 700, color: "var(--color-expense)", fontSize: "1.05rem" }}>
                {formatCurrency(bill.amount)}
              </div>
              <span className="badge badge-expense" style={{ fontSize: "0.65rem", padding: "2px 6px" }}>
                Fatura Aberta
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
