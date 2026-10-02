import React, { useState, useMemo } from "react";
import { Target, Calendar, Info, Tv, Utensils, Car, Home, Gamepad2, HeartPulse, GraduationCap, ShoppingBag } from "lucide-react";
import { useFinance } from "../../context/FinanceContext";
import { formatCurrency } from "../../utils/formatters";

const CATEGORY_RULES = {
  "Assinaturas & Streaming": {
    rule: "wants",
    badge: "30% Desejos",
    badgeColor: "#7c3aed",
    badgeBg: "#ede9fe",
    desc: "Assinaturas & Streaming se enquadra em \"Desejos\" (30%), que inclui lazer, entretenimento e estilo de vida. O ideal é manter esses gastos em até 30% da sua renda mensal.",
    helper: "Ex.: Netflix, Spotify, YouTube, aplicativos, serviços online.",
    currentSpent: 62.90,
    icon: Tv
  },
  "Alimentação & Mercado": {
    rule: "needs",
    badge: "50% Necessidades",
    badgeColor: "#0284c7",
    badgeBg: "#e0f2fe",
    desc: "Alimentação & Mercado se enquadra em \"Necessidades\" (50%), que inclui supermercado, feira e refeições básicas essenciais.",
    helper: "Ex.: Supermercado, feira, açougue, padaria.",
    currentSpent: 412.30,
    icon: Utensils
  },
  "Transporte": {
    rule: "needs",
    badge: "50% Necessidades",
    badgeColor: "#0284c7",
    badgeBg: "#e0f2fe",
    desc: "Transporte se enquadra em \"Necessidades\" (50%), referente a combustível, transporte público, manutenção de veículos e mobilidade diária.",
    helper: "Ex.: Combustível, Uber, transporte público, pedágio.",
    currentSpent: 180.00,
    icon: Car
  },
  "Moradia": {
    rule: "needs",
    badge: "50% Necessidades",
    badgeColor: "#0284c7",
    badgeBg: "#e0f2fe",
    desc: "Moradia se enquadra em \"Necessidades\" (50%), englobando aluguel, condomínio, luz, água, gás e internet.",
    helper: "Ex.: Aluguel, condomínio, energia elétrica, água, internet.",
    currentSpent: 1450.00,
    icon: Home
  },
  "Lazer": {
    rule: "wants",
    badge: "30% Desejos",
    badgeColor: "#7c3aed",
    badgeBg: "#ede9fe",
    desc: "Lazer se enquadra em \"Desejos\" (30%), englobando passeios, bares, restaurantes, cinema e viagens de fim de semana.",
    helper: "Ex.: Restaurantes, cinema, passeios, viagens, festas.",
    currentSpent: 320.50,
    icon: Gamepad2
  },
  "Saúde": {
    rule: "needs",
    badge: "50% Necessidades",
    badgeColor: "#0284c7",
    badgeBg: "#e0f2fe",
    desc: "Saúde se enquadra em \"Necessidades\" (50%), garantindo consultas, exames, farmácia e plano de saúde.",
    helper: "Ex.: Farmácia, plano de saúde, consultas, exames.",
    currentSpent: 120.00,
    icon: HeartPulse
  },
  "Educação": {
    rule: "needs",
    badge: "50% Necessidades",
    badgeColor: "#0284c7",
    badgeBg: "#e0f2fe",
    desc: "Educação se enquadra em \"Necessidades & Investimento\", englobando mensalidades escolares, faculdade, cursos e livros.",
    helper: "Ex.: Mensalidades, cursos online, livros, material escolar.",
    currentSpent: 250.00,
    icon: GraduationCap
  },
  "Compras & Pessoal": {
    rule: "wants",
    badge: "30% Desejos",
    badgeColor: "#7c3aed",
    badgeBg: "#ede9fe",
    desc: "Compras pessoais e vestuário se enquadram em \"Desejos\" (30%), cobrindo roupas, acessórios e compras de estilo de vida.",
    helper: "Ex.: Roupas, calçados, eletrônicos, cosméticos.",
    currentSpent: 190.00,
    icon: ShoppingBag
  }
};

