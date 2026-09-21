import React, { useState } from "react";
import { X, User, Mail, Lock, Shield, CheckCircle, AlertCircle, Save } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useFinance } from "../../context/FinanceContext";

export const UserProfileModal = ({ isOpen, onClose }) => {
  const { user, updateProfile } = useAuth();
  const { showToast } = useFinance();

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen || !user) return null;

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);
      const payload = {};
      if (name.trim() && name !== user.name) payload.name = name.trim();
      if (email.trim() && email !== user.email) payload.email = email.trim();
      if (newPassword) {
        if (!currentPassword) {
          setError("Informe sua senha atual para alterar para uma nova senha.");
          setLoading(false);
          return;
        }
        payload.current_password = currentPassword;
        payload.new_password = newPassword;
      }

      if (Object.keys(payload).length === 0) {
        onClose();
        return;
      }

      await updateProfile(payload);
      showToast("Perfil atualizado com sucesso!", "success");
      setCurrentPassword("");
      setNewPassword("");
      onClose();
    } catch (err) {
      setError(err.message || "Erro ao atualizar dados do perfil.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card glass-panel" style={{ maxWidth: 460 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div className="user-avatar-circle" style={{ width: 36, height: 36, fontSize: "1rem" }}>
              {user.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div>
              <h3 className="modal-title">Meu Perfil</h3>
              <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--text-muted)" }}>
                ID #{user.id} • Conta Ativa
              </p>
            </div>
          </div>
          <button className="icon-btn close-modal-btn" onClick={onClose} aria-label="Fechar">
            <X size={18} />
          </button>
        </div>

        {error && (
          <div className="auth-error-banner" style={{ margin: "1rem 1.5rem 0" }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="modal-form" style={{ padding: "1.25rem 1.5rem" }}>
          <div className="form-group">
            <label className="form-label">Nome Completo</label>
            <div className="auth-input-wrapper">
              <User size={18} className="auth-input-icon" />
              <input
                type="text"
                className="auth-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">E-mail</label>
            <div className="auth-input-wrapper">
              <Mail size={18} className="auth-input-icon" />
              <input
                type="email"
                className="auth-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div style={{ margin: "1rem 0 0.5rem", borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "1rem" }}>
            <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--text-muted)" }}>
              Alterar Senha (Opcional)
            </span>
          </div>

          <div className="form-group">
            <label className="form-label">Senha Atual</label>
            <div className="auth-input-wrapper">
              <Lock size={18} className="auth-input-icon" />
              <input
                type="password"
                className="auth-input"
                placeholder="Sua senha atual"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Nova Senha</label>
            <div className="auth-input-wrapper">
              <Lock size={18} className="auth-input-icon" />
              <input
                type="password"
                className="auth-input"
                placeholder="Mínimo 4 caracteres"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-actions" style={{ marginTop: "1.25rem" }}>
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <Save size={16} />
              <span>{loading ? "Salvando..." : "Salvar Alterações"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
