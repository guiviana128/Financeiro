import React, { useState, useEffect } from "react";
import { Modal } from "../common/Modal";
import { CreditCard, Sparkles, Wifi, RotateCw, Palette, Shield, Check, Zap, Smartphone, Link2, Lock, HelpCircle } from "lucide-react";
import { formatCurrency, formatCPF, validateCPF, maskCPF } from "../../utils/formatters";

const PRESET_CATEGORIES = [
  { id: "all", label: "Todos" },
  { id: "digital", label: "Bancos Digitais" },
  { id: "traditional", label: "Grandes Bancos" },
  { id: "black", label: "Black & Premium" },
  { id: "global", label: "Internacionais" }
];

const BANK_PRESETS = [
  // Digitais
  { name: "Nubank Gold/Plat", bank: "Nubank", brand: "mastercard", category: "digital", color: "#820AD1", color_end: "#4C0677", defaultLimit: 4500 },
  { name: "Nubank Ultravioleta", bank: "Nubank", brand: "mastercard", category: "black", color: "#2B0B3F", color_end: "#0A020F", defaultLimit: 15000 },
  { name: "Inter Gold", bank: "Inter", brand: "mastercard", category: "digital", color: "#FF7A00", color_end: "#B84800", defaultLimit: 5000 },
  { name: "Inter Black", bank: "Inter", brand: "mastercard", category: "black", color: "#1F1F1F", color_end: "#0D0D0D", defaultLimit: 20000 },
  { name: "C6 Bank", bank: "C6 Bank", brand: "mastercard", category: "digital", color: "#242424", color_end: "#121212", defaultLimit: 6000 },
  { name: "C6 Carbon Black", bank: "C6 Bank", brand: "mastercard", category: "black", color: "#1A1A1A", color_end: "#050505", defaultLimit: 18000 },
  { name: "PicPay Card", bank: "PicPay", brand: "mastercard", category: "digital", color: "#11C76F", color_end: "#065F38", defaultLimit: 3000 },
  { name: "Neon", bank: "Neon", brand: "visa", category: "digital", color: "#00E5FF", color_end: "#0055FF", defaultLimit: 3500 },

  // Grandes Bancos Tradicionais
  { name: "Itaú Personnalité", bank: "Itaú", brand: "mastercard", category: "black", color: "#1E293B", color_end: "#0F172A", defaultLimit: 25000 },
  { name: "Itaú Click", bank: "Itaú", brand: "mastercard", category: "traditional", color: "#EC7000", color_end: "#003399", defaultLimit: 5000 },
  { name: "Bradesco Prime", bank: "Bradesco", brand: "visa", category: "traditional", color: "#CC092F", color_end: "#700015", defaultLimit: 12000 },
  { name: "Bradesco Elo Nanquim", bank: "Bradesco", brand: "elo", category: "black", color: "#18181B", color_end: "#09090B", defaultLimit: 22000 },
  { name: "Santander SX", bank: "Santander", brand: "visa", category: "traditional", color: "#EA1D25", color_end: "#850005", defaultLimit: 4000 },
  { name: "Santander Unlimited", bank: "Santander", brand: "mastercard", category: "black", color: "#1C1917", color_end: "#7F0B10", defaultLimit: 30000 },
  { name: "BB Ourocard", bank: "Banco do Brasil", brand: "visa", category: "traditional", color: "#0038A8", color_end: "#001A4D", defaultLimit: 7000 },
  { name: "Caixa Elo Nanquim", bank: "Caixa", brand: "elo", category: "traditional", color: "#005CA9", color_end: "#F37021", defaultLimit: 10000 },
  { name: "BTG Pactual Black", bank: "BTG Pactual", brand: "mastercard", category: "black", color: "#0B192C", color_end: "#1E3E62", defaultLimit: 25000 },
  { name: "Safra Visa Infinite", bank: "Banco Safra", brand: "visa", category: "black", color: "#B8860B", color_end: "#1A1A1A", defaultLimit: 35000 },

  // Internacionais & Investimentos
  { name: "XP Visa Infinite", bank: "XP Investimentos", brand: "visa", category: "black", color: "#111827", color_end: "#030712", defaultLimit: 15000 },
  { name: "Wise Multi-moeda", bank: "Wise", brand: "visa", category: "global", color: "#9FE870", color_end: "#163300", defaultLimit: 5000 },
  { name: "Nomad Global", bank: "Nomad", brand: "visa", category: "global", color: "#F5E050", color_end: "#1E1E1E", defaultLimit: 8000 },
  { name: "Amex The Platinum", bank: "American Express", brand: "amex", category: "black", color: "#94A3B8", color_end: "#334155", defaultLimit: 40000 },
  { name: "Apple Card Titanium", bank: "Apple", brand: "mastercard", category: "global", color: "#E2E8F0", color_end: "#475569", defaultLimit: 20000 }
];

