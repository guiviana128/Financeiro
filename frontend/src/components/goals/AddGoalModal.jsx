import React, { useState } from "react";
import {
  ShieldCheck,
  Plane,
  Car,
  Home,
  Laptop,
  GraduationCap,
  Heart,
  MoreHorizontal,
  Star,
  DollarSign,
  Coins,
  Calendar,
  Check,
  Target
} from "lucide-react";
import { formatCurrency } from "../../utils/formatters";

const GOAL_TYPES = [
  { id: "Reserva", label: "Reserva", icon: ShieldCheck },
  { id: "Viagem", label: "Viagem", icon: Plane },
  { id: "Carro", label: "Carro", icon: Car },
  { id: "Imóvel", label: "Imóvel", icon: Home },
  { id: "Tech", label: "Tech", icon: Laptop },
  { id: "Educação", label: "Educação", icon: GraduationCap },
  { id: "Saúde", label: "Saúde", icon: Heart },
  { id: "Geral", label: "Geral", icon: MoreHorizontal }
];

const GOAL_COLORS = [
  "#0d9488", // Teal
  "#3b82f6", // Blue
  "#f59e0b", // Orange
  "#ec4899", // Pink
  "#06b6d4", // Cyan
  "#8b5cf6", // Purple
  "#ef4444"  // Red
];

