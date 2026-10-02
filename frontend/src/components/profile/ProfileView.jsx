import React, { useState } from "react";
import {
  User,
  Shield,
  Sliders,
  Bell,
  Camera,
  Key,
  Smartphone,
  ChevronRight,
  MoreVertical,
  BarChart2,
  Volume2,
  Eye,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useFinance } from "../../context/FinanceContext";
import { BrandLogo } from "../common/BrandLogo";

export const ProfileView = ({ onNavigateHome }) => {
  const { user, updateProfile } = useAuth();
  const { showToast } = useFinance();

  const [activeTab, setActiveTab] = useState("profile"); // profile | security | preferences | notifications
  const [fullName, setFullName] = useState(user?.name || "Guilherme Viana");
  const [email, setEmail] = useState(user?.email || "guilhermevianasantos@gmail.com");

  // Privacy switches state
  const [usageData, setUsageData] = useState(true);
  const [emailCommunications, setEmailCommunications] = useState(true);
  const [personalization, setPersonalization] = useState(true);

  const [loading, setLoading] = useState(false);

  const handleSavePersonalInfo = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await updateProfile({ name: fullName, email });
      showToast("Informações pessoais salvas com sucesso!", "success");
    } catch (err) {
      showToast("Erro ao salvar alterações.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFullName(user?.name || "Guilherme Viana");
    setEmail(user?.email || "guilhermevianasantos@gmail.com");
  };

  return (
    <div className="profile-page-container">
      {/* Top Header & Breadcrumbs */}
      <div className="profile-header-wrapper">
        <div>
          <div className="profile-breadcrumbs">
            <span style={{ cursor: "pointer" }} onClick={onNavigateHome}>Início</span>
            <span>&gt;</span>
            <span className="active">Meu Perfil</span>
          </div>
          <h1 className="page-title" style={{ marginTop: 6, fontSize: "1.75rem" }}>Meu Perfil</h1>
          <p className="page-subtitle" style={{ fontSize: "0.88rem", color: "#64748b", margin: "4px 0 0 0" }}>
            Gerencie suas informações pessoais e preferências da sua conta FinFlow Pro.
          </p>
        </div>
      </div>

      {/* Main Content Layout with Left Nav and 4 Cards */}
      <div className="profile-main-layout">
        {/* Left Sub-Navigation */}
        <div className="profile-nav-sidebar">
          <button
            type="button"
            className={`profile-nav-item ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            <User size={18} />
            <span>Meu Perfil</span>
          </button>
          <button
            type="button"
            className={`profile-nav-item ${activeTab === "security" ? "active" : ""}`}
            onClick={() => setActiveTab("security")}
          >
            <Shield size={18} />
            <span>Segurança</span>
          </button>
          <button
            type="button"
            className={`profile-nav-item ${activeTab === "preferences" ? "active" : ""}`}
            onClick={() => setActiveTab("preferences")}
          >
            <Sliders size={18} />
            <span>Preferências</span>
          </button>
          <button
            type="button"
            className={`profile-nav-item ${activeTab === "notifications" ? "active" : ""}`}
            onClick={() => setActiveTab("notifications")}
          >
            <Bell size={18} />
            <span>Notificações</span>
          </button>
        </div>

        {/* 4-Card Grid */}
        <div className="profile-cards-grid">
          {/* Card 1: Informações pessoais */}
          {(activeTab === "profile" || activeTab === "all") && (
          <div className="profile-card">
            <div className="profile-card-header">
              <div className="profile-card-header-left">
                <div className="profile-badge-icon">
                  <User size={18} />
                </div>
                <div className="profile-card-titles">
                  <h3>Informações pessoais</h3>
                  <p>Mantenha seus dados atualizados.</p>
                </div>
              </div>
            </div>

            {/* Avatar & Membership */}
            <div className="profile-user-summary">
              <div className="profile-avatar-wrapper">
                <div className="profile-avatar-circle-lg">
                  {fullName ? fullName.charAt(0).toUpperCase() : "G"}
                </div>
                <div className="profile-camera-badge" title="Alterar foto">
                  <Camera size={12} />
                </div>
              </div>
              <div className="profile-user-texts">
                <h4>{fullName}</h4>
                <span>Membro desde jan. de 2024</span>
              </div>
            </div>

            {/* Form Inputs */}
            <form onSubmit={handleSavePersonalInfo} className="profile-form-inputs">
              <div className="profile-input-group">
                <label>Nome completo</label>
                <input
                  type="text"
                  className="profile-input-field"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>

              <div className="profile-input-group">
                <label>E-mail</label>
                <input
                  type="email"
                  className="profile-input-field"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="profile-form-actions">
                <button
                  type="button"
                  className="profile-btn-cancel"
                  onClick={handleCancel}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="profile-btn-save"
                  disabled={loading}
                >
                  {loading ? "Salvando..." : "Salvar alterações"}
                </button>
              </div>
            </form>
          </div>
          )}

          {/* Card 2: Senha e segurança */}
          {(activeTab === "security" || activeTab === "all") && (
          <div className="profile-card">
            <div className="profile-card-header">
              <div className="profile-card-header-left">
                <div className="profile-badge-icon">
                  <Shield size={18} />
                </div>
                <div className="profile-card-titles">
                  <h3>Senha e segurança</h3>
                  <p>Mantenha sua conta segura.</p>
                </div>
              </div>
              <button
                type="button"
                className="profile-btn-outline-header"
                onClick={() => showToast("Funcionalidade de alteração de senha ativa.", "info")}
              >
                Alterar senha
              </button>
            </div>

            <div className="profile-action-rows">
              {/* Row 1: Senha */}
              <div className="profile-row-item">
                <div className="profile-row-left">
                  <Key size={17} className="profile-row-icon" />
                  <div className="profile-row-texts">
                    <span className="profile-row-title">Senha</span>
                    <span className="profile-row-desc">Altere sua senha regularmente para maior segurança.</span>
                  </div>
                </div>
                <ChevronRight size={16} color="#94a3b8" />
              </div>

              {/* Row 2: 2FA */}
              <div className="profile-row-item">
                <div className="profile-row-left">
                  <Shield size={17} className="profile-row-icon" />
                  <div className="profile-row-texts">
                    <span className="profile-row-title">Verificação em duas etapas</span>
                    <span className="profile-row-desc">Adicione uma camada extra de proteção à sua conta.</span>
                  </div>
                </div>
                <div className="profile-row-right">
                  <span className="profile-status-badge">Desativada</span>
                  <ChevronRight size={16} color="#94a3b8" />
                </div>
              </div>

              {/* Row 3: Connected Devices */}
              <div className="profile-row-item">
                <div className="profile-row-left">
                  <Smartphone size={17} className="profile-row-icon" />
                  <div className="profile-row-texts">
                    <span className="profile-row-title">Dispositivos conectados</span>
                    <span className="profile-row-desc">Gerencie os dispositivos que têm acesso à sua conta.</span>
                  </div>
                </div>
                <ChevronRight size={16} color="#94a3b8" />
              </div>
            </div>
          </div>
          )}

          {/* Card 3: Métodos de login conectados */}
          {(activeTab === "security" || activeTab === "profile" || activeTab === "all") && (
          <div className="profile-card">
            <div className="profile-card-header">
              <div className="profile-card-header-left">
                <div className="profile-badge-icon">
                  <Shield size={18} />
                </div>
                <div className="profile-card-titles">
                  <h3>Métodos de login conectados</h3>
                  <p>Vincule métodos de login para acessar sua conta com mais facilidade.</p>
                </div>
              </div>
            </div>

            <div className="profile-action-rows">
              {/* Google */}
              <div className="profile-row-item" style={{ cursor: "default" }}>
                <div className="profile-row-left">
                  <BrandLogo brand="google" size={24} />
                  <div className="profile-row-texts">
                    <span className="profile-row-title">Google</span>
                    <span className="profile-row-desc">{email}</span>
                  </div>
                </div>
                <div className="profile-row-right">
                  <span className="profile-connected-badge">Conectado</span>
                  <MoreVertical size={16} color="#94a3b8" style={{ cursor: "pointer" }} />
                </div>
              </div>

              {/* Apple */}
              <div className="profile-row-item" style={{ cursor: "default" }}>
                <div className="profile-row-left">
                  <BrandLogo brand="apple" size={24} />
                  <div className="profile-row-texts">
                    <span className="profile-row-title">Apple</span>
                    <span className="profile-row-desc">Conecte sua conta Apple para um login mais rápido.</span>
                  </div>
                </div>
                <button
                  type="button"
                  className="profile-btn-connect"
                  onClick={() => showToast("Conta Apple vinculada com sucesso!", "success")}
                >
                  Conectar
                </button>
              </div>
            </div>
          </div>
          )}

          {/* Card 4: Preferências e Notificações */}
          {(activeTab === "preferences" || activeTab === "notifications" || activeTab === "all") && (
          <div className="profile-card">
            <div className="profile-card-header">
              <div className="profile-card-header-left">
                <div className="profile-badge-icon">
                  <Sliders size={18} />
                </div>
                <div className="profile-card-titles">
                  <h3>{activeTab === "notifications" ? "Preferências de Notificações" : "Preferências de privacidade"}</h3>
                  <p>Controle como seus dados e notificações são gerenciados.</p>
                </div>
              </div>
            </div>

            <div className="profile-action-rows">
              {/* Toggle 1: Dados de uso */}
              <div className="profile-row-item" style={{ cursor: "default" }}>
                <div className="profile-row-left">
                  <BarChart2 size={17} className="profile-row-icon" />
                  <div className="profile-row-texts">
                    <span className="profile-row-title">Dados de uso & Análise</span>
                    <span className="profile-row-desc">Permitir o uso de dados de navegação para melhorar sua experiência.</span>
                  </div>
                </div>
                <label className="profile-switch-label">
                  <input
                    type="checkbox"
                    checked={usageData}
                    onChange={(e) => setUsageData(e.target.checked)}
                  />
                  <span className="profile-switch-slider" />
                </label>
              </div>

              {/* Toggle 2: Comunicações por e-mail */}
              <div className="profile-row-item" style={{ cursor: "default" }}>
                <div className="profile-row-left">
                  <Volume2 size={17} className="profile-row-icon" />
                  <div className="profile-row-texts">
                    <span className="profile-row-title">Alertas por e-mail & Push</span>
                    <span className="profile-row-desc">Receber novidades, lembretes de fatura e dicas do FinFlow Pro.</span>
                  </div>
                </div>
                <label className="profile-switch-label">
                  <input
                    type="checkbox"
                    checked={emailCommunications}
                    onChange={(e) => setEmailCommunications(e.target.checked)}
                  />
                  <span className="profile-switch-slider" />
                </label>
              </div>

              {/* Toggle 3: Personalização */}
              <div className="profile-row-item" style={{ cursor: "default" }}>
                <div className="profile-row-left">
                  <Eye size={17} className="profile-row-icon" />
                  <div className="profile-row-texts">
                    <span className="profile-row-title">Personalização Inteligente</span>
                    <span className="profile-row-desc">Permitir recomendações personalizadas na plataforma.</span>
                  </div>
                </div>
                <label className="profile-switch-label">
                  <input
                    type="checkbox"
                    checked={personalization}
                    onChange={(e) => setPersonalization(e.target.checked)}
                  />
                  <span className="profile-switch-slider" />
                </label>
              </div>
            </div>
          </div>
          )}
        </div>
      </div>
    </div>
  );
};
