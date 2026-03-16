// =====================================================
// WH40K FACTION ROULETTE - REACT APPLICATION
// =====================================================

// === React & Framer Motion hooks ===
const { useState, useEffect, useMemo } = React;
const { motion, AnimatePresence } = window.Motion;

// === Stałe (Constants) ===

// Tablica obiektów reprezentujących frakcje. Każda frakcja ma ID, nazwę, ścieżkę do ikony i kolor.
const FACTIONS = [
    { id: 'bt', name: 'Black Templars', icon: 'assets/Black_Templars.png', color: '#000000' },
    { id: 'ba', name: 'Blood Angels', icon: 'assets/Blood_Angels.png', color: '#8b0000' },
    { id: 'da', name: 'Dark Angels', icon: 'assets/Dark_Angels.png', color: '#064e3b' },
    { id: 'dw', name: 'Deathwatch', icon: 'assets/Deathwatch.png', color: '#2a2a2a' },
    { id: 'gk', name: 'Grey Knights', icon: 'assets/Grey_Knights.png', color: '#164e63' },
    { id: 'sm', name: 'Space Marines', icon: 'assets/Space_Marines.png', color: '#1e3a8a' },
    { id: 'sw', name: 'Space Wolves', icon: 'assets/Space_Wolves.png', color: '#78350f' }
];

// === Funkcje pomocnicze (Helper Functions) ===

/**
 * Tworzy i animuje efekt iskry w danym miejscu.
 * @param {number} x - Współrzędna X.
 * @param {number} y - Współrzędna Y.
 */
const createSpark = (x, y) => {
    const container = document.getElementById('sparks-container');
    if (!container) return;
    const spark = document.createElement('div');
    spark.className = 'spark';
    spark.style.left = `${x}px`;
    spark.style.top = `${y}px`;
    
    const angle = Math.random() * Math.PI * 2;
    const velocity = 5 + Math.random() * 5;
    const vx = Math.cos(angle) * velocity;
    const vy = Math.sin(angle) * velocity;
    
    container.appendChild(spark);
    
    let pos = { x, y };
    let opacity = 1;
    
    const animate = () => {
        pos.x += vx;
        pos.y += vy;
        opacity -= 0.05;
        spark.style.left = `${pos.x}px`;
        spark.style.top = `${pos.y}px`;
        spark.style.opacity = opacity;
        
        if (opacity > 0) {
            requestAnimationFrame(animate);
        } else {
            spark.remove();
        }
    };
    animate();
};

// === Komponenty React (React Components) ===

/**
 * Komponent okna deweloperskiego wyświetlający stan aplikacji.
 * @param {{data: object}} props - Dane do wyświetlenia.
 */
const DebugWindow = ({ data }) => {
    return (
        <div className="debug-window">
            <div className="debug-title">Cogitator Debug Console</div>
            {Object.entries(data).map(([key, value]) => (
                <div key={key} className="debug-item">
                    <span className="debug-label">{key}:</span> {JSON.stringify(value)}
                </div>
            ))}
        </div>
    );
};

/**
 * Główny komponent aplikacji.
 */
