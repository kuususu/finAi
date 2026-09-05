# FinAI — Banking Analytics Platform

FinAI is a personal finance analytics web application. Users upload bank statements (PDF/CSV), and the platform parses, normalizes, classifies, and visualizes their financial operations — turning raw banking exports into a structured overview of spending, subscriptions, and actionable insights.

## What's implemented now

The current codebase is a **static frontend prototype**. All six pages are fully designed and navigable. All data is hardcoded in the HTML — there is no backend, no database, and no real bank API integration.

**Implemented pages:**

| Page | File | Purpose |
|------|------|---------|
| Обзор (Overview) | `reviewFin.html` | Financial summary — balance, savings, income/expense KPIs, spending chart with day/week toggle, month selector |
| Транзакции (Transactions) | `transactionsFin.html` | Transaction ledger with type filter, category dropdown, date period, reset, pagination, CSV export |
| Категории (Categories) | `categoriesFin.html` | Spending breakdown by category with period controls and filters |
| Подписки (Subscriptions) | `subscriptionsFin.html` | Active subscriptions with category filters and monthly/yearly cost summary |
| Инсайты (Insights) | `insightsFin.html` | AI-generated recommendations and optimization potential |
| Импорт (Import) | `importFin.html` | Statement upload area (PDF/CSV only) with brief instructions |

## Project structure

```
stitch_finai_banking_analytics_platform/
├── assets/
│   ├── css/
│   │   └── finaii.css              ← Design tokens + shared component styles
│   └── js/
│       ├── layout.js               ← Shared Sidebar + TopDashboard component
│       ├── interactions.js         ← Dropdowns, checkboxes, and micro-interactions
│       └── tailwind-config.js      ← Custom Tailwind theme (Emerald Slate)
├── categoriesFin.html
├── transactionsFin.html
├── reviewFin.html
├── subscriptionsFin.html
├── insightsFin.html
├── importFin.html
├── emerald_slate_fintech/
│   └── DESIGN.md                   ← Design system specification
└── backup_originals/               ← Pre-refactoring page snapshots
```

### Key files

**`assets/css/finai.css`** — The design system in CSS custom properties and utility classes. Defines the color palette (Emerald Slate green primary `#00A551`, surface scales, semantic colors), typography scale (`display-hero`, `balance-lg`, `headline-lg`, `title-sm`, `body-md`, `label-caps`, `tabular-num`), spacing, border radii, shadows, and all shared component styles: `.page-title`, `.btn-primary` / `.btn-secondary` / `.btn-ghost`, `.pill-group`, `.card`, `.kpi-plate` / `.kpi-item`, `.finai-select` / `.finai-select-menu`, `.tx-row`. Also includes the page-transition reveal system (`html{opacity:0}` → `html.layout-ready`) and a `prefers-reduced-motion` block.

**`assets/js/layout.js`** — Single source of truth for the shared navigation. On `DOMContentLoaded`, injects the left Sidebar and TopDashboard header into every page, marks the active nav item based on `<body data-page="…">`, then reveals the page with `html.layout-ready`. Contains the month dropdown (`#topMonthMenu`) used in the TopDashboard.

**`assets/js/interactions.js`** — Lightweight micro-interaction layer:
- Generic dropdown system (`.finai-select-menu`, `[data-dropdown-trigger]`, `.finai-option`) with outside-click and Esc-to-close
- Transaction row checkbox selection (`.tx-row` → `.is-selected`)
- Month selection handler via `FinAI.onSelect()`

**`assets/js/tailwind-config.js`** — Custom Tailwind theme extending the CDN build with the Emerald Slate color tokens, custom font families (Inter, Manrope), and spacing/radius utilities.

## How to run

No build step, no package manager, no bundler.

**Option 1 — Direct open:**
Double-click any `*Fin.html` file. Everything works (Tailwind via CDN, Material Symbols via Google Fonts).

