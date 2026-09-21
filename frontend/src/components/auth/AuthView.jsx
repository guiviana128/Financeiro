import React, { useState } from "react";
import {
  Wallet,
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  TrendingUp,
  CreditCard
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export const AuthView = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loadingAction, setLoadingAction] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { login, register, demoLogin } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email.trim() || !password.trim()) {
      setErrorMessage("Preencha todos os campos obrigatórios.");
      return;
    }

    if (isRegister && !name.trim()) {
      setErrorMessage("Informe seu nome completo para cadastro.");
      return;
    }

    try {
      setLoadingAction(true);
      if (isRegister) {
        await register(name, email, password);
      } else {
        await login(email, password);
      }
    } catch (err) {
      setErrorMessage(err.message || "Erro ao autenticar.");
    } finally {
      setLoadingAction(false);
    }
  };

  const handleDemoClick = async () => {
    setErrorMessage("");
    try {
      setLoadingAction(true);
      await demoLogin();
    } catch (err) {
      setErrorMessage(err.message || "Erro ao entrar com conta demo.");
    } finally {
      setLoadingAction(false);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-bg-blob auth-blob-1" />
      <div className="auth-bg-blob auth-blob-2" />

      <div className="auth-card">
        {/* Brand & Header */}
        <div className="auth-header">
          <div className="auth-brand-badge">
            <Wallet size={16} />
            <span>FinFlow Pro • Gestão Pessoal</span>
          </div>
          <h2 className="auth-title">
            {isRegister ? "Crie sua Conta" : "Bem-vindo de volta!"}
          </h2>
          <p className="auth-subtitle">
            {isRegister
              ? "Tenha seu próprio controle financeiro 100% individual e seguro"
              : "Acesse seu painel financeiro exclusivo e personalizado"}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="auth-tabs">
          <button
            type="button"
            className={`auth-tab-btn ${!isRegister ? "active" : ""}`}
            onClick={() => {
              setIsRegister(false);
              setErrorMessage("");
            }}
          >
            Entrar
          </button>
          <button
            type="button"
            className={`auth-tab-btn ${isRegister ? "active" : ""}`}
            onClick={() => {
              setIsRegister(true);
              setErrorMessage("");
            }}
          >
            Criar Conta
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="auth-error-banner">
            <AlertCircle size={18} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form className="auth-form" onSubmit={handleSubmit} style={{ marginTop: errorMessage ? "1rem" : 0 }}>
          {isRegister && (
            <div className="auth-input-group">
              <label className="auth-label">Seu Nome</label>
              <div className="auth-input-wrapper">
                <User size={18} className="auth-input-icon" />
                <input
                  type="text"
                  className="auth-input"
                  placeholder="Ex: Guilherme Viana"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={isRegister}
                  autoComplete="name"
                />
              </div>
            </div>
          )}

          <div className="auth-input-group">
            <label className="auth-label">E-mail</label>
            <div className="auth-input-wrapper">
              <Mail size={18} className="auth-input-icon" />
              <input
                type="email"
                className="auth-input"
                placeholder="seu.email@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div className="auth-input-group">
            <label className="auth-label">Senha</label>
            <div className="auth-input-wrapper">
              <Lock size={18} className="auth-input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                className="auth-input"
                placeholder={isRegister ? "Crie uma senha (mínimo 4 caracteres)" : "Sua senha"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete={isRegister ? "new-password" : "current-password"}
              />
              <button
                type="button"
                className="auth-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                aria-label={showPassword ? "Ocultar senha" : "Ver senha"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="auth-submit-btn"
            disabled={loadingAction}
          >
            <span>{loadingAction ? "Processando..." : (isRegister ? "Finalizar Cadastro & Entrar" : "Acessar Meu Painel")}</span>
            <ArrowRight size={18} />
          </button>
        </form>

        {/* Demo Login Quick Action */}
        <div className="auth-divider">ou experimente</div>

        <button
          type="button"
          className="auth-demo-btn"
          onClick={handleDemoClick}
          disabled={loadingAction}
          title="Entrar diretamente na conta demo pré-configurada"
        >
          <Sparkles size={17} />
          <span>Acessar com Conta Demo (1 Clique)</span>
        </button>

        {/* Security badges */}
        <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginTop: "1.5rem", color: "#64748b", fontSize: "0.75rem" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <ShieldCheck size={14} color="#10b981" /> Dados Isolados por Usuário
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <Lock size={14} color="#6366f1" /> Autenticação Segura JWT
          </span>
        </div>
      </div>
    </div>
  );
};
