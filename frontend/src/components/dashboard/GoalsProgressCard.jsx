import React from "react";
import { Target, Home, Plane, Car } from "lucide-react";
import { formatCurrency } from "../../utils/formatters";

export const GoalsProgressCard = ({ goals = [] }) => {
  const defaultGoals = [
    {
      id: 1,
      title: "Comprar um apê",
      current: 120000.00,
      target: 200000.00,
      pct: 60,
      iconType: "home",
      iconColor: "#f43f5e",
      iconBg: "#fff1f2",
      barColor: "#0d9488"
    },
    {
      id: 2,
      title: "Viagem Europa",
      current: 18000.00,
      target: 25000.00,
      pct: 72,
      iconType: "plane",
      iconColor: "#3b82f6",
      iconBg: "#eff6ff",
      barColor: "#0d9488"
    },
    {
      id: 3,
      title: "Trocar de carro",
      current: 36000.00,
      target: 60000.00,
      pct: 60,
      iconType: "car",
      iconColor: "#64748b",
      iconBg: "#f1f5f9",
      barColor: "#0d9488"
    }
  ];

  const overallPct = 68;
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeOffset = circumference - (circumference * overallPct) / 100;

  const renderIcon = (type, color) => {
    switch (type) {
      case "home":
        return <Home size={16} color={color} />;
      case "plane":
        return <Plane size={16} color={color} />;
      case "car":
        return <Car size={16} color={color} />;
      default:
        return <Target size={16} color={color} />;
    }
  };

  return (
    <div className="goals-progress-card">
      {/* Header */}
      <div className="goals-progress-header">
        <div className="goals-progress-title-box">
          <div className="goals-progress-icon-circle">
            <Target size={17} />
          </div>
          <h3 className="goals-progress-title">Progresso das suas metas</h3>
        </div>
      </div>

      {/* Content */}
      <div className="goals-progress-body">
        {/* Left Ring */}
        <div className="goals-ring-container">
          <svg width="105" height="105" viewBox="0 0 105 105">
            <circle
              cx="52.5"
              cy="52.5"
              r={radius}
              fill="none"
              stroke="#f1f5f9"
              strokeWidth="9"
            />
            <circle
              cx="52.5"
              cy="52.5"
              r={radius}
              fill="none"
              stroke="#0d9488"
              strokeWidth="9"
              strokeDasharray={circumference}
              strokeDashoffset={strokeOffset}
              strokeLinecap="round"
              transform="rotate(-90 52.5 52.5)"
            />
          </svg>
          <div className="goals-ring-text">
            <span className="goals-ring-val">{overallPct}%</span>
            <span className="goals-ring-sub">das metas</span>
          </div>
        </div>

        {/* Right Goals List */}
        <div className="goals-progress-list">
          {defaultGoals.map((g) => (
            <div key={g.id} className="goals-item-row">
              <div className="goals-item-top">
                <div className="goals-item-left">
                  <div className="goals-item-icon-box" style={{ background: g.iconBg }}>
                    {renderIcon(g.iconType, g.iconColor)}
                  </div>
                  <div>
                    <span className="goals-item-title">{g.title}</span>
                    <span className="goals-item-amounts">
                      {formatCurrency(g.current)} de {formatCurrency(g.target)}
                    </span>
                  </div>
                </div>
                <span className="goals-item-pct">{g.pct}%</span>
              </div>

              {/* Progress Bar */}
              <div className="goals-item-bar-track">
                <div
                  className="goals-item-bar-fill"
                  style={{ width: `${g.pct}%`, background: g.barColor }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
