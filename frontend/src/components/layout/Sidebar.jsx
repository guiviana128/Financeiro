import React from "react";
import {
  LayoutDashboard,
  CreditCard,
  ArrowLeftRight,
  PieChart,
  Target,
  RotateCcw,
  Sparkles,
  Wallet,
  RefreshCw,
  TrendingUp,
  LogOut,
  UserCheck
} from "lucide-react";
import { useFinance } from "../../context/FinanceContext";
import { useAuth } from "../../context/AuthContext";

export const Sidebar = ({ activeTab, setActiveTab, isOpen, setIsOpen }) => {
  const { handleResetDemo } = useFinance();
  const { user, logout } = useAuth();

  const navItems = [
    { id: "dashboard", label: "Dashboard Geral", icon: LayoutDashboard },
    { id: "cards", label: "Meus Cartões & Faturas", icon: CreditCard },
    { id: "transactions", label: "Transações & Extrato", icon: ArrowLeftRight },
    { id: "planning", label: "Planejamento 50/30/20", icon: PieChart },
    { id: "subscriptions", label: "Assinaturas & Fixos", icon: RefreshCw },
    { id: "calculator", label: "Simulador de Investimentos", icon: TrendingUp },
    { id: "goals", label: "Metas & Sonhos", icon: Target },
  ];

  return (
    <aside className={`app-sidebar ${isOpen ? "open" : ""}`}>
      <div>
        {/* Brand */}
        <div className="brand-header">
          <div className="brand-icon">
            <Wallet size={24} />
          </div>
          <div className="brand-text-wrapper">
            <span className="brand-title">FinFlow Pro</span>
            <span className="brand-subtitle">Gestão & Cartões</span>
          </div>
        </div>

        {/* Navigation */}
        <ul className="nav-links-list">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeTab === item.id;
            return (
              <li key={item.id}>
                <button
                  className={`nav-link-btn ${isActive ? "active" : ""}`}
                  onClick={() => {
                    setActiveTab(item.id);
                    if (setIsOpen) setIsOpen(false);
                  }}
                >
                  <IconComponent size={19} />
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Bottom section with Logged In User Card */}
      <div className="sidebar-bottom">
        {user && (
          <div className="sidebar-user-card" title={`Conectado como ${user.name} (${user.email})`}>
            <div className="sidebar-user-info">
              <div className="user-avatar-circle" style={{ width: 30, height: 30 }}>
                {user.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>
              <div className="sidebar-user-text">
                <span className="sidebar-user-name">{user.name}</span>
                <span className="sidebar-user-role">
                  <UserCheck size={11} />
                  <span>Conta Pessoal</span>
                </span>
              </div>
            </div>
            <button
              type="button"
              className="sidebar-logout-btn"
              onClick={logout}
              title="Sair da Conta"
              aria-label="Sair da Conta"
            >
              <LogOut size={16} />
            </button>
          </div>
        )}

        <button
          className="nav-link-btn"
          style={{ marginTop: 8 }}
          onClick={() => {
            if (window.confirm("Deseja restaurar os dados de demonstração padrão?")) {
              handleResetDemo();
            }
          }}
          title="Restaura os dados iniciais de demonstração"
        >
          <RotateCcw size={18} />
          <span>Restaurar Dados Demo</span>
        </button>
      </div>
    </aside>
  );
};
