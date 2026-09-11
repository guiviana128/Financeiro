import React, { useState } from "react";
import { formatCurrency } from "../../utils/formatters";
import { useFinance } from "../../context/FinanceContext";
import { Icon } from "../common/Icon";

export const InteractiveDonutChart = ({ categories = [], totalExpense = 0 }) => {
  const { isPrivacyMode } = useFinance();
  const [hoveredIdx, setHoveredIdx] = useState(null);

  if (!categories || categories.length === 0 || totalExpense <= 0) {
    return (
      <div style={{ textAlign: "center", padding: 30, color: "var(--text-muted)", fontSize: "0.85rem" }}>
        Sem dados de despesas para exibir no gráfico.
      </div>
    );
  }

  // Calculate SVG arc paths
  const size = 220;
  const strokeWidth = 28;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercent = 0;

  const slices = categories.map((cat, idx) => {
    const pct = cat.percentage / 100;
    const strokeDasharray = `${pct * circumference} ${circumference}`;
    const strokeDashoffset = -accumulatedPercent * circumference;
    accumulatedPercent += pct;

    return {
      ...cat,
      idx,
      strokeDasharray,
      strokeDashoffset
    };
  });

  const activeCategory = hoveredIdx !== null ? categories[hoveredIdx] : null;

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flexWrap: "wrap", gap: 32, padding: "16px 0" }}>
      {/* SVG Donut */}
      <div style={{ position: "relative", width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* Base track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="rgba(255, 255, 255, 0.05)"
            strokeWidth={strokeWidth}
          />

          {/* Slices */}
          {slices.map((slice) => {
            const isHovered = hoveredIdx === slice.idx;
            return (
              <circle
                key={slice.name}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="transparent"
                stroke={slice.color || "#6366f1"}
                strokeWidth={isHovered ? strokeWidth + 6 : strokeWidth}
                strokeDasharray={slice.strokeDasharray}
                strokeDashoffset={slice.strokeDashoffset}
                transform={`rotate(-90 ${size / 2} ${size / 2})`}
                style={{
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                  filter: isHovered ? "drop-shadow(0 0 8px rgba(255,255,255,0.4))" : "none"
                }}
                onMouseEnter={() => setHoveredIdx(slice.idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              />
            );
          })}
        </svg>

        {/* Center Text */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            pointerEvents: "none"
          }}
        >
          {activeCategory ? (
            <>
              <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 600 }}>
                {activeCategory.name}
              </span>
              <span style={{ fontSize: "1.1rem", fontWeight: 800, color: activeCategory.color }}>
                {activeCategory.percentage}%
              </span>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                {formatCurrency(activeCategory.amount, isPrivacyMode)}
              </span>
            </>
          ) : (
            <>
              <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 0.5 }}>
                Total Despesas
              </span>
              <span style={{ fontSize: "1.15rem", fontWeight: 800, color: "var(--text-primary)" }}>
                {formatCurrency(totalExpense, isPrivacyMode)}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Legend List */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1, minWidth: 200, maxHeight: 220, overflowY: "auto" }}>
        {categories.map((cat, idx) => (
          <div
            key={idx}
            onMouseEnter={() => setHoveredIdx(idx)}
            onMouseLeave={() => setHoveredIdx(null)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "6px 10px",
              borderRadius: "var(--radius-sm)",
              background: hoveredIdx === idx ? "var(--bg-card-hover)" : "transparent",
              cursor: "pointer",
              transition: "background var(--transition-fast)"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.85rem" }}>
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: cat.color }} />
              <span style={{ fontWeight: 500 }}>{cat.name}</span>
            </div>
            <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-secondary)" }}>
              {cat.percentage}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
