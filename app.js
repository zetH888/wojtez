/**
 * =====================================================
 * WH40K FACTION ROULETTE - CORE LOGIC (React & Motion)
 * =====================================================
 * Refactored for professional naming conventions, 
 * security, and enhanced maintainability.
 */

// --- Destructure React & Framer Motion from globals ---
const { useState, useEffect, useMemo, useCallback, useRef } = React;
const { motion, AnimatePresence } = window.Motion;

/**
 * @typedef {Object} FactionDefinition
 * @property {string} id - Unique faction identifier
 * @property {string} name - Display name of the faction
 * @property {string} icon - Relative path to the icon asset
 * @property {string} color - Theme color for the faction
 */

/**
 * @constant {FactionDefinition[]}
 * @description Master data for all available Warhammer 40,000 chapters/factions.
 */
const WARHAMMER_FACTIONS_DATA = [
    { id: 'bt', name: 'Black Templars', icon: 'assets/Black_Templars.png', color: '#1a1a1a', bgGradient: 'radial-gradient(circle, #222 0%, #000 100%)' },
    { id: 'ba', name: 'Blood Angels', icon: 'assets/Blood_Angels.png', color: '#8b0000', bgGradient: 'radial-gradient(circle, #500 0%, #100 100%)' },
    { id: 'da', name: 'Dark Angels', icon: 'assets/Dark_Angels.png', color: '#064e3b', bgGradient: 'radial-gradient(circle, #020 0%, #000 100%)' },
    { id: 'dw', name: 'Deathwatch', icon: 'assets/Deathwatch.png', color: '#2a2a2a', bgGradient: 'radial-gradient(circle, #333 0%, #000 100%)' },
    { id: 'gk', name: 'Grey Knights', icon: 'assets/Grey_Knights.png', color: '#164e63', bgGradient: 'radial-gradient(circle, #123 0%, #000 100%)' },
    { id: 'sm', name: 'Space Marines', icon: 'assets/Space_Marines.png', color: '#1e3a8a', bgGradient: 'radial-gradient(circle, #005 0%, #000 100%)' },
    { id: 'sw', name: 'Space Wolves', icon: 'assets/Space_Wolves.png', color: '#78350f', bgGradient: 'radial-gradient(circle, #421 0%, #000 100%)' }
];

/**
 * @function spawnRitualSpark
 * @description Creates a visual spark element for mechanical ritual feedback.
 * @param {number} posX - X coordinate for the spark
 * @param {number} posY - Y coordinate for the spark
 */
const spawnRitualSpark = (posX, posY) => {
    const sparkContainer = document.getElementById('sparks-container');
    if (!sparkContainer) return;

    const sparkElement = document.createElement('div');
    sparkElement.className = 'spark';
    sparkElement.style.left = `${posX}px`;
    sparkElement.style.top = `${posY}px`;
    
    const randomAngle = Math.random() * Math.PI * 2;
    const initialVelocity = 5 + Math.random() * 5;
    const velX = Math.cos(randomAngle) * initialVelocity;
    const velY = Math.sin(randomAngle) * initialVelocity;
    
    sparkContainer.appendChild(sparkElement);
    
    let currentPos = { x: posX, y: posY };
    let currentOpacity = 1;
    
    /** Internal animation loop for the spark */
    const updateSparkPosition = () => {
        currentPos.x += velX;
        currentPos.y += velY;
        currentOpacity -= 0.05;
        
        sparkElement.style.left = `${currentPos.x}px`;
        sparkElement.style.top = `${currentPos.y}px`;
        sparkElement.style.opacity = currentOpacity;
        
        if (currentOpacity > 0) {
            requestAnimationFrame(updateSparkPosition);
        } else {
            sparkElement.remove();
        }
    };
    requestAnimationFrame(updateSparkPosition);
};

/**
 * @component VoxControl
 * @description Inline SVG Icon for Audio Control.
 */
