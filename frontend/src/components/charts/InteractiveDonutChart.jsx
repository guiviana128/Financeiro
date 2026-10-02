import React, { useState } from "react";
import { formatCurrency } from "../../utils/formatters";

export const InteractiveDonutChart = ({ categories = [], totalExpense = 5645.90 }) => {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const displayExpense = totalExpense || 5645.90;

  const size = 190;
  const strokeWidth = 24;
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
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Base Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="#f1f5f9"
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
              stroke={slice.color || "#0d9488"}
              strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
              strokeDasharray={slice.strokeDasharray}
              strokeDashoffset={slice.strokeDashoffset}
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
              style={{
                transition: "all 0.25s ease",
                cursor: "pointer",
                filter: isHovered ? "drop-shadow(0 2px 6px rgba(0,0,0,0.2))" : "none"
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
            <span style={{ fontSize: "0.72rem", color: "var(--text-secondary)", fontWeight: 600 }}>
              {activeCategory.name}
            </span>
            <span style={{ fontSize: "1.05rem", fontWeight: 800, color: activeCategory.color }}>
              {activeCategory.percentage}%
            </span>
            <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
              {formatCurrency(activeCategory.amount)}
            </span>
          </>
        ) : (
          <>
            <span style={{ fontSize: "1.05rem", fontWeight: 800, color: "var(--text-primary)" }}>
              {formatCurrency(displayExpense)}
            </span>
            <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 500 }}>
              no mês
            </span>
          </>
        )}
      </div>
    </div>
  );
};
