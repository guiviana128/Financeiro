import React, { useState, useEffect } from "react";
import { Modal } from "../common/Modal";
import { CreditCard, Wifi, Shield, Zap, Mail, Info, Plus, Check, Landmark } from "lucide-react";
import { formatCurrency } from "../../utils/formatters";

const COLOR_PALETTES = [
  { id: "purple", name: "Nubank Roxo", start: "#820AD1", end: "#4C0677" },
  { id: "black", name: "Carbon Black", start: "#1E293B", end: "#0F172A" },
  { id: "teal", name: "Emerald Teal", start: "#0D9488", end: "#044E36" },
  { id: "blue", name: "Ocean Blue", start: "#0284C7", end: "#082F49" },
  { id: "orange", name: "Sunset Orange", start: "#EA580C", end: "#9A3412" },
  { id: "red", name: "Ruby Red", start: "#DC2626", end: "#7F1D1D" },
  { id: "bronze", name: "Bronze Gold", start: "#92400E", end: "#451A03" },
  { id: "slate", name: "Slate Steel", start: "#64748B", end: "#334155" },
];

const BANK_OPTIONS = [
  { name: "Nubank", defaultColor: "#820AD1", defaultColorEnd: "#4C0677" },
  { name: "Itaú", defaultColor: "#EC7000", defaultColorEnd: "#003399" },
  { name: "Bradesco", defaultColor: "#CC092F", defaultColorEnd: "#700015" },
  { name: "Santander", defaultColor: "#EA1D25", defaultColorEnd: "#850005" },
  { name: "Inter", defaultColor: "#FF7A00", defaultColorEnd: "#B84800" },
  { name: "C6 Bank", defaultColor: "#242424", defaultColorEnd: "#121212" },
  { name: "Banco do Brasil", defaultColor: "#0038A8", defaultColorEnd: "#001A4D" },
  { name: "Caixa", defaultColor: "#005CA9", defaultColorEnd: "#F37021" },
  { name: "BTG Pactual", defaultColor: "#0B192C", defaultColorEnd: "#1E3E62" },
  { name: "XP Investimentos", defaultColor: "#111827", defaultColorEnd: "#030712" },
  { name: "Wise", defaultColor: "#9FE870", defaultColorEnd: "#163300" },
  { name: "Nomad", defaultColor: "#F5E050", defaultColorEnd: "#1E1E1E" },
  { name: "Outro", defaultColor: "#0D9488", defaultColorEnd: "#044E36" }
];