**Option 2 — Local HTTP server (recommended):**
```bash
# From the project root:
python -m http.server 8000
# Then open http://localhost:8000/reviewFin.html
```
A local server avoids any browser restrictions on `file://` fetches and matches production deployment behavior.

## Frontend architecture

- **Pure HTML / CSS / JavaScript.** No framework (no React, Vue, Angular). No build tools.
- **Tailwind CSS via CDN** (`https://cdn.tailwindcss.com`) with a custom theme in `tailwind-config.js`.

## Interactive features (currently working)

- **Sidebar navigation** — click any of the 6 pages
- **TopDashboard month dropdown** — click "Сентябрь 2026" to select another month (UI state only, no historical data)
- **Spending chart day/week toggle** on Overview
- **Transaction type filter** — Все / Расходы / Доходы / Переводы
- **Transaction category dropdown** — filter by category
- **Transaction date period dropdown**
- **Transaction reset** — clear all filters
- **Transaction pagination** — page through the static 8-row dataset
- **CSV export** — downloads currently displayed transactions as a `.csv` file
- **Transaction checkbox selection** — checked rows get the green highlight
- **Category period controls** — Сентябрь / Август / Квартал
- **Category filters**
- **Subscription category filters** — Все / Развлечения / Сервисы / AI / Спорт / Связь

## Static / mock data

All financial data is hardcoded in the HTML:

- **8 transactions** across 4 expense types, 1 income, 1 transfer, 1 unrecognized merchant
- **Category spending** — Продукты, Еда и доставка, Покупки, etc.

## Backend integration (recommended next step)

The frontend is ready to be connected to a backend. The current static data should be replaced with API calls.

### Recommended API endpoints

| Method | Endpoint | Purpose | Replaces |
|--------|----------|---------|----------|
| `POST` | `/api/import` | Upload PDF/CSV statement for parsing | Mock import result |
| `GET` | `/api/transactions` | List transactions (filterable by type, category, date range, pagination) | Static transaction rows |
| `GET` | `/api/categories` | Category spending statistics | Static category cards |
| `GET` | `/api/subscriptions` | Active subscriptions with costs | Static subscription cards |
| `GET` | `/api/insights` | AI-generated recommendations | Static insight cards |
| `GET` | `/api/overview` | Dashboard KPIs — balance, savings, income, expenses, chart data | Static overview KPIs |

`GET` endpoints should accept query parameters for filtering: `?month=2026-09&type=expense&category=Продукты&page=1&limit=10`.

### Frontend → Backend data flow

