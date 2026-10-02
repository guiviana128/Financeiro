import React, { useState } from "react";
import { Plus, Target, Trophy, Coins, ChevronRight, Zap, BarChart2, Shield } from "lucide-react";
import { useFinance } from "../../context/FinanceContext";
import { GoalCard } from "./GoalCard";
import { AddGoalModal } from "./AddGoalModal";
import { DepositGoalModal } from "./DepositGoalModal";
import { formatCurrency } from "../../utils/formatters";

export const GoalsView = () => {
  const { goals, addGoal, updateGoal, removeGoal } = useFinance();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedGoalForDeposit, setSelectedGoalForDeposit] = useState(null);

  // 4 Curated goals to match Image 4
  const defaultGoals = [
    {
      id: 1,
      title: "Viagem para Europa",
      subtitle: "Conhecer Paris, Roma e Barcelona",
      imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80",
      current_amount: 9000.00,
      target_amount: 15000.00,
      progress_percentage: 60,
      targetDate: "Dez 2026",
      iconType: "plane",
      is_completed: false
    },
    {
      id: 2,
      title: "MacBook Pro",
      subtitle: "Equipamento para trabalho e estudos",
      imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80",
      current_amount: 6000.00,
      target_amount: 15000.00,
      progress_percentage: 40,
      targetDate: "Mar 2027",
      iconType: "laptop",
      is_completed: false
    },
    {
      id: 3,
      title: "Entrada do Apê",
      subtitle: "Reserva para a entrada do meu imóvel",
      imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80",
      current_amount: 3750.00,
      target_amount: 25000.00,
      progress_percentage: 15,
      targetDate: "Dez 2028",
      iconType: "home",
      is_completed: false
    },
    {
      id: 4,
      title: "Reserva de Emergência",
      subtitle: "Garantir tranquilidade financeira",
      imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&auto=format&fit=crop&q=80",
      current_amount: 5000.00,
      target_amount: 5000.00,
      progress_percentage: 100,
      targetDate: "Ago 2026",
      iconType: "palmtree",
      is_completed: true
    }
  ];

  const goalsToRender = (goals && goals.length > 0) ? goals : defaultGoals;

  const totalSaved = goalsToRender.reduce((acc, g) => acc + (parseFloat(g.current_amount) || 0), 0);
  const totalTarget = goalsToRender.reduce((acc, g) => acc + (parseFloat(g.target_amount) || 0), 0);
  const overallPct = totalTarget > 0 ? Math.min(100, Math.round((totalSaved / totalTarget) * 100)) : 0;
  const completedGoals = goalsToRender.filter(g => (g.current_amount >= g.target_amount) || g.is_completed).length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* 3 KPI Summary Cards */}
      <div className="kpi-cards-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
        {/* Card 1 */}
        <div className="kpi-card">
          <div className="kpi-top">
            <div className="kpi-icon-box" style={{ background: "#ecfdf5", color: "#10b981" }}>
              <Coins size={19} />
            </div>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#ecfdf5", color: "#0d9488", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ChevronRight size={16} />
            </div>
          </div>
          <div className="kpi-label">TOTAL ACUMULADO EM METAS</div>
          <div className="kpi-value" style={{ color: "#0f172a" }}>
            {formatCurrency(totalSaved)}
          </div>
          <div style={{ fontSize: "0.74rem", color: "var(--text-muted)", marginTop: 4 }}>
            {overallPct}% do objetivo geral
          </div>
          <div className="kpi-progress-bar-container" style={{ marginTop: 8 }}>
            <div className="kpi-progress-track">
              <div className="kpi-progress-fill" style={{ width: `${overallPct}%`, background: "#0d9488" }} />
            </div>
            <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 700 }}>
              {formatCurrency(totalTarget)}
            </span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="kpi-card">
          <div className="kpi-top">
            <div className="kpi-icon-box" style={{ background: "#f5f3ff", color: "#8b5cf6" }}>
              <Target size={19} />
            </div>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#f5f3ff", color: "#8b5cf6", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ChevronRight size={16} />
            </div>
          </div>
          <div className="kpi-label">OBJETIVO GERAL TOTAL</div>
          <div className="kpi-value" style={{ color: "#0f172a" }}>
            {formatCurrency(totalTarget)}
          </div>
          <div style={{ fontSize: "0.74rem", color: "var(--text-muted)", marginTop: 4 }}>
            {goalsToRender.length} {goalsToRender.length === 1 ? "meta cadastrada" : "metas cadastradas"}
          </div>
          <div className="kpi-progress-track" style={{ marginTop: 8 }}>
            <div className="kpi-progress-fill" style={{ width: `${overallPct}%`, background: "#8b5cf6" }} />
          </div>
        </div>

        {/* Card 3 */}
        <div className="kpi-card">
          <div className="kpi-top">
            <div className="kpi-icon-box" style={{ background: "#ecfeff", color: "#06b6d4" }}>
              <Trophy size={19} />
            </div>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#ecfeff", color: "#06b6d4", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ChevronRight size={16} />
            </div>
          </div>
          <div className="kpi-label">METAS CONCLUÍDAS</div>
          <div className="kpi-value" style={{ color: "#0f172a" }}>
            {completedGoals} de {goalsToRender.length}
          </div>
          <div style={{ fontSize: "0.74rem", color: "var(--text-muted)", marginTop: 4 }}>
            {completedGoals > 0 ? "Sonhos atingidos 🎉" : "Em andamento 🚀"}
          </div>
        </div>
      </div>

      {/* Header & Add Button */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text-primary)" }}>
            Minhas Metas e Cofrinhos
          </h2>
          <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>
            Acompanhe o progresso das suas reservas, viagens e sonhos materiais.
          </p>
        </div>

        <button className="btn btn-primary" onClick={() => setIsAddModalOpen(true)}>
          <Plus size={17} />
          <span>Criar Nova Meta</span>
        </button>
      </div>

      {/* Goals Photo Cards Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
        {goalsToRender.map((goal) => (
          <GoalCard
            key={goal.id}
            goal={goal}
            onDelete={removeGoal}
            onDeposit={(g) => setSelectedGoalForDeposit(g)}
          />
        ))}
      </div>

      {/* Motivational Banner at Bottom */}
      <div
        className="glass-panel"
        style={{
          padding: "20px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 20,
          background: "#ffffff",
          borderRadius: "var(--radius-lg)"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, flex: 1, minWidth: 280 }}>
          <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#ccfbf1", color: "#0d9488", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Target size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: "0.98rem", fontWeight: 800, color: "var(--text-primary)" }}>
              Transforme sonhos em realidade
            </h3>
            <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", maxWidth: 540 }}>
              Defina metas claras, acompanhe seu progresso e mantenha o foco no que realmente importa. Cada pequena contribuição te aproxima dos seus grandes sonhos!
            </p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 24, fontSize: "0.82rem", fontWeight: 600 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#ecfdf5", color: "#10b981", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <BarChart2 size={16} />
            </div>
            <span>Acompanhe o progresso</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#fffbeb", color: "#f59e0b", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Zap size={16} />
            </div>
            <span>Mantenha a disciplina</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#fff1f2", color: "#f43f5e", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Trophy size={16} />
            </div>
            <span>Conquiste seus sonhos</span>
          </div>
        </div>
      </div>

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
