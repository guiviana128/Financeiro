import React from "react";
import { ListFilter, ArrowRight, Utensils, Briefcase, Car, Heart, Tv, ShoppingBag } from "lucide-react";
import { formatCurrency } from "../../utils/formatters";

export const RecentTransactionsCard = ({ transactions = [], onNavigateTransactions }) => {
  const defaultTxList = [
    { id: 1, date: "28 SET", description: "Restaurantes Brasil", category: "Alimentação", categoryIcon: "Utensils", categoryColor: "#f43f5e", amount: -89.50 },
    { id: 2, date: "27 SET", description: "Salário Empresa XYZ", category: "Salário", categoryIcon: "Briefcase", categoryColor: "#10b981", amount: 8900.00 },
    { id: 3, date: "26 SET", description: "Uber", category: "Transporte", categoryIcon: "Car", categoryColor: "#3b82f6", amount: -42.30 },
    { id: 4, date: "25 SET", description: "Academia Smart Fit", category: "Saúde", categoryIcon: "Heart", categoryColor: "#f43f5e", amount: -89.90 },
    { id: 5, date: "24 SET", description: "Netflix", category: "Assinaturas", categoryIcon: "Tv", categoryColor: "#8b5cf6", amount: -44.90 }
  ];

  const displayList = (transactions && transactions.length > 0)
    ? transactions.slice(0, 5).map(t => ({
        id: t.id,
        date: t.date ? `${t.date.split("-")[2]} SET` : "28 SET",
        description: t.description,
        category: t.category?.name || "Geral",
        categoryColor: t.category?.color || "#6366f1",
        amount: t.type === "expense" ? -Math.abs(t.amount) : Math.abs(t.amount)
      }))
    : defaultTxList;

  const renderIcon = (catName) => {
    switch (catName) {
      case "Alimentação":
      case "Supermercado & Alimentação":
        return <Utensils size={13} color="#f43f5e" />;
      case "Salário":
      case "Salário Mensal":
        return <Briefcase size={13} color="#10b981" />;
      case "Transporte":
      case "Transporte & Combustível":
        return <Car size={13} color="#3b82f6" />;
      case "Saúde":
      case "Saúde & Farmácia":
        return <Heart size={13} color="#f43f5e" />;
      case "Assinaturas":
      case "Assinaturas & Streaming":
        return <Tv size={13} color="#8b5cf6" />;
      default:
        return <ShoppingBag size={13} color="#64748b" />;
    }
  };

  return (
    <div className="recent-tx-card">
      <div className="recent-tx-header">
        <div className="recent-tx-title-box">
          <div className="recent-tx-icon-circle">
            <ListFilter size={17} />
          </div>
          <h3 className="recent-tx-title">Últimas transações</h3>
        </div>

        <a
          className="recent-tx-link"
          href="#transacoes"
          onClick={(e) => {
            e.preventDefault();
            if (onNavigateTransactions) onNavigateTransactions();
          }}
        >
          <span>Ver todas</span>
          <ArrowRight size={13} />
        </a>
      </div>

      <div className="recent-tx-table-wrapper">
        <table className="recent-tx-table">
          <thead>
            <tr>
              <th>DATA</th>
              <th>DESCRIÇÃO</th>
              <th>CATEGORIA</th>
              <th style={{ textAlign: "right" }}>VALOR</th>
            </tr>
          </thead>
          <tbody>
            {displayList.map((tx) => (
              <tr key={tx.id}>
                <td className="recent-tx-date">{tx.date}</td>
                <td className="recent-tx-desc">{tx.description}</td>
                <td className="recent-tx-cat">
                  <span className="recent-tx-cat-badge">
                    {renderIcon(tx.category)}
                    <span>{tx.category}</span>
                  </span>
                </td>
                <td className={`recent-tx-amount ${tx.amount < 0 ? "expense" : "income"}`}>
                  {tx.amount < 0 ? `-R$ ${Math.abs(tx.amount).toFixed(2).replace(".", ",")}` : `R$ ${tx.amount.toFixed(2).replace(".", ",")}`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