const VoxControl = ({ isMuted, onToggleMute }) => (
    <button 
        className="vox-control" 
        onClick={onToggleMute}
        title={isMuted ? "Activate Vox Channels" : "Silence Vox Channels"}
    >
        {isMuted ? (
            <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
            </svg>
        ) : (
            <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
            </svg>
        )}
    </button>
);

/**
 * @component DebugControl
 * @description Inline SVG Icon for Debug Control.
 */
const DebugControl = ({ onToggleDebug }) => (
    <button 
        className="debug-control" 
        onClick={onToggleDebug}
        title="Toggle Cogitator Debug"
    >
        <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 8h-2.81c-.45-.78-1.07-1.45-1.82-1.96L17 4.41 15.59 3l-2.17 2.17C12.96 5.06 12.49 5 12 5c-.49 0-.96.06-1.41.17L8.41 3 7 4.41l1.62 1.63C7.88 6.55 7.26 7.22 6.81 8H4v2h2.09c-.05.33-.09.66-.09 1v1H4v2h2v1c0 .34.04.67.09 1H4v2h2.81c1.04 1.79 2.97 3 5.19 3s4.15-1.21 5.19-3H20v-2h-2.09c.05-.33.09-.66.09-1v-1h2v-2h-2v-1c0-.34-.04-.67-.09-1H20V8zm-6 8h-4v-2h4v2zm0-4h-4v-2h4v2z"/>
        </svg>
    </button>
);

/**
 * @component CogitatorDebugConsole
 * @description A stylized developer window for real-time application monitoring.
 */
const CogitatorDebugConsole = ({ monitoringData, isVisible, eventLog, onExportLogs }) => {
    if (!isVisible) return null;
    return (
        <div className="debug-window" aria-hidden="true" style={{ pointerEvents: 'auto' }}>
            <div className="debug-title">Cogitator Debug Console (Live 5Hz)</div>
            
            <div className="debug-section">System State</div>
            {Object.entries(monitoringData).map(([dataKey, dataValue]) => (
                <div key={dataKey} className="debug-item">
                    <span className="debug-label">{dataKey}:</span> {JSON.stringify(dataValue)}
                </div>
            ))}

            <div className="debug-section" style={{ marginTop: '10px', borderTop: '1px solid #444' }}>Recent Events</div>
            <div style={{ maxHeight: '100px', overflowY: 'auto', fontSize: '10px', color: '#888' }}>
                {eventLog.slice(-5).map((log, i) => (
                    <div key={i}>[{new Date(log.ts).toLocaleTimeString()}] {log.msg}</div>
                ))}
            </div>

            <button 
                onClick={onExportLogs}
                className="text-[10px] mt-2 text-gold border border-gold/30 px-2 py-1 hover:bg-gold/10 w-full"
            >
                Export Datacore Logs (.txt)
            </button>
        </div>
    );
};

/**
 * @component ErrorDisplay
 * @description Graceful error fallback for the machine spirit.
 */
const ErrorDisplay = ({ error, onReset }) => (
    <div className="fixed inset-0 bg-blood/90 z-[10000] flex flex-col items-center justify-center p-8 text-center">
        <h1 className="font-gothic text-6xl text-white mb-4">ABOMINABLE INTELLIGENCE FAILURE</h1>
        <p className="font-body text-xl text-white/80 mb-8 max-w-2xl">
            The machine spirit has encountered a critical deviation. Ritual sanctity compromised.<br/>
            <span className="font-mono text-sm block mt-4 bg-black/50 p-4 border border-white/20">
                {error?.toString() || "Unknown Error State"}
            </span>
        </p>
        <div className="flex gap-4">
            <button onClick={onReset} className="gothic-btn bg-white text-blood border-white">
                Re-Sanctify Machine (Restart)
            </button>
            <button onClick={() => window.location.reload()} className="gothic-btn border-white text-white">
                Hard Reset Cogitator
            </button>
        </div>
    </div>
);

/**
 * @component FactionRouletteApp
 * @description Root application component managing game states and selection ritual.
 */
