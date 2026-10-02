import React from "react";
import { formatCurrency } from "../../utils/formatters";
import {
  Home,
  ShoppingCart,
  Car,
  Heart,
  Utensils,
  Tv,
  ShoppingBag,
  Plane,
  TrendingUp,
  MoreVertical,
  Trash2
} from "lucide-react";

export const CategoryBudgetList = ({ budgets = [], onDelete }) => {
  const demoBudgets = [
    { id: 1, name: "Moradia", icon: Home, color: "#3b82f6", rulePct: 20, limit: 1000.00, spent: 1050.00, pct: 105, status: "Acima", statusType: "danger" },
    { id: 2, name: "Supermercado", icon: ShoppingCart, color: "#0d9488", rulePct: 15, limit: 750.00, spent: 680.00, pct: 91, status: "Dentro", statusType: "success" },
    { id: 3, name: "Transporte", icon: Car, color: "#10b981", rulePct: 10, limit: 500.00, spent: 420.00, pct: 84, status: "Dentro", statusType: "success" },
    { id: 4, name: "Saúde", icon: Heart, color: "#ef4444", rulePct: 5, limit: 250.00, spent: 320.00, pct: 128, status: "Acima", statusType: "danger" },
    { id: 5, name: "Restaurantes", icon: Utensils, color: "#f59e0b", rulePct: 10, limit: 500.00, spent: 600.00, pct: 120, status: "Acima", statusType: "danger" },
    { id: 6, name: "Streaming", icon: Tv, color: "#3b82f6", rulePct: 5, limit: 250.00, spent: 180.00, pct: 72, status: "Dentro", statusType: "success" },
    { id: 7, name: "Compras Pessoais", icon: ShoppingBag, color: "#8b5cf6", rulePct: 10, limit: 500.00, spent: 220.00, pct: 44, status: "Dentro", statusType: "success" },
    { id: 8, name: "Viagens e Hobbies", icon: Plane, color: "#06b6d4", rulePct: 5, limit: 250.00, spent: 0.00, pct: 0, status: "Dentro", statusType: "success" },
    { id: 9, name: "Investimentos", icon: TrendingUp, color: "#f59e0b", rulePct: 20, limit: 1000.00, spent: 900.00, pct: 90, status: "Atenção", statusType: "warning" },
  ];

  const list = budgets && budgets.length > 0 ? budgets : demoBudgets;

  const renderStatusBadge = (status, type) => {
    if (type === "danger") {
      return (
        <span className="badge" style={{ background: "#fff1f2", color: "#f43f5e", border: "1px solid #fecdd3", fontSize: "0.75rem", fontWeight: 700 }}>
          &Delta; {status}
        </span>
      );
    }
    if (type === "warning") {
      return (
        <span className="badge" style={{ background: "#fffbeb", color: "#d97706", border: "1px solid #fde68a", fontSize: "0.75rem", fontWeight: 700 }}>
          &Delta; {status}
        </span>
      );
    }
    return (
      <span className="badge" style={{ background: "#ecfdf5", color: "#10b981", border: "1px solid #a7f3d0", fontSize: "0.75rem", fontWeight: 700 }}>
        &bull; {status}
      </span>
    );
  };

  const getBarColor = (type, pct) => {
    if (type === "danger" || pct > 100) return "#f43f5e";
    if (type === "warning") return "#f59e0b";
    return "#0d9488";
  };

  return (
    <div className="tx-table-card">
      <div className="tx-table-responsive">
        <table className="tx-table">
          <thead>
            <tr>
              <th>Categoria</th>
              <th>Regra</th>
              <th>Limite Ideal</th>
              <th>Gasto Atual</th>
              <th style={{ minWidth: 160 }}>Progresso</th>
              <th style={{ textAlign: "center" }}>Status</th>
              <th style={{ width: 40, textAlign: "center" }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {list.map((item, idx) => {
              const IconComp = item.icon || Home;
              return (
                <tr key={item.id || idx}>
                  {/* Category Name & Icon */}
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 8,
                          background: `${item.color || "#0d9488"}15`,
                          color: item.color || "#0d9488",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
                        }}
                      >
                        <IconComp size={16} />
                      </div>
                      <span style={{ fontWeight: 700, color: "var(--text-primary)" }}>
                        {item.name || item.category_name}
                      </span>
                    </div>
                  </td>

                  {/* Rule % */}
                  <td style={{ color: "var(--text-secondary)", fontWeight: 600 }}>
                    {item.rulePct || item.percentage || 10}%
                  </td>

                  {/* Limit */}
                  <td style={{ color: "var(--text-secondary)", fontWeight: 600 }}>
                    {formatCurrency(item.limit || item.monthly_limit || 500)}
                  </td>

                  {/* Spent */}
                  <td style={{ fontWeight: 700, color: "var(--text-primary)" }}>
                    {formatCurrency(item.spent || item.current_spent || 0)}
                  </td>

                  {/* Progress Bar & Label */}
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ flex: 1, height: 7, background: "var(--bg-muted)", borderRadius: 4, overflow: "hidden" }}>
                        <div
                          style={{
                            height: "100%",
                            width: `${Math.min(100, item.pct || 50)}%`,
                            background: getBarColor(item.statusType, item.pct),
                            borderRadius: 4
                          }}
                        />
                      </div>
                      <span style={{ fontSize: "0.75rem", fontWeight: 700, minWidth: 38, color: getBarColor(item.statusType, item.pct) }}>
                        {item.pct || 50}%
                      </span>
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td style={{ textAlign: "center" }}>
                    {renderStatusBadge(item.status || "Dentro", item.statusType || "success")}
                  </td>

                  {/* Action */}
                  <td style={{ textAlign: "center" }}>
                    <button
                      type="button"
                      className="action-btn-sm"
                      onClick={() => onDelete && onDelete(item.id)}
                      title="Opções"
                    >
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
