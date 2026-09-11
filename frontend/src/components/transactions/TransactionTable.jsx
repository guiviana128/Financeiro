import React from "react";
import { formatCurrency, formatDate, PAYMENT_METHODS } from "../../utils/formatters";
import { Icon } from "../common/Icon";
import { Trash2, CheckCircle2, Clock, CreditCard } from "lucide-react";

export const TransactionTable = ({
  transactions = [],
  onDelete,
  onTogglePaid
}) => {
  if (transactions.length === 0) {
    return (
      <div className="glass-panel" style={{ padding: 40, textAlign: "center", color: "var(--text-muted)" }}>
        <p style={{ fontSize: "1.1rem", marginBottom: 8 }}>Nenhuma transação encontrada para este filtro.</p>
        <p style={{ fontSize: "0.85rem" }}>Adicione uma nova movimentação ou altere o mês de competência.</p>
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="custom-table">
        <thead>
          <tr>
            <th>Transação</th>
            <th>Data</th>
            <th>Forma de Pagamento</th>
            <th>Categoria</th>
            <th style={{ textAlign: "right" }}>Valor</th>
            <th style={{ textAlign: "center" }}>Status</th>
            <th style={{ textAlign: "center" }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => {
            const isIncome = tx.type === "income";
            const cat = tx.category;
            const card = tx.credit_card;
            const payMethodInfo = PAYMENT_METHODS[tx.payment_method] || PAYMENT_METHODS.pix;

            return (
              <tr key={tx.id}>
                {/* Description & Icon */}
                <td>
                  <div className="tx-desc-cell">
                    <div
                      className="cat-icon-circle"
                      style={{
                        background: cat?.color ? `${cat.color}20` : "rgba(99, 102, 241, 0.15)"
                      }}
                    >
                      <Icon
                        name={cat?.icon || (isIncome ? "TrendingUp" : "TrendingDown")}
                        size={18}
                        color={cat?.color || (isIncome ? "#10b981" : "#f43f5e")}
                      />
                    </div>
                    <div className="tx-desc-info">
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span className="tx-desc-title">{tx.description}</span>
                        {tx.is_installment && (
                          <span className="installment-pill">
                            {tx.installment_current}/{tx.installment_total}
                          </span>
                        )}
                        {tx.is_fixed && (
                          <span className="badge badge-neutral" style={{ fontSize: "0.65rem" }}>
                            Fixo
                          </span>
                        )}
                      </div>
                      {tx.notes && <span className="tx-desc-notes">{tx.notes}</span>}
                    </div>
                  </div>
                </td>

                {/* Date */}
                <td style={{ whiteSpace: "nowrap", color: "var(--text-secondary)" }}>
                  {formatDate(tx.date)}
                </td>

                {/* Payment Method / Card */}
                <td>
                  {card ? (
                    <span
                      className="card-tag"
                      style={{
                        background: `linear-gradient(135deg, ${card.color} 0%, ${card.color_end || "#000"} 100%)`
                      }}
                    >
                      <CreditCard size={12} />
                      <span>{card.name} (•••• {card.last_four})</span>
                    </span>
                  ) : (
                    <span className="badge badge-neutral" style={{ fontSize: "0.75rem" }}>
                      <Icon name={payMethodInfo.icon} size={14} color={payMethodInfo.color} />
                      <span>{payMethodInfo.label}</span>
                    </span>
                  )}
                </td>

                {/* Category */}
                <td>
                  <span
                    className="badge"
                    style={{
                      background: `${cat?.color || "#6366f1"}15`,
                      color: cat?.color || "#6366f1",
                      border: `1px solid ${cat?.color || "#6366f1"}30`
                    }}
                  >
                    {cat?.name || "Sem categoria"}
                  </span>
                </td>

                {/* Amount */}
                <td style={{ textAlign: "right" }}>
                  <span className={isIncome ? "amount-income" : "amount-expense"}>
                    {isIncome ? "+" : "-"} {formatCurrency(tx.amount)}
                  </span>
                </td>

                {/* Status Toggle */}
                <td style={{ textAlign: "center" }}>
                  <button
                    onClick={() => onTogglePaid(tx.id)}
                    style={{
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4
                    }}
                    title="Clique para alternar status"
                  >
                    {tx.is_paid ? (
                      <span className="badge badge-income" style={{ cursor: "pointer" }}>
                        <CheckCircle2 size={12} /> Pago
                      </span>
                    ) : (
                      <span className="badge badge-warning" style={{ cursor: "pointer" }}>
                        <Clock size={12} /> Pendente
                      </span>
                    )}
                  </button>
                </td>

                {/* Actions */}
                <td style={{ textAlign: "center" }}>
                  <button
                    className="action-btn-sm delete-btn"
                    onClick={() => {
                      if (tx.is_installment && tx.installment_total > 1) {
                        const deleteAll = window.confirm(
                          `Esta transação é uma compra parcelada (${tx.installment_total}x).\n\nClique em OK para excluir TODAS as parcelas deste grupo, ou CANCELAR para excluir apenas esta parcela.`
                        );
                        onDelete(tx.id, deleteAll);
                      } else {
                        if (window.confirm(`Deseja excluir "${tx.description}"?`)) {
                          onDelete(tx.id, false);
                        }
                      }
                    }}
                    title="Excluir transação"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
