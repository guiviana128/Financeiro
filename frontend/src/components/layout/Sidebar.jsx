import React, { useState } from "react";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  ArrowLeftRight,
  CalendarDays,
  PieChart,
  Sparkles,
  Calendar,
  Target,
  TrendingUp,
  Settings,
  LogOut,
  ChevronRight,
  ChevronLeft,
  LineChart,
  Receipt,
  FileText,
  Wallet,
  Menu
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export const Sidebar = ({ activeTab, setActiveTab, isOpen, setIsOpen, isCollapsed, setIsCollapsed }) => {
  const { user, logout } = useAuth();

  const navGroups = [
    {
      title: "Visão Geral",
      items: [
        { id: "dashboard", label: "Dashboard geral", icon: LayoutDashboard },
        { id: "accounts", label: "Central de Contas", icon: Wallet },
        { id: "transactions", label: "Transações & Extrato", icon: ArrowLeftRight },
        { id: "calendar", label: "Calendário Financeiro", icon: CalendarDays },
      ]
    },
    {
      title: "Planejamento & Gestão",
      items: [
        { id: "forecast", label: "Previsão de Saldo", icon: LineChart },
        { id: "planning", label: "Planejamento 50/30/20", icon: PieChart },
        { id: "goals", label: "Metas & Sonhos", icon: Target },
        { id: "subscriptions", label: "Assinaturas & Fixos", icon: Calendar },
        { id: "cards", label: "Meus Cartões & Faturas", icon: CreditCard },
        { id: "debts", label: "Dívidas e Parcelas", icon: Receipt },
      ]
    },
    {
      title: "Análises & Ferramentas",
      items: [
        { id: "reports", label: "Relatório Mensal", icon: FileText },
        { id: "insights", label: "Insights Financeiros", icon: Sparkles },
        { id: "calculator", label: "Simulador de Investimentos", icon: TrendingUp },
        { id: "shared", label: "Espaço compartilhado", icon: Users },
      ]
    }
  ];

  const userName = user?.name || "Guilherme Viana";
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <aside className={`app-sidebar ${isOpen ? "open" : ""} ${isCollapsed ? "collapsed" : ""}`}>
      <div className="sidebar-top-section">
        {/* Brand */}
        <div className="brand-header">
          <div className="brand-icon" onClick={() => setActiveTab("dashboard")} style={{ cursor: "pointer" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 5C4 3.89543 4.89543 3 6 3H16C17.1046 3 18 3.89543 18 5V9C18 10.1046 17.1046 11 16 11H8C6.89543 11 6 11.8954 6 13V19C6 20.1046 5.10457 21 4 21C2.89543 21 2 20.1046 2 19V5C2 3.89543 2.89543 3 4 3Z" fill="#00d2b4" />
              <path d="M10 13C10 11.8954 10.8954 11 12 11H18C19.1046 11 20 11.8954 20 13V19C20 20.1046 19.1046 21 18 21H12C10.8954 21 10 20.1046 10 19V13Z" fill="#00d2b4" fillOpacity="0.8" />
              <path d="M6 13C6 11.8954 6.89543 11 8 11H12V15H8C6.89543 15 6 14.1046 6 13Z" fill="#2dd4bf" />
            </svg>
          </div>
          {!isCollapsed && (
            <div className="brand-text-wrapper" onClick={() => setActiveTab("dashboard")} style={{ cursor: "pointer" }}>
              <span className="brand-title">FinFlow Pro</span>
              <span className="brand-subtitle">GESTÃO E CARTÕES</span>
            </div>
          )}
          {setIsCollapsed && (
            <button
              type="button"
              className="sidebar-collapse-btn"
              onClick={() => setIsCollapsed(!isCollapsed)}
              title={isCollapsed ? "Expandir barra lateral" : "Recolher barra lateral"}
              aria-label={isCollapsed ? "Expandir barra lateral" : "Recolher barra lateral"}
            >
              {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
          )}
        </div>

        {/* Scrollable Navigation Groups */}
        <div className="sidebar-nav-scroll">
          {navGroups.map((group, gIdx) => (
            <div key={gIdx} className="nav-group">
              {!isCollapsed && <span className="nav-group-title">{group.title}</span>}
              <ul className="nav-links-list">
                {group.items.map((item) => {
                  const IconComponent = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <li key={item.id}>
                      <button
                        className={`nav-link-btn ${isActive ? "active" : ""}`}
                        title={isCollapsed ? item.label : undefined}
                        onClick={() => {
                          setActiveTab(item.id);
                          if (setIsOpen) setIsOpen(false);
                        }}
                      >
                        <IconComponent size={19} className="nav-icon" />
                        {!isCollapsed && <span>{item.label}</span>}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom section with Logged In User Card & Actions */}
      <div className="sidebar-bottom">
        {!isCollapsed ? (
          <>
            <div
              className="sidebar-user-card"
              title={`Conectado como ${userName} - Ver Perfil`}
              onClick={() => {
                setActiveTab("profile");
                if (setIsOpen) setIsOpen(false);
              }}
              style={{ cursor: "pointer" }}
            >
              <div className="sidebar-user-info">
                <div className="user-avatar-circle" style={{ background: "#2563eb", color: "#ffffff", fontWeight: 700 }}>
                  {userInitial}
                </div>
                <div className="sidebar-user-text">
                  <span className="sidebar-user-name">{userName}</span>
                  <span className="sidebar-user-role">
                    <span>👑 Plano Premium</span>
                  </span>
                </div>
              </div>
              <ChevronRight size={16} color="#94a3b8" />
            </div>

            <div className="sidebar-actions-grid">
              <button
                type="button"
                className="sidebar-action-btn"
                onClick={() => {
                  setActiveTab("profile");
                  if (setIsOpen) setIsOpen(false);
                }}
              >
                <Settings size={16} />
                <span>Configurações</span>
              </button>
              <button
                type="button"
                className="sidebar-action-btn logout"
                onClick={logout}
              >
                <LogOut size={16} />
                <span>Sair</span>
              </button>
            </div>
          </>
        ) : (
          <div className="sidebar-collapsed-bottom">
            <button
              type="button"
              className="nav-link-btn"
              title="Meu Perfil"
              onClick={() => setActiveTab("profile")}
            >
              <div className="user-avatar-circle" style={{ width: 28, height: 28, fontSize: "0.75rem", background: "#2563eb", color: "#ffffff" }}>
                {userInitial}
              </div>
            </button>
            <button
              type="button"
              className="nav-link-btn"
              title="Configurações"
              onClick={() => setActiveTab("profile")}
            >
              <Settings size={18} />
            </button>
            <button
              type="button"
              className="nav-link-btn logout"
              title="Sair"
              onClick={logout}
            >
              <LogOut size={18} />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};
