# Antigravity Finance
## Project Specification — Modern Finance Dashboard Web Application

**Product Type:** Premium personal finance and investment dashboard  
**Currency:** Indian Rupees (INR ₹)  
**Default Theme:** Dark mode  
**Core Experience:** Sleek, interactive, motion-rich, data-first fintech dashboard with “antigravity” visual language

---

## 1. Project Overview

### 1.1 Product Vision
Antigravity Finance is a next-generation personal finance dashboard designed for users who want a single, elegant place to track bank accounts, investments, expenses, goals, and portfolio performance. The product should feel premium, lightweight, and highly responsive, with smooth motion and a futuristic visual style inspired by floating interfaces and zero-gravity movement.

The dashboard should combine:
- real-time financial snapshots,
- deep visual analytics,
- a modern investment interface,
- and smart guidance through visual insights.

### 1.2 Product Goals
- Present all financial information in a clean, unified interface.
- Make complex financial data easy to understand through charts and motion.
- Deliver a premium consumer fintech experience with strong visual polish.
- Support multiple financial sources: bank accounts, stocks, mutual funds, and spending data.
- Make the interface feel alive through animation, transitions, and subtle ambient motion.

### 1.3 Target Users
- Young professionals managing salary, savings, and investments.
- Retail investors tracking NSE/BSE stocks and mutual funds.
- Users with multiple bank accounts and recurring transactions.
- Finance-conscious users who want insights instead of raw numbers.
- Pre-MBA, business, and analytics-oriented users who like detailed financial dashboards.

### 1.4 Product Principles
- **Clarity over clutter**
- **Motion with purpose**
- **Charts first**
- **Mobile-responsive by design**
- **Premium, calm, and trust-building visual tone**
- **All amounts in INR ₹**
- **Fast, smooth, and interactive by default**

---

## 2. Product Scope

### 2.1 In Scope
- Dashboard overview with net worth, cash flow, and key insights.
- Bank account aggregation and transaction analytics.
- Stock portfolio tracking focused on NSE and BSE.
- Mutual fund and SIP tracking.
- Expense tracking and category insights.
- Investment analytics and performance benchmarking.
- Goal tracking and budget planning.
- Alerts, notifications, and visual summaries.
- Responsive UI with dark mode default and optional light mode.
- Simulated real-time updates for demo mode or offline mode.

### 2.2 Out of Scope for MVP
- Direct trading execution.
- Tax filing automation.
- Full accounting suite.
- Loan underwriting or credit scoring.
- Complex enterprise-grade wealth management workflows.

---

## 3. Core User Experience

### 3.1 Experience Statement
When a user opens Antigravity Finance, they should immediately see their financial position, major movements, and actionable patterns without needing to search for them. The interface should feel like a premium control center: calm, futuristic, fluid, and highly informative.

### 3.2 Primary Emotional Goals
- Confidence
- Control
- Clarity
- Sophistication
- Delight

### 3.3 Visual Personality
- Dark, elegant background with deep navy, charcoal, and near-black surfaces.
- Glassmorphism cards with soft blur and subtle translucency.
- Floating widgets that appear to hover above the canvas.
- Neon-accent gradients used sparingly.
- Smooth animated transitions that feel weightless.
- Micro-interactions that provide instant feedback without distraction.

---

## 4. Feature Breakdown

## 4.1 Dashboard Overview

### Purpose
Provide an immediate snapshot of the user’s entire financial life.

### Components
- Net worth summary
- Total assets
- Total liabilities
- Cash balance
- Monthly income
- Monthly expense
- Investment value
- Gain/loss summary
- Mini trend charts
- Key insights panel

### Key Interactions
- Animated number counters for all major KPIs.
- Hover cards that reveal breakdowns.
- Time range switching: 1D, 1W, 1M, 1Y, All.
- Dataset toggle: Stocks / Mutual Funds / Bank / Combined.
- Smooth animated transitions between KPI states.

### Example Metrics
- Net Worth: ₹18,42,680
- Invested Assets: ₹12,60,400
- Monthly Savings Rate: 34.2%
- Portfolio Return: +18.6%
- Expense Drift: +7.4% vs previous month

