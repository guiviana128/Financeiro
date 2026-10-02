import React, { useState } from "react";
import { TrendingUp } from "lucide-react";
import { formatCurrency } from "../../utils/formatters";

// Dynamic data by month
const MONTH_DATA = {
  Abr: {
    incomePath: "M 30 160 C 90 140, 140 150, 200 145 C 270 140, 320 130, 380 120 C 440 110, 490 95, 550 85 C 580 80, 620 85, 650 90",
    expensePath: "M 30 170 C 90 160, 140 165, 200 155 C 270 150, 320 165, 380 155 C 440 145, 490 155, 550 150 C 580 150, 620 160, 650 165",
    points: [
      { day: "01 de Abr", x: 30, yIncome: 160, yExpense: 170, income: 4200, expense: 3100 },
      { day: "05 de Abr", x: 135, yIncome: 148, yExpense: 163, income: 5100, expense: 3400 },
      { day: "10 de Abr", x: 240, yIncome: 142, yExpense: 152, income: 5500, expense: 4100 },
      { day: "15 de Abr", x: 345, yIncome: 125, yExpense: 160, income: 6400, expense: 3900 },
      { day: "20 de Abr", x: 450, yIncome: 108, yExpense: 148, income: 7200, expense: 4300 },
      { day: "28 de Abr", x: 580, yIncome: 80, yExpense: 150, income: 8600, expense: 4100 },
      { day: "30 de Abr", x: 650, yIncome: 90, yExpense: 165, income: 8200, expense: 3600 }
    ]
  },
  Mai: {
    incomePath: "M 30 150 C 90 120, 140 140, 200 130 C 270 135, 320 110, 380 105 C 440 100, 490 85, 550 75 C 580 70, 620 75, 650 80",
    expensePath: "M 30 165 C 90 150, 140 155, 200 145 C 270 140, 320 155, 380 145 C 440 135, 490 145, 550 140 C 580 140, 620 150, 650 155",
    points: [
      { day: "01 de Mai", x: 30, yIncome: 150, yExpense: 165, income: 4600, expense: 3200 },
      { day: "05 de Mai", x: 135, yIncome: 130, yExpense: 153, income: 5800, expense: 3600 },
      { day: "10 de Mai", x: 240, yIncome: 133, yExpense: 143, income: 5700, expense: 4400 },
      { day: "15 de Mai", x: 345, yIncome: 110, yExpense: 150, income: 6900, expense: 4100 },
      { day: "20 de Mai", x: 450, yIncome: 98, yExpense: 138, income: 7600, expense: 4600 },
      { day: "28 de Mai", x: 580, yIncome: 70, yExpense: 140, income: 9100, expense: 4300 },
      { day: "31 de Mai", x: 650, yIncome: 80, yExpense: 155, income: 8700, expense: 3900 }
    ]
  },
  Jun: {
    incomePath: "M 30 155 C 90 130, 140 145, 200 140 C 270 135, 320 120, 380 115 C 440 110, 490 90, 550 80 C 580 75, 620 80, 650 85",
    expensePath: "M 30 170 C 90 155, 140 160, 200 150 C 270 145, 320 160, 380 150 C 440 140, 490 150, 550 145 C 580 145, 620 155, 650 160",
    points: [
      { day: "01 de Jun", x: 30, yIncome: 155, yExpense: 170, income: 4500, expense: 3000 },
      { day: "05 de Jun", x: 135, yIncome: 138, yExpense: 158, income: 5400, expense: 3500 },
      { day: "10 de Jun", x: 240, yIncome: 138, yExpense: 148, income: 5500, expense: 4200 },
      { day: "15 de Jun", x: 345, yIncome: 118, yExpense: 155, income: 6700, expense: 4000 },
      { day: "20 de Jun", x: 450, yIncome: 105, yExpense: 142, income: 7400, expense: 4500 },
      { day: "28 de Jun", x: 580, yIncome: 75, yExpense: 145, income: 8900, expense: 4200 },
      { day: "30 de Jun", x: 650, yIncome: 85, yExpense: 160, income: 8500, expense: 3700 }
    ]
  },
  Jul: {
    incomePath: "M 30 145 C 90 115, 140 135, 200 130 C 270 130, 320 110, 380 100 C 440 95, 490 80, 550 70 C 580 65, 620 70, 650 75",
    expensePath: "M 30 165 C 90 145, 140 155, 200 145 C 270 140, 320 155, 380 140 C 440 130, 490 145, 550 135 C 580 135, 620 145, 650 150",
    points: [
      { day: "01 de Jul", x: 30, yIncome: 145, yExpense: 165, income: 4800, expense: 3300 },
      { day: "05 de Jul", x: 135, yIncome: 125, yExpense: 150, income: 6000, expense: 3700 },
      { day: "10 de Jul", x: 240, yIncome: 130, yExpense: 142, income: 5900, expense: 4500 },
      { day: "15 de Jul", x: 345, yIncome: 105, yExpense: 148, income: 7200, expense: 4200 },
      { day: "20 de Jul", x: 450, yIncome: 92, yExpense: 132, income: 7900, expense: 4700 },
      { day: "28 de Jul", x: 580, yIncome: 65, yExpense: 135, income: 9300, expense: 4400 },
      { day: "31 de Jul", x: 650, yIncome: 75, yExpense: 150, income: 8900, expense: 3800 }
    ]
  },
  Ago: {
    incomePath: "M 30 140 C 90 110, 140 130, 200 125 C 270 125, 320 105, 380 95 C 440 90, 490 75, 550 65 C 580 60, 620 65, 650 70",
    expensePath: "M 30 160 C 90 140, 140 150, 200 140 C 270 135, 320 150, 380 135 C 440 125, 490 140, 550 130 C 580 130, 620 140, 650 145",
    points: [
      { day: "01 de Ago", x: 30, yIncome: 140, yExpense: 160, income: 5000, expense: 3400 },
      { day: "05 de Ago", x: 135, yIncome: 120, yExpense: 145, income: 6300, expense: 3800 },
      { day: "10 de Ago", x: 240, yIncome: 125, yExpense: 138, income: 6100, expense: 4600 },
      { day: "15 de Ago", x: 345, yIncome: 100, yExpense: 142, income: 7500, expense: 4300 },
      { day: "20 de Ago", x: 450, yIncome: 88, yExpense: 128, income: 8200, expense: 4800 },
      { day: "28 de Ago", x: 580, yIncome: 60, yExpense: 130, income: 9600, expense: 4500 },
      { day: "31 de Ago", x: 650, yIncome: 70, yExpense: 145, income: 9200, expense: 3900 }
    ]
  },
  Set: {
    incomePath: "M 30 145 C 90 100, 140 130, 200 135 C 270 140, 320 115, 380 120 C 440 125, 490 90, 550 70 C 580 65, 620 70, 650 75",
    expensePath: "M 30 165 C 90 145, 140 160, 200 150 C 270 140, 320 160, 380 145 C 440 130, 490 150, 550 140 C 580 140, 620 155, 650 160",
    points: [
      { day: "01 de Set", x: 30, yIncome: 145, yExpense: 165, income: 4800, expense: 3200 },
      { day: "05 de Set", x: 135, yIncome: 125, yExpense: 155, income: 6200, expense: 3800 },
      { day: "10 de Set", x: 240, yIncome: 138, yExpense: 145, income: 5400, expense: 4900 },
      { day: "15 de Set", x: 345, yIncome: 118, yExpense: 155, income: 6800, expense: 4100 },
      { day: "20 de Set", x: 450, yIncome: 115, yExpense: 145, income: 7100, expense: 4500 },
      { day: "28 de Set", x: 580, yIncome: 65, yExpense: 140, income: 9400, expense: 4200 },
      { day: "30 de Set", x: 650, yIncome: 75, yExpense: 160, income: 8900, expense: 3700 }
    ]
  }
};