export const AddGoalModal = ({ isOpen, onClose, onSave }) => {
  const [title, setTitle] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [currentAmount, setCurrentAmount] = useState("");
  const [targetDate, setTargetDate] = useState("2026-09-28");
  const [selectedType, setSelectedType] = useState("Geral");
  const [color, setColor] = useState("#0d9488");

  const parsedTarget = parseFloat(targetAmount) || 0;
  const parsedCurrent = parseFloat(currentAmount) || 0;
  const progressPct = parsedTarget > 0 ? Math.min(100, (parsedCurrent / parsedTarget) * 100) : 0;

  const currentTypeObj = GOAL_TYPES.find(t => t.id === selectedType) || GOAL_TYPES[7];
  const IconComponent = currentTypeObj.icon || Target;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !targetAmount) return;

    onSave({
      title: title.trim(),
      target_amount: parsedTarget,
      current_amount: parsedCurrent,
      target_date: targetDate || null,
      category_icon: selectedType === "Geral" ? "Target" : selectedType,
      color
    });

    // Reset
    setTitle("");
    setTargetAmount("");
    setCurrentAmount("");
    setTargetDate("2026-09-28");
    setSelectedType("Geral");
    setColor("#0d9488");
    onClose();
  };

  const handleSetToday = () => {
    const today = new Date().toISOString().split("T")[0];
    setTargetDate(today);
  };

  const formatDisplayDate = (dateStr) => {
    if (!dateStr) return "Não definida";
    try {
      const parts = dateStr.split("-");
      if (parts.length === 3) {
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="fin-modal-card"
        style={{ maxWidth: 860 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header matching Image 4 */}
        <div className="fin-modal-header">
          <div className="fin-header-text">
            <h2>Nova Meta</h2>
            <p>Defina seu objetivo e comece a construir o seu futuro.</p>
          </div>
          <button type="button" className="cat-modal-close-btn" onClick={onClose} title="Fechar">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="fin-modal-two-col" style={{ gap: 28 }}>
            {/* Left Column: Form Fields */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {/* Field 1: Título da meta */}
              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 700, color: "#1e293b" }}>
                  Título da meta
                </label>
                <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                  <Star size={16} style={{ position: "absolute", left: 12, color: "#94a3b8", pointerEvents: "none" }} />
                  <input
                    type="text"
                    className="form-input"
                    style={{ paddingLeft: 38 }}
                    placeholder="Ex: Reserva de Emergência, Férias na Praia, Troca de Notebook"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Row 2: Valor alvo & Já poupado inicialmente */}
              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 700, color: "#1e293b" }}>
                    Valor alvo (R$)
                  </label>
                  <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                    <DollarSign size={16} style={{ position: "absolute", left: 12, color: "#94a3b8", pointerEvents: "none" }} />
                    <input
                      type="number"
                      step="0.01"
                      min="1"
                      placeholder="Ex: 10.000,00"
                      className="form-input"
                      style={{ paddingLeft: 38, fontWeight: 700 }}
                      value={targetAmount}
                      onChange={(e) => setTargetAmount(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 700, color: "#1e293b" }}>
                    Já poupado inicialmente (R$)
                  </label>
                  <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                    <Coins size={16} style={{ position: "absolute", left: 12, color: "#94a3b8", pointerEvents: "none" }} />
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0,00"
                      className="form-input"
                      style={{ paddingLeft: 38, fontWeight: 700 }}
                      value={currentAmount}
                      onChange={(e) => setCurrentAmount(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Field 3: Data limite desejada */}
              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 700, color: "#1e293b" }}>
                  Data limite desejada (opcional)
                </label>
                <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                  <Calendar size={16} style={{ position: "absolute", left: 12, color: "#0d9488", pointerEvents: "none" }} />
                  <input
                    type="date"
                    className="form-input"
                    style={{ paddingLeft: 38, paddingRight: 64, fontWeight: 600 }}
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={handleSetToday}
                    style={{
                      position: "absolute",
                      right: 8,
                      background: "#ccfbf1",
                      border: "none",
                      color: "#0f766e",
                      fontSize: "0.74rem",
                      fontWeight: 700,
                      padding: "4px 8px",
                      borderRadius: 6,
                      cursor: "pointer"
                    }}
                  >
                    Hoje
                  </button>
                </div>
              </div>

              {/* Field 4: Tipo de meta (Grid 4x2) */}
              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 700, color: "#1e293b" }}>
                  Tipo de meta
                </label>
                <div className="fin-goal-types-grid">
                  {GOAL_TYPES.map((t) => {
                    const isSelected = selectedType === t.id;
                    const TIcon = t.icon;
                    return (
                      <div
                        key={t.id}
                        className={`fin-goal-type-card ${isSelected ? "selected" : ""}`}
                        onClick={() => setSelectedType(t.id)}
                      >
                        <TIcon size={20} color={isSelected ? color : "#64748b"} />
                        <span>{t.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Field 5: Cor de destaque */}
              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 700, color: "#1e293b" }}>
                  Cor de destaque
                </label>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 4 }}>
                  {GOAL_COLORS.map((c) => {
                    const isSelected = color === c;
                    return (
                      <div
                        key={c}
                        onClick={() => setColor(c)}
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: "50%",
                          background: c,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          border: isSelected ? "2.5px solid #ffffff" : "none",
                          boxShadow: isSelected ? `0 0 0 2px ${c}, 0 2px 6px rgba(0,0,0,0.2)` : "none",
                          transition: "all 0.15s ease"
                        }}
                      >
                        {isSelected && <Check size={14} color="#ffffff" strokeWidth={3} />}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column: Prévia da sua meta */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <div className="fin-section-subtitle">Prévia da sua meta</div>
                <div className="fin-section-desc">Veja como sua meta ficará.</div>
              </div>

              {/* Live Goal Card Preview matching Image 4 */}
              <div className="fin-goal-preview-card">
                {/* Header with Circle Icon */}
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 14,
                      background: `${color}18`,
                      color: color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    <IconComponent size={24} />
                  </div>
                  <div>
                    <div style={{ fontSize: "1rem", fontWeight: 800, color: "#0f172a" }}>
                      {title.trim() || "Nome da meta"}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "#64748b" }}>
                      {selectedType}
                    </div>
                  </div>
                </div>

                {/* Values & Progress */}
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                    <span style={{ fontSize: "1.2rem", fontWeight: 800, color: "#0f172a" }}>
                      {formatCurrency(parsedCurrent)}
                    </span>
                    <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#64748b" }}>
                      {formatCurrency(parsedTarget)}
                    </span>
                  </div>

                  {/* Progress track */}
                  <div style={{ width: "100%", height: 8, background: "#e2e8f0", borderRadius: 4, overflow: "hidden" }}>
                    <div
                      style={{
                        height: "100%",
                        width: `${progressPct}%`,
                        background: color,
                        borderRadius: 4,
                        transition: "width 0.3s ease"
                      }}
                    />
                  </div>

                  <div style={{ textAlign: "right", fontSize: "0.75rem", fontWeight: 700, color: "#64748b" }}>
                    {progressPct.toFixed(0)}%
                  </div>
                </div>

                {/* Breakdown List */}
                <div style={{ display: "flex", flexDirection: "column", gap: 12, paddingTop: 6, borderTop: "1px solid #e2e8f0" }}>
                  {/* Row: Valor alvo */}
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b" }}>
                      <Target size={15} />
                    </div>
                    <div>
                      <div style={{ fontSize: "0.7rem", color: "#64748b" }}>Valor alvo</div>
                      <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#0f172a" }}>
                        {formatCurrency(parsedTarget)}
                      </div>
                    </div>
                  </div>

                  {/* Row: Já poupado */}
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b" }}>
                      <Coins size={15} />
                    </div>
                    <div>
                      <div style={{ fontSize: "0.7rem", color: "#64748b" }}>Já poupado</div>
                      <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#0f172a" }}>
                        {formatCurrency(parsedCurrent)}
                      </div>
                    </div>
                  </div>

                  {/* Row: Data limite */}
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b" }}>
                      <Calendar size={15} />
                    </div>
                    <div>
                      <div style={{ fontSize: "0.7rem", color: "#64748b" }}>Data limite</div>
                      <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#0f172a" }}>
                        {formatDisplayDate(targetDate)}
                      </div>
                    </div>
                  </div>
                </div>
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
              style={{ borderRadius: 10, padding: "10px 24px", background: "#0d9488", display: "flex", alignItems: "center", gap: 6 }}
            >
              <Check size={16} />
              <span>Criar meta</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