---

## 4.2 Bank Account Tracking

### Purpose
Aggregate multiple bank accounts and show transaction-level visibility.

### Components
- Multi-account cards
- Account balance trends
- Transaction feed
- Income vs expense split
- Spending category graph
- Weekly transaction heatmap
- Recurring debit/credit detector

### Key Interactions
- Filter by account, date, category, and transaction type.
- Expand a transaction to show merchant, time, tags, and notes.
- Highlight recurring payments and bill patterns.
- Use heatmap to identify high-spend days.

### Suggested Data Points
- Salary credit
- UPI transfers
- Subscription debits
- Utility bills
- Cash withdrawals
- Mutual fund SIP debits

---

## 4.3 Stock Portfolio Tracking

### Purpose
Help users track equity holdings, market value, gains, and watchlists.

### Components
- Portfolio holdings table
- Realized/unrealized gains
- P&L chart
- Candlestick chart for stock performance
- Watchlist with sparklines
- Sector allocation chart
- Price alerts

### Key Interactions
- Toggle between NSE/BSE stocks.
- Switch between portfolio-level and stock-level views.
- Hover to inspect OHLC and volume data.
- Zoom and pan through candlestick history.
- Compare a stock against NIFTY 50 or sector index.

### Suggested Analytics
- Average buy price
- Current market price
- Day change
- 52-week high/low
- Allocation by sector
- Risk concentration by top holdings

---

## 4.4 Mutual Fund Tracking

### Purpose
Visualize SIP investments, fund performance, and long-term growth.

### Components
- Mutual fund holdings
- SIP schedule tracker
- Growth line chart
- Fund comparison chart
- NAV trend chart
- Asset allocation donut
- Goal-linked investment cards

### Key Interactions
- Compare multiple mutual funds side by side.
- Filter by fund type: equity, debt, hybrid, index.
- Show XIRR and absolute return.
- Animate SIP growth over time.
- Highlight contributions vs market gains.

### Suggested Metrics
- Total invested amount
- Current value
- XIRR
- SIP amount
- Next SIP date
- Fund category
- Expense ratio
- Risk level

---

## 4.5 Expense Tracking

### Purpose
Show where money is going and how spending changes over time.

### Components
- Monthly expense summary
- Category bar chart
- Spending trend line
- Merchant-level breakdown
- Recurring expenses panel
- Budget progress bars
- Anomaly/high-spend alerts

### Key Interactions
- Click a category to drill into transactions.
- Compare current month vs previous month.
- Mark items as one-time, recurring, or discretionary.
- Highlight overspending visually.
- Offer smart suggestions based on spending patterns.

### Suggested Categories
- Food & dining
- Transport
- Shopping
- Entertainment
- Utilities
- Travel
- Investments
- Health
- Education
- Subscriptions

---

## 4.6 Investment Analytics

### Purpose
Provide deep portfolio intelligence beyond basic tracking.

### Components
- Asset allocation chart
- Risk vs return scatter plot
- Benchmark comparison against NIFTY 50 / Sensex / fund benchmarks
- Sector exposure visualization
- Volatility indicator
- Correlation matrix
- Performance waterfall chart

### Key Interactions
- Compare current portfolio against benchmark performance.
- Filter by time horizon.
- Highlight underperforming assets.
- Show diversification gaps.
- Visualize concentration risk.

### Suggested Metrics
- CAGR
- XIRR
- Sharpe ratio
- Max drawdown
- Beta
- Volatility
- Alpha
- Win/loss ratio

---

## 4.7 Budget Planning

### Purpose
Help users plan monthly spending and savings with visual goals.

### Components
- Monthly budget editor
- Category caps
- Remaining budget meters
- Forecast line
- Savings target progress
- “Safe to spend” indicator

### Key Interactions
- Drag to adjust budgets.
- Auto-calculate savings capacity.
- Show burn rate and projected month-end balance.
- Color-code good / warning / danger states.

---

## 4.8 Goal Tracking

### Purpose
Turn financial goals into visual progress journeys.

