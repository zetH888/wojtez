# ⚔️ WH40K Faction Roulette ⚔️

[PL] Mroczna aplikacja webowa typu ruletka osadzona w uniwersum Warhammer 40,000. Wybierz swoje przeznaczenie w imieniu Imperatora i pozwól, aby "Ryt Wyboru" zdecydował o Twoim losie.

[EN] A grimdark web-based roulette application set in the Warhammer 40,000 universe. Choose your destiny in the name of the Emperor and let the "Rite of Selection" decide your fate.

![Grimdark UI](https://img.shields.io/badge/Vibe-Grimdark-blood)
![React](https://img.shields.io/badge/Framework-React-blue)
![TailwindCSS](https://img.shields.io/badge/Style-TailwindCSS-teal)
![Framer Motion](https://img.shields.io/badge/Animation-Framer_Motion-purple)

---

## 🇵🇱 Opis Funkcjonalności (Polish)

### 💀 Główne Cechy
- **Estetyka Grimdark**: Gotycki interfejs użytkownika z efektami linii skanowania CRT, migotaniem i mroczną paletą barw (Złoto, Krew, Żelazo).
- **Rytuał Wyboru (Koło Fortuny)**: Płynna mechanika losowania z ikonami frakcji obracającymi się synchronicznie wraz z kołem.
- **System Audio Cathedral**: Atmosferyczna muzyka w tle (*Choirum Tenebrae*) z systemem dynamicznego wyciszania oraz efektami dźwiękowymi interakcji (hover, select, ticks).
- **Konsola Debugowania Cogitator**: Zaawansowane okno monitorowania stanu maszyny losującej w czasie rzeczywistym.
- **Werdykt Maszyny**: Unikalne ekrany zwycięstwa ("Victory for the Emperor") i porażki ("Heresy Detected") z animowanymi porównaniami.

### 🎮 Sterowanie
- **Ikona Głośnika (Prawy Górny Róg)**: Włączanie/wyłączanie kanałów Vox (muzyki).
- **Ikona Błędu (Prawy Dolny Róg)**: Przełączanie widoczności konsoli debugowania Cogitator.
- **Kliknięcie Frakcji**: Wybór Twojej przepowiedni.
- **Przycisk Rytuału**: Rozpoczęcie losowania.

---

## 🇬🇧 Features Breakdown (English)

### 💀 Core Features
- **Grimdark Aesthetic**: Gothic UI featuring CRT scanlines, flicker effects, and a "Blood & Iron" color palette.
- **Rite of Selection (Wheel of Fate)**: Smooth physics-based roulette mechanics with synchronous icon rotation.
- **Cathedral Audio Engine**: Atmospheric background music (*Choirum Tenebrae*) with dynamic fading and interaction SFX (hover, select, wheel ticks).
- **Cogitator Debug Console**: Real-time monitoring window for machine spirit diagnostics and ritual states.
- **Machine Verdict**: Dynamic outcome screens ("Victory for the Emperor" vs "Heresy Detected") with stylized faction comparisons.

### 🎮 Controls
- **Vox Icon (Top Right)**: Toggle background music (Vox channels).
- **Bug Icon (Bottom Right)**: Toggle the Cogitator Debug Console.
- **Faction Selection**: Click any faction icon to set your prediction.
- **Initiate Ritual**: Start the mechanical selection process.

---

## 🛠️ Struktura Projektu i Uruchomienie

```
wojtez/
├── index.html     # Główny punkt wejścia i struktura HTML
├── style.css      # Niestandardowe style Grimdark i efekty CRT
├── app.js         # Logika React i mechanika koła
├── sounds/        # Pliki audio (muzyka i efekty)
└── assets/        # Ikony frakcji (zakony Space Marines)
```

### 🚀 Jak Uruchomić

Ponieważ projekt korzysta z sieci CDN dla wszystkich głównych bibliotek, możesz go uruchomić na dwa sposoby:

1. **Lokalny Serwer (Zalecane)**:
   Aby uniknąć problemów z CORS przy ładowaniu pliku `app.js` oraz problemów z odtwarzaniem audio, uruchom prosty serwer lokalny:
   ```bash
   # Używając Pythona
   python -m http.server 8000
   ```
   Następnie otwórz `http://localhost:8000` w przeglądarce. Kliknij dowolne miejsce na stronie, aby aktywować dźwięk.

2. **Bezpośrednie Uruchomienie**:
   Otwarcie pliku `index.html` bezpośrednio z dysku (`file://`) może powodować problemy z wczytywaniem skryptów i dźwięków ze względu na politykę bezpieczeństwa przeglądarek. Zdecydowanie zaleca się metodę z serwerem lokalnym.

## 📜 Konsola Debugowania Cogitator
Aplikacja posiada wbudowane okno debugowania (prawy dolny róg), które śledzi:
- Aktualny stan ekranu (ritualsState)
- Wybór gracza (selectedInitiate)
- Losowy werdykt maszyny (machineVerdict)
- Energię kinetyczną koła (kineticEnergy)
- Status wyciszenia (voxActive)

## 🎮 Sterowanie / Controls
- **Ikona Głośnika (Prawy Górny Róg)**: Włączanie/wyłączanie muzyki w tle (Vox channels).
- **Ikona Błędu (Prawy Dolny Róg)**: Przełączanie widoczności konsoli debugowania Cogitator.
- **Wybór Frakcji**: Kliknij dowolną ikonę, aby ustawić swoją przepowiednię.
- **Inicjacja Rytuału**: Kliknij przycisk, aby rozpocząć mechaniczny proces losowania.

---

> "Omnissiah prowadzi ducha maszyny... Twoja dusza została uznana za godną lub Twoja wiara została wystawiona na próbę."
> 
> "The Omnissiah guides the machine spirit... Your soul has been found wanting, or your faith has been rewarded."

*Stworzone jako wyspecjalizowane narzędzie dla entuzjastów Warhammera 40k.*
