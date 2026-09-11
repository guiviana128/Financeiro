# FinFlow Pro - Gestão Financeira Inteligente & Planejamento

Sistema completo de controle e planejamento financeiro pessoal, desenvolvido com arquitetura desacoplada: **Backend em Python (FastAPI + SQLite/SQLAlchemy)** e **Frontend em React (Vite + CSS Modular + Glassmorphism)**.

---

## 📂 Estrutura de Pastas e Separação de Arquivos

```
Financeiro/
├── backend/                        # Backend Python (API RESTful)
│   ├── app/
│   │   ├── models/                 # Modelos ORM do Banco de Dados SQL
│   │   │   ├── transaction.py      # Transações, compras parceladas e fixas
│   │   │   ├── credit_card.py      # Cartões, limites, datas de fechamento e vencimento
│   │   │   ├── category.py         # Categorias com ícones e cores
│   │   │   ├── budget.py           # Tetos orçamentários mensais
│   │   │   └── goal.py             # Metas financeiras / Cofrinhos
│   │   ├── schemas/                # Schemas de validação Pydantic
│   │   ├── routers/                # Endpoints RESTful modularizados
│   │   │   ├── dashboard.py        # KPIs, Score de Saúde Financeira e fluxo
│   │   │   ├── transactions.py     # CRUD de transações, filtros e exportação CSV
│   │   │   ├── credit_cards.py     # Gestão e cálculo de faturas de cartões
│   │   │   ├── budgets.py          # Orçamentos e regra 50/30/20
│   │   │   └── goals.py            # Gestão e aportes em metas
│   │   ├── services/               # Lógica de cálculo financeiro e seed de dados
│   │   ├── database.py             # Configuração da conexão SQLite com SQLAlchemy
│   │   └── main.py                 # Ponto de entrada FastAPI com CORS e inicialização
│   ├── requirements.txt            # Dependências Python
│   └── run.py                      # Script para rodar o backend
│
├── frontend/                       # Frontend React (Vite)
│   ├── src/
│   │   ├── components/             # Componentes React modularizados por pasta
│   │   │   ├── common/             # Modal, Toast, Icon, StatCard
│   │   │   ├── layout/             # Header, Sidebar
│   │   │   ├── dashboard/          # HealthScoreCard, CashflowChart, CategoryBreakdown, UpcomingBills
│   │   │   ├── cards/              # CreditCardItem (3D), CardsView, AddCardModal
│   │   │   ├── transactions/       # TransactionTable, TransactionsView, AddTransactionModal
│   │   │   ├── planning/           # Rule503020Card, CategoryBudgetList, AddBudgetModal
│   │   │   └── goals/              # GoalCard, GoalsView, AddGoalModal, DepositGoalModal
│   │   ├── context/                # FinanceContext (Estado global) e ThemeContext (Dark/Light)
│   │   ├── services/               # api.js (Cliente HTTP REST)
│   │   ├── styles/                 # CSS modular (variables, glassmorphism, cards, dashboard, etc.)
│   │   ├── utils/                  # Formatadores BRL, datas e métodos de pagamento
│   │   ├── App.jsx                 # Estrutura de navegação e abas
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── start.bat                       # Inicializador com 1 clique (Backend + Frontend)
└── README.md                       # Documentação do projeto
```

---

## ✨ Funcionalidades em Destaque

1. **Cartões de Crédito Virtuais 3D Realistas:**
   - Visual holográfico moderno com chip EMV, logotipo do banco e bandeira.
   - Cálculo automático do limite utilizado vs limite disponível em tempo real.
   - Acompanhamento da data de fechamento e vencimento da fatura.
   - Filtro instantâneo das compras associadas ao cartão selecionado.

2. **Gerador Automático de Parcelamentos:**
   - Ao lançar uma compra parcelada (ex: *10x de R$ 250*), o sistema cria automaticamente as 10 parcelas distribuídas nos meses seguintes, considerando o dia de fechamento do cartão.

3. **Score de Saúde Financeira & Dicas:**
   - Algoritmo que calcula de 0 a 100 a saúde financeira com base na taxa de poupança, uso responsável do limite de crédito e balanço orçamentário.

4. **Planejamento Orçamentário Regra 50/30/20:**
   - 50% Necessidades Básicas | 30% Desejos e Lazer | 20% Metas e Poupança.
   - Alertas visuais de tetos de gastos estipulados por categoria.

5. **Metas & Sonhos (Cofrinhos):**
   - Criação de metas com barra de progresso e simulação de aportes/resgates com celebração de confetes ao concluir!

6. **Tabela de Transações & Exportação:**
   - Busca em tempo real, filtros por tipo, status (pago/pendente), método de pagamento e categoria.
   - Exportação de dados para planilha CSV (compatível com Excel).

7. **Suporte a Tema Escuro (Dark) e Claro (Light):**
   - Transição suave entre paletas modernas de cores.

---

## 🚀 Como Executar o Projeto

### Opção 1: Inicialização com 1 Clique (Windows)
Basta dar um duplo-clique no arquivo `start.bat` na raiz do projeto. Ele iniciará o Backend Python e o Frontend React e abrirá o navegador automaticamente!

---

### Opção 2: Inicialização Manual via Terminal

#### 1. Backend (Python):
```bash
# Na pasta raiz do projeto:
py -3.11 backend/run.py
```
*O Backend estará rodando em `http://localhost:8000` (Documentação Swagger disponível em `http://localhost:8000/docs`).*

#### 2. Frontend (React):
```bash
# Em outro terminal, na pasta frontend:
cd frontend
npm run dev
```
*O Frontend estará acessível em `http://localhost:5173`.*
