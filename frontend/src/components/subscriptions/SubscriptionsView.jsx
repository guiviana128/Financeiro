import React, { useState } from "react";
import { formatCurrency } from "../../utils/formatters";
import { useFinance } from "../../context/FinanceContext";
import { Tv, Plus, Trash2, Calendar, AlertTriangle, CheckCircle, RefreshCw } from "lucide-react";
import { Modal } from "../common/Modal";

const DEFAULT_SUBSCRIPTIONS = [
  { id: 1, name: "Netflix Premium 4K", category: "Streaming", amount: 55.90, billingDay: 10, icon: "Tv", color: "#e50914" },
  { id: 2, name: "Spotify Family", category: "Música", amount: 34.90, billingDay: 15, icon: "Music", color: "#1db954" },
  { id: 3, name: "Amazon Prime", category: "Compras & Vídeo", amount: 19.90, billingDay: 5, icon: "ShoppingBag", color: "#00a8e1" },
  { id: 4, name: "Academia Smart Fit", category: "Saúde & Fitness", amount: 129.90, billingDay: 1, icon: "Activity", color: "#ffb703" },
  { id: 5, name: "iCloud 200GB", category: "Armazenamento", amount: 14.90, billingDay: 20, icon: "Cloud", color: "#0071e3" },
  { id: 6, name: "ChatGPT Plus", category: "Produtividade", amount: 110.00, billingDay: 28, icon: "Zap", color: "#10a37f" },
];

export const SubscriptionsView = () => {
  const { isPrivacyMode, showToast } = useFinance();
  const [subscriptions, setSubscriptions] = useState(() => {
    try {
      const saved = localStorage.getItem("finflow_subscriptions");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Streaming");
  const [amount, setAmount] = useState("");
  const [billingDay, setBillingDay] = useState("10");

  const saveSubs = (newSubs) => {
    setSubscriptions(newSubs);
    localStorage.setItem("finflow_subscriptions", JSON.stringify(newSubs));
  };

  const monthlyTotal = subscriptions.reduce((acc, s) => acc + (s.amount || 0), 0);
  const annualTotal = monthlyTotal * 12;

  const handleAdd = (e) => {
    e.preventDefault();
    if (!name.trim() || !amount) return;

    const newSub = {
      id: Date.now(),
      name: name.trim(),
      category,
      amount: parseFloat(amount) || 0,
      billingDay: parseInt(billingDay, 10) || 1,
      icon: "Tv",
      color: "#6366f1"
    };

    saveSubs([...subscriptions, newSub]);
    setName("");
    setAmount("");
    setIsModalOpen(false);
    showToast("Assinatura cadastrada!", "success");
  };

  const handleRemove = (id) => {
    saveSubs(subscriptions.filter((s) => s.id !== id));
    showToast("Assinatura removida.", "info");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Header & Main Actions */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700, display: "flex", alignItems: "center", gap: 10 }}>
            <RefreshCw size={22} color="var(--accent-primary)" />
            <span>Assinaturas & Gastos Recorrentes</span>
          </h2>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
            Controle serviços de streaming, academias, softwares e evite gastos desnecessários.
          </p>
        </div>

        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} />
          <span>Nova Assinatura</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="kpi-cards-grid">
        <div className="glass-card kpi-card kpi-expense">
          <div className="kpi-top">
            <span className="kpi-label">Custo Mensal Recorrente</span>
            <div className="kpi-icon-wrapper" style={{ background: "rgba(244, 63, 94, 0.15)" }}>
              <Tv size={20} color="#f43f5e" />
            </div>
          </div>
          <div>
            <div className="kpi-value">{formatCurrency(monthlyTotal, isPrivacyMode)}</div>
            <div className="kpi-subtitle">Total cobrado todo mês</div>
          </div>
        </div>

        <div className="glass-card kpi-card kpi-cards">
          <div className="kpi-top">
            <span className="kpi-label">Impacto Anual Acumulado</span>
            <div className="kpi-icon-wrapper" style={{ background: "rgba(139, 92, 246, 0.15)" }}>
              <AlertTriangle size={20} color="#8b5cf6" />
            </div>
          </div>
          <div>
            <div className="kpi-value" style={{ color: "#c084fc" }}>
              {formatCurrency(annualTotal, isPrivacyMode)}
            </div>
            <div className="kpi-subtitle">Gasto em 12 meses de assinaturas</div>
          </div>
        </div>

        <div className="glass-card kpi-card kpi-savings">
          <div className="kpi-top">
            <span className="kpi-label">Serviços Ativos</span>
            <div className="kpi-icon-wrapper" style={{ background: "rgba(6, 182, 212, 0.15)" }}>
              <CheckCircle size={20} color="#06b6d4" />
            </div>
          </div>
          <div>
            <div className="kpi-value">{subscriptions.length} assinaturas</div>
            <div className="kpi-subtitle">Renovação automática ativa</div>
          </div>
        </div>
      </div>

      {/* Subscriptions Grid */}
      {subscriptions.length === 0 ? (
        <div
          className="glass-card"
          style={{
            padding: "48px 24px",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: "var(--accent-glow)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--accent-primary)"
            }}
          >
            <RefreshCw size={26} />
          </div>
          <div>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: 4 }}>Nenhuma assinatura cadastrada</h3>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", maxWidth: 400, margin: "0 auto" }}>
              Cadastre suas assinaturas mensais (Netflix, Spotify, academia, etc.) para monitorar o impacto anual no seu orçamento.
            </p>
          </div>
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
            <Plus size={16} />
            <span>Cadastrar Primeira Assinatura</span>
          </button>
        </div>
      ) : (
        <div className="cards-grid">
          {subscriptions.map((sub) => (
            <div
              key={sub.id}
              className="glass-card"
              style={{
                padding: 20,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderLeft: `4px solid ${sub.color || "#6366f1"}`
              }}
            >
              <div>
                <div style={{ fontWeight: 700, fontSize: "1.05rem", color: "var(--text-primary)" }}>{sub.name}</div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: 2 }}>{sub.category}</div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: 4, marginTop: 6 }}>
                  <Calendar size={12} />
                  <span>Cobra todo dia {sub.billingDay}</span>
                </div>
              </div>

              <div style={{ textAlign: "right", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
                <div style={{ fontWeight: 800, fontSize: "1.2rem", color: "var(--color-expense)" }}>
                  {formatCurrency(sub.amount, isPrivacyMode)}
                  <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 400 }}> /mês</span>
                </div>
                <button
                  className="action-btn-sm delete-btn"
                  onClick={() => handleRemove(sub.id)}
                  title="Remover assinatura"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Add Subscription */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nova Assinatura Recorrente">
        <form onSubmit={handleAdd}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Nome do Serviço</label>
              <input
                type="text"
                className="form-input"
                placeholder="Ex: Disney+, Gympass, YouTube Premium"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label">Valor Mensal (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0,00"
                  className="form-input"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Dia da Cobrança</label>
                <input
                  type="number"
                  min="1"
                  max="31"
                  className="form-input"
                  value={billingDay}
                  onChange={(e) => setBillingDay(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Categoria</label>
              <select
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Streaming">Streaming de Vídeo</option>
                <option value="Música">Música & Áudio</option>
                <option value="Saúde & Fitness">Saúde & Fitness</option>
                <option value="Produtividade">Produtividade & Softwares</option>
                <option value="Armazenamento">Nuvem & Armazenamento</option>
                <option value="Educação">Cursos & Educação</option>
              </select>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              Cadastrar Assinatura
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
