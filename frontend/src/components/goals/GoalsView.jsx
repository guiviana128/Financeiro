import React, { useState } from "react";
import { Plus, Target, ShieldCheck } from "lucide-react";
import { useFinance } from "../../context/FinanceContext";
import { GoalCard } from "./GoalCard";
import { AddGoalModal } from "./AddGoalModal";
import { DepositGoalModal } from "./DepositGoalModal";
import { StatCard } from "../common/StatCard";

export const GoalsView = () => {
  const { goals, addGoal, updateGoal, removeGoal } = useFinance();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedGoalForDeposit, setSelectedGoalForDeposit] = useState(null);

  const totalSaved = goals.reduce((acc, g) => acc + (g.current_amount || 0), 0);
  const totalTarget = goals.reduce((acc, g) => acc + (g.target_amount || 0), 0);
  const overallPct = totalTarget > 0 ? ((totalSaved / totalTarget) * 100).toFixed(1) : 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Goals KPIs */}
      <div className="kpi-cards-grid">
        <StatCard
          label="Total Acumulado em Metas"
          value={totalSaved}
          subtitle={`${overallPct}% do objetivo geral`}
          iconName="PiggyBank"
          iconBg="rgba(16, 185, 129, 0.15)"
          iconColor="#10b981"
          variant="income"
        />
        <StatCard
          label="Objetivo Geral Total"
          value={totalTarget}
          subtitle={`${goals.length} metas cadastradas`}
          iconName="Target"
          iconBg="rgba(99, 102, 241, 0.15)"
          iconColor="#6366f1"
          variant="balance"
        />
        <StatCard
          label="Metas Concluídas"
          value={`${goals.filter((g) => g.current_amount >= g.target_amount).length} de ${goals.length}`}
          subtitle="Sonhos atingidos 🎉"
          iconName="CheckCircle2"
          iconBg="rgba(6, 182, 212, 0.15)"
          iconColor="#06b6d4"
          variant="savings"
        />
      </div>

      {/* Header & Add Button */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700 }}>Metas & Cofrinhos Financeiros</h2>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
            Acompanhe o progresso das suas reservas, viagens e sonhos materiais.
          </p>
        </div>

        <button className="btn btn-primary" onClick={() => setIsAddModalOpen(true)}>
          <Plus size={18} />
          <span>Criar Nova Meta</span>
        </button>
      </div>

      {/* Goals Grid */}
      {goals.length === 0 ? (
        <div className="glass-panel" style={{ padding: 40, textAlign: "center", color: "var(--text-muted)" }}>
          Nenhuma meta cadastrada. Crie uma meta como Reserva de Emergência ou Viagem para começar a poupar!
        </div>
      ) : (
        <div className="goals-grid">
          {goals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onDelete={removeGoal}
              onDeposit={(g) => setSelectedGoalForDeposit(g)}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <AddGoalModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={addGoal}
      />

      <DepositGoalModal
        isOpen={!!selectedGoalForDeposit}
        onClose={() => setSelectedGoalForDeposit(null)}
        goal={selectedGoalForDeposit}
        onUpdate={updateGoal}
      />
    </div>
  );
};
