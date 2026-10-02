import React, { useState } from "react";
import {
  FileText,
  Download,
  FileSpreadsheet,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  Percent,
  Home,
  Utensils,
  Car,
  Gamepad2,
  Heart,
  Tv,
  GraduationCap,
  MoreHorizontal,
  Calendar,
  CheckCircle2,
  Sparkles,
  Layers,
  Table,
  BarChart3
} from "lucide-react";
import { formatCurrency } from "../../utils/formatters";

export const MonthlyReportView = () => {
  const [viewFormat, setViewFormat] = useState("bars"); // 'bars' | 'treemap' | 'table'
  const [categoryFilter, setCategoryFilter] = useState("all"); // 'all' | 'essential' | 'discretionary'
  const [exportNotice, setExportNotice] = useState(null);

  const categories = [
    { name: "Moradia", amount: 1580.00, pct: 28, color: "#f43f5e", isEssential: true, icon: Home, var: 2, sub: "Aluguel, condomínio e contas básicas" },
    { name: "Alimentação", amount: 980.00, pct: 18, color: "#f59e0b", isEssential: true, icon: Utensils, var: 8, sub: "Supermercado, restaurantes e delivery" },
    { name: "Transporte", amount: 678.00, pct: 12, color: "#10b981", isEssential: true, icon: Car, var: -10, sub: "Combustível, transporte público e apps" },
    { name: "Lazer", amount: 564.00, pct: 10, color: "#8b5cf6", isEssential: false, icon: Gamepad2, var: 15, sub: "Viagens, entretenimento e hobbies" },
    { name: "Saúde", amount: 452.00, pct: 8, color: "#3b82f6", isEssential: true, icon: Heart, var: -4, sub: "Farmácia, consultas e plano" },
    { name: "Assinaturas", amount: 438.90, pct: 8, color: "#06b6d4", isEssential: false, icon: Tv, var: 28, sub: "Streaming, apps e cloud" },
    { name: "Educação", amount: 321.00, pct: 6, color: "#6366f1", isEssential: true, icon: GraduationCap, var: 0, sub: "Cursos e livros" },
    { name: "Outros", amount: 631.00, pct: 11, color: "#94a3b8", isEssential: false, icon: MoreHorizontal, var: 5, sub: "Gastos diversos do mês" },
  ];

  const handleExportPDF = () => {
    setExportNotice("Relatório Executivo em PDF gerado com sucesso! Iniciando download...");
    setTimeout(() => setExportNotice(null), 3000);
  };

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
      "Categoria,Valor,Percentual,Tipo\n" +
      categories.map(c => `"${c.name}",${c.amount},${c.pct}%,${c.isEssential ? "Essencial" : "Discricionário"}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "relatorio_financeiro_setembro_2026.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setExportNotice("CSV exportado com sucesso!");
    setTimeout(() => setExportNotice(null), 3000);
  };

  const filteredCategories = categories.filter(c => {
    if (categoryFilter === "essential") return c.isEssential;
    if (categoryFilter === "discretionary") return !c.isEssential;
    return true;
  });

  // Daily heatmap matrix (5 weeks x 7 days) with spend intensity (0 to 3)
  const heatmapData = [
    [0, 0, 1, 2, 1, 0, 1], // Week 1 (1-5)
    [2, 1, 1, 3, 2, 1, 2], // Week 2 (6-12)
    [1, 1, 2, 2, 3, 2, 3], // Week 3 (13-19)
    [1, 2, 3, 1, 2, 2, 2], // Week 4 (20-26)
    [1, 1, 2, 2, 1, 0, 0], // Week 5 (27-30)
  ];

  return (
    <div className="reports-layout animate-fade-in">
      {/* Top Banner & Action Buttons */}
      <div className="reports-hero-banner">
        <div className="reports-hero-left">
          <div className="reports-header-text">
            <h2 className="reports-title">Resumo Executivo</h2>
            <span className="reports-month-badge">Setembro de 2026</span>
          </div>

          <div className="reports-status-box">
            <div className="reports-status-icon">
              <Sparkles size={18} color="#0d9488" />
            </div>
            <div>
              <strong className="reports-status-title">Você teve um mês positivo!</strong>
              <p className="reports-status-desc">
                Suas receitas superaram suas despesas e você conseguiu economizar mais do que no mês anterior. Continue assim!
              </p>
            </div>
          </div>
        </div>

        <div className="reports-hero-right">
          <button type="button" className="btn btn-secondary" onClick={handleExportPDF}>
            <FileText size={15} />
            <span>Exportar PDF</span>
          </button>
          <button type="button" className="btn btn-primary" onClick={handleExportCSV}>
            <FileSpreadsheet size={15} />
            <span>Exportar CSV</span>
          </button>
        </div>
      </div>

      {/* Export Toast Notification */}
      {exportNotice && (
        <div className="reports-toast-banner animate-fade-in">
          <CheckCircle2 size={16} color="#10b981" />
          <span>{exportNotice}</span>
        </div>
      )}

      {/* 4 Metric Cards */}
      <div className="forecast-metrics-grid">
        {/* Card 1: Receitas */}
        <div className="forecast-stat-card">
          <div className="fstat-header">
            <span className="fstat-label">Receitas do mês</span>
            <div className="fstat-icon-circle green"><TrendingUp size={16} /></div>
          </div>
          <div className="fstat-amount">{formatCurrency(5200.00)}</div>
          <span className="fstat-sub green">+ 12% em relação a agosto</span>
        </div>

        {/* Card 2: Despesas */}
        <div className="forecast-stat-card">
          <div className="fstat-header">
            <span className="fstat-label">Despesas do mês</span>
            <div className="fstat-icon-circle red"><TrendingDown size={16} /></div>
          </div>
          <div className="fstat-amount">{formatCurrency(5645.90)}</div>
          <span className="fstat-sub red">+ 5% em relação a agosto</span>
        </div>

        {/* Card 3: Economizado */}
        <div className="forecast-stat-card">
          <div className="fstat-header">
            <span className="fstat-label">Valor economizado</span>
            <div className="fstat-icon-circle green"><PiggyBank size={16} /></div>
          </div>
          <div className="fstat-amount green">{formatCurrency(320.00)}</div>
          <span className="fstat-sub green">+ 60% em relação a agosto</span>
        </div>

        {/* Card 4: Taxa de Poupança */}
        <div className="forecast-stat-card">
          <div className="fstat-header">
            <span className="fstat-label">Taxa de poupança</span>
            <div className="fstat-icon-circle blue"><Percent size={16} /></div>
          </div>
          <div className="fstat-amount blue">6%</div>
          <span className="fstat-sub green">+ 2 p.p. em relação a agosto</span>
        </div>
      </div>

      {/* Middle 3 Panels Row: Gastos por Categoria, Mapa Diário, Comparativo */}
      <div className="reports-3panels-grid">
        {/* Panel 1: Gastos por Categoria */}
        <div className="report-panel-card">
          <div className="panel-header">
            <div>
              <h3 className="panel-title">Gastos por Categoria</h3>
            </div>
            <div className="panel-format-toggle">
              <button
                type="button"
                className={`format-btn ${viewFormat === "bars" ? "active" : ""}`}
                onClick={() => setViewFormat("bars")}
              >
                Barras
              </button>
              <button
                type="button"
                className={`format-btn ${viewFormat === "treemap" ? "active" : ""}`}
                onClick={() => setViewFormat("treemap")}
              >
                Treemap
              </button>
              <button
                type="button"
                className={`format-btn ${viewFormat === "table" ? "active" : ""}`}
                onClick={() => setViewFormat("table")}
              >
                Tabela
              </button>
            </div>
          </div>

          <div className="category-report-list">
            {categories.map((c, idx) => (
              <div key={idx} className="category-report-row">
                <div className="cat-rep-left">
                  <c.icon size={15} style={{ color: c.color }} />
                  <span className="cat-rep-name">{c.name}</span>
                </div>

                <div className="cat-rep-bar-track">
                  <div
                    className="cat-rep-bar-fill"
                    style={{ width: `${c.pct * 2.8}%`, background: c.color }}
                  />
                </div>

                <div className="cat-rep-right">
                  <span className="cat-rep-amount">{formatCurrency(c.amount)}</span>
                  <span className="cat-rep-pct">{c.pct}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Panel 2: Mapa de Gastos Diários (Heatmap) */}
        <div className="report-panel-card">
          <div className="panel-header">
            <div>
              <h3 className="panel-title">Mapa de Gastos Diários</h3>
            </div>
            <div className="heatmap-legend">
              <span className="hdot min" />
              <span>Menor gasto</span>
              <span className="hdot max" />
              <span>Maior gasto</span>
            </div>
          </div>

          <div className="heatmap-container">
            <div className="heatmap-weekdays">
              <span>Dom</span>
              <span>Seg</span>
              <span>Ter</span>
              <span>Qua</span>
              <span>Qui</span>
              <span>Sex</span>
              <span>Sáb</span>
            </div>

            <div className="heatmap-grid">
              {heatmapData.map((week, wIdx) => (
                <div key={wIdx} className="heatmap-row">
                  <span className="heatmap-row-label">{wIdx === 0 ? "1 - 5" : wIdx === 1 ? "6 - 12" : wIdx === 2 ? "13 - 19" : wIdx === 3 ? "20 - 26" : "27 - 30"}</span>
                  {week.map((level, dIdx) => (
                    <div
                      key={dIdx}
                      className={`heatmap-cell lvl-${level}`}
                      title={`Nível de gasto: ${level === 3 ? "Alto" : level === 2 ? "Médio" : level === 1 ? "Baixo" : "Nenhum"}`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Panel 3: Comparativo Mensal */}
        <div className="report-panel-card">
          <div className="panel-header">
            <div>
              <h3 className="panel-title">Comparativo Mensal</h3>
            </div>
            <div className="panel-legend">
              <span><span className="legend-dot blue" /> Agosto/26</span>
              <span><span className="legend-dot teal" /> Setembro/26</span>
            </div>
          </div>

          <div className="monthly-comp-bars">
            {/* Receitas */}
            <div className="mcomp-col">
              <div className="mcomp-pair">
                <div className="mbar blue" style={{ height: "65%" }}>
                  <span className="mbar-tag">R$ 4,6k</span>
                </div>
                <div className="mbar teal" style={{ height: "75%" }}>
                  <span className="mbar-tag">R$ 5,2k</span>
                </div>
              </div>
              <span className="mcomp-lbl">Receitas</span>
            </div>

            {/* Despesas */}
            <div className="mcomp-col">
              <div className="mcomp-pair">
                <div className="mbar blue" style={{ height: "70%" }}>
                  <span className="mbar-tag">R$ 5,4k</span>
                </div>
                <div className="mbar teal" style={{ height: "80%" }}>
                  <span className="mbar-tag">R$ 5,6k</span>
                </div>
              </div>
              <span className="mcomp-lbl">Despesas</span>
            </div>

            {/* Economia */}
            <div className="mcomp-col">
              <div className="mcomp-pair">
                <div className="mbar blue" style={{ height: "20%" }}>
                  <span className="mbar-tag">R$ 200</span>
                </div>
                <div className="mbar teal" style={{ height: "35%" }}>
                  <span className="mbar-tag">R$ 320</span>
                </div>
              </div>
              <span className="mcomp-lbl">Economia</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Onde seu dinheiro foi */}
      <div className="where-money-went-card">
        <div className="panel-header">
          <div>
            <h3 className="panel-title">Onde seu dinheiro foi</h3>
            <p className="panel-sub">Detalhamento das principais categorias e variação em relação ao mês anterior</p>
          </div>

          <div className="where-filters-row">
            <div className="where-pills">
              <button
                type="button"
                className={`where-pill-btn ${categoryFilter === "all" ? "active" : ""}`}
                onClick={() => setCategoryFilter("all")}
              >
                Todas as categorias
              </button>
              <button
                type="button"
                className={`where-pill-btn ${categoryFilter === "essential" ? "active" : ""}`}
                onClick={() => setCategoryFilter("essential")}
              >
                Essenciais
              </button>
              <button
                type="button"
                className={`where-pill-btn ${categoryFilter === "discretionary" ? "active" : ""}`}
                onClick={() => setCategoryFilter("discretionary")}
              >
                Discricionárias
              </button>
            </div>

            <select className="shared-select-month">
              <option>Ordenar por: Valor (maior primeiro)</option>
              <option>Ordenar por: Maior aumento</option>
              <option>Ordenar por: Nome</option>
            </select>
          </div>
        </div>

        {/* Category Cards Grid */}
        <div className="where-category-grid">
          {filteredCategories.slice(0, 4).map((cat, idx) => (
            <div key={idx} className="where-cat-card">
              <div className="where-cat-top">
                <div className="where-cat-icon" style={{ background: `${cat.color}18`, color: cat.color }}>
                  <cat.icon size={18} />
                </div>
                <div className="where-cat-names">
                  <strong className="where-cat-title">{cat.name}</strong>
                  <span className="where-cat-sub">{cat.sub}</span>
                </div>
                <span className={`where-cat-badge ${cat.var > 0 ? "up" : "down"}`}>
                  {cat.var > 0 ? `↑ ${cat.var}%` : `↓ ${Math.abs(cat.var)}%`}
                </span>
              </div>

              <div className="where-cat-val-row">
                <span className="where-cat-val">{formatCurrency(cat.amount)}</span>
                <span className="where-cat-pct">{cat.pct}%</span>
              </div>

              <div className="where-cat-track">
                <div
                  className="where-cat-fill"
                  style={{ width: `${cat.pct * 3}%`, background: cat.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