### Components
- Goal cards
- Progress bars
- Milestone markers
- Completion forecasts
- Allocation suggestions

### Example Goals
- Emergency fund
- Vacation fund
- Laptop purchase
- Down payment fund
- MBA reserve fund
- Long-term investment target

---

## 4.9 Alerts & Notifications

### Purpose
Keep users informed without overwhelming them.

### Components
- Budget overspend alerts
- Unusual transaction alerts
- SIP reminders
- Price alerts
- Goal milestone notifications
- Portfolio concentration warnings

### UX Rules
- Avoid intrusive modal spam.
- Use subtle toast notifications.
- Prioritize high-signal alerts.
- Allow quiet hours and notification preferences.

---

## 4.10 AI-Generated Financial Insights (Optional)

### Purpose
Convert data into plain-language insights.

### Examples
- “Your spending on dining increased 18% this month.”
- “You are overexposed to financial services stocks.”
- “Your SIPs have contributed more than market gains this quarter.”
- “Your highest spending day is Friday.”
- “You are close to reaching your emergency fund target.”

### UX Rules
- Keep insights concise and actionable.
- Use visual emphasis instead of long text walls.
- Link every insight to the source chart or data point.
- Allow users to dismiss or pin insights.

---

## 5. Data Visualization Strategy

## 5.1 Visualization Philosophy
Charts are not decorative elements; they are the main navigation layer of the dashboard. Every major financial question should be answerable through a chart, trend line, heatmap, or comparison visual.

### Design Guidelines
- Every chart must have a clear purpose.
- Use consistent INR formatting.
- Keep axes readable on dark backgrounds.
- Prefer animated transitions between data states.
- Use hover-to-explain tooltips.
- Provide drill-down from summary charts to detailed views.
- Include legends, filters, and toggles only when necessary.
- Make charts responsive and touch-friendly.

---

## 5.2 Required Chart Types and Use Cases

### Line Charts
**Use for:** Portfolio growth, income trends, net worth movement, NAV progression  
**Behavior:** Smooth curves, animated entry, optional area fill, hover tooltips

### Bar Charts
**Use for:** Expense categories, monthly comparison, account-wise inflows/outflows  
**Behavior:** Stacked and grouped views, drill-down on click, animated reordering

### Pie / Donut Charts
**Use for:** Asset allocation, sector split, budget split, fund category mix  
**Behavior:** Exploding slices on hover, inner label totals, percentage tooltips

### Candlestick Charts
**Use for:** Stock price analysis, OHLC view, technical trend tracking  
**Behavior:** Zoom, pan, crosshair inspection, volume overlay, interval switching

### Heatmaps
**Use for:** Spending patterns, transaction activity by day/time, budget intensity  
**Behavior:** Color-coded intensity, hover details, calendar-style and matrix-style modes

### Area Charts
**Use for:** Cash flow, cumulative savings, SIP growth, account liquidity  
**Behavior:** Layered gradients, smooth transitions, stacked comparison option

### Sparklines
**Use for:** Watchlist cards, fund cards, account tiles, small trend previews  
**Behavior:** Minimal, non-intrusive, animated on load

### Scatter / Bubble Charts
**Use for:** Risk vs return, portfolio comparison, sector diversification  
**Behavior:** Hover labels, size by market value, color by asset class

### Waterfall Charts
**Use for:** Net worth bridge, monthly cash movement, investment return decomposition  
**Behavior:** Clear positive/negative stacking and animated growth sequence

### Correlation Matrix
**Use for:** Portfolio diversification and asset relationship analysis  
**Behavior:** Interactive cell hover with relationship strength and color scale

---

## 5.3 Interactivity Requirements

### Required Behaviors
- Hover tooltips with detailed INR values.
- Time range filters: 1D, 1W, 1M, 1Y, All.
- Dynamic dataset switching: stocks / mutual funds / bank / combined.
- Smooth animated transitions between chart states.
- Zoom, pan, and drag selection.
- Drill-down from portfolio summary to asset detail.
- Real-time updates with simulated market/account movement if live feeds are unavailable.

