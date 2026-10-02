import React, { useState } from "react";
import {
  Wallet,
  Landmark,
  PiggyBank,
  Banknote,
  Plus,
  ArrowRightLeft,
  Eye,
  EyeOff,
  CheckCircle2,
  Lock,
  MoreVertical,
  Search,
  Filter,
  Send,
  X,
  Sparkles,
  MoreHorizontal,
  TrendingUp,
  ChevronRight
} from "lucide-react";
import { formatCurrency } from "../../utils/formatters";

export const AccountsHubView = () => {
  const [isPrivacyHidden, setIsPrivacyHidden] = useState(false);
  const [isNewAccountModalOpen, setIsNewAccountModalOpen] = useState(false);
  const [transferFrom, setTransferFrom] = useState("bb");
  const [transferTo, setTransferTo] = useState("nu");
  const [transferAmount, setTransferAmount] = useState("");
  const [transferFeedback, setTransferFeedback] = useState(null);
  const [selectedAccountFilter, setSelectedAccountFilter] = useState("all");
  const [selectedTypeFilter, setSelectedTypeFilter] = useState("all");
  const [searchTxTerm, setSearchTxTerm] = useState("");

  const [accounts, setAccounts] = useState([
    {
      id: "bb",
      name: "Conta principal",
      bank: "Banco do Brasil",
      type: "Conta corrente",
      balance: 8450.00,
      updatedAt: "20/09/2026",
      icon: Landmark,
      color: "#2563eb",
      bg: "#eff6ff"
    },
    {
      id: "nu",
      name: "Reserva",
      bank: "Nubank",
      type: "Conta separada",
      balance: 12300.00,
      updatedAt: "19/09/2026",
      icon: PiggyBank,
      color: "#ec4899",
      bg: "#fdf2f8"
    },
    {
      id: "cash",
      name: "Carteira",
      bank: "Dinheiro em espécie",
      type: "Dinheiro físico",
      balance: 850.00,
      updatedAt: "18/09/2026",
      icon: Banknote,
      color: "#d97706",
      bg: "#fef3c7"
    }
  ]);

  const [transactions, setTransactions] = useState([
    { id: 1, date: "20/09/2026", desc: "Salário", account: "Conta principal", category: "Renda", type: "Entrada", amount: 5200.00, balanceAfter: 8450.00 },
    { id: 2, date: "19/09/2026", desc: "Aluguel", account: "Conta principal", category: "Moradia", type: "Saída", amount: -1200.00, balanceAfter: 3250.00 },
    { id: 3, date: "18/09/2026", desc: "Transferência para Reserva", account: "Conta principal", category: "Transferência", type: "Saída", amount: -1000.00, balanceAfter: 4450.00 },
    { id: 4, date: "18/09/2026", desc: "Transferência da Principal", account: "Reserva", category: "Transferência", type: "Entrada", amount: 1000.00, balanceAfter: 12300.00 },
    { id: 5, date: "17/09/2026", desc: "Supermercado", account: "Conta principal", category: "Alimentação", type: "Saída", amount: -320.00, balanceAfter: 5450.00 },
  ]);

  // Form New Account states
  const [newAccName, setNewAccName] = useState("");
  const [newAccBank, setNewAccBank] = useState("");
  const [newAccType, setNewAccType] = useState("Conta corrente");
  const [newAccBalance, setNewAccBalance] = useState("");

  const totalBalance = accounts.reduce((s, a) => s + a.balance, 0);

  const handleTransfer = (e) => {
    e.preventDefault();
    const val = parseFloat(transferAmount);
    if (!val || val <= 0 || transferFrom === transferTo) return;

    setAccounts(prev =>
      prev.map(a => {
        if (a.id === transferFrom) return { ...a, balance: a.balance - val, updatedAt: "Hoje" };
        if (a.id === transferTo) return { ...a, balance: a.balance + val, updatedAt: "Hoje" };
        return a;
      })
    );

    const fromName = accounts.find(a => a.id === transferFrom)?.name;
    const toName = accounts.find(a => a.id === transferTo)?.name;

    setTransactions(prev => [
      {
        id: Date.now(),
        date: "Hoje",
        desc: `Transferência para ${toName}`,
        account: fromName,
        category: "Transferência",
        type: "Saída",
        amount: -val,
        balanceAfter: (accounts.find(a => a.id === transferFrom)?.balance || 0) - val
      },
      ...prev
    ]);

    setTransferAmount("");
    setTransferFeedback(`Transferência de ${formatCurrency(val)} realizada de ${fromName} para ${toName}!`);
    setTimeout(() => setTransferFeedback(null), 3500);
  };

  const handleCreateAccount = (e) => {
    e.preventDefault();
    if (!newAccName || !newAccBalance) return;

    const newAcc = {
      id: `acc-${Date.now()}`,
      name: newAccName,
      bank: newAccBank || "Banco Digital",
      type: newAccType,
      balance: parseFloat(newAccBalance) || 0,
      updatedAt: "Hoje",
      icon: Wallet,
      color: "#0d9488",
      bg: "#f0fdfa"
    };

    setAccounts(prev => [...prev, newAcc]);
    setIsNewAccountModalOpen(false);
    setNewAccName("");
    setNewAccBank("");
    setNewAccBalance("");
  };

  const filteredTx = transactions.filter(tx => {
    const matchSearch = tx.desc.toLowerCase().includes(searchTxTerm.toLowerCase()) ||
                        tx.category.toLowerCase().includes(searchTxTerm.toLowerCase());
    const matchAccount = selectedAccountFilter === "all" || tx.account.toLowerCase().includes(selectedAccountFilter.toLowerCase());
    const matchType = selectedTypeFilter === "all" || tx.type.toLowerCase() === selectedTypeFilter.toLowerCase();
    return matchSearch && matchAccount && matchType;
  });

  return (
    <div className="accounts-layout animate-fade-in">
      {/* Top Banner: Visão completa do seu dinheiro */}
      <div className="accounts-hero-banner">
        <div className="accounts-hero-left">
          <div className="accounts-icon-large">
            <Wallet size={24} color="#0d9488" />
          </div>
          <div className="accounts-hero-texts">
            <div className="accounts-title-row">
              <h2 className="accounts-title">Visão completa do seu dinheiro</h2>
              <span className="badge-premium">Premium</span>
            </div>
            <p className="accounts-desc">
              Cadastre e gerencie suas contas bancárias, carteiras e cartões manualmente. Tudo em um só lugar, com total controle e privacidade.
              Não é necessária integração bancária.
            </p>
            <a href="#dicas" className="accounts-link" onClick={(e) => e.preventDefault()}>
              <Sparkles size={14} />
              <span>Saiba como funciona e dicas de organização →</span>
            </a>
          </div>
        </div>

        <div className="accounts-hero-right">
          <div className="accounts-badge-card">
            <div className="badge-card-icon"><Lock size={16} color="#0d9488" /></div>
            <div>
              <strong>Sem integração bancária</strong>
              <small>Você adiciona e atualiza os saldos manualmente.</small>
            </div>
          </div>

          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setIsNewAccountModalOpen(true)}
          >
            <Plus size={16} />
            <span>Nova Conta</span>
          </button>
        </div>
      </div>

      {/* Account Cards Row */}
      <div className="accounts-cards-grid">
        {accounts.map((acc) => {
          const isSelected = selectedAccountFilter.toLowerCase() === acc.id || selectedAccountFilter.toLowerCase() === acc.name.toLowerCase();

          return (
            <div
              key={acc.id}
              className={`acc-card ${isSelected ? "selected-acc-card" : ""}`}
              onClick={() => setSelectedAccountFilter(isSelected ? "all" : acc.name.toLowerCase())}
              style={{ cursor: "pointer" }}
              title={`Clique para filtrar transações da ${acc.name}`}
            >
              <div className="acc-card-top">
                <div className="acc-icon-circle" style={{ background: acc.bg, color: acc.color }}>
                  <acc.icon size={18} />
                </div>
                <div className="acc-info">
                  <h4 className="acc-name">{acc.name}</h4>
                  <span className="acc-sub">{acc.bank} • {acc.type}</span>
                </div>
                <button
                  type="button"
                  className="btn-icon-subtle"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <MoreVertical size={16} color="#94a3b8" />
                </button>
              </div>

              <div className="acc-balance-row">
                <span className="acc-balance">
                  {isPrivacyHidden ? "••••••" : formatCurrency(acc.balance)}
                </span>
              </div>

              <div className="acc-status-footer">
                <CheckCircle2 size={13} color="#10b981" />
                <span>Atualizado manualmente em {acc.updatedAt}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Middle Row: Saldo Líquido, Distribuição e Transferir */}
      <div className="accounts-middle-grid">
        {/* Card 1: Saldo líquido do mês */}
        <div className="shared-widget-card">
          <div className="shared-widget-header">
            <div className="shared-widget-title-box">
              <TrendingUp size={18} color="#0d9488" />
              <h3>Saldo líquido do mês</h3>
            </div>
          </div>

          <p className="accounts-mini-sub">Diferença entre entradas e saídas em todas as contas</p>

          <div className="budget-amount-huge" style={{ color: "#0d9488" }}>
            {isPrivacyHidden ? "••••••" : formatCurrency(4320.00)}
          </div>
          <span className="fstat-badge green" style={{ width: "fit-content" }}>↑ 12% em relação a agosto</span>

          <div className="acc-flow-details">
            <div className="acc-flow-item green">
              <span className="acc-flow-arrow">↑</span>
              <div>
                <span className="acc-flow-lbl">Entradas</span>
                <strong className="acc-flow-val">{isPrivacyHidden ? "••••" : formatCurrency(12540.00)}</strong>
              </div>
            </div>

            <div className="acc-flow-item red">
              <span className="acc-flow-arrow">↓</span>
              <div>
                <span className="acc-flow-lbl">Saídas</span>
                <strong className="acc-flow-val">{isPrivacyHidden ? "••••" : formatCurrency(8220.00)}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Distribuição por conta Donut */}
        <div className="shared-widget-card">
          <div className="shared-widget-header">
            <div className="shared-widget-title-box">
              <Wallet size={18} color="#0d9488" />
              <h3>Distribuição por conta</h3>
            </div>
          </div>

          <div className="cat-donut-body" style={{ marginTop: "4px" }}>
            <div className="cat-donut-chart-box">
              <svg width="120" height="120" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="45" fill="none" stroke="#2563eb" strokeWidth="18" strokeDasharray="110 282" strokeDashoffset="0" transform="rotate(-90 60 60)" />
                <circle cx="60" cy="60" r="45" fill="none" stroke="#ec4899" strokeWidth="18" strokeDasharray="160 282" strokeDashoffset="-110" transform="rotate(-90 60 60)" />
                <circle cx="60" cy="60" r="45" fill="none" stroke="#d97706" strokeWidth="18" strokeDasharray="12 282" strokeDashoffset="-270" transform="rotate(-90 60 60)" />
              </svg>
              <div className="cat-donut-inner-text">
                <span className="cat-donut-inner-val" style={{ fontSize: "0.86rem" }}>
                  {isPrivacyHidden ? "••••" : formatCurrency(totalBalance)}
                </span>
                <span className="cat-donut-inner-sub">total</span>
              </div>
            </div>

            <div className="acc-distrib-legend">
              <div className="acc-distrib-row">
                <span className="cat-donut-dot" style={{ background: "#2563eb" }} />
                <span className="distrib-name">Conta principal</span>
                <span className="distrib-pct">39%</span>
                <strong className="distrib-val">{isPrivacyHidden ? "••••" : formatCurrency(accounts[0]?.balance || 0)}</strong>
              </div>
              <div className="acc-distrib-row">
                <span className="cat-donut-dot" style={{ background: "#ec4899" }} />
                <span className="distrib-name">Reserva</span>
                <span className="distrib-pct">57%</span>
                <strong className="distrib-val">{isPrivacyHidden ? "••••" : formatCurrency(accounts[1]?.balance || 0)}</strong>
              </div>
              <div className="acc-distrib-row">
                <span className="cat-donut-dot" style={{ background: "#d97706" }} />
                <span className="distrib-name">Carteira</span>
                <span className="distrib-pct">4%</span>
                <strong className="distrib-val">{isPrivacyHidden ? "••••" : formatCurrency(accounts[2]?.balance || 0)}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Transferir entre contas & Privacidade */}
        <div className="shared-widget-card">
          <div className="shared-widget-header">
            <div className="shared-widget-title-box">
              <ArrowRightLeft size={18} color="#0d9488" />
              <h3>Transferir entre contas</h3>
            </div>
          </div>

          <form onSubmit={handleTransfer} className="acc-transfer-form">
            <div className="transfer-input-row">
              <label>De</label>
              <select
                className="form-input"
                value={transferFrom}
                onChange={(e) => setTransferFrom(e.target.value)}
              >
                {accounts.map(a => (
                  <option key={a.id} value={a.id}>{a.name} ({a.bank})</option>
                ))}
              </select>
            </div>

            <div className="transfer-input-row">
              <label>Para</label>
              <select
                className="form-input"
                value={transferTo}
                onChange={(e) => setTransferTo(e.target.value)}
              >
                {accounts.map(a => (
                  <option key={a.id} value={a.id}>{a.name} ({a.bank})</option>
                ))}
              </select>
            </div>

            <div className="transfer-input-row">
              <label>Valor</label>
              <input
                type="number"
                step="0.01"
                placeholder="R$ 0,00"
                className="form-input"
                value={transferAmount}
                onChange={(e) => setTransferAmount(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: "100%" }}>
              <Send size={14} />
              <span>Transferir agora</span>
            </button>
          </form>

          {transferFeedback && (
            <div className="transfer-success-msg animate-fade-in">
              <CheckCircle2 size={14} color="#10b981" />
              <span>{transferFeedback}</span>
            </div>
          )}

          {/* Privacy Toggle Card */}
          <div className="privacy-toggle-box">
            <div className="privacy-toggle-left">
              <Lock size={15} color="#0d9488" />
              <div>
                <strong>Privacidade</strong>
                <small>Ocultar valores das contas em toda a central</small>
              </div>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={isPrivacyHidden}
                onChange={() => setIsPrivacyHidden(prev => !prev)}
              />
              <span className="slider round" />
            </label>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Movimentações das contas & Status */}
      <div className="accounts-bottom-grid">
        {/* Table: Movimentações */}
        <div className="shared-tx-panel">
          <div className="shared-tx-header">
            <div className="shared-tx-title-left">
              <Wallet size={18} color="#0d9488" />
              <h3>Movimentações das contas</h3>
            </div>

            <div className="shared-tx-filters">
              <select
                className="shared-select-month"
                value={selectedAccountFilter}
                onChange={(e) => setSelectedAccountFilter(e.target.value)}
              >
                <option value="all">Todas as contas</option>
                <option value="principal">Conta principal</option>
                <option value="reserva">Reserva</option>
                <option value="carteira">Carteira</option>
              </select>

              <select
                className="shared-select-month"
                value={selectedTypeFilter}
                onChange={(e) => setSelectedTypeFilter(e.target.value)}
              >
                <option value="all">Todos os tipos</option>
                <option value="entrada">Entrada</option>
                <option value="saída">Saída</option>
              </select>

              <div className="shared-search-box">
                <Search size={14} />
                <input
                  type="text"
                  placeholder="Buscar movimentações..."
                  value={searchTxTerm}
                  onChange={(e) => setSearchTxTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="shared-table-wrapper">
            <table className="shared-tx-table">
              <thead>
                <tr>
                  <th>DATA</th>
                  <th>DESCRIÇÃO</th>
                  <th>CONTA</th>
                  <th>CATEGORIA</th>
                  <th>TIPO</th>
                  <th>VALOR</th>
                  <th>SALDO APÓS</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filteredTx.map((tx) => (
                  <tr key={tx.id}>
                    <td>{tx.date}</td>
                    <td className="tx-desc-bold">{tx.desc}</td>
                    <td>
                      <span className="acc-pill-tag">
                        <Landmark size={12} />
                        {tx.account}
                      </span>
                    </td>
                    <td><span className="shared-cat-pill">{tx.category}</span></td>
                    <td>
                      <span className={`status-badge ${tx.type === "Entrada" ? "paid" : "pending"}`}>
                        {tx.type}
                      </span>
                    </td>
                    <td className="tx-total-val" style={{ color: tx.amount > 0 ? "#10b981" : "#f43f5e" }}>
                      {isPrivacyHidden ? "••••" : (tx.amount > 0 ? `+ ${formatCurrency(tx.amount)}` : formatCurrency(tx.amount))}
                    </td>
                    <td className="tx-myshare-bold">
                      {isPrivacyHidden ? "••••" : formatCurrency(tx.balanceAfter)}
                    </td>
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

        {/* Right: Status das contas matching Reference Image 3 */}
        <div className="accounts-status-card">
          <div className="settle-title-box">
            <CheckCircle2 size={18} color="#10b981" />
            <h4 className="tips-title">Status das contas</h4>
          </div>

          <div className="accounts-status-list">
            {accounts.map(a => {
              const isSelected = selectedAccountFilter.toLowerCase() === a.id || selectedAccountFilter.toLowerCase() === a.name.toLowerCase();

              return (
                <div
                  key={a.id}
                  className={`acc-status-item-interactive ${isSelected ? "selected" : ""}`}
                  onClick={() => setSelectedAccountFilter(isSelected ? "all" : a.name.toLowerCase())}
                  style={{ cursor: "pointer" }}
                  title={`Filtrar por ${a.name}`}
                >
                  <div className="acc-icon-circle" style={{ background: a.bg, color: a.color, width: "34px", height: "34px" }}>
                    <a.icon size={16} />
                  </div>
                  <div className="acc-status-info">
                    <div className="acc-status-name-row">
                      <strong>{a.name}</strong>
                      <span className="acc-status-val">
                        {isPrivacyHidden ? "••••••" : formatCurrency(a.balance)}
                      </span>
                    </div>
                    <span className="status-sub">
                      <span className="dot-green" /> Atualizado manualmente em {a.updatedAt}
                    </span>
                  </div>
                  <ChevronRight size={16} color="#94a3b8" className="acc-status-chevron" />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modal: Nova Conta */}
      {isNewAccountModalOpen && (
        <div className="modal-overlay" onClick={() => setIsNewAccountModalOpen(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-with-icon">
                <div className="modal-title-icon green">
                  <Wallet size={20} />
                </div>
                <div>
                  <h3>Adicionar Nova Conta</h3>
                  <p className="modal-subtitle">Cadastre bancos, carteiras digitais ou caixas físicos</p>
                </div>
              </div>
              <button type="button" className="modal-close-btn" onClick={() => setIsNewAccountModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateAccount} className="invite-form-body">
              <div className="form-group">
                <label className="form-label">Nome da Conta / Apelido</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Ex: Inter Invest, Caixa Emergência, Cofre..."
                  value={newAccName}
                  onChange={(e) => setNewAccName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Instituição / Banco</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Ex: Banco Inter, Nubank, Itaú..."
                  value={newAccBank}
                  onChange={(e) => setNewAccBank(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Tipo de Conta</label>
                <select
                  className="form-input"
                  value={newAccType}
                  onChange={(e) => setNewAccType(e.target.value)}
                >
                  <option value="Conta corrente">Conta corrente</option>
                  <option value="Conta poupança">Conta poupança</option>
                  <option value="Conta investimento">Conta investimento</option>
                  <option value="Dinheiro em espécie">Dinheiro em espécie</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Saldo Inicial (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  className="form-input"
                  placeholder="0,00"
                  value={newAccBalance}
                  onChange={(e) => setNewAccBalance(e.target.value)}
                  required
                />
              </div>

              <div className="invite-modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsNewAccountModalOpen(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  <Plus size={15} />
                  <span>Cadastrar Conta</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
