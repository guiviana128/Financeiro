import React, { useState } from "react";
import { Modal } from "../common/Modal";
import { Zap, Smartphone, Shield, Link2, Copy, Check, Play, Sparkles, AlertCircle, ArrowRight, Lock } from "lucide-react";
import { useFinance } from "../../context/FinanceContext";
import { api } from "../../services/api";
import { formatCurrency, maskCPF } from "../../utils/formatters";

export const BankAutomationModal = ({ isOpen, onClose }) => {
  const { creditCards, showToast, refresh } = useFinance();
  const [activeTab, setActiveTab] = useState("simulator"); // 'simulator', 'guide_android', 'guide_ios', 'guide_webhook'
  const [copiedField, setCopiedField] = useState(null);
  
  // Simulator State
  const [selectedCardId, setSelectedCardId] = useState(creditCards[0]?.id ? String(creditCards[0].id) : "");
  const [merchant, setMerchant] = useState("iFood *Restaurante");
  const [amount, setAmount] = useState("45.90");
  const [installments, setInstallments] = useState("1");
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState(null);

  useEffect(() => {
    if (creditCards.length > 0 && !selectedCardId) {
      setSelectedCardId(String(creditCards[0].id));
    }
  }, [creditCards, selectedCardId]);

  const selectedCard = creditCards.find(c => String(c.id) === String(selectedCardId)) || creditCards[0];

  const handleCopy = (text, fieldKey) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldKey);
    setTimeout(() => setCopiedField(null), 2500);
  };

  // Play a pleasant notification chime using browser Web Audio API
  const playChimeSound = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880.00, audioCtx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.35);
    } catch (e) {
      // Audio context might be restricted before interaction
    }
  };

  const handleRunSimulation = async (e) => {
    e.preventDefault();
    if (!selectedCard) {
      showToast("Nenhum cartão cadastrado para simulação.", "error");
      return;
    }

    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount <= 0) {
      showToast("Insira um valor válido para a compra.", "error");
      return;
    }

    setIsSimulating(true);
    setSimulationResult(null);

    try {
      const payload = {
        bank: selectedCard.bank,
        card_id: selectedCard.id,
        cpf: selectedCard.holder_cpf || undefined,
        card_last_four: selectedCard.last_four,
        merchant: merchant.trim() || "Compra no Cartão",
        amount: numAmount,
        installments: parseInt(installments, 10) || 1,
        notes: `Notificação Push simulada (${selectedCard.bank}) • CPF: ${selectedCard.holder_cpf || "Não informado"}`
      };

      const res = await api.simulateBankPurchase(payload);
      playChimeSound();
      setSimulationResult(res);
      showToast(res.message || "Compra recebida com sucesso pelo sistema!", "success");
      await refresh();
    } catch (err) {
      showToast(err.message || "Erro ao processar simulação de compra.", "error");
    } finally {
      setIsSimulating(false);
    }
  };

  const webhookUrl = "http://localhost:8000/api/open-finance/webhook/purchase";

  const sampleJson = JSON.stringify({
    bank: selectedCard?.bank || "Nubank",
    cpf: selectedCard?.holder_cpf || "123.456.789-00",
    merchant: "iFood *Restaurante",
    amount: 45.90,
    installments: 1
  }, null, 2);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Central de Automações & Notificações Bancárias" maxWidth="820px">
      <div className="modal-body" style={{ gap: 20 }}>
        {/* Navigation Tabs */}
        <div style={{ display: "flex", gap: 8, borderBottom: "1px solid var(--border-color)", paddingBottom: 10, flexWrap: "wrap" }}>
          <button
            type="button"
            className={`btn ${activeTab === "simulator" ? "btn-primary" : "btn-secondary"}`}
            style={{ fontSize: "0.82rem", padding: "6px 14px" }}
            onClick={() => setActiveTab("simulator")}
          >
            <Play size={14} />
            <span>Testar / Simular Notificação</span>
          </button>
          <button
            type="button"
            className={`btn ${activeTab === "guide_android" ? "btn-primary" : "btn-secondary"}`}
            style={{ fontSize: "0.82rem", padding: "6px 14px" }}
            onClick={() => setActiveTab("guide_android")}
          >
            <Smartphone size={14} />
            <span>Android (MacroDroid / Tasker)</span>
          </button>
          <button
            type="button"
            className={`btn ${activeTab === "guide_ios" ? "btn-primary" : "btn-secondary"}`}
            style={{ fontSize: "0.82rem", padding: "6px 14px" }}
            onClick={() => setActiveTab("guide_ios")}
          >
            <Smartphone size={14} />
            <span>iPhone (Atalhos iOS)</span>
          </button>
          <button
            type="button"
            className={`btn ${activeTab === "guide_webhook" ? "btn-primary" : "btn-secondary"}`}
            style={{ fontSize: "0.82rem", padding: "6px 14px" }}
            onClick={() => setActiveTab("guide_webhook")}
          >
            <Link2 size={14} />
            <span>Webhook de Bancos (API)</span>
          </button>
        </div>

        {/* TAB 1: LIVE SIMULATOR */}
        {activeTab === "simulator" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div
              style={{
                background: "linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(139, 92, 246, 0.05) 100%)",
                border: "1px solid rgba(99, 102, 241, 0.3)",
                borderRadius: "var(--radius-lg)",
                padding: "16px 20px",
                display: "flex",
                alignItems: "center",
                gap: 14
              }}
            >
              <div style={{ width: 42, height: 42, borderRadius: "50%", background: "var(--accent-primary)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", flexShrink: 0 }}>
                <Zap size={22} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: "1rem" }}>
                  Simulador de Compras & Automação Instantânea
                </div>
                <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>
                  Dispare uma notificação bancária de teste vinculada ao CPF e veja a compra cair no site em tempo real, atualizando limite e faturas.
                </div>
              </div>
            </div>

            {creditCards.length === 0 ? (
              <div
                style={{
                  padding: "24px 20px",
                  background: "var(--bg-subtle)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "var(--radius-lg)",
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 12
                }}
              >
                <AlertCircle size={36} color="var(--accent-primary)" />
                <div style={{ fontWeight: 700, fontSize: "1rem" }}>
                  Nenhum cartão de crédito cadastrado ainda
                </div>
                <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", maxWidth: 460 }}>
                  Para testar a automação e simular notificações de compras, cadastre pelo menos um cartão com seu banco e CPF na tela de cartões.
                </div>
              </div>
            ) : (
              <form onSubmit={handleRunSimulation} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div className="form-row-2">
                  <div className="form-group">
                    <label className="form-label">Selecione o Cartão / Banco Cadastrado</label>
                    <select
                      className="form-select"
                      value={selectedCardId}
                      onChange={(e) => setSelectedCardId(e.target.value)}
                      required
                    >
                      {creditCards.map(c => (
                        <option key={c.id} value={c.id}>
                          {c.name} ({c.bank}) • Final {c.last_four} {c.holder_cpf ? `[CPF: ${maskCPF(c.holder_cpf)}]` : ""}
                        </option>
                      ))}
                    </select>
                  </div>

                <div className="form-group">
                  <label className="form-label">CPF Vinculado para Autenticação</label>
                  <div
                    style={{
                      padding: "10px 14px",
                      borderRadius: "var(--radius-md)",
                      background: "var(--bg-subtle)",
                      border: "1px solid var(--border-color)",
                      fontSize: "0.88rem",
                      fontWeight: 600,
                      color: selectedCard?.holder_cpf ? "var(--text-primary)" : "var(--text-muted)",
                      display: "flex",
                      alignItems: "center",
                      gap: 8
                    }}
                  >
                    <Lock size={15} color={selectedCard?.holder_cpf ? "#10b981" : "var(--text-muted)"} />
                    <span>{selectedCard?.holder_cpf ? maskCPF(selectedCard.holder_cpf) : "Nenhum CPF informado no cadastro deste cartão"}</span>
                  </div>
                </div>
              </div>

              {/* Quick Preset Merchant Buttons */}
              <div>
                <label className="form-label" style={{ fontSize: "0.78rem" }}>Exemplos Rápidos de Estabelecimentos</label>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {[
                    { name: "iFood *Restaurante", amt: "54.90", installments: "1" },
                    { name: "Posto Shell Combustível", amt: "180.00", installments: "1" },
                    { name: "Uber *Viagem", amt: "28.50", installments: "1" },
                    { name: "Supermercado Carrefour", amt: "340.20", installments: "1" },
                    { name: "Amazon Brasil (Smartphone)", amt: "1200.00", installments: "10" },
                    { name: "Netflix Mensalidade", amt: "55.90", installments: "1" }
                  ].map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setMerchant(preset.name);
                        setAmount(preset.amt);
                        setInstallments(preset.installments);
                      }}
                      style={{
                        padding: "5px 10px",
                        borderRadius: "var(--radius-sm)",
                        background: merchant === preset.name ? "var(--accent-glow)" : "var(--bg-subtle)",
                        border: merchant === preset.name ? "1px solid var(--accent-primary)" : "1px solid var(--border-color)",
                        fontSize: "0.75rem",
                        color: merchant === preset.name ? "var(--accent-primary)" : "var(--text-secondary)",
                        cursor: "pointer",
                        fontWeight: 600
                      }}
                    >
                      {preset.name} (R$ {preset.amt})
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Nome do Estabelecimento / Loja</label>
                  <input
                    type="text"
                    className="form-input"
                    value={merchant}
                    onChange={(e) => setMerchant(e.target.value)}
                    placeholder="Ex: iFood, Posto Shell, Amazon"
                    required
                  />
                </div>

                <div className="form-row-2" style={{ gridTemplateColumns: "1fr 1fr" }}>
                  <div className="form-group">
                    <label className="form-label">Valor da Compra (R$)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      className="form-input"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Parcelas</label>
                    <select
                      className="form-select"
                      value={installments}
                      onChange={(e) => setInstallments(e.target.value)}
                    >
                      <option value="1">1x (À vista)</option>
                      <option value="2">2x</option>
                      <option value="3">3x</option>
                      <option value="6">6x</option>
                      <option value="10">10x</option>
                      <option value="12">12x</option>
                    </select>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSimulating}
                style={{
                  padding: "12px 20px",
                  fontSize: "0.95rem",
                  fontWeight: 700,
                  justifyContent: "center",
                  background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                  boxShadow: "0 4px 15px rgba(99, 102, 241, 0.4)"
                }}
              >
                {isSimulating ? (
                  <span>Processando Notificação...</span>
                ) : (
                  <>
                    <Play size={18} />
                    <span>Disparar Notificação do Banco Agora</span>
                  </>
                )}
              </button>
            </form>
            )}

            {/* Simulation Result Card */}
            {simulationResult && (
              <div
                style={{
                  background: "rgba(16, 185, 129, 0.1)",
                  border: "1px solid rgba(16, 185, 129, 0.3)",
                  borderRadius: "var(--radius-md)",
                  padding: "14px 18px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 8
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#10b981", fontWeight: 700 }}>
                  <Check size={18} />
                  <span>Notificação Processada com Sucesso!</span>
                </div>
                <div style={{ fontSize: "0.85rem", color: "var(--text-primary)" }}>
                  {simulationResult.message}
                </div>
                <div style={{ display: "flex", gap: 16, fontSize: "0.78rem", color: "var(--text-secondary)", flexWrap: "wrap", marginTop: 4 }}>
                  <span>Categoria detectada: <strong style={{ color: "var(--accent-primary)" }}>{simulationResult.category?.name}</strong></span>
                  <span>Fatura Atualizada: <strong>{formatCurrency(simulationResult.card?.current_bill)}</strong></span>
                  <span>Limite Disponível: <strong style={{ color: "#10b981" }}>{formatCurrency(simulationResult.card?.available_limit)}</strong></span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: ANDROID GUIDE */}
        {activeTab === "guide_android" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14, fontSize: "0.88rem", lineHeight: 1.5 }}>
            <div style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text-primary)" }}>
              Automação no Android (Via MacroDroid ou Tasker)
            </div>
            <p style={{ color: "var(--text-secondary)" }}>
              O MacroDroid é um aplicativo gratuito da Play Store que permite ler as notificações emitidas pelo app do seu banco (ex: Nubank, Inter, Itaú, C6) e enviar automaticamente para o seu site.
            </p>

            <ol style={{ paddingLeft: 20, display: "flex", flexDirection: "column", gap: 8, color: "var(--text-primary)" }}>
              <li>Instale o <strong>MacroDroid</strong> na Google Play Store.</li>
              <li>Toque em <strong>Adicionar Macro</strong>.</li>
              <li>Em <strong>Gatilhos (+)</strong> ➡️ escolha <strong>Eventos do Dispositivo</strong> ➡️ <strong>Notificação</strong> ➡️ <strong>Notificação Recebida</strong>.</li>
              <li>Selecione o aplicativo do seu banco (ex: <em>Nubank</em>, <em>Banco Inter</em>).</li>
              <li>Em <strong>Ações (+)</strong> ➡️ escolha <strong>Conectividade</strong> ➡️ <strong>Abrir Website / Requisição HTTP</strong>:
                <ul style={{ marginTop: 6, color: "var(--text-secondary)", fontSize: "0.82rem" }}>
                  <li><strong>Método:</strong> POST</li>
                  <li><strong>URL do Webhook:</strong> <code>{webhookUrl}</code></li>
                  <li><strong>Content-Type:</strong> application/json</li>
                </ul>
              </li>
            </ol>

            {/* Code snippet */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <span style={{ fontSize: "0.8rem", fontWeight: 600 }}>Corpo da Requisição (JSON para copiar):</span>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ fontSize: "0.75rem", padding: "4px 10px" }}
                  onClick={() => handleCopy(sampleJson, "json_android")}
                >
                  {copiedField === "json_android" ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                  <span>{copiedField === "json_android" ? "Copiado!" : "Copiar JSON"}</span>
                </button>
              </div>
              <pre style={{ background: "var(--bg-input)", padding: 12, borderRadius: "var(--radius-md)", fontSize: "0.8rem", overflowX: "auto", border: "1px solid var(--border-color)" }}>
                {sampleJson}
              </pre>
            </div>
          </div>
        )}

        {/* TAB 3: IOS GUIDE */}
        {activeTab === "guide_ios" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14, fontSize: "0.88rem", lineHeight: 1.5 }}>
            <div style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text-primary)" }}>
              Automação no iPhone / iOS (Via App Atalhos / Shortcuts)
            </div>
            <p style={{ color: "var(--text-secondary)" }}>
              No iOS, você pode utilizar o aplicativo nativo <strong>Atalhos (Shortcuts)</strong> da Apple para disparar a requisição assim que o app do banco receber uma notificação ou transação Apple Pay.
            </p>

            <ol style={{ paddingLeft: 20, display: "flex", flexDirection: "column", gap: 8, color: "var(--text-primary)" }}>
              <li>Abra o aplicativo <strong>Atalhos</strong> no iPhone.</li>
              <li>Acesse a aba <strong>Automação</strong> no menu inferior e toque no botão <strong>(+)</strong>.</li>
              <li>Escolha <strong>Transação da Carteira (Apple Pay)</strong> ou <strong>Notificação Recebida</strong>.</li>
              <li>Adicione a ação <strong>Obter Conteúdo do URL</strong>:
                <ul style={{ marginTop: 6, color: "var(--text-secondary)", fontSize: "0.82rem" }}>
                  <li><strong>Método:</strong> POST</li>
                  <li><strong>URL:</strong> <code>{webhookUrl}</code></li>
                  <li><strong>Cabeçalhos:</strong> Content-Type = application/json</li>
                </ul>
              </li>
              <li>Pronto! A compra cai instantaneamente no seu painel.</li>
            </ol>
          </div>
        )}

        {/* TAB 4: WEBHOOK API GUIDE */}
        {activeTab === "guide_webhook" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14, fontSize: "0.88rem", lineHeight: 1.5 }}>
            <div style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text-primary)" }}>
              Integração Direta via Webhook REST API
            </div>
            <p style={{ color: "var(--text-secondary)" }}>
              Se você possui conta de desenvolvedor em bancos como <strong>Banco Inter</strong>, <strong>Asaas</strong>, <strong>Mercado Pago</strong>, <strong>Cora</strong> ou <strong>Stripe</strong>, você pode cadastrar a URL de Webhook diretamente no painel do banco.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span style={{ fontSize: "0.8rem", fontWeight: 600 }}>Endpoint Público de Webhook:</span>
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  type="text"
                  readOnly
                  className="form-input"
                  value={webhookUrl}
                  style={{ fontFamily: "monospace", fontSize: "0.85rem" }}
                />
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => handleCopy(webhookUrl, "endpoint_url")}
                >
                  {copiedField === "endpoint_url" ? <Check size={16} color="#10b981" /> : <Copy size={16} />}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" onClick={onClose}>
          Fechar
        </button>
      </div>
    </Modal>
  );
};
