import React from "react";
import { useFinance } from "../../context/FinanceContext";
import { StatCard } from "../common/StatCard";
import { HealthScoreCard } from "./HealthScoreCard";
import { CashflowChart } from "./CashflowChart";
import { CategoryBreakdown } from "./CategoryBreakdown";
import { UpcomingBills } from "./UpcomingBills";
import { formatCurrency } from "../../utils/formatters";

export const DashboardView = () => {
  const { dashboard, loading, error } = useFinance();

  if (loading && !dashboard) {
    return (
      <div style={{ textAlign: "center", padding: "80px 20px", color: "var(--text-secondary)" }}>
        Carregando indicadores financeiros...
      </div>
    );
  }

  if (error && !dashboard) {
    return (
      <div className="glass-panel" style={{ padding: 32, textAlign: "center", borderColor: "#f43f5e" }}>
        <h3 style={{ color: "#f43f5e", marginBottom: 12 }}>Erro de Conexão com o Backend</h3>
        <p style={{ color: "var(--text-secondary)", marginBottom: 20 }}>{error}</p>
        <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
          Certifique-se de executar o backend com <code>py -3.11 backend/run.py</code>.
        </p>
      </div>
    );
  }

  return (
    <div className="dashboard-grid">
      {/* Financial Health Score Banner */}
      <HealthScoreCard
        score={dashboard?.financial_health_score || 0}
        status={dashboard?.health_status || "Carregando"}
        tips={dashboard?.health_tips || []}
      />

      {/* KPI Cards Grid */}
      <div className="kpi-cards-grid">
        <StatCard
          label="Saldo Geral Acumulado"
          value={dashboard?.total_balance || 0}
          subtitle="Patrimônio líquido total"
          iconName="Wallet"
          iconBg="rgba(99, 102, 241, 0.15)"
          iconColor="#6366f1"
          variant="balance"
        />
        <StatCard
          label="Receitas no Mês"
          value={dashboard?.monthly_income || 0}
          subtitle="Entradas confirmadas"
          iconName="TrendingUp"
          iconBg="rgba(16, 185, 129, 0.15)"
          iconColor="#10b981"
          variant="income"
        />
        <StatCard
          label="Despesas no Mês"
          value={dashboard?.monthly_expense || 0}
          subtitle="Saídas totais no período"
          iconName="TrendingDown"
          iconBg="rgba(244, 63, 94, 0.15)"
          iconColor="#f43f5e"
          variant="expense"
        />
        <StatCard
          label="Fatura dos Cartões"
          value={dashboard?.monthly_credit_card_bill || 0}
          subtitle={`Limite usado: ${formatCurrency(dashboard?.total_credit_used || 0)}`}
          iconName="CreditCard"
          iconBg="rgba(139, 92, 246, 0.15)"
          iconColor="#8b5cf6"
          variant="cards"
        />
        <StatCard
          label="Economia Líquida"
          value={dashboard?.net_savings || 0}
          subtitle={`Taxa de poupança: ${dashboard?.savings_rate || 0}%`}
          iconName="PiggyBank"
          iconBg="rgba(6, 182, 212, 0.15)"
          iconColor="#06b6d4"
          variant="savings"
        />
      </div>

      {/* Cashflow Chart & Upcoming Bills */}
      <div className="dashboard-charts-row">
        <CashflowChart data={dashboard?.cashflow_history || []} />
        <UpcomingBills bills={dashboard?.upcoming_bills || []} />
      </div>

      {/* Category Breakdown */}
      <CategoryBreakdown
        categories={dashboard?.expenses_by_category || []}
        totalExpense={dashboard?.monthly_expense || 0}
      />
    </div>
  );
};
