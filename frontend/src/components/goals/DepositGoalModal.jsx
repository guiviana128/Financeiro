import React, { useState } from "react";
import { Modal } from "../common/Modal";
import { formatCurrency } from "../../utils/formatters";
import confetti from "canvas-confetti";

export const DepositGoalModal = ({ isOpen, onClose, goal, onUpdate }) => {
  const [amount, setAmount] = useState("");
  const [operation, setOperation] = useState("deposit"); // deposit or withdraw

  if (!goal) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (!val || val <= 0) return;

    const newAmount = operation === "deposit"
      ? goal.current_amount + val
      : Math.max(0, goal.current_amount - val);

    onUpdate(goal.id, {
      current_amount: newAmount
    });

    if (operation === "deposit" && newAmount >= goal.target_amount) {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 }
      });
    }

    setAmount("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Movimentar Meta: ${goal.title}`}>
      <form onSubmit={handleSubmit}>
        <div className="modal-body">
          <div style={{ display: "flex", justifyContent: "space-between", padding: 12, background: "var(--bg-subtle)", borderRadius: "var(--radius-md)" }}>
            <div>
              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Saldo Atual:</span>
              <div style={{ fontWeight: 700, fontSize: "1.1rem" }}>{formatCurrency(goal.current_amount)}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Objetivo:</span>
              <div style={{ fontWeight: 700, fontSize: "1.1rem", color: "var(--text-secondary)" }}>
                {formatCurrency(goal.target_amount)}
              </div>
            </div>
          </div>

          <div className="segmented-control">
            <button
              type="button"
              className={`segmented-btn ${operation === "deposit" ? "active active-income" : ""}`}
              onClick={() => setOperation("deposit")}
            >
              + Guardar Dinheiro (Aporte)
            </button>
            <button
              type="button"
              className={`segmented-btn ${operation === "withdraw" ? "active active-expense" : ""}`}
              onClick={() => setOperation("withdraw")}
            >
              - Resgatar Valor
            </button>
          </div>

          <div className="form-group">
            <label className="form-label">Valor da Operação (R$)</label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0,00"
              className="form-input"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              autoFocus
            />
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancelar
          </button>
          <button type="submit" className="btn btn-primary">
            Confirmar {operation === "deposit" ? "Aporte" : "Resgate"}
          </button>
        </div>
      </form>
    </Modal>
  );
};
