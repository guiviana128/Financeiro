import React from "react";
import { formatCurrency } from "../../utils/formatters";
import { useFinance } from "../../context/FinanceContext";
import { Icon } from "./Icon";

export const StatCard = ({
  label,
  value,
  subtitle,
  iconName,
  iconBg = "rgba(99, 102, 241, 0.15)",
  iconColor = "#6366f1",
  variant = "balance" // balance, income, expense, cards, savings
}) => {
  const { isPrivacyMode } = useFinance();

  return (
    <div className={`glass-card kpi-card kpi-${variant}`}>
      <div className="kpi-top">
        <span className="kpi-label">{label}</span>
        <div className="kpi-icon-wrapper" style={{ background: iconBg }}>
          <Icon name={iconName} color={iconColor} size={20} />
        </div>
      </div>
      <div>
        <div className="kpi-value">
          {typeof value === "number" ? formatCurrency(value, isPrivacyMode) : value}
        </div>
        {subtitle && <div className="kpi-subtitle">{subtitle}</div>}
      </div>
    </div>
  );
};
