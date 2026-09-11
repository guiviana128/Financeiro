import React, { useState } from "react";
import { Modal } from "../common/Modal";
import { CustomDatePicker } from "../common/CustomDatePicker";

const GOAL_ICONS = [
  { name: "ShieldCheck", label: "Reserva" },
  { name: "Plane", label: "Viagem" },
  { name: "Car", label: "Carro" },
  { name: "Home", label: "Imóvel" },
  { name: "Laptop", label: "Tech" },
  { name: "GraduationCap", label: "Educação" },
  { name: "HeartPulse", label: "Saúde" },
  { name: "Target", label: "Geral" }
];

const GOAL_COLORS = ["#10b981", "#6366f1", "#f59e0b", "#ec4899", "#06b6d4", "#8b5cf6", "#f43f5e"];

export const AddGoalModal = ({ isOpen, onClose, onSave }) => {
  const [title, setTitle] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [currentAmount, setCurrentAmount] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [categoryIcon, setCategoryIcon] = useState("Target");
  const [color, setColor] = useState("#10b981");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !targetAmount) return;

    onSave({
      title,
      target_amount: parseFloat(targetAmount),
      current_amount: parseFloat(currentAmount) || 0,
      target_date: targetDate || null,
      category_icon: categoryIcon,
      color
    });

    // Reset
    setTitle("");
    setTargetAmount("");
    setCurrentAmount("");
    setTargetDate("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Nova Meta / Sonho Financeiro">
      <form onSubmit={handleSubmit}>
        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">Título da Meta</label>
            <input
              type="text"
              className="form-input"
              placeholder="Ex: Reserva de Emergência, Férias na Praia, Troca de Notebook"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">Valor Alvo (R$)</label>
              <input
                type="number"
                step="0.01"
                min="1"
                placeholder="Ex: 10000,00"
                className="form-input"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Já Poupado Inicial (R$)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="0,00"
                className="form-input"
                value={currentAmount}
                onChange={(e) => setCurrentAmount(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Data Limite Desejada (Opcional)</label>
            <CustomDatePicker
              value={targetDate}
              onChange={setTargetDate}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Ícone da Meta</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {GOAL_ICONS.map((icon) => (
                <button
                  key={icon.name}
                  type="button"
                  onClick={() => setCategoryIcon(icon.name)}
                  style={{
                    padding: "6px 12px",
                    borderRadius: "var(--radius-md)",
                    border: categoryIcon === icon.name ? `2px solid ${color}` : "1px solid var(--border-color)",
                    background: categoryIcon === icon.name ? `${color}20` : "var(--bg-input)",
                    color: "var(--text-primary)",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    cursor: "pointer"
                  }}
                >
                  {icon.label}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Cor de Destaque</label>
            <div style={{ display: "flex", gap: 10 }}>
              {GOAL_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: c,
                    border: color === c ? "3px solid #ffffff" : "none",
                    boxShadow: color === c ? "0 0 10px rgba(255,255,255,0.5)" : "none",
                    cursor: "pointer"
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancelar
          </button>
          <button type="submit" className="btn btn-primary">
            Criar Meta
          </button>
        </div>
      </form>
    </Modal>
  );
};
