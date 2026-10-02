import React, { useState, useMemo } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Filter,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  CreditCard,
  Zap,
  Home,
  Wifi,
  ShoppingBag,
  DollarSign,
  Utensils,
  Plus,
  Clock,
  X,
  Sparkles
} from "lucide-react";
import { formatCurrency } from "../../utils/formatters";

const MONTH_NAMES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

// Rich multi-month events database
const INITIAL_EVENTS_DB = {
  // September 2026
  "2026-08": { // Month index 8 = September
    1: [{ id: "e1", title: "Salário", amount: 5200.00, type: "income", color: "#10b981", bg: "#ecfdf5", status: "paid" }],
    4: [{ id: "e2", title: "Aluguel", amount: 1200.00, type: "expense", color: "#f43f5e", bg: "#fff1f2", status: "pending" }],
    8: [{ id: "e3", title: "Nubank", amount: 1284.00, type: "card", color: "#8b5cf6", bg: "#f5f3ff", status: "pending" }],
    10: [
      { id: "e4", title: "Conta de Luz", amount: 198.00, type: "expense", color: "#f59e0b", bg: "#fffbeb", status: "pending" },
      { id: "e5", title: "Água & Esgoto", amount: 84.50, type: "expense", color: "#06b6d4", bg: "#ecfeff", status: "paid" }
    ],
    12: [{ id: "e6", title: "Netflix", amount: 55.90, type: "recurring", color: "#f43f5e", bg: "#fff1f2", status: "paid" }],
    15: [{ id: "e7", title: "Mercado", amount: 320.00, type: "expense", color: "#f43f5e", bg: "#fff1f2", status: "pending" }],
    18: [{ id: "e8", title: "Freelance", amount: 800.00, type: "income", color: "#10b981", bg: "#ecfdf5", status: "paid" }],
    21: [
      { id: "e9", title: "Celular", amount: 89.90, type: "expense", color: "#f43f5e", bg: "#fff1f2", status: "pending" },
      { id: "e10", title: "Spotify Family", amount: 34.90, type: "recurring", color: "#10b981", bg: "#ecfdf5", status: "paid" }
    ],
    24: [{ id: "e11", title: "Cartão Itaú", amount: 438.90, type: "card", color: "#8b5cf6", bg: "#f5f3ff", status: "pending" }],
    28: [{ id: "e12", title: "IPVA (parcela)", amount: 245.00, type: "expense", color: "#f43f5e", bg: "#fff1f2", status: "pending" }],
    30: [{ id: "e13", title: "Restaurante", amount: 120.00, type: "expense", color: "#f43f5e", bg: "#fff1f2", status: "pending" }]
  },
  // October 2026
  "2026-09": { // Month index 9 = October
    1: [{ id: "o1", title: "Salário", amount: 5200.00, type: "income", color: "#10b981", bg: "#ecfdf5", status: "pending" }],
    5: [{ id: "o2", title: "Aluguel", amount: 1200.00, type: "expense", color: "#f43f5e", bg: "#fff1f2", status: "pending" }],
    8: [{ id: "o3", title: "Nubank", amount: 1390.00, type: "card", color: "#8b5cf6", bg: "#f5f3ff", status: "pending" }],
    10: [{ id: "o4", title: "Conta de Luz", amount: 185.00, type: "expense", color: "#f59e0b", bg: "#fffbeb", status: "pending" }],
    15: [{ id: "o5", title: "Mercado Mensal", amount: 450.00, type: "expense", color: "#f43f5e", bg: "#fff1f2", status: "pending" }],
    20: [{ id: "o6", title: "Freelance UI", amount: 1200.00, type: "income", color: "#10b981", bg: "#ecfdf5", status: "pending" }],
    25: [{ id: "o7", title: "Cartão Itaú", amount: 512.00, type: "card", color: "#8b5cf6", bg: "#f5f3ff", status: "pending" }]
  },
  // August 2026
  "2026-07": { // Month index 7 = August
    1: [{ id: "a1", title: "Salário", amount: 5200.00, type: "income", color: "#10b981", bg: "#ecfdf5", status: "paid" }],
    5: [{ id: "a2", title: "Aluguel", amount: 1200.00, type: "expense", color: "#f43f5e", bg: "#fff1f2", status: "paid" }],
    8: [{ id: "a3", title: "Nubank", amount: 1150.00, type: "card", color: "#8b5cf6", bg: "#f5f3ff", status: "paid" }],
    12: [{ id: "a4", title: "Conta de Luz", amount: 210.00, type: "expense", color: "#f59e0b", bg: "#fffbeb", status: "paid" }],
    18: [{ id: "a5", title: "Freelance", amount: 650.00, type: "income", color: "#10b981", bg: "#ecfdf5", status: "paid" }],
    28: [{ id: "a6", title: "IPVA (parcela)", amount: 245.00, type: "expense", color: "#f43f5e", bg: "#fff1f2", status: "paid" }]
  }
};

