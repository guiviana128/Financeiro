import React, { useState } from "react";
import {
  CreditCard,
  Building2,
  Car,
  Laptop,
  CheckCircle2,
  TrendingUp,
  Percent,
  Calendar,
  ChevronRight,
  Calculator,
  Plus,
  ArrowRight,
  Info,
  DollarSign,
  X,
  Send
} from "lucide-react";
import { formatCurrency } from "../../utils/formatters";

export const DebtsView = () => {
  const [selectedDebtToSimulate, setSelectedDebtToSimulate] = useState("emp1");
  const [installmentsToAdvance, setInstallmentsToAdvance] = useState(6);
  const [selectedDebtForPayment, setSelectedDebtForPayment] = useState(null);
  const [debtsList, setDebtsList] = useState([
    {
      id: "emp1",
      name: "Empréstimo Pessoal",
      entity: "Banco do Brasil",
      type: "Empréstimo",
      interest: "3,2%",
      rate: 3.2,
      installmentVal: 499.00,
      paidCount: 5,
      totalCount: 36,
      remainingCount: 31,
      totalDebt: 17964.00,
      status: "Em dia",
      icon: Building2,
      color: "#8b5cf6",
      bg: "#f5f3ff"
    },
    {
      id: "fin1",
      name: "Financiamento Veículo",
      entity: "Fiat Pulse 2023",
      type: "Financiamento",
      interest: "1,4%",
      rate: 1.4,
      installmentVal: 1250.00,
      paidCount: 17,
      totalCount: 48,
      remainingCount: 31,
      totalDebt: 46200.00,
      status: "Em dia",
      icon: Car,
      color: "#10b981",
      bg: "#ecfdf5"
    },
    {
      id: "parc1",
      name: "Notebook Dell",
      entity: "Magazine Luiza",
      type: "Compra parcelada",
      interest: "1,2%",
      rate: 1.2,
      installmentVal: 249.90,
      paidCount: 8,
      totalCount: 24,
      remainingCount: 16,
      totalDebt: 5997.60,
      status: "Em dia",
      icon: Laptop,
      color: "#3b82f6",
      bg: "#eff6ff"
    },
    {
      id: "parc2",
      name: "Cartão Nubank (parcelas)",
      entity: "iPhone 15",
      type: "Compra parcelada",
      interest: "1,0%",
      rate: 1.0,
      installmentVal: 846.00,
      paidCount: 4,
      totalCount: 12,
      remainingCount: 8,
      totalDebt: 10152.00,
      status: "Em dia",
      icon: CreditCard,
      color: "#8b5cf6",
      bg: "#f5f3ff"
    }
  ]);

  const upcomingBills = [
    { day: "15", month: "SET", title: "Cartão Nubank", sub: "Fatura do cartão", amount: 1284.00, dueIn: "3 dias", icon: CreditCard, color: "#8b5cf6", bg: "#f5f3ff" },
    { day: "20", month: "SET", title: "Financiamento Veículo", sub: "Parcela 18/48", amount: 1250.00, dueIn: "8 dias", icon: Car, color: "#10b981", bg: "#ecfdf5" },
    { day: "28", month: "SET", title: "Notebook Dell", sub: "Parcela 8/24", amount: 249.90, dueIn: "16 dias", icon: Laptop, color: "#3b82f6", bg: "#eff6ff" },
    { day: "05", month: "OUT", title: "Empréstimo Pessoal", sub: "Parcela 6/36", amount: 499.00, dueIn: "23 dias", icon: Building2, color: "#8b5cf6", bg: "#f5f3ff" }
  ];

  // Simulation calculation
  const currentSimDebt = debtsList.find(d => d.id === selectedDebtToSimulate) || debtsList[0];
  const grossVal = currentSimDebt.installmentVal * installmentsToAdvance;
  const discountRate = (currentSimDebt.rate * 0.7) / 100;
  const estimatedSavings = grossVal * discountRate * (installmentsToAdvance / 2);
  const payoffAmount = grossVal - estimatedSavings;

  const handlePayInstallment = (debtId) => {
    setDebtsList(prev =>
      prev.map(d => {
        if (d.id === debtId && d.remainingCount > 0) {
          return {
            ...d,
            paidCount: d.paidCount + 1,
            remainingCount: d.remainingCount - 1,
            totalDebt: Math.max(0, d.totalDebt - d.installmentVal)
          };
        }
        return d;
      })
    );
    setSelectedDebtForPayment(null);
  };

  return (
    <div className="debts-layout animate-fade-in">
      {/* Top Banner: Situação das Dívidas */}
      <div className="debts-hero-banner">
        <div className="debts-hero-left">
          <div className="debts-score-circle">
            <svg width="86" height="86" viewBox="0 0 86 86">
              <circle cx="43" cy="43" r="34" fill="none" stroke="#e2e8f0" strokeWidth="8" />
              <circle
                cx="43"
                cy="43"
                r="34"
                fill="none"
                stroke="#0d9488"
                strokeWidth="8"
                strokeDasharray="213.6"
                strokeDashoffset="60"
                strokeLinecap="round"
                transform="rotate(-90 43 43)"
              />
            </svg>
            <div className="debts-score-text">
              <span className="debts-val-short">R$ 28.450</span>
              <span className="debts-sub-short">em aberto</span>
            </div>
          </div>

          <div className="debts-hero-info">
            <div className="debts-title-row">
              <h2 className="debts-hero-title">Situação das Dívidas</h2>
              <span className="badge-in-day">Em dia</span>
            </div>
            <p className="debts-hero-desc">
              Você tem 3 dívidas/parcelamentos ativos. Mantenha os pagamentos em dia e acompanhe seu progresso de quitação.
            </p>
            <a href="#simulador" className="debts-action-link" onClick={(e) => e.preventDefault()}>
              <span>Veja como quitar suas dívidas mais rápido →</span>
            </a>
          </div>
        </div>

        <div className="debts-hero-right">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setSelectedDebtForPayment(debtsList[0])}
          >
            <Plus size={16} />
            <span>Registrar pagamento</span>
          </button>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="forecast-metrics-grid">
        {/* Card 1: Total em aberto */}
        <div className="forecast-stat-card">
          <div className="fstat-header">
            <span className="fstat-label">TOTAL EM ABERTO</span>
            <span className="fstat-badge red">↑ 5%</span>
          </div>
          <div className="fstat-amount">{formatCurrency(28450.00)}</div>
          <span className="fstat-sub">Soma de todas as dívidas ativas</span>
        </div>

        {/* Card 2: Comprometimento mensal */}
        <div className="forecast-stat-card">
          <div className="fstat-header">
            <span className="fstat-label">COMPROMETIMENTO MENSAL</span>
            <span className="fstat-badge green">↓ 8%</span>
          </div>
          <div className="fstat-amount">{formatCurrency(2845.90)}</div>
          <span className="fstat-sub">Parcelas e prestações deste mês</span>
        </div>

        {/* Card 3: Próximo vencimento */}
        <div className="forecast-stat-card">
          <div className="fstat-header">
            <span className="fstat-label">PRÓXIMO VENCIMENTO</span>
            <ChevronRight size={16} color="#94a3b8" />
          </div>
          <div className="fstat-amount" style={{ fontSize: "1.2rem" }}>15 de set. de 2026</div>
          <span className="fstat-sub">Cartão Nubank - Fatura</span>
        </div>

        {/* Card 4: Juros Médio Ponderado */}
        <div className="forecast-stat-card">
          <div className="fstat-header">
            <div className="fstat-label-with-info">
              <span className="fstat-label">JUROS MÉDIO PONDERADO</span>
              <Info size={12} color="#94a3b8" />
            </div>
            <Percent size={16} color="#10b981" />
          </div>
          <div className="fstat-amount green">1,8% a.m.</div>
          <span className="fstat-sub">Taxa média das suas dívidas ativas</span>
        </div>
      </div>

      {/* Middle Section: Evolução das Parcelas + Próximos Vencimentos */}
      <div className="debts-middle-grid">
        {/* Left: Stacked Bar Chart */}
        <div className="debts-chart-card">
          <div className="debts-chart-header">
            <h3 className="debts-chart-title">Evolução das Parcelas (Próximos 6 Meses)</h3>
            <div className="debts-chart-legend">
              <span><span className="legend-dot teal" /> Financiamentos</span>
              <span><span className="legend-dot blue" /> Cartão (parcelas)</span>
              <span><span className="legend-dot purple" /> Empréstimos</span>
            </div>
          </div>

          <div className="debts-stacked-bars">
            {[
              { month: "Set/26", total: "R$ 2.845", finH: 45, cardH: 30, empH: 25 },
              { month: "Out/26", total: "R$ 2.845", finH: 45, cardH: 30, empH: 25 },
              { month: "Nov/26", total: "R$ 2.420", finH: 45, cardH: 20, empH: 25 },
              { month: "Dez/26", total: "R$ 2.420", finH: 45, cardH: 20, empH: 25 },
              { month: "Jan/27", total: "R$ 1.980", finH: 45, cardH: 0, empH: 25 },
              { month: "Fev/27", total: "R$ 1.980", finH: 45, cardH: 0, empH: 25 },
            ].map((b, idx) => (
              <div key={idx} className="stacked-bar-col">
                <span className="stacked-bar-total">{b.total}</span>
                <div className="stacked-bar-track">
                  <div className="sbar purple" style={{ height: `${b.empH}%` }} title="Empréstimos" />
                  <div className="sbar blue" style={{ height: `${b.cardH}%` }} title="Cartão parcelas" />
                  <div className="sbar teal" style={{ height: `${b.finH}%` }} title="Financiamentos" />
                </div>
                <span className="stacked-bar-lbl">{b.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Próximos Vencimentos List */}
        <div className="debts-upcoming-card">
          <div className="side-card-header">
            <h4>Próximos Vencimentos</h4>
            <a href="#vencimentos" className="side-card-link" onClick={(e) => e.preventDefault()}>
              <span>Ver todos</span>
              <ArrowRight size={13} />
            </a>
          </div>

          <div className="debts-upcoming-list">
            {upcomingBills.map((ub, idx) => (
              <div key={idx} className="upcoming-bill-row">
                <div className="bill-date-box">
                  <span className="bill-day">{ub.day}</span>
                  <span className="bill-month">{ub.month}</span>
                </div>
                <div className="bill-icon-box" style={{ background: ub.bg, color: ub.color }}>
                  <ub.icon size={16} />
                </div>
                <div className="bill-info">
                  <span className="bill-title">{ub.title}</span>
                  <span className="bill-sub">{ub.sub}</span>
                </div>
                <div className="bill-amount-col">
                  <span className="bill-amount">{formatCurrency(ub.amount)}</span>
                  <span className="bill-countdown">{ub.dueIn}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section: Tabela de Dívidas & Simulador de Quitação */}
      <div className="debts-bottom-grid">
        {/* Table */}
        <div className="debts-table-card">
          <div className="debts-table-header">
            <h3 className="debts-table-title">Suas Dívidas e Parcelas</h3>
            <select className="shared-select-month">
              <option>Ordenar por: Juros (maior)</option>
              <option>Ordenar por: Saldo restante</option>
              <option>Ordenar por: Valor da parcela</option>
            </select>
          </div>

          <div className="shared-table-wrapper">
            <table className="shared-tx-table">
              <thead>
                <tr>
                  <th>DÍVIDA / PARCELA</th>
                  <th>TIPO</th>
                  <th>JUROS (A.M.)</th>
                  <th>VALOR DA PARCELA</th>
                  <th>PAGO</th>
                  <th>RESTANTE</th>
                  <th>TOTAL DA DÍVIDA</th>
                  <th>STATUS</th>
                  <th>AÇÕES</th>
                </tr>
              </thead>
              <tbody>
                {debtsList.map((d) => {
                  const paidPct = Math.round((d.paidCount / d.totalCount) * 100);
                  return (
                    <tr key={d.id}>
                      <td>
                        <div className="d-title-cell">
                          <div className="d-icon" style={{ background: d.bg, color: d.color }}>
                            <d.icon size={14} />
                          </div>
                          <div>
                            <strong className="tx-desc-bold">{d.name}</strong>
                            <small className="d-entity-sub">{d.entity}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="paid-by-badge" style={{ background: d.bg, color: d.color }}>
                          {d.type}
                        </span>
                      </td>
                      <td style={{ color: "#f43f5e", fontWeight: 700 }}>{d.interest}</td>
                      <td className="tx-total-val">{formatCurrency(d.installmentVal)}</td>
                      <td>
                        <div className="d-progress-cell">
                          <span>{d.paidCount}/{d.totalCount}</span>
                          <div className="d-bar-track">
                            <div className="d-bar-fill" style={{ width: `${paidPct}%`, background: d.color }} />
                          </div>
                        </div>
                      </td>
                      <td>{d.remainingCount} parcelas</td>
                      <td className="tx-myshare-bold">{formatCurrency(d.totalDebt)}</td>
                      <td><span className="status-badge paid">{d.status}</span></td>
                      <td>
                        <button
                          type="button"
                          className="btn-table-action"
                          onClick={() => setSelectedDebtForPayment(d)}
                        >
                          Registrar pagamento
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Simulador de Quitação */}
        <div className="debts-simulator-card" id="simulador">
          <div className="fsim-header">
            <div className="fsim-icon-circle green">
              <Calculator size={18} />
            </div>
            <div>
              <h3 className="fsim-title">Simulador de Quitação</h3>
              <p className="fsim-subtitle">Veja quanto pode economizar antecipando parcelas.</p>
            </div>
          </div>

          <div className="dsim-body">
            <div className="form-group">
              <label className="form-label">Dívida</label>
              <select
                className="form-input"
                value={selectedDebtToSimulate}
                onChange={(e) => setSelectedDebtToSimulate(e.target.value)}
              >
                {debtsList.map(d => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.interest} a.m.)
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Quero antecipar</label>
              <select
                className="form-input"
                value={installmentsToAdvance}
                onChange={(e) => setInstallmentsToAdvance(parseInt(e.target.value))}
              >
                <option value={2}>2 parcelas</option>
                <option value={4}>4 parcelas</option>
                <option value={6}>6 parcelas</option>
                <option value={12}>12 parcelas</option>
                <option value={currentSimDebt.remainingCount}>Quitar restante ({currentSimDebt.remainingCount} parcelas)</option>
              </select>
            </div>

            <div className="dsim-results-grid">
              <div className="dsim-res-box">
                <span className="dsim-lbl">Valor a pagar agora</span>
                <strong className="dsim-val">{formatCurrency(payoffAmount)}</strong>
                <small className="dsim-note">(com {Math.round(discountRate * 100)}% de desconto)</small>
              </div>

              <div className="dsim-res-box green">
                <span className="dsim-lbl">Economia estimada</span>
                <strong className="dsim-val green">{formatCurrency(estimatedSavings)}</strong>
                <small className="dsim-note">em juros poupados</small>
              </div>
            </div>

            <button
              type="button"
              className="btn btn-primary"
              style={{ width: "100%", marginTop: "10px" }}
              onClick={() => setSelectedDebtForPayment(currentSimDebt)}
            >
              <Send size={15} />
              <span>Simular quitação</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modal: Registrar Pagamento de Parcela */}
      {selectedDebtForPayment && (
        <div className="modal-overlay" onClick={() => setSelectedDebtForPayment(null)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-with-icon">
                <div className="modal-title-icon green">
                  <DollarSign size={20} />
                </div>
                <div>
                  <h3>Registrar Pagamento de Parcela</h3>
                  <p className="modal-subtitle">{selectedDebtForPayment.name} - {selectedDebtForPayment.entity}</p>
                </div>
              </div>
              <button type="button" className="modal-close-btn" onClick={() => setSelectedDebtForPayment(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="settle-summary-card">
              <span className="settle-summary-lbl">Valor da Parcela</span>
              <span className="settle-summary-amount" style={{ color: "#0d9488" }}>
                {formatCurrency(selectedDebtForPayment.installmentVal)}
              </span>
              <span className="settle-summary-desc">
                Parcela {selectedDebtForPayment.paidCount + 1} de {selectedDebtForPayment.totalCount}
              </span>
            </div>

            <div className="invite-modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setSelectedDebtForPayment(null)}>
                Cancelar
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => handlePayInstallment(selectedDebtForPayment.id)}
              >
                <CheckCircle2 size={15} />
                <span>Confirmar Pagamento</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