```
User
  ↓ clicks "Загрузить выписку"
Frontend
  ↓ POST /api/import  (multipart/form-data: PDF or CSV file)
Backend
  ↓ Parse file (PDF text extraction / CSV parsing)
  ↓ Normalize rows → canonical transaction format
  ↓ Classify each operation:
  │   ├─ rule-based match (known merchants dictionary)
  │   ├─ pattern match (MCC codes, regex)
  │   └─ LLM fallback (only unclear operations)
  ↓ Store transactions
  ↓ Return: { importId, transactionsCount, categories: [...], ... }
Frontend
  ↓ Update transaction list, categories, KPIs
  ↓ Navigate to refreshed Overview or Transactions

### Data contract — recommended JSON shapes

**Transaction** (returned by `GET /api/transactions` and by `POST /api/import`):

```json
{
  "id": "txn_8a3f1c",
  "date": "2026-09-04",
  "amount": -2340.00,
  "currency": "RUB",
  "type": "expense",
  "description": "Ozon Marketplace",
  "merchant": "Ozon",
  "mcc": "5399",
  "category": "Покупки",
  "categoryIcon": "shopping_bag",
  "confidence": 0.82,
  "requiresReview": true,
  "accountMask": "•• 4892",
  "rawText": "OZON RU PAY MOSCOW"
}
```

`type` is one of: `"expense"`, `"income"`, `"transfer"`. `amount` is signed (negative for expenses). The frontend already uses these exact field semantics (see `data-type="expense"` filter and the amount formatting with `−` / `+` prefixes).

**Category statistics** (for `GET /api/categories`):

```json
{
  "period": "2026-09",
  "totalSpent": 124680.50,
  "changeVsPrevious": 0.12,
  "categories": [
    {
      "name": "Продукты",
      "spent": 42150.00,
      "transactionCount": 18,
      "avgPerTransaction": 2341.67,
      "percentOfTotal": 0.34,
      "trend": [1200, 890, 2100, 3400]
    }
  ],
  "topCategory": "Продукты"
}
```

**Subscription** (for `GET /api/subscriptions`):

```json
{
  "id": "sub_001",
  "name": "Яндекс Плюс",
  "category": "Развлечения",
  "monthlyAmount": 399.00,
  "currency": "RUB",
  "nextChargeDate": "2026-10-15",
  "status": "active",
  "billingFrequency": "monthly",
  "icon": "yandex_logo"
}
```

**Insight** (for `GET /api/insights`):

```json
{
  "id": "ins_01",
  "type": "optimization",
  "severity": "info",
  "title": "Забытые подписки",
  "description": "3 подписки списывают деньги, но не используются более 30 дней",
  "potentialMonthlySavings": 897.00,
  "affectedSubscriptions": ["sub_001", "sub_002", "sub_003"]
}
```

**Overview statistics** (for `GET /api/overview`):

```json
{
  "period": "2026-09",
  "netBalance": 142580.00,
  "totalSavings": 89420.00,
  "totalIncome": 185400.00,
  "totalExpenses": 124680.50,
  "spendingChart": {

## AI / LLM recommendations

The current frontend displays classification confidence badges (e.g. "AI 82%", "AI 99%") and flags transactions as `requiresReview`. This implies an AI classification layer. Recommended approach for implementation:

```
Raw bank operation (description, MCC, amount)
        ↓
1. Rule-based classification
   - Known merchants dictionary (Ozon → Покупки, Яндекс Еда → Еда и доставка)
   - MCC code mapping
   - Regex patterns (contains "Зарплата" → income)
        ↓ (if confidence > threshold → done)
2. Check user's own history
   - Same merchant / same amount pattern from previous months
        ↓ (if still unclear)
3. LLM classification
   - Send minimal context: description + MCC + amount
   - Receive: category, merchant, confidence
   - Cache result in merchants dictionary (don't re-send same merchant)
```

**Why not send every operation to the LLM:**
- 90%+ of bank operations are repeat merchants — rules + dictionary cover them.
- LLM calls are slow and cost money. Batch unclear operations, cache results, and build a growing merchant dictionary over time.
- The frontend already shows `requiresReview` for low-confidence results — let the user confirm, then save their correction to the dictionary.

---

## Mock vs. future

| Frontend currently | Future |
|-------------------|--------|
| 8 static transaction rows | `GET /api/transactions?page=1&limit=10` |
| Static category cards | `GET /api/categories?month=2026-09` |
| Static subscription cards | `GET /api/subscriptions` |
| Static insight cards | `GET /api/insights` |
| Static overview KPIs + chart | `GET /api/overview?month=2026-09` |
| Month dropdown (UI only) | Re-fetch all data for the selected period |
| Day/week chart toggle | Re-fetch or re-aggregate `spendingChart` from overview endpoint |
| Import upload area (no backend) | `POST /api/import` with PDF/CSV file |
| Category / subscription filters (client-side) | Initially client-side over full dataset; later server-side with query params |

---

## Next steps

### Backend
1. PDF/CSV statement parser (format detection, text extraction, row normalization)
2. Merchant dictionary + rule-based classification
3. LLM integration for unclear operations (batch + cache)
4. Database schema (transactions, categories, subscriptions, users)
5. REST API (endpoints above)
6. Analytics aggregation (monthly stats, subscription detection, insights generation)

### Frontend
1. Replace static data with `fetch()` calls to the API
2. Loading states (skeleton/spinner while data loads)
3. Error states (network failure, parse errors, empty results)
4. Empty states (no transactions, no subscriptions)
5. File upload with progress bar and error handling
6. Real-time data refresh after import

### Integration
1. Agree on the JSON data contract (shapes above are a starting point)
2. Wire each page's filters/sorts/pagination to query parameters
3. Test with real bank statements (multiple PDF formats, CSV dialects)
4. Validate the import → parse → classify → display loop end-to-end

---

## Design system

The visual language follows the **Emerald Slate Fintech** specification (`emerald_slate_fintech/DESIGN.md`). Key tokens:

- **Primary green**: `#00A551` (actions, active states, income, selected rows)
- **Background**: `#f9f9ff` (near-white with subtle blue tint)
- **Surface containers**: 5 tones from `#ffffff` (cards) to `#dce2f7` (deepest)
- **Typography**: Manrope (headings, numbers) + Inter (body, labels)
- **Cards**: 16px radius, `#ffffff` fill, hairline border
- **Buttons**: 8px radius, 44px height, `#00A551` primary
- **Spacing**: 4px base unit, Tailwind's default scale

All shared visual styles are centralized in `assets/css/finai.css`. When building new pages, use the existing utility classes (`.card`, `.btn-primary`, `.pill-group`, `.kpi-item`, `.section-title`) rather than writing one-off styles.

## Browser support

Modern evergreen browsers (Chrome, Firefox, Safari, Edge). Uses CSS custom properties, `flexbox`, `grid`, `requestAnimationFrame`, and ES6 (arrow functions, `const`/`let`, template literals). No IE11 support.

## License

Internal project. All rights reserved.

    "daily": [12450, 8900, 0, 23150, 3150, 8900, 15400],
    "weekly": [46800, 32100, 28900, 16880]
  },
  "topCategories": ["Продукты", "Еда и доставка", "Покупки"],
  "changeVsPrevious": -0.07
}
```

### Upload flow detail

`POST /api/import` — `multipart/form-data` with a single file field.

- **PDF**: backend extracts text, parses transaction lines, normalizes fields.
- **CSV**: backend detects delimiter, maps columns (date, amount, description), normalizes.
- **Response**: `{ "importId": "imp_…", "transactionsCount": 1248, "period": "2026-09", "status": "completed" }` or `{ "status": "processing" }` for async parsing.

The frontend should show a progress/upload state, then redirect to the refreshed Transactions page on success.

```

