import React, { useState } from "react";
import { ThemeProvider } from "./context/ThemeContext";
import { FinanceProvider, useFinance } from "./context/FinanceContext";
import { Sidebar } from "./components/layout/Sidebar";
import { Header } from "./components/layout/Header";
import { Toast } from "./components/common/Toast";
import { AddTransactionModal } from "./components/transactions/AddTransactionModal";
import { CategoriesModal } from "./components/categories/CategoriesModal";

// Views
import { DashboardView } from "./components/dashboard/DashboardView";
import { CardsView } from "./components/cards/CardsView";
import { TransactionsView } from "./components/transactions/TransactionsView";
import { PlanningView } from "./components/planning/PlanningView";
import { SubscriptionsView } from "./components/subscriptions/SubscriptionsView";
import { CompoundInterestCalculator } from "./components/calculator/CompoundInterestCalculator";
import { GoalsView } from "./components/goals/GoalsView";

const MainContent = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isGlobalAddTxOpen, setIsGlobalAddTxOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [cardFilterFromCardsView, setCardFilterFromCardsView] = useState(null);
  const { toast } = useFinance();

  const tabTitles = {
    dashboard: "Dashboard Financeiro",
    cards: "Gestão de Cartões & Faturas",
    transactions: "Movimentações & Transações",
    planning: "Planejamento Orçamentário 50/30/20",
    subscriptions: "Assinaturas & Gastos Recorrentes",
    calculator: "Simulador de Investimentos & Renda Passiva",
    goals: "Metas & Sonhos Financeiros"
  };

  const handleSelectCardFilter = (cardId) => {
    setCardFilterFromCardsView(cardId);
    setActiveTab("transactions");
  };

  const renderActiveView = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardView />;
      case "cards":
        return <CardsView onSelectCardFilter={handleSelectCardFilter} />;
      case "transactions":
        return <TransactionsView initialCardFilter={cardFilterFromCardsView} />;
      case "planning":
        return <PlanningView />;
      case "subscriptions":
        return <SubscriptionsView />;
      case "calculator":
        return <CompoundInterestCalculator />;
      case "goals":
        return <GoalsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab !== "transactions") setCardFilterFromCardsView(null);
          setActiveTab(tab);
        }}
        isOpen={isMobileSidebarOpen}
        setIsOpen={setIsMobileSidebarOpen}
      />

      {/* Main Area */}
      <div className="app-main-content">
        <Header
          activeTabTitle={tabTitles[activeTab]}
          onOpenAddTransaction={() => setIsGlobalAddTxOpen(true)}
          onOpenCategoryModal={() => setIsCategoryModalOpen(true)}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen((prev) => !prev)}
        />

        <main className="page-body">
          {renderActiveView()}
        </main>
      </div>

      {/* Global Add Transaction Modal */}
      <AddTransactionModal
        isOpen={isGlobalAddTxOpen}
        onClose={() => setIsGlobalAddTxOpen(false)}
      />

      {/* Categories Manager Modal */}
      <CategoriesModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
      />

      {/* Global Toast Notification */}
      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
};

export function App() {
  return (
    <ThemeProvider>
      <FinanceProvider>
        <MainContent />
      </FinanceProvider>
    </ThemeProvider>
  );
}

export default App;
