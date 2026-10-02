import React, { useState } from "react";
import { formatCurrency } from "../../utils/formatters";
import { useFinance } from "../../context/FinanceContext";
import {
  CreditCard,
  BarChart2,
  CheckCircle,
  Search,
  Plus,
  Trash2,
  Calendar,
  Sparkles,
  Bell,
  Tag,
  Folder,
  DollarSign,
  Check
} from "lucide-react";
import { BrandLogo } from "../common/BrandLogo";

const POPULAR_PRESETS = [
  { name: "Netflix", plan: "Plano Padrão", category: "Streaming de Vídeo", amount: 39.90 },
  { name: "Spotify", plan: "Plano Premium", category: "Música & Áudio", amount: 21.90 },
  { name: "Disney+", plan: "Plano Padrão", category: "Streaming de Vídeo", amount: 27.90 },
  { name: "Max", plan: "Plano Standard", category: "Streaming de Vídeo", amount: 39.90 },
  { name: "YouTube Premium", plan: "Individual", category: "Streaming de Vídeo", amount: 24.90 },
  { name: "Prime Video", plan: "Amazon Prime", category: "Streaming de Vídeo", amount: 19.90 },
  { name: "ChatGPT Plus", plan: "OpenAI Pro", category: "Produtividade & IA", amount: 99.90 },
  { name: "Xbox Game Pass", plan: "Ultimate", category: "Games & Jogos", amount: 49.99 },
  { name: "PlayStation Plus", plan: "Extra", category: "Games & Jogos", amount: 52.90 },
  { name: "Smart Fit", plan: "Plano Black", category: "Saúde & Bem-estar", amount: 49.90 },
];

