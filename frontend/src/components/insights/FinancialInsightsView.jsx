import React, { useState } from "react";
import {
  Sparkles,
  TrendingUp,
  AlertCircle,
  PiggyBank,
  CheckCircle2,
  Calendar,
  Utensils,
  Home,
  Car,
  Gamepad2,
  Heart,
  Tv,
  MoreHorizontal,
  ChevronRight,
  Lightbulb,
  Info,
  X,
  Sliders,
  Check,
  Zap,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { formatCurrency } from "../../utils/formatters";

export const FinancialInsightsView = () => {
  const [activeModal, setActiveModal] = useState(null); // 'subscriptions' | 'budget' | 'savings' | 'alerts'
  const [selectedCardFilter, setSelectedCardFilter] = useState("all");

  const [subscriptionsList, setSubscriptionsList] = useState([
    { id: 1, name: "Netflix Premium 4K", amount: 55.90, lastMonth: 44.90, active: true, unused: false },
    { id: 2, name: "Spotify Family", amount: 34.90, lastMonth: 34.90, active: true, unused: false },
    { id: 3, name: "Amazon Prime + Canais", amount: 89.90, lastMonth: 49.90, active: true, unused: true },
    { id: 4, name: "Academia Smart Fit Black", amount: 129.90, lastMonth: 109.90, active: true, unused: false },
    { id: 5, name: "YouTube Premium", amount: 41.90, lastMonth: 31.90, active: true, unused: true },
    { id: 6, name: "Claude AI Pro", amount: 110.00, lastMonth: 110.00, active: true, unused: false },
  ]);

  const [budgetLimits, setBudgetLimits] = useState([
    { category: "Alimentação", current: 980.00, limit: 750.00, icon: Utensils, color: "#f59e0b" },
    { category: "Moradia", current: 1580.00, limit: 1600.00, icon: Home, color: "#f43f5e" },
    { category: "Transporte", current: 678.00, limit: 700.00, icon: Car, color: "#10b981" },
    { category: "Lazer", current: 564.00, limit: 500.00, icon: Gamepad2, color: "#8b5cf6" },
  ]);

  const categoryTrends = [
    { name: "Moradia", amount: 1580.00, change: -5, icon: Home, color: "#f43f5e" },
    { name: "Alimentação", amount: 980.00, change: 32, icon: Utensils, color: "#f59e0b" },
    { name: "Transporte", amount: 678.00, change: -12, icon: Car, color: "#10b981" },
    { name: "Lazer", amount: 564.00, change: 18, icon: Gamepad2, color: "#8b5cf6" },
    { name: "Saúde", amount: 452.00, change: -8, icon: Heart, color: "#3b82f6" },
    { name: "Assinaturas", amount: 438.90, change: 28, icon: Tv, color: "#06b6d4" },
    { name: "Outros", amount: 952.00, change: 6, icon: MoreHorizontal, color: "#64748b" },
  ];

  const monthComparisons = [
    { label: "Receitas", lastMonth: 5000.00, thisMonth: 5200.00, lastMonthH: 70, thisMonthH: 75 },
    { label: "Despesas", lastMonth: 5100.00, thisMonth: 5600.00, lastMonthH: 68, thisMonthH: 82 },
    { label: "Gastos Fixos", lastMonth: 2800.00, thisMonth: 3000.00, lastMonthH: 45, thisMonthH: 50 },
    { label: "Gastos Variáveis", lastMonth: 2300.00, thisMonth: 2600.00, lastMonthH: 38, thisMonthH: 45 },
  ];

  const toggleSubscription = (id) => {
    setSubscriptionsList(prev =>
      prev.map(s => s.id === id ? { ...s, active: !s.active } : s)
    );
  };

  const handleUpdateLimit = (catName, newLim) => {
    setBudgetLimits(prev =>
      prev.map(b => b.category === catName ? { ...b, limit: parseFloat(newLim) || 0 } : b)
    );
  };

  return (
    <div className="fin-insights-layout">
      {/* Top Banner: Saúde Financeira 78/100 */}
      <div className="insights-hero-banner">
        <div className="insights-hero-left">
          {/* Ring score */}
          <div className="insights-score-circle">
            <svg width="86" height="86" viewBox="0 0 86 86">
              <circle cx="43" cy="43" r="34" fill="none" stroke="#e2e8f0" strokeWidth="8" />
              <circle
                cx="43"
                cy="43"
                r="34"
                fill="none"
                stroke="#10b981"
                strokeWidth="8"
                strokeDasharray="213.6"
                strokeDashoffset="47"
                strokeLinecap="round"
                transform="rotate(-90 43 43)"
              />
            </svg>
            <div className="insights-score-text">
              <span className="score-val">78</span>
              <span className="score-sub">de 100</span>
            </div>
          </div>

          <div className="insights-hero-info">
            <div className="insights-header-badge-row">
              <div className="insights-heart-icon">
                <Sparkles size={17} color="#10b981" />
              </div>
              <h2 className="insights-title">Sua Saúde Financeira está Boa</h2>
              <span className="insights-badge-evolution">Em evolução</span>
            </div>
            <p className="insights-desc">
              Você está no caminho certo! Seus gastos estão controlados e há boas oportunidades para economizar neste mês.
            </p>
            <button
              type="button"
              className="insights-link-btn"
              onClick={() => setActiveModal("alerts")}
            >
              <Lightbulb size={14} />
              <span>Veja todos os insights e recomendações detalhadas →</span>
            </button>
          </div>
        </div>

        {/* Right side checklist & vector art */}
        <div className="insights-hero-right">
          <div className="insights-checklist">
            <div className="check-item"><CheckCircle2 size={15} color="#10b981" /><span>Gastos sob controle</span></div>
            <div className="check-item"><CheckCircle2 size={15} color="#10b981" /><span>Boa economia mensal</span></div>
            <div className="check-item"><CheckCircle2 size={15} color="#10b981" /><span>Oportunidades identificadas</span></div>
          </div>

          <div className="insights-plant-art">
            <svg width="110" height="70" viewBox="0 0 110 70" fill="none">
              <rect x="5" y="45" width="8" height="20" rx="2" fill="#34d399" fillOpacity="0.3" />
              <rect x="18" y="32" width="8" height="33" rx="2" fill="#34d399" fillOpacity="0.45" />
              <rect x="31" y="20" width="8" height="45" rx="2" fill="#34d399" fillOpacity="0.6" />
              <path d="M5 50 Q 25 40, 42 12" stroke="#10b981" strokeWidth="2" strokeLinecap="round" />
              <path d="M72 45 H 96 L 92 65 H 76 Z" fill="#94a3b8" />
              <path d="M84 45 Q 84 15, 98 18 Q 92 36, 84 45 Z" fill="#10b981" />
              <path d="M84 45 Q 84 20, 68 22 Q 74 38, 84 45 Z" fill="#059669" />
            </svg>
          </div>
        </div>
      </div>

      {/* Middle Row: 3 Action Cards */}
      <div className="insights-3cards-grid">
        {/* Card 1: Assinaturas aumentaram */}
        <div className="insight-card red-theme">
          <div className="insight-card-top">
            <div className="insight-icon-box red">
              <Tv size={17} />
            </div>
            <div className="insight-card-header-text">
              <h4>Assinaturas aumentaram</h4>
              <p>Seus gastos com assinaturas subiram 28% em relação ao mês passado.</p>
            </div>
            <span className="insight-badge red">↑ 28%</span>
          </div>

          <div className="insight-comparison-row">
            <div>
              <span className="comp-val">{formatCurrency(438.90)}</span>
              <span className="comp-lbl">Este mês</span>
            </div>
            <div>
              <span className="comp-val muted">{formatCurrency(342.50)}</span>
              <span className="comp-lbl">Mês passado</span>
            </div>
          </div>

          <button
            type="button"
            className="insight-action-btn red"
            onClick={() => setActiveModal("subscriptions")}
          >
            <span>Revisar assinaturas</span>
            <ChevronRight size={14} />
          </button>
        </div>

        {/* Card 2: Gasto com alimentação acima do limite */}
        <div className="insight-card orange-theme">
          <div className="insight-card-top">
            <div className="insight-icon-box orange">
              <Utensils size={17} />
            </div>
            <div className="insight-card-header-text">
              <h4>Gasto com alimentação acima do limite</h4>
              <p>Você gastou 32% acima do orçamento definido para alimentação.</p>
            </div>
            <span className="insight-badge orange">↑ 32%</span>
          </div>

          <div className="insight-comparison-row">
            <div>
              <span className="comp-val">{formatCurrency(980.00)}</span>
              <span className="comp-lbl">Gasto atual</span>
            </div>
            <div>
              <span className="comp-val muted">{formatCurrency(750.00)}</span>
              <span className="comp-lbl">Seu limite</span>
            </div>
          </div>

          <button
            type="button"
            className="insight-action-btn orange"
            onClick={() => setActiveModal("budget")}
          >
            <span>Ajustar orçamento</span>
            <ChevronRight size={14} />
          </button>
        </div>

        {/* Card 3: Chance de economizar R$ 240 */}
        <div className="insight-card green-theme">
          <div className="insight-card-top">
            <div className="insight-icon-box green">
              <PiggyBank size={18} />
            </div>
            <div className="insight-card-header-text">
              <h4>Chance de economizar R$ 240 neste mês</h4>
              <p>Identificamos despesas que podem ser reduzidas ou otimizadas.</p>
            </div>
          </div>

          <div className="savings-opportunities-list">
            <div className="saving-row">
              <span className="saving-name">Assinaturas não utilizadas</span>
              <span className="saving-val">{formatCurrency(120.00)}</span>
            </div>
            <div className="saving-row">
              <span className="saving-name">Planos e serviços</span>
              <span className="saving-val">{formatCurrency(70.00)}</span>
            </div>
            <div className="saving-row">
              <span className="saving-name">Oportunidades de melhores tarifas</span>
              <span className="saving-val">{formatCurrency(50.00)}</span>
            </div>
          </div>

          <button
            type="button"
            className="insight-action-btn green"
            onClick={() => setActiveModal("savings")}
          >
            <span>Ver oportunidades de economia</span>
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Bottom Row: 2 Panels (Comparação mensal e Tendências) */}
      <div className="insights-bottom-grid">
        {/* Left: Este mês vs mês passado */}
        <div className="insight-panel">
          <div className="panel-header">
            <div>
              <h3 className="panel-title">Este mês vs. mês passado</h3>
              <p className="panel-sub">Compare seus gastos e receitas para identificar mudanças</p>
            </div>
            <div className="panel-legend">
              <span><span className="legend-dot grey" /> Mês passado</span>
              <span><span className="legend-dot teal" /> Este mês</span>
            </div>
          </div>

          {/* Clean modern comparison bar grid with no overlapping text */}
          <div className="clean-comparison-bars">
            {monthComparisons.map((item, idx) => (
              <div key={idx} className="clean-comp-col">
                <div className="clean-bars-wrapper">
                  {/* Last Month Bar */}
                  <div className="clean-bar-container">
                    <span className="clean-bar-value">
                      {formatCurrency(item.lastMonth).replace(",00", "")}
                    </span>
                    <div
                      className="clean-bar-rect last-month"
                      style={{ height: `${item.lastMonthH}%` }}
                      title={`Mês passado: ${formatCurrency(item.lastMonth)}`}
                    />
                  </div>

                  {/* This Month Bar */}
                  <div className="clean-bar-container">
                    <span className="clean-bar-value highlight">
                      {formatCurrency(item.thisMonth).replace(",00", "")}
                    </span>
                    <div
                      className="clean-bar-rect this-month"
                      style={{ height: `${item.thisMonthH}%` }}
                      title={`Este mês: ${formatCurrency(item.thisMonth)}`}
                    />
                  </div>
                </div>

                <span className="clean-comp-label">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Tendência de Gastos por Categoria */}
        <div className="insight-panel">
          <div className="panel-header">
            <div>
              <h3 className="panel-title">Tendência de Gastos por Categoria</h3>
              <p className="panel-sub">Variação em relação ao mês passado</p>
            </div>
            <select
              className="panel-select"
              value={selectedCardFilter}
              onChange={(e) => setSelectedCardFilter(e.target.value)}
            >
              <option value="all">Todos os cartões</option>
              <option value="nubank">Nubank Ultravioleta</option>
              <option value="itau">Itaú Personnalité</option>
            </select>
          </div>

          <div className="cat-trends-list">
            {categoryTrends.map((cat, idx) => (
              <div key={idx} className="cat-trend-row">
                <div className="trend-left">
                  <div className="trend-icon-circle" style={{ color: cat.color }}>
                    <cat.icon size={15} />
                  </div>
                  <span className="trend-name">{cat.name}</span>
                </div>

                <span className="trend-amount">{formatCurrency(cat.amount)}</span>

                <div className={`trend-badge ${cat.change < 0 ? "down" : "up"}`}>
                  <span>{cat.change > 0 ? `↑ ${cat.change}%` : `↓ ${Math.abs(cat.change)}%`}</span>
                </div>

                <div className="trend-spark">
                  <svg width="40" height="14" viewBox="0 0 40 14" fill="none">
                    <path
                      d={cat.change > 0 ? "M2 12 Q 15 10, 25 4 T 38 2" : "M2 2 Q 15 4, 25 10 T 38 12"}
                      stroke={cat.change > 0 ? "#f43f5e" : "#10b981"}
                      strokeWidth="2"
                      fill="none"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal 1: Revisar Assinaturas */}
      {activeModal === "subscriptions" && (
        <div className="modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-with-icon">
                <div className="modal-title-icon red">
                  <Tv size={20} />
                </div>
                <div>
                  <h3>Revisar Assinaturas e Serviços</h3>
                  <p className="modal-subtitle">Ative ou pause serviços para diminuir custos recorrentes</p>
                </div>
              </div>
              <button type="button" className="modal-close-btn" onClick={() => setActiveModal(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="subs-modal-body">
              {subscriptionsList.map(sub => (
                <div key={sub.id} className={`sub-review-card ${!sub.active ? "paused" : ""}`}>
                  <div className="sub-review-left">
                    <span className="sub-title-bold">{sub.name}</span>
                    <span className="sub-meta">
                      {formatCurrency(sub.amount)}/mês{" "}
                      {sub.unused && <span className="unused-badge">Sem uso há 30 dias</span>}
                    </span>
                  </div>
                  <button
                    type="button"
                    className={`btn-sub-toggle ${sub.active ? "btn-cancel" : "btn-reactivate"}`}
                    onClick={() => toggleSubscription(sub.id)}
                  >
                    {sub.active ? "Pausar / Cancelar" : "Reativar"}
                  </button>
                </div>
              ))}
            </div>

            <div className="invite-modal-footer">
              <button type="button" className="btn btn-primary" onClick={() => setActiveModal(null)}>
                Salvar Alterações
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Ajustar Orçamento */}
      {activeModal === "budget" && (
        <div className="modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-with-icon">
                <div className="modal-title-icon orange">
                  <Sliders size={20} />
                </div>
                <div>
                  <h3>Ajustar Limites do Orçamento</h3>
                  <p className="modal-subtitle">Defina tetos mensais para manter suas finanças no azul</p>
                </div>
              </div>
              <button type="button" className="modal-close-btn" onClick={() => setActiveModal(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="budget-adjust-body">
              {budgetLimits.map((b, idx) => (
                <div key={idx} className="budget-adjust-row">
                  <div className="b-adjust-icon" style={{ color: b.color }}>
                    <b.icon size={18} />
                  </div>
                  <div className="b-adjust-info">
                    <span className="b-cat-name">{b.category}</span>
                    <span className="b-cat-current">Gasto atual: {formatCurrency(b.current)}</span>
                  </div>
                  <div className="b-adjust-input-box">
                    <span className="currency-prefix">R$</span>
                    <input
                      type="number"
                      className="form-input b-input"
                      value={b.limit}
                      onChange={(e) => handleUpdateLimit(b.category, e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="invite-modal-footer">
              <button type="button" className="btn btn-primary" onClick={() => setActiveModal(null)}>
                Atualizar Metas de Orçamento
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 3: Oportunidades de Economia */}
      {activeModal === "savings" && (
        <div className="modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-with-icon">
                <div className="modal-title-icon green">
                  <PiggyBank size={20} />
                </div>
                <div>
                  <h3>Oportunidades de Economia Identificadas</h3>
                  <p className="modal-subtitle">Potencial total de economia: R$ 240,00 / mês</p>
                </div>
              </div>
              <button type="button" className="modal-close-btn" onClick={() => setActiveModal(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="savings-modal-body">
              <div className="saving-card-detailed">
                <div className="saving-d-header">
                  <span className="saving-d-title">1. Assinaturas duplicadas / não utilizadas</span>
                  <span className="saving-d-gain">+ R$ 120,00/mês</span>
                </div>
                <p className="saving-d-desc">
                  Você possui duas assinaturas de streaming com catálogos similares que não foram acessadas nos últimos 45 dias.
                </p>
              </div>

              <div className="saving-card-detailed">
                <div className="saving-d-header">
                  <span className="saving-d-title">2. Renegociação do Plano de Internet Fibra</span>
                  <span className="saving-d-gain">+ R$ 70,00/mês</span>
                </div>
                <p className="saving-d-desc">
                  Sua operadora atual oferece pacotes equivalentes de 600 Mega por R$ 79,90 no plano fidelidade.
                </p>
              </div>

              <div className="saving-card-detailed">
                <div className="saving-d-header">
                  <span className="saving-d-title">3. Tarifas bancárias & Cashback</span>
                  <span className="saving-d-gain">+ R$ 50,00/mês</span>
                </div>
                <p className="saving-d-desc">
                  Migrando pagamentos para a conta digital com rendimento de 105% do CDI, você ganha liquidez diária.
                </p>
              </div>
            </div>

            <div className="invite-modal-footer">
              <button type="button" className="btn btn-primary" onClick={() => setActiveModal(null)}>
                Entendido!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 4: Todos os Alertas */}
      {activeModal === "alerts" && (
        <div className="modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-with-icon">
                <div className="modal-title-icon teal">
                  <Lightbulb size={20} />
                </div>
                <div>
                  <h3>Central de Insights e Recomendações</h3>
                  <p className="modal-subtitle">Panorama completo da sua saúde financeira</p>
                </div>
              </div>
              <button type="button" className="modal-close-btn" onClick={() => setActiveModal(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="alerts-modal-list">
              <div className="alert-item red">
                <AlertCircle size={18} />
                <div>
                  <strong>Alimentação ultrapassou 32% do teto</strong>
                  <p>Gastos em restaurantes e delivery somaram R$ 980,00 este mês.</p>
                </div>
              </div>

              <div className="alert-item orange">
                <AlertCircle size={18} />
                <div>
                  <strong>Fatura Nubank vence em 6 dias</strong>
                  <p>Valor de R$ 1.284,00 agendado para débito em conta corrente.</p>
                </div>
              </div>

              <div className="alert-item green">
                <CheckCircle2 size={18} />
                <div>
                  <strong>Reserva de Emergência atingiu 80% da meta</strong>
                  <p>Faltam apenas R$ 5.000,00 para concluir sua meta de segurança.</p>
                </div>
              </div>
            </div>

            <div className="invite-modal-footer">
              <button type="button" className="btn btn-primary" onClick={() => setActiveModal(null)}>
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