### Suggested Interaction Patterns
- Clicking a chart segment filters surrounding widgets.
- Hovering a bar highlights matching transactions in a table.
- Selecting a date range updates all visuals globally.
- Switching datasets morphs chart structure instead of hard-refreshing.
- Loading states should use skeletons and subtle shimmer effects, not spinners.

---

## 5.4 Chart Design Standards
- Use dark-friendly gridlines at low opacity.
- Use high-contrast data colors with restrained saturation.
- Avoid rainbow palettes unless data categories truly require them.
- Ensure tooltips are compact, readable, and anchored.
- Show precise figures in INR with commas and abbreviations where helpful.
- Maintain consistent typography across all chart labels and legends.

---

## 6. UI/UX Design Guidelines

## 6.1 Layout System
Use a modular dashboard grid with flexible cards:
- Top summary row
- Main chart stage
- Secondary insights and detail row
- Bottom section for tables, alerts, and goals

### Recommended Grid Approach
- 12-column desktop grid
- 4-column tablet grid
- Single-column mobile stack

---

## 6.2 Visual Style
### Base Theme
- Background: deep graphite / navy / black
- Surfaces: translucent dark panels
- Borders: soft, thin, low-opacity highlights
- Accent colors: electric blue, violet, cyan, emerald, amber used sparingly
- Shadows: soft outer shadows with subtle glow

### Glassmorphism Rules
- Cards should have blur, transparency, and layered depth.
- Avoid overusing blur to the point of unreadability.
- Keep text contrast strong against translucent backgrounds.

### Antigravity Motion Language
- Cards float slightly on hover.
- Elements drift subtly with parallax.
- Background particles move slowly and independently.
- Charts animate in with easing rather than abrupt appearance.
- Selected cards gently lift and glow.

---

## 6.3 Typography
- Use a modern sans-serif font family with strong legibility.
- Headlines should feel confident and premium.
- Numeric values should be large and clear.
- Use tabular numerals for financial amounts.

### Type Scale Idea
- Page title: 28–36 px
- Section titles: 18–22 px
- KPI value: 24–40 px
- Body text: 13–16 px
- Supporting labels: 11–12 px

---

## 6.4 Motion and Micro-Interactions
### Required Motion
- Smooth page transitions
- Hover lift on cards
- Animated counters
- Chart draw animations
- Floating background particles
- Subtle glow on active state
- Soft toggle animations
- Loading shimmer states

### Motion Principles
- Motion should communicate hierarchy, not distraction.
- Transition durations should feel responsive and premium.
- Use easing curves that feel organic and fluid.
- Preserve performance on mid-range devices.

---

## 6.5 Responsiveness
### Desktop
- Full dashboard with multi-panel layout.
- Persistent sidebar navigation.
- Expanded chart area and detail panels.

### Tablet
- Collapsible sidebar.
- Stacked cards with 2-column rhythm.
- Condensed chart legends.

### Mobile
- Single-column flow.
- Sticky bottom navigation or compact top tabs.
- Reduced chart density with focus on top KPIs and one primary chart at a time.

---

## 7. Wireframe Descriptions

## 7.1 Dashboard Home Wireframe
**Top bar:** logo, search, date range selector, notification icon, profile menu  
**Left sidebar:** Overview, Banks, Stocks, Mutual Funds, Expenses, Analytics, Goals, Settings  
**Main hero section:** net worth summary card with animated number and trend indicator  
**Primary chart region:** large line/area chart with filters and dataset switch  
**Secondary row:** asset allocation donut, expense bar chart, watchlist sparklines  
**Right rail:** AI insights, alerts, upcoming SIPs, budget status  
**Bottom section:** recent transactions table and quick actions

---

## 7.2 Bank Accounts Wireframe
**Header:** total cash across accounts  
**Left panel:** account cards with balances and status  
**Center:** transaction trend chart and spending heatmap  
**Right:** recurring payments, filters, and flagged items  
**Bottom:** searchable transaction table with categories and merchant details

---

## 7.3 Stocks Wireframe
**Header:** portfolio value, day gain/loss, benchmark delta  
**Main chart:** candlestick chart with volume overlay  
**Right side:** watchlist with sparklines and price changes  
**Below:** holdings table, sector allocation, risk indicators, alerts

