import React from "react";
import { formatCurrency } from "../../utils/formatters";
import { Shield, Sparkles, TrendingUp, HelpCircle } from "lucide-react";

export const Rule503020Card = ({ ruleData }) => {
  if (!ruleData) return null;

  const {
    total_income = 0,
    needs_budget = 0,
    needs_spent = 0,
    wants_budget = 0,
    wants_spent = 0,
    savings_budget = 0,
    savings_spent = 0
  } = ruleData;

  const needsPct = needs_budget > 0 ? (needs_spent / needs_budget) * 100 : 0;
  const wantsPct = wants_budget > 0 ? (wants_spent / wants_budget) * 100 : 0;
  const savingsPct = savings_budget > 0 ? (savings_spent / savings_budget) * 100 : 0;

  const getBarColor = (pct) => {
    if (pct > 100) return "#ef4444";
    if (pct > 80) return "#f59e0b";
    return "#10b981";
  };

  return (
    <div className="rule-50-30-20-card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
        <div>
          <h3 style={{ fontSize: "1.2rem", fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
            <span>Regra Orçamentária 50 / 30 / 20</span>
            <span className="badge badge-info" style={{ fontSize: "0.7rem" }}>
              Planejamento Financeiro
            </span>
          </h3>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
            Baseado na renda total do mês ({formatCurrency(total_income)}).
          </p>
        </div>
      </div>

      <div className="rule-pillars-grid">
        {/* Needs (50%) */}
        <div className="rule-pillar">
          <div className="pillar-header">
            <span className="pillar-title">
              <Shield size={18} color="#6366f1" />
              <span>Necessidades (50%)</span>
            </span>
            <span className="badge badge-neutral">{needsPct.toFixed(0)}%</span>
          </div>
          <div className="pillar-amounts">
            <div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Gasto Atual</div>
              <div className="pillar-spent">{formatCurrency(needs_spent)}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Limite Ideal</div>
              <div className="pillar-budget">{formatCurrency(needs_budget)}</div>
            </div>
          </div>
          <div className="progress-track">
            <div
              className="progress-fill"
              style={{
                width: `${Math.min(100, needsPct)}%`,
                background: getBarColor(needsPct)
              }}
            />
          </div>
          <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
            Moradia, Supermercado, Contas básicas, Saúde e Transporte.
          </p>
        </div>

        {/* Wants (30%) */}
        <div className="rule-pillar">
          <div className="pillar-header">
            <span className="pillar-title">
              <Sparkles size={18} color="#ec4899" />
              <span>Desejos & Lazer (30%)</span>
            </span>
            <span className="badge badge-neutral">{wantsPct.toFixed(0)}%</span>
          </div>
          <div className="pillar-amounts">
            <div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Gasto Atual</div>
              <div className="pillar-spent">{formatCurrency(wants_spent)}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Limite Ideal</div>
              <div className="pillar-budget">{formatCurrency(wants_budget)}</div>
            </div>
          </div>
          <div className="progress-track">
            <div
              className="progress-fill"
              style={{
                width: `${Math.min(100, wantsPct)}%`,
                background: getBarColor(wantsPct)
              }}
            />
          </div>
          <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
            Restaurantes, Streaming, Compras pessoais, Viagens e Hobbies.
          </p>
        </div>

        {/* Savings & Investments (20%) */}
        <div className="rule-pillar">
          <div className="pillar-header">
            <span className="pillar-title">
              <TrendingUp size={18} color="#10b981" />
              <span>Metas & Poupança (20%)</span>
            </span>
            <span className="badge badge-income">{savingsPct.toFixed(0)}%</span>
          </div>
          <div className="pillar-amounts">
            <div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Aportado</div>
              <div className="pillar-spent" style={{ color: "#10b981" }}>{formatCurrency(savings_spent)}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Alvo Mínimo</div>
              <div className="pillar-budget">{formatCurrency(savings_budget)}</div>
            </div>
          </div>
          <div className="progress-track">
            <div
              className="progress-fill"
              style={{
                width: `${Math.min(100, savingsPct)}%`,
                background: "#10b981"
              }}
            />
          </div>
          <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
            Reserva de emergência, Ações, Renda fixa e Sonhos futuros.
          </p>
        </div>
      </div>
    </div>
  );
};
