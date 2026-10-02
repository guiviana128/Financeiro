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
import { AccountsHubView } from "./components/accounts/AccountsHubView";
import { BalanceForecastView } from "./components/forecast/BalanceForecastView";
import { DebtsView } from "./components/debts/DebtsView";
import { MonthlyReportView } from "./components/reports/MonthlyReportView";
import { SharedSpaceView } from "./components/shared/SharedSpaceView";
import { CardsView } from "./components/cards/CardsView";
import { TransactionsView } from "./components/transactions/TransactionsView";
import { FinancialCalendarView } from "./components/calendar/FinancialCalendarView";
import { PlanningView } from "./components/planning/PlanningView";
import { FinancialInsightsView } from "./components/insights/FinancialInsightsView";
import { SubscriptionsView } from "./components/subscriptions/SubscriptionsView";
import { CompoundInterestCalculator } from "./components/calculator/CompoundInterestCalculator";
import { GoalsView } from "./components/goals/GoalsView";
import { ProfileView } from "./components/profile/ProfileView";

const MainContent = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isGlobalAddTxOpen, setIsGlobalAddTxOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [cardFilterFromCardsView, setCardFilterFromCardsView] = useState(null);
  const { toast } = useFinance();
  const { isMobileView, viewMode } = useDevice();
  const { isAuthenticated, loading } = useAuth();

  const tabTitles = {
    dashboard: "Olá, Guilherme!",
    accounts: "Central de Contas",
    forecast: "Previsão de Saldo",
    debts: "Dívidas e Parcelas",
    reports: "Relatório Mensal",
    shared: "Espaço compartilhado",
    cards: "Gestão de Cartões & Faturas",
    transactions: "Movimentações & Extrato",
    calendar: "Calendário Financeiro",
    planning: "Planejamento Orçamentário 50/30/20",
    insights: "Insights Financeiros",
    subscriptions: "Assinaturas & Gastos Recorrentes",
    goals: "Metas & Sonhos Financeiros",
    calculator: "Simulador de Investimentos",
    profile: "Meu Perfil"
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
        return <DashboardView onNavigateTab={(tab) => setActiveTab(tab)} />;
      case "accounts":
        return <AccountsHubView />;
      case "forecast":
        return <BalanceForecastView />;
      case "debts":
        return <DebtsView />;
      case "reports":
        return <MonthlyReportView />;
      case "shared":
        return <SharedSpaceView />;
      case "cards":
        return <CardsView onSelectCardFilter={handleSelectCardFilter} />;
      case "transactions":
        return <TransactionsView initialCardFilter={cardFilterFromCardsView} />;
      case "calendar":
        return <FinancialCalendarView />;
      case "planning":
        return <PlanningView />;
      case "insights":
        return <FinancialInsightsView />;
      case "subscriptions":
        return <SubscriptionsView />;
      case "goals":
        return <GoalsView />;
      case "calculator":
        return <CompoundInterestCalculator />;
      case "profile":
        return <ProfileView onNavigateHome={() => setActiveTab("dashboard")} />;
      default:
        return <DashboardView onNavigateTab={(tab) => setActiveTab(tab)} />;
    }
  };

  return (
    <div className={`app-layout ${isMobileView ? "mobile-view-mode" : "desktop-view-mode"} ${isSidebarCollapsed && !isMobileView ? "sidebar-is-collapsed" : ""} view-preference-${viewMode}`}>
      {/* Desktop Sidebar (Only in Desktop Mode) */}
      {!isMobileView && (
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isCollapsed={isSidebarCollapsed}
          setIsCollapsed={setIsSidebarCollapsed}
        />
      )}

      {/* Main Content Area */}
      <div className="app-main-content main-content-wrapper">
        <Header
          activeTabTitle={tabTitles[activeTab]}
          onOpenAddTransaction={() => setIsGlobalAddTxOpen(true)}
          onOpenCategoryModal={() => setIsCategoryModalOpen(true)}
          onToggleMobileSidebar={() => setIsMobileDrawerOpen(true)}
        />

        <main className="page-body main-content">
          {renderActiveView()}
        </main>
      </div>

      {/* Mobile Drawer (Only for responsive viewports) */}
      {isMobileView && (
        <MobileMenuDrawer
          isOpen={isMobileDrawerOpen}
          onClose={() => setIsMobileDrawerOpen(false)}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenCategoryModal={() => setIsCategoryModalOpen(true)}
        />
      )}

      {/* Mobile Bottom Navigation Bar */}
      {isMobileView && (
        <MobileNavBar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenAddTransaction={() => setIsGlobalAddTxOpen(true)}
          onOpenDrawer={() => setIsMobileDrawerOpen(true)}
        />
      )}

      {/* Global Add Transaction Modal */}
      <AddTransactionModal
        isOpen={isGlobalAddTxOpen}
        onClose={() => setIsGlobalAddTxOpen(false)}
      />

      {/* Global Category Management Modal */}
      <CategoriesModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
      />

      {/* Global Toast Feedback */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
        />
      )}
    </div>
  );
};

export const App = () => {
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
};

export default App;
