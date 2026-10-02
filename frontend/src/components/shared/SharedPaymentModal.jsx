import React, { useState } from "react";
import {
  X,
  Send,
  CheckCircle2,
  Copy,
  QrCode,
  ArrowRight,
  DollarSign,
  ShieldCheck
} from "lucide-react";
import { formatCurrency } from "../../utils/formatters";

export const SharedPaymentModal = ({ isOpen, onClose, data, onConfirm }) => {
  const [copied, setCopied] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  if (!isOpen || !data) return null;

  const pixKey = "rayza.huang@finflow.pix";

  const handleCopyPix = () => {
    navigator.clipboard?.writeText(pixKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleFinish = () => {
    setConfirmed(true);
    setTimeout(() => {
      onConfirm(data.id);
      setConfirmed(false);
      onClose();
    }, 1200);
  };

  const isReceiving = data.type === "receive";

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container settle-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-with-icon">
            <div className={`modal-title-icon ${isReceiving ? "green" : "teal"}`}>
              {isReceiving ? <CheckCircle2 size={20} /> : <Send size={20} />}
            </div>
            <div>
              <h3>{isReceiving ? "Registrar Recebimento" : "Pagar Acerto"}</h3>
              <p className="modal-subtitle">
                {isReceiving
                  ? `Confirmar acerto de ${data.person}`
                  : `Enviar pagamento para ${data.person}`}
              </p>
            </div>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {confirmed ? (
          <div className="invite-success-box">
            <div className="success-icon-large">
              <CheckCircle2 size={36} color="#10b981" />
            </div>
            <h4>{isReceiving ? "Recebimento confirmado!" : "Pagamento registrado!"}</h4>
            <p>O saldo e os acertos do espaço foram atualizados.</p>
          </div>
        ) : (
          <div className="settle-modal-body">
            <div className="settle-summary-card">
              <span className="settle-summary-lbl">Valor do Acerto</span>
              <span className="settle-summary-amount">{formatCurrency(data.amount)}</span>
              <span className="settle-summary-desc">{data.desc}</span>
            </div>

            {!isReceiving ? (
              <div className="pix-payment-box">
                <div className="pix-badge">
                  <QrCode size={16} />
                  <span>PIX Instantâneo</span>
                </div>
                <p className="pix-instruction">Copie a chave PIX de {data.person} para transferir:</p>
                <div className="pix-key-pill" onClick={handleCopyPix}>
                  <code>{pixKey}</code>
                  <button type="button" className="pix-copy-btn">
                    {copied ? <CheckCircle2 size={15} color="#10b981" /> : <Copy size={15} />}
                    <span>{copied ? "Copiado!" : "Copiar"}</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="receive-confirm-box">
                <ShieldCheck size={28} color="#10b981" />
                <p>
                  Ao confirmar, você atesta que <strong>{data.person}</strong> realizou o repasse de <strong>{formatCurrency(data.amount)}</strong> para você.
                </p>
              </div>
            )}

            <div className="invite-modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancelar
              </button>
              <button
                type="button"
                className={`btn ${isReceiving ? "btn-primary" : "btn-teal"}`}
                onClick={handleFinish}
              >
                {isReceiving ? "Confirmar Recebimento" : "Já paguei, registrar acerto"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
