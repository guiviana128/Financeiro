import React, { useState } from "react";
import { PieChart, ChevronDown } from "lucide-react";
import { formatCurrency } from "../../utils/formatters";

const PERIOD_DATA = {
  "Este mês": {
    total: 3700.00,
    label: "no mês",
    categories: [
      { name: "Moradia", percentage: 32, amount: 1184.00, color: "#0d9488" },
      { name: "Alimentação", percentage: 18, amount: 684.30, color: "#f59e0b" },
      { name: "Transporte", percentage: 12, amount: 444.20, color: "#10b981" },
      { name: "Saúde", percentage: 9, amount: 333.80, color: "#3b82f6" },
      { name: "Lazer", percentage: 8, amount: 296.00, color: "#a855f7" },
      { name: "Assinaturas", percentage: 6, amount: 222.50, color: "#06b6d4" },
      { name: "Outros", percentage: 15, amount: 555.20, color: "#64748b" }
    ]
  },
  "Mês passado": {
    total: 3420.00,
    label: "no mês",
    categories: [
      { name: "Moradia", percentage: 35, amount: 1197.00, color: "#0d9488" },
      { name: "Alimentação", percentage: 22, amount: 752.40, color: "#f59e0b" },
      { name: "Transporte", percentage: 14, amount: 478.80, color: "#10b981" },
      { name: "Saúde", percentage: 8, amount: 273.60, color: "#3b82f6" },
      { name: "Lazer", percentage: 7, amount: 239.40, color: "#a855f7" },
      { name: "Assinaturas", percentage: 5, amount: 171.00, color: "#06b6d4" },
      { name: "Outros", percentage: 9, amount: 307.80, color: "#64748b" }
    ]
  },
  "Últimos 3 meses": {
    total: 10840.00,
    label: "em 3 meses",
    categories: [
      { name: "Moradia", percentage: 33, amount: 3577.20, color: "#0d9488" },
      { name: "Alimentação", percentage: 20, amount: 2168.00, color: "#f59e0b" },
      { name: "Transporte", percentage: 13, amount: 1409.20, color: "#10b981" },
      { name: "Saúde", percentage: 9, amount: 975.60, color: "#3b82f6" },
      { name: "Lazer", percentage: 8, amount: 867.20, color: "#a855f7" },
      { name: "Assinaturas", percentage: 5, amount: 542.00, color: "#06b6d4" },
      { name: "Outros", percentage: 12, amount: 1300.80, color: "#64748b" }
    ]
  },
  "Últimos 6 meses": {
    total: 21450.00,
    label: "em 6 meses",
    categories: [
      { name: "Moradia", percentage: 34, amount: 7293.00, color: "#0d9488" },
      { name: "Alimentação", percentage: 19, amount: 4075.50, color: "#f59e0b" },
      { name: "Transporte", percentage: 12, amount: 2574.00, color: "#10b981" },
      { name: "Saúde", percentage: 10, amount: 2145.00, color: "#3b82f6" },
      { name: "Lazer", percentage: 9, amount: 1930.50, color: "#a855f7" },
      { name: "Assinaturas", percentage: 5, amount: 1072.50, color: "#06b6d4" },
      { name: "Outros", percentage: 11, amount: 2359.50, color: "#64748b" }
    ]
  },
  "Ano de 2026": {
    total: 32600.00,
    label: "em 2026",
    categories: [
      { name: "Moradia", percentage: 33, amount: 10758.00, color: "#0d9488" },
      { name: "Alimentação", percentage: 20, amount: 6520.00, color: "#f59e0b" },
      { name: "Transporte", percentage: 12, amount: 3912.00, color: "#10b981" },
      { name: "Saúde", percentage: 9, amount: 2934.00, color: "#3b82f6" },
      { name: "Lazer", percentage: 8, amount: 2608.00, color: "#a855f7" },
      { name: "Assinaturas", percentage: 5, amount: 1630.00, color: "#06b6d4" },
      { name: "Outros", percentage: 13, amount: 4238.00, color: "#64748b" }
    ]
  }
};

export const CategoryDonutCard = ({ categories = [], totalExpense = 3700.00 }) => {
  const [selectedPeriod, setSelectedPeriod] = useState("Este mês");

  const currentDataset = PERIOD_DATA[selectedPeriod] || PERIOD_DATA["Este mês"];
  const cats = currentDataset.categories;
  const displayTotal = currentDataset.total;
  const periodLabel = currentDataset.label;

  // Donut SVG parameters
  const size = 150;
  const strokeWidth = 20;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercent = 0;
  const slices = cats.map((c, idx) => {
    const pct = (c.percentage || 10) / 100;
    const strokeDasharray = `${pct * circumference} ${circumference}`;
    const strokeDashoffset = -accumulatedPercent * circumference;
    accumulatedPercent += pct;
    return {
      ...c,
      idx,
      strokeDasharray,
      strokeDashoffset
    };
  });

  return (
    <div className="cat-donut-card">
      {/* Header with Functional Multi-period Selector */}
      <div className="cat-donut-header">
        <div className="cat-donut-title-box">
          <div className="cat-donut-icon-circle">
            <PieChart size={17} />
          </div>
          <h3 className="cat-donut-title">Gastos por categoria</h3>
        </div>

        <div className="cat-donut-select-wrapper">
          <select
            className="cat-donut-dropdown-select"
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
          >
            <option value="Este mês">Este mês</option>
            <option value="Mês passado">Mês passado</option>
            <option value="Últimos 3 meses">Últimos 3 meses</option>
            <option value="Últimos 6 meses">Últimos 6 meses</option>
            <option value="Ano de 2026">Ano de 2026</option>
          </select>
          <ChevronDown size={12} className="select-arrow-icon" />
        </div>
      </div>

      {/* Content: Donut on Left, Legend on Right */}
      <div className="cat-donut-body">
        {/* Donut graphic */}
        <div className="cat-donut-chart-box">
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="transparent"
              stroke="#f1f5f9"
              strokeWidth={strokeWidth}
            />
            {slices.map((s) => (
              <circle
                key={s.name}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="transparent"
                stroke={s.color || "#0d9488"}
                strokeWidth={strokeWidth}
                strokeDasharray={s.strokeDasharray}
                strokeDashoffset={s.strokeDashoffset}
                transform={`rotate(-90 ${size / 2} ${size / 2})`}
              />
            ))}
          </svg>

          <div className="cat-donut-inner-text">
            <span className="cat-donut-inner-val">{formatCurrency(displayTotal)}</span>
            <span className="cat-donut-inner-sub">{periodLabel}</span>
          </div>
        </div>

        {/* Legend List */}
        <div className="cat-donut-legend-list">
          {cats.map((c, idx) => (
            <div key={idx} className="cat-donut-legend-row">
              <div className="cat-donut-legend-left">
                <span className="cat-donut-dot" style={{ background: c.color }} />
                <span className="cat-donut-name">{c.name}</span>
              </div>
              <div className="cat-donut-legend-right">
                <span className="cat-donut-pct">{c.percentage}%</span>
                <span className="cat-donut-amt">{formatCurrency(c.amount)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