const COLOR_PALETTES = [
  { name: "Nubank Purple", start: "#820AD1", end: "#4C0677" },
  { name: "Carbon Black", start: "#1F1F1F", end: "#0A0A0A" },
  { name: "Emerald Wealth", start: "#10b981", end: "#044E36" },
  { name: "Ocean Blue", start: "#0284C7", end: "#082F49" },
  { name: "Sunset Gold", start: "#FF7A00", end: "#B84800" },
  { name: "Ruby Red", start: "#EA1D25", end: "#550004" },
  { name: "Royal Gold", start: "#D97706", end: "#451A03" },
  { name: "Platinum Silver", start: "#94A3B8", end: "#1E293B" }
];

const AUTOMATION_OPTIONS = [
  {
    id: "open_finance",
    label: "Open Finance Brasil",
    desc: "Sincronização automática via autenticação por CPF",
    icon: Shield,
    badge: "Oficial BACEN"
  },
  {
    id: "push_notification",
    label: "Notificação do Celular",
    desc: "Captura instantânea do push do banco (MacroDroid / Atalhos iOS)",
    icon: Smartphone,
    badge: "Tempo Real"
  },
  {
    id: "bank_webhook",
    label: "Webhook Direto da API",
    desc: "Para contas PJ/Dev do Banco Inter, Asaas, Mercado Pago",
    icon: Link2,
    badge: "API REST"
  },
  {
    id: "manual",
    label: "Apenas Manual",
    desc: "Sem automação ou conexões externas",
    icon: CreditCard,
    badge: "Offline"
  }
];