### Where each step belongs

| Stage | Backend | Frontend |
|-------|---------|----------|
| File upload | Receive file, validate format (PDF/CSV only) | `<input type="file">`, drag-and-drop UI |
| Parsing | PDF text extraction, CSV parsing | — |
| Normalization | Map raw rows to canonical fields | — |
| Classification | Rules → merchant dictionary → LLM fallback | Display confidence badge |
| Storage | Database (transactions, categories, users) | — |
| Analytics | Aggregate stats, detect subscriptions | Charts, tables, KPI cards |
| Insights | Generate recommendations | Render insight cards |

- **4 subscriptions** — Яндекс Плюс, ChatGPT, Яндекс Фитнес, МТС Premium
- **Insights** — 4 recommendation cards with optimization potential
- **Overview KPIs** — hardcoded balance, savings, totals

There is no file processing. The Import page's upload area is visual only — dropping or selecting a file does nothing yet.

- **Material Symbols** and **Inter / Manrope** fonts via Google Fonts CDN.
- **Shared layout** is injected at runtime by `layout.js` — each HTML page contains only its unique content inside `<div id="page-content">`. The Sidebar and TopDashboard are assembled by JavaScript, not duplicated in every file.
- **Navigation** works by opening the corresponding HTML page (`href="transactionsFin.html"`). The active nav item is set by matching `data-page` on `<body>` against `data-nav` on each sidebar link.
- **Page transitions** use a two-state reveal: the page starts with `html{opacity:0}`, layout.js injects the shared components, then adds `html.layout-ready` which triggers a 220ms ease-in fade. This prevents the sidebar from flashing in an unstyled intermediate state.
