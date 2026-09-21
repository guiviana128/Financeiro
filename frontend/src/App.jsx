import React, { useState } from "react";
import { ThemeProvider } from "./context/ThemeContext";
import { DeviceProvider, useDevice } from "./context/DeviceContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { FinanceProvider, useFinance } from "./context/FinanceContext";
import { Sidebar } from "./components/layout/Sidebar";
import { Header } from "./components/layout/Header";
import { MobileNavBar } from "./components/layout/MobileNavBar";
import { MobileMenuDrawer } from "./components/layout/MobileMenuDrawer";
import { Toast } from "./components/common/Toast";
import { AddTransactionModal } from "./components/transactions/AddTransactionModal";
import { CategoriesModal } from "./components/categories/CategoriesModal";
import { AuthView } from "./components/auth/AuthView";

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
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isGlobalAddTxOpen, setIsGlobalAddTxOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [cardFilterFromCardsView, setCardFilterFromCardsView] = useState(null);
  const { toast } = useFinance();
  const { isMobileView, viewMode } = useDevice();
  const { isAuthenticated, loading } = useAuth();

  const tabTitles = {
    dashboard: "Dashboard Financeiro",
    cards: "Gestão de Cartões & Faturas",
    transactions: "Movimentações & Transações",
    planning: "Planejamento Orçamentário 50/30/20",
    subscriptions: "Assinaturas & Gastos Recorrentes",
    calculator: "Simulador de Investimentos",
    goals: "Metas & Sonhos Financeiros"
  };

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg-primary, #0f172a)",
        color: "#94a3b8",
        gap: "1rem"
      }}>
        <div style={{
          width: "40px",
          height: "40px",
          border: "3px solid rgba(99, 102, 241, 0.2)",
          borderTopColor: "#6366f1",
          borderRadius: "50%",
          animation: "spin 1s linear infinite"
        }} />
        <span style={{ fontSize: "0.95rem", fontWeight: 500 }}>Carregando FinFlow Pro...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthView />;
  }

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
    <div className={`app-layout ${isMobileView ? "mobile-view-mode" : "desktop-view-mode"} view-preference-${viewMode}`}>
      {/* Desktop Sidebar (Only in Desktop Mode) */}
      {!isMobileView && (
        <Sidebar
          activeTab={activeTab}
          setActiveTab={(tab) => {
            if (tab !== "transactions") setCardFilterFromCardsView(null);
            setActiveTab(tab);
          }}
          isOpen={false}
          setIsOpen={() => {}}
        />
      )}

      {/* Main Area */}
      <div className={`app-main-content ${isMobileView ? "has-mobile-nav" : ""}`}>
        <Header
          activeTabTitle={tabTitles[activeTab]}
          onOpenAddTransaction={() => setIsGlobalAddTxOpen(true)}
          onOpenCategoryModal={() => setIsCategoryModalOpen(true)}
          onToggleMobileSidebar={() => setIsMobileDrawerOpen(true)}
        />

        <main className="page-body">
          {renderActiveView()}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      {isMobileView && (
        <MobileNavBar
          activeTab={activeTab}
          setActiveTab={(tab) => {
            if (tab !== "transactions") setCardFilterFromCardsView(null);
            setActiveTab(tab);
          }}
          onOpenAddTransaction={() => setIsGlobalAddTxOpen(true)}
          onOpenMobileMenu={() => setIsMobileDrawerOpen(true)}
        />
      )}

      {/* Mobile Menu Bottom Sheet Drawer */}
      <MobileMenuDrawer
        isOpen={isMobileDrawerOpen}
        onClose={() => setIsMobileDrawerOpen(false)}
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab !== "transactions") setCardFilterFromCardsView(null);
          setActiveTab(tab);
        }}
        onOpenCategoryModal={() => setIsCategoryModalOpen(true)}
      />

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
      <DeviceProvider>
        <AuthProvider>
          <FinanceProvider>
            <MainContent />
          </FinanceProvider>
        </AuthProvider>
      </DeviceProvider>
    </ThemeProvider>
  );
}

export default App;
