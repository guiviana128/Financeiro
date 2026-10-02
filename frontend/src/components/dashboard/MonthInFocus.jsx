import React, { useState } from "react";
import {
  Compass,
  CreditCard,
  Home,
  Wifi,
  TrendingUp,
  Lightbulb,
  ChevronRight,
  ArrowRight,
  X,
  CheckCircle2,
  AlertCircle,
  Calendar,
  DollarSign
} from "lucide-react";
import { formatCurrency } from "../../utils/formatters";

export const MonthInFocus = ({ bills = [] }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalFilter, setModalFilter] = useState("all");

  const defaultItems = [
    {
      id: 1,
      type: "bill",
      iconType: "card",
      iconBg: "#f5f3ff",
      iconColor: "#8b5cf6",
      title: "Fatura do Nubank",
      subtitle: "Vence em 3 dias • 22 de set",
      amount: 1284.00,
      status: "pending",
      category: "Cartão de Crédito"
    },
    {
      id: 2,
      type: "bill",
      iconType: "home",
      iconBg: "#fffbeb",
      iconColor: "#f59e0b",
      title: "Aluguel",
      subtitle: "Vence em 6 dias • 25 de set",
      amount: 1200.00,
      status: "pending",
      category: "Moradia"
    },
    {
      id: 3,
      type: "bill",
      iconType: "wifi",
      iconBg: "#eff6ff",
      iconColor: "#3b82f6",
      title: "Internet",
      subtitle: "Vence em 9 dias • 28 de set",
      amount: 99.90,
      status: "pending",
      category: "Contas Fixas"
    },
    {
      id: 4,
      type: "insight",
      iconType: "trend",
      iconBg: "#ecfdf5",
      iconColor: "#10b981",
      title: "Meta em dia",
      subtitle: "Você já investiu 80% da sua meta de Setembro.",
      category: "Investimentos"
    },
    {
      id: 5,
      type: "insight",
      iconType: "bulb",
      iconBg: "#fffbeb",
      iconColor: "#f59e0b",
      title: "Oportunidade de economia",
      subtitle: "Seus gastos com alimentação estão 18% abaixo da média dos últimos 3 meses.",
      category: "Alimentação"
    },
    {
      id: 6,
      type: "bill",
      iconType: "card",
      iconBg: "#f5f3ff",
      iconColor: "#8b5cf6",
      title: "Fatura Cartão Itaú",
      subtitle: "Vence em 12 dias • 30 de set",
      amount: 438.90,
      status: "pending",
      category: "Cartão de Crédito"
    },
    {
      id: 7,
      type: "bill",
      iconType: "wifi",
      iconBg: "#fff1f2",
      iconColor: "#f43f5e",
      title: "Netflix Premium",
      subtitle: "Débito automático • 20 de set",
      amount: 55.90,
      status: "paid",
      category: "Assinaturas"
    },
    {
      id: 8,
      type: "insight",
      iconType: "trend",
      iconBg: "#ecfdf5",
      iconColor: "#10b981",
      title: "Reserva de Emergência",
      subtitle: "Aporte mensal de R$ 800,00 concluído com sucesso.",
      category: "Metas"
    }
  ];

  const renderIcon = (type, color) => {
    switch (type) {
      case "card":
        return <CreditCard size={18} color={color} />;
      case "home":
        return <Home size={18} color={color} />;
      case "wifi":
        return <Wifi size={18} color={color} />;
      case "trend":
        return <TrendingUp size={18} color={color} />;
      case "bulb":
        return <Lightbulb size={18} color={color} />;
      default:
        return <Compass size={18} color={color} />;
    }
  };

  const filteredModalItems = defaultItems.filter(item => {
    if (modalFilter === "bills") return item.type === "bill";
    if (modalFilter === "insights") return item.type === "insight";
    return true;
  });

  return (
    <>
      <div className="month-focus-card">
        {/* Header */}
        <div className="month-focus-header">
          <div className="month-focus-title-box">
            <div className="month-focus-icon-circle">
              <Compass size={18} />
            </div>
            <div>
              <h3 className="month-focus-title">Seu mês em foco</h3>
              <p className="month-focus-subtitle">Ações e lembretes importantes para Setembro.</p>
            </div>
          </div>

          <button
            type="button"
            className="month-focus-link"
            onClick={() => setIsModalOpen(true)}
          >
            <span>Ver todos</span>
            <ArrowRight size={13} />
          </button>
        </div>

        {/* List of 5 items */}
        <div className="month-focus-list">
          {defaultItems.slice(0, 5).map((item) => (
            <div
              key={item.id}
              className="month-focus-item"
              onClick={() => setIsModalOpen(true)}
              style={{ cursor: "pointer" }}
            >
              <div
                className="month-focus-item-icon"
                style={{ background: item.iconBg }}
              >
                {renderIcon(item.iconType, item.iconColor)}
              </div>

              <div className="month-focus-item-texts">
                <span className="month-focus-item-title">{item.title}</span>
                <span className="month-focus-item-sub">{item.subtitle}</span>
              </div>

              <div className="month-focus-item-right">
                {item.amount !== undefined && (
                  <span className="month-focus-item-val">
                    {formatCurrency(item.amount)}
                  </span>
                )}
                <ChevronRight size={14} className="month-focus-arrow" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal: Ver Todos os Lembretes do Mês */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-with-icon">
                <div className="modal-title-icon green">
                  <Compass size={20} />
                </div>
                <div>
                  <h3>Seu Mês em Foco (Setembro de 2026)</h3>
                  <p className="modal-subtitle">Todos os vencimentos, lembretes e oportunidades do mês</p>
                </div>
              </div>
              <button type="button" className="modal-close-btn" onClick={() => setIsModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            {/* Filter Tabs */}
            <div className="modal-filter-pills-row">
              <button
                type="button"
                className={`filter-pill-tab ${modalFilter === "all" ? "active" : ""}`}
                onClick={() => setModalFilter("all")}
              >
                Todos ({defaultItems.length})
              </button>
              <button
                type="button"
                className={`filter-pill-tab ${modalFilter === "bills" ? "active" : ""}`}
                onClick={() => setModalFilter("bills")}
              >
                Contas & Faturas ({defaultItems.filter(i => i.type === "bill").length})
              </button>
              <button
                type="button"
                className={`filter-pill-tab ${modalFilter === "insights" ? "active" : ""}`}
                onClick={() => setModalFilter("insights")}
              >
                Metas & Economia ({defaultItems.filter(i => i.type === "insight").length})
              </button>
            </div>

            {/* Modal Body List */}
            <div className="modal-focus-items-list">
              {filteredModalItems.map((item) => (
                <div key={item.id} className="modal-focus-item-card">
                  <div
                    className="month-focus-item-icon"
                    style={{ background: item.iconBg }}
                  >
                    {renderIcon(item.iconType, item.iconColor)}
                  </div>

                  <div className="modal-focus-item-info">
                    <div className="modal-focus-title-row">
                      <span className="modal-focus-title">{item.title}</span>
                      <span className="modal-focus-cat-tag">{item.category}</span>
                    </div>
                    <span className="modal-focus-sub">{item.subtitle}</span>
                  </div>

                  {item.amount !== undefined ? (
                    <div className="modal-focus-right">
                      <span className="modal-focus-val">{formatCurrency(item.amount)}</span>
                      {item.status === "paid" ? (
                        <span className="status-badge paid">Pago</span>
                      ) : (
                        <span className="status-badge pending">A vencer</span>
                      )}
                    </div>
                  ) : (
                    <div className="modal-focus-right">
                      <span className="status-badge active-insight">Destaque</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="invite-modal-footer">
              <button type="button" className="btn btn-primary" onClick={() => setIsModalOpen(false)}>
                Concluído
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