export const AddCardModal = ({ isOpen, onClose, onSave }) => {
  const [name, setName] = useState("Nubank Gold");
  const [bank, setBank] = useState("Nubank");
  const [brand, setBrand] = useState("mastercard");
  const [limitTotal, setLimitTotal] = useState("5000");
  const [lastFour, setLastFour] = useState("1234");
  const [closingDay, setClosingDay] = useState("25");
  const [dueDay, setDueDay] = useState("5");
  const [selectedColor, setSelectedColor] = useState(COLOR_PALETTES[0]);
  const [mobileNotifications, setMobileNotifications] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setName("Nubank Gold");
      setBank("Nubank");
      setBrand("mastercard");
      setLimitTotal("5000");
      setLastFour("1234");
      setClosingDay("25");
      setDueDay("5");
      setSelectedColor(COLOR_PALETTES[0]);
      setMobileNotifications(true);
    }
  }, [isOpen]);

  const handleBankChange = (e) => {
    const selectedBankName = e.target.value;
    setBank(selectedBankName);
    const bankConfig = BANK_OPTIONS.find(b => b.name === selectedBankName);
    if (bankConfig) {
      const matchedPalette = COLOR_PALETTES.find(p => p.start.toLowerCase() === bankConfig.defaultColor.toLowerCase()) || {
        id: "custom",
        name: selectedBankName,
        start: bankConfig.defaultColor,
        end: bankConfig.defaultColorEnd
      };
      setSelectedColor(matchedPalette);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanName = name.trim();
    if (!cleanName) return;

    const parsedLimit = parseFloat(limitTotal) || 5000;
    const parsedClosing = Math.min(31, Math.max(1, parseInt(closingDay, 10) || 25));
    const parsedDue = Math.min(31, Math.max(1, parseInt(dueDay, 10) || 5));
    const cleanDigits = (lastFour.replace(/\D/g, "").slice(-4)) || "1234";

    onSave({
      name: cleanName,
      bank: bank.trim() || "Nubank",
      brand: brand || "mastercard",
      last_four: cleanDigits,
      last_digits: cleanDigits,
      color: selectedColor.start,
      color_end: selectedColor.end,
      limit_total: parsedLimit,
      closing_day: parsedClosing,
      due_day: parsedDue,
      mobile_notifications: mobileNotifications,
      is_active: true
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="fin-modal-card"
        style={{ maxWidth: 960 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header matching Image 1 */}
        <div className="fin-modal-header">
          <div className="fin-modal-header-left">
            <div className="fin-header-icon-circle">
              <CreditCard size={22} />
            </div>
            <div className="fin-header-text">
              <h2>Adicionar cartão</h2>
              <p>Cadastre um novo cartão de crédito para acompanhar seus gastos no FinFlow Pro.</p>
            </div>
          </div>
          <button type="button" className="cat-modal-close-btn" onClick={onClose} title="Fechar">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* 2-Column Content Layout */}
          <div className="fin-modal-two-col">
            {/* Left Column: Prévia do cartão */}
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <div>
                <div className="fin-section-subtitle">Prévia do cartão</div>
                <div className="fin-section-desc">Veja como seu cartão ficará no FinFlow Pro.</div>
              </div>

              {/* Realistic Credit Card Visual */}
              <div
                className="fin-card-preview-box"
                style={{
                  background: `linear-gradient(135deg, ${selectedColor.start} 0%, ${selectedColor.end} 100%)`
                }}
              >
                {/* Top Row: Bank Name, Brand Subtitle & Wifi */}
                <div className="fin-card-top-row">
                  <div className="fin-card-bank-info">
                    <span className="fin-card-bank-name">{bank || "Nubank"}</span>
                    <span className="fin-card-brand-sub">{(brand || "mastercard").toUpperCase()}</span>
                  </div>
                  <Wifi size={20} style={{ transform: "rotate(90deg)", opacity: 0.9 }} />
                </div>

                {/* Middle: Digits & Card Name */}
                <div>
                  <div className="fin-card-number-row">
                    <span>••••</span>
                    <span>••••</span>
                    <span>••••</span>
                    <span>{lastFour || "1234"}</span>
                  </div>
                  <div className="fin-card-holder-name" style={{ marginTop: 6 }}>
                    {name || "Nubank Gold"}
                  </div>
                </div>

                {/* Bottom: Limite, Validade and Logo */}
                <div className="fin-card-bottom-row">
                  <div className="fin-card-val-col">
                    <span className="fin-card-val-label">LIMITE</span>
                    <span className="fin-card-val-text">
                      {formatCurrency(parseFloat(limitTotal) || 0)}
                    </span>
                  </div>

                  <div className="fin-card-val-col">
                    <span className="fin-card-val-label">VALIDADE</span>
                    <span className="fin-card-val-text">
                      {String(closingDay).padStart(2, "0")}/{String(dueDay).padStart(2, "0")}
                    </span>
                  </div>

                  {/* Mastercard or Visa Brand Logo */}
                  {brand === "visa" ? (
                    <span style={{ fontSize: "1.2rem", fontWeight: 900, fontStyle: "italic", letterSpacing: "1px" }}>
                      VISA
                    </span>
                  ) : (
                    <div className="fin-mastercard-badge">
                      <div className="fin-mc-red" />
                      <div className="fin-mc-orange" />
                    </div>
                  )}
                </div>
              </div>

              {/* Color Palette Selector */}
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.85rem", fontWeight: 700, color: "var(--text-primary)" }}>
                  <span style={{ fontSize: "1rem" }}>🎨</span>
                  <span>Paleta de cores do cartão</span>
                </div>

                <div className="fin-color-swatches-grid">
                  {COLOR_PALETTES.map((pal) => {
                    const isSelected = selectedColor.id === pal.id || (selectedColor.start === pal.start && selectedColor.end === pal.end);
                    return (
                      <div
                        key={pal.id}
                        className={`fin-swatch-circle ${isSelected ? "selected" : ""}`}
                        style={{
                          background: `linear-gradient(135deg, ${pal.start}, ${pal.end})`
                        }}
                        onClick={() => setSelectedColor(pal)}
                        title={pal.name}
                      >
                        {isSelected && <Check size={16} color="#ffffff" strokeWidth={3} />}
                      </div>
                    );
                  })}
                </div>

                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 8, display: "flex", alignItems: "center", gap: 4 }}>
                  <span>ⓘ Essa cor será usada para identificar o cartão na sua lista.</span>
                </div>
              </div>

              {/* Security Banner */}
              <div className="fin-alert-box">
                <div className="fin-alert-icon-wrap">
                  <Shield size={18} />
                </div>
                <div>
                  <div className="fin-alert-title">Seus dados, sempre protegidos</div>
                  <div className="fin-alert-desc">
                    As informações adicionadas são usadas apenas para organizar seus cartões no FinFlow Pro e ficam armazenadas com segurança.
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Informações do cartão */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <div className="fin-section-subtitle">Informações do cartão</div>
                <div className="fin-section-desc">Preencha os dados do seu cartão de crédito.</div>
              </div>

              {/* Row 1: Nome do cartão & Instituição / Banco */}
              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Nome do cartão</label>
                  <input
                    type="text"
                    className="form-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nubank Gold"
                    required
                  />
                  <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                    Ex.: Nubank Gold, Cartão Pessoal, VIAGEM, etc.
                  </span>
                </div>

                <div className="form-group">
                  <label className="form-label">Instituição / Banco</label>
                  <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                    <Landmark size={16} style={{ position: "absolute", left: 12, color: "#64748b", pointerEvents: "none" }} />
                    <select
                      className="form-select"
                      style={{ paddingLeft: 36 }}
                      value={bank}
                      onChange={handleBankChange}
                      required
                    >
                      {BANK_OPTIONS.map((b) => (
                        <option key={b.name} value={b.name}>
                          {b.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Row 2: Bandeira & Limite Total */}
              <div className="form-row-2">
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
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Limite total (R$)</label>
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
              </div>

              {/* Row 3: Últimos 4 dígitos, Dia de fechamento & Dia de vencimento */}
              <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr", gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">Últimos 4 dígitos</label>
                  <input
                    type="text"
                    maxLength={4}
                    className="form-input"
                    value={lastFour}
                    onChange={(e) => setLastFour(e.target.value.replace(/\D/g, ""))}
                    placeholder="1234"
                    required
                  />
                  <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
                    Apenas os 4 últimos dígitos.
                  </span>
                </div>

                <div className="form-group">
                  <label className="form-label">Fechamento</label>
                  <input
                    type="number"
                    min={1}
                    max={31}
                    className="form-input"
                    value={closingDay}
                    onChange={(e) => setClosingDay(e.target.value)}
                    placeholder="25"
                    required
                  />
                  <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
                    Dia do mês (ex.: 25).
                  </span>
                </div>

                <div className="form-group">
                  <label className="form-label">Vencimento</label>
                  <input
                    type="number"
                    min={1}
                    max={31}
                    className="form-input"
                    value={dueDay}
                    onChange={(e) => setDueDay(e.target.value)}
                    placeholder="5"
                    required
                  />
                  <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
                    Dia do mês (ex.: 5).
                  </span>
                </div>
              </div>

              {/* Automação e sincronização (opcional) */}
              <div
                style={{
                  background: "var(--bg-subtle, #f8fafc)",
                  border: "1px solid var(--border-color, #e2e8f0)",
                  borderRadius: 14,
                  padding: 16,
                  display: "flex",
                  flexDirection: "column",
                  gap: 12
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#0d9488", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Zap size={15} />
                  </div>
                  <div>
                    <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-primary)" }}>
                      Automação e sincronização (opcional)
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                      Receba notificações e lembretes sobre as compras deste cartão.
                    </div>
                  </div>
                </div>

                {/* Option 1: Notificações do celular */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    background: "#ffffff",
                    border: "1px solid #e2e8f0",
                    borderRadius: 10,
                    padding: "10px 14px"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <Mail size={18} color="#0d9488" />
                    <div>
                      <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#1e293b" }}>
                        Notificações do celular
                      </div>
                      <div style={{ fontSize: "0.74rem", color: "#64748b" }}>
                        Receba alertas de compras e vencimento da fatura.
                      </div>
                    </div>
                  </div>

                  <label className="fin-switch-toggle">
                    <input
                      type="checkbox"
                      checked={mobileNotifications}
                      onChange={(e) => setMobileNotifications(e.target.checked)}
                    />
                    <span className="fin-switch-slider" />
                  </label>
                </div>

                {/* Option 2: Sincronização com o banco */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 10,
                    background: "rgba(241, 245, 249, 0.8)",
                    border: "1px solid #e2e8f0",
                    borderRadius: 10,
                    padding: "10px 14px"
                  }}
                >
                  <Info size={17} color="#64748b" style={{ flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#475569" }}>
                      Sincronização com o banco
                    </div>
                    <div style={{ fontSize: "0.73rem", color: "#64748b", lineHeight: 1.3 }}>
                      Funcionalidade não disponível no momento. Cadastre manualmente seus cartões para acompanhar seus gastos no FinFlow Pro.
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 12, marginTop: 8 }}>
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
                  <Plus size={16} />
                  <span>Adicionar cartão</span>
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
