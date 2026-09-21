import React from "react";
import {
  LayoutDashboard,
  CreditCard,
  ArrowLeftRight,
  PieChart,
  Target,
  RotateCcw,
  Wallet,
  RefreshCw,
  TrendingUp,
  Tag,
  Eye,
  EyeOff,
  Sun,
  Moon,
  X,
  Smartphone,
  Monitor,
  Sparkles,
  ShieldCheck,
  Zap,
  LogOut,
  UserCheck
} from "lucide-react";
import { useFinance } from "../../context/FinanceContext";
import { useTheme } from "../../context/ThemeContext";
import { useDevice } from "../../context/DeviceContext";
import { useAuth } from "../../context/AuthContext";

export const MobileMenuDrawer = ({
  isOpen,
  onClose,
  activeTab,
  setActiveTab,
  onOpenCategoryModal
}) => {
  const { isPrivacyMode, togglePrivacyMode, handleResetDemo, backendConnected } = useFinance();
  const { theme, toggleTheme } = useTheme();
  const { viewMode, setViewMode, detectedDevice } = useDevice();
  const { user, logout } = useAuth();

  if (!isOpen) return null;

  const navItems = [
    { id: "dashboard", label: "Dashboard Geral", icon: LayoutDashboard, color: "#6366f1" },
    { id: "cards", label: "Meus Cartões & Faturas", icon: CreditCard, color: "#8b5cf6" },
    { id: "transactions", label: "Transações & Extrato", icon: ArrowLeftRight, color: "#10b981" },
    { id: "planning", label: "Planejamento 50/30/20", icon: PieChart, color: "#f59e0b" },
    { id: "subscriptions", label: "Assinaturas & Fixos", icon: RefreshCw, color: "#06b6d4" },
    { id: "calculator", label: "Simulador de Investimentos", icon: TrendingUp, color: "#ec4899" },
    { id: "goals", label: "Metas & Sonhos", icon: Target, color: "#3b82f6" },
  ];

  const handleSelectTab = (tabId) => {
    setActiveTab(tabId);
    onClose();
  };

  return (
    <div className="mobile-drawer-overlay" onClick={onClose}>
      <div className="mobile-drawer-sheet glass-panel" onClick={(e) => e.stopPropagation()}>
        {/* Drawer Handle & Header */}
        <div className="mobile-drawer-handle-bar">
          <div className="drawer-notch" />
        </div>

        <div className="mobile-drawer-header">
          <div className="drawer-brand">
            <div className="brand-icon-sm">
              <Wallet size={18} />
            </div>
            <div>
              <h3 className="drawer-title">FinFlow Pro</h3>
              <p className="drawer-subtitle">Central & Navegação</p>
            </div>
          </div>
          <button
            type="button"
            className="drawer-close-btn"
            onClick={onClose}
            aria-label="Fechar Menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* User Card in Drawer */}
        {user && (
          <div className="drawer-section" style={{ paddingBottom: 0 }}>
            <div className="sidebar-user-card" style={{ background: "rgba(99, 102, 241, 0.1)", borderColor: "rgba(99, 102, 241, 0.25)" }}>
              <div className="sidebar-user-info">
                <div className="user-avatar-circle" style={{ width: 34, height: 34 }}>
                  {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>
                <div className="sidebar-user-text">
                  <span className="sidebar-user-name" style={{ fontSize: "0.9rem" }}>{user.name}</span>
                  <span className="sidebar-user-role" style={{ color: "#a5b4fc" }}>
                    <UserCheck size={12} />
                    <span>{user.email}</span>
                  </span>
                </div>
              </div>
              <button
                type="button"
                className="sidebar-logout-btn"
                onClick={() => {
                  onClose();
                  logout();
                }}
                title="Sair da Conta"
                aria-label="Sair da Conta"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        )}

        {/* Device Mode Switcher In Drawer */}
        <div className="drawer-section">
          <span className="drawer-section-title">Modo de Apresentação</span>
          <div className="drawer-device-toggle-row">
            <button
              type="button"
              className={`drawer-mode-btn ${viewMode === "auto" ? "active" : ""}`}
              onClick={() => setViewMode("auto")}
            >
              <Sparkles size={15} />
              <span>Auto ({detectedDevice === "mobile" ? "Celular" : "PC"})</span>
            </button>
            <button
              type="button"
              className={`drawer-mode-btn ${viewMode === "mobile" ? "active" : ""}`}
              onClick={() => setViewMode("mobile")}
            >
              <Smartphone size={15} />
              <span>Celular</span>
            </button>
            <button
              type="button"
              className={`drawer-mode-btn ${viewMode === "desktop" ? "active" : ""}`}
              onClick={() => setViewMode("desktop")}
            >
              <Monitor size={15} />
              <span>Web Desktop</span>
            </button>
          </div>
        </div>

        {/* Navigation Grid */}
        <div className="drawer-section">
          <span className="drawer-section-title">Módulos do Sistema</span>
          <div className="drawer-nav-grid">
            {navItems.map((item) => {
              const IconComp = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  className={`drawer-nav-card ${isActive ? "active" : ""}`}
                  onClick={() => handleSelectTab(item.id)}
                >
                  <div
                    className="drawer-nav-icon"
                    style={{
                      background: isActive ? item.color : `${item.color}20`,
                      color: isActive ? "#ffffff" : item.color
                    }}
                  >
                    <IconComp size={20} />
                  </div>
                  <span className="drawer-nav-text">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick Tools & Settings */}
        <div className="drawer-section">
          <span className="drawer-section-title">Ajustes & Ações Rápidas</span>
          <div className="drawer-actions-list">
            {/* Categories */}
            {onOpenCategoryModal && (
              <button
                type="button"
                className="drawer-action-item"
                onClick={() => {
                  onClose();
                  onOpenCategoryModal();
                }}
              >
                <div className="drawer-action-icon">
                  <Tag size={18} />
                </div>
                <span>Gerenciar Categorias</span>
              </button>
            )}

            {/* Privacy */}
            <button
              type="button"
              className="drawer-action-item"
              onClick={togglePrivacyMode}
            >
              <div className="drawer-action-icon" style={{ color: isPrivacyMode ? "#f43f5e" : "inherit" }}>
                {isPrivacyMode ? <EyeOff size={18} /> : <Eye size={18} />}
              </div>
              <span>{isPrivacyMode ? "Desativar Modo Privacidade" : "Ativar Modo Privacidade"}</span>
            </button>

            {/* Theme */}
            <button
              type="button"
              className="drawer-action-item"
              onClick={toggleTheme}
            >
              <div className="drawer-action-icon" style={{ color: theme === "dark" ? "#f59e0b" : "#6366f1" }}>
                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              </div>
              <span>{theme === "dark" ? "Alternar para Modo Claro" : "Alternar para Modo Escuro"}</span>
            </button>

            {/* Reset Demo */}
            <button
              type="button"
              className="drawer-action-item danger"
              onClick={() => {
                if (window.confirm("Deseja restaurar os dados de demonstração padrão?")) {
                  handleResetDemo();
                  onClose();
                }
              }}
            >
              <div className="drawer-action-icon">
                <RotateCcw size={18} />
              </div>
              <span>Restaurar Dados Demo</span>
            </button>

            {/* Logout Mobile */}
            {user && (
              <button
                type="button"
                className="drawer-action-item danger"
                onClick={() => {
                  onClose();
                  logout();
                }}
              >
                <div className="drawer-action-icon">
                  <LogOut size={18} />
                </div>
                <span>Sair da Minha Conta</span>
              </button>
            )}
          </div>
        </div>

        {/* Status footer */}
        <div className="drawer-footer">
          <div className="drawer-status-pill">
            {backendConnected ? (
              <>
                <ShieldCheck size={14} color="#10b981" />
                <span style={{ color: "#10b981" }}>Backend FastAPI Online</span>
              </>
            ) : (
              <>
                <Zap size={14} color="#818cf8" />
                <span style={{ color: "#818cf8" }}>Modo Local Ativo</span>
              </>
            )}
          </div>
          <span className="drawer-version">FinFlow Pro v1.0.0</span>
        </div>
      </div>
    </div>
  );
};
