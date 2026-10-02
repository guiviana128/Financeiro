import React, { useState } from "react";
import { PieChart, BarChart3, Percent, Tag, Home, Utensils, Car, Gamepad2, Heart, Calendar, MoreHorizontal } from "lucide-react";
import { formatCurrency } from "../../utils/formatters";
import { InteractiveDonutChart } from "../charts/InteractiveDonutChart";

export const CategoryBreakdown = ({ categories = [], totalExpense = 5645.90 }) => {
  const [viewMode, setViewMode] = useState("donut"); // donut, bars, pct, cats

  // Default mockup categories if empty
  const displayCats = categories && categories.length > 0 ? categories : [
    { name: "Moradia", percentage: 28, amount: 1580.00, color: "#f43f5e", icon: "Home" },
    { name: "Alimentação", percentage: 18, amount: 980.00, color: "#f59e0b", icon: "Utensils" },
    { name: "Transporte", percentage: 12, amount: 678.00, color: "#10b981", icon: "Car" },
    { name: "Lazer", percentage: 10, amount: 564.00, color: "#8b5cf6", icon: "Gamepad2" },
    { name: "Saúde", percentage: 8, amount: 452.00, color: "#3b82f6", icon: "Heart" },
    { name: "Assinaturas", percentage: 8, amount: 438.90, color: "#06b6d4", icon: "Calendar" },
    { name: "Outros", percentage: 16, amount: 952.00, color: "#64748b", icon: "MoreHorizontal" },
  ];

  const col1 = displayCats.slice(0, 4);
  const col2 = displayCats.slice(4);

  const renderIcon = (name) => {
    switch (name) {
      case "Moradia":
        return <Home size={15} color="#f43f5e" />;
      case "Alimentação":
        return <Utensils size={15} color="#f59e0b" />;
      case "Transporte":
        return <Car size={15} color="#10b981" />;
      case "Lazer":
        return <Gamepad2 size={15} color="#8b5cf6" />;
      case "Saúde":
        return <Heart size={15} color="#3b82f6" />;
      case "Assinaturas":
        return <Calendar size={15} color="#06b6d4" />;
      default:
        return <MoreHorizontal size={15} color="#64748b" />;
    }
  };

  return (
    <div className="category-breakdown-panel">
      <div className="chart-header">
        <h3 className="chart-title">
          <PieChart size={18} color="#0d9488" />
          <span>Distribuição de Gastos por Categoria</span>
        </h3>

        {/* View Switchers */}
        <div className="cat-views-toggle">
          <button
            type="button"
            className={`cat-view-btn ${viewMode === "donut" ? "active" : ""}`}
            onClick={() => setViewMode("donut")}
          >
            <PieChart size={13} />
            <span>Donut</span>
          </button>
          <button
            type="button"
            className={`cat-view-btn ${viewMode === "bars" ? "active" : ""}`}
            onClick={() => setViewMode("bars")}
          >
            <BarChart3 size={13} />
            <span>Barras</span>
          </button>
          <button
            type="button"
            className={`cat-view-btn ${viewMode === "pct" ? "active" : ""}`}
            onClick={() => setViewMode("pct")}
          >
            <Percent size={13} />
            <span>Porcentagem</span>
          </button>
          <button
            type="button"
            className={`cat-view-btn ${viewMode === "cats" ? "active" : ""}`}
            onClick={() => setViewMode("cats")}
          >
            <Tag size={13} />
            <span>Categorias</span>
          </button>
        </div>
      </div>

      <div className="cat-breakdown-content">
        {/* Left Donut Chart */}
        <div className="cat-donut-center-box">
          <InteractiveDonutChart categories={displayCats} totalExpense={totalExpense} />
        </div>

        {/* Right 2-Column Legend */}
        <div className="cat-legend-2cols">
          {/* Column 1 */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {col1.map((cat, idx) => (
              <div key={idx} className="cat-legend-row">
                <div className="cat-legend-left">
                  <span className="cat-legend-dot" style={{ background: cat.color }} />
                  {renderIcon(cat.name)}
                  <span className="cat-legend-name">{cat.name}</span>
                </div>
                <div className="cat-legend-right">
                  <span className="cat-legend-pct">{cat.percentage}%</span>
                  <span className="cat-legend-val">{formatCurrency(cat.amount)}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Column 2 */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {col2.map((cat, idx) => (
              <div key={idx} className="cat-legend-row">
                <div className="cat-legend-left">
                  <span className="cat-legend-dot" style={{ background: cat.color }} />
                  {renderIcon(cat.name)}
                  <span className="cat-legend-name">{cat.name}</span>
                </div>
                <div className="cat-legend-right">
                  <span className="cat-legend-pct">{cat.percentage}%</span>
                  <span className="cat-legend-val">{formatCurrency(cat.amount)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
