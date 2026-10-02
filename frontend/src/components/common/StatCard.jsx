import React from "react";
import { formatCurrency } from "../../utils/formatters";
import { useFinance } from "../../context/FinanceContext";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Percent,
  PiggyBank,
  ShieldCheck,
  AlertCircle,
  Clock
} from "lucide-react";

export const StatCard = ({
  label,
  value,
  subtitle,
  iconName = "Wallet",
  iconBg = "#eff6ff",
  iconColor = "#3b82f6",
  badgeText,
  badgeType = "up", // up, down, neutral
  sparklineType = "none", // spark-red, spark-green, bars-green, bars-red, progress
  progressPct = 0
}) => {
  const { isPrivacyMode } = useFinance();

  const renderIcon = () => {
    switch (iconName) {
      case "Wallet":
        return <Wallet size={19} color={iconColor} />;
      case "TrendingUp":
        return <TrendingUp size={19} color={iconColor} />;
      case "TrendingDown":
        return <TrendingDown size={19} color={iconColor} />;
      case "CreditCard":
        return <CreditCard size={19} color={iconColor} />;
      case "Percent":
      case "PiggyBank":
        return <Percent size={19} color={iconColor} />;
      case "ShieldCheck":
        return <ShieldCheck size={19} color={iconColor} />;
      case "Clock":
        return <Clock size={19} color={iconColor} />;
      case "AlertCircle":
        return <AlertCircle size={19} color={iconColor} />;
      default:
        return <Wallet size={19} color={iconColor} />;
    }
  };

  const renderSparkline = () => {
    if (sparklineType === "spark-red") {
      return (
        <svg width="48" height="24" viewBox="0 0 48 24" fill="none">
          <path d="M2 6 Q 16 18, 30 10 T 46 20" stroke="#f43f5e" strokeWidth="2" fill="none" strokeLinecap="round" />
        </svg>
      );
    }
    if (sparklineType === "spark-green") {
      return (
        <svg width="48" height="24" viewBox="0 0 48 24" fill="none">
          <path d="M2 18 Q 16 20, 28 8 T 46 4" stroke="#10b981" strokeWidth="2" fill="none" strokeLinecap="round" />
        </svg>
      );
    }
    if (sparklineType === "bars-green") {
      return (
        <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 20 }}>
          <div style={{ width: 4, height: 8, background: "#10b981", borderRadius: 1 }} />
          <div style={{ width: 4, height: 14, background: "#10b981", borderRadius: 1 }} />
          <div style={{ width: 4, height: 10, background: "#10b981", borderRadius: 1 }} />
          <div style={{ width: 4, height: 18, background: "#10b981", borderRadius: 1 }} />
        </div>
      );
    }
    if (sparklineType === "bars-red") {
      return (
        <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 20 }}>
          <div style={{ width: 4, height: 12, background: "#f43f5e", borderRadius: 1 }} />
          <div style={{ width: 4, height: 8, background: "#f43f5e", borderRadius: 1 }} />
          <div style={{ width: 4, height: 16, background: "#f43f5e", borderRadius: 1 }} />
          <div style={{ width: 4, height: 20, background: "#f43f5e", borderRadius: 1 }} />
        </div>
      );
    }
    return null;
  };

  return (
    <div className="kpi-card">
      <div>
        <div className="kpi-top">
          <div className="kpi-icon-box" style={{ background: iconBg }}>
            {renderIcon()}
          </div>
          {badgeText && (
            <span className={`kpi-badge ${badgeType}`}>
              {badgeText}
            </span>
          )}
        </div>

        <div className="kpi-label">{label}</div>
        <div className="kpi-value">
          {typeof value === "number" ? formatCurrency(value, isPrivacyMode) : value}
        </div>
      </div>

      <div>
        {sparklineType === "progress" ? (
          <div>
            {subtitle && <div className="kpi-subtitle" style={{ marginBottom: 6 }}>{subtitle}</div>}
            <div className="kpi-progress-bar-container">
              <div className="kpi-progress-track">
                <div
                  className="kpi-progress-fill"
                  style={{
                    width: `${Math.min(100, Math.max(0, progressPct))}%`,
                    background: iconColor || "#8b5cf6"
                  }}
                />
              </div>
              <span className="kpi-progress-pct">{progressPct}%</span>
            </div>
          </div>
        ) : (
          <div className="kpi-bottom">
            <div className="kpi-subtitle">{subtitle}</div>
            <div className="kpi-sparkline">{renderSparkline()}</div>
          </div>
        )}
      </div>
    </div>
  );
};