---

## 7.4 Mutual Funds Wireframe
**Header:** total mutual fund value, invested amount, XIRR  
**Main:** growth line chart  
**Secondary:** fund comparison and SIP tracker  
**Side:** asset allocation donut, goal-linked funds, next SIP reminders

---

## 7.5 Expense Wireframe
**Header:** monthly spend total and budget remaining  
**Main:** category bar chart and weekly heatmap  
**Secondary:** recurring expenses, merchant breakdown, anomaly alerts  
**Bottom:** transaction stream with filters and category tagging

---

## 8. Suggested Tech Stack

## 8.1 Frontend
**Recommended Framework:** React + TypeScript  
**Preferred App Framework:** Next.js  
**Styling:** Tailwind CSS  
**Component System:** shadcn/ui or Radix UI-based primitives  
**Animation:** Framer Motion  
**Charts:** ECharts, Recharts, D3.js, or TradingView-style charting for advanced stock charts  
**Icons:** Lucide React

### Recommended Frontend Choice by Use Case
- **Recharts:** simple financial dashboards, fast implementation
- **ECharts:** highly interactive, polished charts, strong for complex visuals
- **D3.js:** custom, highly bespoke visualizations
- **TradingView lightweight charts:** best for candlestick-style market visualization

### Recommendation
Use **Recharts + ECharts** for the dashboard foundation and a specialized stock chart library for market visuals if the product grows beyond MVP.

---

## 8.2 Backend
**Primary Option:** Node.js with NestJS or Express  
**Alternative:** Python FastAPI for data-heavy and AI-assisted pipelines

### Backend Responsibilities
- User authentication
- Financial data aggregation
- Transaction categorization
- Portfolio calculations
- Goal and budget logic
- Notification triggers
- Data sync jobs
- Insight generation

---

## 8.3 Database
**Primary Database:** PostgreSQL  
**Caching:** Redis  
**Time-series / event-heavy options:** TimescaleDB or PostgreSQL hypertables  
**Analytics storage:** PostgreSQL + materialized views  
**File storage:** S3-compatible object storage

### Suggested Data Model Areas
- Users
- Accounts
- Transactions
- Holdings
- Mutual funds
- SIP schedules
- Budgets
- Goals
- Alerts
- Insight logs
- Market snapshots

---

## 8.4 State Management
**Recommended:** Zustand or Redux Toolkit  
**For server-state:** TanStack Query  
**For chart filters:** Local store + URL query sync

### State Strategy
- Keep UI state local where possible.
- Use a global store for cross-dashboard filters, auth, preferences, and selected assets.
- Use cached server state for financial datasets.
- Sync selected time range and dataset to the URL for shareable views.

---

## 8.5 API Strategy

### Data Sources
- Bank aggregation API or account statement import flow
- Stock market data provider for NSE/BSE prices
- Mutual fund NAV data source
- Transaction categorization service
- Exchange rate service if international assets are later added

### India-Focused API Categories
- **Market data:** NSE/BSE equity and index feeds via licensed market data providers
- **Mutual funds:** NAV and scheme metadata via AMFI-style data sources
- **Banking:** account aggregation / open banking style integrations where available
- **Payments:** UPI and bank transaction feeds through authorized partners
- **Notifications:** email, push, and WhatsApp integrations

### Integration Principle
Prefer official or licensed sources whenever financial data is live or user-specific.

---

## 8.6 Authentication & Security
- Email/password login with OTP or magic link option.
- Optional social sign-in.
- JWT or secure session-based auth.
- Row-level access controls for user data.
- Encryption at rest and in transit.
- Sensitive data masking in logs.
- Audit trail for financial data changes.

---

## 8.7 Deployment
**Frontend Hosting:** Vercel or similar edge-friendly platform  
**Backend Hosting:** Dockerized service on AWS, GCP, or similar cloud provider  
**Database Hosting:** Managed PostgreSQL  
**Monitoring:** Sentry + OpenTelemetry + performance analytics

---

## 9. System Architecture

