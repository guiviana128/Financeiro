import React, { useState } from "react";
import {
  Users,
  UserPlus,
  Lock,
  Plus,
  Search,
  Filter,
  ArrowRight,
  Send,
  CheckCircle2,
  Home,
  Utensils,
  Car,
  Wifi,
  Tv,
  ShoppingBag,
  MoreHorizontal,
  DollarSign,
  TrendingUp,
  User,
  ShieldCheck,
  PiggyBank,
  Target,
  Sparkles,
  PieChart
} from "lucide-react";
import { formatCurrency } from "../../utils/formatters";
import { InviteMemberModal } from "./InviteMemberModal";
import { SharedPaymentModal } from "./SharedPaymentModal";

export const SharedSpaceView = () => {
  const [activeWorkspace, setActiveWorkspace] = useState("casa"); // 'pessoal' | 'casa'
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [settleModalData, setSettleModalData] = useState(null);

  // Members list for shared space with Rayza Huang
  const [members, setMembers] = useState([
    { id: 1, name: "Guilherme", email: "gui@email.com", role: "Administrador", avatar: "G", avatarBg: "#dbeafe", color: "#2563eb" },
    { id: 2, name: "Rayza Huang", email: "rayza.huang@email.com", role: "Editor", avatar: "R", avatarBg: "#fce7f3", color: "#db2777" }
  ]);

  // Settlements state
  const [settlements, setSettlements] = useState([
    {
      id: "rayza-owes-you",
      person: "Rayza Huang",
      avatar: "R",
      avatarBg: "#fce7f3",
      amount: 87.50,
      desc: "Sua parte já foi paga por ela",
      type: "receive",
      settled: false
    },
    {
      id: "you-owe-rayza",
      person: "Rayza Huang",
      avatar: "G",
      avatarBg: "#dbeafe",
      amount: 45.00,
      desc: "Sua parte já foi paga por ela",
      type: "pay",
      settled: false
    }
  ]);

  // Shared space transactions
  const [sharedTransactions, setSharedTransactions] = useState([
    { id: 1, date: "02 SET", desc: "Aluguel do apartamento", category: "Moradia", total: 1200.00, paidBy: "Rayza Huang", paidInitial: "R", paidBg: "#fce7f3", split: "50% / 50%", myShare: 600.00 },
    { id: 2, date: "04 SET", desc: "Supermercado Extra", category: "Alimentação", total: 450.00, paidBy: "Guilherme", paidInitial: "G", paidBg: "#dbeafe", split: "50% / 50%", myShare: 225.00 },
    { id: 3, date: "07 SET", desc: "Internet Fibra", category: "Contas fixas", total: 99.90, paidBy: "Guilherme", paidInitial: "G", paidBg: "#dbeafe", split: "50% / 50%", myShare: 49.95 },
    { id: 4, date: "10 SET", desc: "Uber - Jantar com amigos", category: "Lazer", total: 120.00, paidBy: "Rayza Huang", paidInitial: "R", paidBg: "#fce7f3", split: "50% / 50%", myShare: 60.00 },
    { id: 5, date: "12 SET", desc: "Conta de luz", category: "Contas fixas", total: 180.00, paidBy: "Rayza Huang", paidInitial: "R", paidBg: "#fce7f3", split: "50% / 50%", myShare: 90.00 },
    { id: 6, date: "15 SET", desc: "iFood - Almoço", category: "Alimentação", total: 78.50, paidBy: "Guilherme", paidInitial: "G", paidBg: "#dbeafe", split: "50% / 50%", myShare: 39.25 },
    { id: 7, date: "18 SET", desc: "Netflix", category: "Assinaturas", total: 44.90, paidBy: "Guilherme", paidInitial: "G", paidBg: "#dbeafe", split: "50% / 50%", myShare: 22.45 },
    { id: 8, date: "21 SET", desc: "Mercado Municipal", category: "Alimentação", total: 320.00, paidBy: "Rayza Huang", paidInitial: "R", paidBg: "#fce7f3", split: "60% / 40%", myShare: 128.00 }
  ]);

  // Personal Individual Space Transactions (Guilherme Only)
  const personalTransactions = [
    { id: 101, date: "27 SET", desc: "Salário Empresa Tech XYZ", category: "Salário", amount: 8900.00, type: "income" },
    { id: 102, date: "26 SET", desc: "Uber Viagem", category: "Transporte", amount: 42.30, type: "expense" },
    { id: 103, date: "25 SET", desc: "Academia Smart Fit Black", category: "Saúde", amount: 89.90, type: "expense" },
    { id: 104, date: "24 SET", desc: "Netflix Premium", category: "Assinaturas", amount: 44.90, type: "expense" },
    { id: 105, date: "20 SET", desc: "Aporte Tesouro Selic & CDI", category: "Investimentos", amount: 3000.00, type: "investment" },
    { id: 106, date: "18 SET", desc: "Restaurante Coco Bambu", category: "Alimentação", amount: 185.00, type: "expense" },
  ];

  const handleAddMember = (newMember) => {
    setMembers(prev => [...prev, newMember]);
  };

  const handleSettle = (settleId) => {
    setSettlements(prev =>
      prev.map(s => s.id === settleId ? { ...s, settled: true, amount: 0 } : s)
    );
  };

  const filteredSharedTransactions = sharedTransactions.filter(tx => {
    const matchesSearch = tx.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          tx.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          tx.paidBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || tx.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="shared-space-layout">
      {/* Top Workspace Selector Row */}
      <div className="workspace-selector-grid">
        {/* Workspace 1: Pessoal */}
        <div
          className={`workspace-card ${activeWorkspace === "pessoal" ? "active" : ""}`}
          onClick={() => setActiveWorkspace("pessoal")}
        >
          <div className={`ws-icon-circle ${activeWorkspace === "pessoal" ? "green" : ""}`}>
            <User size={18} />
          </div>
          <div className="ws-texts">
            <span className="ws-title">Pessoal</span>
            <span className="ws-sub">Suas finanças individuais</span>
          </div>
        </div>

        {/* Workspace 2: Casa Compartilhada */}
        <div
          className={`workspace-card ${activeWorkspace === "casa" ? "active" : ""}`}
          onClick={() => setActiveWorkspace("casa")}
        >
          <div className={`ws-icon-circle ${activeWorkspace === "casa" ? "green" : ""}`}>
            <Home size={18} />
          </div>
          <div className="ws-texts">
            <span className="ws-title">Casa Compartilhada</span>
            <span className="ws-sub">Guilherme e Rayza Huang</span>
          </div>
        </div>

        {/* Banner: Privacidade Garantida */}
        <div className="workspace-privacy-banner">
          <div className="privacy-left">
            <div className="privacy-icon-circle">
              <Lock size={16} />
            </div>
            <div>
              <h4 className="privacy-title">
                {activeWorkspace === "pessoal" ? "Modo Individual Ativo" : "Privacidade garantida"}
              </h4>
              <p className="privacy-sub">
                {activeWorkspace === "pessoal"
                  ? "Transações e investimentos pessoais são 100% confidenciais e exclusivos de Guilherme."
                  : "Transações pessoais ficam visíveis apenas para você. Neste espaço, apenas as transações divididas aparecem."}
              </p>
            </div>
          </div>

          <div className="privacy-house-art">
            <svg width="100" height="60" viewBox="0 0 100 60" fill="none">
              <path d="M40 25 L 65 8 L 90 25 V 55 H 40 Z" fill="#ccfbf1" />
              <path d="M35 25 L 65 5 L 95 25" stroke="#0d9488" strokeWidth="2.5" />
              <rect x="58" y="38" width="14" height="17" fill="#0d9488" rx="2" />
              <rect x="46" y="30" width="8" height="8" fill="#14b8a6" rx="1" />
              <rect x="76" y="30" width="8" height="8" fill="#14b8a6" rx="1" />
            </svg>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 1. MODO PESSOAL (INDIVIDUAL WORKSPACE COM NOVO GRÁFICO) */}
      {/* ======================================================== */}
      {activeWorkspace === "pessoal" ? (
        <div className="personal-workspace-view animate-fade-in">
          {/* Top 3 Metric Cards */}
          <div className="shared-middle-grid">
            <div className="shared-widget-card">
              <div className="shared-widget-header">
                <div className="shared-widget-title-box">
                  <DollarSign size={18} color="#10b981" />
                  <h3>Renda Líquida Pessoal</h3>
                </div>
              </div>
              <div className="budget-amount-huge" style={{ color: "#10b981" }}>
                {formatCurrency(8900.00)}
              </div>
              <span className="budget-amount-sub">Salário + Rendimentos de Setembro</span>
            </div>

            <div className="shared-widget-card">
              <div className="shared-widget-header">
                <div className="shared-widget-title-box">
                  <TrendingUp size={18} color="#f43f5e" />
                  <h3>Despesas Individuais</h3>
                </div>
              </div>
              <div className="budget-amount-huge" style={{ color: "#f43f5e" }}>
                {formatCurrency(3700.00)}
              </div>
              <span className="budget-amount-sub">41.5% da renda utilizada no mês</span>
            </div>

            <div className="shared-widget-card">
              <div className="shared-widget-header">
                <div className="shared-widget-title-box">
                  <PiggyBank size={18} color="#0d9488" />
                  <h3>Capacidade de Aporte</h3>
                </div>
              </div>
              <div className="budget-amount-huge" style={{ color: "#0d9488" }}>
                {formatCurrency(5200.00)}
              </div>
              <span className="budget-amount-sub">Taxa de poupança pessoal de 58.5% 🎉</span>
            </div>
          </div>

          {/* NOVO GRÁFICO EXCLUSIVO PESSOAL: Evolução Mensal de Aportes & Despesas */}
          <div className="personal-chart-card">
            <div className="panel-header">
              <div>
                <h3 className="panel-title">Evolução Pessoal: Aportes vs. Despesas</h3>
                <p className="panel-sub">Acompanhe a relação entre o que você gasta e o que você investe mensalmente</p>
              </div>
              <div className="panel-legend">
                <span><span className="legend-dot teal" /> Aporte / Economia</span>
                <span><span className="legend-dot grey" /> Despesas</span>
              </div>
            </div>

            {/* Interactive Bar Chart for Personal Evolution */}
            <div className="personal-bars-container">
              {[
                { month: "Abril", invested: 4500, expense: 3200, invH: 68, expH: 48 },
                { month: "Maio", invested: 4800, expense: 3400, invH: 72, expH: 52 },
                { month: "Junho", invested: 5100, expense: 3300, invH: 76, expH: 50 },
                { month: "Julho", invested: 4900, expense: 3600, invH: 74, expH: 55 },
                { month: "Agosto", invested: 5300, expense: 3500, invH: 80, expH: 53 },
                { month: "Setembro (Atual)", invested: 5200, expense: 3700, invH: 78, expH: 56 },
              ].map((pItem, pIdx) => (
                <div key={pIdx} className="personal-bar-group">
                  <div className="personal-bars-pair">
                    <div
                      className="pbar invested"
                      style={{ height: `${pItem.invH}%` }}
                      title={`Investido: ${formatCurrency(pItem.invested)}`}
                    >
                      <span className="pbar-tag">{formatCurrency(pItem.invested).replace(",00", "")}</span>
                    </div>
                    <div
                      className="pbar expense"
                      style={{ height: `${pItem.expH}%` }}
                      title={`Despesas: ${formatCurrency(pItem.expense)}`}
                    >
                      <span className="pbar-tag">{formatCurrency(pItem.expense).replace(",00", "")}</span>
                    </div>
                  </div>
                  <span className="personal-bar-lbl">{pItem.month}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Grid for Personal: Transactions & Goals */}
          <div className="shared-bottom-grid">
            {/* Left: Personal Transactions */}
            <div className="shared-tx-panel">
              <div className="shared-tx-header">
                <div className="shared-tx-title-left">
                  <User size={18} color="#0d9488" />
                  <h3>Extrato Individual de Guilherme</h3>
                  <span className="badge-count-pill">{personalTransactions.length}</span>
                </div>
              </div>

              <div className="shared-table-wrapper">
                <table className="shared-tx-table">
                  <thead>
                    <tr>
                      <th>DATA</th>
                      <th>DESCRIÇÃO</th>
                      <th>CATEGORIA</th>
                      <th>VALOR</th>
                      <th>TIPO</th>
                    </tr>
                  </thead>
                  <tbody>
                    {personalTransactions.map((tx) => (
                      <tr key={tx.id}>
                        <td>{tx.date}</td>
                        <td className="tx-desc-bold">{tx.desc}</td>
                        <td>
                          <span className="shared-cat-pill">{tx.category}</span>
                        </td>
                        <td
                          className="tx-total-val"
                          style={{
                            color: tx.type === "income" ? "#10b981" : tx.type === "investment" ? "#0d9488" : "#f43f5e"
                          }}
                        >
                          {tx.type === "income" ? `+ ${formatCurrency(tx.amount)}` : `- ${formatCurrency(tx.amount)}`}
                        </td>
                        <td>
                          <span
                            className="paid-by-badge"
                            style={{
                              background: tx.type === "income" ? "#ecfdf5" : tx.type === "investment" ? "#f0fdfa" : "#fff1f2",
                              color: tx.type === "income" ? "#10b981" : tx.type === "investment" ? "#0d9488" : "#f43f5e"
                            }}
                          >
                            {tx.type === "income" ? "Receita" : tx.type === "investment" ? "Aporte" : "Despesa"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right: Personal Goals */}
            <div className="shared-right-column">
              <div className="shared-tips-card">
                <div className="settle-title-box">
                  <Target size={17} color="#0d9488" />
                  <h4 className="tips-title">Metas Individuais de Guilherme</h4>
                </div>
                <div className="personal-goals-list">
                  <div className="personal-goal-item">
                    <div className="p-goal-header">
                      <span>Comprar um apê</span>
                      <strong>60%</strong>
                    </div>
                    <div className="due-bar-track">
                      <div className="due-bar-fill" style={{ width: "60%", background: "#0d9488" }} />
                    </div>
                    <span className="p-goal-sub">{formatCurrency(120000)} de {formatCurrency(200000)}</span>
                  </div>

                  <div className="personal-goal-item">
                    <div className="p-goal-header">
                      <span>Viagem Europa</span>
                      <strong>72%</strong>
                    </div>
                    <div className="due-bar-track">
                      <div className="due-bar-fill" style={{ width: "72%", background: "#3b82f6" }} />
                    </div>
                    <span className="p-goal-sub">{formatCurrency(18000)} de {formatCurrency(25000)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ======================================================== */
        /* 2. MODO CASA COMPARTILHADA (COM RAYZA HUANG)             */
        /* ======================================================== */
        <div className="shared-workspace-view animate-fade-in">
          {/* Middle Row: Membros, Orçamento e Resumo */}
          <div className="shared-middle-grid">
            {/* Card 1: Membros do espaço */}
            <div className="shared-widget-card">
              <div className="shared-widget-header">
                <div className="shared-widget-title-box">
                  <Users size={18} color="#0d9488" />
                  <h3>Membros do espaço</h3>
                </div>
                <button
                  type="button"
                  className="shared-add-member-btn"
                  onClick={() => setIsInviteOpen(true)}
                >
                  <Plus size={14} />
                  <span>Convidar pessoa</span>
                </button>
              </div>

              <div className="shared-members-list">
                {members.map(member => (
                  <div key={member.id} className="shared-member-row">
                    <div
                      className="member-avatar"
                      style={{ background: member.avatarBg, color: member.color || "#334155" }}
                    >
                      {member.avatar}
                    </div>
                    <div className="member-info">
                      <span className="member-name">
                        {member.name}{" "}
                        {member.role === "Administrador" && (
                          <small className="member-role">👑 Administrador</small>
                        )}
                      </span>
                      <span className="member-email">{member.email}</span>
                    </div>
                    <button type="button" className="btn-icon-subtle" title="Opções do membro">
                      <MoreHorizontal size={16} color="#94a3b8" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Card 2: Orçamento do espaço */}
            <div className="shared-widget-card">
              <div className="shared-widget-header">
                <div className="shared-widget-title-box">
                  <Home size={18} color="#0d9488" />
                  <h3>Orçamento do espaço (Set/2026)</h3>
                </div>
              </div>

              <div className="budget-top-vals">
                <div>
                  <div className="budget-amount-huge">{formatCurrency(4000.00)}</div>
                  <span className="budget-amount-sub">Orçamento mensal</span>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div className="budget-used-pct">68% utilizado</div>
                  <span className="budget-amount-sub">{formatCurrency(2720.00)} de {formatCurrency(4000.00)}</span>
                </div>
              </div>

              {/* 4 Multi-colored progress pills */}
              <div className="budget-categories-mini-grid">
                <div className="budget-cat-pill">
                  <div className="cat-top"><Home size={14} color="#f43f5e" /><span>Moradia</span></div>
                  <div className="cat-val">{formatCurrency(1500.00)}</div>
                  <div className="cat-pct-bar"><div className="cat-fill red" style={{ width: "38%" }} /></div>
                </div>

                <div className="budget-cat-pill">
                  <div className="cat-top"><Utensils size={14} color="#f59e0b" /><span>Alimentação</span></div>
                  <div className="cat-val">{formatCurrency(800.00)}</div>
                  <div className="cat-pct-bar"><div className="cat-fill orange" style={{ width: "20%" }} /></div>
                </div>

                <div className="budget-cat-pill">
                  <div className="cat-top"><Car size={14} color="#10b981" /><span>Transporte</span></div>
                  <div className="cat-val">{formatCurrency(400.00)}</div>
                  <div className="cat-pct-bar"><div className="cat-fill green" style={{ width: "10%" }} /></div>
                </div>

                <div className="budget-cat-pill">
                  <div className="cat-top"><ShoppingBag size={14} color="#8b5cf6" /><span>Outros</span></div>
                  <div className="cat-val">{formatCurrency(1300.00)}</div>
                  <div className="cat-pct-bar"><div className="cat-fill purple" style={{ width: "32%" }} /></div>
                </div>
              </div>
            </div>

            {/* Card 3: Resumo do mês */}
            <div className="shared-widget-card">
              <div className="shared-widget-header">
                <div className="shared-widget-title-box">
                  <Users size={18} color="#0d9488" />
                  <h3>Resumo do mês</h3>
                </div>
              </div>

              <div className="shared-summary-flow-list">
                <div className="summary-flow-row">
                  <div className="flow-left">
                    <span className="flow-dot green" />
                    <span>Receitas</span>
                  </div>
                  <span className="flow-val">{formatCurrency(5200.00)}</span>
                </div>

                <div className="summary-flow-row">
                  <div className="flow-left">
                    <span className="flow-dot red" />
                    <span>Despesas compart.</span>
                  </div>
                  <span className="flow-val red">{formatCurrency(2720.00)}</span>
                </div>
              </div>

              <div className="shared-balance-footer">
                <span className="balance-label">Saldo do espaço</span>
                <span className="balance-val">{formatCurrency(2480.00)}</span>
              </div>
            </div>
          </div>

          {/* Bottom Grid: Transações Compartilhadas e Acertos */}
          <div className="shared-bottom-grid">
            {/* Left: Table de Transações Compartilhadas */}
            <div className="shared-tx-panel">
              <div className="shared-tx-header">
                <div className="shared-tx-title-left">
                  <Users size={18} color="#0d9488" />
                  <h3>Transações compartilhadas</h3>
                  <span className="badge-count-pill">{filteredSharedTransactions.length}</span>
                </div>

                <div className="shared-tx-filters">
                  <div className="shared-search-box">
                    <Search size={14} />
                    <input
                      type="text"
                      placeholder="Buscar descrição ou quem pagou..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  <select
                    className="shared-select-month"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="all">Todas categorias</option>
                    <option value="Moradia">Moradia</option>
                    <option value="Alimentação">Alimentação</option>
                    <option value="Contas fixas">Contas fixas</option>
                    <option value="Lazer">Lazer</option>
                    <option value="Assinaturas">Assinaturas</option>
                  </select>
                </div>
              </div>

              <div className="shared-table-wrapper">
                <table className="shared-tx-table">
                  <thead>
                    <tr>
                      <th>DATA</th>
                      <th>DESCRIÇÃO</th>
                      <th>CATEGORIA</th>
                      <th>TOTAL</th>
                      <th>PAGO POR</th>
                      <th>DIVISÃO</th>
                      <th>SUA PARTE</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSharedTransactions.map((tx) => (
                      <tr key={tx.id}>
                        <td>{tx.date}</td>
                        <td className="tx-desc-bold">{tx.desc}</td>
                        <td>
                          <span className="shared-cat-pill">
                            {tx.category}
                          </span>
                        </td>
                        <td className="tx-total-val">{formatCurrency(tx.total)}</td>
                        <td>
                          <span className="paid-by-badge" style={{ background: tx.paidBg }}>
                            <span className="paid-by-avatar">{tx.paidInitial}</span>
                            <span>{tx.paidBy}</span>
                          </span>
                        </td>
                        <td className="tx-split-sub">{tx.split}</td>
                        <td className="tx-myshare-bold">{formatCurrency(tx.myShare)}</td>
                        <td>
                          <button type="button" className="btn-icon-subtle">
                            <MoreHorizontal size={14} color="#94a3b8" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right Column: Acertos Pendentes & Dicas */}
            <div className="shared-right-column">
              {/* Card: Acertos Pendentes */}
              <div className="shared-settlement-card">
                <div className="settle-header">
                  <div className="settle-title-box">
                    <Users size={17} color="#0d9488" />
                    <h4>Acertos pendentes</h4>
                  </div>
                </div>

                <div className="settle-items-list">
                  {settlements.map((settle) => (
                    <div key={settle.id} className="settle-box">
                      <div className="settle-box-top">
                        <div className="settle-user">
                          <span
                            className="settle-avatar"
                            style={{ background: settle.avatarBg }}
                          >
                            {settle.avatar}
                          </span>
                          <div>
                            <span className="settle-name">
                              {settle.type === "receive"
                                ? `${settle.person} deve para você`
                                : `Você deve para ${settle.person}`}
                            </span>
                            <span className="settle-desc">{settle.desc}</span>
                          </div>
                        </div>
                        <span className={`settle-amount ${settle.settled ? "green" : "red"}`}>
                          {settle.settled ? "Quitado ✅" : formatCurrency(settle.amount)}
                        </span>
                      </div>

                      {!settle.settled ? (
                        <button
                          type="button"
                          className={`settle-action-btn ${settle.type === "receive" ? "receive" : "pay"}`}
                          onClick={() => setSettleModalData(settle)}
                        >
                          {settle.type === "receive" ? (
                            <span>Registrar recebimento</span>
                          ) : (
                            <>
                              <Send size={13} />
                              <span>Pagar agora</span>
                            </>
                          )}
                        </button>
                      ) : (
                        <div className="settled-pill-badge">
                          <CheckCircle2 size={13} color="#10b981" />
                          <span>Acerto concluído</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Card: Dicas para uma boa gestão */}
              <div className="shared-tips-card">
                <h4 className="tips-title">Dicas para uma boa gestão</h4>
                <div className="tips-list">
                  <div className="tip-row"><CheckCircle2 size={15} color="#10b981" /><span>Definam categorias e limites no orçamento</span></div>
                  <div className="tip-row"><CheckCircle2 size={15} color="#10b981" /><span>Registrem as despesas logo após o pagamento</span></div>
                  <div className="tip-row"><CheckCircle2 size={15} color="#10b981" /><span>Mantenham os acertos em dia para evitar confusão</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Invite Member Modal */}
      <InviteMemberModal
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
        onAddMember={handleAddMember}
      />

      {/* Settlement / Payment Modal */}
      <SharedPaymentModal
        isOpen={!!settleModalData}
        onClose={() => setSettleModalData(null)}
        data={settleModalData}
        onConfirm={handleSettle}
      />
    </div>
  );
};
