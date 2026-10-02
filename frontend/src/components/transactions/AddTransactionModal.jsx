import React, { useState, useEffect } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  ArrowRightLeft,
  X,
  FileText,
  Calendar,
  Tag,
  CreditCard,
  MessageSquare,
  Plus,
  Save,
  Check
} from "lucide-react";
import { useFinance } from "../../context/FinanceContext";
import { formatCurrency, getTodayDate } from "../../utils/formatters";

export const AddTransactionModal = ({ isOpen, onClose, onOpenCategoryModal }) => {
  const { categories, creditCards, addTransaction, showToast } = useFinance();

  const [type, setType] = useState("expense"); // expense | income
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [txDate, setTxDate] = useState(getTodayDate());
  const [categoryId, setCategoryId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("pix");
  const [creditCardId, setCreditCardId] = useState("");
  const [isInstallment, setIsInstallment] = useState(false);
  const [installmentsCount, setInstallmentsCount] = useState(2);
  const [isPaid, setIsPaid] = useState(true);
  const [isFixed, setIsFixed] = useState(false);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTxDate(getTodayDate());
      if (categories.length > 0 && !categoryId) {
        setCategoryId(String(categories[0].id));
      }

      const handleKeyDown = (e) => {
        if (e.key === "Escape") {
          onClose();
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, categories, onClose]);

  if (!isOpen) return null;

  const filteredCategories = categories.filter(
    (c) => c.type === type || c.type === "both" || !c.type
  );

  const effectiveCatId = categoryId || (filteredCategories[0]?.id ? String(filteredCategories[0].id) : "1");
  const effectiveCardId = creditCardId || (creditCards.length > 0 ? String(creditCards[0].id) : "");

  const handleSetToday = () => {
    setTxDate(getTodayDate());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const numAmount = parseFloat(amount.replace(",", ".")) || 0;
    if (!description.trim() || numAmount <= 0) {
      showToast("Por favor preencha a descrição e um valor válido.", "error");
      return;
    }

    if (paymentMethod === "credit_card" && creditCards.length > 0 && !effectiveCardId) {
      showToast("Por favor selecione um cartão de crédito.", "error");
      return;
    }

    try {
      setIsSubmitting(true);
      await addTransaction({
        description: description.trim(),
        amount: numAmount,
        type,
        payment_method: paymentMethod,
        category_id: parseInt(effectiveCatId, 10),
        credit_card_id: paymentMethod === "credit_card" && effectiveCardId ? parseInt(effectiveCardId, 10) : null,
        date: txDate,
        is_installment: isInstallment && installmentsCount > 1,
        installments_count: isInstallment ? parseInt(installmentsCount, 10) : 1,
        amount_is_total: true,
        is_fixed: isFixed,
        is_paid: isPaid,
        notes: notes.trim() || null
      });

      showToast("Transação registrada com sucesso!", "success");
      setDescription("");
      setAmount("");
      setIsInstallment(false);
      setInstallmentsCount(2);
      setNotes("");
      onClose();
    } catch (err) {
      showToast("Erro ao registrar movimentação.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="tx-modal-backdrop" onClick={onClose}>
      <div className="tx-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="tx-modal-header">
          <div className="tx-modal-header-left">
            <div className="tx-header-icon-circle">
              <ArrowRightLeft size={18} />
            </div>
            <div className="tx-header-text">
              <h2>Nova Movimentação Financeira</h2>
              <p>Registre uma nova transação para manter seu controle financeiro em dia.</p>
            </div>
          </div>
          <button type="button" className="tx-modal-close-btn" onClick={onClose} aria-label="Fechar">
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="tx-modal-form">
          {/* Despesa / Receita Segmented Switch */}
          <div className="tx-type-switch-row">
            <button
              type="button"
              className={`tx-type-pill-btn ${type === "expense" ? "active-expense" : ""}`}
              onClick={() => setType("expense")}
            >
              <ArrowDownRight size={17} />
              <span>Despesa (Saída)</span>
            </button>
            <button
              type="button"
              className={`tx-type-pill-btn ${type === "income" ? "active-income" : ""}`}
              onClick={() => setType("income")}
            >
              <ArrowUpRight size={17} />
              <span>Receita (Entrada)</span>
            </button>
          </div>

          {/* Descrição da Transação */}
          <div className="tx-form-group">
            <label>Descrição da Transação</label>
            <div className="tx-input-with-icon">
              <FileText size={17} className="tx-input-icon" />
              <input
                type="text"
                className="tx-form-input"
                placeholder="Ex: Supermercado, Salário, Compra Notebook..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Valor & Data */}
          <div className="tx-form-row-2">
            <div className="tx-form-group">
              <label>Valor (R$)</label>
              <div className="tx-input-with-icon">
                <span className="tx-currency-symbol">R$</span>
                <input
                  type="text"
                  className="tx-form-input"
                  placeholder="0,00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="tx-form-group">
              <label>Data</label>
              <div className="tx-input-with-icon">
                <Calendar size={17} className="tx-input-icon" />
                <input
                  type="date"
                  className="tx-form-input"
                  value={txDate}
                  onChange={(e) => setTxDate(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="tx-today-pill-badge"
                  onClick={handleSetToday}
                  title="Definir Hoje"
                >
                  Hoje
                </button>
              </div>
            </div>
          </div>

          {/* Categoria & Forma de Pagamento */}
          <div className="tx-form-row-2">
            <div className="tx-form-group">
              <div className="tx-label-with-action">
                <label>Categoria</label>
                {onOpenCategoryModal && (
                  <button
                    type="button"
                    className="tx-badge-link-btn"
                    onClick={onOpenCategoryModal}
                  >
                    + Nova Categoria
                  </button>
                )}
              </div>
              <div className="tx-input-with-icon">
                <Tag size={17} className="tx-input-icon" />
                <select
                  className="tx-form-select"
                  value={effectiveCatId}
                  onChange={(e) => setCategoryId(e.target.value)}
                >
                  {filteredCategories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="tx-form-group">
              <label>Forma de Pagamento</label>
              <div className="tx-input-with-icon">
                <CreditCard size={17} className="tx-input-icon" />
                <select
                  className="tx-form-select"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <option value="pix">PIX</option>
                  <option value="credit_card">Cartão de Crédito</option>
                  <option value="debit">Cartão de Débito</option>
                  <option value="bank_slip">Boleto Bancário</option>
                  <option value="cash">Dinheiro em Espécie</option>
                  <option value="transfer">Transferência Bancária</option>
                </select>
              </div>
            </div>
          </div>

          {/* Cartão de Crédito seletor se selecionado */}
          {paymentMethod === "credit_card" && creditCards.length > 0 && (
            <div className="tx-form-group">
              <label>Selecione o Cartão</label>
              <select
                className="tx-form-select"
                value={effectiveCardId}
                onChange={(e) => setCreditCardId(e.target.value)}
              >
                {creditCards.map((card) => (
                  <option key={card.id} value={card.id}>
                    {card.name} (Final {card.last_four || "0000"})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Compra Parcelada Card Box */}
          <div className="tx-checkbox-card">
            <label className="tx-custom-checkbox-row">
              <input
                type="checkbox"
                checked={isInstallment}
                onChange={(e) => setIsInstallment(e.target.checked)}
              />
              <div className="tx-checkbox-texts">
                <span className="tx-checkbox-title">Compra Parcelada</span>
                <span className="tx-checkbox-desc">Divida esta compra em várias parcelas.</span>
              </div>
            </label>

            {isInstallment && (
              <div className="tx-installment-picker">
                <span>Número de parcelas:</span>
                <select
                  className="tx-form-select"
                  style={{ width: 120, padding: "6px 10px" }}
                  value={installmentsCount}
                  onChange={(e) => setInstallmentsCount(parseInt(e.target.value, 10))}
                >
                  {[2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 18, 24].map((num) => (
                    <option key={num} value={num}>
                      {num}x de {formatCurrency((parseFloat(amount) || 0) / num)}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* 2 Checkboxes: Já Pago & Gasto Fixo Mensal */}
          <div className="tx-form-row-2">
            <div className="tx-checkbox-card">
              <label className="tx-custom-checkbox-row">
                <input
                  type="checkbox"
                  checked={isPaid}
                  onChange={(e) => setIsPaid(e.target.checked)}
                />
                <div className="tx-checkbox-texts">
                  <span className="tx-checkbox-title">Já Pago</span>
                  <span className="tx-checkbox-desc">Marque se esta transação já foi paga.</span>
                </div>
              </label>
            </div>

            <div className="tx-checkbox-card">
              <label className="tx-custom-checkbox-row">
                <input
                  type="checkbox"
                  checked={isFixed}
                  onChange={(e) => setIsFixed(e.target.checked)}
                />
                <div className="tx-checkbox-texts">
                  <span className="tx-checkbox-title">Gasto Fixo Mensal</span>
                  <span className="tx-checkbox-desc">Repete todos os meses automaticamente.</span>
                </div>
              </label>
            </div>
          </div>

          {/* Observações / Tags */}
          <div className="tx-form-group">
            <label>Observações / Tags (Opcional)</label>
            <div className="tx-input-with-icon">
              <MessageSquare size={17} className="tx-input-icon" />
              <input
                type="text"
                className="tx-form-input"
                placeholder="Ex: Compra na promoção, parcelado sem juros..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="tx-modal-footer">
            <button
              type="button"
              className="tx-btn-cancel"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="tx-btn-submit"
              disabled={isSubmitting}
            >
              <Save size={16} />
              <span>{isSubmitting ? "Salvando..." : "Salvar Transação"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