export const FinancialCalendarView = () => {
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonthIndex, setCurrentMonthIndex] = useState(8); // 8 = September
  const [selectedDay, setSelectedDay] = useState(30);
  const [activeFilter, setActiveFilter] = useState("all");
  const [eventsDb, setEventsDb] = useState(INITIAL_EVENTS_DB);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventAmount, setNewEventAmount] = useState("");
  const [newEventType, setNewEventType] = useState("expense");

  const filterTabs = [
    { id: "all", label: "Todos" },
    { id: "income", label: "Receitas", dotColor: "#10b981" },
    { id: "expense", label: "Despesas", dotColor: "#f43f5e" },
    { id: "card", label: "Cartões", dotColor: "#8b5cf6" },
    { id: "recurring", label: "Recorrentes" },
    { id: "paid", label: "Pagas" },
    { id: "overdue", label: "Em atraso" }
  ];

  const monthKey = `${currentYear}-${String(currentMonthIndex).padStart(2, "0")}`;
  const currentMonthEvents = eventsDb[monthKey] || {};

  // Navigation functions
  const handlePrevMonth = () => {
    if (currentMonthIndex === 0) {
      setCurrentMonthIndex(11);
      setCurrentYear(y => y - 1);
    } else {
      setCurrentMonthIndex(m => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonthIndex === 11) {
      setCurrentMonthIndex(0);
      setCurrentYear(y => y + 1);
    } else {
      setCurrentMonthIndex(m => m + 1);
    }
  };

  const handleToday = () => {
    setCurrentYear(2026);
    setCurrentMonthIndex(8);
    setSelectedDay(30);
  };

  // Calendar matrix generator
  const calendarGrid = useMemo(() => {
    const firstDayIndex = new Date(currentYear, currentMonthIndex, 1).getDay(); // 0 = Sun, 1 = Mon...
    const totalDays = new Date(currentYear, currentMonthIndex + 1, 0).getDate();
    const prevMonthTotalDays = new Date(currentYear, currentMonthIndex, 0).getDate();

    const cells = [];

    // Prev month padding
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      cells.push({
        dayNum: prevMonthTotalDays - i,
        isOtherMonth: true,
        monthOffset: -1
      });
    }

    // Current month days
    for (let day = 1; day <= totalDays; day++) {
      cells.push({
        dayNum: day,
        isOtherMonth: false,
        isToday: currentYear === 2026 && currentMonthIndex === 8 && day === 30
      });
    }

    // Next month padding to reach multiple of 7 (usually 35 or 42)
    const remaining = (7 - (cells.length % 7)) % 7;
    for (let i = 1; i <= remaining; i++) {
      cells.push({
        dayNum: i,
        isOtherMonth: true,
        monthOffset: 1
      });
    }

    return cells;
  }, [currentYear, currentMonthIndex]);

  // Filter events based on activeFilter tab
  const getFilteredEventsForDay = (day) => {
    const list = currentMonthEvents[day] || [];
    if (activeFilter === "all") return list;
    if (activeFilter === "income") return list.filter(e => e.type === "income");
    if (activeFilter === "expense") return list.filter(e => e.type === "expense");
    if (activeFilter === "card") return list.filter(e => e.type === "card");
    if (activeFilter === "recurring") return list.filter(e => e.type === "recurring");
    if (activeFilter === "paid") return list.filter(e => e.status === "paid");
    if (activeFilter === "overdue") return list.filter(e => e.status === "overdue");
    return list;
  };

  // Add event to current selected day
  const handleAddEvent = (e) => {
    e.preventDefault();
    if (!newEventTitle.trim() || !newEventAmount) return;

    const val = parseFloat(newEventAmount);
    const colorMap = {
      income: { color: "#10b981", bg: "#ecfdf5" },
      expense: { color: "#f43f5e", bg: "#fff1f2" },
      card: { color: "#8b5cf6", bg: "#f5f3ff" },
      recurring: { color: "#06b6d4", bg: "#ecfeff" }
    };

    const config = colorMap[newEventType] || colorMap.expense;

    const newEvent = {
      id: `ev-${Date.now()}`,
      title: newEventTitle.trim(),
      amount: val,
      type: newEventType,
      color: config.color,
      bg: config.bg,
      status: "pending"
    };

    setEventsDb(prev => {
      const monthData = { ...(prev[monthKey] || {}) };
      const dayList = monthData[selectedDay] ? [...monthData[selectedDay], newEvent] : [newEvent];
      return {
        ...prev,
        [monthKey]: {
          ...monthData,
          [selectedDay]: dayList
        }
      };
    });

    setNewEventTitle("");
    setNewEventAmount("");
    setIsAddEventOpen(false);
  };

  // Calculate totals for side panel
  const allCurrentEvents = Object.values(currentMonthEvents).flat();
  const totalIncome = allCurrentEvents.filter(e => e.type === "income").reduce((s, e) => s + e.amount, 0);
  const totalExpense = allCurrentEvents.filter(e => e.type !== "income").reduce((s, e) => s + e.amount, 0);
  const netBalance = totalIncome - totalExpense;

  const next7DaysBills = [
    { day: "04", month: "SET", title: "Aluguel", subtitle: "Despesa fixa • Recorrente", amount: 1200.00, daysLeft: "Em 2 dias", icon: Home, iconBg: "#fff1f2", iconColor: "#f43f5e" },
    { day: "08", month: "SET", title: "Fatura Nubank", subtitle: "Cartão de crédito", amount: 1284.00, daysLeft: "Em 6 dias", icon: CreditCard, iconBg: "#f5f3ff", iconColor: "#8b5cf6" },
    { day: "10", month: "SET", title: "Conta de Luz", subtitle: "Casa • Recorrente", amount: 198.00, daysLeft: "Em 8 dias", icon: Zap, iconBg: "#fffbeb", iconColor: "#f59e0b" },
    { day: "12", month: "SET", title: "Netflix", subtitle: "Assinatura • Recorrente", amount: 55.90, daysLeft: "Em 10 dias", icon: Wifi, iconBg: "#fff1f2", iconColor: "#f43f5e" },
    { day: "15", month: "SET", title: "Mercado", subtitle: "Variável", amount: 320.00, daysLeft: "Em 13 dias", icon: ShoppingBag, iconBg: "#fff1f2", iconColor: "#f43f5e" },
  ];

  return (
    <div className="fin-calendar-layout">
      {/* Left: Main Monthly Interactive Calendar Grid */}
      <div className="fin-calendar-main-panel">
        {/* Calendar Header with Navigation and Filter Tabs */}
        <div className="fin-cal-header-bar">
          <div className="fin-cal-nav-controls">
            <button
              type="button"
              className="fin-cal-arrow-btn"
              onClick={handlePrevMonth}
              title="Mês anterior"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="fin-cal-month-title">
              {MONTH_NAMES[currentMonthIndex]} de {currentYear}
            </span>
            <button
              type="button"
              className="fin-cal-arrow-btn"
              onClick={handleNextMonth}
              title="Próximo mês"
            >
              <ChevronRight size={16} />
            </button>
            <button
              type="button"
              className="fin-cal-today-badge-btn"
              onClick={handleToday}
            >
              Hoje
            </button>
          </div>

          <div className="fin-cal-filter-tabs">
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`fin-cal-filter-btn ${activeFilter === tab.id ? "active" : ""}`}
                onClick={() => setActiveFilter(tab.id)}
              >
                {tab.dotColor && (
                  <span className="fin-cal-tab-dot" style={{ background: tab.dotColor }} />
                )}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Days of week header */}
        <div className="fin-cal-weekdays-row">
          <span>Dom</span>
          <span>Seg</span>
          <span>Ter</span>
          <span>Qua</span>
          <span>Qui</span>
          <span>Sex</span>
          <span>Sáb</span>
        </div>

        {/* Calendar Grid */}
        <div className="fin-cal-grid-body">
          {calendarGrid.map((cell, idx) => {
            const dayEvents = !cell.isOtherMonth ? getFilteredEventsForDay(cell.dayNum) : [];
            const isSelected = selectedDay === cell.dayNum && !cell.isOtherMonth;

            return (
              <div
                key={idx}
                className={`fin-cal-day-cell ${cell.isOtherMonth ? "other-month" : ""} ${isSelected ? "selected-day" : ""}`}
                onClick={() => {
                  if (!cell.isOtherMonth) setSelectedDay(cell.dayNum);
                }}
              >
                <div className="fin-cal-day-header">
                  <span className={`fin-cal-day-number ${cell.isToday ? "today-dot" : ""}`}>
                    {cell.dayNum}
                  </span>
                  {!cell.isOtherMonth && isSelected && (
                    <button
                      type="button"
                      className="fin-cal-add-event-mini"
                      title="Adicionar compromisso neste dia"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsAddEventOpen(true);
                      }}
                    >
                      <Plus size={11} />
                    </button>
                  )}
                </div>

                {/* Day events badges with spacious layout */}
                <div className="fin-cal-events-list">
                  {dayEvents.slice(0, 2).map((ev) => (
                    <div
                      key={ev.id}
                      className="fin-cal-event-pill"
                      style={{ background: ev.bg, color: ev.color }}
                      title={`${ev.title}: ${formatCurrency(ev.amount)}`}
                    >
                      <span className="fin-cal-event-title">{ev.title}</span>
                      <span className="fin-cal-event-amount">
                        {formatCurrency(ev.amount)}
                      </span>
                    </div>
                  ))}

                  {dayEvents.length > 2 && (
                    <span className="fin-cal-more-dots">
                      +{dayEvents.length - 2} mais
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Helper Bar for Selected Day */}
        <div className="fin-cal-day-summary-bar">
          <div className="day-summary-left">
            <span className="day-summary-title">
              Dia {selectedDay} de {MONTH_NAMES[currentMonthIndex]} de {currentYear}
            </span>
            <span className="day-summary-count">
              {getFilteredEventsForDay(selectedDay).length} evento(s) agendado(s)
            </span>
          </div>

          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => setIsAddEventOpen(true)}
          >
            <Plus size={14} />
            <span>Adicionar no dia {selectedDay}</span>
          </button>
        </div>
      </div>

      {/* Right: Upcoming 7 Days + Flow Panel */}
      <div className="fin-cal-side-panel">
        {/* Card 1: Próximos 7 dias */}
        <div className="fin-cal-side-card">
          <div className="side-card-header">
            <h4>Próximos 7 dias</h4>
            <a href="#todos" className="side-card-link" onClick={(e) => e.preventDefault()}>
              <span>Ver todos</span>
              <ArrowRight size={13} />
            </a>
          </div>

          <div className="side-upcoming-list">
            {next7DaysBills.map((bill, idx) => (
              <div key={idx} className="upcoming-bill-row">
                <div className="bill-date-box">
                  <span className="bill-day">{bill.day}</span>
                  <span className="bill-month">{bill.month}</span>
                </div>

                <div className="bill-icon-box" style={{ background: bill.iconBg, color: bill.iconColor }}>
                  <bill.icon size={16} />
                </div>

                <div className="bill-info">
                  <span className="bill-title">{bill.title}</span>
                  <span className="bill-sub">{bill.subtitle}</span>
                </div>

                <div className="bill-amount-col">
                  <span className="bill-amount">{formatCurrency(bill.amount)}</span>
                  <span className="bill-countdown">{bill.daysLeft}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Card 2: Detalhes do Dia Selecionado matching Reference Image 1 */}
        <div className="fin-cal-side-card selected-day-detail-card">
          <div className="side-card-header">
            <div>
              <h4 style={{ fontSize: "0.95rem", fontWeight: 800 }}>
                {selectedDay} de {MONTH_NAMES[currentMonthIndex].toLowerCase()} de {currentYear}
              </h4>
              <span style={{ fontSize: "0.74rem", color: "var(--text-muted)" }}>
                {getFilteredEventsForDay(selectedDay).length} lançamento(s) agendado(s)
              </span>
            </div>
          </div>

          <div className="selected-day-events-list">
            {getFilteredEventsForDay(selectedDay).map((ev, idx) => (
              <div key={idx} className="selected-day-event-row">
                <div className="event-icon-box" style={{ background: ev.bg || "#fff1f2", color: ev.color || "#f43f5e" }}>
                  <Utensils size={15} />
                </div>
                <div className="event-info">
                  <span className="event-title">{ev.title}</span>
                  <span className="event-sub">Alimentação • Cartão de crédito</span>
                </div>
                <div className="event-val-col">
                  <span className="event-amount">{formatCurrency(ev.amount)}</span>
                </div>
              </div>
            ))}

            {getFilteredEventsForDay(selectedDay).length === 0 && (
              <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", padding: "12px 0", textAlign: "center" }}>
                Nenhum lançamento agendado para este dia.
              </p>
            )}
          </div>

          <button
            type="button"
            className="btn btn-outline-teal"
            style={{ width: "100%", marginTop: "10px", justifyContent: "center", borderRadius: "10px" }}
            onClick={() => setIsAddEventOpen(true)}
          >
            <Plus size={15} />
            <span>Adicionar lançamento</span>
          </button>
        </div>

        {/* Card 3: Resumo do Mês matching Reference Image 1 */}
        <div className="fin-cal-side-card">
          <div className="side-card-header">
            <h4>Resumo do mês</h4>
            <span style={{ fontSize: "0.74rem", color: "var(--text-muted)", fontWeight: 600 }}>
              {MONTH_NAMES[currentMonthIndex]} de {currentYear}
            </span>
          </div>

          <div className="cal-flow-metrics-row">
            <div>
              <span className="flow-metric-lbl">Receitas</span>
              <span className="flow-metric-val green">{formatCurrency(totalIncome || 6000.00)}</span>
              <span className="flow-metric-sub">Receitas previstas</span>
            </div>
            <div>
              <span className="flow-metric-lbl">Despesas</span>
              <span className="flow-metric-val red">{formatCurrency(totalExpense || 4071.10)}</span>
              <span className="flow-metric-sub">Despesas previstas</span>
            </div>
            <div>
              <span className="flow-metric-lbl">Saldo previsto</span>
              <span className="flow-metric-val blue">{formatCurrency(netBalance || 1928.90)}</span>
              <span className="flow-metric-sub">Resultado do mês</span>
            </div>
          </div>

          {/* Weekly mini bar chart */}
          <div className="cal-weekly-bars">
            {[
              { label: "Sem 1 (1-6)", incomeH: 80, expenseH: 45 },
              { label: "Sem 2 (7-13)", incomeH: 30, expenseH: 60 },
              { label: "Sem 3 (14-20)", incomeH: 45, expenseH: 40 },
              { label: "Sem 4 (21-27)", incomeH: 65, expenseH: 45 },
              { label: "Sem 5 (28-30)", incomeH: 90, expenseH: 55 },
            ].map((sem, sIdx) => (
              <div key={sIdx} className="weekly-bar-col">
                <div className="weekly-bar-pair">
                  <div className="wbar green" style={{ height: `${sem.incomeH}%` }} />
                  <div className="wbar red" style={{ height: `${sem.expenseH}%` }} />
                </div>
                <span className="wbar-lbl">{sem.label}</span>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 10, fontSize: "0.74rem", color: "var(--text-secondary)" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ width: 8, height: 8, borderRadius: 2, background: "#10b981" }} /> Receitas
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ width: 8, height: 8, borderRadius: 2, background: "#f43f5e" }} /> Despesas
            </span>
          </div>
        </div>
      </div>

      {/* Modal: Adicionar Compromisso / Despesa no Dia */}
      {isAddEventOpen && (
        <div className="modal-overlay" onClick={() => setIsAddEventOpen(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-with-icon">
                <div className="modal-title-icon green">
                  <CalendarDays size={20} />
                </div>
                <div>
                  <h3>Adicionar no Dia {selectedDay} de {MONTH_NAMES[currentMonthIndex]}</h3>
                  <p className="modal-subtitle">Agende vencimentos, receitas ou parcelas</p>
                </div>
              </div>
              <button type="button" className="modal-close-btn" onClick={() => setIsAddEventOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddEvent} className="invite-form-body">
              <div className="form-group">
                <label className="form-label">Título do Compromisso</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Ex: Condomínio, Salário Extra, Academia..."
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Valor (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  className="form-input"
                  placeholder="0,00"
                  value={newEventAmount}
                  onChange={(e) => setNewEventAmount(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Tipo de Lançamento</label>
                <div className="type-toggle-grid">
                  <button
                    type="button"
                    className={`type-toggle-btn ${newEventType === "expense" ? "active red" : ""}`}
                    onClick={() => setNewEventType("expense")}
                  >
                    Despesa
                  </button>
                  <button
                    type="button"
                    className={`type-toggle-btn ${newEventType === "income" ? "active green" : ""}`}
                    onClick={() => setNewEventType("income")}
                  >
                    Receita
                  </button>
                  <button
                    type="button"
                    className={`type-toggle-btn ${newEventType === "card" ? "active purple" : ""}`}
                    onClick={() => setNewEventType("card")}
                  >
                    Fatura Cartão
                  </button>
                  <button
                    type="button"
                    className={`type-toggle-btn ${newEventType === "recurring" ? "active teal" : ""}`}
                    onClick={() => setNewEventType("recurring")}
                  >
                    Recorrente
                  </button>
                </div>
              </div>

              <div className="invite-modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsAddEventOpen(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  <Plus size={15} />
                  <span>Salvar Lançamento</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
