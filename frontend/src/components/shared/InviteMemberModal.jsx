import React, { useState } from "react";
import {
  X,
  UserPlus,
  Mail,
  Link2,
  Check,
  Copy,
  Shield,
  Send,
  Globe,
  MessageCircle,
  Share2
} from "lucide-react";

export const InviteMemberModal = ({ isOpen, onClose, onAddMember }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Editor");
  const [copied, setCopied] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  if (!isOpen) return null;

  const inviteLink = "https://finflow.app/join/casa-compartilhada-98d1a";

  const handleCopy = () => {
    navigator.clipboard?.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleInvite = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    const initials = name.trim().split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
    const colors = ["#dbeafe", "#fce7f3", "#fef3c7", "#dcfce7", "#ede9fe"];
    const randomBg = colors[Math.floor(Math.random() * colors.length)];

    onAddMember({
      id: Date.now(),
      name: name.trim(),
      email: email.trim(),
      role: role,
      avatar: initials,
      avatarBg: randomBg,
    });

    setSuccessMsg(true);
    setTimeout(() => {
      setSuccessMsg(false);
      setName("");
      setEmail("");
      onClose();
    }, 1200);
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(`Olá! Estou te convidando para o nosso Espaço Compartilhado no FinFlow Pro para dividirmos despesas: ${inviteLink}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container invite-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-with-icon">
            <div className="modal-title-icon green">
              <UserPlus size={20} />
            </div>
            <div>
              <h3>Convidar pessoas para o espaço</h3>
              <p className="modal-subtitle">Convide familiares, amigos ou parceiros de qualquer lugar</p>
            </div>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {successMsg ? (
          <div className="invite-success-box">
            <div className="success-icon-large">
              <Check size={32} />
            </div>
            <h4>Convite enviado com sucesso!</h4>
            <p>Novo membro adicionado ao espaço compartilhado.</p>
          </div>
        ) : (
          <form onSubmit={handleInvite} className="invite-form-body">
            {/* Quick Share Buttons */}
            <div className="invite-quick-share-row">
              <button
                type="button"
                className="quick-share-btn whatsapp"
                onClick={handleWhatsAppShare}
              >
                <MessageCircle size={16} />
                <span>Convidar via WhatsApp</span>
              </button>
              <button
                type="button"
                className="quick-share-btn link"
                onClick={handleCopy}
              >
                {copied ? <Check size={16} color="#10b981" /> : <Copy size={16} />}
                <span>{copied ? "Link Copiado!" : "Copiar Link do Espaço"}</span>
              </button>
            </div>

            <div className="invite-divider">
              <span>ou convide por e-mail</span>
            </div>

            <div className="form-group">
              <label className="form-label">Nome Completo</label>
              <input
                type="text"
                className="form-input"
                placeholder="Ex: Carlos Silva"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">E-mail ou Telefone</label>
              <div className="input-with-icon">
                <Mail size={16} className="field-icon" />
                <input
                  type="text"
                  className="form-input with-icon"
                  placeholder="Ex: carlos@email.com ou (11) 99999-9999"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Nível de Permissão</label>
              <div className="role-options-grid">
                <label className={`role-card ${role === "Editor" ? "selected" : ""}`}>
                  <input
                    type="radio"
                    name="role"
                    value="Editor"
                    checked={role === "Editor"}
                    onChange={(e) => setRole(e.target.value)}
                  />
                  <div>
                    <span className="role-title">Editor</span>
                    <span className="role-desc">Pode adicionar gastos e registrar acertos</span>
                  </div>
                </label>

                <label className={`role-card ${role === "Administrador" ? "selected" : ""}`}>
                  <input
                    type="radio"
                    name="role"
                    value="Administrador"
                    checked={role === "Administrador"}
                    onChange={(e) => setRole(e.target.value)}
                  />
                  <div>
                    <span className="role-title">Administrador</span>
                    <span className="role-desc">Acesso total e gestão de membros</span>
                  </div>
                </label>

                <label className={`role-card ${role === "Visualizador" ? "selected" : ""}`}>
                  <input
                    type="radio"
                    name="role"
                    value="Visualizador"
                    checked={role === "Visualizador"}
                    onChange={(e) => setRole(e.target.value)}
                  />
                  <div>
                    <span className="role-title">Visualizador</span>
                    <span className="role-desc">Apenas consulta relatórios e saldo</span>
                  </div>
                </label>
              </div>
            </div>

            <div className="invite-modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary">
                <Send size={15} />
                <span>Enviar Convite</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
