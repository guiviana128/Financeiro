import React, { useState, useRef, useEffect } from "react";
import { Calendar, ChevronLeft, ChevronRight, Check } from "lucide-react";
import { formatDate, getTodayDate } from "../../utils/formatters";

const WEEKDAYS = ["D", "S", "T", "Q", "Q", "S", "S"];
const MONTH_NAMES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

export const CustomDatePicker = ({ value, onChange, label, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const selectedVal = value || getTodayDate();
  const [yearStr, monthStr, dayStr] = selectedVal.split("-");
  const parsedYear = parseInt(yearStr, 10) || new Date().getFullYear();
  const parsedMonth = (parseInt(monthStr, 10) || 1) - 1;
  const parsedDay = parseInt(dayStr, 10) || new Date().getDate();

  const [viewYear, setViewYear] = useState(parsedYear);
  const [viewMonth, setViewMonth] = useState(parsedMonth);

  useEffect(() => {
    if (value) {
      const [y, m] = value.split("-");
      if (y && m) {
        setViewYear(parseInt(y, 10));
        setViewMonth(parseInt(m, 10) - 1);
      }
    }
  }, [value]);

  // Click outside to close
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

  const todayStr = getTodayDate();

  const handlePrevMonth = (e) => {
    e.stopPropagation();
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(y => y - 1);
    } else {
      setViewMonth(m => m - 1);
    }
  };

  const handleNextMonth = (e) => {
    e.stopPropagation();
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(y => y + 1);
    } else {
      setViewMonth(m => m + 1);
    }
  };

  const handleSelectDay = (day) => {
    const formatted = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    onChange(formatted);
    setIsOpen(false);
  };

  const handleSelectToday = () => {
    onChange(todayStr);
    const [y, m] = todayStr.split("-");
    setViewYear(parseInt(y, 10));
    setViewMonth(parseInt(m, 10) - 1);
    setIsOpen(false);
  };

  // Compute days in current view month
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayIndex = new Date(viewYear, viewMonth, 1).getDay(); // 0 = Sun
  const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

  const calendarDays = [];

  // Previous month trailing days
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    calendarDays.push({
      day: daysInPrevMonth - i,
      isCurrentMonth: false,
      isPrev: true
    });
  }

  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`;
    calendarDays.push({
      day: i,
      isCurrentMonth: true,
      dateStr,
      isSelected: dateStr === selectedVal,
      isToday: dateStr === todayStr
    });
  }

  // Next month leading days (fill up to 35 or 42 slots)
  const totalSlots = calendarDays.length <= 35 ? 35 : 42;
  const remaining = totalSlots - calendarDays.length;
  for (let i = 1; i <= remaining; i++) {
    calendarDays.push({
      day: i,
      isCurrentMonth: false,
      isNext: true
    });
  }

  return (
    <div className={`custom-datepicker-container ${className}`} ref={containerRef} style={{ position: "relative" }}>
      {label && <label className="form-label">{label}</label>}

      {/* Trigger Button */}
      <button
        type="button"
        className={`custom-datepicker-trigger ${isOpen ? "is-active" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="datepicker-trigger-left">
          <Calendar size={16} className="datepicker-icon" />
          <span className="datepicker-trigger-val">
            {formatDate(selectedVal)}
          </span>
        </div>
        <span className="datepicker-trigger-hint">
          {selectedVal === todayStr ? "Hoje" : ""}
        </span>
      </button>

      {/* Floating Calendar Dropdown */}
      {isOpen && (
        <div className="custom-calendar-popup glass-card animate-scale-up">
          {/* Header */}
          <div className="calendar-popup-header">
            <button
              type="button"
              className="calendar-nav-btn"
              onClick={handlePrevMonth}
              title="Mês Anterior"
            >
              <ChevronLeft size={16} />
            </button>

            <span className="calendar-month-year-label">
              {MONTH_NAMES[viewMonth]} <strong style={{ color: "var(--text-primary)" }}>{viewYear}</strong>
            </span>

            <button
              type="button"
              className="calendar-nav-btn"
              onClick={handleNextMonth}
              title="Próximo Mês"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Weekday labels */}
          <div className="calendar-weekdays-row">
            {WEEKDAYS.map((wd, idx) => (
              <span key={idx} className="calendar-weekday-cell">
                {wd}
              </span>
            ))}
          </div>

          {/* Days Grid */}
          <div className="calendar-days-grid">
            {calendarDays.map((cell, idx) => {
              if (!cell.isCurrentMonth) {
                return (
                  <div key={idx} className="calendar-day-cell other-month">
                    {cell.day}
                  </div>
                );
              }

              return (
                <button
                  key={idx}
                  type="button"
                  className={`calendar-day-cell current-month ${cell.isSelected ? "selected" : ""} ${cell.isToday ? "today" : ""}`}
                  onClick={() => handleSelectDay(cell.day)}
                >
                  {cell.day}
                </button>
              );
            })}
          </div>

          {/* Footer with Today button */}
          <div className="calendar-popup-footer">
            <button
              type="button"
              className="calendar-today-btn"
              onClick={handleSelectToday}
            >
              Selecionar Hoje ({formatDate(todayStr)})
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
