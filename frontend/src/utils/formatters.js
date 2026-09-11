// Format currency to BRL
export const formatCurrency = (value, isPrivacy = false) => {
  if (isPrivacy) return "••••••";
  if (value === null || value === undefined || isNaN(value)) return "R$ 0,00";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  }).format(value);
};

// Get local today date as "YYYY-MM-DD"
export const getTodayDate = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Format short date (DD/MM/YYYY)
export const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  const clean = typeof dateStr === "string" ? dateStr.split("T")[0] : "";
  const parts = clean.split("-");
  if (parts.length === 3) {
    const [year, month, day] = parts;
    return `${day.padStart(2, "0")}/${month.padStart(2, "0")}/${year}`;
  }
  try {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${day}/${month}/${year}`;
    }
  } catch (e) {}
  return String(dateStr);
};

// Format month name (e.g., "2026-09" -> "Setembro de 2026")
export const formatMonthLong = (monthStr) => {
  if (!monthStr) return "";
  const clean = typeof monthStr === "string" ? monthStr.split("T")[0] : "";
  const parts = clean.split("-");
  if (parts.length < 2) return monthStr;
  const year = parts[0];
  const month = parts[1];
  const monthNames = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];
  const idx = parseInt(month, 10) - 1;
  return `${monthNames[idx] || month} de ${year}`;
};

// Get current competence month "YYYY-MM"
export const getCurrentMonth = () => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
};

// Generate list of recent and upcoming months for selector
export const getMonthOptions = () => {
  const options = [];
  const curr = new Date();
  for (let i = -12; i <= 12; i++) {
    const d = new Date(curr.getFullYear(), curr.getMonth() + i, 1);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const val = `${y}-${m}`;
    options.push({
      value: val,
      label: formatMonthLong(val),
      isCurrent: i === 0
    });
  }
  return options;
};

// Payment Method Labels and Icons
export const PAYMENT_METHODS = {
  credit_card: { label: "Cartão de Crédito", icon: "CreditCard", color: "#8b5cf6" },
  debit_card: { label: "Cartão de Débito", icon: "CreditCard", color: "#3b82f6" },
  pix: { label: "PIX", icon: "Zap", color: "#14b8a6" },
  cash: { label: "Dinheiro / Espécie", icon: "Banknote", color: "#10b981" },
  bank_transfer: { label: "Transferência / TED", icon: "ArrowLeftRight", color: "#06b6d4" },
  boleto: { label: "Boleto Bancário", icon: "Barcode", color: "#f59e0b" }
};

// CPF Formatting: 000.000.000-00
export const formatCPF = (value) => {
  if (!value) return "";
  const digits = String(value).replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9, 11)}`;
};

// CPF Masking for privacy: ***.456.789-**
export const maskCPF = (cpf) => {
  if (!cpf) return "Não informado";
  const formatted = formatCPF(cpf);
  const parts = formatted.split(".");
  if (parts.length === 3) {
    const lastPart = parts[2].split("-");
    return `***.${parts[1]}.${lastPart[0]}-**`;
  }
  return formatted;
};

// CPF Validation (Standard Algorithm)
export const validateCPF = (cpf) => {
  if (!cpf) return false;
  const digits = String(cpf).replace(/\D/g, "");
  if (digits.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(digits)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(digits.charAt(i), 10) * (10 - i);
  }
  let rev = 11 - (sum % 11);
  if (rev === 10 || rev === 11) rev = 0;
  if (rev !== parseInt(digits.charAt(9), 10)) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(digits.charAt(i), 10) * (11 - i);
  }
  rev = 11 - (sum % 11);
  if (rev === 10 || rev === 11) rev = 0;
  if (rev !== parseInt(digits.charAt(10), 10)) return false;

  return true;
};
