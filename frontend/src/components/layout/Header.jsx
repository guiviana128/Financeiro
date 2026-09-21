import React, { useState, useRef, useEffect } from "react";
import {
  Plus,
  Sun,
  Moon,
  Calendar,
  Menu,
  Eye,
  EyeOff,
  Tag,
  ShieldCheck,
  Zap,
  User as UserIcon,
  LogOut,
  ChevronDown,
  Settings
} from "lucide-react";
import { useFinance } from "../../context/FinanceContext";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { MonthPickerDropdown } from "../common/MonthPickerDropdown";
import { DeviceModeBadge } from "../common/DeviceModeBadge";
import { UserProfileModal } from "../auth/UserProfileModal";

export const Header = ({
  activeTabTitle,
  onOpenAddTransaction,
  onOpenCategoryModal,
  onToggleMobileSidebar
}) => {
  const { selectedMonth, setSelectedMonth, isPrivacyMode, togglePrivacyMode, backendConnected } = useFinance();
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const menuRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <header className="app-header">
        <div className="header-left">
          <button
            className="icon-btn mobile-menu-btn"
            onClick={onToggleMobileSidebar}
            aria-label="Abrir Menu"
          >
            <Menu size={20} />
          </button>
          <div>
            <h1 className="page-title">{activeTabTitle}</h1>
          </div>
        </div>

        <div className="header-right">
          {/* Status Indicator */}
          <span
            className="badge"
            style={{
              background: backendConnected ? "rgba(16, 185, 129, 0.1)" : "rgba(99, 102, 241, 0.1)",
              color: backendConnected ? "#10b981" : "#818cf8",
              border: `1px solid ${backendConnected ? "rgba(16, 185, 129, 0.25)" : "rgba(99, 102, 241, 0.25)"}`,
              fontSize: "0.75rem",
              display: "none",
              alignItems: "center",
              gap: 6
            }}
            title={backendConnected ? "Conectado ao Backend FastAPI" : "Modo Local Ativo"}
          >
            {backendConnected ? <ShieldCheck size={14} /> : <Zap size={14} />}
            <span>{backendConnected ? "API Conectada" : "Modo Local"}</span>
          </span>

          {/* Device Mode Identifier & Switcher */}
          <DeviceModeBadge />

          {/* Custom Month Picker */}
          <MonthPickerDropdown
            selectedMonth={selectedMonth}
            onSelectMonth={setSelectedMonth}
          />

          {/* Privacy Mode Toggle */}
          <button
            className="icon-btn header-desktop-only"
            onClick={togglePrivacyMode}
            title={isPrivacyMode ? "Mostrar valores" : "Esconder valores (Modo Privacidade)"}
            aria-label="Modo Privacidade"
          >
            {isPrivacyMode ? <EyeOff size={18} color="#f43f5e" /> : <Eye size={18} />}
          </button>

          {/* Manage Categories Button */}
          {onOpenCategoryModal && (
            <button
              className="icon-btn header-desktop-only"
              onClick={onOpenCategoryModal}
              title="Gerenciar Categorias"
              aria-label="Gerenciar Categorias"
            >
              <Tag size={18} />
            </button>
          )}

          {/* Theme Toggle */}
          <button
            className="icon-btn header-desktop-only"
            onClick={toggleTheme}
            title={theme === "dark" ? "Mudar para Modo Claro" : "Mudar para Modo Escuro"}
            aria-label="Alternar tema"
          >
            {theme === "dark" ? <Sun size={18} color="#f59e0b" /> : <Moon size={18} color="#6366f1" />}
          </button>

          {/* User Profile Pill Dropdown */}
          {user && (
            <div className="user-profile-menu-container" ref={menuRef}>
              <button
                type="button"
                className="user-profile-pill-btn"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                title={`Usuário: ${user.name} (${user.email})`}
              >
                <div className="user-avatar-circle">
                  {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>
                <span className="user-profile-name">{user.name.split(" ")[0]}</span>
                <ChevronDown size={14} color="#94a3b8" />
              </button>

              {isUserMenuOpen && (
                <div className="user-dropdown-card glass-panel">
                  <div className="user-dropdown-info">
                    <div className="user-avatar-circle" style={{ width: 34, height: 34 }}>
                      {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                    </div>
                    <div className="user-dropdown-details">
                      <span className="user-dropdown-name">{user.name}</span>
                      <span className="user-dropdown-email">{user.email}</span>
                    </div>
                  </div>

                  <div className="user-dropdown-items">
                    <button
                      type="button"
                      className="user-dropdown-item"
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        setIsProfileModalOpen(true);
                      }}
                    >
                      <UserIcon size={16} />
                      <span>Meu Perfil & Senha</span>
                    </button>

                    <button
                      type="button"
                      className="user-dropdown-item danger"
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        logout();
                      }}
                    >
                      <LogOut size={16} />
                      <span>Sair da Conta</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Quick Add Button (Desktop Only) */}
          <button className="btn btn-primary header-desktop-btn" onClick={onOpenAddTransaction}>
            <Plus size={18} />
            <span>Nova Transação</span>
          </button>
        </div>
      </header>

      {/* User Profile Edit Modal */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </>
  );
};
