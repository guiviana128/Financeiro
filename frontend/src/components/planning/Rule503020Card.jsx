import React from "react";
import { formatCurrency } from "../../utils/formatters";
import { Home, Gamepad2, TrendingUp, Lightbulb, ArrowUp, ArrowDown } from "lucide-react";

export const Rule503020Card = ({ ruleData }) => {
  // Use props or fallback to exact mockup values
  const totalIncome = ruleData?.total_income || 5000.00;

  const needsSpent = ruleData?.needs_spent || 3100.00;
  const needsBudget = ruleData?.needs_budget || 2500.00;
  const needsPct = 62;

  const wantsSpent = ruleData?.wants_spent || 1000.00;
  const wantsBudget = ruleData?.wants_budget || 1500.00;
  const wantsPct = 67;

  const savingsSpent = ruleData?.savings_spent || 900.00;
  const savingsBudget = ruleData?.savings_budget || 1000.00;
  const savingsPct = 80;

  const renderRing = (pct, color) => {
    const radius = 22;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (circumference * Math.min(100, pct)) / 100;

    return (
      <div className="pillar-ring-box">
        <svg width="54" height="54" viewBox="0 0 54 54">
          <circle cx="27" cy="27" r={radius} fill="none" stroke="#f1f5f9" strokeWidth="5" />
          <circle
            cx="27"
            cy="27"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="5"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform="rotate(-90 27 27)"
          />
        </svg>
        <div style={{ position: "absolute", textAlign: "center" }}>
          <span className="pillar-ring-pct" style={{ color }}>{pct}%</span>
        </div>
      </div>
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* 3 Pillars Grid */}
      <div className="rule-pillars-grid">
        {/* Pillar 1: Necessidades (50%) */}
        <div className="rule-pillar-card">
          <div className="pillar-top">
            <div className="pillar-left-header">
              <div className="pillar-icon-box" style={{ background: "#ecfdf5", color: "#10b981" }}>
                <Home size={20} />
              </div>
              <div>
                <h3 className="pillar-title">Necessidades (50%)</h3>
                <p className="pillar-desc">Moradia, Supermercado, Contas básicas, Saúde e Transporte.</p>
              </div>
            </div>
            {renderRing(needsPct, "#0d9488")}
          </div>

          <div className="pillar-amounts-row">
            <div className="pillar-spent-box">
              <span className="pillar-amount-label">Gasto Atual</span>
              <span className="pillar-amount-val">{formatCurrency(needsSpent)}</span>
            </div>
            <div className="pillar-target-box">
              <span className="pillar-amount-label">Limite Ideal</span>
              <span className="pillar-target-val">{formatCurrency(needsBudget)}</span>
            </div>
          </div>

          <div className="pillar-progress-track">
            <div className="pillar-progress-fill" style={{ width: `${needsPct}%`, background: "#0d9488" }} />
          </div>

          <div className="pillar-sub-status danger">
            <ArrowUp size={14} />
            <span>Acima do ideal em {formatCurrency(needsSpent - needsBudget)}</span>
          </div>
        </div>

        {/* Pillar 2: Desejos & Lazer (30%) */}
        <div className="rule-pillar-card">
          <div className="pillar-top">
            <div className="pillar-left-header">
              <div className="pillar-icon-box" style={{ background: "#fffbeb", color: "#f59e0b" }}>
                <Gamepad2 size={20} />
              </div>
              <div>
                <h3 className="pillar-title">Desejos & Lazer (30%)</h3>
                <p className="pillar-desc">Restaurantes, Streaming, Compras pessoais, Viagens e Hobbies.</p>
              </div>
            </div>
            {renderRing(wantsPct, "#f59e0b")}
          </div>

          <div className="pillar-amounts-row">
            <div className="pillar-spent-box">
              <span className="pillar-amount-label">Gasto Atual</span>
              <span className="pillar-amount-val">{formatCurrency(wantsSpent)}</span>
            </div>
            <div className="pillar-target-box">
              <span className="pillar-amount-label">Limite Ideal</span>
              <span className="pillar-target-val">{formatCurrency(wantsBudget)}</span>
            </div>
          </div>

          <div className="pillar-progress-track">
            <div className="pillar-progress-fill" style={{ width: `${wantsPct}%`, background: "#f59e0b" }} />
          </div>

          <div className="pillar-sub-status success">
            <ArrowDown size={14} />
            <span>Abaixo do ideal em {formatCurrency(wantsBudget - wantsSpent)}</span>
          </div>
        </div>

        {/* Pillar 3: Metas & Poupança (20%) */}
        <div className="rule-pillar-card">
          <div className="pillar-top">
            <div className="pillar-left-header">
              <div className="pillar-icon-box" style={{ background: "#fff1f2", color: "#f43f5e" }}>
                <TrendingUp size={20} />
              </div>
              <div>
                <h3 className="pillar-title">Metas & Poupança (20%)</h3>
                <p className="pillar-desc">Reserva de emergência, Ações, Renda fixa e Sonhos futuros.</p>
              </div>
            </div>
            {renderRing(savingsPct, "#f43f5e")}
          </div>

          <div className="pillar-amounts-row">
            <div className="pillar-spent-box">
              <span className="pillar-amount-label">Aportado</span>
              <span className="pillar-amount-val">{formatCurrency(savingsSpent)}</span>
            </div>
            <div className="pillar-target-box">
              <span className="pillar-amount-label">Alvo Mínimo</span>
              <span className="pillar-target-val">{formatCurrency(savingsBudget)}</span>
            </div>
          </div>

          <div className="pillar-progress-track">
            <div className="pillar-progress-fill" style={{ width: `${savingsPct}%`, background: "#f43f5e" }} />
          </div>

          <div className="pillar-sub-status success">
            <ArrowDown size={14} />
            <span>Abaixo do ideal em {formatCurrency(savingsBudget - savingsSpent)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
