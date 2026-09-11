import React, { useState } from "react";
import { Modal } from "../common/Modal";
import { useFinance } from "../../context/FinanceContext";

export const AddBudgetModal = ({ isOpen, onClose, initialData = null }) => {
  const { categories, saveBudget, selectedMonth } = useFinance();
  const expenseCategories = categories.filter((c) => c.type === "expense" || c.type === "both");

  const [categoryId, setCategoryId] = useState(() => initialData?.category_id || (expenseCategories[0]?.id || ""));
  const [allocatedAmount, setAllocatedAmount] = useState(() => initialData?.allocated_amount || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!allocatedAmount || parseFloat(allocatedAmount) <= 0) return;

    saveBudget({
      category_id: parseInt(categoryId || expenseCategories[0]?.id, 10),
      allocated_amount: parseFloat(allocatedAmount)
    });

    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Definir Teto de Gasto (Orçamento)">
      <form onSubmit={handleSubmit}>
        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">Categoria de Gasto</label>
            <select
              className="form-select"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
            >
              {expenseCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Limite Mensal Planejado (R$)</label>
            <input
              type="number"
              step="0.01"
              min="1"
              placeholder="Ex: 800,00"
              className="form-input"
              value={allocatedAmount}
              onChange={(e) => setAllocatedAmount(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancelar
          </button>
          <button type="submit" className="btn btn-primary">
            Salvar Orçamento
          </button>
        </div>
      </form>
    </Modal>
  );
};
