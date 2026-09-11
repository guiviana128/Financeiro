import React, { useState, useRef, useEffect } from "react";
import { Calendar, ChevronLeft, ChevronRight, ChevronDown, Sparkles } from "lucide-react";
import { formatMonthLong, getCurrentMonth } from "../../utils/formatters";

const MONTH_NAMES_SHORT = [
  "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
  "Jul", "Ago", "Set", "Out", "Nov", "Dez"
];

export const MonthPickerDropdown = ({ selectedMonth, onSelectMonth }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Parse current selected year and month
  const [yearStr, monthStr] = (selectedMonth || getCurrentMonth()).split("-");
  const selectedYear = parseInt(yearStr, 10) || new Date().getFullYear();
  const selectedMonthIdx = (parseInt(monthStr, 10) || 1) - 1;

  const [viewYear, setViewYear] = useState(selectedYear);

  useEffect(() => {
    const [y] = (selectedMonth || getCurrentMonth()).split("-");
    setViewYear(parseInt(y, 10) || new Date().getFullYear());
  }, [selectedMonth]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const currentCalMonth = getCurrentMonth();
  const isCurrentSelected = selectedMonth === currentCalMonth;

  // Previous month stepper
  const handlePrevMonth = (e) => {
    e.stopPropagation();
    let y = selectedYear;
    let m = selectedMonthIdx - 1;
    if (m < 0) {
      m = 11;
      y -= 1;
    }
    const newMonthStr = `${y}-${String(m + 1).padStart(2, "0")}`;
    onSelectMonth(newMonthStr);
  };

  // Next month stepper
  const handleNextMonth = (e) => {
    e.stopPropagation();
    let y = selectedYear;
    let m = selectedMonthIdx + 1;
    if (m > 11) {
      m = 0;
      y += 1;
    }
    const newMonthStr = `${y}-${String(m + 1).padStart(2, "0")}`;
    onSelectMonth(newMonthStr);
  };

  const handleSelectMonthIdx = (idx) => {
    const newMonthStr = `${viewYear}-${String(idx + 1).padStart(2, "0")}`;
    onSelectMonth(newMonthStr);
    setIsOpen(false);
  };

  const handleGoCurrent = () => {
    const curr = getCurrentMonth();
    onSelectMonth(curr);
    const [y] = curr.split("-");
    setViewYear(parseInt(y, 10));
    setIsOpen(false);
  };

  return (
    <div className="custom-month-picker-container" ref={containerRef} style={{ position: "relative" }}>
      {/* Trigger Capsule */}
      <div className="month-picker-pill">
        <button
          type="button"
          className="month-stepper-btn"
          onClick={handlePrevMonth}
          title="Mês Anterior"
          aria-label="Mês Anterior"
        >
          <ChevronLeft size={16} />
        </button>

        <button
          type="button"
          className={`month-trigger-btn ${isOpen ? "active" : ""}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="month-trigger-icon">
            <Calendar size={15} />
          </div>
          <span className="month-trigger-text">{formatMonthLong(selectedMonth)}</span>
          {isCurrentSelected && (
            <span className="current-month-badge">Atual</span>
          )}
          <ChevronDown
            size={14}
            style={{
              transition: "transform 0.2s ease",
              transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
              opacity: 0.7
            }}
          />
        </button>

        <button
          type="button"
          className="month-stepper-btn"
          onClick={handleNextMonth}
          title="Próximo Mês"
          aria-label="Próximo Mês"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Floating Glassmorphic Month Grid Dropdown */}
      {isOpen && (
        <div className="month-picker-dropdown glass-card animate-scale-up">
          {/* Header with Year Selector */}
          <div className="month-dropdown-header">
            <button
              type="button"
              className="icon-btn-subtle"
              onClick={() => setViewYear(v => v - 1)}
              title="Ano Anterior"
            >
              <ChevronLeft size={16} />
            </button>

            <span className="month-dropdown-year">{viewYear}</span>

            <button
              type="button"
              className="icon-btn-subtle"
              onClick={() => setViewYear(v => v + 1)}
              title="Próximo Ano"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* 12 Months Grid */}
          <div className="months-grid">
            {MONTH_NAMES_SHORT.map((name, idx) => {
              const itemMonthStr = `${viewYear}-${String(idx + 1).padStart(2, "0")}`;
              const isSelected = selectedMonth === itemMonthStr;
              const isTodayMonth = currentCalMonth === itemMonthStr;

              return (
                <button
                  key={idx}
                  type="button"
                  className={`month-grid-btn ${isSelected ? "selected" : ""} ${isTodayMonth ? "is-today" : ""}`}
                  onClick={() => handleSelectMonthIdx(idx)}
                >
                  <span>{name}</span>
                  {isTodayMonth && <span className="today-dot" />}
                </button>
              );
            })}
          </div>

          {/* Quick Footer Action */}
          <div className="month-dropdown-footer">
            <button
              type="button"
              className="month-today-shortcut-btn"
              onClick={handleGoCurrent}
            >
              <Sparkles size={13} />
              <span>Ir para Mês Atual</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
