import React, { useState, useEffect } from "react";
import { Modal } from "../common/Modal";
import { useFinance } from "../../context/FinanceContext";
import { formatCurrency, PAYMENT_METHODS, getTodayDate } from "../../utils/formatters";
import { CustomDatePicker } from "../common/CustomDatePicker";
import { ArrowDownRight, ArrowUpRight, Layers, AlertCircle, Plus, X, Tag, PawPrint, Check } from "lucide-react";
import { Icon } from "../common/Icon";

const QUICK_CATEGORY_ICONS = ["PawPrint", "Dog", "Cat", "HeartPulse", "ShoppingCart", "ShoppingBag", "Utensils", "Sparkles", "Car", "Home", "Tv", "Plane", "Tag"];
const QUICK_CATEGORY_COLORS = ["#f97316", "#ef4444", "#ec4899", "#d946ef", "#8b5cf6", "#6366f1", "#3b82f6", "#10b981", "#14b8a6", "#f59e0b"];

export const AddTransactionModal = ({ isOpen, onClose }) => {
  const { categories, creditCards, addTransaction, createCategory } = useFinance();

  const [type, setType] = useState("expense"); // "expense" | "income"
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("pix");
  const [creditCardId, setCreditCardId] = useState("");
  const [txDate, setTxDate] = useState(getTodayDate());
  const [isInstallment, setIsInstallment] = useState(false);
  const [installmentsCount, setInstallmentsCount] = useState(2);
  const [isFixed, setIsFixed] = useState(false);
  const [isPaid, setIsPaid] = useState(true);
  const [notes, setNotes] = useState("");

  // Quick category creation state
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [newCatIcon, setNewCatIcon] = useState("PawPrint");
  const [newCatColor, setNewCatColor] = useState("#f97316");
  const [newCatBudgetType, setNewCatBudgetType] = useState("needs");

  useEffect(() => {
    if (isOpen) {
      setTxDate(getTodayDate());
      setIsCreatingCategory(false);
      setNewCatName("");
    }
  }, [isOpen]);

  const filteredCategories = categories.filter(
    (c) => c.type === type || c.type === "both"
  );

  const selectedCat = categoryId || (filteredCategories[0]?.id ? String(filteredCategories[0].id) : "");
  const effectiveCardId = creditCardId || (creditCards.length > 0 ? String(creditCards[0].id) : "");
  const numAmount = parseFloat(amount) || 0;
  const installmentPerMonth = isInstallment && installmentsCount > 0 ? numAmount / installmentsCount : numAmount;

  const handleQuickCreateCategory = async (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    try {
      const created = await createCategory({
        name: newCatName.trim(),
        type,
        budget_type: type === "expense" ? newCatBudgetType : "needs",
        icon: newCatIcon,
        color: newCatColor,
        is_custom: true
      });
      if (created && created.id) {
        setCategoryId(String(created.id));
      }
      setIsCreatingCategory(false);
      setNewCatName("");
    } catch (err) {
      // Error handled in context toast
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim() || !numAmount) return;

    if (paymentMethod === "credit_card" && !effectiveCardId) {
      alert("Por favor, cadastre um cartão de crédito antes de lançar despesas no cartão.");
      return;
    }

    await addTransaction({
      description: description.trim(),
      amount: numAmount,
      type,
      payment_method: paymentMethod,
      category_id: parseInt(selectedCat, 10),
      credit_card_id: paymentMethod === "credit_card" && effectiveCardId ? parseInt(effectiveCardId, 10) : null,
      date: txDate,
      is_installment: isInstallment && installmentsCount > 1,
      installments_count: isInstallment ? parseInt(installmentsCount, 10) : 1,
      amount_is_total: true,
      is_fixed: isFixed,
      is_paid: isPaid,
      notes: notes.trim() || null
    });

    // Reset fields
    setDescription("");
    setAmount("");
    setIsInstallment(false);
    setInstallmentsCount(2);
    setNotes("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Nova Movimentação Financeira">
      <form onSubmit={handleSubmit}>
        <div className="modal-body">
          {/* Segmented Type: Expense or Income */}
          <div className="segmented-control">
            <button
              type="button"
              className={`segmented-btn ${type === "expense" ? "active active-expense" : ""}`}
              onClick={() => {
                setType("expense");
                setPaymentMethod("pix");
              }}
            >
              <ArrowDownRight size={16} />
              <span>Despesa (Saída)</span>
            </button>
            <button
              type="button"
              className={`segmented-btn ${type === "income" ? "active active-income" : ""}`}
              onClick={() => {
                setType("income");
                setPaymentMethod("pix");
              }}
            >
              <ArrowUpRight size={16} />
              <span>Receita (Entrada)</span>
            </button>
          </div>

          {/* Description & Value */}
          <div className="form-group">
            <label className="form-label">Descrição da Transação</label>
            <input
              type="text"
              className="form-input"
              placeholder="Ex: Supermercado, Salário, Compra Notebook..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">Valor (R$)</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0,00"
                className="form-input"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Data</label>
              <CustomDatePicker
                value={txDate}
                onChange={setTxDate}
              />
            </div>
          </div>

          {/* Category & Payment Method */}
          <div className="form-row-2">
            <div className="form-group">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <label className="form-label" style={{ marginBottom: 0 }}>Categoria</label>
                <button
                  type="button"
                  onClick={() => setIsCreatingCategory(!isCreatingCategory)}
                  style={{
                    background: isCreatingCategory ? "var(--accent-primary)" : "rgba(99, 102, 241, 0.12)",
                    color: isCreatingCategory ? "#fff" : "var(--accent-primary)",
                    border: "1px solid rgba(99, 102, 241, 0.25)",
                    borderRadius: "var(--radius-sm)",
                    padding: "2px 8px",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    cursor: "pointer",
                    transition: "all 0.2s ease"
                  }}
                  title="Criar nova categoria customizada (ex: Pets, Veterinário)"
                >
                  {isCreatingCategory ? <X size={12} /> : <Plus size={12} />}
                  <span>{isCreatingCategory ? "Cancelar" : "+ Nova Categoria"}</span>
                </button>
              </div>

              <select
                className="form-select"
                value={selectedCat}
                onChange={(e) => {
                  if (e.target.value === "__new__") {
                    setIsCreatingCategory(true);
                  } else {
                    setCategoryId(e.target.value);
                  }
                }}
                required
              >
                {filteredCategories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
                <option value="__new__" style={{ color: "var(--accent-primary)", fontWeight: 600 }}>
                  ➕ + Criar nova categoria...
                </option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Forma de Pagamento</label>
              <select
                className="form-select"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                required
              >
                {Object.entries(PAYMENT_METHODS).map(([key, val]) => (
                  <option key={key} value={key}>
                    {val.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Inline Quick Category Creation Panel */}
          {isCreatingCategory && (
            <div
              style={{
                background: "rgba(99, 102, 241, 0.05)",
                border: "1px solid rgba(99, 102, 241, 0.25)",
                borderRadius: "var(--radius-md)",
                padding: 14,
                marginBottom: 12,
                animation: "fadeIn 0.2s ease",
                display: "flex",
                flexDirection: "column",
                gap: 10
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: 6 }}>
                  <PawPrint size={15} color="var(--accent-primary)" />
                  Criar Categoria Rápida
                </span>
                <button
                  type="button"
                  onClick={() => setIsCreatingCategory(false)}
                  style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
                >
                  <X size={15} />
                </button>
              </div>

              <div style={{ display: "flex", gap: 8 }}>
                <input
                  type="text"
                  className="form-input"
                  style={{ flex: 1 }}
                  placeholder="Nome (ex: Pets & Animais, Veterinário, Ração)"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  autoFocus
                />
                <button
                  type="button"
                  onClick={handleQuickCreateCategory}
                  disabled={!newCatName.trim()}
                  className="btn btn-primary"
                  style={{ padding: "0 14px", fontSize: "0.8rem", whiteSpace: "nowrap" }}
                >
                  <Check size={14} /> Salvar
                </button>
              </div>

              {/* Icon & Color selector */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Ícone:</span>
                  {QUICK_CATEGORY_ICONS.map((ic) => (
                    <button
                      key={ic}
                      type="button"
                      onClick={() => setNewCatIcon(ic)}
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: "var(--radius-sm)",
                        border: newCatIcon === ic ? `2px solid ${newCatColor}` : "1px solid var(--border-color)",
                        background: newCatIcon === ic ? `${newCatColor}20` : "var(--bg-input)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer"
                      }}
                    >
                      <Icon name={ic} size={14} color={newCatColor} />
                    </button>
                  ))}
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Cor:</span>
                  {QUICK_CATEGORY_COLORS.slice(0, 6).map((col) => (
                    <button
                      key={col}
                      type="button"
                      onClick={() => setNewCatColor(col)}
                      style={{
                        width: 18,
                        height: 18,
                        borderRadius: "50%",
                        background: col,
                        border: newCatColor === col ? "2px solid #fff" : "none",
                        cursor: "pointer"
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Credit Card Selector if payment is credit_card */}
          {paymentMethod === "credit_card" && (
            <div className="form-group" style={{ animation: "fadeIn 0.2s ease" }}>
              <label className="form-label">Selecionar Cartão de Crédito</label>
              {creditCards.length === 0 ? (
                <div style={{ padding: "12px 14px", background: "rgba(245, 158, 11, 0.12)", border: "1px solid rgba(245, 158, 11, 0.3)", borderRadius: "var(--radius-md)", color: "#fbbf24", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: 8 }}>
                  <AlertCircle size={18} style={{ flexShrink: 0 }} />
                  <span>Nenhum cartão cadastrado. Cadastre um cartão na aba <strong>Cartões</strong> para lançar compras no crédito.</span>
                </div>
              ) : (
                <select
                  className="form-select"
                  value={effectiveCardId}
                  onChange={(e) => setCreditCardId(e.target.value)}
                  required
                >
                  {creditCards.map((card) => (
                    <option key={card.id} value={card.id}>
                      {card.name} (•••• {card.last_four}) - Fechamento dia {card.closing_day}
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}

          {/* Installments Simulation (if expense) */}
          {type === "expense" && (
            <div style={{ background: "var(--bg-subtle)", padding: 14, borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: isInstallment ? 12 : 0 }}>
                <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: "0.9rem", fontWeight: 600 }}>
                  <input
                    type="checkbox"
                    checked={isInstallment}
                    onChange={(e) => setIsInstallment(e.target.checked)}
                  />
                  <span>Compra Parcelada</span>
                </label>
                {isInstallment && (
                  <span className="badge badge-info">
                    <Layers size={12} /> Auto-distribuição de parcelas
                  </span>
                )}
              </div>

              {isInstallment && (
                <div style={{ display: "flex", flexDirection: "column", gap: 8, animation: "fadeIn 0.2s ease" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Número de Parcelas:</label>
                    <select
                      className="form-select"
                      style={{ width: 120 }}
                      value={installmentsCount}
                      onChange={(e) => setInstallmentsCount(parseInt(e.target.value, 10))}
                    >
                      {[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 18, 24].map((n) => (
                        <option key={n} value={n}>
                          {n}x
                        </option>
                      ))}
                    </select>
                  </div>
                  {numAmount > 0 && (
                    <div style={{ fontSize: "0.85rem", color: "var(--text-primary)", fontWeight: 600, marginTop: 4 }}>
                      Simulação: {installmentsCount}x de {formatCurrency(installmentPerMonth)} (Total: {formatCurrency(numAmount)})
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Status & Options */}
          <div style={{ display: "flex", gap: 20 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
              <input
                type="checkbox"
                checked={isPaid}
                onChange={(e) => setIsPaid(e.target.checked)}
              />
              <span>{type === "income" ? "Recebido" : "Já Pago"}</span>
            </label>

            <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
              <input
                type="checkbox"
                checked={isFixed}
                onChange={(e) => setIsFixed(e.target.checked)}
              />
              <span>Gasto Fixo Mensal</span>
            </label>
          </div>

          {/* Notes */}
          <div className="form-group">
            <label className="form-label">Observações / Tags (Opcional)</label>
            <input
              type="text"
              className="form-input"
              placeholder="Ex: Compra na promoção, parcelado sem juros"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancelar
          </button>
          <button type="submit" className="btn btn-primary">
            Salvar Transação
          </button>
        </div>
      </form>
    </Modal>
  );
};
