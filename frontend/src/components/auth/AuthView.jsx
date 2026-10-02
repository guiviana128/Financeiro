import React, { useState } from "react";
import {
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  BarChart2,
  Target,
  Shield,
  TrendingUp,
  TrendingDown,
  AlertCircle
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export const AuthView = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loadingAction, setLoadingAction] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { login, register, demoLogin } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email.trim() || !password.trim()) {
      setErrorMessage("Preencha todos os campos.");
      return;
    }

    if (isRegister && !name.trim()) {
      setErrorMessage("Informe seu nome.");
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
      setErrorMessage(err.message || "Erro ao realizar login.");
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
    <div className="auth-split-page">
      {/* Left Side: Dark Hero Panel */}
      <div className="auth-hero-side">
        <div>
          {/* Logo */}
          <div className="auth-hero-brand">
            <div className="brand-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 6C4 4.89543 4.89543 4 6 4H18C19.1046 4 20 4.89543 20 6V10C20 11.1046 19.1046 12 18 12H10C8.89543 12 8 12.8954 8 14V18C8 19.1046 7.10457 20 6 20C4.89543 20 4 19.1046 4 18V6Z" fill="white" />
                <path d="M12 14C12 12.8954 12.8954 12 14 12H18C19.1046 12 20 12.8954 20 14V18C20 19.1046 19.1046 20 18 20H14C12.8954 20 12 19.1046 12 18V14Z" fill="white" fillOpacity="0.8" />
              </svg>
            </div>
            <div className="brand-text-wrapper">
              <span className="brand-title">FinFlow Pro</span>
              <span className="brand-subtitle">GESTÃO E CARTÕES</span>
            </div>
          </div>

          {/* Headline */}
          <h1 className="auth-hero-title">
            Sua vida<br />
            <span className="auth-hero-highlight">financeira</span><br />
            em boas mãos.
          </h1>

          <p className="auth-hero-subtitle">
            Organize suas contas, acompanhe suas metas e tome decisões com mais clareza.
          </p>

          {/* Glowing Graph Visual with Floating Badges */}
          <div className="auth-chart-visual">
            {/* Floating Receitas Badge */}
            <div className="auth-floating-badge income">
              <div className="auth-badge-icon-box" style={{ background: "#064e3b", color: "#34d399" }}>
                <TrendingUp size={16} />
              </div>
              <div>
                <div className="auth-badge-val">R$ 5.200,00</div>
                <div className="auth-badge-sub">Receitas no mês</div>
              </div>
            </div>

            {/* Floating Despesas Badge */}
            <div className="auth-floating-badge expense">
              <div className="auth-badge-icon-box" style={{ background: "#4c0519", color: "#fb7185" }}>
                <TrendingDown size={16} />
              </div>
              <div>
                <div className="auth-badge-val">R$ 2.318,40</div>
                <div className="auth-badge-sub">Despesas no mês</div>
              </div>
            </div>

            {/* Glowing neon graph SVG */}
            <svg width="100%" height="180" viewBox="0 0 500 180" fill="none" style={{ overflow: "visible" }}>
              {/* Background bars */}
              {["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET"].map((m, i) => {
                const heights = [30, 45, 60, 50, 75, 90, 110, 130, 155];
                const x = 30 + i * 50;
                return (
                  <g key={m}>
                    <rect
                      x={x}
                      y={160 - heights[i]}
                      width="24"
                      height={heights[i]}
                      rx="4"
                      fill="#0d9488"
                      fillOpacity="0.25"
                    />
                    <text
                      x={x + 12}
                      y="176"
                      fill="#64748b"
                      fontSize="10"
                      fontWeight="600"
                      textAnchor="middle"
                    >
                      {m}
                    </text>
                  </g>
                );
              })}

              {/* Glowing trend curve line */}
              <path
                d="M 10 140 Q 120 120, 200 80 T 430 30"
                stroke="#2dd4bf"
                strokeWidth="4"
                strokeLinecap="round"
                filter="drop-shadow(0 0 8px #2dd4bf)"
              />

              {/* Glowing peak dots */}
              <circle cx="120" cy="120" r="5" fill="#ffffff" stroke="#2dd4bf" strokeWidth="3" filter="drop-shadow(0 0 6px #2dd4bf)" />
              <circle cx="430" cy="30" r="6" fill="#ffffff" stroke="#2dd4bf" strokeWidth="3" filter="drop-shadow(0 0 8px #2dd4bf)" />
            </svg>
          </div>
        </div>

        {/* 3 Bottom Feature Highlights */}
        <div className="auth-features-row">
          <div className="auth-feature-col">
            <div className="auth-feature-icon-box">
              <BarChart2 size={18} />
            </div>
            <div>
              <div className="auth-feature-title">Tudo em um só lugar</div>
              <div className="auth-feature-desc">Contas, cartões, metas e investimentos integrados.</div>
            </div>
          </div>

          <div className="auth-feature-col">
            <div className="auth-feature-icon-box">
              <ShieldCheck size={18} />
            </div>
            <div>
              <div className="auth-feature-title">Seus dados protegidos</div>
              <div className="auth-feature-desc">Segurança e privacidade em primeiro lugar.</div>
            </div>
          </div>

          <div className="auth-feature-col">
            <div className="auth-feature-icon-box">
              <Target size={18} />
            </div>
            <div>
              <div className="auth-feature-title">Metas ao seu alcance</div>
              <div className="auth-feature-desc">Planeje hoje um futuro mais tranquilo.</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Clean Form Panel */}
      <div className="auth-form-side">
        <div className="auth-form-container">
          <div className="auth-form-header">
            <h2 className="auth-form-title">
              {isRegister ? "Criar nova conta" : "Bem-vindo de volta"}
            </h2>
            <p className="auth-form-sub">
              {isRegister ? "Comece seu planejamento gratuito hoje" : "Acesse sua conta para continuar"}
            </p>
          </div>

          {errorMessage && (
            <div className="auth-error-banner" style={{ display: "flex", alignItems: "center", gap: 8, padding: 12, background: "#fff1f2", color: "#f43f5e", borderRadius: 10, fontSize: "0.85rem", border: "1px solid #fecdd3" }}>
              <AlertCircle size={16} />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="auth-form-card">
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {isRegister && (
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: "0.82rem", fontWeight: 700 }}>Nome Completo</label>
                  <div className="tx-search-box">
                    <User size={16} className="tx-search-icon" />
                    <input
                      type="text"
                      className="tx-search-input"
                      placeholder="Seu nome"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required={isRegister}
                    />
                  </div>
                </div>
              )}

              <div className="form-group">
                <label className="form-label" style={{ fontSize: "0.82rem", fontWeight: 700 }}>E-mail</label>
                <div className="tx-search-box">
                  <Mail size={16} className="tx-search-icon" />
                  <input
                    type="email"
                    className="tx-search-input"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" style={{ fontSize: "0.82rem", fontWeight: 700 }}>Senha</label>
                <div className="tx-search-box" style={{ position: "relative" }}>
                  <Lock size={16} className="tx-search-icon" />
                  <input
                    type={showPassword ? "text" : "password"}
                    className="tx-search-input"
                    placeholder="Sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", border: "none", background: "transparent", color: "#94a3b8", cursor: "pointer" }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {!isRegister && (
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.82rem" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", color: "var(--text-primary)", fontWeight: 600 }}>
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      style={{ accentColor: "#0d9488" }}
                    />
                    <span>Lembrar de mim</span>
                  </label>

                  <a href="#recuperar" onClick={(e) => { e.preventDefault(); handleDemoClick(); }} style={{ color: "#0d9488", fontWeight: 600, textDecoration: "none" }}>
                    Esqueceu sua senha?
                  </a>
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: "100%", padding: "12px 16px", fontSize: "0.95rem", fontWeight: 700 }}
                disabled={loadingAction}
              >
                <span>{loadingAction ? "Entrando..." : (isRegister ? "Criar Minha Conta" : "Entrar na minha conta")}</span>
                <ArrowRight size={16} />
              </button>
            </form>

            <div className="auth-divider-line">ou</div>

            {/* Social Buttons */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <button
                type="button"
                className="auth-social-btn"
                onClick={handleDemoClick}
                disabled={loadingAction}
              >
                {/* Google G Logo */}
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
                </svg>
                <span>Continuar com Google</span>
              </button>

              <button
                type="button"
                className="auth-social-btn"
                onClick={handleDemoClick}
                disabled={loadingAction}
              >
                {/* Apple Logo */}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#000000">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.85c.66-.8 1.1-1.92.98-3.04-.95.04-2.1.63-2.78 1.43-.6.69-1.13 1.83-0.99 2.93 1.06.08 2.13-.52 2.79-1.32z" />
                </svg>
                <span>Continuar com Apple</span>
              </button>
            </div>
          </div>

          {/* Switch Tab Link */}
          <div style={{ textAlign: "center", fontSize: "0.85rem", color: "#64748b" }}>
            {isRegister ? "Já possui uma conta?" : "Ainda não tem uma conta?"}{" "}
            <button
              type="button"
              onClick={() => {
                setIsRegister(!isRegister);
                setErrorMessage("");
              }}
              style={{ border: "none", background: "transparent", color: "#0d9488", fontWeight: 700, cursor: "pointer", textDecoration: "underline" }}
            >
              {isRegister ? "Fazer Login" : "Criar conta"}
            </button>
          </div>

          {/* Security Footer */}
          <div className="auth-footer-security">
            <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#0d9488", fontWeight: 700 }}>
              <ShieldCheck size={16} />
              <span>Seus dados estão protegidos</span>
            </div>
            <span>Utilizamos criptografia de ponta a ponta para garantir sua privacidade.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
