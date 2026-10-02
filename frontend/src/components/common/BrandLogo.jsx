import React from "react";

export const BrandLogo = ({ name = "", size = 36, style = {} }) => {
  const brand = (name || "").toLowerCase().trim();

  const containerBase = {
    width: size,
    height: size,
    borderRadius: Math.round(size * 0.25),
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
    overflow: "hidden",
    ...style
  };

  // 1. NETFLIX
  if (brand.includes("netflix")) {
    return (
      <div style={{ ...containerBase, background: "#000000", boxShadow: "0 2px 8px rgba(0,0,0,0.35)" }}>
        <svg width={size * 0.52} height={size * 0.7} viewBox="0 0 24 34" fill="none">
          {/* Left Bar */}
          <path d="M0 0H7V34H0V0Z" fill="#B81D24" />
          {/* Right Bar */}
          <path d="M17 0H24V34H17V0Z" fill="#B81D24" />
          {/* Diagonal Ribbon with subtle gradient shadow */}
          <path d="M0 0H7L24 34H17L0 0Z" fill="#E50914" />
        </svg>
      </div>
    );
  }

  // 2. SPOTIFY
  if (brand.includes("spotify")) {
    return (
      <div style={{ ...containerBase, background: "#1DB954", borderRadius: "50%", boxShadow: "0 2px 8px rgba(29,185,84,0.3)" }}>
        <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 24 24" fill="#000000">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 6.63 5.37 12 12 12 6.63 0 12-5.37 12-12 0-6.63-5.37-12-12-12zm5.5 17.3c-.22.36-.68.48-1.04.26-2.85-1.74-6.44-2.13-10.66-1.17-.41.09-.81-.17-.9-.58-.09-.41.17-.81.58-.9 4.62-1.06 8.58-.61 11.76 1.34.36.22.48.68.26 1.05zm1.47-3.26c-.28.45-.87.59-1.32.31-3.26-2-8.23-2.58-12.09-1.41-.5.15-1.03-.13-1.18-.63s.13-1.03.63-1.18c4.41-1.34 9.9-.69 13.65 1.59.45.28.59.87.31 1.32zm.13-3.41C15.2 8.32 8.76 8.1 5.1 9.21c-.6.18-1.24-.16-1.42-.76s.16-1.24.76-1.42c4.21-1.28 11.31-1.02 15.8 1.64.54.32.72 1.02.4 1.56-.32.54-1.02.72-1.54.4z" />
        </svg>
      </div>
    );
  }

  // 3. DISNEY+
  if (brand.includes("disney")) {
    return (
      <div style={{ ...containerBase, background: "linear-gradient(135deg, #0f1c3f 0%, #113ccf 100%)", boxShadow: "0 2px 8px rgba(17,60,207,0.3)" }}>
        <span style={{ color: "#ffffff", fontWeight: 900, fontSize: size * 0.36, letterSpacing: -0.5 }}>
          Disney<span style={{ color: "#38bdf8" }}>+</span>
        </span>
      </div>
    );
  }

  // 4. MAX / HBO MAX
  if (brand.includes("max") || brand.includes("hbo")) {
    return (
      <div style={{ ...containerBase, background: "#002be7", boxShadow: "0 2px 8px rgba(0,43,231,0.3)" }}>
        <span style={{ color: "#ffffff", fontWeight: 900, fontSize: size * 0.42, fontStyle: "italic", letterSpacing: -1 }}>
          MAX
        </span>
      </div>
    );
  }

  // 5. YOUTUBE / YOUTUBE PREMIUM
  if (brand.includes("youtube")) {
    return (
      <div style={{ ...containerBase, background: "#ff0000", boxShadow: "0 2px 8px rgba(255,0,0,0.3)" }}>
        <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 24 24" fill="#ffffff">
          <path d="M10 15l5.19-3L10 9v6z" />
        </svg>
      </div>
    );
  }

  // 6. PRIME VIDEO / AMAZON
  if (brand.includes("prime") || brand.includes("amazon")) {
    return (
      <div style={{ ...containerBase, background: "#00a8e1", boxShadow: "0 2px 8px rgba(0,168,225,0.3)" }}>
        <svg width={size * 0.65} height={size * 0.65} viewBox="0 0 24 24">
          <path fill="#ffffff" d="M13.5 14.5c-2.5 0-4.5-1-5.5-2.5-.2-.3 0-.6.3-.7l1-.3c.3 0 .5.1.7.3.7 1 2 1.7 3.5 1.7 1.5 0 2.8-.7 3.5-1.7.2-.2.4-.3.7-.3l1 .3c.3.1.5.4.3.7-1 1.5-3 2.5-5.5 2.5z" />
          <path fill="#ffffff" d="M20.5 18c-5.5 3.5-12.5 2.5-17-.5-.2-.1-.2-.4 0-.5.4-.2.9-.4 1.4-.6.2-.1.4 0 .5.1 3.8 2.5 9.8 3.2 14.5.3.3-.2.6 0 .6.3.1.3.1.6 0 .9z" />
        </svg>
      </div>
    );
  }

  // 7. APPLE TV+ / APPLE MUSIC / ICLOUD
  if (brand.includes("apple") || brand.includes("icloud")) {
    return (
      <div style={{ ...containerBase, background: "linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)", boxShadow: "0 2px 8px rgba(2,132,199,0.3)" }}>
        <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 24 24" fill="#ffffff">
          <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" />
        </svg>
      </div>
    );
  }

  // 8. GOOGLE ONE / GOOGLE
  if (brand.includes("google") || brand.includes("one")) {
    return (
      <div style={{ ...containerBase, background: "#ffffff", border: "1px solid #e2e8f0" }}>
        <svg width={size * 0.65} height={size * 0.65} viewBox="0 0 48 48">
          <path fill="#4285F4" d="M24 4L12 16h8v24h8V16h8L24 4z" />
          <path fill="#34A853" d="M12 16v16l8-8z" />
          <path fill="#FBBC05" d="M28 24l8 8V16z" />
          <path fill="#EA4335" d="M20 40h8v4h-8z" />
        </svg>
      </div>
    );
  }

  // 9. CHATGPT / OPENAI
  if (brand.includes("chatgpt") || brand.includes("openai")) {
    return (
      <div style={{ ...containerBase, background: "#10a37f", boxShadow: "0 2px 8px rgba(16,163,127,0.3)" }}>
        <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 24 24" fill="#ffffff">
          <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.259 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7466-7.0729z" />
        </svg>
      </div>
    );
  }

  // 10. NOTION
  if (brand.includes("notion")) {
    return (
      <div style={{ ...containerBase, background: "#ffffff", border: "1px solid #e2e8f0" }}>
        <svg width={size * 0.65} height={size * 0.65} viewBox="0 0 24 24" fill="#000000">
          <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l11.43-.84c1.12-.093 1.354-.42 1.027-1.12-.28-.56-.934-.98-1.914-.934L4.925 2.574C3.898 2.668 3.525 3.46 4.46 4.208zm.933 3.921v12.27c0 1.026.56 1.493 1.68 1.4l11.243-.653c1.12-.093 1.493-.746 1.493-1.68V6.915c0-.933-.466-1.4-1.4-1.306l-11.43.653c-.933.093-1.586.653-1.586 1.867zm11.104.933c.093.42 0 .84-.42.887l-1.073.233v8.587l-2.473.14-3.5-5.693v5.04l1.633.28c.373.046.466.42.373.84-.093.373-.42.513-.886.56l-3.033.187c-.467.046-.607-.28-.514-.653.094-.374.374-.467.84-.514l1.12-.14V9.62l-1.306-.093c-.467-.047-.56-.374-.467-.747.093-.42.42-.56.933-.607l3.22-.186 3.687 5.833V9.808l-1.4-.233c-.373-.047-.466-.42-.373-.84.093-.373.42-.513.886-.56l3.173-.187c.467-.046.607.28.514.653z" />
        </svg>
      </div>
    );
  }

  // 11. SMART FIT / ACADEMIA
  if (brand.includes("smart fit") || brand.includes("smartfit") || brand.includes("academia")) {
    return (
      <div style={{ ...containerBase, background: "#18181b", border: "1px solid #27272a" }}>
        <span style={{ color: "#fbbf24", fontWeight: 900, fontSize: size * 0.38, lineHeight: 1, letterSpacing: -0.5 }}>
          fit
        </span>
      </div>
    );
  }

  // 12. GYMPASS / WELLHUB
  if (brand.includes("gympass") || brand.includes("wellhub")) {
    return (
      <div style={{ ...containerBase, background: "#f43f5e", boxShadow: "0 2px 8px rgba(244,63,94,0.3)" }}>
        <span style={{ color: "#ffffff", fontWeight: 900, fontSize: size * 0.36 }}>
          gym
        </span>
      </div>
    );
  }

  // 13. XBOX / GAME PASS
  if (brand.includes("xbox") || brand.includes("game pass")) {
    return (
      <div style={{ ...containerBase, background: "#107c10", boxShadow: "0 2px 8px rgba(16,124,16,0.3)" }}>
        <svg width={size * 0.65} height={size * 0.65} viewBox="0 0 24 24" fill="#ffffff">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 3.25c1.88 0 3.65.59 5.12 1.6-1.57 1.48-4.22 4.1-5.12 5.05-.9-.95-3.55-3.57-5.12-5.05A8.72 8.72 0 0112 3.25zM4.2 6.5c1.47 1.48 4.2 4.2 4.8 5.1-1.6 2.6-3.8 6.1-4.8 7.6A8.7 8.7 0 013.25 12c0-2.02.69-3.9 1.85-5.5zm15.6 0A8.7 8.7 0 0120.75 12c0 2.02-.69 3.9-1.85 5.5-1-1.5-3.2-5-4.8-7.6.6-.9 3.33-3.62 4.8-5.1z" />
        </svg>
      </div>
    );
  }

  // 14. PLAYSTATION / PS PLUS
  if (brand.includes("playstation") || brand.includes("ps plus") || brand.includes("psn")) {
    return (
      <div style={{ ...containerBase, background: "#003791", boxShadow: "0 2px 8px rgba(0,55,145,0.3)" }}>
        <span style={{ color: "#ffffff", fontWeight: 900, fontSize: size * 0.42 }}>
          PS
        </span>
      </div>
    );
  }

  // 15. IFOOD / IFOOD CLUBE
  if (brand.includes("ifood")) {
    return (
      <div style={{ ...containerBase, background: "#ea1d2c", boxShadow: "0 2px 8px rgba(234,29,44,0.3)" }}>
        <span style={{ color: "#ffffff", fontWeight: 900, fontSize: size * 0.32, fontStyle: "italic" }}>
          iFood
        </span>
      </div>
    );
  }

  // 16. DUOLINGO
  if (brand.includes("duolingo")) {
    return (
      <div style={{ ...containerBase, background: "#58cc02", boxShadow: "0 2px 8px rgba(88,204,2,0.3)" }}>
        <span style={{ color: "#ffffff", fontWeight: 900, fontSize: size * 0.45 }}>
          duo
        </span>
      </div>
    );
  }

  // 17. DISCORD / DISCORD NITRO
  if (brand.includes("discord") || brand.includes("nitro")) {
    return (
      <div style={{ ...containerBase, background: "#5865F2", boxShadow: "0 2px 8px rgba(88,101,242,0.3)" }}>
        <svg width={size * 0.65} height={size * 0.65} viewBox="0 0 24 24" fill="#ffffff">
          <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
        </svg>
      </div>
    );
  }

  // 18. UBER / UBER ONE
  if (brand.includes("uber")) {
    return (
      <div style={{ ...containerBase, background: "#000000", boxShadow: "0 2px 8px rgba(0,0,0,0.3)" }}>
        <span style={{ color: "#ffffff", fontWeight: 900, fontSize: size * 0.32, letterSpacing: -0.5 }}>
          Uber
        </span>
      </div>
    );
  }

  // 19. NUBANK
  if (brand.includes("nubank") || brand.includes("nu")) {
    return (
      <div style={{ ...containerBase, background: "linear-gradient(135deg, #6d28d9 0%, #7c3aed 100%)", boxShadow: "0 2px 8px rgba(124,58,237,0.35)" }}>
        <span style={{ color: "#ffffff", fontWeight: 900, fontSize: size * 0.42, fontStyle: "italic", letterSpacing: -1 }}>
          nu
        </span>
      </div>
    );
  }

  // 20. ITAÚ
  if (brand.includes("itau") || brand.includes("itaú")) {
    return (
      <div style={{ ...containerBase, background: "#ec5d07", boxShadow: "0 2px 8px rgba(236,93,7,0.3)" }}>
        <span style={{ color: "#ffffff", fontWeight: 900, fontSize: size * 0.36, letterSpacing: -0.5 }}>
          Itaú
        </span>
      </div>
    );
  }

  // Default fallback circle
  return (
    <div
      style={{
        ...containerBase,
        background: "#f1f5f9",
        color: "#64748b",
        fontWeight: 800,
        fontSize: size * 0.4
      }}
    >
      {name ? name.charAt(0).toUpperCase() : "S"}
    </div>
  );
};
