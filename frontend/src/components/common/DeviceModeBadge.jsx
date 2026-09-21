import React, { useState, useRef, useEffect } from "react";
import { Smartphone, Monitor, Sparkles, Check, ChevronDown } from "lucide-react";
import { useDevice } from "../../context/DeviceContext";

export const DeviceModeBadge = ({ compact = false }) => {
  const { viewMode, setViewMode, isMobileView, detectedDevice } = useDevice();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const options = [
    {
      id: "auto",
      label: "Automático (Auto)",
      desc: `Detecta dispositivo (${detectedDevice === "mobile" ? "Celular" : "Computador"})`,
      icon: Sparkles,
      color: "#818cf8"
    },
    {
      id: "mobile",
      label: "Modo Celular (Mobile)",
      desc: "Interface vertical com navegação inferior",
      icon: Smartphone,
      color: "#10b981"
    },
    {
      id: "desktop",
      label: "Modo Web (Desktop)",
      desc: "Layout amplo com menu lateral fixo",
      icon: Monitor,
      color: "#38bdf8"
    }
  ];

  const currentOption = options.find((o) => o.id === viewMode) || options[0];

  return (
    <div className="device-mode-selector-wrapper" ref={dropdownRef} style={{ position: "relative" }}>
      <button
        type="button"
        className={`device-mode-badge-btn ${isMobileView ? "is-mobile-active" : "is-desktop-active"}`}
        onClick={() => setIsOpen((prev) => !prev)}
        title={`Modo Atual: ${isMobileView ? "Web Celular" : "Web Desktop"}. Clique para alterar.`}
        aria-label="Alternar Modo Celular ou Web"
      >
        <span className="pulse-indicator-dot" />
        {isMobileView ? (
          <Smartphone size={14} className="device-mode-icon" />
        ) : (
          <Monitor size={14} className="device-mode-icon" />
        )}
        {!compact && (
          <span className="device-mode-label">
            {isMobileView ? "Web Celular" : "Web Desktop"}
          </span>
        )}
        {viewMode === "auto" && !compact && (
          <span className="auto-pill">Auto</span>
        )}
        <ChevronDown size={12} className={`chevron-arrow ${isOpen ? "open" : ""}`} />
      </button>

      {isOpen && (
        <div className="device-mode-dropdown glass-panel">
          <div className="device-mode-dropdown-header">
            <span style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", color: "var(--text-muted)", letterSpacing: "0.5px" }}>
              Identificação de Visualização
            </span>
          </div>
          <div className="device-mode-options-list">
            {options.map((opt) => {
              const IconComp = opt.icon;
              const isSelected = viewMode === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  className={`device-mode-option-item ${isSelected ? "selected" : ""}`}
                  onClick={() => {
                    setViewMode(opt.id);
                    setIsOpen(false);
                  }}
                >
                  <div className="option-icon-box" style={{ background: `${opt.color}20`, color: opt.color }}>
                    <IconComp size={16} />
                  </div>
                  <div className="option-text-info">
                    <span className="option-title">{opt.label}</span>
                    <span className="option-desc">{opt.desc}</span>
                  </div>
                  {isSelected && <Check size={16} className="option-check-icon" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