export const AddBudgetModal = ({ isOpen, onClose, initialData = null }) => {
  const { categories, saveBudget, transactions } = useFinance();
  const expenseCategories = categories.filter((c) => c.type === "expense" || c.type === "both");

  const [categoryId, setCategoryId] = useState(() => initialData?.category_id || (expenseCategories[0]?.id || ""));
  const [allocatedAmount, setAllocatedAmount] = useState(() => initialData?.allocated_amount ? String(initialData.allocated_amount) : "800.00");
  const [selectedMonth] = useState("Setembro de 2024");

  const selectedCategoryObj = expenseCategories.find(c => String(c.id) === String(categoryId)) || expenseCategories[0];
  const catName = selectedCategoryObj?.name || "Assinaturas & Streaming";

  const ruleConfig = CATEGORY_RULES[catName] || {
    rule: "wants",
    badge: "30% Desejos",
    badgeColor: "#7c3aed",
    badgeBg: "#ede9fe",
    desc: `${catName} se enquadra nas diretrizes do método 50/30/20 para controle inteligente de despesas.`,
    helper: "Configure o teto de gastos ideal para esta categoria.",
    currentSpent: 62.90,
    icon: Target
  };

  // Calculate actual spent this month from transactions if available
  const spentThisMonth = useMemo(() => {
    if (!transactions || transactions.length === 0) return ruleConfig.currentSpent || 62.90;
    const catTxs = transactions.filter(t => t.type === "expense" && (t.category_id === parseInt(categoryId, 10) || t.category === catName));
    const sum = catTxs.reduce((acc, t) => acc + (t.amount || 0), 0);
    return sum > 0 ? sum : (ruleConfig.currentSpent || 62.90);
  }, [transactions, categoryId, catName, ruleConfig.currentSpent]);

  const parsedLimit = parseFloat(allocatedAmount) || 800;
  const usagePercentage = parsedLimit > 0 ? Math.min(100, (spentThisMonth / parsedLimit) * 100) : 0;
  const remainingAvailable = Math.max(0, parsedLimit - spentThisMonth);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!allocatedAmount || parseFloat(allocatedAmount) <= 0) return;

    saveBudget({
      category_id: parseInt(categoryId || expenseCategories[0]?.id, 10),
      allocated_amount: parseFloat(allocatedAmount)
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="fin-modal-card"
        style={{ maxWidth: 560 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header matching Image 2 */}
        <div className="fin-modal-header">
          <div className="fin-modal-header-left">
            <div className="fin-header-icon-circle" style={{ background: "#ccfbf1", color: "#0d9488" }}>
              <Target size={22} />
            </div>
            <div className="fin-header-text">
              <h2>Definir Novo Orçamento</h2>
              <p>Configure um limite mensal e acompanhe seus gastos por categoria.</p>
            </div>
          </div>
          <button type="button" className="cat-modal-close-btn" onClick={onClose} title="Fechar">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ padding: "20px 24px", gap: 16 }}>
            {/* Field 1: Categoria de Gasto */}
            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 700, color: "#1e293b" }}>
                Categoria de Gasto
              </label>
              <select
                className="form-select"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                required
                style={{ padding: "11px 14px", fontWeight: 600 }}
              >
                {expenseCategories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 2 }}>
                {ruleConfig.helper}
              </span>
            </div>

            {/* Row: Mês & Limite Mensal */}
            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 700, color: "#1e293b" }}>
                  Mês
                </label>
                <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                  <Calendar size={16} style={{ position: "absolute", left: 12, color: "#64748b", pointerEvents: "none" }} />
                  <select
                    className="form-select"
                    style={{ paddingLeft: 36, fontWeight: 600 }}
                    defaultValue="Setembro de 2024"
                  >
                    <option value="Setembro de 2024">Setembro de 2024</option>
                    <option value="Outubro de 2024">Outubro de 2024</option>
                    <option value="Novembro de 2024">Novembro de 2024</option>
                    <option value="Dezembro de 2024">Dezembro de 2024</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 700, color: "#1e293b" }}>
                  Limite Mensal Planejado (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="1"
                  placeholder="800,00"
                  className="form-input"
                  value={allocatedAmount}
                  onChange={(e) => setAllocatedAmount(e.target.value)}
                  required
                  style={{ fontWeight: 700 }}
                />
              </div>
            </div>

            {/* Box: Classificação pela regra 50/30/20 */}
            <div
              style={{
                background: "#f0fdfa",
                border: "1px solid #ccfbf1",
                borderRadius: 16,
                padding: "16px 18px",
                display: "flex",
                alignItems: "center",
                gap: 16
              }}
            >
              {/* Donut Ring */}
              <div style={{ position: "relative", width: 80, height: 80, flexShrink: 0 }}>
                <svg width="80" height="80" viewBox="0 0 80 80">
                  <circle cx="40" cy="40" r="30" fill="none" stroke="#e2e8f0" strokeWidth="10" />
                  <circle
                    cx="40"
                    cy="40"
                    r="30"
                    fill="none"
                    stroke="#0d9488"
                    strokeWidth="10"
                    strokeDasharray="56.5 188.4"
                    strokeDashoffset="0"
                    transform="rotate(-90 40 40)"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="30"
                    fill="none"
                    stroke="#8b5cf6"
                    strokeWidth="10"
                    strokeDasharray="56.5 188.4"
                    strokeDashoffset="-56.5"
                    transform="rotate(-90 40 40)"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="30"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="10"
                    strokeDasharray="75.4 188.4"
                    strokeDashoffset="-113"
                    transform="rotate(-90 40 40)"
                  />
                </svg>
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center"
                  }}
                >
                  <span style={{ fontSize: "0.62rem", fontWeight: 800, color: "#0f766e", lineHeight: 1.1 }}>
                    Regra<br />50/30/20
                  </span>
                </div>
              </div>

              {/* Text Description & Badge */}
              <div style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "0.85rem", fontWeight: 800, color: "#0f172a" }}>
                    Classificação pela regra 50/30/20
                  </span>
                  <span
                    style={{
                      fontSize: "0.72rem",
                      fontWeight: 800,
                      padding: "2px 8px",
                      borderRadius: 12,
                      background: ruleConfig.badgeBg,
                      color: ruleConfig.badgeColor
                    }}
                  >
                    {ruleConfig.badge}
                  </span>
                </div>
                <p style={{ fontSize: "0.75rem", color: "#475569", lineHeight: 1.35, margin: 0 }}>
                  {ruleConfig.desc}
                </p>
              </div>
            </div>

            {/* Box: Prévia do orçamento */}
            <div
              style={{
                background: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: 16,
                padding: "16px 18px",
                display: "flex",
                flexDirection: "column",
                gap: 10
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.85rem", fontWeight: 800, color: "#0f172a" }}>
                  Prévia do orçamento
                </span>
                <span style={{ fontSize: "0.72rem", color: "#64748b", display: "flex", alignItems: "center", gap: 4 }}>
                  <span>Com base nos seus gastos deste mês</span>
                  <Info size={13} color="#94a3b8" />
                </span>
              </div>

              {/* Values */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                <div>
                  <div style={{ fontSize: "1.15rem", fontWeight: 800, color: "#0d9488" }}>
                    {formatCurrency(spentThisMonth)}
                  </div>
                  <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Gasto no mês</div>
                </div>

                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "1.15rem", fontWeight: 800, color: "#0f172a" }}>
                    {formatCurrency(parsedLimit)}
                  </div>
                  <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Limite mensal</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div style={{ width: "100%", height: 8, background: "#f1f5f9", borderRadius: 4, overflow: "hidden" }}>
                <div
                  style={{
                    height: "100%",
                    width: `${Math.min(100, usagePercentage)}%`,
                    background: usagePercentage > 90 ? "#f43f5e" : "#0d9488",
                    borderRadius: 4,
                    transition: "width 0.3s ease"
                  }}
                />
              </div>

              {/* Bottom Percentage & Remaining */}
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.76rem", fontWeight: 700 }}>
                <span style={{ color: "#0d9488" }}>
                  {usagePercentage.toFixed(1).replace(".", ",")}% utilizado
                </span>
                <span style={{ color: "#64748b" }}>
                  {formatCurrency(remainingAvailable)} disponível
                </span>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div
            style={{
              padding: "16px 24px",
              borderTop: "1px solid #f1f5f9",
              display: "flex",
              justifyContent: "flex-end",
              gap: 12
            }}
          >
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              style={{ borderRadius: 10, padding: "10px 20px" }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ borderRadius: 10, padding: "10px 24px", background: "#0d9488" }}
            >
              Salvar orçamento
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
