import React from "react";
import { CheckCircle2, AlertCircle, Info } from "lucide-react";

export const Toast = ({ message, type = "success" }) => {
  if (!message) return null;

  const getIcon = () => {
    switch (type) {
      case "error":
        return <AlertCircle size={18} color="#f43f5e" />;
      case "info":
        return <Info size={18} color="#06b6d4" />;
      default:
        return <CheckCircle2 size={18} color="#10b981" />;
    }
  };

  const getBorderColor = () => {
    switch (type) {
      case "error":
        return "rgba(244, 63, 94, 0.4)";
      case "info":
        return "rgba(6, 182, 212, 0.4)";
      default:
        return "rgba(16, 185, 129, 0.4)";
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        background: "var(--bg-secondary)",
        border: `1px solid ${getBorderColor()}`,
        borderRadius: "var(--radius-md)",
        padding: "14px 20px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        boxShadow: "var(--shadow-lg)",
        zIndex: 1000,
        animation: "fadeIn 0.3s ease",
        color: "var(--text-primary)",
        fontSize: "0.9rem",
        fontWeight: "600"
      }}
    >
      {getIcon()}
      <span>{message}</span>
    </div>
  );
};
