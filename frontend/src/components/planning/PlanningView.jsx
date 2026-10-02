import React, { useState } from "react";
import { Plus, ListFilter, Trophy, GraduationCap, ChevronRight, Lightbulb, PieChart } from "lucide-react";
import { useFinance } from "../../context/FinanceContext";
import { Rule503020Card } from "./Rule503020Card";
import { CategoryBudgetList } from "./CategoryBudgetList";
import { AddBudgetModal } from "./AddBudgetModal";
import { formatCurrency } from "../../utils/formatters";

export const PlanningView = () => {
  const { budgets, rule503020, removeBudget } = useFinance();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const totalIncome = rule503020?.total_income || 5000.00;
  const needsSpent = rule503020?.needs_spent ?? 3100.00;
  const wantsSpent = rule503020?.wants_spent ?? 1000.00;
  const savingsSpent = rule503020?.savings_spent ?? 900.00;

  const totalSpent = needsSpent + wantsSpent + savingsSpent;
  const baseForPct = totalIncome > 0 ? totalIncome : (totalSpent > 0 ? totalSpent : 1);

  const needsPct = Math.round((needsSpent / baseForPct) * 100);
  const wantsPct = Math.round((wantsSpent / baseForPct) * 100);
  const savingsPct = Math.round((savingsSpent / baseForPct) * 100);

  // SVG Circumference for radius 50: 2 * PI * 50 = 314.16
  const circ = 314.16;
  const needsDash = ((needsPct / 100) * circ).toFixed(1);
  const wantsDash = ((wantsPct / 100) * circ).toFixed(1);
  const savingsDash = ((savingsPct / 100) * circ).toFixed(1);
  const wantsOffset = (-parseFloat(needsDash)).toFixed(1);
  const savingsOffset = (-(parseFloat(needsDash) + parseFloat(wantsDash))).toFixed(1);

  return (
    <div className="planning-container">
      {/* Top Banner Notice */}
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <div className="planning-notice-pill">
          <Lightbulb size={16} color="#d97706" />
          <span>A regra 50/30/20 te ajuda a equilibrar o presente e o futuro, distribuindo sua renda de forma inteligente.</span>
        </div>
      </div>

      {/* 3 Large Pillar Cards (50% / 30% / 20%) */}
      <Rule503020Card ruleData={rule503020} />

      {/* Main Split Layout: Left Table / Right Insights */}
      <div className="planning-main-grid">
        {/* Left Table Section */}
        <div className="budget-table-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: 8 }}>
                <ListFilter size={18} color="#0d9488" />
                <span>Orçamento por Categoria</span>
              </h3>
              <p style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
                Defina limites máximos de gastos para não se perder nas contas do mês.
              </p>
            </div>

            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setIsAddModalOpen(true)}
            >
              <Plus size={16} />
              <span>Definir Novo Orçamento</span>
            </button>
          </div>

          <CategoryBudgetList budgets={budgets} onDelete={removeBudget} />
        </div>

        {/* Right Insights Column */}
        <div className="planning-right-column">
          {/* Card: Visão do Mês */}
          <div className="vis-mes-card">
            <div className="vis-mes-header">
              <span className="vis-mes-title">
                <PieChart size={18} color="#0d9488" />
                <span>Visão do Mês</span>
              </span>
              <span className="vis-mes-sub">Distribuição da sua renda atual.</span>
            </div>

            <div className="vis-donut-wrapper">
              {/* Donut graphic */}
              <div style={{ position: "relative", width: 140, height: 140, flexShrink: 0 }}>
                <svg width="140" height="140" viewBox="0 0 140 140">
                  <circle cx="70" cy="70" r="50" fill="none" stroke="#0d9488" strokeWidth="18" strokeDasharray={`${needsDash} 314`} strokeDashoffset="0" transform="rotate(-90 70 70)" />
                  <circle cx="70" cy="70" r="50" fill="none" stroke="#f59e0b" strokeWidth="18" strokeDasharray={`${wantsDash} 314`} strokeDashoffset={wantsOffset} transform="rotate(-90 70 70)" />
                  <circle cx="70" cy="70" r="50" fill="none" stroke="#f43f5e" strokeWidth="18" strokeDasharray={`${savingsDash} 314`} strokeDashoffset={savingsOffset} transform="rotate(-90 70 70)" />
                </svg>
                <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
                  <span style={{ fontSize: "0.88rem", fontWeight: 800, color: "var(--text-primary)" }}>{formatCurrency(totalIncome)}</span>
                  <span style={{ fontSize: "0.65rem", color: "var(--text-muted)" }}>Renda do mês</span>
                </div>
              </div>

              {/* Legend */}
              <div className="vis-legend-list">
                <div className="vis-legend-item">
                  <div className="vis-legend-item-left">
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#0d9488" }} />
                    <span>Necessidades</span>
                  </div>
                  <div className="vis-legend-item-right">{needsPct}% • {formatCurrency(needsSpent)}</div>
                </div>

                <div className="vis-legend-item">
                  <div className="vis-legend-item-left">
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#f59e0b" }} />
                    <span>Desejos & Lazer</span>
                  </div>
                  <div className="vis-legend-item-right">{wantsPct}% • {formatCurrency(wantsSpent)}</div>
                </div>

                <div className="vis-legend-item">
                  <div className="vis-legend-item-left">
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#f43f5e" }} />
                    <span>Metas & Poupança</span>
                  </div>
                  <div className="vis-legend-item-right">{savingsPct}% • {formatCurrency(savingsSpent)}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Motivational Card 1: Continue no caminho! */}
          <div className="planning-insight-card">
            <div className="insight-icon-circle" style={{ background: "#ecfdf5", color: "#10b981" }}>
              <Trophy size={18} />
            </div>
            <div className="insight-text-box">
              <span className="insight-title">Continue no caminho! 🎯</span>
              <p className="insight-desc">
                Você está 10% abaixo da meta de investimentos deste mês. Mais R$ 100,00 para atingir o ideal.
              </p>
            </div>
            <ChevronRight size={16} color="#94a3b8" />
          </div>

          {/* Motivational Card 2: Dica do FinFlow Pro */}
          <div className="planning-insight-card">
            <div className="insight-icon-circle" style={{ background: "#eff6ff", color: "#3b82f6" }}>
              <GraduationCap size={18} />
            </div>
            <div className="insight-text-box">
              <span className="insight-title">Dica do FinFlow Pro</span>
              <p className="insight-desc">
                Revise seus gastos nas categorias que estão acima do ideal e veja onde é possível ajustar. Pequenos ajustes hoje geram grandes resultados no futuro.
              </p>
            </div>
            <ChevronRight size={16} color="#94a3b8" />
          </div>
        </div>
      </div>

      {/* Add Budget Modal */}
      <AddBudgetModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
};