export const CashflowSplineChart = () => {
  const [selectedMonthTab, setSelectedMonthTab] = useState("Set");
  const [hoveredPoint, setHoveredPoint] = useState(null);

  const monthTabs = ["Abr", "Mai", "Jun", "Jul", "Ago", "Set"];
  const yLabels = ["R$ 12 mil", "R$ 9 mil", "R$ 6 mil", "R$ 3 mil", "R$ 0"];
  const xLabels = ["01", "05", "10", "15", "20", "25", "30"];

  // SVG Chart Dimensions
  const width = 680;
  const height = 210;

  const currentData = MONTH_DATA[selectedMonthTab] || MONTH_DATA.Set;
  const { incomePath, expensePath, points } = currentData;

  const incomeAreaPath = `${incomePath} L 650 200 L 30 200 Z`;
  const expenseAreaPath = `${expensePath} L 650 200 L 30 200 Z`;

  return (
    <div className="cashflow-spline-card" onMouseLeave={() => setHoveredPoint(null)}>
      {/* Header */}
      <div className="spline-header">
        <div className="spline-title-box">
          <div className="spline-icon-circle">
            <TrendingUp size={18} />
          </div>
          <div>
            <h3 className="spline-title">Fluxo de Caixa</h3>
            <p className="spline-subtitle">Acompanhe suas receitas e despesas ao longo do tempo.</p>
          </div>
        </div>

        {/* Right side controls */}
        <div className="spline-controls">
          <div className="spline-month-tabs">
            {monthTabs.map((m) => (
              <button
                key={m}
                type="button"
                className={`spline-month-btn ${selectedMonthTab === m ? "active" : ""}`}
                onClick={() => {
                  setSelectedMonthTab(m);
                  setHoveredPoint(null);
                }}
              >
                {m}
              </button>
            ))}
          </div>

          <div className="spline-legend">
            <div className="spline-legend-item">
              <span className="spline-dot income" />
              <span>Receitas</span>
            </div>
            <div className="spline-legend-item">
              <span className="spline-dot expense" />
              <span>Despesas</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Canvas Area */}
      <div className="spline-chart-container">
        {/* Y Axis */}
        <div className="spline-y-axis">
          {yLabels.map((lbl, idx) => (
            <span key={idx}>{lbl}</span>
          ))}
        </div>

        {/* SVG Drawing */}
        <div
          className="spline-svg-wrapper"
          onMouseLeave={() => setHoveredPoint(null)}
        >
          <svg
            className="spline-svg"
            viewBox={`0 0 ${width} ${height}`}
            preserveAspectRatio="none"
          >
            <defs>
              {/* Income Green Area Gradient */}
              <linearGradient id="incomeAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.28" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.02" />
              </linearGradient>

              {/* Expense Red Area Gradient */}
              <linearGradient id="expenseAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.22" />
                <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.02" />
              </linearGradient>
            </defs>

            {/* Dashed Horizontal Gridlines */}
            <line x1="20" y1="20" x2="660" y2="20" stroke="#edf2f7" strokeDasharray="3 3" />
            <line x1="20" y1="65" x2="660" y2="65" stroke="#edf2f7" strokeDasharray="3 3" />
            <line x1="20" y1="110" x2="660" y2="110" stroke="#edf2f7" strokeDasharray="3 3" />
            <line x1="20" y1="155" x2="660" y2="155" stroke="#edf2f7" strokeDasharray="3 3" />
            <line x1="20" y1="200" x2="660" y2="200" stroke="#e2e8f0" />

            {/* Shaded Areas */}
            <path d={incomeAreaPath} fill="url(#incomeAreaGrad)" />
            <path d={expenseAreaPath} fill="url(#expenseAreaGrad)" />

            {/* Smooth Spline Lines */}
            <path d={incomePath} fill="none" stroke="#10b981" strokeWidth="2.8" strokeLinecap="round" />
            <path d={expensePath} fill="none" stroke="#f43f5e" strokeWidth="2.8" strokeLinecap="round" />

            {/* Vertical Guide Line for active hovered day */}
            {hoveredPoint && (
              <line
                x1={hoveredPoint.x}
                y1="20"
                x2={hoveredPoint.x}
                y2="200"
                stroke="#cbd5e1"
                strokeDasharray="2 2"
                strokeWidth="1.2"
              />
            )}

            {/* Interactive hover column overlays */}
            {points.map((p, idx) => (
              <rect
                key={`hit-${idx}`}
                x={p.x - 30}
                y="0"
                width="60"
                height={height}
                fill="transparent"
                style={{ cursor: "pointer" }}
                onMouseEnter={() => setHoveredPoint(p)}
              />
            ))}

            {/* Points on Line */}
            {points.map((p, idx) => (
              <g
                key={idx}
                style={{ cursor: "pointer" }}
                onMouseEnter={() => setHoveredPoint(p)}
              >
                {/* Income point circle */}
                <circle
                  cx={p.x}
                  cy={p.yIncome}
                  r={hoveredPoint?.day === p.day ? 5.5 : 3.5}
                  fill="#ffffff"
                  stroke="#10b981"
                  strokeWidth="2.5"
                />
                {/* Expense point circle */}
                <circle
                  cx={p.x}
                  cy={p.yExpense}
                  r={hoveredPoint?.day === p.day ? 5.5 : 3.5}
                  fill="#ffffff"
                  stroke="#f43f5e"
                  strokeWidth="2.5"
                />
              </g>
            ))}
          </svg>

          {/* Floating Dark Tooltip matching Image 1 ONLY on hover */}
          {hoveredPoint && (
            <div
              className="spline-dark-tooltip animate-fade-in"
              style={{
                left: `${(hoveredPoint.x / width) * 100}%`,
                top: `${(Math.min(hoveredPoint.yIncome, hoveredPoint.yExpense) / height) * 100}%`
              }}
            >
              <div className="tooltip-title">{hoveredPoint.day}</div>
              <div className="tooltip-row">
                <span className="tooltip-dot income" />
                <span>R$ {hoveredPoint.income.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="tooltip-row">
                <span className="tooltip-dot expense" />
                <span>R$ {hoveredPoint.expense.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* X Axis */}
      <div className="spline-x-axis">
        {xLabels.map((lbl, idx) => (
          <span key={idx}>{lbl}</span>
        ))}
      </div>
    </div>
  );
};
