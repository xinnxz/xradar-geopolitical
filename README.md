# 🌍 XRadar — Live Geopolitical & Market Impact Dashboard

![XRadar Dashboard](https://img.shields.io/badge/Status-Live-green?style=flat-square) ![React](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react) ![Vite](https://img.shields.io/badge/Vite-7-purple?style=flat-square&logo=vite) ![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)

Real-time dashboard yang memvisualisasikan dampak konflik geopolitik terhadap pasar keuangan global. Menampilkan data forex live, grafik komoditas, peta zona konflik interaktif, feed berita, dan indeks risiko geopolitik.

## ✨ Fitur

- 📊 **Market Data** — Grafik harga minyak (WTI/Brent), emas, dan forex real-time
- 📰 **News Feed** — Berita geopolitik terkini dengan analisis sentimen
- 🗺️ **Conflict Map** — Peta interaktif zona konflik dan pembatasan penerbangan
- 📈 **Risk Index** — Indeks risiko geopolitik global dengan breakdown faktor
- 🔄 **Auto-refresh** — Data ter-update otomatis setiap 5-15 menit
- 🌙 **Dark Mode** — Desain premium dark theme

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Build Tool | Vite 7 |
| UI Framework | React 18 |
| Charts | Recharts |
| Maps | Leaflet.js + React-Leaflet |
| Icons | Lucide React |
| Styling | Vanilla CSS (Dark Theme) |
| Deploy | Vercel |

## 🚀 Quick Start

```bash
# Clone repo
git clone https://github.com/YOUR_USERNAME/xradar-geopolitical.git
cd xradar-geopolitical

# Install dependencies
npm install

# (Optional) Set API keys
cp .env.example .env
# Edit .env and add your GNews API key

# Run dev server
npm run dev
```

Buka `http://localhost:5173` di browser.

## 🔑 API Keys

| API | Required? | Free Tier | Sign Up |
|---|---|---|---|
| Frankfurter (Forex) | ❌ No | Unlimited | Tidak perlu |
| GNews (News) | Optional | 100 req/day | [gnews.io](https://gnews.io/register) |

> **Note:** Dashboard berfungsi tanpa API key (menggunakan mock data). Tambahkan GNews key di `.env` untuk berita real-time.

## 📁 Project Structure

```
src/
├── components/
│   ├── layout/      # Sidebar, Header
│   ├── overview/    # Dashboard utama
│   ├── market/      # Grafik harga & forex
│   ├── news/        # Feed berita
│   ├── map/         # Peta konflik
│   └── risk/        # Indeks risiko
├── services/        # API calls & caching
├── hooks/           # Custom hooks (auto-refresh)
└── utils/           # Formatters, constants, risk calculator
```

## 📄 License

MIT License — Free to use and modify.
