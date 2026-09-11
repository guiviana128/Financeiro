import React, { useState } from "react";
import { Plus } from "lucide-react";
import { useFinance } from "../../context/FinanceContext";
import { Rule503020Card } from "./Rule503020Card";
import { CategoryBudgetList } from "./CategoryBudgetList";
import { AddBudgetModal } from "./AddBudgetModal";

export const PlanningView = () => {
  const { budgets, rule503020, removeBudget } = useFinance();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <div className="planning-container">
      {/* 50/30/20 Rule Banner */}
      <Rule503020Card ruleData={rule503020} />

      {/* Category Budgets Header & List */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
        <div>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700 }}>Orçamento por Categoria</h2>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
            Defina limites máximos de gastos para não se perder nas contas do mês.
          </p>
        </div>

        <button className="btn btn-primary" onClick={() => setIsAddModalOpen(true)}>
          <Plus size={18} />
          <span>Definir Novo Orçamento</span>
        </button>
      </div>

      <CategoryBudgetList budgets={budgets} onDelete={removeBudget} />

      <AddBudgetModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
};