export const AddCardModal = ({ isOpen, onClose, onSave }) => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [name, setName] = useState("");
  const [bank, setBank] = useState("Nubank");
  const [brand, setBrand] = useState("mastercard");
  const [lastFour, setLastFour] = useState("1234");
  const [color, setColor] = useState("#820AD1");
  const [colorEnd, setColorEnd] = useState("#4C0677");
  const [limitTotal, setLimitTotal] = useState("5000");
  const [closingDay, setClosingDay] = useState("25");
  const [dueDay, setDueDay] = useState("5");
  const [holderCpf, setHolderCpf] = useState("");
  const [automationType, setAutomationType] = useState("open_finance");
  const [isAutomated, setIsAutomated] = useState(true);
  const [cpfError, setCpfError] = useState("");
  const [isFlipped, setIsFlipped] = useState(false);

  // Reset fields whenever modal opens
  useEffect(() => {
    if (isOpen) {
      setName("Nubank Gold");
      setBank("Nubank");
      setBrand("mastercard");
      setLastFour("1234");
      setColor("#820AD1");
      setColorEnd("#4C0677");
      setLimitTotal("5000");
      setClosingDay("25");
      setDueDay("5");
      setHolderCpf("");
      setAutomationType("open_finance");
      setIsAutomated(true);
      setCpfError("");
      setActiveCategory("all");
      setIsFlipped(false);
    }
  }, [isOpen]);

  const handleSelectPreset = (preset) => {
    setName(preset.name);
    setBank(preset.bank);
    setBrand(preset.brand);
    setColor(preset.color);
    setColorEnd(preset.color_end);
    if (preset.defaultLimit) {
      setLimitTotal(String(preset.defaultLimit));
    }
  };

  const handleApplyPalette = (palette) => {
    setColor(palette.start);
    setColorEnd(palette.end);
  };

  const handleCpfChange = (e) => {
    const formatted = formatCPF(e.target.value);
    setHolderCpf(formatted);
    if (formatted.length === 14) {
      if (!validateCPF(formatted)) {
        setCpfError("CPF inválido. Verifique os dígitos digitados.");
      } else {
        setCpfError("");
      }
    } else {
      setCpfError("");
    }
  };

  const filteredPresets = activeCategory === "all"
    ? BANK_PRESETS
    : BANK_PRESETS.filter(p => p.category === activeCategory);

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanName = name.trim();
    if (!cleanName) return;

    if (isAutomated && automationType !== "manual" && holderCpf) {
      if (holderCpf.replace(/\D/g, "").length !== 11) {
        setCpfError("Digite os 11 números do CPF completo.");
        return;
      }
    }

    const parsedLimit = parseFloat(limitTotal) || 1000;
    const parsedClosing = Math.min(31, Math.max(1, parseInt(closingDay, 10) || 25));
    const parsedDue = Math.min(31, Math.max(1, parseInt(dueDay, 10) || 5));
    const cleanDigits = (lastFour.replace(/\D/g, "").slice(-4)) || "0000";

    onSave({
      name: cleanName,
      bank: bank.trim() || "Outro",
      brand: brand || "mastercard",
      last_four: cleanDigits,
      color: color || "#6366f1",
      color_end: colorEnd || "#1e1b4b",
      limit_total: parsedLimit,
      closing_day: parsedClosing,
      due_day: parsedDue,
      holder_cpf: holderCpf.trim() || null,
      automation_type: isAutomated ? automationType : "manual",
      is_automated: isAutomated && automationType !== "manual",
      is_active: true
    });

    onClose();
  };

  const liveGradientStyle = {
    background: `linear-gradient(135deg, ${color || "#6366f1"} 0%, ${colorEnd || "#1e1b4b"} 100%)`
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Novo Cartão de Crédito" maxWidth="820px">
      <form onSubmit={handleSubmit}>
        <div className="modal-body" style={{ gap: 20 }}>
          {/* Top Section: Live 3D Interactive Card Preview */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(280px, 340px) 1fr",
              gap: 20,
              alignItems: "center"
            }}
            className="add-card-preview-grid"
          >
            {/* 3D Flippable Virtual Card */}
            <div
              className={`virtual-card-3d-container ${isFlipped ? "is-flipped" : ""}`}
              onClick={() => setIsFlipped(!isFlipped)}
              title="Clique no cartão para girar e ver o verso"
              style={{ height: 190, margin: 0 }}
            >
              {/* Card Front Face */}
              <div className="virtual-card-face" style={liveGradientStyle}>
                <div className="card-shimmer"></div>

                <div className="card-top">
                  <span className="card-bank-name" style={{ fontSize: "1rem" }}>{bank || name || "Meu Banco"}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span className="card-brand-logo" style={{ fontSize: "0.85rem", padding: "2px 8px" }}>
                      {brand?.toUpperCase()}
                    </span>
                    <RotateCw size={13} style={{ opacity: 0.6 }} />
                  </div>
                </div>

                <div className="card-middle" style={{ margin: "2px 0" }}>
                  <div className="card-chip" style={{ width: 34, height: 26 }}></div>
                  <Wifi size={16} className="card-contactless" />
                </div>

                <div className="card-number" style={{ fontSize: "0.95rem", letterSpacing: 2 }}>
                  •••• •••• •••• {lastFour || "1234"}
                </div>

                <div className="card-bottom">
                  <div className="card-info-group">
                    <span className="card-info-label" style={{ fontSize: "0.6rem" }}>Nome do Cartão</span>
                    <span className="card-info-val" style={{ fontSize: "0.8rem", maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {name || "Cartão de Crédito"}
                    </span>
                  </div>

                  <div className="card-info-group" style={{ textAlign: "right" }}>
                    <span className="card-info-label" style={{ fontSize: "0.6rem" }}>Fecha / Vence</span>
                    <span className="card-info-val" style={{ fontSize: "0.8rem" }}>
                      Dia {closingDay} / {dueDay}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Back Face */}
              <div className="virtual-card-face virtual-card-back" style={liveGradientStyle}>
                <div className="card-mag-stripe" style={{ height: 32 }}></div>
                <div>
                  <div style={{ fontSize: "0.6rem", padding: "0 20px 2px 20px", opacity: 0.8, textTransform: "uppercase" }}>
                    CVV
                  </div>
                  <div className="card-cvv-box" style={{ margin: "0 20px", padding: "4px 12px", fontSize: "0.85rem" }}>
                    984
                  </div>
                </div>
                <div style={{ padding: "0 20px", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.7rem", opacity: 0.8 }}>
                  <span>Internacional</span>
                  <RotateCw size={12} />
                </div>
              </div>
            </div>

            {/* Quick Color Palettes & Summary */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                  <Palette size={15} color="var(--accent-primary)" />
                  <span>Paletas de Cores Exclusivas</span>
                </span>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {COLOR_PALETTES.map((pal, idx) => {
                    const isSelected = color === pal.start && colorEnd === pal.end;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleApplyPalette(pal)}
                        title={pal.name}
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: "50%",
                          background: `linear-gradient(135deg, ${pal.start}, ${pal.end})`,
                          border: isSelected ? "2px solid #ffffff" : "1px solid rgba(255,255,255,0.2)",
                          boxShadow: isSelected ? "0 0 10px rgba(255,255,255,0.6)" : "none",
                          cursor: "pointer",
                          transition: "transform 0.15s ease",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
                        }}
                      >
                        {isSelected && <Check size={14} color="#fff" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div
                style={{
                  background: "var(--bg-subtle)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "var(--radius-md)",
                  padding: "10px 14px",
                  fontSize: "0.8rem",
                  color: "var(--text-secondary)",
                  display: "flex",
                  alignItems: "center",
                  gap: 8
                }}
              >
                <Sparkles size={16} color="var(--accent-primary)" style={{ flexShrink: 0 }} />
                <span>
                  Limite configurado: <strong style={{ color: "var(--text-primary)" }}>{formatCurrency(parseFloat(limitTotal) || 0)}</strong>.
                </span>
              </div>
            </div>
          </div>

          {/* Preset Banks Section with Filter Tabs */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
              <label className="form-label" style={{ marginBottom: 0 }}>
                Catálogo de Cartões e Bancos Populares ({filteredPresets.length})
              </label>

              {/* Category Filter Pills */}
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                {PRESET_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setActiveCategory(cat.id)}
                    style={{
                      padding: "4px 10px",
                      borderRadius: "var(--radius-full)",
                      border: activeCategory === cat.id ? "1px solid var(--accent-primary)" : "1px solid var(--border-color)",
                      background: activeCategory === cat.id ? "var(--accent-glow)" : "var(--bg-input)",
                      color: activeCategory === cat.id ? "var(--accent-primary)" : "var(--text-muted)",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "all 0.15s ease"
                    }}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Presets Grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
                gap: 8,
                maxHeight: 140,
                overflowY: "auto",
                paddingRight: 4
              }}
            >
              {filteredPresets.map((preset, idx) => {
                const isSelected = name === preset.name && bank === preset.bank;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    style={{
                      padding: "8px 10px",
                      borderRadius: "var(--radius-md)",
                      border: isSelected ? `2px solid ${preset.color}` : "1px solid var(--border-color)",
                      background: isSelected ? `${preset.color}25` : "var(--bg-input)",
                      color: isSelected ? "#ffffff" : "var(--text-secondary)",
                      fontSize: "0.78rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      textAlign: "left",
                      transition: "all 0.15s ease"
                    }}
                  >
                    <span
                      style={{
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        background: `linear-gradient(135deg, ${preset.color}, ${preset.color_end})`,
                        flexShrink: 0
                      }}
                    />
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {preset.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form Fields: Inputs */}
          <div className="form-group">
            <label className="form-label">Nome de Identificação do Cartão</label>
            <input
              type="text"
              className="form-input"
              placeholder="Ex: Nubank Ultravioleta, Inter Black"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* ========================================================= */}
          {/* SECTION: AUTOMAÇÃO BANCÁRIA & CPF DO TITULAR              */}
          {/* ========================================================= */}
          <div
            style={{
              background: "linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(139, 92, 246, 0.04) 100%)",
              border: "1px solid rgba(99, 102, 241, 0.3)",
              borderRadius: "var(--radius-lg)",
              padding: "16px 18px",
              display: "flex",
              flexDirection: "column",
              gap: 14
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--accent-primary)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
                  <Zap size={16} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--text-primary)", display: "flex", alignItems: "center", gap: 6 }}>
                    <span>Automação & Sincronização em Tempo Real</span>
                    <span style={{ fontSize: "0.7rem", background: "var(--accent-primary)", color: "#fff", padding: "2px 8px", borderRadius: "12px", fontWeight: 700 }}>
                      Instantâneo
                    </span>
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                    Receba notificações e lance compras diretamente ao passar o cartão no banco.
                  </div>
                </div>
              </div>

              {/* Toggle Switch */}
              <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", userSelect: "none" }}>
                <input
                  type="checkbox"
                  checked={isAutomated}
                  onChange={(e) => setIsAutomated(e.target.checked)}
                  style={{ width: 18, height: 18, accentColor: "var(--accent-primary)", cursor: "pointer" }}
                />
                <span style={{ fontSize: "0.85rem", fontWeight: 600, color: isAutomated ? "var(--accent-primary)" : "var(--text-muted)" }}>
                  {isAutomated ? "Automação Ativa" : "Desativada"}
                </span>
              </label>
            </div>

            {isAutomated && (
              <>
                {/* Automation Type Selector */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 8 }}>
                  {AUTOMATION_OPTIONS.filter(o => o.id !== "manual").map((opt) => {
                    const isOptSelected = automationType === opt.id;
                    const IconComp = opt.icon;
                    return (
                      <div
                        key={opt.id}
                        onClick={() => setAutomationType(opt.id)}
                        style={{
                          padding: "10px 12px",
                          borderRadius: "var(--radius-md)",
                          border: isOptSelected ? "2px solid var(--accent-primary)" : "1px solid var(--border-color)",
                          background: isOptSelected ? "var(--accent-glow)" : "var(--bg-subtle)",
                          cursor: "pointer",
                          transition: "all 0.15s ease",
                          display: "flex",
                          flexDirection: "column",
                          gap: 4
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 700, fontSize: "0.82rem", color: isOptSelected ? "var(--accent-primary)" : "var(--text-primary)" }}>
                            <IconComp size={15} />
                            <span>{opt.label}</span>
                          </div>
                          <span style={{ fontSize: "0.65rem", padding: "1px 6px", borderRadius: 4, background: isOptSelected ? "var(--accent-primary)" : "var(--border-color)", color: "#fff", fontWeight: 600 }}>
                            {opt.badge}
                          </span>
                        </div>
                        <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", lineHeight: 1.2 }}>
                          {opt.desc}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* CPF Input Section */}
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <Lock size={14} color="var(--accent-primary)" />
                      <span>CPF do Titular do Cartão / Conta</span>
                    </span>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                      Obrigatório para autenticação segura
                    </span>
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="000.000.000-00"
                    maxLength="14"
                    value={holderCpf}
                    onChange={handleCpfChange}
                    required={isAutomated}
                    style={{
                      borderColor: cpfError ? "var(--color-danger)" : undefined,
                      letterSpacing: "1px",
                      fontWeight: 600
                    }}
                  />
                  {cpfError ? (
                    <div style={{ fontSize: "0.75rem", color: "var(--color-danger)", marginTop: 4 }}>
                      ⚠️ {cpfError}
                    </div>
                  ) : (
                    <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: 4, display: "flex", alignItems: "center", gap: 6 }}>
                      <Shield size={13} color="#10b981" />
                      <span>Seu CPF é protegido e usado exclusivamente para vincular as compras aprovadas neste banco ({bank || "Banco"}).</span>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">Instituição / Banco</label>
              <input
                type="text"
                className="form-input"
                value={bank}
                onChange={(e) => setBank(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Bandeira</label>
              <select
                className="form-select"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              >
                <option value="mastercard">Mastercard</option>
                <option value="visa">Visa</option>
                <option value="elo">Elo</option>
                <option value="amex">American Express</option>
                <option value="hipercard">Hipercard</option>
                <option value="diners">Diners Club</option>
              </select>
            </div>
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">Limite Total (R$)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                className="form-input"
                value={limitTotal}
                onChange={(e) => setLimitTotal(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Últimos 4 Dígitos</label>
              <input
                type="text"
                maxLength="4"
                className="form-input"
                placeholder="1234"
                value={lastFour}
                onChange={(e) => setLastFour(e.target.value.replace(/\D/g, ""))}
                required
              />
            </div>
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">Dia de Fechamento da Fatura</label>
              <input
                type="number"
                min="1"
                max="31"
                className="form-input"
                value={closingDay}
                onChange={(e) => setClosingDay(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Dia de Vencimento da Fatura</label>
              <input
                type="number"
                min="1"
                max="31"
                className="form-input"
                value={dueDay}
                onChange={(e) => setDueDay(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Color Customizer */}
          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">Cor Inicial (Gradiente)</label>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  style={{ width: 44, height: 40, border: "none", borderRadius: 8, cursor: "pointer", background: "none" }}
                />
                <input
                  type="text"
                  className="form-input"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Cor Final (Gradiente)</label>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input
                  type="color"
                  value={colorEnd}
                  onChange={(e) => setColorEnd(e.target.value)}
                  style={{ width: 44, height: 40, border: "none", borderRadius: 8, cursor: "pointer", background: "none" }}
                />
                <input
                  type="text"
                  className="form-input"
                  value={colorEnd}
                  onChange={(e) => setColorEnd(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancelar
          </button>
          <button type="submit" className="btn btn-primary">
            <CreditCard size={16} />
            <span>Cadastrar Cartão</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
