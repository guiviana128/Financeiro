import React, { useState } from "react";
import {
  TrendingUp,
  AlertTriangle,
  Calendar,
  DollarSign,
  ArrowRight,
  Info,
  Sliders,
  CheckCircle2,
  CalendarDays,
  Sparkles,
  RefreshCw,
  Zap,
  TrendingDown,
  CreditCard
} from "lucide-react";
import { formatCurrency } from "../../utils/formatters";

export const BalanceForecastView = () => {
  const [viewInterval, setViewInterval] = useState("weekly"); // 'weekly' | 'monthly'
  const [scenarioType, setScenarioType] = useState("single"); // 'single' | 'monthly' | 'trip' | 'other'
  const [extraAmount, setExtraAmount] = useState(300);
  const [extraDate, setExtraDate] = useState("2026-09-25");
  const [appliedAmount, setAppliedAmount] = useState(300);
  const [appliedType, setAppliedType] = useState("single");
  const [isSimulated, setIsSimulated] = useState(true);

  const handleApplyScenario = (e) => {
    e.preventDefault();
    setAppliedAmount(parseFloat(extraAmount) || 0);
    setAppliedType(scenarioType);
    setIsSimulated(true);
  };

  const baseNegativeAmount = 1280;
  const simulatedNegativeAmount = baseNegativeAmount + appliedAmount;

  return (
    <div className="forecast-layout animate-fade-in">
      {/* Top Banner: Planeje com mais tranquilidade */}
      <div className="forecast-hero-banner">
        <div className="forecast-hero-left">
          <div className="forecast-score-circle">
            <svg width="76" height="76" viewBox="0 0 76 76">
              <circle cx="38" cy="38" r="30" fill="none" stroke="#e2e8f0" strokeWidth="6" />
              <circle
                cx="38"
                cy="38"
                r="30"
                fill="none"
                stroke="#10b981"
                strokeWidth="6"
                strokeDasharray="188.4"
                strokeDashoffset="56"
                strokeLinecap="round"
                transform="rotate(-90 38 38)"
              />
            </svg>
            <div className="forecast-hero-icon">
              <TrendingUp size={22} color="#0d9488" />
            </div>
          </div>

          <div className="forecast-hero-info">
            <h2 className="forecast-title">Planeje com mais tranquilidade</h2>
            <p className="forecast-desc">
              A previsão de saldo é baseada nos seus lançamentos cadastrados (receitas, contas, assinaturas e faturas).
              É uma estimativa dinâmica que se adapta a novos gastos.
            </p>
            <div className="forecast-sub-tag">
              <Info size={14} />
              <span>Baseado em lançamentos cadastrados e histórico dos últimos 6 meses</span>
            </div>
          </div>
        </div>

        <div className="forecast-hero-right">
          <div className="forecast-plant-art">
            <svg width="120" height="70" viewBox="0 0 120 70" fill="none">
              <path d="M10 55 Q 35 45, 60 18 Q 85 45, 110 55" stroke="#10b981" strokeWidth="2.5" fill="none" />
              <circle cx="60" cy="18" r="4" fill="#10b981" />
              <path d="M78 48 H 106 L 102 68 H 82 Z" fill="#94a3b8" />
              <path d="M92 48 Q 92 20, 106 22 Q 100 40, 92 48 Z" fill="#10b981" />
              <path d="M92 48 Q 92 25, 78 27 Q 84 42, 92 48 Z" fill="#059669" />
            </svg>
          </div>
        </div>
      </div>

      {/* 4 Top Metric Cards */}
      <div className="forecast-metrics-grid">
        {/* Card 1: Saldo atual */}
        <div className="forecast-stat-card">
          <div className="fstat-header">
            <span className="fstat-label">Saldo atual</span>
            <div className="fstat-icon-circle blue">
              <DollarSign size={16} />
            </div>
          </div>
          <div className="fstat-amount">{formatCurrency(5645.90)}</div>
          <span className="fstat-sub">Em 21 de set. de 2026</span>
        </div>

        {/* Card 2: Saldo previsto em 30 dias */}
        <div className="forecast-stat-card">
          <div className="fstat-header">
            <div className="fstat-label-with-info">
              <span className="fstat-label">Saldo previsto em 30 dias</span>
              <Info size={12} color="#94a3b8" />
            </div>
            <div className="fstat-icon-circle green">
              <TrendingUp size={16} />
            </div>
          </div>
          <div className="fstat-amount-row">
            <span className="fstat-amount">{formatCurrency(3920.00)}</span>
            <span className="fstat-badge green">↑ 12%</span>
          </div>
          <span className="fstat-sub">Em 21 de out. de 2026</span>
        </div>

        {/* Card 3: Menor saldo previsto */}
        <div className="forecast-stat-card alert">
          <div className="fstat-header">
            <div className="fstat-label-with-info">
              <span className="fstat-label">Menor saldo previsto</span>
              <Info size={12} color="#94a3b8" />
            </div>
            <div className="fstat-icon-circle red">
              <AlertTriangle size={16} />
            </div>
          </div>
          <div className="fstat-amount red">-{formatCurrency(450.00)}</div>
          <span className="fstat-sub">Em 12 de nov. de 2026</span>
        </div>

        {/* Card 4: Dias até saldo negativo */}
        <div className="forecast-stat-card">
          <div className="fstat-header">
            <div className="fstat-label-with-info">
              <span className="fstat-label">Dias até saldo negativo</span>
              <Info size={12} color="#94a3b8" />
            </div>
            <div className="fstat-icon-circle purple">
              <CalendarDays size={16} />
            </div>
          </div>
          <div className="fstat-amount purple">52 dias</div>
          <span className="fstat-sub">Se mantiver o cenário atual</span>
        </div>
      </div>

      {/* Middle Section: Projeção 90 dias + Simulador "E se eu gastar..." */}
      <div className="forecast-middle-grid">
        {/* Main 90-Day Projection Spline Card */}
        <div className="forecast-chart-card">
          <div className="forecast-chart-header">
            <div className="fchart-title-box">
              <div className="spline-icon-circle">
                <TrendingUp size={18} />
              </div>
              <div>
                <h3 className="spline-title">Projeção de saldo (próximos 90 dias)</h3>
              </div>
            </div>

            <div className="fchart-header-right">
              <div className="spline-month-tabs">
                <button
                  type="button"
                  className={`spline-month-btn ${viewInterval === "weekly" ? "active" : ""}`}
                  onClick={() => setViewInterval("weekly")}
                >
                  Semanal
                </button>
                <button
                  type="button"
                  className={`spline-month-btn ${viewInterval === "monthly" ? "active" : ""}`}
                  onClick={() => setViewInterval("monthly")}
                >
                  Mensal
                </button>
              </div>

              <div className="spline-legend">
                <div className="spline-legend-item">
                  <span className="spline-dot teal" />
                  <span>Saldo projetado</span>
                </div>
                <div className="spline-legend-item">
                  <span className="spline-dot light-teal" />
                  <span>Faixa de confiança</span>
                </div>
                <div className="spline-legend-item">
                  <span className="spline-dot dashed-red" />
                  <span>Saldo zero</span>
                </div>
              </div>
            </div>
          </div>

          {/* SVG Projeção */}
          <div className="forecast-svg-wrapper">
            <svg viewBox="0 0 680 230" preserveAspectRatio="none" className="forecast-svg">
              <defs>
                <linearGradient id="forecastAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.01" />
                </linearGradient>
              </defs>

              {/* Y Axis Gridlines */}
              <line x1="30" y1="30" x2="660" y2="30" stroke="#f1f5f9" strokeDasharray="3 3" />
              <line x1="30" y1="70" x2="660" y2="70" stroke="#f1f5f9" strokeDasharray="3 3" />
              <line x1="30" y1="110" x2="660" y2="110" stroke="#f1f5f9" strokeDasharray="3 3" />
              <line x1="30" y1="150" x2="660" y2="150" stroke="#f1f5f9" strokeDasharray="3 3" />

              {/* Saldo Zero Dashed Red Line */}
              <line x1="30" y1="150" x2="660" y2="150" stroke="#f43f5e" strokeDasharray="4 4" strokeWidth="1.5" />
              <text x="35" y="146" fill="#f43f5e" fontSize="10" fontWeight="700">R$ 0</text>

              {/* Shaded Confidence Area */}
              <path
                d="M 40 85 C 120 95, 200 110, 280 125 C 360 140, 440 155, 520 170 C 580 180, 620 185, 650 190 L 650 210 C 620 205, 580 200, 520 190 C 440 175, 360 155, 280 140 C 200 125, 120 110, 40 100 Z"
                fill="rgba(16, 185, 129, 0.15)"
              />

              {/* Projected Balance Curve */}
              <path
                d="M 40 90 C 120 100, 200 115, 280 130 C 360 145, 440 160, 520 178 C 580 185, 620 190, 650 195"
                fill="none"
                stroke="#0d9488"
                strokeWidth="3.2"
                strokeLinecap="round"
              />

              {/* Point 1: 05 de Out (R$ 4.850,00) */}
              <circle cx="180" cy="112" r="5" fill="#0d9488" stroke="#ffffff" strokeWidth="2.5" />
              <line x1="180" y1="60" x2="180" y2="112" stroke="#cbd5e1" strokeDasharray="2 2" />

              {/* Point 2: 12 de Nov (Saldo negativo previsto -R$ 450,00) */}
              <circle cx="460" cy="165" r="5" fill="#f43f5e" stroke="#ffffff" strokeWidth="2.5" />
              <line x1="460" y1="120" x2="460" y2="165" stroke="#fecdd3" strokeDasharray="2 2" />
            </svg>

            {/* Callout Bubble 1: 05 de Out */}
            <div className="fchart-callout green" style={{ left: "26%", top: "18%" }}>
              <span className="callout-date">05 de Out. de 2026</span>
              <span className="callout-val">{formatCurrency(4850.00)}</span>
            </div>

            {/* Callout Bubble 2: Saldo negativo previsto */}
            <div className="fchart-callout red" style={{ left: "67%", top: "42%" }}>
              <span className="callout-date alert">Saldo negativo previsto</span>
              <span className="callout-sub">12 de Nov. de 2026</span>
              <span className="callout-val red">-{formatCurrency(450.00)}</span>
            </div>
          </div>

          {/* X Axis Dates */}
          <div className="spline-x-axis">
            <span>21 Set</span>
            <span>28 Set</span>
            <span>05 Out</span>
            <span>12 Out</span>
            <span>19 Out</span>
            <span>26 Out</span>
            <span>02 Nov</span>
            <span>09 Nov</span>
            <span>16 Nov</span>
            <span>23 Nov</span>
            <span>30 Nov</span>
            <span>07 Dez</span>
            <span>14 Dez</span>
          </div>
        </div>

        {/* Simulator "E se eu gastar..." */}
        <div className="forecast-simulator-card">
          <div className="fsim-header">
            <div className="fsim-icon-circle">
              <Zap size={18} />
            </div>
            <div>
              <h3 className="fsim-title">E se eu gastar...</h3>
              <p className="fsim-subtitle">Simule um gasto extra para ver o impacto no seu saldo.</p>
            </div>
          </div>

          <form onSubmit={handleApplyScenario} className="fsim-form">
            {/* Scenario Type Pills */}
            <div className="fsim-type-pills">
              <button
                type="button"
                className={`fsim-type-btn ${scenarioType === "single" ? "active" : ""}`}
                onClick={() => setScenarioType("single")}
              >
                Gasto único
              </button>
              <button
                type="button"
                className={`fsim-type-btn ${scenarioType === "monthly" ? "active" : ""}`}
                onClick={() => setScenarioType("monthly")}
              >
                Gasto mensal
              </button>
              <button
                type="button"
                className={`fsim-type-btn ${scenarioType === "trip" ? "active" : ""}`}
                onClick={() => setScenarioType("trip")}
              >
                Viagem
              </button>
              <button
                type="button"
                className={`fsim-type-btn ${scenarioType === "other" ? "active" : ""}`}
                onClick={() => setScenarioType("other")}
              >
                Outro
              </button>
            </div>

            {/* Big Amount Input */}
            <div className="fsim-amount-input-box">
              <span className="fsim-currency">R$</span>
              <input
                type="number"
                step="10"
                className="fsim-amount-input"
                value={extraAmount}
                onChange={(e) => setExtraAmount(e.target.value)}
                required
              />
            </div>

            {/* Date Input */}
            <div className="form-group">
              <label className="form-label">Em qual data?</label>
              <div className="input-with-icon">
                <Calendar size={16} className="field-icon" />
                <input
                  type="date"
                  className="form-input with-icon"
                  value={extraDate}
                  onChange={(e) => setExtraDate(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary fsim-submit-btn">
              <Zap size={15} />
              <span>Aplicar cenário</span>
            </button>
          </form>
        </div>
      </div>

      {/* Comparison Scenarios Row (Base vs Custom Scenario) */}
      <div className="forecast-scenarios-grid">
        {/* Scenario 1: Cenário atual (Base) */}
        <div className="scenario-card">
          <div className="scenario-header">
            <div className="scenario-title-box">
              <div className="scen-icon-dot green">
                <TrendingUp size={14} />
              </div>
              <div>
                <h4>Cenário atual <span className="scenario-badge green">Cenário base</span></h4>
                <p>Considera seus lançamentos recorrentes e contas já conhecidas.</p>
              </div>
            </div>
            <div className="scenario-result-box">
              <span className="scen-res-lbl">Saldo em 90 dias</span>
              <span className="scen-res-val red">-{formatCurrency(baseNegativeAmount)}</span>
            </div>
          </div>

          <div className="scenario-mini-chart">
            <svg viewBox="0 0 400 60" preserveAspectRatio="none" style={{ width: "100%", height: "60px" }}>
              <line x1="10" y1="35" x2="390" y2="35" stroke="#fecdd3" strokeDasharray="3 3" />
              <path
                d="M 10 15 C 100 22, 200 32, 300 42 C 340 48, 370 52, 390 55"
                fill="none"
                stroke="#0d9488"
                strokeWidth="2.5"
              />
              <circle cx="390" cy="55" r="4" fill="#f43f5e" />
            </svg>
            <div className="mini-chart-dates">
              <span>Set/26</span>
              <span>Out/26</span>
              <span>Nov/26</span>
              <span>Dez/26</span>
            </div>
          </div>
        </div>

        {/* Scenario 2: Com gasto adicional */}
        <div className="scenario-card purple-theme">
          <div className="scenario-header">
            <div className="scenario-title-box">
              <div className="scen-icon-dot purple">
                <TrendingDown size={14} />
              </div>
              <div>
                <h4>
                  Com gasto adicional de {formatCurrency(appliedAmount)}{" "}
                  <span className="scenario-badge purple">Seu cenário</span>
                </h4>
                <p>Inclui o gasto extra de {formatCurrency(appliedAmount)} em 25 de set. de 2026.</p>
              </div>
            </div>
            <div className="scenario-result-box">
              <span className="scen-res-lbl">Saldo em 90 dias</span>
              <span className="scen-res-val red">-{formatCurrency(simulatedNegativeAmount)}</span>
              <span className="scen-diff-sub">-{formatCurrency(appliedAmount)} em relação ao cenário atual</span>
            </div>
          </div>

          <div className="scenario-mini-chart">
            <svg viewBox="0 0 400 60" preserveAspectRatio="none" style={{ width: "100%", height: "60px" }}>
              <line x1="10" y1="35" x2="390" y2="35" stroke="#fecdd3" strokeDasharray="3 3" />
              <path
                d="M 10 18 C 100 26, 200 38, 300 50 C 340 55, 370 58, 390 60"
                fill="none"
                stroke="#8b5cf6"
                strokeWidth="2.5"
              />
              <circle cx="390" cy="60" r="4" fill="#f43f5e" />
            </svg>
            <div className="mini-chart-dates">
              <span>Set/26</span>
              <span>Out/26</span>
              <span>Nov/26</span>
              <span>Dez/26</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Composition Helpers */}
      <div className="forecast-composition-bar">
        <div className="fcomp-left">
          <div className="fcomp-title-box">
            <Sliders size={16} color="#0d9488" />
            <div>
              <strong>O que compõe a sua previsão?</strong>
              <p>Utilizamos seus dados já cadastrados no FinFlow Pro.</p>
            </div>
          </div>
        </div>

        <div className="fcomp-items-row">
          <div className="fcomp-pill">
            <span className="fcomp-icon green"><TrendingUp size={14} /></span>
            <div>
              <span className="fcomp-name">Receita recorrente</span>
              <strong className="fcomp-amt">{formatCurrency(5200.00)}/mês</strong>
            </div>
          </div>

          <div className="fcomp-pill">
            <span className="fcomp-icon red"><DollarSign size={14} /></span>
            <div>
              <span className="fcomp-name">Contas fixas</span>
              <strong className="fcomp-amt">{formatCurrency(2480.00)}/mês</strong>
            </div>
          </div>

          <div className="fcomp-pill">
            <span className="fcomp-icon purple"><Zap size={14} /></span>
            <div>
              <span className="fcomp-name">Assinaturas</span>
              <strong className="fcomp-amt">{formatCurrency(438.90)}/mês</strong>
            </div>
          </div>

          <div className="fcomp-pill">
            <span className="fcomp-icon orange"><CreditCard size={14} /></span>
            <div>
              <span className="fcomp-name">Faturas de cartões</span>
              <strong className="fcomp-amt">{formatCurrency(1350.00)}/mês</strong>
            </div>
          </div>

          <div className="fcomp-pill">
            <span className="fcomp-icon grey"><Sparkles size={14} /></span>
            <div>
              <span className="fcomp-name">Outros gastos</span>
              <strong className="fcomp-amt">{formatCurrency(620.00)}/mês</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
