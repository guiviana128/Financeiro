import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  X,
  Clock,
  ArrowRightLeft,
  CreditCard,
  Tag,
  Target,
  ArrowRight,
  TrendingUp,
  Palmtree,
  Home,
  Car,
  Utensils,
  ShoppingBag,
  Sparkles,
  ChevronRight
} from "lucide-react";
import { useFinance } from "../../context/FinanceContext";
import { formatCurrency } from "../../utils/formatters";
import { BrandLogo } from "./BrandLogo";

const INITIAL_RECENT_SEARCHES = [
  { id: 1, text: "mercado", time: "Hoje, 10:24" },
  { id: 2, text: "cartão nubank", time: "Hoje, 09:15" },
  { id: 3, text: "viagem europa", time: "Ontem, 18:32" },
  { id: 4, text: "assinaturas", time: "Ontem, 11:45" },
  { id: 5, text: "meta casa", time: "12 de mai, 14:20" }
];

export const GlobalSearchModal = ({ isOpen, onClose, onNavigateTab }) => {
  const { transactions, creditCards, categories, goals } = useFinance();
  const [query, setQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState(INITIAL_RECENT_SEARCHES);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  // Keyboard shortcut listener for Esc
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleClearRecents = () => {
    setRecentSearches([]);
  };

  const handleRemoveRecent = (id, e) => {
    e.stopPropagation();
    setRecentSearches((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSelectRecent = (text) => {
    setQuery(text);
  };

  // Filter transactions
  const filteredTransactions = transactions.filter((t) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      t.description.toLowerCase().includes(q) ||
      t.category_name?.toLowerCase().includes(q) ||
      t.payment_method?.toLowerCase().includes(q)
    );
  }).slice(0, 3);

  // Filter cards
  const filteredCards = creditCards.filter((c) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.bank?.toLowerCase().includes(q) ||
      c.last_four?.includes(q)
    );
  }).slice(0, 3);

  // Filter categories
  const filteredCategories = categories.filter((c) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return c.name.toLowerCase().includes(q);
  }).slice(0, 3);

  // Filter goals
  const filteredGoals = (goals && goals.length > 0 ? goals : [
    { id: 1, title: "Viagem Europa", current_amount: 4230, target_amount: 15000, icon: "palmtree" },
    { id: 2, title: "Entrada do Apê", current_amount: 35000, target_amount: 120000, icon: "home" },
    { id: 3, title: "Carro Novo", current_amount: 12400, target_amount: 80000, icon: "car" }
  ]).filter((g) => {
    if (!query.trim()) return true;
    return g.title.toLowerCase().includes(query.toLowerCase());
  }).slice(0, 3);

  const getGoalIcon = (iconName) => {
    switch (iconName?.toLowerCase()) {
      case "palmtree":
      case "viagem":
        return <Palmtree size={18} color="#0d9488" />;
      case "home":
      case "casa":
        return <Home size={18} color="#ea580c" />;
      case "car":
      case "carro":
        return <Car size={18} color="#0284c7" />;
      default:
        return <Target size={18} color="#0d9488" />;
    }
  };

  const activeSearchTerm = query.trim() || "mercado";

  return (
    <div className="global-search-backdrop" onClick={onClose}>
      <div className="global-search-modal" onClick={(e) => e.stopPropagation()}>
        {/* Top Search Bar */}
        <div className="search-modal-header">
          <Search size={20} className="search-input-main-icon" />
          <input
            ref={inputRef}
            type="text"
            className="search-modal-input"
            placeholder="Buscar transações, cartões, categorias e metas"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="search-header-actions">
            <span className="search-key-badge">Esc</span>
            <button
              type="button"
              className="search-close-x-btn"
              onClick={onClose}
              title="Fechar (Esc)"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* 3 Columns Layout */}
        <div className="search-modal-grid">
          {/* Column 1: Buscas recentes */}
          <div className="search-column">
            <div className="search-col-header">
              <div className="search-col-title">
                <Clock size={15} />
                <span>Buscas recentes</span>
              </div>
              {recentSearches.length > 0 && (
                <button
                  type="button"
                  className="search-clear-btn"
                  onClick={handleClearRecents}
                >
                  Limpar tudo
                </button>
              )}
            </div>

            <div className="search-recents-list">
              {recentSearches.length === 0 ? (
                <div className="search-empty-hint">Nenhuma busca recente</div>
              ) : (
                recentSearches.map((item) => (
                  <div
                    key={item.id}
                    className="search-recent-item"
                    onClick={() => handleSelectRecent(item.text)}
                  >
                    <div className="recent-item-left">
                      <Search size={14} className="recent-icon" />
                      <div className="recent-texts">
                        <span className="recent-term">{item.text}</span>
                        <span className="recent-time">{item.time}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="recent-delete-btn"
                      onClick={(e) => handleRemoveRecent(item.id, e)}
                    >
                      <X size={13} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Column 2: Transações, Cartões, Categorias */}
          <div className="search-column middle-column">
            {/* Transações */}
            <div className="search-section-group">
              <div className="search-col-header">
                <div className="search-col-title">
                  <ArrowRightLeft size={15} color="#0d9488" />
                  <span>Transações</span>
                </div>
                <span className="search-see-all-link">Ver todas ({transactions.length || 12}) &gt;</span>
              </div>

              <div className="search-items-list">
                {(filteredTransactions.length > 0 ? filteredTransactions : [
                  { id: 1, description: "Supermercado Extra", date: "Hoje, 10:24", category_name: "Alimentação", amount: 156.90, type: "expense" },
                  { id: 2, description: "Restaurante Basilicata", date: "Ontem, 20:14", category_name: "Alimentação", amount: 89.00, type: "expense" },
                  { id: 3, description: "Passagens Europa", date: "12 de mai, 14:20", category_name: "Viagens", amount: 4230.00, type: "expense" }
                ]).map((tx) => (
                  <div key={tx.id} className="search-result-row">
                    <div className="result-row-left">
                      <div className="result-avatar-circle" style={{ background: "#fee2e2", color: "#ef4444" }}>
                        <ShoppingBag size={14} />
                      </div>
                      <div className="result-details">
                        <span className="result-title">{tx.description}</span>
                        <span className="result-subtitle">
                          {tx.date ? String(tx.date).slice(0, 10) : "Hoje"} • {tx.category_name || "Geral"}
                        </span>
                      </div>
                    </div>
                    <span className="result-amount-expense">
                      - {formatCurrency(tx.amount)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Cartões */}
            <div className="search-section-group">
              <div className="search-col-header">
                <div className="search-col-title">
                  <CreditCard size={15} color="#0d9488" />
                  <span>Cartões</span>
                </div>
                <span className="search-see-all-link">Ver todas ({creditCards.length || 3}) &gt;</span>
              </div>

              <div className="search-items-list">
                {(filteredCards.length > 0 ? filteredCards : [
                  { id: 1, name: "Nubank", type: "Cartão de crédito", last_four: "1234", brand: "nubank" },
                  { id: 2, name: "Visa Infinite", type: "Cartão de crédito", last_four: "5678", brand: "visa" },
                  { id: 3, name: "Itaú Personnalité", type: "Cartão de crédito", last_four: "9012", brand: "itau" }
                ]).map((card) => (
                  <div key={card.id} className="search-result-row">
                    <div className="result-row-left">
                      <div className="card-brand-badge-square">
                        <BrandLogo brand={card.brand || card.name} size={18} />
                      </div>
                      <div className="result-details">
                        <span className="result-title">{card.name}</span>
                        <span className="result-subtitle">
                          Cartão de crédito • Final {card.last_four || "1234"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Categorias */}
            <div className="search-section-group">
              <div className="search-col-header">
                <div className="search-col-title">
                  <Tag size={15} color="#0d9488" />
                  <span>Categorias</span>
                </div>
                <span className="search-see-all-link">Ver todas ({categories.length || 8}) &gt;</span>
              </div>

              <div className="search-items-list">
                {(filteredCategories.length > 0 ? filteredCategories : [
                  { id: 1, name: "Alimentação", count: 42, icon: "utensils", color: "#f43f5e" },
                  { id: 2, name: "Compras", count: 28, icon: "shopping", color: "#8b5cf6" },
                  { id: 3, name: "Transporte", count: 18, icon: "car", color: "#10b981" }
                ]).map((cat) => (
                  <div key={cat.id} className="search-result-row">
                    <div className="result-row-left">
                      <div className="result-avatar-circle" style={{ background: "#f1f5f9", color: "#0d9488" }}>
                        <Tag size={14} />
                      </div>
                      <div className="result-details">
                        <span className="result-title">{cat.name}</span>
                        <span className="result-subtitle">
                          {cat.count || 24} transações recentes
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Column 3: Metas */}
          <div className="search-column">
            <div className="search-col-header">
              <div className="search-col-title">
                <Target size={15} color="#0d9488" />
                <span>Metas</span>
              </div>
              <span className="search-see-all-link">Ver todas ({goals.length || 4}) &gt;</span>
            </div>

            <div className="search-items-list">
              {filteredGoals.map((goal) => {
                const pct = Math.min(100, Math.round((goal.current_amount / goal.target_amount) * 100)) || 25;
                return (
                  <div key={goal.id} className="search-goal-card">
                    <div className="goal-card-top">
                      <div className="goal-icon-circle">
                        {getGoalIcon(goal.icon || goal.title)}
                      </div>
                      <div className="goal-text-info">
                        <span className="goal-title">{goal.title}</span>
                        <span className="goal-progress-text">
                          {formatCurrency(goal.current_amount)} de {formatCurrency(goal.target_amount)}
                        </span>
                      </div>
                      <span className="goal-percentage-badge">{pct}%</span>
                    </div>

                    <div className="goal-progressbar-track">
                      <div className="goal-progressbar-fill" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Action Bar */}
        <div className="search-modal-footer">
          <div className="search-footer-left">
            <Search size={15} color="#0d9488" />
            <span>Ver todos os resultados para <strong>"{activeSearchTerm}"</strong></span>
            <ArrowRight size={14} color="#0d9488" />
          </div>
          <span className="search-key-badge-enter">Enter</span>
        </div>
      </div>
    </div>
  );
};
