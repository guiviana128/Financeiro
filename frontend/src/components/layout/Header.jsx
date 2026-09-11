import React from "react";
import { Plus, Sun, Moon, Calendar, Menu, Eye, EyeOff, Tag, ShieldCheck, Zap } from "lucide-react";
import { useFinance } from "../../context/FinanceContext";
import { useTheme } from "../../context/ThemeContext";
import { MonthPickerDropdown } from "../common/MonthPickerDropdown";

export const Header = ({
  activeTabTitle,
  onOpenAddTransaction,
  onOpenCategoryModal,
  onToggleMobileSidebar
}) => {
  const { selectedMonth, setSelectedMonth, isPrivacyMode, togglePrivacyMode, backendConnected } = useFinance();
  const { theme, toggleTheme } = useTheme();

  return (
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

        {/* Custom Month Picker */}
        <MonthPickerDropdown
          selectedMonth={selectedMonth}
          onSelectMonth={setSelectedMonth}
        />

        {/* Privacy Mode Toggle */}
        <button
          className="icon-btn"
          onClick={togglePrivacyMode}
          title={isPrivacyMode ? "Mostrar valores" : "Esconder valores (Modo Privacidade)"}
          aria-label="Modo Privacidade"
        >
          {isPrivacyMode ? <EyeOff size={18} color="#f43f5e" /> : <Eye size={18} />}
        </button>

        {/* Manage Categories Button */}
        {onOpenCategoryModal && (
          <button
            className="icon-btn"
            onClick={onOpenCategoryModal}
            title="Gerenciar Categorias"
            aria-label="Gerenciar Categorias"
          >
            <Tag size={18} />
          </button>
        )}

        {/* Theme Toggle */}
        <button
          className="icon-btn"
          onClick={toggleTheme}
          title={theme === "dark" ? "Mudar para Modo Claro" : "Mudar para Modo Escuro"}
          aria-label="Alternar tema"
        >
          {theme === "dark" ? <Sun size={18} color="#f59e0b" /> : <Moon size={18} color="#6366f1" />}
        </button>

        {/* Quick Add Button */}
        <button className="btn btn-primary" onClick={onOpenAddTransaction}>
          <Plus size={18} />
          <span>Nova Transação</span>
        </button>
      </div>
    </header>
  );
};