const FactionRouletteApp = () => {
    // --- State Management ---
    const [gameState, setGameState] = useState('prediction'); // prediction | spinning | verdict
    const [playerSelectedFaction, setPlayerSelectedFaction] = useState(null);
    const [machineVerdictFaction, setMachineVerdictFaction] = useState(null);
    const [wheelRotationAngle, setWheelRotationAngle] = useState(0);
    const [visualRotation, setVisualRotation] = useState(0);
    const [isMechanicalRitualActive, setIsMechanicalRitualActive] = useState(false);
    const [cogitatorMonitoringData, setCogitatorMonitoringData] = useState({});
    const [isMuted, setIsMuted] = useState(false);
    const [isDebugVisible, setIsDebugVisible] = useState(false);
    const [isWarpEnabled, setIsWarpEnabled] = useState(true); // Re-added missing state
    const [applicationError, setApplicationError] = useState(null); // Global error state
    const [eventLog, setEventLog] = useState([]); // Log for debugger export

    // --- Audio System Management ---
    const audioRefs = useRef({
        bgm: null,
        bgmNext: null,
        hoverPool: [],
        select: null,
        ticks: [],
        victory: [],
        defeat: []
    });

    // Audio pool for ticks to allow overlapping during fast rotation
    const tickPoolRef = useRef([]);
    const tickPoolIndexRef = useRef(0);

    const tickIndexRef = useRef(0);
    const bgmToggleRef = useRef(true);
    const lastHoverTimeRef = useRef(0);
    const hoverPoolIndexRef = useRef(0);

    // Logging Utility
    const addLog = useCallback((msg) => {
        setEventLog(prev => [...prev, { ts: Date.now(), msg }].slice(-100));
    }, []);

    // Export Logs Utility
    const exportLogs = useCallback(() => {
        const content = eventLog.map(l => `[${new Date(l.ts).toISOString()}] ${l.msg}`).join('\n');
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `cogitator_log_${Date.now()}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    }, [eventLog]);

    // Live Debugger 5Hz Refresh
    useEffect(() => {
        if (!isDebugVisible) return;
        const interval = setInterval(() => {
            // Trigger a re-sync of monitoring data
            setCogitatorMonitoringData(prev => ({ ...prev, lastPulse: Date.now() }));
        }, 200); // 5Hz
        return () => clearInterval(interval);
    }, [isDebugVisible]);

    // Audio Initalization & Background Gradient First Run
    useEffect(() => {
        try {
            // First Run Detection & BG Init
            const isFirstRun = !localStorage.getItem('firstRun');
            if (isFirstRun) {
                document.body.style.transition = 'background 0.5s ease-in-out';
                document.body.style.background = 'radial-gradient(circle, #8B0000 0%, #654321 100%)';
                localStorage.setItem('firstRun', 'true');
                addLog("Initial consecration: First run detected");
            } else {
                document.body.style.background = "radial-gradient(circle at center, rgba(139, 0, 0, 0.4) 0%, rgba(10, 10, 10, 0.95) 70%, #0a0a0a 100%)";
            }

            const load = (src) => {
                const a = new Audio(src);
                a.preload = 'auto'; 
                a.load();
                return a;
            };

            const bgmSrc = 'sounds/choirum_tenebrae.mp3';
            audioRefs.current.bgm = load(bgmSrc);
            audioRefs.current.bgmNext = load(bgmSrc);
            
            audioRefs.current.hoverPool = [
                load('sounds/hover_over.mp3'),
                load('sounds/hover_over.mp3'),
                load('sounds/hover_over.mp3')
            ];

            audioRefs.current.select = load('sounds/select_item.mp3');
            audioRefs.current.ticks = [
                load('sounds/fortune_wheel_1.mp3'),
                load('sounds/fortune_wheel_2.mp3'),
                load('sounds/fortune_wheel_3.mp3')
            ];

            // Initialize tick pool for overlapping
            tickPoolRef.current = [
                load('sounds/fortune_wheel_1.mp3'),
                load('sounds/fortune_wheel_2.mp3'),
                load('sounds/fortune_wheel_3.mp3'),
                load('sounds/fortune_wheel_1.mp3'),
                load('sounds/fortune_wheel_2.mp3'),
                load('sounds/fortune_wheel_3.mp3')
            ];
            audioRefs.current.victory = [load('sounds/victory_sound_1.mp3'), load('sounds/victory_sound_2.mp3')];
            audioRefs.current.defeat = [load('sounds/defeat_sound_1.mp3'), load('sounds/defeat_sound_2.mp3')];

            const setupBgm = (audio) => {
                audio.volume = 0;
                audio.onended = () => handleBgmLoop();
            };

            setupBgm(audioRefs.current.bgm);
            setupBgm(audioRefs.current.bgmNext);

            const unlockAudioRitual = () => {
                const activeBgm = bgmToggleRef.current ? audioRefs.current.bgm : audioRefs.current.bgmNext;
                activeBgm.play().then(() => {
                    adjustVolume(activeBgm, 0.4, 2000);
                    addLog("Vox channels initialized");
                }).catch(e => console.warn("Vox channels blocked by browser policy:", e));
                window.removeEventListener('click', unlockAudioRitual);
            };

            const handleBgmLoop = () => {
                const currentBgm = bgmToggleRef.current ? audioRefs.current.bgm : audioRefs.current.bgmNext;
                const nextBgm = bgmToggleRef.current ? audioRefs.current.bgmNext : audioRefs.current.bgm;
                nextBgm.currentTime = 0;
                nextBgm.play();
                adjustVolume(nextBgm, 0.4, 2000);
                adjustVolume(currentBgm, 0, 2000);
                bgmToggleRef.current = !bgmToggleRef.current;
                addLog("BGM Cross-fade loop executed");
            };

            const crossFadeInterval = setInterval(() => {
                const activeBgm = bgmToggleRef.current ? audioRefs.current.bgm : audioRefs.current.bgmNext;
                if (activeBgm.duration > 0 && activeBgm.currentTime > activeBgm.duration - 2) {
                    handleBgmLoop();
                }
            }, 500);

            window.addEventListener('click', unlockAudioRitual);
            return () => {
                window.removeEventListener('click', unlockAudioRitual);
                clearInterval(crossFadeInterval);
                [audioRefs.current.bgm, audioRefs.current.bgmNext].forEach(b => {
                    if (b) { b.pause(); b.src = ""; }
                });
            };
        } catch (e) {
            setApplicationError(e);
            addLog(`CRITICAL: Audio initialization failure: ${e.message}`);
        }
    }, [addLog]);

    // Mute Logic
    useEffect(() => {
        [audioRefs.current.bgm, audioRefs.current.bgmNext].forEach(b => {
            if (b) b.muted = isMuted;
        });
    }, [isMuted]);

    /**
     * @function adjustVolume
     * @description Smoothly transitions audio volume.
     */
    const adjustVolume = (audio, targetVolume, duration) => {
        if (!audio) return;
        const startVolume = audio.volume;
        const steps = 20;
        const volumeStep = (targetVolume - startVolume) / steps;
        let currentStep = 0;
        
        const interval = setInterval(() => {
            currentStep++;
            audio.volume = Math.max(0, Math.min(1, startVolume + (volumeStep * currentStep)));
            if (currentStep >= steps) clearInterval(interval);
        }, duration / steps);
    };

    // Interaction SFX
    const playSFX = useCallback((type) => {
        try {
            const sfx = audioRefs.current[type];
            if (!sfx && type !== 'hover') return;

            if (type === 'tick') {
            const pool = tickPoolRef.current;
            if (pool.length === 0) return;
            
            const currentTick = pool[tickPoolIndexRef.current];
            currentTick.currentTime = 0;
            currentTick.volume = 0.3 + (Math.random() * 0.2);
            currentTick.play().catch(() => {});
            
            tickPoolIndexRef.current = (tickPoolIndexRef.current + 1) % pool.length;
        } else if (type === 'hover') {
                const now = Date.now();
                // Minimal delay between sounds to avoid digital noise, but allow overlapping
                if (now - lastHoverTimeRef.current < 50) return; 
                
                const pool = audioRefs.current.hoverPool;
                if (pool.length === 0) return;

                // Full AudioPool Implementation: 
                // Don't pause current, just play the next available in pool to allow overlapping
                const currentHover = pool[hoverPoolIndexRef.current];
                currentHover.currentTime = 0;
                currentHover.volume = 0.4;
                currentHover.play().catch(() => {});
                
                hoverPoolIndexRef.current = (hoverPoolIndexRef.current + 1) % pool.length;
                lastHoverTimeRef.current = now;
            } else if (Array.isArray(sfx)) {
                const randomSfx = sfx[Math.floor(Math.random() * sfx.length)];
                randomSfx.currentTime = 0;
                randomSfx.play().catch(() => {});
            } else {
                sfx.currentTime = 0;
                sfx.play().catch(() => {});
            }
        } catch (e) {
            console.error("SFX Engine error:", e);
        }
    }, []);

    // Wheel Ticks Logic with Fade-Out
    useEffect(() => {
        const sliceAngle = 360 / WARHAMMER_FACTIONS_DATA.length;
        const currentSlice = Math.floor(visualRotation / sliceAngle);
        const prevSlice = Math.floor((visualRotation - 1) / sliceAngle);
        
        if (currentSlice !== prevSlice && gameState === 'spinning') {
            const totalRotation = wheelRotationAngle;
            const progress = visualRotation / totalRotation;
            
            if (progress < 0.98) { // Allow ticks almost until the very end
                playSFX('tick');
            }
        }
    }, [visualRotation, gameState, playSFX, wheelRotationAngle]);

    // --- Monitoring Synchronization ---
    useEffect(() => {
        const activeBgm = bgmToggleRef.current ? audioRefs.current.bgm : audioRefs.current.bgmNext;
        
        setCogitatorMonitoringData({
            ritualsState: gameState,
            selectedInitiate: playerSelectedFaction ? playerSelectedFaction.name : 'null',
            machineVerdict: machineVerdictFaction ? machineVerdictFaction.name : 'null',
            kineticEnergy: Math.floor(visualRotation),
            isRitualInProgress: isMechanicalRitualActive,
            voxActive: !isMuted,
            warpField: isWarpEnabled,
            bgmVolume: activeBgm ? activeBgm.volume.toFixed(2) : 0,
            bgmSource: activeBgm ? activeBgm.src.split('/').pop() : 'none',
            hoverPoolIndex: hoverPoolIndexRef.current,
            currentBG: document.body.style.background.substring(0, 30) + '...'
        });
    }, [gameState, playerSelectedFaction, machineVerdictFaction, visualRotation, isMechanicalRitualActive, isMuted]);

    // --- Memoized Values ---
    const wheelConicBackground = useMemo(() => {
        const sliceAngle = 360 / WARHAMMER_FACTIONS_DATA.length;
        const colors = ['#333333', '#555555', '#777777', '#999999'];
        let gradientSegments = 'conic-gradient(';
        
        WARHAMMER_FACTIONS_DATA.forEach((_, index) => {
            const startAngle = sliceAngle * index;
            const endAngle = sliceAngle * (index + 1);
            // Algorithm: cycle through 4 colors, ensuring neighbors differ
            // For 7 factions: 0, 1, 2, 3, 0, 1, 2. (Last is 2, first is 0, so neighbors are OK)
            const colorIndex = index % colors.length;
            const segmentColor = colors[colorIndex];
            gradientSegments += `${segmentColor} ${startAngle}deg ${endAngle}deg, `;
        });
        return gradientSegments.slice(0, -2) + ')';
    }, []);

    // --- Action Handlers ---
    const handleFactionSelection = useCallback((factionData) => {
        if (isMechanicalRitualActive) return;
        playSFX('select');
        setPlayerSelectedFaction(factionData);
    }, [isMechanicalRitualActive, playSFX]);

    const initiateRitualOfSelection = useCallback(() => {
        try {
            if (!playerSelectedFaction || isMechanicalRitualActive) return;
            
            setGameState('spinning');
            setIsMechanicalRitualActive(true);
            
            const winningIndex = Math.floor(Math.random() * WARHAMMER_FACTIONS_DATA.length);
            const verdictFaction = WARHAMMER_FACTIONS_DATA[winningIndex];
            const sliceAngle = 360 / WARHAMMER_FACTIONS_DATA.length;
            const totalKineticRotation = (5 * 360) + (Math.random() * 5 * 360) + ((WARHAMMER_FACTIONS_DATA.length - winningIndex) * sliceAngle - (sliceAngle / 2) - 90);
            
            setWheelRotationAngle(totalKineticRotation);
            setMachineVerdictFaction(verdictFaction);
            addLog(`Machine Spirit calculating... Target: ${verdictFaction.name}`);

            // Music Fade
            setTimeout(() => {
                const activeBgm = bgmToggleRef.current ? audioRefs.current.bgm : audioRefs.current.bgmNext;
                adjustVolume(activeBgm, 0.1, 1000);
            }, 4000);

            // Sparks
            const ritualInterval = setInterval(() => {
                const wheel = document.querySelector('.wheel-container');
                if (wheel) {
                    const b = wheel.getBoundingClientRect();
                    spawnRitualSpark(b.left + b.width / 2, b.top);
                }
            }, 100);

            setTimeout(() => {
                clearInterval(ritualInterval);
                setIsMechanicalRitualActive(false);
                setGameState('verdict');
                
                if (verdictFaction.id === playerSelectedFaction.id) {
                    playSFX('victory');
                    addLog("RITUAL SUCCESS: Imperial Truth upheld");
                    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#c5a059', '#ffffff', '#8b0000'] });
                } else {
                    playSFX('defeat');
                    addLog("RITUAL FAILURE: Heretical deviation detected");
                }
                
                document.body.style.background = verdictFaction.bgGradient;
                const activeBgm = bgmToggleRef.current ? audioRefs.current.bgm : audioRefs.current.bgmNext;
                adjustVolume(activeBgm, 0.4, 2000);
            }, 5000);
        } catch (e) {
            setApplicationError(e);
            addLog(`CRITICAL: Ritual execution error: ${e.message}`);
        }
    }, [playerSelectedFaction, isMechanicalRitualActive, playSFX, addLog]);

    const resetRitualProtocol = useCallback(() => {
        setGameState('prediction');
        setPlayerSelectedFaction(null);
        setMachineVerdictFaction(null);
        setWheelRotationAngle(wheelRotationAngle % 360);
        
        // Reset background to default blood/grimdark gradient immediately
        const defaultBG = "radial-gradient(circle at center, rgba(139, 0, 0, 0.4) 0%, rgba(10, 10, 10, 0.95) 70%, #0a0a0a 100%)";
        document.body.style.transition = 'background 0.5s ease-in-out';
        document.body.style.background = defaultBG;
        
        // Reset CSS variables if used globally
        document.documentElement.style.setProperty('--primary-color', '#c5a059');
        document.documentElement.style.setProperty('--secondary-color', '#8b0000');
    }, [wheelRotationAngle]);

    // --- Rendering Logic ---
    if (applicationError) {
        return (
            <ErrorDisplay 
                error={applicationError} 
                onReset={() => {
                    setApplicationError(null);
                    resetRitualProtocol();
                    addLog("Emergency Sanctification: State reset by user");
                }} 
            />
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 relative">
            {/* Persistant Controls - Outside AnimatePresence to ensure constant visibility */}
            <VoxControl 
                isMuted={isMuted} 
                onToggleMute={() => {
                    setIsMuted(!isMuted);
                    addLog(`Vox channels ${!isMuted ? 'silenced' : 'activated'}`);
                }} 
            />
            <DebugControl 
                onToggleDebug={() => {
                    setIsDebugVisible(!isDebugVisible);
                    addLog(`Debugger visibility toggled: ${!isDebugVisible}`);
                }} 
            />
            <CogitatorDebugConsole 
                monitoringData={cogitatorMonitoringData} 
                isVisible={isDebugVisible} 
                eventLog={eventLog}
                onExportLogs={exportLogs}
            />
            
            <AnimatePresence mode="wait">
                {/* STAGE 1: INITIATE SELECTION */}
                {gameState === 'prediction' && (
                    <motion.div 
                        key="stage-prediction"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="max-w-4xl w-full text-center space-y-8"
                    >
                        <header className="space-y-2">
                            <h1 className="font-gothic text-4xl md:text-6xl text-gold tracking-widest drop-shadow-lg">
                                WH40K FACTION ROULETTE
                            </h1>
                            <p className="font-body text-xl italic text-gray-400">
                                "Choose your destiny in the name of the Emperor (or the Chaos Gods)"
                            </p>
                        </header>

                        <section className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4 py-8">
                            {WARHAMMER_FACTIONS_DATA.map(faction => (
                                <article key={faction.id} className="flex flex-col items-center space-y-2">
                                    <div 
                                        role="button"
                                        aria-label={`Select ${faction.name}`}
                                        onMouseEnter={() => {
                                            playSFX('hover');
                                            addLog(`Hover: ${faction.name}`);
                                        }}
                                        onClick={() => {
                                            handleFactionSelection(faction);
                                            addLog(`Selected Prediction: ${faction.name}`);
                                        }}
                                        className={`faction-circle ${playerSelectedFaction?.id === faction.id ? 'selected' : ''}`}
                                    >
                                        <img src={faction.icon} alt={faction.name} className="faction-icon-img" />
                                    </div>
                                    <span className="text-[10px] font-gothic uppercase tracking-tighter text-gray-500 text-center">
                                        {faction.name}
                                    </span>
                                </article>
                            ))}
                        </section>

                        {playerSelectedFaction && (
                            <motion.button
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="gothic-btn"
                                onMouseEnter={() => playSFX('hover')}
                                onClick={() => {
                                    addLog("Initiating Sacred Ritual of Selection");
                                    initiateRitualOfSelection();
                                }}
                            >
                                Initiate Ritual of Selection
                            </motion.button>
                        )}
                    </motion.div>
                )}

                {/* STAGE 2: MECHANICAL RITUAL (SPINNING) */}
                {gameState === 'spinning' && (
                    <motion.div 
                        key="stage-spinning"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-center space-y-12"
                    >
                        <h2 className="font-gothic text-3xl text-gold animate-pulse">
                            THE RITE OF SELECTION...
                        </h2>

                        <div className={`wheel-container ${gameState === 'spinning' ? 'wheel-shaking' : ''}`}>
                            <div className="wheel-pointer"></div>
                            <motion.div 
                                className={`wheel ${isWarpEnabled ? 'warp-effect' : ''}`}
                                style={{ 
                                    background: wheelConicBackground,
                                    filter: isWarpEnabled && isMechanicalRitualActive ? `blur(${Math.min(5, visualRotation / 500)}px)` : 'none'
                                }}
                                animate={{ rotate: wheelRotationAngle }}
                                transition={{ duration: 5, ease: [0.15, 0, 0.15, 1] }}
                                onUpdate={(latest) => setVisualRotation(latest.rotate)}
                            >
                                {WARHAMMER_FACTIONS_DATA.map((faction, index) => {
                                    const sliceAngle = 360 / WARHAMMER_FACTIONS_DATA.length;
                                    const positioningAngle = (sliceAngle * index) + (sliceAngle / 2);
                                    const orbitRadius = 140; 
                                    
                                    const coordX = orbitRadius * Math.cos((positioningAngle - 90) * Math.PI / 180);
                                    const coordY = orbitRadius * Math.sin((positioningAngle - 90) * Math.PI / 180);

                                    return (
                                        <div 
                                            key={faction.id}
                                            className="wheel-content"
                                            style={{
                                                transform: `translate(-50%, -50%) translate(${coordX}px, ${coordY}px)`
                                            }}
                                        >
                                            <div style={{ transform: `rotate(${positioningAngle}deg)` }}>
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

                {/* STAGE 3: THE MACHINE VERDICT */}
                {gameState === 'verdict' && (
                    <motion.div 
                        key="stage-verdict"
                        initial={{ opacity: 0, scale: 1.2 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`fixed inset-0 flex items-center justify-center p-8 z-50 ${
                            machineVerdictFaction.id === playerSelectedFaction.id ? 'bg-gold/20' : 'bg-blood/20'
                        }`}
                    >
                        <div className={`max-w-xl w-full grimdark-border bg-grimdark p-12 text-center space-y-8 relative overflow-hidden`}>
                            <div className={`absolute -top-24 -left-24 w-64 h-64 rounded-full blur-3xl opacity-30 ${
                                machineVerdictFaction.id === playerSelectedFaction.id ? 'bg-gold' : 'bg-blood'
                            }`}></div>

                            {machineVerdictFaction.id === playerSelectedFaction.id ? (
                                <section className="space-y-6">
                                    <div className="text-gold text-6xl mb-4 flex justify-center">
                                        <img src={playerSelectedFaction.icon} className="w-24 h-24" alt="Winning Icon" />
                                    </div>
                                    <h1 className="font-gothic text-5xl text-gold tracking-widest leading-tight">
                                        VICTORY FOR THE EMPEROR!
                                    </h1>
                                    <p className="text-xl text-gray-300">
                                        The Warp has favored your prediction. You chose the <span className="text-gold font-bold uppercase">{playerSelectedFaction.name}</span>.
                                    </p>
                                </section>
                            ) : (
                                <section className="space-y-6">
                                    <div className="flex items-center justify-center gap-8 mb-8">
                                        <div className="flex flex-col items-center gap-2">
                                            <span className="text-[10px] text-gray-500 uppercase tracking-tighter">Your Prediction</span>
                                            <div className="w-20 h-20 p-3 bg-iron/30 border border-gold/30 rounded-sm opacity-50 grayscale flex items-center justify-center">
                                                <img src={playerSelectedFaction.icon} className="w-full h-full object-contain" alt="Selected" />
                                            </div>
                                        </div>

                                        <div className="text-gold text-2xl pt-6">
                                            <motion.div
                                                animate={{ x: [0, 5, 0] }}
                                                transition={{ repeat: Infinity, duration: 1.5 }}
                                            >
                                                ▶▶
                                            </motion.div>
                                        </div>

                                        <div className="flex flex-col items-center gap-2">
                                            <span className="text-[10px] text-gold uppercase tracking-tighter">The Verdict</span>
                                            <div className="w-24 h-24 p-4 bg-gold/10 border-2 border-gold rounded-sm shadow-[0_0_20px_rgba(197,160,89,0.2)] flex items-center justify-center">
                                                <img src={machineVerdictFaction.icon} className="w-full h-full object-contain" alt="Verdict" />
                                            </div>
                                        </div>
                                    </div>
                                    <h1 className="font-gothic text-5xl text-blood tracking-widest leading-tight">
                                        HERESY DETECTED!
                                    </h1>
                                    <p className="text-xl text-gray-300">
                                        Your soul has been found wanting. You predicted <span className="text-gold font-bold uppercase">{playerSelectedFaction.name}</span>, but the wheel chose <span className="text-rust font-bold uppercase">{machineVerdictFaction.name}</span>.
                                    </p>
                                </section>
                            )}

                            <div className="pt-8">
                                <button 
                                    onClick={resetRitualProtocol} 
                                    onMouseEnter={() => playSFX('hover')}
                                    className="gothic-btn"
                                >
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

// --- Application Initialization ---
const applicationEntryPoint = ReactDOM.createRoot(document.getElementById('root'));
applicationEntryPoint.render(<FactionRouletteApp />);
