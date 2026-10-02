import React from "react";
import { Activity, Lightbulb } from "lucide-react";

export const HealthScoreCard = ({ score = 60, status = "Bom", tips = [] }) => {
  const displayScore = score || 60;
  const displayStatus = status || "Bom";

  const getScoreColor = () => {
    if (displayScore >= 75) return "#10b981";
    if (displayScore >= 50) return "#0d9488";
    if (displayScore >= 35) return "#f59e0b";
    return "#f43f5e";
  };

  const scoreColor = getScoreColor();
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const strokeOffset = circumference - (circumference * displayScore) / 100;

  return (
    <div className="health-score-card">
      <div className="health-banner-left">
        {/* Ring Progress Indicator */}
        <div className="score-circle-container">
          <svg width="86" height="86" viewBox="0 0 86 86">
            <circle
              cx="43"
              cy="43"
              r={radius}
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="8"
            />
            <circle
              cx="43"
              cy="43"
              r={radius}
              fill="none"
              stroke={scoreColor}
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={strokeOffset}
              strokeLinecap="round"
              transform="rotate(-90 43 43)"
              style={{ transition: "stroke-dashoffset 0.8s ease" }}
            />
          </svg>
          <div className="score-circle-text">
            <span className="score-percent-val" style={{ color: scoreColor }}>{displayScore}%</span>
            <span className="score-percent-label">da meta</span>
          </div>
        </div>

        {/* Text Content */}
        <div className="health-banner-content">
          <div className="health-header-row">
            <div className="health-icon-badge">
              <Activity size={18} />
            </div>
            <h2 className="health-title">Saúde Financeira: {displayStatus}</h2>
            <span className="health-status-badge">Estável</span>
          </div>

          <p className="health-desc">
            Seus gastos estão dentro do esperado para este mês. Revise despesas variáveis e mantenha o foco nos seus objetivos.
          </p>

          <a className="health-link" href="#insights" onClick={(e) => e.preventDefault()}>
            <Lightbulb size={14} />
            <span>Veja insights e dicas personalizadas →</span>
          </a>
        </div>
      </div>

      {/* Decorative Financial Growth Vector Illustration matching screenshot */}
      <div className="health-banner-illustration">
        <svg width="180" height="90" viewBox="0 0 180 90" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Subtle rising chart bars */}
          <rect x="10" y="60" width="10" height="24" rx="3" fill="#34d399" fillOpacity="0.25" />
          <rect x="25" y="48" width="10" height="36" rx="3" fill="#34d399" fillOpacity="0.35" />
          <rect x="40" y="34" width="10" height="50" rx="3" fill="#34d399" fillOpacity="0.45" />
          <rect x="55" y="20" width="10" height="64" rx="3" fill="#34d399" fillOpacity="0.55" />

          {/* Growth curve arrow */}
          <path d="M8 72 C 30 68, 48 45, 78 12" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M68 12 H 78 V 22" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

          {/* Plant Pot */}
          <path d="M124 58 H156 L151 84 H129 Z" fill="#94a3b8" fillOpacity="0.75" />
          <path d="M121 54 H159 V58 H121 Z" fill="#64748b" rx="2" />

          {/* Plant Leaves */}
          <path d="M140 54 Q 140 16, 160 20 Q 152 42, 140 54 Z" fill="#10b981" />
          <path d="M140 54 Q 140 24, 118 26 Q 124 46, 140 54 Z" fill="#059669" />
          <path d="M140 54 Q 140 6, 142 4 Q 148 30, 140 54 Z" fill="#34d399" />
          <path d="M140 54 Q 154 36, 168 44 Q 156 54, 140 54 Z" fill="#047857" />
          <path d="M140 54 Q 126 38, 114 46 Q 124 54, 140 54 Z" fill="#10b981" />
        </svg>
      </div>
    </div>
  );
};
