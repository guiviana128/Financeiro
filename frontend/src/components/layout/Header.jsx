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
  Search,
  Bell,
  HelpCircle,
  User as UserIcon,
  LogOut,
  ChevronDown
} from "lucide-react";
import { useFinance } from "../../context/FinanceContext";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { useDevice } from "../../context/DeviceContext";
import { MonthPickerDropdown } from "../common/MonthPickerDropdown";
import { UserProfileModal } from "../auth/UserProfileModal";
import { GlobalSearchModal } from "../common/GlobalSearchModal";

const TAB_SUBTITLES = {
  "Dashboard Financeiro": "Visão geral da sua vida financeira",
  "Gestão de Cartões & Faturas": "Acompanhe seus cartões, consulte faturas e gerencie seus limites de forma inteligente.",
  "Movimentações & Transações": "Listagem detalhada de gastos, receitas e compras parceladas no cartão.",
  "Planejamento Orçamentário 50/30/20": "Organize suas finanças equilibrando necessidades, estilo de vida e investimentos.",
  "Assinaturas & Gastos Recorrentes": "Monitore seus contratos recorrentes, datas de cobrança e custos fixos.",
  "Simulador de Investimentos": "Projeção de juros compostos e evolução do seu patrimônio.",
  "Metas & Sonhos Financeiros": "Acompanhe suas economias e conquistas planejadas."
};

export const Header = ({
  activeTabTitle,
  onOpenAddTransaction,
  onOpenCategoryModal,
  onToggleMobileSidebar
}) => {
  const { selectedMonth, setSelectedMonth, isPrivacyMode, togglePrivacyMode } = useFinance();
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const { viewMode, setViewMode } = useDevice();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const menuRef = useRef(null);

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const subtitle = TAB_SUBTITLES[activeTabTitle] || "Controle e gestão financeira completa";
  const userName = user?.name || "Guilherme Viana";
  const userInitial = userName.charAt(0).toUpperCase();

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
            className="header-circle-btn mobile-menu-btn"
            onClick={onToggleMobileSidebar}
            aria-label="Abrir Menu"
          >
            <Menu size={20} />
          </button>
          <div className="header-title-wrapper">
            <h1 className="page-title">{activeTabTitle}</h1>
            <span className="page-subtitle">{subtitle}</span>
          </div>
        </div>

        <div className="header-right">
          {/* Custom Month Picker Capsule matching screenshot */}
          <MonthPickerDropdown
            selectedMonth={selectedMonth}
            onSelectMonth={setSelectedMonth}
          />

          {/* Search Button (Circle with search icon) */}
          <button
            type="button"
            className="header-circle-btn"
            onClick={() => setIsSearchOpen(true)}
            title="Buscar transações, categorias... (Ctrl+K)"
          >
            <Search size={17} />
          </button>

          {/* Notification Bell with alert dot */}
          <button
            type="button"
            className="header-circle-btn"
            title="Notificações & Alertas"
          >
            <Bell size={17} />
            <span className="header-badge-dot" />
          </button>

          {/* User Profile Capsule matching Reference Images */}
          <div
            className="header-user-capsule"
            onClick={() => setIsProfileModalOpen(true)}
            title="Ver meu perfil e configurações"
          >
            <div className="user-avatar-circle" style={{ background: "#0284c7", width: 32, height: 32, fontSize: "0.82rem" }}>
              {userInitial}
            </div>
            <div className="header-user-info-text">
              <span className="header-user-name">{userName}</span>
              <span className="header-user-plan">Plano Pro</span>
            </div>
          </div>

          {/* Primary CTA Button: + Nova Transação */}
          <button className="btn btn-primary" onClick={onOpenAddTransaction}>
            <Plus size={18} />
            <span>Nova Transação</span>
          </button>
        </div>
      </header>

      {/* User Profile Modal */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />

      {/* Global Search Command Palette */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
};
