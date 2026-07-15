<div align="center">

# 🛠️ EngineerHub — Engineering Hub

### Multi-tool Web Platform for Engineers | Bilingual (Persian/English)

![PHP](https://img.shields.io/badge/PHP-8.2+-777BB4?style=flat-square&logo=php&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-MariaDB-4479A1?style=flat-square&logo=mysql&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-Vanilla-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5-7952B3?style=flat-square&logo=bootstrap&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

**[Overview](#-overview) • [Tools](#-tools) • [Installation](#-installation) • [Project Structure](#-project-structure) • [Security](#-security) • [License](#-license)**

</div>

---

## 📖 Overview

**EngineerHub** is a bilingual (Persian/English), RTL-ready web platform that provides a collection of practical tools for engineers, students, and professionals in a unified, integrated environment.

The project is built with **PHP & MySQL** on the backend and **Vanilla JavaScript** on the frontend, featuring a complete authentication system, admin panel, smart chatbot, and 9 specialized tools.

> 💡 **Note:** No frontend frameworks (React/Vue/Angular) are used — everything is written in pure JavaScript with no build step required.

---

## ✨ Key Features

- 🌐 **Bilingual UI** — Full support for Persian (RTL) and English (LTR) with live language switching and `localStorage` persistence
- 🔐 **Secure Authentication** — PDO with prepared statements, PHP sessions, "Remember Me" tokens stored in `user_sessions` table
- 👤 **User Roles** — `user` and `admin` roles with different access levels to the admin panel
- 🎨 **Full Customization** — Site title, slogan, primary color, and tool enable/disable from the admin panel
- 💬 **Smart Chatbot** — Answers frequently asked questions about each tool
- 📱 **Fully Responsive** — Compatible with mobile, tablet, and desktop using Bootstrap 5
- 🎵 **Music Catalog** — Album and song management from database with ID3 tag reading
- 🐛 **Error Logging** — All backend errors are stored in the `error_logs` table

---

## 🧰 Tools

| # | Tool | Description |
|---|------|-------------|
| 1 | 🧮 **Engineering Calculator** | Trigonometric functions, logarithms, power, `Ans`, percentage |
| 2 | 🔑 **Strong Password Generator** | Custom length, entropy analysis, pronounceable passwords, auto-copy |
| 3 | 🎬 **Video Player** | Direct URL & YouTube playback, VTT subtitles, playlist, theater mode |
| 4 | 📁 **File Manager** | File System Access API, deep search, rename & delete |
| 5 | 🎨 **Color Picker** | HEX/RGB/HSL/HSV/CMYK conversion, one-click copy |
| 6 | 📝 **Text Analyzer & Unit Converter** | Character/word/line counting, reading time, unit conversion |
| 7 | ✍️ **Rich Text Editor** | Formatting, undo/redo, auto-save, PDF export |
| 8 | ⏱️ **Stopwatch & Timer** | Millisecond precision, lap list, countdown timer |
| 9 | 🎵 **Music Player** | Album catalog, mini-player, ID3 tag reading |

---

## 🏗️ Technologies

### Backend
- **PHP 8.2+** — Server logic, session management, API endpoints
- **MySQL / MariaDB** — Storage with PDO and prepared statements
- **PHP Native Sessions** — Custom session name `ENGINEERHUB_SESSION`

### Frontend
- **Vanilla JavaScript (ES6+)** — No frameworks, modular architecture
- **Bootstrap 5** — Responsive grid and components
- **Custom CSS** — Glassmorphism, RTL/LTR aware

### Third-party Libraries (inside `assests/libs/`)
| Library | Purpose |
|---------|---------|
| `bootstrap.min.css` | UI framework |
| `jsmediatags.min.js` | ID3 tag reading from MP3 files |
| `html2pdf.bundle.min.js` | PDF export from editor content |
| `mammoth.browser.min.js` | `.docx` to HTML conversion |
| `jalaali.min.js` | Persian calendar conversion |

---

## 📁 Project Structure
