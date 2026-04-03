<div align="center">
  <img src="https://i.imgur.com/x0uO16U.png" alt="Finkar Logo" width="120" />
  <h1>FINKAR</h1>
  <p><strong>A futuristic personal finance dashboard for tracking, analyzing, and optimizing wealth.</strong></p>

  <p>
    <a href="#features">Features</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#installation">Installation</a> •
    <a href="#usage">Usage</a> •
    <a href="#license">License</a>
  </p>
</div>

---

## 🚀 Overview

**FINKAR** is a premium, action-oriented financial command center designed with a futuristic "antigravity" aesthetic. It unifies your bank accounts, stocks, mutual funds, and daily expenses into a single, visually addictive experience. Build wealth with clarity, precision, and purpose.

---

## ✨ Features

- 🌌 **Premium Visual Architecture**: Fluid glassmorphism, glowing micro-interactions, and floating components tuned for both dark and light modes.
- 📈 **Smart Unified Dashboard**: Real-time aggregated views of liquid cash, invested assets, and monthly net worth movement.
- 🤖 **Contextual AI Assistant**: Built-in AI chatbot panel that provides instant financial insights based on your local data.
- 📅 **Transaction Heatmap**: GitHub-style activity visualization to track your financial discipline over the past 52 weeks.
- 📊 **Advanced Analytics Tracking**: Interactive charts powered by Recharts for category breakdowns, asset allocation, and XIRR/ROI monitoring.
- 💾 **Local-First Privacy**: Your data is yours. Powered by robust Zustand-LocalStorage persistence.
- 👥 **Live Visitor Analytics**: Real-time visitor presence tracking integrated into the dashboard footer.

---

## 📸 Screenshots

> [!NOTE]
> *Actual screenshots coming soon. High-resolution mockups follow the "antigravity" glassmorphism design system.*

| Dashboard Overview | Analytics View |
| :---: | :---: |
| ![Dashboard Placeholder](https://via.placeholder.com/800x450.png?text=Dashboard+Overview) | ![Analytics Placeholder](https://via.placeholder.com/800x450.png?text=Advanced+Analytics) |

---

## 🛠 Tech Stack

- **Core**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS 4, Custom Glassmorphism CSS Framework
- **Animation**: Framer Motion
- **State Management**: Zustand (Persistence Middleware)
- **Charts**: Recharts
- **Icons**: Lucide React
- **Date Management**: date-fns

---

## 💻 Installation

### Prerequisites
- Node.js `^20.0.0`
- npm, yarn, or pnpm

### Steps
1. **Clone the repository:**
   ```bash
   git clone https://github.com/avik05/FINKAR.git
   cd FINKAR
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) to see your dashboard live.

---

## 📖 Usage Guide

1. **Dashboard**: Get an immediate snapshot of your net worth and investment performance.
2. **Accounts**: Add your Savings and Credit Card accounts to track liquid cash.
3. **Investments**: Log your NSE/BSE stocks and mutual funds to monitor absolute returns and XIRR.
4. **Activity**: Use the "Quick Add" button to log daily expenses. The heatmap will automatically reflect your activity density.
5. **Insights**: Hover over the AI Chatbot to ask questions like "How much have I spent on food this month?"

---

## 🌐 Deployment

This project is optimized for deployment on **Vercel** but can be exported to a static site for **GitHub Pages**:

```bash
# Export to static
npm run build && npm run export
```

---

## 🗺 Future Roadmap

- [ ] Support for live banking API integrations (Plaid/Salt Edge).
- [ ] Multi-currency support for international portfolios.
- [ ] Exportable monthly financial reports (PDF/CSV).
- [ ] Advanced budget forecasting using machine learning.

---

## 👨‍💻 Author

**Avik** — *Lead Engineer & Designer*

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.
