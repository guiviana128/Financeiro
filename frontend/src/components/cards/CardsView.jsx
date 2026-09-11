import React, { useState } from "react";
import { Plus, Zap, FileText } from "lucide-react";
import { useFinance } from "../../context/FinanceContext";
import { CreditCardItem } from "./CreditCardItem";
import { AddCardModal } from "./AddCardModal";
import { CardInvoiceModal } from "./CardInvoiceModal";
import { DeleteCardModal } from "./DeleteCardModal";
import { BankAutomationModal } from "./BankAutomationModal";
import { StatCard } from "../common/StatCard";
import { formatCurrency } from "../../utils/formatters";

export const CardsView = ({ onSelectCardFilter }) => {
  const { creditCards, addCreditCard, removeCreditCard, isPrivacyMode } = useFinance();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAutomationModalOpen, setIsAutomationModalOpen] = useState(false);
  const [selectedInvoiceCard, setSelectedInvoiceCard] = useState(null);
  const [cardToDelete, setCardToDelete] = useState(null);

  const totalLimit = creditCards.reduce((acc, c) => acc + (c.limit_total || 0), 0);
  const totalBill = creditCards.reduce((acc, c) => acc + (c.current_bill || 0), 0);
  const totalAvailable = Math.max(0, totalLimit - totalBill);

  // Smart Card Advisor: Find card with the best available limit and most days until closing
  const todayDay = new Date().getDate();
  const bestCardForPurchase = creditCards.length > 0
    ? [...creditCards].sort((a, b) => {
        const daysA = a.closing_day >= todayDay ? a.closing_day - todayDay : (30 - todayDay + a.closing_day);
        const daysB = b.closing_day >= todayDay ? b.closing_day - todayDay : (30 - todayDay + b.closing_day);
        return daysB - daysA;
      })[0]
    : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Smart Card Advisor Banner */}
      {bestCardForPurchase && (
        <div
          className="glass-panel"
          style={{
            padding: "16px 20px",
            background: "linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.08) 100%)",
            border: "1px solid rgba(99, 102, 241, 0.3)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--accent-primary)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
              <Zap size={20} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>
                Recomendação Inteligente de Compra: <strong>{bestCardForPurchase.name}</strong>
              </div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                Este cartão oferece o maior prazo de pagamento hoje (limite disponível: {formatCurrency(bestCardForPurchase.available_limit, isPrivacyMode)}).
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <button
              className="btn btn-primary"
              style={{ fontSize: "0.8rem", padding: "6px 14px", background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)" }}
              onClick={() => setIsAutomationModalOpen(true)}
            >
              <Zap size={14} />
              <span>Simular Notificação do Banco</span>
            </button>
            <button
              className="btn btn-secondary"
              style={{ fontSize: "0.8rem", padding: "6px 14px" }}
              onClick={() => setSelectedInvoiceCard(bestCardForPurchase)}
            >
              <FileText size={14} />
              <span>Ver Fatura</span>
            </button>
          </div>
        </div>
      )}

      {/* Cards KPI Summary */}
      <div className="kpi-cards-grid">
        <StatCard
          label="Limite Total dos Cartões"
          value={totalLimit}
          subtitle={`${creditCards.length} cartões ativos`}
          iconName="CreditCard"
          iconBg="rgba(99, 102, 241, 0.15)"
          iconColor="#6366f1"
          variant="balance"
        />
        <StatCard
          label="Fatura Total Consolidada"
          value={totalBill}
          subtitle={`Uso geral: ${((totalBill / (totalLimit || 1)) * 100).toFixed(1)}%`}
          iconName="AlertCircle"
          iconBg="rgba(244, 63, 94, 0.15)"
          iconColor="#f43f5e"
          variant="expense"
        />
        <StatCard
          label="Limite Livre Total"
          value={totalAvailable}
          subtitle="Disponível para compras"
          iconName="ShieldCheck"
          iconBg="rgba(16, 185, 129, 0.15)"
          iconColor="#10b981"
          variant="income"
        />
      </div>

      {/* Header with Add & Automation Buttons */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700 }}>Gerenciamento de Cartões</h2>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
            Clique em qualquer cartão para virá-lo em 3D, consultar faturas abertas ou simular pagamentos.
          </p>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn btn-secondary" onClick={() => setIsAutomationModalOpen(true)}>
            <Zap size={16} color="var(--accent-primary)" />
            <span>Automações & Notificações</span>
          </button>

          <button className="btn btn-primary" onClick={() => setIsAddModalOpen(true)}>
            <Plus size={18} />
            <span>Adicionar Cartão</span>
          </button>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="cards-grid">
        {creditCards.map((card) => (
          <CreditCardItem
            key={card.id}
            card={card}
            onDelete={(c) => setCardToDelete(c)}
            onSelect={(c) => setSelectedInvoiceCard(c)}
          />
        ))}

        {/* Add Card Box */}
        <div className="add-card-box" onClick={() => setIsAddModalOpen(true)}>
          <Plus size={32} />
          <span style={{ fontWeight: 600 }}>Cadastrar Novo Cartão</span>
        </div>
      </div>

      {/* Add Card Modal */}
      <AddCardModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={addCreditCard}
      />

      {/* Bank Automation Modal */}
      <BankAutomationModal
        isOpen={isAutomationModalOpen}
        onClose={() => setIsAutomationModalOpen(false)}
      />

      {/* Card Invoice Modal */}
      <CardInvoiceModal
        isOpen={!!selectedInvoiceCard}
        onClose={() => setSelectedInvoiceCard(null)}
        card={selectedInvoiceCard}
        onDeleteCard={(c) => setCardToDelete(c)}
      />

      {/* Delete Card Confirmation Modal */}
      <DeleteCardModal
        isOpen={!!cardToDelete}
        onClose={() => setCardToDelete(null)}
        onConfirm={removeCreditCard}
        card={cardToDelete}
      />
    </div>
  );
};
