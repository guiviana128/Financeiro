import React from "react";
import { X } from "lucide-react";
import { ProfileView } from "../profile/ProfileView";

export const UserProfileModal = ({ isOpen, onClose }) => {
  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 1100 }}>
      <div
        className="modal-content"
        style={{
          maxWidth: 1080,
          padding: "24px 28px",
          maxHeight: "92vh",
          overflowY: "auto",
          position: "relative",
          background: "#ffffff"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="search-close-x-btn"
          style={{ position: "absolute", top: 20, right: 20, zIndex: 10 }}
          onClick={onClose}
          title="Fechar"
        >
          <X size={20} />
        </button>

        <ProfileView onNavigateHome={onClose} />
      </div>
    </div>
  );
};
