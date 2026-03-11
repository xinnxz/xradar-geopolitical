# 🌍 XRadar — Live Geopolitical & Market Impact Dashboard

![XRadar Dashboard](https://img.shields.io/badge/Status-Live-green?style=flat-square)
![React](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Vite-7-purple?style=flat-square&logo=vite)
![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)
![Contributions welcome](https://img.shields.io/badge/Contributions-welcome-orange.svg?style=flat-square)

Real-time dashboard yang memvisualisasikan dampak konflik geopolitik terhadap pasar keuangan global. Menampilkan data forex live, grafik komoditas, peta zona konflik interaktif, feed berita, dan indeks risiko geopolitik.

---

## 📑 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start)
- [API Keys Setup](#-api-keys)
- [Project Structure](#-project-structure)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

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
| Charts | Recharts & Lightweight Charts |
| Maps | Leaflet.js + React-Leaflet |
| Icons | Lucide React |
| Styling | Vanilla CSS (Dark Theme) |
| Deploy | Vercel |

## 🚀 Quick Start

### Prerequisites
Sebelum memulai, pastikan Anda telah menginstal **Node.js** (v18 atau lebih baru) dan **npm**.

### Installation

```bash
# Clone repo
git clone https://github.com/YOUR_USERNAME/xradar-geopolitical.git
cd xradar-geopolitical

# Install dependencies
npm install

# Setup Environment Variables (Optional)
cp .env.example .env
# Buka file .env dan tambahkan API Key GNews Anda jika ingin berita real-time
```

### Running Locally

```bash
# Menjalankan server development
npm run dev
```

Buka `http://localhost:5173` di browser Anda untuk melihat dashboard.

## 🔑 API Keys

| API | Required? | Free Tier | Sign Up |
|---|---|---|---|
| Frankfurter (Forex) | ❌ No | Unlimited | Tidak perlu |
| GNews (News) | Optional | 100 req/day | [gnews.io](https://gnews.io/register) |

> **Note:** Dashboard tetap dapat berfungsi tanpa API key (menggunakan mock data sebagai *fallback*). Tambahkan `VITE_GNEWS_KEY` di file `.env` untuk mendapatkan berita real-time.

## 📁 Project Structure

```text
src/
├── components/
│   ├── layout/      # Sidebar, Header & Footer components
│   ├── overview/    # Dashboard utama (Main Dashboard)
│   ├── market/      # Komponen grafik harga komoditas & forex
│   ├── news/        # Feed berita geopolitik
│   ├── map/         # Komponen peta interaktif Leaflet
│   └── risk/        # Indeks risiko geopolitik
├── services/        # Service logic untuk API calls & data fetching
├── hooks/           # Custom hooks React (contoh: auto-refresh)
├── data/            # Mock data & fallback assets
└── utils/           # Formatters kalimat, constants, risk calculator
```

## 🤝 Contributing

Kontribusi selalu diterima! Jika Anda mempunyai ide, menemukan *bug*, atau ingin menambahkan fitur baru, silakan berkontribusi. 

Untuk detail lebih lanjut, silakan baca [CONTRIBUTING.md](CONTRIBUTING.md) sebelum membuka issue atau pull request.
Beberapa langkah utama:
1. Fork repository ini 
2. Buat branch baru (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan Anda (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buka sebuah Pull Request

## 📄 License

Proyek ini didistribusikan di bawah lisensi MIT. Lihat file [LICENSE](LICENSE) untuk informasi lebih lanjut.

---
*Dibuat dengan ❤️ oleh Luthfi.*
