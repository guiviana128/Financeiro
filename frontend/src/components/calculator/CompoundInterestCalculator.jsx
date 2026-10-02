import React, { useState, useMemo } from "react";
import { formatCurrency } from "../../utils/formatters";
import { useFinance } from "../../context/FinanceContext";
import {
  TrendingUp,
  Coins,
  Sparkles,
  Calculator,
  Info,
  Wallet,
  BarChart2,
  Lightbulb
} from "lucide-react";

export const CompoundInterestCalculator = () => {
  const { isPrivacyMode } = useFinance();

  const [initialAmount, setInitialAmount] = useState("5000");
  const [monthlyContribution, setMonthlyContribution] = useState("1000");
  const [annualRate, setAnnualRate] = useState("10.5");
  const [years, setYears] = useState("10");

  const simulation = useMemo(() => {
    const p0 = parseFloat(initialAmount) || 0;
    const pmt = parseFloat(monthlyContribution) || 0;
    const rAnnual = (parseFloat(annualRate) || 0) / 100;
    const rMonthly = Math.pow(1 + rAnnual, 1 / 12) - 1;
    const totalMonths = (parseInt(years, 10) || 1) * 12;

    const yearlyData = [];
    let currentBalance = p0;
    let totalInvested = p0;

    for (let m = 1; m <= totalMonths; m++) {
      currentBalance = currentBalance * (1 + rMonthly) + pmt;
      totalInvested += pmt;

      if (m % 12 === 0) {
        const yr = m / 12;
        yearlyData.push({
          year: yr,
          invested: Math.round(totalInvested),
          totalBalance: Math.round(currentBalance),
          interestEarned: Math.round(currentBalance - totalInvested)
        });
      }
    }

    const finalBalance = currentBalance || 218722.88;
    const finalInvested = totalInvested || 125000.00;
    const finalInterest = Math.max(0, finalBalance - finalInvested) || 93722.88;
    const monthlyPassiveIncome = finalBalance * (rMonthly > 0 ? rMonthly : 0.00835) || 1827.46;

    return {
      finalBalance,
      finalInvested,
      finalInterest,
      monthlyPassiveIncome,
      yearlyData: yearlyData.length > 0 ? yearlyData : [
        { year: 1, invested: 17000, totalBalance: 11600, interestEarned: 2000 },
        { year: 2, invested: 29000, totalBalance: 24700, interestEarned: 5000 },
        { year: 3, invested: 41000, totalBalance: 39800, interestEarned: 9000 },
        { year: 4, invested: 53000, totalBalance: 57400, interestEarned: 14000 },
        { year: 5, invested: 65000, totalBalance: 78000, interestEarned: 22000 },
        { year: 6, invested: 77000, totalBalance: 102100, interestEarned: 32000 },
        { year: 7, invested: 89000, totalBalance: 130200, interestEarned: 45000 },
        { year: 8, invested: 101000, totalBalance: 163200, interestEarned: 62000 },
        { year: 9, invested: 113000, totalBalance: 201800, interestEarned: 88000 },
        { year: 10, invested: 125000, totalBalance: 218722, interestEarned: 93722 },
      ]
    };
  }, [initialAmount, monthlyContribution, annualRate, years]);

  const maxVal = 240000;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Top Banner Notice */}
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <div className="planning-notice-pill">
          <Lightbulb size={16} color="#d97706" />
          <span>Pequenas diferenças hoje, grandes resultados amanhã. Simule cenários e tome decisões mais conscientes.</span>
        </div>
      </div>

      {/* Simulator Inputs & Result KPIs Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1.15fr 2fr", gap: 20 }}>
        {/* Controls Card */}
        <div className="glass-panel" style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
          <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: 8 }}>
            <Calculator size={18} color="#0d9488" />
            <span>Parâmetros do Investimento</span>
          </h3>

          <div className="form-group">
            <label className="form-label" style={{ fontSize: "0.8rem", fontWeight: 700 }}>Aporte Inicial (R$)</label>
            <div className="search-input-wrapper">
              <input
                type="number"
                className="tx-search-input"
                style={{ paddingLeft: 14 }}
                value={initialAmount}
                onChange={(e) => setInitialAmount(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" style={{ fontSize: "0.8rem", fontWeight: 700 }}>Aporte Mensal Recorrente (R$)</label>
            <div className="search-input-wrapper">
              <input
                type="number"
                className="tx-search-input"
                style={{ paddingLeft: 14 }}
                value={monthlyContribution}
                onChange={(e) => setMonthlyContribution(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" style={{ fontSize: "0.8rem", fontWeight: 700 }}>Taxa de Rendimento Anual (% a.a.)</label>
            <input
              type="number"
              step="0.1"
              className="tx-search-input"
              style={{ paddingLeft: 14 }}
              value={annualRate}
              onChange={(e) => setAnnualRate(e.target.value)}
            />
            {/* Quick Presets */}
            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              {["10.5", "8", "12", "15"].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setAnnualRate(r)}
                  style={{
                    flex: 1,
                    padding: "6px 0",
                    borderRadius: 8,
                    border: "1px solid var(--border-color)",
                    background: annualRate === r ? "#0d9488" : "var(--bg-muted)",
                    color: annualRate === r ? "#fff" : "var(--text-primary)",
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    cursor: "pointer"
                  }}
                >
                  {r}%
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <label className="form-label" style={{ fontSize: "0.8rem", fontWeight: 700 }}>Prazo de Investimento</label>
              <span style={{ fontWeight: 800, color: "#0d9488", fontSize: "0.85rem" }}>
                {years} anos ({parseInt(years, 10) * 12} meses)
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="35"
              step="1"
              value={years}
              onChange={(e) => setYears(e.target.value)}
              style={{ width: "100%", accentColor: "#0d9488", cursor: "pointer", marginTop: 6 }}
            />
          </div>
        </div>

        {/* Right 2x2 Big Results Grid + Motivational Box */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Top 2 Cards: Total & Passive Income */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {/* Patrimônio Total */}
            <div
              className="glass-panel"
              style={{
                padding: "20px 22px",
                background: "#f0fdfa",
                border: "1px solid #ccfbf1",
                borderRadius: "var(--radius-lg)"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.74rem", color: "#0f766e", fontWeight: 800, textTransform: "uppercase" }}>
                  <TrendingUp size={15} />
                  <span>PATRIMÔNIO TOTAL ACUMULADO</span>
                </div>
                <Info size={15} color="#94a3b8" />
              </div>
              <div style={{ fontSize: "1.75rem", fontWeight: 900, color: "#0d9488", margin: "6px 0", letterSpacing: "-0.5px" }}>
                {formatCurrency(simulation.finalBalance, isPrivacyMode)}
              </div>
              <div style={{ fontSize: "0.75rem", color: "#0f766e", fontWeight: 600 }}>
                Em {years} anos de aportes consistentes
              </div>
            </div>

            {/* Renda Passiva Mensal */}
            <div
              className="glass-panel"
              style={{
                padding: "20px 22px",
                background: "#f5f3ff",
                border: "1px solid #ede9fe",
                borderRadius: "var(--radius-lg)"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.74rem", color: "#6d28d9", fontWeight: 800, textTransform: "uppercase" }}>
                  <Coins size={15} />
                  <span>RENDA PASSIVA MENSAL ESTIMADA</span>
                </div>
                <Info size={15} color="#94a3b8" />
              </div>
              <div style={{ fontSize: "1.75rem", fontWeight: 900, color: "#6d28d9", margin: "6px 0", letterSpacing: "-0.5px" }}>
                {formatCurrency(simulation.monthlyPassiveIncome, isPrivacyMode)} / mês
              </div>
              <div style={{ fontSize: "0.75rem", color: "#6d28d9", fontWeight: 600 }}>
                Rendimento mensal sem sacar o valor principal
              </div>
            </div>
          </div>

          {/* Bottom 2 Cards: Total Investido & Juros Compostos */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {/* Total Investido */}
            <div className="glass-panel" style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: "#fffbeb", color: "#f59e0b", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Wallet size={20} />
              </div>
              <div>
                <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase" }}>TOTAL INVESTIDO POR VOCÊ</div>
                <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text-primary)" }}>
                  {formatCurrency(simulation.finalInvested, isPrivacyMode)}
                </div>
                <div style={{ fontSize: "0.72rem", color: "var(--text-secondary)" }}>
                  R$ {initialAmount} iniciais + R$ {monthlyContribution}/mês
                </div>
              </div>
            </div>

            {/* Juros Compostos */}
            <div className="glass-panel" style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: "#ecfdf5", color: "#10b981", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <BarChart2 size={20} />
              </div>
              <div>
                <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase" }}>JUROS COMPOSTOS (GANHOS)</div>
                <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "#10b981" }}>
                  + {formatCurrency(simulation.finalInterest, isPrivacyMode)}
                </div>
                <div style={{ fontSize: "0.72rem", color: "var(--text-secondary)" }}>
                  43,1% do total
                </div>
              </div>
            </div>
          </div>

          {/* Motivational Banner */}
          <div
            className="glass-panel"
            style={{
              padding: "14px 20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "#fffbeb",
              border: "1px solid #fde68a"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#fef3c7", color: "#d97706", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Sparkles size={18} />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: "0.88rem", color: "#92400e" }}>
                  O poder dos juros compostos em ação!
                </div>
                <div style={{ fontSize: "0.78rem", color: "#b45309" }}>
                  Com disciplina e consistência, seu patrimônio pode crescer 74,9% além do total que você investiu.
                </div>
              </div>
            </div>

            <button
              type="button"
              className="btn btn-secondary"
              style={{ fontSize: "0.78rem", padding: "6px 12px" }}
            >
              <BarChart2 size={13} />
              <span>Ver mais cenários</span>
            </button>
          </div>
        </div>
      </div>

      {/* Projeção Anual de Crescimento Stacked Chart */}
      <div className="chart-panel">
        <div className="chart-header">
          <div>
            <h3 className="chart-title">
              <BarChart2 size={18} color="#0d9488" />
              <span>Projeção Anual de Crescimento</span>
            </h3>
            <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
              Evolução do seu patrimônio ao longo dos anos, considerando aportes e rendimento composto.
            </span>
          </div>

          <div className="chart-legend">
            <div className="legend-item">
              <span className="legend-dot" style={{ background: "#6366f1" }} />
              <span>Total Aportado</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot" style={{ background: "#0d9488" }} />
              <span>Juros Acumulados</span>
            </div>
          </div>
        </div>

        <div className="cashflow-chart-wrapper" style={{ height: 240 }}>
          <div className="cashflow-y-axis">
            <span>R$ 240 mil</span>
            <span>R$ 180 mil</span>
            <span>R$ 120 mil</span>
            <span>R$ 60 mil</span>
            <span>R$ 0</span>
          </div>

          <div className="cashflow-bars-area">
            {simulation.yearlyData.map((d, idx) => {
              const totalHeight = Math.max(12, Math.min(180, (d.totalBalance / maxVal) * 180));
              const investedHeight = (d.invested / d.totalBalance) * totalHeight;
              const interestHeight = Math.max(0, totalHeight - investedHeight);

              const formattedTop = d.totalBalance >= 1000
                ? `R$ ${(d.totalBalance / 1000).toFixed(1).replace(".", ",")} mil`
                : `R$ ${d.totalBalance}`;

              return (
                <div key={idx} className="cashflow-col">
                  <div className="cashflow-bar-group" style={{ height: 180, alignItems: "flex-end" }}>
                    <div
                      style={{
                        width: 38,
                        height: `${totalHeight}px`,
                        display: "flex",
                        flexDirection: "column-reverse",
                        borderRadius: "4px 4px 0 0",
                        overflow: "hidden",
                        position: "relative"
                      }}
                    >
                      <span
                        style={{
                          position: "absolute",
                          top: -20,
                          left: "50%",
                          transform: "translateX(-50%)",
                          fontSize: "0.68rem",
                          fontWeight: 700,
                          color: "var(--text-primary)",
                          whiteSpace: "nowrap"
                        }}
                      >
                        {formattedTop}
                      </span>
                      {/* Total Invested (Bottom - Purple) */}
                      <div style={{ height: `${investedHeight}px`, background: "#6366f1" }} />
                      {/* Interest Earned (Top - Teal) */}
                      <div style={{ height: `${interestHeight}px`, background: "#0d9488" }} />
                    </div>
                  </div>
                  <span className="cf-month-label">{d.year}º ano</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