export const SubscriptionsView = () => {
  const { isPrivacyMode, showToast } = useFinance();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("all");

  const DEFAULT_SUBSCRIPTIONS = [
    {
      id: 1,
      name: "Netflix",
      plan: "Renova em 10/04",
      category: "Streaming de Vídeo",
      categoryColor: "#0d9488",
      categoryBg: "#ccfbf1",
      amount: 39.90,
      nextDate: "10/04/2026",
      daysLeft: 5,
      status: "Ativa"
    },
    {
      id: 2,
      name: "Spotify",
      plan: "Renova em 12/04",
      category: "Música & Áudio",
      categoryColor: "#ec4899",
      categoryBg: "#fce7f3",
      amount: 21.90,
      nextDate: "12/04/2026",
      daysLeft: 7,
      status: "Ativa"
    },
    {
      id: 3,
      name: "ChatGPT Plus",
      plan: "Renova em 15/04",
      category: "Produtividade & IA",
      categoryColor: "#8b5cf6",
      categoryBg: "#ede9fe",
      amount: 99.90,
      nextDate: "15/04/2026",
      daysLeft: 10,
      status: "Ativa"
    },
    {
      id: 4,
      name: "YouTube Premium",
      plan: "Renova em 20/04",
      category: "Streaming de Vídeo",
      categoryColor: "#0d9488",
      categoryBg: "#ccfbf1",
      amount: 24.90,
      nextDate: "20/04/2026",
      daysLeft: 15,
      status: "Ativa"
    },
    {
      id: 5,
      name: "Disney+",
      plan: "Renova em 28/04",
      category: "Streaming de Vídeo",
      categoryColor: "#0d9488",
      categoryBg: "#ccfbf1",
      amount: 27.90,
      nextDate: "28/04/2026",
      daysLeft: 23,
      status: "Ativa"
    },
  ];

  const [subscriptions, setSubscriptions] = useState(() => {
    try {
      const saved = localStorage.getItem("finflow_subscriptions");
      return saved ? JSON.parse(saved) : DEFAULT_SUBSCRIPTIONS;
    } catch {
      return DEFAULT_SUBSCRIPTIONS;
    }
  });

  // Form State
  const [formName, setFormName] = useState("");
  const [formPlan, setFormPlan] = useState("");
  const [formCat, setFormCat] = useState("Streaming de Vídeo");
  const [formAmount, setFormAmount] = useState("");
  const [formBillingDay, setFormBillingDay] = useState("10");
  const [reminderActive, setReminderActive] = useState(true);
  const [reminderDays, setReminderDays] = useState("3 dias antes");
  const [selectedPresetName, setSelectedPresetName] = useState("");

  const monthlyTotal = subscriptions.reduce((acc, s) => acc + (s.amount || 0), 0);
  const annualTotal = monthlyTotal * 12;
  const upcomingRenewalsCount = subscriptions.filter(s => s.daysLeft !== undefined && s.daysLeft <= 7).length;

  const filtered = subscriptions.filter(s => {
    if (search && !s.name.toLowerCase().includes(search.toLowerCase()) && !s.category.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    if (selectedCat !== "all" && s.category !== selectedCat) {
      return false;
    }
    return true;
  });

  const handleSelectPreset = (p) => {
    setSelectedPresetName(p.name);
    setFormName(p.name);
    setFormPlan(p.plan);
    setFormCat(p.category);
    setFormAmount(String(p.amount));
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!formName.trim() || !formAmount) return;

    const billingDayNum = parseInt(formBillingDay, 10) || 10;
    const today = new Date().getDate();
    let calcDaysLeft = billingDayNum - today;
    if (calcDaysLeft < 0) calcDaysLeft += 30;

    const newSub = {
      id: Date.now(),
      name: formName.trim(),
      plan: formPlan.trim() || `Renova dia ${billingDayNum}`,
      category: formCat,
      categoryColor: formCat.includes("Streaming") ? "#0d9488" : formCat.includes("Música") ? "#ec4899" : "#8b5cf6",
      categoryBg: formCat.includes("Streaming") ? "#ccfbf1" : formCat.includes("Música") ? "#fce7f3" : "#ede9fe",
      amount: parseFloat(formAmount) || 0,
      nextDate: `${String(billingDayNum).padStart(2, "0")}/10/2026`,
      daysLeft: calcDaysLeft,
      status: "Ativa"
    };

    const updated = [...subscriptions, newSub];
    setSubscriptions(updated);
    try {
      localStorage.setItem("finflow_subscriptions", JSON.stringify(updated));
    } catch {}

    setFormName("");
    setFormPlan("");
    setFormAmount("");
    setSelectedPresetName("");
    setIsModalOpen(false);
    showToast("Assinatura cadastrada com sucesso!", "success");
  };

  const handleRemove = (id) => {
    const updated = subscriptions.filter(s => s.id !== id);
    setSubscriptions(updated);
    try {
      localStorage.setItem("finflow_subscriptions", JSON.stringify(updated));
    } catch {}
    showToast("Assinatura removida!", "info");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* 3 Top KPI Cards */}
      <div className="kpi-cards-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
        {/* Card 1 */}
        <div className="kpi-card">
          <div className="kpi-top">
            <div className="kpi-icon-box" style={{ background: "#fff1f2", color: "#f43f5e" }}>
              <CreditCard size={19} />
            </div>
            <span className="kpi-badge down" style={{ background: "#ecfdf5", color: "#10b981" }}>
              &darr; Recorrência ativa
            </span>
          </div>
          <div className="kpi-label">TOTAL MENSAL RECORRENTE</div>
          <div className="kpi-value" style={{ color: "#0f172a" }}>
            {formatCurrency(monthlyTotal, isPrivacyMode)}
          </div>
        </div>

        {/* Card 2 */}
        <div className="kpi-card">
          <div className="kpi-top">
            <div className="kpi-icon-box" style={{ background: "#f5f3ff", color: "#8b5cf6" }}>
              <BarChart2 size={19} />
            </div>
          </div>
          <div className="kpi-label">IMPACTO ANUAL ACUMULADO</div>
          <div className="kpi-value" style={{ color: "#8b5cf6" }}>
            {formatCurrency(annualTotal, isPrivacyMode)}
          </div>
          <div className="kpi-subtitle">Gasto estimado em 12 meses</div>
        </div>

        {/* Card 3 */}
        <div className="kpi-card">
          <div className="kpi-top">
            <div className="kpi-icon-box" style={{ background: "#ecfdf5", color: "#0d9488" }}>
              <CheckCircle size={19} />
            </div>
          </div>
          <div className="kpi-label">RENOVA EM BREVE</div>
          <div className="kpi-value" style={{ color: "#0f172a" }}>
            {upcomingRenewalsCount}
          </div>
          <div className="kpi-subtitle">nos próximos 7 dias</div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="budget-table-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "var(--text-primary)" }}>
              Assinaturas ({subscriptions.length})
            </h3>
            <button
              type="button"
              className="btn btn-primary"
              style={{ padding: "6px 14px", fontSize: "0.82rem", background: "#0d9488" }}
              onClick={() => setIsModalOpen(true)}
            >
              <Plus size={15} />
              <span>Nova Assinatura</span>
            </button>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <div className="tx-search-box" style={{ minWidth: 220 }}>
              <Search size={15} className="tx-search-icon" />
              <input
                type="text"
                className="tx-search-input"
                placeholder="Buscar assinaturas..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <select
              className="tx-select"
              value={selectedCat}
              onChange={(e) => setSelectedCat(e.target.value)}
            >
              <option value="all">Todas as categorias</option>
              <option value="Streaming de Vídeo">Streaming de Vídeo</option>
              <option value="Música & Áudio">Música & Áudio</option>
              <option value="Produtividade & IA">Produtividade & IA</option>
              <option value="Games & Jogos">Games & Jogos</option>
              <option value="Saúde & Bem-estar">Saúde & Bem-estar</option>
            </select>
          </div>
        </div>

        <div className="tx-table-responsive">
          <table className="tx-table">
            <thead>
              <tr>
                <th>Nome &darr;</th>
                <th>Categoria</th>
                <th style={{ textAlign: "right" }}>Valor mensal &uarr;&darr;</th>
                <th style={{ width: 40, textAlign: "center" }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((sub) => (
                <tr key={sub.id}>
                  {/* Service Logo & Name */}
                  <td>
                    <div className="tx-desc-cell">
                      <BrandLogo name={sub.name} size={36} />
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span className="tx-title-bold">{sub.name}</span>
                        <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{sub.plan}</span>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td>
                    <span
                      className="tx-category-badge"
                      style={{ background: sub.categoryBg || "#ccfbf1", color: sub.categoryColor || "#0d9488" }}
                    >
                      {sub.category}
                    </span>
                  </td>

                  {/* Valor */}
                  <td style={{ textAlign: "right", fontWeight: 800, color: "var(--text-primary)" }}>
                    {formatCurrency(sub.amount)}
                  </td>

                  {/* Actions */}
                  <td style={{ textAlign: "center" }}>
                    <button
                      type="button"
                      className="action-btn-sm"
                      onClick={() => handleRemove(sub.id)}
                      title="Excluir assinatura"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Cadastrar Nova Assinatura matching Image 3 */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div
            className="fin-modal-card"
            style={{ maxWidth: 620 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header matching Image 3 */}
            <div className="fin-modal-header">
              <div className="fin-modal-header-left">
                <div className="fin-header-icon-circle" style={{ background: "#ccfbf1", color: "#0d9488" }}>
                  <Calendar size={22} />
                </div>
                <div className="fin-header-text">
                  <h2>Cadastrar Nova Assinatura</h2>
                  <p>Adicione uma nova assinatura para acompanhar seus gastos recorrentes no FinFlow Pro.</p>
                </div>
              </div>
              <button type="button" className="cat-modal-close-btn" onClick={() => setIsModalOpen(false)} title="Fechar">
                ✕
              </button>
            </div>

            <form onSubmit={handleAdd}>
              <div className="modal-body" style={{ padding: "20px 24px", gap: 16 }}>
                {/* Popular Services Section */}
                <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 14, padding: "14px 16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.82rem", fontWeight: 700, color: "#0f766e" }}>
                      <Sparkles size={15} color="#0d9488" />
                      <span>Escolha um serviço popular (preenchimento automático)</span>
                    </div>
                    <span style={{ fontSize: "0.72rem", color: "#94a3b8" }}>
                      Ou preencha manualmente
                    </span>
                  </div>

                  {/* 10 Popular Buttons Grid */}
                  <div className="fin-popular-services-grid">
                    {POPULAR_PRESETS.map((p, idx) => {
                      const isSelected = selectedPresetName === p.name || formName === p.name;
                      return (
                        <button
                          key={idx}
                          type="button"
                          className={`fin-popular-btn ${isSelected ? "active" : ""}`}
                          onClick={() => handleSelectPreset(p)}
                        >
                          <BrandLogo name={p.name} size={18} />
                          <span>{p.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Field 1: Nome do serviço */}
                <div className="form-group">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <label className="form-label" style={{ fontWeight: 700, color: "#1e293b" }}>Nome do serviço</label>
                    <span style={{ fontSize: "0.72rem", color: "#94a3b8" }}>Como aparece na sua fatura</span>
                  </div>
                  <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                    <Search size={16} style={{ position: "absolute", left: 12, color: "#94a3b8", pointerEvents: "none" }} />
                    <input
                      type="text"
                      className="form-input"
                      style={{ paddingLeft: 38 }}
                      placeholder="Ex: Netflix, Spotify, ChatGPT Plus..."
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Field 2: Plano / Detalhe */}
                <div className="form-group">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <label className="form-label" style={{ fontWeight: 700, color: "#1e293b" }}>Plano / Detalhe</label>
                    <span style={{ fontSize: "0.72rem", color: "#94a3b8" }}>Ex.: Plano Padrão, Premium, 200 GB...</span>
                  </div>
                  <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                    <Tag size={16} style={{ position: "absolute", left: 12, color: "#94a3b8", pointerEvents: "none" }} />
                    <input
                      type="text"
                      className="form-input"
                      style={{ paddingLeft: 38 }}
                      placeholder="Ex: Plano Padrão, Premium, 200 GB..."
                      value={formPlan}
                      onChange={(e) => setFormPlan(e.target.value)}
                    />
                  </div>
                </div>

                {/* Row: Valor mensal & Dia da cobrança */}
                <div className="form-row-2">
                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: 700, color: "#1e293b" }}>Valor mensal (R$)</label>
                    <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                      <DollarSign size={16} style={{ position: "absolute", left: 12, color: "#94a3b8", pointerEvents: "none" }} />
                      <input
                        type="number"
                        step="0.01"
                        placeholder="0,00"
                        className="form-input"
                        style={{ paddingLeft: 38, fontWeight: 700 }}
                        value={formAmount}
                        onChange={(e) => setFormAmount(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: 700, color: "#1e293b" }}>Dia da cobrança</label>
                    <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                      <Calendar size={16} style={{ position: "absolute", left: 12, color: "#94a3b8", pointerEvents: "none" }} />
                      <input
                        type="number"
                        min="1"
                        max="31"
                        className="form-input"
                        style={{ paddingLeft: 38, fontWeight: 700 }}
                        placeholder="Ex: 10"
                        value={formBillingDay}
                        onChange={(e) => setFormBillingDay(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Field: Categoria */}
                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 700, color: "#1e293b" }}>Categoria</label>
                  <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                    <Folder size={16} style={{ position: "absolute", left: 12, color: "#94a3b8", pointerEvents: "none" }} />
                    <select
                      className="form-select"
                      style={{ paddingLeft: 38, fontWeight: 600 }}
                      value={formCat}
                      onChange={(e) => setFormCat(e.target.value)}
                    >
                      <option value="Streaming de Vídeo">Streaming de Vídeo</option>
                      <option value="Música & Áudio">Música & Áudio</option>
                      <option value="Produtividade & IA">Produtividade & IA</option>
                      <option value="Games & Jogos">Games & Jogos</option>
                      <option value="Software & Nuvem">Software & Nuvem</option>
                      <option value="Saúde & Bem-estar">Saúde & Bem-estar</option>
                      <option value="Educação & Idiomas">Educação & Idiomas</option>
                      <option value="Delivery & Outros">Delivery & Outros</option>
                    </select>
                  </div>
                </div>

                {/* Section: Lembrete de renovação */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    background: "#f0fdfa",
                    border: "1px solid #ccfbf1",
                    borderRadius: 14,
                    padding: "12px 16px"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#ccfbf1", color: "#0d9488", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Bell size={17} />
                    </div>
                    <div>
                      <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#0f766e" }}>
                        Lembrete de renovação (opcional)
                      </div>
                      <div style={{ fontSize: "0.74rem", color: "#115e59" }}>
                        Receba um aviso antes da sua assinatura renovar.
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <label className="fin-switch-toggle">
                      <input
                        type="checkbox"
                        checked={reminderActive}
                        onChange={(e) => setReminderActive(e.target.checked)}
                      />
                      <span className="fin-switch-slider" />
                    </label>

                    {reminderActive && (
                      <select
                        className="form-select"
                        style={{ padding: "6px 10px", fontSize: "0.78rem", fontWeight: 600, width: "auto" }}
                        value={reminderDays}
                        onChange={(e) => setReminderDays(e.target.value)}
                      >
                        <option value="1 dia antes">1 dia antes</option>
                        <option value="2 dias antes">2 dias antes</option>
                        <option value="3 dias antes">3 dias antes</option>
                        <option value="5 dias antes">5 dias antes</option>
                        <option value="7 dias antes">7 dias antes</option>
                      </select>
                    )}
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
                  onClick={() => setIsModalOpen(false)}
                  style={{ borderRadius: 10, padding: "10px 20px" }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ borderRadius: 10, padding: "10px 24px", background: "#0d9488", display: "flex", alignItems: "center", gap: 6 }}
                >
                  <Check size={16} />
                  <span>Salvar assinatura</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
