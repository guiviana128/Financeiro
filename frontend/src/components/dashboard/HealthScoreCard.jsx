import React from "react";
import { Sparkles, CheckCircle2, AlertTriangle } from "lucide-react";

export const HealthScoreCard = ({ score = 85, status = "Excelente", tips = [] }) => {
  const getScoreColor = () => {
    if (score >= 80) return "#10b981";
    if (score >= 60) return "#3b82f6";
    if (score >= 40) return "#f59e0b";
    return "#f43f5e";
  };

  const color = getScoreColor();

  return (
    <div className="health-score-box">
      <div className="score-circle-wrapper">
        <svg viewBox="0 0 100 100" width="100" height="100">
          <circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth="10"
          />
          <circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeDasharray={264}
            strokeDashoffset={264 - (264 * score) / 100}
            strokeLinecap="round"
            transform="rotate(-90 50 50)"
            style={{ transition: "stroke-dashoffset 1s ease" }}
          />
        </svg>
        <div style={{ position: "absolute", textAlign: "center" }}>
          <div className="score-number" style={{ color }}>{score}</div>
          <div className="score-max">/100</div>
        </div>
      </div>

      <div className="score-info">
        <div className="score-title">
          <Sparkles size={20} color={color} />
          <span>Saúde Financeira: {status}</span>
          <span
            className="badge"
            style={{
              background: `${color}20`,
              color: color,
              border: `1px solid ${color}40`
            }}
          >
            {score >= 60 ? "Estável" : "Requer Atenção"}
          </span>
        </div>

        <div className="score-tips-list">
          {tips.map((tip, idx) => (
            <div key={idx} className="score-tip-item">
              <CheckCircle2 size={16} color={color} style={{ flexShrink: 0 }} />
              <span>{tip}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
