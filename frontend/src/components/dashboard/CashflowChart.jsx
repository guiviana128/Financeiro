import React from "react";
import { formatCurrency } from "../../utils/formatters";

export const CashflowChart = ({ data = [] }) => {
  if (!data || data.length === 0) {
    return <div style={{ color: "var(--text-muted)", padding: 20 }}>Sem dados históricos suficientes.</div>;
  }

  // Find max value for scale
  const maxVal = Math.max(
    ...data.map((d) => Math.max(d.income, d.expense)),
    1000
  );

  return (
    <div className="glass-panel chart-panel">
      <div className="chart-header">
        <h3 className="chart-title">Evolução do Fluxo de Caixa (Últimos 6 Meses)</h3>
        <div style={{ display: "flex", gap: "16px", fontSize: "0.8rem", fontWeight: 600 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: "#10b981" }}></span>
            <span>Receitas</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: "#f43f5e" }}></span>
            <span>Despesas</span>
          </div>
        </div>
      </div>

      <div className="cashflow-bars-container">
        {data.map((item, idx) => {
          const incHeight = Math.max(6, (item.income / maxVal) * 160);
          const expHeight = Math.max(6, (item.expense / maxVal) * 160);

          return (
            <div key={idx} className="cashflow-month-group">
              <div className="cashflow-bar-pair">
                <div
                  className="bar-income"
                  style={{ height: `${incHeight}px` }}
                  data-tooltip={`Receitas: ${formatCurrency(item.income)}`}
                />
                <div
                  className="bar-expense"
                  style={{ height: `${expHeight}px` }}
                  data-tooltip={`Despesas: ${formatCurrency(item.expense)}`}
                />
              </div>
              <span className="month-bar-label">{item.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
