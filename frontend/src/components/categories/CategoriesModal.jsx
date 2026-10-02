import React, { useState } from "react";
import {
  Tag,
  X,
  Search,
  Plus,
  Utensils,
  Home,
  ShoppingCart,
  Car,
  Heart,
  GraduationCap,
  Gamepad2,
  Plane,
  PawPrint,
  Dumbbell,
  Landmark,
  Laptop,
  Gift,
  Coffee,
  Music,
  Camera,
  Wallet,
  ShoppingBag,
  TrendingUp,
  Briefcase,
  Package,
  Sparkles,
  MoreHorizontal,
  Tv,
  Stethoscope,
  Scissors,
  Wrench,
  Fuel,
  BookOpen
} from "lucide-react";
import { useFinance } from "../../context/FinanceContext";

const CATEGORY_ICONS_LIST = [
  { id: "Utensils", icon: Utensils },
  { id: "Home", icon: Home },
  { id: "ShoppingCart", icon: ShoppingCart },
  { id: "Car", icon: Car },
  { id: "Heart", icon: Heart },
  { id: "GraduationCap", icon: GraduationCap },
  { id: "Gamepad2", icon: Gamepad2 },
  { id: "Plane", icon: Plane },
  { id: "PawPrint", icon: PawPrint },
  { id: "Dumbbell", icon: Dumbbell },
  { id: "Landmark", icon: Landmark },
  { id: "Laptop", icon: Laptop },
  { id: "Gift", icon: Gift },
  { id: "Coffee", icon: Coffee },
  { id: "Music", icon: Music },
  { id: "Camera", icon: Camera },
  { id: "Wallet", icon: Wallet },
  { id: "ShoppingBag", icon: ShoppingBag },
  { id: "TrendingUp", icon: TrendingUp },
  { id: "Briefcase", icon: Briefcase },
  { id: "Package", icon: Package },
  { id: "Sparkles", icon: Sparkles },
  { id: "MoreHorizontal", icon: MoreHorizontal }
];

const CATEGORY_COLORS_PALETTE = [
  "#f97316", // Orange
  "#ef4444", // Red
  "#ec4899", // Pink
  "#d946ef", // Magenta
  "#8b5cf6", // Purple
  "#3b82f6", // Blue
  "#0d9488", // Teal (Selected default)
  "#10b981", // Emerald Green
  "#84cc16", // Lime
  "#eab308", // Yellow
  "#991b1b", // Dark Red
  "#334155"  // Dark Slate
];

const DEFAULT_ACTIVE_CATEGORIES = [
  { id: 1, name: "Assinaturas & Streaming", icon: "Tv", color: "#06b6d4" },
  { id: 2, name: "Beleza & Cuidados Pessoais", icon: "Sparkles", color: "#d946ef" },
  { id: 3, name: "Casa & Manutenção", icon: "Wrench", color: "#84cc16" },
  { id: 4, name: "Compras & Vestuário", icon: "ShoppingBag", color: "#14b8a6" },
  { id: 5, name: "Educação & Cursos", icon: "GraduationCap", color: "#8b5cf6" },
  { id: 6, name: "Freelance & Extras", icon: "Laptop", color: "#3b82f6" },
  { id: 7, name: "Hobbies & Jogos", icon: "Gamepad2", color: "#a855f7" },
  { id: 8, name: "Impostos, Taxas & Seguros", icon: "Landmark", color: "#64748b" },
  { id: 9, name: "Investimentos & Ações", icon: "TrendingUp", color: "#10b981" },
  { id: 10, name: "Lazer & Restaurantes", icon: "Utensils", color: "#f43f5e" },
  { id: 11, name: "Moradia & Contas", icon: "Home", color: "#6366f1" },
  { id: 12, name: "Saúde & Bem-estar", icon: "Heart", color: "#f97316" },
  { id: 13, name: "Transporte & Mobilidade", icon: "Car", color: "#eab308" },
  { id: 14, name: "Viagens & Turismo", icon: "Plane", color: "#0ea5e9" },
  { id: 15, name: "Pets & Animais", icon: "PawPrint", color: "#22c55e" },
  { id: 16, name: "Presentes & Doações", icon: "Gift", color: "#ec4899" }
];

