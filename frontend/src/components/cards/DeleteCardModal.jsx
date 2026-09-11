import React from "react";
import { Modal } from "../common/Modal";
import { Trash2, CreditCard } from "lucide-react";
import { formatCurrency } from "../../utils/formatters";

export const DeleteCardModal = ({ isOpen, onClose, onConfirm, card }) => {
  if (!card) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Excluir Cartão" maxWidth="480px">
      <div className="modal-body" style={{ textAlign: "center", gap: 20 }}>
        {/* Warning Icon Badge */}
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: "rgba(244, 63, 94, 0.15)",
            border: "1px solid rgba(244, 63, 94, 0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#f43f5e",
            margin: "0 auto"
          }}
        >
          <Trash2 size={30} />
        </div>

        <div>
          <h3 style={{ fontSize: "1.15rem", fontWeight: 700, marginBottom: 8, color: "var(--text-primary)" }}>
            Deseja realmente excluir este cartão?
          </h3>
          <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
            Você está prestes a remover o cartão <strong>{card.name}</strong> ({card.bank || "Banco"}).
            Esta ação não pode ser desfeita e removerá os lançamentos e faturas associados a ele.
          </p>
        </div>

        {/* Card Summary Mini Card */}
        <div
          style={{
            background: `linear-gradient(135deg, ${card.color || "#6366f1"}20 0%, ${card.color_end || "#1e1b4b"}30 100%)`,
            border: `1px solid ${card.color || "#6366f1"}40`,
            borderRadius: "var(--radius-md)",
            padding: "12px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            textAlign: "left"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                background: card.color || "#6366f1",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff"
              }}
            >
              <CreditCard size={20} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: "0.9rem" }}>{card.name}</div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                •••• {card.last_four || "0000"} • {card.brand?.toUpperCase()}
              </div>
            </div>
          </div>

          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>Limite Total</div>
            <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--text-primary)" }}>
              {formatCurrency(card.limit_total || 0)}
            </div>
          </div>
        </div>
      </div>

      <div className="modal-footer" style={{ justifyContent: "flex-end", gap: 12 }}>
        <button type="button" className="btn btn-secondary" onClick={onClose}>
          Cancelar
        </button>
        <button
          type="button"
          className="btn btn-danger"
          style={{
            background: "linear-gradient(135deg, #ef4444, #dc2626)",
            boxShadow: "0 4px 14px rgba(239, 68, 68, 0.4)",
            color: "#ffffff"
          }}
          onClick={() => {
            onConfirm(card.id);
            onClose();
          }}
        >
          <Trash2 size={16} />
          <span>Sim, Excluir Cartão</span>
        </button>
      </div>
    </Modal>
  );
};
