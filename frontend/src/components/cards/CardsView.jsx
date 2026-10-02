import React, { useState } from "react";
import { Plus, Zap, FileText, Settings, ShieldCheck, Clock, BarChart2, Calendar, ArrowRight, X, Lightbulb } from "lucide-react";
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
  const [showAdvisorBanner, setShowAdvisorBanner] = useState(true);
  const [selectedInvoiceMonth, setSelectedInvoiceMonth] = useState("Outubro 2026");

  // Fallback card if empty to match mockup visuals
  const displayCards = creditCards && creditCards.length > 0 ? creditCards : [
    {
      id: 1,
      name: "Nubank Gold",
      limit_total: 4000.00,
      current_bill: 0.00,
      available_limit: 3954.10,
      closing_day: 25,
      due_day: 2,
      last_digits: "1234"
    }
  ];

  const totalLimit = displayCards.reduce((acc, c) => acc + (c.limit_total || 0), 0) || 4000.00;
  const totalBill = displayCards.reduce((acc, c) => acc + (c.current_bill || 0), 0) || 0.00;
  const totalAvailable = Math.max(0, totalLimit - totalBill);
  const usagePct = totalLimit > 0 ? ((totalBill / totalLimit) * 100).toFixed(1) : "0.0";

  const bestCard = displayCards[0];

  const invoiceMonths = [
    { name: "Setembro 2026", amount: 1284.00, status: "Fatura Fechada" },
    { name: "Outubro 2026", amount: 0.00, status: "Fatura Aberta" },
    { name: "Novembro 2026", amount: 0.00, status: "Prevista" },
    { name: "Dezembro 2026", amount: 0.00, status: "Prevista" },
    { name: "Janeiro 2027", amount: 0.00, status: "Prevista" },
    { name: "Fevereiro 2027", amount: 0.00, status: "Prevista" },
  ];

  return (
    <div className="cards-view-container">
      {/* Smart Card Advisor Banner */}
      {showAdvisorBanner && bestCard && (
        <div className="card-advisor-banner">
          <div className="advisor-left">
            <div className="advisor-icon-box">
              <Lightbulb size={20} />
            </div>
            <div className="advisor-text">
              <span className="advisor-title">
                Recomendação Inteligente de Compra: <strong>{bestCard.name}</strong>
              </span>
              <span className="advisor-desc">
                Este cartão oferece o maior prazo de pagamento hoje (limite disponível: {formatCurrency(bestCard.available_limit || 3954.10, isPrivacyMode)}).
              </span>
            </div>
          </div>

          <div className="advisor-actions">
            <button
              type="button"
              className="btn btn-primary"
              style={{ fontSize: "0.82rem", padding: "8px 14px" }}
              onClick={() => setIsAutomationModalOpen(true)}
            >
              <Zap size={14} />
              <span>Simular Notificação do Banco</span>
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              style={{ fontSize: "0.82rem", padding: "8px 14px" }}
              onClick={() => setSelectedInvoiceCard(bestCard)}
            >
              <FileText size={14} />
              <span>Ver Fatura</span>
            </button>

            <button
              type="button"
              className="header-circle-btn"
              style={{ width: 32, height: 32 }}
              onClick={() => setShowAdvisorBanner(false)}
              title="Fechar banner"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {/* 3 KPI Cards Row */}
      <div className="kpi-cards-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
        <StatCard
          label="LIMITE TOTAL DOS CARTÕES"
          value={totalLimit}
          subtitle={`${displayCards.length} cartões ativos`}
          iconName="Wallet"
          iconBg="#eff6ff"
          iconColor="#3b82f6"
          badgeText="+0% em relação ao mês anterior"
          badgeType="up"
          sparklineType="bars-green"
        />

        <StatCard
          label="FATURA TOTAL CONSOLIDADA"
          value={totalBill}
          subtitle={`Uso geral: ${usagePct}%`}
          iconName="Clock"
          iconBg="#fff1f2"
          iconColor="#f43f5e"
          sparklineType="progress"
          progressPct={parseFloat(usagePct)}
        />

        <StatCard
          label="LIMITE LIVRE TOTAL"
          value={totalAvailable}
          subtitle="Disponível para compras"
          iconName="ShieldCheck"
          iconBg="#ecfdf5"
          iconColor="#10b981"
          sparklineType="progress"
          progressPct={100}
        />
      </div>

      {/* Section Header: Gerenciamento de Cartões */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginTop: 8 }}>
        <div>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text-primary)" }}>Gerenciamento de Cartões</h2>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
            Clique em qualquer cartão para ver mais detalhes, consultar faturas abertas ou simular pagamentos.
          </p>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setIsAutomationModalOpen(true)}
          >
            <Settings size={15} />
            <span>Automações & Notificações</span>
          </button>

          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setIsAddModalOpen(true)}
          >
            <Plus size={17} />
            <span>Adicionar Cartão</span>
          </button>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="cards-grid">
        {displayCards.map((card) => (
          <CreditCardItem
            key={card.id}
            card={card}
            onDelete={(c) => setCardToDelete(c)}
            onSelect={(c) => setSelectedInvoiceCard(c)}
          />
        ))}

        {/* Add Card Placeholder Box */}
        <div className="add-card-placeholder-box" onClick={() => setIsAddModalOpen(true)}>
          <div className="add-card-icon-circle">
            <Plus size={26} />
          </div>
          <span style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--text-primary)" }}>
            Cadastrar Novo Cartão
          </span>
          <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", maxWidth: 260 }}>
            Adicione outro cartão para consolidar suas faturas e ter uma visão completa dos seus gastos.
          </p>
        </div>
      </div>

      {/* Próximas Faturas Timeline */}
      <div className="monthly-invoices-section">
        <div className="chart-header">
          <div>
            <h3 className="chart-title">
              <Calendar size={18} color="#0d9488" />
              <span>Próximas Faturas</span>
            </h3>
            <span style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>
              Visualize suas faturas dos próximos meses e programe seus pagamentos.
            </span>
          </div>

          <a className="chart-link" href="#todas" onClick={(e) => e.preventDefault()}>
            <span>Ver todas as faturas</span>
            <ArrowRight size={13} />
          </a>
        </div>

        <div className="invoices-carousel">
          {invoiceMonths.map((inv, idx) => (
            <div
              key={idx}
              className={`invoice-month-card ${selectedInvoiceMonth === inv.name ? "active" : ""}`}
              onClick={() => setSelectedInvoiceMonth(inv.name)}
            >
              <span className="invoice-month-name">{inv.name}</span>
              <span className="invoice-month-total">{formatCurrency(inv.amount)}</span>
              <span className="invoice-month-status">{inv.status}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Modals */}
      <AddCardModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={addCreditCard}
      />

      <BankAutomationModal
        isOpen={isAutomationModalOpen}
        onClose={() => setIsAutomationModalOpen(false)}
      />

      <CardInvoiceModal
        isOpen={!!selectedInvoiceCard}
        onClose={() => setSelectedInvoiceCard(null)}
        card={selectedInvoiceCard}
        onDeleteCard={(c) => setCardToDelete(c)}
      />

      <DeleteCardModal
        isOpen={!!cardToDelete}
        onClose={() => setCardToDelete(null)}
        onConfirm={removeCreditCard}
        card={cardToDelete}
      />
    </div>
  );
};
