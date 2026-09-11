import React, { useState } from "react";
import { formatCurrency } from "../../utils/formatters";
import { useFinance } from "../../context/FinanceContext";
import { Icon } from "../common/Icon";
import { InteractiveDonutChart } from "../charts/InteractiveDonutChart";
import { PieChart, BarChart3 } from "lucide-react";

export const CategoryBreakdown = ({ categories = [], totalExpense = 0 }) => {
  const { isPrivacyMode } = useFinance();
  const [viewMode, setViewMode] = useState("donut"); // donut | bars

  return (
    <div className="glass-panel chart-panel">
      <div className="chart-header">
        <h3 className="chart-title">Distribuição de Gastos por Categoria</h3>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div className="segmented-control" style={{ padding: 2 }}>
            <button
              type="button"
              className={`segmented-btn ${viewMode === "donut" ? "active" : ""}`}
              style={{ padding: "4px 8px", fontSize: "0.75rem" }}
              onClick={() => setViewMode("donut")}
            >
              <PieChart size={14} />
              <span>Donut</span>
            </button>
            <button
              type="button"
              className={`segmented-btn ${viewMode === "bars" ? "active" : ""}`}
              style={{ padding: "4px 8px", fontSize: "0.75rem" }}
              onClick={() => setViewMode("bars")}
            >
              <BarChart3 size={14} />
              <span>Barras</span>
            </button>
          </div>
          <span className="badge badge-neutral">{categories.length} categorias</span>
        </div>
      </div>

      {categories.length === 0 ? (
        <div style={{ color: "var(--text-muted)", padding: "20px 0", textAlign: "center" }}>
          Nenhuma despesa registrada neste mês.
        </div>
      ) : viewMode === "donut" ? (
        <InteractiveDonutChart categories={categories} totalExpense={totalExpense} />
      ) : (
        <div className="category-breakdown-list">
          {categories.map((cat, idx) => (
            <div key={idx} className="category-breakdown-item">
              <div className="cat-item-header">
                <div className="cat-name-icon">
                  <span className="cat-dot" style={{ background: cat.color }}></span>
                  <Icon name={cat.icon} size={16} color={cat.color} />
                  <span>{cat.name}</span>
                </div>
                <div className="cat-amount-pct">
                  <span>{formatCurrency(cat.amount, isPrivacyMode)}</span>
                  <span style={{ color: "var(--text-muted)", marginLeft: 6 }}>({cat.percentage}%)</span>
                </div>
              </div>
              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{
                    width: `${cat.percentage}%`,
                    background: cat.color
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
