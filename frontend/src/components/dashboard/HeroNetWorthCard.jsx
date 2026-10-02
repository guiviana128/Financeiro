import React from "react";
import { Eye, EyeOff, TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { formatCurrency } from "../../utils/formatters";
import { useFinance } from "../../context/FinanceContext";

export const HeroNetWorthCard = ({
  netWorth = 445890.00,
  monthlyBalance = 5200.00,
  monthlyIncome = 8900.00,
  monthlyExpense = 3700.00,
  growthRate = 12
}) => {
  const { isPrivacyMode, togglePrivacyMode } = useFinance();

  return (
    <div className="hero-networth-card">
      <div className="hero-card-grid">
        {/* Left column: Patrimônio Líquido */}
        <div className="hero-networth-col">
          <div className="hero-label-row">
            <span className="hero-label">Patrimônio Líquido</span>
            <button
              type="button"
              className="hero-eye-btn"
              onClick={togglePrivacyMode}
              title={isPrivacyMode ? "Mostrar valores" : "Ocultar valores"}
            >
              {isPrivacyMode ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <div className="hero-val-huge">
            {formatCurrency(netWorth, isPrivacyMode)}
          </div>

          <div className="hero-growth-badge">
            <span className="hero-pct-pill">
              <TrendingUp size={13} />
              <span>+{growthRate}%</span>
            </span>
            <span className="hero-growth-text">em relação ao mês anterior</span>
          </div>
        </div>

        {/* Right column: Saldo do Mês & Summary Box */}
        <div className="hero-balance-box">
          <div className="hero-balance-header">
            <span className="hero-label">Saldo do Mês</span>
            <div className="hero-val-balance">
              {formatCurrency(monthlyBalance, isPrivacyMode)}
            </div>
          </div>

          <div className="hero-flow-summary">
            <div className="hero-flow-item income">
              <div className="hero-flow-icon green">
                <ArrowUpRight size={14} />
              </div>
              <div className="hero-flow-info">
                <span className="hero-flow-label">Receitas</span>
                <span className="hero-flow-val">{formatCurrency(monthlyIncome, isPrivacyMode)}</span>
              </div>
            </div>

            <div className="hero-flow-item expense">
              <div className="hero-flow-icon red">
                <ArrowDownRight size={14} />
              </div>
              <div className="hero-flow-info">
                <span className="hero-flow-label">Despesas</span>
                <span className="hero-flow-val">{formatCurrency(monthlyExpense, isPrivacyMode)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Mint Waves & Silhouette */}
      <div className="hero-waves-illustration" aria-hidden="true">
        <svg width="180" height="90" viewBox="0 0 220 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0 120 C 60 70, 110 110, 220 40 L 220 120 Z"
            fill="url(#mintGrad1)"
            opacity="0.3"
          />
          <path
            d="M30 120 C 90 85, 140 100, 220 60 L 220 120 Z"
            fill="url(#mintGrad2)"
            opacity="0.45"
          />
          <defs>
            <linearGradient id="mintGrad1" x1="0" y1="40" x2="220" y2="120" gradientUnits="userSpaceOnUse">
              <stop stopColor="#0d9488" stopOpacity="0.2" />
              <stop offset="1" stopColor="#14b8a6" stopOpacity="0.05" />
            </linearGradient>
            <linearGradient id="mintGrad2" x1="30" y1="60" x2="220" y2="120" gradientUnits="userSpaceOnUse">
              <stop stopColor="#10b981" stopOpacity="0.25" />
              <stop offset="1" stopColor="#34d399" stopOpacity="0.05" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
};
