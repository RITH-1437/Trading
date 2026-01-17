# 📊 Trading Discipline Dashboard

A minimal, clean trading discipline tracker for manual trading. No automation—just clarity, rules, and focus.

![Dark Mode Fintech UI](https://img.shields.io/badge/UI-Dark%20Mode-0a0e1a)
![React](https://img.shields.io/badge/React-18.2-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178c6)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8)

---

## 🎯 Purpose

This app helps traders maintain discipline by:

- ✅ Tracking daily profit/loss manually
- ✅ Enforcing discipline rules (max loss, profit target)
- ✅ Visualizing trading performance clearly
- ✅ Providing real-time status feedback

**Not for automation.** This is a manual tracker—you input the numbers, the app gives you clarity.

---

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
# Navigate to the project folder
cd Trading-discipline

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will automatically open at `http://localhost:3000`

---

## 🧱 Tech Stack

| Technology       | Purpose                       |
| ---------------- | ----------------------------- |
| **React 18**     | UI framework                  |
| **TypeScript**   | Type safety                   |
| **Tailwind CSS** | Styling (fintech dark mode)   |
| **Vite**         | Fast build tool               |
| **LocalStorage** | Data persistence (no backend) |

---

## 🖥️ Dashboard Features

### 1️⃣ Daily Input Card

- Enter starting balance
- Log profit/loss for the day
- Add optional discipline notes
- Auto-increments day number

### 2️⃣ Discipline Status (CRITICAL)

- **🟢 TARGET HIT** - Daily profit goal reached → STOP
- **🔴 MAX LOSS** - Max loss threshold hit → STOP
- **🟡 CONTINUE** - Within limits → Trade carefully

Customize your rules:

- Max daily loss (e.g., -$2)
- Daily profit target (e.g., +$3)

### 3️⃣ Daily Summary Cards

Each card shows:

- Starting balance
- Profit/Loss
- Total balance
- Max drawdown %
- Win/Loss status
- Current discipline status

### 4️⃣ History Table

Complete trading history with:

- All days in chronological order
- Total balance progression
- Drawdown tracking
- Individual day deletion
- Clear all data option

---

## 🧠 Key Logic

### Total Balance Calculation

```typescript
Total Balance = Previous Total + Today's P/L
```

### Max Drawdown

```typescript
Drawdown = ((Peak Balance - Current Balance) / Peak Balance) * 100
```

### Discipline Status

```typescript
if (P/L >= Profit Target) → 🟢 STOP (TARGET HIT)
else if (P/L <= Max Loss) → 🔴 STOP (MAX LOSS)
else → 🟡 CONTINUE
```

---

## 🎨 UI Design Principles

✅ **Dark mode default** - Easy on the eyes  
✅ **Fintech aesthetic** - Professional and clean  
✅ **Color-coded status** - Instant visual feedback  
✅ **Minimal distractions** - Focus on discipline  
✅ **Card-based layout** - Clear information hierarchy

---

## 💾 Data Persistence

All data is stored in **browser LocalStorage**:

- Survives page refresh
- No server required
- Private to your browser
- Can be cleared via "Clear All" button

⚠️ **Note**: Clearing browser data will erase all records.

---

## 📁 Project Structure

```
Trading-discipline/
├── src/
│   ├── components/
│   │   ├── DailyInput.tsx       # Input form for new days
│   │   ├── DailySummary.tsx     # Summary card component
│   │   ├── DisciplineStatus.tsx # Status indicator & rules
│   │   └── HistoryTable.tsx     # Complete history table
│   ├── App.tsx                  # Main app component
│   ├── types.ts                 # TypeScript interfaces
│   ├── storage.ts               # LocalStorage helpers
│   ├── utils.ts                 # Calculation utilities
│   ├── main.tsx                 # App entry point
│   └── index.css                # Global styles
├── index.html
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── vite.config.ts
└── README.md
```

---

## 🛠️ Available Scripts

```bash
# Development server (hot reload)
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

---

## 🎓 Usage Tips

1. **Set realistic rules** - Don't make targets too aggressive
2. **Log daily** - Consistency is key for tracking
3. **Respect the status** - When it says STOP, stop trading
4. **Review history** - Learn from patterns in your trading
5. **Use notes** - Document what you learned each day

---

## 🔒 Privacy

- ✅ All data stays on your device
- ✅ No external API calls
- ✅ No tracking or analytics
- ✅ Fully offline after initial load

---

## 🚧 Limitations

- Data is browser-specific (not synced across devices)
- No export/import functionality (future enhancement)
- No charts/graphs (intentionally minimal)
- No multi-user support

---

## 📝 License

MIT License - Free to use and modify

---

## 🙏 Credits

Built with discipline in mind for traders who value simplicity over complexity.

**Remember**: The best trading system is the one you actually follow.

---

## 💡 Future Enhancements (Optional)

- [ ] Export data to CSV
- [ ] Simple bar/line charts
- [ ] Weekly/monthly summaries
- [ ] Import previous data
- [ ] Dark/light theme toggle

---

**Happy Trading! 📈**
