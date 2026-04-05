# 💹 FinTrack — Finance Dashboard

A clean, interactive, and fully responsive finance dashboard built with **React JS**. Designed to help users track financial activity, explore transactions, and understand spending patterns — with role-based UI behavior and data persistence.

---

## 🚀 Quick Start

```bash
# 1. Clone or extract the project
cd finance-dashboard

# 2. Install dependencies
npm install

# 3. Start development server
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

**Build for production:**
```bash
npm run build
```

---

## 📁 Project Structure

```
finance-dashboard/
├── public/
│   └── index.html                    # HTML template
├── src/
│   ├── context/
│   │   └── AppContext.jsx            # Global state management (useReducer + Context)
│   ├── data/
│   │   └── mockData.js               # 30 mock transactions + 6-month trend data
│   ├── utils/
│   │   └── helpers.js                # Utilities: formatting, filtering, sorting, export
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.jsx           # Navigation sidebar + role switcher
│   │   │   └── Topbar.jsx            # Page header + dark mode + export
│   │   ├── dashboard/
│   │   │   ├── DashboardPage.jsx     # Dashboard overview container
│   │   │   ├── SummaryCards.jsx      # Balance / Income / Expenses summary
│   │   │   ├── BalanceTrend.jsx      # 6-month area chart (Recharts)
│   │   │   ├── CategoryBreakdown.jsx # Spending donut chart (Recharts)
│   │   │   └── RecentTransactions.jsx# Latest 6 transactions widget
│   │   ├── transactions/
│   │   │   ├── TransactionsPage.jsx  # Full transactions table with filters
│   │   │   └── TransactionModal.jsx  # Add / Edit transaction modal (Admin)
│   │   └── insights/
│   │       └── InsightsPage.jsx      # Spending analytics and insights
│   ├── App.jsx                       # Root component + tab routing
│   ├── index.js                      # React entry point
│   └── index.css                     # Complete design system
└── package.json
```

---

## 🎯 Features Overview

### 1. Dashboard Overview
- **Summary Cards** — Net Balance, Total Income, Total Expenses with trend indicators
- **Balance Trend Chart** — Area chart showing 6-month income vs expense history
- **Category Breakdown** — Interactive donut chart with top-5 spending categories
- **Recent Transactions** — Quick view of last 6 transactions with category icons

### 2. Transactions Section
- Full table view with **Date, Description, Category, Type, Amount**
- **Live Search** — Filter by description or category in real time
- **Type Filter** — All / Income / Expense
- **Category Filter** — Filter by any specific category
- **Column Sorting** — Click headers to sort by date, amount, or category (asc/desc)
- **Pagination** — 10 transactions per page
- **Add / Edit / Delete** — Full CRUD operations (Admin role only)
- **CSV Export** — Download filtered transactions as CSV (Admin only)

### 3. Role-Based UI (RBAC)
Switch between roles using the **dropdown in the sidebar footer**:

| Feature | Admin | Viewer |
|---|---|---|
| View all data | ✅ | ✅ |
| Add transactions | ✅ | ❌ |
| Edit transactions | ✅ | ❌ |
| Delete transactions | ✅ | ❌ |
| Export CSV | ✅ | ❌ |
| Export button visible | ✅ | ❌ |

### 4. Insights Section
- **Top Spending Category** — Highest category with percentage of total spend
- **Savings Rate** — Auto-calculated with visual benchmark (20% target)
- **Month-over-Month Comparison** — Expense delta vs previous month
- **Average Transaction Value** — Mean spend per expense transaction
- **Category Bar Chart** — Visual breakdown of all expense categories
- **Monthly Income vs Expenses** — Grouped bar chart for 6-month comparison

### 5. State Management
- **Global state** via `useReducer` + React Context (`AppContext.jsx`)
- State includes: transactions, active role, filters, sort order, dark mode, active tab
- **localStorage persistence** — transactions and theme preference survive page refresh
- All filter/sort state is centralized — no prop drilling

### 6. UI / UX
- **Dark Mode** (default) + Light Mode toggle, persisted to localStorage
- **Responsive** — works on mobile, tablet, and desktop
- **Empty states** — handled gracefully in table and recent transactions
- **Smooth animations** — card hover lift, modal slide-up, filter transitions
- **Custom fonts** — Syne (display) + DM Mono (numbers/code)
- **Color-coded** — green for income, red for expenses, blue for balance

---

## 🛠 Tech Stack

| Tool | Purpose |
|---|---|
| React 18 | UI framework |
| useReducer + Context | State management |
| Recharts | Charts (area, donut, bar) |
| Lucide React | Icons |
| CSS Variables | Theming (dark/light) |
| localStorage | Data persistence |
| Vanilla CSS | Styling (no Tailwind/MUI) |

---

## 💡 Design Decisions

- **No external state library** — `useReducer` with Context is sufficient for this scope and avoids setup overhead
- **Single CSS file** with CSS variables — makes theming trivial and avoids style conflicts
- **Mock data in a dedicated file** — easy to swap with a real API later
- **Role switching via dropdown** — simple, clear demonstration without backend complexity
- **Pagination over virtualization** — appropriate for demo dataset size
- **DM Mono for numbers** — improves readability of financial figures at a glance

---

## 📦 Dependencies

```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "recharts": "^2.10.3",
  "lucide-react": "^0.383.0",
  "react-scripts": "5.0.1"
}
```

---

## 🔮 Potential Enhancements

- [ ] Mock API integration with `json-server` or MSW
- [ ] Date range picker for filtering
- [ ] Budget goals with progress tracking
- [ ] Notification badges for overspending categories
- [ ] PDF export of summary report
- [ ] Multi-currency support