export const CategoriesModal = ({ isOpen, onClose }) => {
  const { categories, createCategory, showToast } = useFinance();

  const [searchCat, setSearchCat] = useState("");
  const [name, setName] = useState("");
  const [type, setType] = useState("expense");
  const [budgetType, setBudgetType] = useState("needs");
  const [selectedIcon, setSelectedIcon] = useState("Utensils");
  const [selectedColor, setSelectedColor] = useState("#0d9488");
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const allCategories = categories && categories.length >= 10 ? categories : DEFAULT_ACTIVE_CATEGORIES;

  const filteredCategories = allCategories.filter((c) =>
    c.name.toLowerCase().includes(searchCat.toLowerCase())
  );

  const getDynamicIconComponent = (iconName) => {
    const found = CATEGORY_ICONS_LIST.find((item) => item.id.toLowerCase() === iconName?.toLowerCase());
    if (found) {
      const Comp = found.icon;
      return <Comp size={15} />;
    }
    if (iconName === "Tv") return <Tv size={15} />;
    if (iconName === "Wrench") return <Wrench size={15} />;
    return <Tag size={15} />;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setIsSubmitting(true);
      await createCategory({
        name: name.trim(),
        type,
        budget_type: type === "expense" ? budgetType : "needs",
        icon: selectedIcon,
        color: selectedColor,
        is_custom: true
      });
      showToast(`Categoria "${name}" criada com sucesso!`, "success");
      setName("");
    } catch (err) {
      showToast("Erro ao criar categoria.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="cat-modal-backdrop" onClick={onClose}>
      <div className="cat-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="cat-modal-header">
          <div className="cat-modal-header-left">
            <div className="cat-header-icon-circle">
              <Tag size={20} />
            </div>
            <div className="cat-header-text">
              <h2>Gerenciador de Categorias</h2>
              <p>Organize suas categorias para ter um controle financeiro ainda mais preciso.</p>
            </div>
          </div>
          <button type="button" className="cat-modal-close-btn" onClick={onClose} aria-label="Fechar">
            <X size={18} />
          </button>
        </div>

        {/* Modal Body: 2 Columns Layout */}
        <div className="cat-modal-body-grid">
          {/* Left Column: Categorias Ativas */}
          <div className="cat-col-left">
            <div className="cat-section-header">
              <h3>Categorias Ativas ({allCategories.length})</h3>
              <p>Visualize, edite ou use como referência para criar novas categorias.</p>
            </div>

            {/* Search Input */}
            <div className="cat-search-box">
              <Search size={16} className="cat-search-icon" />
              <input
                type="text"
                className="cat-search-input"
                placeholder="Buscar categorias..."
                value={searchCat}
                onChange={(e) => setSearchCat(e.target.value)}
              />
            </div>

            {/* 2-Column Badges Grid */}
            <div className="cat-badges-grid">
              {filteredCategories.map((c) => (
                <div
                  key={c.id || c.name}
                  className="cat-badge-item"
                  style={{
                    backgroundColor: `${c.color}15`,
                    borderColor: `${c.color}35`,
                    color: c.color
                  }}
                >
                  <span className="cat-badge-icon" style={{ color: c.color }}>
                    {getDynamicIconComponent(c.icon)}
                  </span>
                  <span className="cat-badge-name" style={{ color: c.color }}>{c.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Criar Nova Categoria */}
          <div className="cat-col-right">
            <div className="cat-section-header-right">
              <div className="cat-create-icon-circle">
                <Tag size={16} />
              </div>
              <div>
                <h3>Criar Nova Categoria</h3>
                <p>Adicione uma nova categoria para organizar suas transações.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="cat-create-form">
              {/* Nome da Categoria */}
              <div className="cat-form-group">
                <label>Nome da Categoria</label>
                <input
                  type="text"
                  className="cat-input-field"
                  placeholder="Ex: Pet Shop, Cafeteria, Livros"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              {/* Tipo de Movimentação */}
              <div className="cat-form-group">
                <label>Tipo de Movimentação</label>
                <select
                  className="cat-select-field"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  <option value="expense">Despesa (Gasto)</option>
                  <option value="income">Receita (Entrada)</option>
                </select>
              </div>

              {/* Classificação Orçamentária 50/30/20 */}
              <div className="cat-form-group">
                <label>Classificação Orçamentária (Regra 50/30/20)</label>
                <select
                  className="cat-select-field"
                  value={budgetType}
                  onChange={(e) => setBudgetType(e.target.value)}
                >
                  <option value="needs">Necessidades Básicas (50% - Essencial)</option>
                  <option value="wants">Desejos Pessoais (30% - Não Essencial)</option>
                  <option value="savings">Investimentos &amp; Poupança (20% - Futuro)</option>
                </select>
              </div>

              {/* Grid de Ícones */}
              <div className="cat-form-group">
                <label>Ícone</label>
                <div className="cat-icons-grid">
                  {CATEGORY_ICONS_LIST.map((item) => {
                    const IconComp = item.icon;
                    const isSelected = selectedIcon === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        className={`cat-icon-picker-btn ${isSelected ? "selected" : ""}`}
                        onClick={() => setSelectedIcon(item.id)}
                        title={item.id}
                      >
                        <IconComp size={16} />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Paleta de Cores */}
              <div className="cat-form-group">
                <label>Cor da Categoria</label>
                <div className="cat-colors-row">
                  {CATEGORY_COLORS_PALETTE.map((hex) => {
                    const isSelected = selectedColor === hex;
                    return (
                      <button
                        key={hex}
                        type="button"
                        className={`cat-color-dot ${isSelected ? "selected" : ""}`}
                        style={{ backgroundColor: hex }}
                        onClick={() => setSelectedColor(hex)}
                        aria-label={`Cor ${hex}`}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Action Button */}
              <button
                type="submit"
                className="cat-submit-btn"
                disabled={isSubmitting}
              >
                <Plus size={16} />
                <span>Adicionar Categoria</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