## 9.1 High-Level Architecture
1. User opens dashboard.
2. Frontend fetches summary data and initializes global filters.
3. Backend aggregates account, investment, and spending data.
4. Chart engine receives normalized data and renders interactive visuals.
5. Insight engine produces summary messages and alerts.
6. Real-time updates push new data to the interface or simulate movement in demo mode.

---

## 9.2 Suggested Modules

### Frontend Modules
- Auth
- Shell layout
- KPI cards
- Chart panel
- Transaction table
- Watchlist
- Goals
- Alerts
- Settings

### Backend Modules
- Auth service
- Profile service
- Bank aggregation service
- Portfolio service
- Mutual fund service
- Expense service
- Insight service
- Notification service
- Scheduler / worker service

### Shared Utilities
- INR formatting
- Date range normalization
- Risk scoring helpers
- Return calculation logic
- Chart data transformation
- Color and theme tokens

---

## 10. Data Design Notes

## 10.1 Financial Formatting Rules
- Use INR currency symbol everywhere.
- Use comma-separated Indian numbering format.
- Respect decimals only when needed.
- Show short forms in charts where space is limited, but keep exact values in tooltips.

### Examples
- ₹1,25,000
- ₹12.4L
- ₹2.87Cr

### Display Rule
Use compact abbreviations on chart labels and precise values in hover tooltips.

---

## 10.2 Derived Metrics
- Net worth
- Liquid net worth
- Monthly savings rate
- Expense-to-income ratio
- Portfolio return
- SIP growth
- Goal completion rate
- Emergency fund runway
- Allocation concentration
- Risk score

---

## 11. Content and Insight Rules

### Insight Style
- Short, sharp, useful.
- Never vague.
- Never overly technical in the UI layer.
- Tie every insight to a measurable data source.

### Example Insight Cards
- “Dining expenses are up 22% this month.”
- “Your equity allocation is concentrated in 2 sectors.”
- “You have completed 68% of your emergency fund target.”
- “Your portfolio outperformed NIFTY 50 by 4.1% this quarter.”

---

## 12. Accessibility Guidelines
- Strong contrast ratio on all text.
- Keyboard navigation for core controls.
- Visible focus states.
- Screen-reader labels for charts and controls.
- Do not rely on color alone to communicate state.
- Support reduced motion preferences.
- Keep touch targets large enough for mobile usage.

---

## 13. Performance Guidelines
- Lazy-load heavy charts.
- Use memoization for derived values.
- Virtualize long tables and transaction lists.
- Throttle expensive updates.
- Use skeleton loaders instead of blocking screens.
- Cache time-range data intelligently.
- Optimize chart redraws to prevent jank.

---

## 14. Suggested MVP Build Order

### Phase 1
- Auth
- Shell layout
- Dashboard overview
- INR formatting system
- Bank account summary
- Expense charting
- Basic mutual fund and stock cards

### Phase 2
- Interactive chart suite
- Watchlists
- Candlestick charts
- Heatmaps
- Goal tracking
- Alerts

### Phase 3
- AI insights
- Real-time updates
- Advanced analytics
- Benchmark comparisons
- Deep drill-down workflows

### Phase 4
- Integrations
- Mobile optimization
- Advanced personalization
- Portfolio recommendation engine

---

## 15. Future Enhancements
- Voice-assisted finance queries
- Natural language financial search
- Predictive cash flow forecasting
- Tax estimation view
- Family finance mode
- Shared household budgeting
- PDF statement import
- Smart transaction auto-tagging
- Advanced scenario planning
- Portfolio rebalancing suggestions
- Custom themes and visual skins
- Web push and mobile app companion

---

## 16. Final Product Definition

Antigravity Finance should feel like a premium fintech command center: elegant, reactive, and data-rich. It must not look like a generic accounting tool. The visual identity should combine futuristic motion with financial seriousness, while the charting system should be central to the entire user experience.

The final application should make users feel that their money is organized, alive, and easy to understand.

**Design language:** floating, glassy, dark, clean, intelligent  
**Core value:** complex finance, made instantly visible  
**Primary outcome:** a dashboard users enjoy returning to every day