const App = () => {
    // === State Management ===
    const [screen, setScreen] = useState('prediction'); // Aktualny ekran: 'prediction', 'spinning', 'verdict'
    const [selectedFaction, setSelectedFaction] = useState(null); // Frakcja wybrana przez gracza
    const [winningFaction, setWinningFaction] = useState(null); // Frakcja wylosowana przez komputer
    const [rotation, setRotation] = useState(0); // Aktualny kąt obrotu koła
    const [isShaking, setIsShaking] = useState(false); // Czy koło ma się trząść
    const [debugData, setDebugData] = useState({}); // Dane dla okna deweloperskiego

    // === Side Effects (useEffect) ===

    // Aktualizuje dane w oknie deweloperskim za każdym razem, gdy zmienia się stan aplikacji.
    useEffect(() => {
        setDebugData({
            screen,
            playerChoice: selectedFaction ? selectedFaction.name : 'none',
            computerChoice: winningFaction ? winningFaction.name : 'none',
            targetRotation: Math.floor(rotation),
            isSpinning: screen === 'spinning'
        });
    }, [screen, selectedFaction, winningFaction, rotation]);

    // === Memoized Values (useMemo) ===

    // Oblicza i zapamiętuje tło conic-gradient dla koła. Zmienia się tylko, gdy zmieni się liczba frakcji.
    const wheelBackground = useMemo(() => {
        const sliceAngle = 360 / FACTIONS.length;
        let gradient = 'conic-gradient(';
        FACTIONS.forEach((faction, i) => {
            const startAngle = sliceAngle * i;
            const endAngle = sliceAngle * (i + 1);
            const color = i % 2 === 0 ? '#1a1a1a' : '#262626'; // Naprzemienne kolory tła
            gradient += `${color} ${startAngle}deg ${endAngle}deg, `;
        });
        return gradient.slice(0, -2) + ')'; // Usuwa ostatni przecinek i spację
    }, [FACTIONS]);


    // === Event Handlers & Logic ===

    /** Obsługuje wybór frakcji przez gracza. */
    const handleSelect = (faction) => {
        setSelectedFaction(faction);
    };

    /** Rozpoczyna animację kręcenia kołem. */
    const startSpin = () => {
        if (!selectedFaction) return;
        
        setScreen('spinning');
        setIsShaking(true);
        
        const winnerIndex = Math.floor(Math.random() * FACTIONS.length);
        const winner = FACTIONS[winnerIndex];
        
        const sliceAngle = 360 / FACTIONS.length;
        const extraSpins = (5 + Math.random() * 5) * 360; // 5-10 pełnych obrotów dla efektu
        
        // Celuje w środek wylosowanego wycinka. Odejmuje 90 stopni, aby wyrównać do wskaźnika na górze.
        const targetAngle = (FACTIONS.length - winnerIndex) * sliceAngle - (sliceAngle / 2) - 90;
        const finalAngle = extraSpins + targetAngle;
        
        setRotation(finalAngle);
        setWinningFaction(winner);

        // Tworzy iskry podczas obrotu
        const sparkInterval = setInterval(() => {
            const wheelEl = document.querySelector('.wheel-container');
            if (wheelEl) {
                const rect = wheelEl.getBoundingClientRect();
                createSpark(rect.left + rect.width/2, rect.top);
            }
        }, 100);

        // Po 5 sekundach zatrzymuje animację i pokazuje wynik
        setTimeout(() => {
            clearInterval(sparkInterval);
            setIsShaking(false);
            setScreen('verdict');
            if (winner.id === selectedFaction.id) {
                // Efekt konfetti w przypadku wygranej
                confetti({
                    particleCount: 150,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ['#c5a059', '#ffffff', '#8b0000']
                });
            }
        }, 5000);
    };

    /** Resetuje stan gry do początkowego. */
    const reset = () => {
        setScreen('prediction');
        setSelectedFaction(null);
        setWinningFaction(null);
        // Reset obrotu do początkowej wartości, aby animacja działała ponownie
        const currentRotation = rotation % 360;
        setRotation(currentRotation);
    };

    // === Render Logic ===
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 relative">
            {/* Zawsze renderuje okno debugowania */}
            <DebugWindow data={debugData} />
            
            {/* AnimatePresence zarządza animacjami wejścia/wyjścia komponentów */}
            <AnimatePresence mode="wait">
                {/* EKRAN 1: WYBÓR FRAKCJI */}
                {screen === 'prediction' && (
                    <motion.div 
                        key="prediction"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="max-w-4xl w-full text-center space-y-8"
                    >
                        <div className="space-y-2">
                            <h1 className="font-gothic text-4xl md:text-6xl text-gold tracking-widest drop-shadow-lg">
                                WH40K FACTION ROULETTE
                            </h1>
                            <p className="font-body text-xl italic text-gray-400">
                                "Wybierz swoje przeznaczenie w imieniu Imperatora (lub Bogów Chaosu)"
                            </p>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4 py-8">
                            {FACTIONS.map(faction => (
                                <div key={faction.id} className="flex flex-col items-center space-y-2">
                                    <div 
                                        onClick={() => handleSelect(faction)}
                                        className={`faction-circle ${selectedFaction?.id === faction.id ? 'selected' : ''}`}
                                    >
                                        <img src={faction.icon} alt={faction.name} className="faction-icon-img" />
                                    </div>
                                    <span className="text-[10px] font-gothic uppercase tracking-tighter text-gray-500 text-center">
                                        {faction.name}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {selectedFaction && (
                            <motion.button
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="gothic-btn"
                                onClick={startSpin}
                            >
                                Spin the Wheel of Fate
                            </motion.button>
                        )}
                    </motion.div>
                )}

                {/* EKRAN 2: KRĘCENIE KOŁEM */}
                {screen === 'spinning' && (
                    <motion.div 
                        key="spinning"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-center space-y-12"
                    >
                        <h2 className="font-gothic text-3xl text-gold animate-pulse">
                            THE RITE OF SELECTION...
                        </h2>

                        <div className={`wheel-container ${isShaking ? 'wheel-shaking' : ''}`}>
                            <div className="wheel-pointer"></div>
                            <motion.div 
                                className="wheel"
                                style={{ background: wheelBackground }} // Użycie wygenerowanego tła
                                animate={{ rotate: rotation }}
                                transition={{ duration: 5, ease: [0.15, 0, 0.15, 1] }}
                            >
                                {/* Renderowanie ikon frakcji na kole */}
                                {FACTIONS.map((faction, i) => {
                                    const sliceAngle = 360 / FACTIONS.length;
                                    // Kąt do pozycjonowania ikony w środku jej wycinka
                                    const angle = (sliceAngle * i) + (sliceAngle / 2) - 90;
                                    const radius = 140; // Odległość od środka koła
                                    
                                    // Obliczenia trygonometryczne do pozycjonowania
                                    const x = radius * Math.cos(angle * Math.PI / 180);
                                    const y = radius * Math.sin(angle * Math.PI / 180);

                                    return (
                                        <div 
                                            key={faction.id}
                                            className="wheel-content"
                                            style={{
                                                transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`
                                            }}
                                        >
                                            {/* Ikona obraca się razem z kołem. 
                                                Ustawiamy jej bazowy obrót tak, aby była skierowana 'na zewnątrz' (angle + 90).
                                            */}
                                            <div
                                                style={{ 
                                                    transform: `rotate(${angle + 90}deg)` 
                                                }}
                                            >
                                                <img src={faction.icon} alt={faction.name} className="w-12 h-12 object-contain" />
                                            </div>
                                        </div>
                                    );
                                })}
                            </motion.div>
                        </div>

                        <p className="font-body text-gray-500 italic">
                            The Omnissiah guides the machine spirit...
                        </p>
                    </motion.div>
                )}

                {/* EKRAN 3: WYNIK */}
                {screen === 'verdict' && (
                    <motion.div 
                        key="verdict"
                        initial={{ opacity: 0, scale: 1.2 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`fixed inset-0 flex items-center justify-center p-8 z-50 ${
                            winningFaction.id === selectedFaction.id ? 'bg-gold/20' : 'bg-blood/20'
                        }`}
                    >
                        <div className={`max-w-xl w-full grimdark-border bg-grimdark p-12 text-center space-y-8 relative overflow-hidden`}>
                            {/* Efekt poświaty w tle */}
                            <div className={`absolute -top-24 -left-24 w-64 h-64 rounded-full blur-3xl opacity-30 ${
                                winningFaction.id === selectedFaction.id ? 'bg-gold' : 'bg-blood'
                            }`}></div>

                            {/* Wynik: Wygrana */}
                            {winningFaction.id === selectedFaction.id ? (
                                <div className="space-y-6">
                                    <div className="text-gold text-6xl mb-4 flex justify-center">
                                        <img src={selectedFaction.icon} className="w-24 h-24" />
                                    </div>
                                    <h1 className="font-gothic text-5xl text-gold tracking-widest leading-tight">
                                        VICTORY FOR THE EMPEROR!
                                    </h1>
                                    <p className="text-xl text-gray-300">
                                        The Warp has favored your prediction. You chose the <span className="text-gold font-bold uppercase">{selectedFaction.name}</span>.
                                    </p>
                                </div>
                            ) : (
                                /* Wynik: Przegrana */
                                <div className="space-y-6">
                                    {/* Sekcja porównania: Wybór gracza vs Wynik losowania */}
                                    <div className="flex items-center justify-center gap-8 mb-8">
                                        {/* Ikona wybrana przez gracza */}
                                        <div className="flex flex-col items-center gap-2">
                                            <span className="text-[10px] text-gray-500 uppercase tracking-tighter">Your Prediction</span>
                                            <div className="w-20 h-20 p-3 bg-iron/30 border border-gold/30 rounded-sm opacity-50 grayscale flex items-center justify-center">
                                                <img src={selectedFaction.icon} className="w-full h-full object-contain" />
                                            </div>
                                        </div>

                                        {/* Stylizowana strzałka przejścia */}
                                        <div className="text-gold text-2xl pt-6">
                                            <motion.div
                                                animate={{ x: [0, 5, 0] }}
                                                transition={{ repeat: Infinity, duration: 1.5 }}
                                            >
                                                ▶▶
                                            </motion.div>
                                        </div>

                                        {/* Ikona wylosowana przez koło */}
                                        <div className="flex flex-col items-center gap-2">
                                            <span className="text-[10px] text-gold uppercase tracking-tighter">The Verdict</span>
                                            <div className="w-24 h-24 p-4 bg-gold/10 border-2 border-gold rounded-sm shadow-[0_0_20px_rgba(197,160,89,0.2)] flex items-center justify-center">
                                                <img src={winningFaction.icon} className="w-full h-full object-contain" />
                                            </div>
                                        </div>
                                    </div>
                                    <h1 className="font-gothic text-5xl text-blood tracking-widest leading-tight">
                                        HERESY DETECTED!
                                    </h1>
                                    <p className="text-xl text-gray-300">
                                        Your soul has been found wanting. You predicted <span className="text-gold font-bold uppercase">{selectedFaction.name}</span>, but the wheel chose <span className="text-rust font-bold uppercase">{winningFaction.name}</span>.
                                    </p>
                                </div>
                            )}

                            <div className="pt-8">
                                <button onClick={reset} className="gothic-btn">
                                    Retry the Ritual
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// === Inicjalizacja Aplikacji ===
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
