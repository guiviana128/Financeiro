import React from "react";
import {
  LayoutDashboard,
  CreditCard,
  Plus,
  ArrowLeftRight,
  Menu
} from "lucide-react";

export const MobileNavBar = ({
  activeTab,
  setActiveTab,
  onOpenAddTransaction,
  onOpenMobileMenu
}) => {
  const mainTabs = [
    { id: "dashboard", label: "Início", icon: LayoutDashboard },
    { id: "cards", label: "Cartões", icon: CreditCard },
    { id: "add", label: "Novo", isAction: true },
    { id: "transactions", label: "Extrato", icon: ArrowLeftRight },
    { id: "menu", label: "Mais", icon: Menu, isMenu: true }
  ];

  return (
    <nav className="mobile-bottom-nav glass-panel" aria-label="Navegação inferior mobile">
      <div className="mobile-bottom-nav-inner">
        {mainTabs.map((tab) => {
          if (tab.isAction) {
            return (
              <button
                key="action-add"
                type="button"
                className="mobile-fab-center-btn"
                onClick={onOpenAddTransaction}
                aria-label="Adicionar Nova Transação"
              >
                <div className="fab-inner-glow">
                  <Plus size={24} strokeWidth={2.6} />
                </div>
                <span className="mobile-nav-label">Novo</span>
              </button>
            );
          }

          if (tab.isMenu) {
            return (
              <button
                key="menu-btn"
                type="button"
                className="mobile-nav-item-btn"
                onClick={onOpenMobileMenu}
                aria-label="Abrir Menu Completo"
              >
                <div className="nav-icon-container">
                  <Menu size={20} />
                </div>
                <span className="mobile-nav-label">{tab.label}</span>
              </button>
            );
          }

          const IconComp = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              className={`mobile-nav-item-btn ${isActive ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
              aria-label={tab.label}
            >
              <div className="nav-icon-container">
                <IconComp size={20} />
                {isActive && <span className="active-dot-indicator" />}
              </div>
              <span className="mobile-nav-label">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
