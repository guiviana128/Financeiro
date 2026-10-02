import React from "react";
import { Calendar, CreditCard, Home, Wifi, Dumbbell, ArrowRight } from "lucide-react";
import { formatCurrency } from "../../utils/formatters";

export const UpcomingBills = ({ bills = [] }) => {
  // Default fallback bills to match mockup perfectly if none provided
  const displayBills = bills && bills.length > 0 ? bills : [
    {
      title: "Fatura Nubank",
      category: "Cartão de crédito",
      amount: 1284.00,
      due_day: 22,
      due_month: "SET",
      days_left: 3,
      iconType: "card",
      iconBg: "#f5f3ff",
      iconColor: "#8b5cf6"
    },
    {
      title: "Aluguel",
      category: "Despesa fixa",
      amount: 1200.00,
      due_day: 25,
      due_month: "SET",
      days_left: 6,
      iconType: "home",
      iconBg: "#fffbeb",
      iconColor: "#f59e0b"
    },
    {
      title: "Internet",
      category: "Casa",
      amount: 99.90,
      due_day: 28,
      due_month: "SET",
      days_left: 9,
      iconType: "wifi",
      iconBg: "#eff6ff",
      iconColor: "#3b82f6"
    },
    {
      title: "Academia",
      category: "Assinatura",
      amount: 89.90,
      due_day: 30,
      due_month: "SET",
      days_left: 11,
      iconType: "gym",
      iconBg: "#fdf2f8",
      iconColor: "#ec4899"
    }
  ];

  const renderIcon = (type) => {
    switch (type) {
      case "card":
        return <CreditCard size={17} color="#8b5cf6" />;
      case "home":
        return <Home size={17} color="#f59e0b" />;
      case "wifi":
        return <Wifi size={17} color="#3b82f6" />;
      case "gym":
        return <Dumbbell size={17} color="#ec4899" />;
      default:
        return <Calendar size={17} color="#0d9488" />;
    }
  };

  return (
    <div className="chart-panel">
      <div className="chart-header">
        <h3 className="chart-title">
          <Calendar size={18} color="#0d9488" />
          <span>Próximos Vencimentos</span>
        </h3>

        <a className="chart-link" href="#faturas" onClick={(e) => e.preventDefault()}>
          <span>Ver todos</span>
          <ArrowRight size={13} />
        </a>
      </div>

      <div className="upcoming-bills-list">
        {displayBills.map((bill, idx) => (
          <div key={idx} className="upcoming-bill-row">
            {/* Left Date Square */}
            <div className="bill-date-box">
              <span className="bill-day-num">{bill.due_day || 22}</span>
              <span className="bill-month-str">{bill.due_month || "SET"}</span>
            </div>

            {/* Icon Box */}
            <div className="bill-icon-box" style={{ background: bill.iconBg || "#f5f3ff" }}>
              {renderIcon(bill.iconType)}
            </div>

            {/* Info */}
            <div className="bill-info">
              <span className="bill-title">{bill.title}</span>
              <span className="bill-cat">{bill.category || "Despesa fixa"}</span>
            </div>

            {/* Right Side Values */}
            <div className="bill-right">
              <span className="bill-amount">{formatCurrency(bill.amount)}</span>
              <span className="bill-due-days">{bill.days_left ? `${bill.days_left} dias` : "Em breve"}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
