import React, { useState, useMemo } from "react";
import { formatCurrency } from "../../utils/formatters";
import { useFinance } from "../../context/FinanceContext";
import { TrendingUp, Coins, Sparkles, Calendar, Calculator, ArrowRight } from "lucide-react";

const RATE_PRESETS = [
  { label: "CDI / Tesouro Selic (10.5% a.a.)", rate: 10.5 },
  { label: "Renda Fixa IPCA+ (6.5% a.a. real)", rate: 6.5 },
  { label: "Ações / FIIs Moderado (12.0% a.a.)", rate: 12.0 },
  { label: "S&P 500 / Global (14.0% a.a.)", rate: 14.0 },
];

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

    const finalBalance = currentBalance;
    const finalInvested = totalInvested;
    const finalInterest = Math.max(0, finalBalance - finalInvested);
    // Estimated safe monthly passive income (0.6% to 0.8% per month)
    const monthlyPassiveIncome = finalBalance * (rMonthly > 0 ? rMonthly : 0.007);

    return {
      finalBalance,
      finalInvested,
      finalInterest,
      monthlyPassiveIncome,
      yearlyData
    };
  }, [initialAmount, monthlyContribution, annualRate, years]);

  const maxChartVal = simulation.yearlyData.length > 0
    ? simulation.yearlyData[simulation.yearlyData.length - 1].totalBalance
    : 1000;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Header */}
      <div>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 700, display: "flex", alignItems: "center", gap: 10 }}>
          <Sparkles size={22} color="#10b981" />
          <span>Simulador de Investimentos & Liberdade Financeira</span>
        </h2>
        <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
          Projete o crescimento do seu patrimônio com a força dos juros compostos e descubra sua renda passiva futura.
        </p>
      </div>

      {/* Simulator Inputs & Result KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 2fr", gap: 24 }}>
        {/* Controls Card */}
        <div className="glass-panel" style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
          <h3 style={{ fontSize: "1rem", fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
            <Calculator size={18} color="var(--accent-primary)" />
            <span>Parâmetros do Investimento</span>
          </h3>

          <div className="form-group">
            <label className="form-label">Aporte Inicial (R$)</label>
            <input
              type="number"
              className="form-input"
              value={initialAmount}
              onChange={(e) => setInitialAmount(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Aporte Mensal Recorrente (R$)</label>
            <input
              type="number"
              className="form-input"
              value={monthlyContribution}
              onChange={(e) => setMonthlyContribution(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Taxa de Rendimento Anual (% a.a.)</label>
            <input
              type="number"
              step="0.1"
              className="form-input"
              value={annualRate}
              onChange={(e) => setAnnualRate(e.target.value)}
            />
            {/* Quick Presets */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 6 }}>
              {RATE_PRESETS.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setAnnualRate(String(p.rate))}
                  style={{
                    padding: "4px 8px",
                    borderRadius: "var(--radius-sm)",
                    border: "1px solid var(--border-color)",
                    background: parseFloat(annualRate) === p.rate ? "var(--accent-primary)" : "var(--bg-subtle)",
                    color: "#fff",
                    fontSize: "0.7rem",
                    cursor: "pointer"
                  }}
                >
                  {p.rate}%
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <label className="form-label">Prazo de Investimento</label>
              <span style={{ fontWeight: 700, color: "var(--accent-primary)" }}>{years} anos ({parseInt(years, 10) * 12} meses)</span>
            </div>
            <input
              type="range"
              min="1"
              max="35"
              step="1"
              value={years}
              onChange={(e) => setYears(e.target.value)}
              style={{ width: "100%", accentColor: "var(--accent-primary)", cursor: "pointer" }}
            />
          </div>
        </div>

        {/* Results Showcase */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Big Result Banners */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div
              className="glass-panel"
              style={{
                padding: 20,
                background: "linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.05) 100%)",
                border: "1px solid rgba(16, 185, 129, 0.3)"
              }}
            >
              <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", textTransform: "uppercase", fontWeight: 600 }}>
                Patrimônio Total Acumulado
              </div>
              <div style={{ fontSize: "1.85rem", fontWeight: 800, color: "#10b981", margin: "6px 0" }}>
                {formatCurrency(simulation.finalBalance, isPrivacyMode)}
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                Em {years} anos de aportes consistentes
              </div>
            </div>

            <div
              className="glass-panel"
              style={{
                padding: 20,
                background: "linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(79, 70, 229, 0.05) 100%)",
                border: "1px solid rgba(99, 102, 241, 0.3)"
              }}
            >
              <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", textTransform: "uppercase", fontWeight: 600 }}>
                Renda Passiva Mensal Estimada
              </div>
              <div style={{ fontSize: "1.85rem", fontWeight: 800, color: "#818cf8", margin: "6px 0" }}>
                {formatCurrency(simulation.monthlyPassiveIncome, isPrivacyMode)} / mês
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                Rendimento mensal sem gastar o valor principal!
              </div>
            </div>
          </div>

          {/* Breakdown Pills */}
          <div className="glass-panel" style={{ padding: 20, display: "flex", justifyContent: "space-around", textAlign: "center" }}>
            <div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Total Investido por Você</div>
              <div style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--text-primary)", marginTop: 4 }}>
                {formatCurrency(simulation.finalInvested, isPrivacyMode)}
              </div>
              <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
                {simulation.finalBalance > 0 ? ((simulation.finalInvested / simulation.finalBalance) * 100).toFixed(0) : 0}% do total
              </div>
            </div>

            <div style={{ borderLeft: "1px solid var(--border-color)" }}></div>

            <div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Juros Compostos Ganhos</div>
              <div style={{ fontSize: "1.2rem", fontWeight: 700, color: "#10b981", marginTop: 4 }}>
                + {formatCurrency(simulation.finalInterest, isPrivacyMode)}
              </div>
              <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
                {simulation.finalBalance > 0 ? ((simulation.finalInterest / simulation.finalBalance) * 100).toFixed(0) : 0}% do total
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Year by Year Growth Chart */}
      <div className="glass-panel" style={{ padding: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h3 style={{ fontSize: "1.05rem", fontWeight: 700 }}>Projeção Anual de Crescimento</h3>
          <div style={{ display: "flex", gap: 16, fontSize: "0.8rem", fontWeight: 600 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: "#6366f1" }}></span>
              <span>Total Aportado</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: "#10b981" }}></span>
              <span>Juros Acumulados</span>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 200, borderBottom: "1px solid var(--border-color)", paddingBottom: 8 }}>
          {simulation.yearlyData.map((d) => {
            const totalHeight = Math.max(10, (d.totalBalance / maxChartVal) * 160);
            const investedHeight = Math.max(5, (d.invested / d.totalBalance) * totalHeight);
            const interestHeight = totalHeight - investedHeight;

            return (
              <div key={d.year} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, height: "100%", justifyContent: "flex-end" }}>
                <div style={{ width: "100%", maxWidth: 36, height: totalHeight, display: "flex", flexDirection: "column", borderRadius: "4px 4px 0 0", overflow: "hidden" }}>
                  <div style={{ height: interestHeight, background: "linear-gradient(180deg, #10b981, #059669)" }} title={`Juros: ${formatCurrency(d.interestEarned)}`} />
                  <div style={{ height: investedHeight, background: "linear-gradient(180deg, #6366f1, #4338ca)" }} title={`Aportado: ${formatCurrency(d.invested)}`} />
                </div>
                <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 600 }}>
                  {d.year}a
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
