import React from "react";
import { useFinance } from "../../context/FinanceContext";
import { HeroNetWorthCard } from "./HeroNetWorthCard";
import { MonthInFocus } from "./MonthInFocus";
import { CashflowSplineChart } from "./CashflowSplineChart";
import { RecentTransactionsCard } from "./RecentTransactionsCard";
import { CategoryDonutCard } from "./CategoryDonutCard";
import { GoalsProgressCard } from "./GoalsProgressCard";

export const DashboardView = ({ onNavigateTab }) => {
  const { dashboard, transactions, categories, goals } = useFinance();

  return (
    <div className="alt-dashboard-container">
      {/* Top Row: Hero Net Worth Card (Left) & Month In Focus (Right) */}
      <div className="alt-dashboard-top-grid">
        <HeroNetWorthCard
          netWorth={dashboard?.total_balance ? (445890.00 + dashboard.total_balance) : 445890.00}
          monthlyBalance={dashboard?.net_savings ?? 5200.00}
          monthlyIncome={dashboard?.monthly_income ?? 8900.00}
          monthlyExpense={dashboard?.monthly_expense ?? 3700.00}
          growthRate={12}
        />

        <MonthInFocus bills={dashboard?.upcoming_bills || []} />
      </div>

      {/* Middle Row: Fluxo de Caixa (Left) & Gastos por Categoria (Right) */}
      <div className="alt-dashboard-middle-grid">
        <CashflowSplineChart />
        <CategoryDonutCard
          categories={dashboard?.expenses_by_category || categories}
          totalExpense={dashboard?.monthly_expense ?? 3700.00}
        />
      </div>

      {/* Bottom Row: Últimas transações (Left) & Progresso das metas (Right) */}
      <div className="alt-dashboard-bottom-grid">
        <RecentTransactionsCard
          transactions={transactions}
          onNavigateTransactions={() => onNavigateTab && onNavigateTab("transactions")}
        />

        <GoalsProgressCard goals={goals} />
      </div>
    </div>
  );
};
