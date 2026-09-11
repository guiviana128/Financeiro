import React, { useState } from "react";
import { Modal } from "../common/Modal";
import { useFinance } from "../../context/FinanceContext";
import { Icon } from "../common/Icon";
import { Plus, Tag } from "lucide-react";

const AVAILABLE_ICONS = [
  "Home", "ShoppingCart", "Car", "HeartPulse", "Utensils", "ShoppingBag",
  "Tv", "Plane", "TrendingUp", "ShieldCheck", "Briefcase", "Coins", "Laptop",
  "Coffee", "Smartphone", "BookOpen", "Fuel", "Gift", "Music", "Dumbbell"
];

const AVAILABLE_COLORS = [
  "#6366f1", "#f59e0b", "#3b82f6", "#ef4444", "#ec4899",
  "#14b8a6", "#06b6d4", "#f97316", "#10b981", "#8b5cf6",
  "#e11d48", "#84cc16", "#d946ef", "#0284c7"
];

export const CategoriesModal = ({ isOpen, onClose }) => {
  const { categories, createCategory } = useFinance();

  const [name, setName] = useState("");
  const [type, setType] = useState("expense"); // expense | income
  const [budgetType, setBudgetType] = useState("needs"); // needs | wants | savings
  const [selectedIcon, setSelectedIcon] = useState("Tag");
  const [selectedColor, setSelectedColor] = useState("#6366f1");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    createCategory({
      name,
      type,
      budget_type: type === "expense" ? budgetType : "needs",
      icon: selectedIcon,
      color: selectedColor,
      is_custom: true
    });

    setName("");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Gerenciador de Categorias" maxWidth="620px">
      <div className="modal-body">
        {/* Existing categories list */}
        <div>
          <label className="form-label">Categorias Ativas ({categories.length})</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, maxHeight: 180, overflowY: "auto", padding: "8px 0" }}>
            {categories.map((c) => (
              <span
                key={c.id}
                className="badge"
                style={{
                  background: `${c.color}20`,
                  color: c.color,
                  border: `1px solid ${c.color}40`,
                  padding: "6px 10px",
                  fontSize: "0.8rem"
                }}
              >
                <Icon name={c.icon} size={14} color={c.color} />
                <span>{c.name}</span>
              </span>
            ))}
          </div>
        </div>

        <hr style={{ borderColor: "var(--border-color)", margin: "4px 0" }} />

        {/* Add New Category Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <h4 style={{ fontSize: "0.95rem", fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>
            <Plus size={16} color="var(--accent-primary)" />
            <span>Criar Nova Categoria</span>
          </h4>

          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">Nome da Categoria</label>
              <input
                type="text"
                className="form-input"
                placeholder="Ex: Pet Shop, Cafeteria, Livros"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Tipo de Movimentação</label>
              <select
                className="form-select"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="expense">Despesa (Gasto)</option>
                <option value="income">Receita (Ganho)</option>
              </select>
            </div>
          </div>

          {type === "expense" && (
            <div className="form-group">
              <label className="form-label">Classificação Orçamentária (Regra 50/30/20)</label>
              <select
                className="form-select"
                value={budgetType}
                onChange={(e) => setBudgetType(e.target.value)}
              >
                <option value="needs">Necessidades Básicas (50% - Essencial)</option>
                <option value="wants">Desejos & Estilo de Vida (30% - Lazer)</option>
                <option value="savings">Metas & Poupança (20% - Futuro)</option>
              </select>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Ícone</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, maxHeight: 110, overflowY: "auto" }}>
              {AVAILABLE_ICONS.map((iconName) => (
                <button
                  key={iconName}
                  type="button"
                  onClick={() => setSelectedIcon(iconName)}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "var(--radius-sm)",
                    border: selectedIcon === iconName ? `2px solid ${selectedColor}` : "1px solid var(--border-color)",
                    background: selectedIcon === iconName ? `${selectedColor}25` : "var(--bg-input)",
                    color: selectedColor,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer"
                  }}
                >
                  <Icon name={iconName} size={18} color={selectedColor} />
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Cor</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {AVAILABLE_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setSelectedColor(c)}
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    background: c,
                    border: selectedColor === c ? "3px solid #fff" : "none",
                    boxShadow: selectedColor === c ? "0 0 10px rgba(255,255,255,0.4)" : "none",
                    cursor: "pointer"
                  }}
                />
              ))}
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ marginTop: 6 }}>
            <Plus size={16} />
            <span>Adicionar Categoria</span>
          </button>
        </form>
      </div>

      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" onClick={onClose}>
          Fechar
        </button>
      </div>
    </Modal>
  );
};
