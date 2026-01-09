# POI Oracle v4.0 🗺️🤖

**AI Reasoning meets Ground Truth** — A production-ready spatial intelligence platform demonstrating how POI classification grounds AI reasoning in physical reality.

Built by **[Prasad Kavuri](https://prasadkavuri.com)** | AI Engineering Executive @ Ola Maps

🌐 **Live Demo**: [poi-oracle.vercel.app](https://poi-oracle.vercel.app)

---

## ✨ What's New in v4.0

| Issue Fixed | Solution |
|-------------|----------|
| 🗺️ Map not visible | Switched to Stadia Alidade Smooth Dark tiles - better contrast |
| 📜 Panels not scrollable | Added proper overflow-y: auto with custom scrollbars |
| 🏠 No home/reset button | Added home button in header to reset state |
| ✂️ Content cut off | Proper flex layout with scrollable containers |
| 🎨 Poor contrast | Deep blue theme (#0f172a) with vibrant accents |

---

## 🎨 Design Philosophy

Inspired by the best spatial visualization platforms:
- **Kepler.gl** (Uber) - Layer controls, filtering UI
- **CARTO** - Dashboard layouts, data visualization
- **Mapbox Studio** - Dark themes, professional cartography
- **Stamen Design** - Beautiful map tiles

### Color Palette

```css
--color-bg-primary: #0f172a;     /* Deep slate blue */
--color-primary: #3b82f6;        /* Vibrant blue */
--color-accent: #22d3ee;         /* Cyan glow */
--color-success: #22c55e;        /* Green verified */
--color-warning: #f59e0b;        /* Amber AI */
--color-ai: #a855f7;             /* Purple AI reasoning */
```

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────────────┐
│  HEADER                                                       │
│  [🏠 Home] [POI Oracle] [Demo Mode] [⚙️ Settings]             │
├─────────────────┬─────────────────────┬──────────────────────┤
│  INPUT PANEL    │  ANALYSIS PANEL     │  MAP PANEL           │
│  (380px)        │  (flexible)         │  (flexible)          │
│  ┌───────────┐  │  ┌───────────────┐  │  ┌────────────────┐  │
│  │ Query     │  │  │ AI Reasoning  │  │  │ Stadia Dark    │  │
│  │ Type Grid │  │  │ Card          │  │  │ Map Tiles      │  │
│  │ ────────  │  │  │ ─────────     │  │  │ ────────────── │  │
│  │ Text      │  │  │ Ground Truth  │  │  │ 🟠 AI Markers  │  │
│  │ Input     │  │  │ Card          │  │  │ 🟢 Verified    │  │
│  │ ────────  │  │  │ ─────────     │  │  │    POIs        │  │
│  │ [Analyze] │  │  │ Recommend.    │  │  │                │  │
│  │ ────────  │  │  │ Card          │  │  │                │  │
│  │ Examples  │  │  └───────────────┘  │  └────────────────┘  │
│  └───────────┘  │  (SCROLLABLE)       │                      │
│  (SCROLLABLE)   │                     │                      │
├─────────────────┴─────────────────────┴──────────────────────┤
│  Footer: Powered by Ollama • OpenStreetMap                    │
└──────────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start

```bash
# Clone
git clone https://github.com/prasad-kavuri/poi-oracle.git
cd poi-oracle

# Install
npm install

# Run
npm run dev

# Open http://localhost:3000
```

### With Ollama (Real AI)

```bash
# Install Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# Pull model
ollama pull llama3.2

# Start Ollama
ollama serve

# Configure (create .env.local)
NEXT_PUBLIC_USE_LLM=true
NEXT_PUBLIC_LLM_PROVIDER=ollama
```

---

## 📦 Project Structure

```
poi-oracle/
├── app/
│   └── globals.css          # Complete design system
├── components/
│   ├── MapView.tsx          # Leaflet map with Stadia tiles
│   └── SettingsModal.tsx    # LLM configuration
├── pages/
│   ├── api/
│   │   ├── analyze.ts       # Analysis endpoint
│   │   ├── status.ts        # LLM status
│   │   └── test-llm.ts      # Connection test
│   ├── index.tsx            # Main app
│   └── _app.tsx             # App wrapper
├── utils/
│   ├── aiReasoning.ts       # AI + ground truth logic
│   ├── llmIntegration.ts    # Ollama/OpenAI client
│   └── poiClassifier.ts     # 61% accuracy classifier
├── package.json
├── next.config.js
└── README.md
```

---

## 🗺️ Map Tiles

Using **Stadia Alidade Smooth Dark** for optimal visibility:

```javascript
url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
```

Features:
- High contrast labels on dark background
- Subtle terrain features visible
- POI markers stand out clearly
- Professional cartographic design

---

## 🎯 Key Features

| Feature | Description |
|---------|-------------|
| **Home Button** | Reset to initial state anytime |
| **Scrollable Panels** | All content accessible via scroll |
| **Better Map** | Stadia dark tiles with clear visibility |
| **Query Types** | Location, Market, Competitor, Optimize |
| **AI Reasoning** | LLM-powered spatial analysis |
| **Ground Truth** | 61% accuracy POI classifier |
| **Visual Markers** | Orange (AI) and Green (Verified) |

---

## 📱 Responsive Design

- **Desktop (1200px+)**: Full 3-panel layout
- **Tablet (768-1200px)**: 2-panel (input + analysis)
- **Mobile (<768px)**: Stacked layout

---

## 🚀 Deployment

### Vercel (Recommended)

```bash
npm i -g vercel
vercel
```

### Docker

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

---

## 👤 Author

**Prasad Kavuri**
- Role: AI Engineering Executive @ Ola Maps
- Portfolio: [prasadkavuri.com](https://prasadkavuri.com)
- GitHub: [@prasadkavuri](https://github.com/prasad-kavuri)

---

## 📄 License

MIT License - Free to use and modify.

---

**POI Oracle** — Because the best AI is grounded in reality 🌍✨
