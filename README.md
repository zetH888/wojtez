# ⚔️ WH40K Faction Roulette ⚔️

A grimdark, web-based roulette application set in the universe of **Warhammer 40,000**. Choose your destiny in the name of the Emperor (or the Chaos Gods) and let the "Rite of Selection" decide your fate.

![Grimdark UI](https://img.shields.io/badge/Vibe-Grimdark-blood)
![React](https://img.shields.io/badge/Framework-React-blue)
![TailwindCSS](https://img.shields.io/badge/Style-TailwindCSS-teal)
![Framer Motion](https://img.shields.io/badge/Animation-Framer_Motion-purple)

---

## 💀 Features

- **Grimdark Aesthetic**: Gothic UI with CRT scanlines, flicker effects, and a dark metal/gold/blood color palette.
- **Interactive Wheel of Fate**: A smooth, physics-based spinning wheel that rotates all faction icons synchronously.
- **Dynamic Visuals**: Shaking effects and particle sparks generated during the selection ritual.
- **Verdict Screens**: Unique victory and defeat screens with stylized faction comparisons and a "Cogitator Debug Console".
- **Responsive Design**: Optimized for mobile devices, perfect for "floor-based" games or quick tabletop decisions.

## 🛠️ Technology Stack

- **Frontend**: React (18.x)
- **Styling**: Tailwind CSS (Play CDN)
- **Animations**: Framer Motion
- **Effects**: Canvas Confetti
- **Typography**: Google Fonts (Cinzel, Crimson Text)

## 📁 Project Structure

```text
wojtez/
├── index.html     # Main entry point & HTML structure
├── style.css      # Custom Grimdark & CRT styles
├── app.js         # React logic & Wheel mechanics
└── assets/        # Faction icons (Space Marines chapters)
```

## 🚀 How to Run

Since the project uses CDNs for all major libraries, you can run it in two ways:

1. **Local Server (Recommended)**:
   To avoid CORS issues with the `app.js` file, run a simple local server:
   ```bash
   # Using Python
   python -m http.server 8000
   ```
   Then open `http://localhost:8000` in your browser.

2. **Direct Execution**:
   If the scripts are bundled or you have disabled local CORS restrictions, simply open `index.html` in any modern web browser.

## 📜 Cogitator Debug Console
The application features a built-in debug window (bottom-right) that tracks:
- Current screen state
- Player's prediction
- The machine's random verdict
- Target rotation angles

---

> "The Omnissiah guides the machine spirit... Your soul has been found wanting, or your faith has been rewarded."

*Developed as a specialized tool for Warhammer 40k enthusiasts.*

# ⚔️ WH40K Faction Roulette ⚔️

Mroczna aplikacja webowa typu ruletka, osadzona w uniwersum **Warhammer 40,000**. Wybierz swoje przeznaczenie w imieniu Imperatora (lub Bogów Chaosu) i pozwól, aby "Ryt Wyboru" zdecydował o Twoim losie.

![Grimdark UI](https://img.shields.io/badge/Vibe-Grimdark-blood)
![React](https://img.shields.io/badge/Framework-React-blue)
![TailwindCSS](https://img.shields.io/badge/Style-TailwindCSS-teal)
![Framer Motion](https://img.shields.io/badge/Animation-Framer_Motion-purple)

---

## 💀 Funkcje

- **Estetyka Grimdark**: Gotycki interfejs z liniami skanowania CRT, efektami migotania i paletą barw opartą na ciemnym metalu, złocie i krwi.
- **Interaktywne Koło Przeznaczenia**: Płynnie działające koło fortuny, w którym ikony frakcji obracają się synchronicznie wraz z całą konstrukcją.
- **Dynamiczne Efekty**: Efekty trzęsienia ekranu i iskry generowane podczas rytuału losowania.
- **Ekrany Werdyktu**: Unikalne ekrany zwycięstwa i porażki ze stylizowanym porównaniem frakcji oraz konsolą debugowania "Cogitator".
- **Responsywność**: Aplikacja zoptymalizowana pod urządzenia mobilne, idealna do gier "podłogowych" lub szybkich decyzji przy stole bitewnym.

## 🛠️ Stos Technologiczny

- **Frontend**: React (18.x)
- **Stylizacja**: Tailwind CSS (Play CDN)
- **Animacje**: Framer Motion
- **Efekty**: Canvas Confetti
- **Typografia**: Google Fonts (Cinzel, Crimson Text)

## 📁 Struktura Projektu

```text
wojtez/
├── index.html     # Główny punkt wejścia i struktura HTML
├── style.css      # Niestandardowe style Grimdark i efekty CRT
├── app.js         # Logika React i mechanika koła
└── assets/        # Ikony frakcji (zakony Space Marines)
```

## 🚀 Jak Uruchomić

Ponieważ projekt korzysta z sieci CDN dla wszystkich głównych bibliotek, możesz go uruchomić na dwa sposoby:

1. **Lokalny Serwer (Zalecane)**:
   Aby uniknąć problemów z CORS przy ładowaniu pliku `app.js`, uruchom prosty serwer lokalny:
   ```bash
   # Używając Pythona
   python -m http.server 8000
   ```
   Następnie otwórz `http://localhost:8000` w przeglądarce.

2. **Bezpośrednie Uruchomienie**:
   Jeśli skrypty są odpowiednio skonfigurowane lub masz wyłączone lokalne ograniczenia CORS, po prostu otwórz `index.html` w dowolnej nowoczesnej przeglądarce.

## 📜 Konsola Debugowania Cogitator
Aplikacja posiada wbudowane okno debugowania (prawy dolny róg), które śledzi:
- Aktualny stan ekranu
- Wybór gracza
- Losowy werdykt maszyny
- Docelowe kąty obrotu

---

> "Omnissiah prowadzi ducha maszyny... Twoja dusza została uznana za godną lub Twoja wiara została wystawiona na próbę."

*Stworzone jako wyspecjalizowane narzędzie dla entuzjastów Warhammera 40k.*
.*
