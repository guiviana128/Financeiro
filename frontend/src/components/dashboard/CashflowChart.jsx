import React from "react";
import { BarChart2 } from "lucide-react";
import { formatCurrency } from "../../utils/formatters";

export const CashflowChart = ({ data = [] }) => {
  // Default fallback data if empty to match mockup visuals
  const chartData = data && data.length > 0 ? data : [
    { label: "Abr/26", income: 4800, expense: 4100 },
    { label: "Mai/26", income: 5100, expense: 4600 },
    { label: "Jun/26", income: 4900, expense: 5200 },
    { label: "Jul/26", income: 5300, expense: 4800 },
    { label: "Ago/26", income: 5000, expense: 5400 },
    { label: "Set/26", income: 5200, expense: 5645 },
  ];

  const maxScale = 8000;
  const yLabels = ["R$ 8 mil", "R$ 6 mil", "R$ 4 mil", "R$ 2 mil", "R$ 0"];

  const formatShortValue = (val) => {
    if (!val) return "R$ 0";
    if (val >= 1000) {
      const kVal = (val / 1000).toFixed(1).replace(".", ",");
      return `R$ ${kVal}k`;
    }
    return `R$ ${val}`;
  };

  return (
    <div className="chart-panel">
      <div className="chart-header">
        <h3 className="chart-title">
          <BarChart2 size={18} color="#10b981" />
          <span>Evolução do Fluxo de Caixa (Últimos 6 Meses)</span>
        </h3>

        <div className="chart-legend">
          <div className="legend-item">
            <span className="legend-dot" style={{ background: "#10b981" }} />
            <span>Receitas</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot" style={{ background: "#f43f5e" }} />
            <span>Despesas</span>
          </div>
        </div>
      </div>

      <div className="cashflow-chart-wrapper">
        {/* Y-Axis Labels */}
        <div className="cashflow-y-axis">
          {yLabels.map((lbl, idx) => (
            <span key={idx}>{lbl}</span>
          ))}
        </div>

        {/* Bars Container */}
        <div className="cashflow-bars-area">
          {/* Subtle horizontal grid lines */}
          <div className="cashflow-grid-line" style={{ top: "0%" }} />
          <div className="cashflow-grid-line" style={{ top: "25%" }} />
          <div className="cashflow-grid-line" style={{ top: "50%" }} />
          <div className="cashflow-grid-line" style={{ top: "75%" }} />
          <div className="cashflow-grid-line" style={{ top: "100%" }} />

          {/* Month Columns */}
          {chartData.map((item, idx) => {
            const incHeight = Math.max(8, Math.min(160, (item.income / maxScale) * 160));
            const expHeight = Math.max(8, Math.min(160, (item.expense / maxScale) * 160));

            return (
              <div key={idx} className="cashflow-col">
                <div className="cashflow-bar-group">
                  {/* Income Bar */}
                  <div
                    className="cf-bar income"
                    style={{ height: `${incHeight}px` }}
                    title={`Receitas: ${formatCurrency(item.income)}`}
                  >
                    <span className="cf-bar-value income">
                      {formatShortValue(item.income)}
                    </span>
                  </div>

                  {/* Expense Bar */}
                  <div
                    className="cf-bar expense"
                    style={{ height: `${expHeight}px` }}
                    title={`Despesas: ${formatCurrency(item.expense)}`}
                  >
                    <span className="cf-bar-value expense">
                      {formatShortValue(item.expense)}
                    </span>
                  </div>
                </div>

                <span className="cf-month-label">{item.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
