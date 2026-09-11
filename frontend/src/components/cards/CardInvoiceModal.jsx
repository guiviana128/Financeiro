import React from "react";
import { Modal } from "../common/Modal";
import { useFinance } from "../../context/FinanceContext";
import { formatCurrency, formatDate } from "../../utils/formatters";
import { CreditCard, Calendar, CheckCircle2, AlertCircle, ArrowUpRight, Trash2 } from "lucide-react";

export const CardInvoiceModal = ({ isOpen, onClose, card, onDeleteCard }) => {
  const { transactions, payCardInvoice, isPrivacyMode, selectedMonth } = useFinance();

  if (!card) return null;

  // Transactions for this card in selected month
  const cardTransactions = transactions.filter(
    (t) => t.credit_card_id === card.id && (!t.competence_month || t.competence_month === selectedMonth)
  );

  const totalInvoice = cardTransactions.reduce((acc, t) => acc + (t.amount || 0), 0) || card.current_bill || 0;

  const handlePayInvoice = () => {
    if (totalInvoice <= 0) {
      alert("A fatura deste cartão está zerada.");
      return;
    }
    if (window.confirm(`Confirma o pagamento total de ${formatCurrency(totalInvoice)} da fatura ${card.name}?`)) {
      payCardInvoice(card.id, totalInvoice);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Detalhes da Fatura - ${card.name}`} maxWidth="600px">
      <div className="modal-body">
        {/* Card Invoice Summary Banner */}
        <div
          style={{
            background: `linear-gradient(135deg, ${card.color}25 0%, ${card.color_end || "#000"}40 100%)`,
            border: `1px solid ${card.color}50`,
            borderRadius: "var(--radius-md)",
            padding: 20,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <div>
            <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", textTransform: "uppercase" }}>
              Total da Fatura Atual ({selectedMonth})
            </div>
            <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--color-expense)" }}>
              {formatCurrency(totalInvoice, isPrivacyMode)}
            </div>
          </div>

          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Vencimento</div>
            <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-primary)" }}>
              Dia {card.due_day}
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
              Fecha dia {card.closing_day}
            </div>
          </div>
        </div>

        {/* Smart Tip */}
        <div
          style={{
            background: "var(--bg-subtle)",
            border: "1px solid var(--border-color)",
            borderRadius: "var(--radius-md)",
            padding: "12px 16px",
            fontSize: "0.85rem",
            color: "var(--text-secondary)",
            display: "flex",
            alignItems: "center",
            gap: 10
          }}
        >
          <AlertCircle size={18} color="var(--accent-primary)" style={{ flexShrink: 0 }} />
          <span>
            💡 <strong>Melhor dia de compra:</strong> A partir do dia <strong>{card.closing_day + 1 > 31 ? 1 : card.closing_day + 1}</strong> suas compras entram apenas na fatura do mês seguinte (até 40 dias para pagar).
          </span>
        </div>

        {/* Itemized Transactions */}
        <div>
          <h4 style={{ fontSize: "0.95rem", fontWeight: 700, marginBottom: 12 }}>
            Lançamentos nesta fatura ({cardTransactions.length})
          </h4>

          {cardTransactions.length === 0 ? (
            <div style={{ textAlign: "center", padding: 20, color: "var(--text-muted)", fontSize: "0.85rem" }}>
              Nenhum lançamento registrado neste cartão para o mês selecionado.
            </div>
          ) : (
            <div style={{ maxHeight: 240, overflowY: "auto", display: "flex", flexDirection: "column", gap: 8 }}>
              {cardTransactions.map((tx) => (
                <div
                  key={tx.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10px 14px",
                    background: "var(--bg-subtle)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "var(--radius-md)",
                    fontSize: "0.85rem"
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, color: "var(--text-primary)" }}>{tx.description}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{formatDate(tx.date)}</div>
                  </div>
                  <div style={{ fontWeight: 700, color: "var(--color-expense)" }}>
                    - {formatCurrency(tx.amount, isPrivacyMode)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="modal-footer" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
        {onDeleteCard && (
          <button
            type="button"
            className="btn btn-danger"
            style={{ padding: "8px 14px", fontSize: "0.85rem" }}
            onClick={() => {
              onClose();
              onDeleteCard(card);
            }}
          >
            <Trash2 size={15} />
            <span>Excluir Cartão</span>
          </button>
        )}
        <div style={{ display: "flex", gap: 10, marginLeft: "auto" }}>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Fechar
          </button>
          <button
            type="button"
            className="btn btn-primary"
            style={{ background: "linear-gradient(135deg, #10b981, #059669)", boxShadow: "0 4px 14px rgba(16, 185, 129, 0.4)" }}
            onClick={handlePayInvoice}
          >
            <CheckCircle2 size={16} />
            <span>Pagar Fatura Integral ({formatCurrency(totalInvoice, isPrivacyMode)})</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};
