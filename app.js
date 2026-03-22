/**
 * =====================================================
 * WH40K FACTION ROULETTE - CORE LOGIC (React & Motion)
 * =====================================================
 * Refactored for professional naming conventions, 
 * security, and enhanced maintainability.
 */

// --- Destructure React & Framer Motion from globals ---
const { useState, useEffect, useMemo, useCallback } = React;
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
    { id: 'bt', name: 'Black Templars', icon: 'assets/Black_Templars.png', color: '#000000' },
    { id: 'ba', name: 'Blood Angels', icon: 'assets/Blood_Angels.png', color: '#8b0000' },
    { id: 'da', name: 'Dark Angels', icon: 'assets/Dark_Angels.png', color: '#064e3b' },
    { id: 'dw', name: 'Deathwatch', icon: 'assets/Deathwatch.png', color: '#2a2a2a' },
    { id: 'gk', name: 'Grey Knights', icon: 'assets/Grey_Knights.png', color: '#164e63' },
    { id: 'sm', name: 'Space Marines', icon: 'assets/Space_Marines.png', color: '#1e3a8a' },
    { id: 'sw', name: 'Space Wolves', icon: 'assets/Space_Wolves.png', color: '#78350f' }
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
 * @component CogitatorDebugConsole
 * @description A stylized developer window for real-time application monitoring.
 * @param {{ monitoringData: Object }} props
 */
const CogitatorDebugConsole = ({ monitoringData }) => {
    return (
        <div className="debug-window" aria-hidden="true">
            <div className="debug-title">Cogitator Debug Console</div>
            {Object.entries(monitoringData).map(([dataKey, dataValue]) => (
                <div key={dataKey} className="debug-item">
                    <span className="debug-label">{dataKey}:</span> {JSON.stringify(dataValue)}
                </div>
            ))}
        </div>
    );
};

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
    const [isMechanicalRitualActive, setIsMechanicalRitualActive] = useState(false);
    const [cogitatorMonitoringData, setCogitatorMonitoringData] = useState({});

    // --- Monitoring Synchronization ---
    useEffect(() => {
        setCogitatorMonitoringData({
            ritualsState: gameState,
            selectedInitiate: playerSelectedFaction ? playerSelectedFaction.name : 'null',
            machineVerdict: machineVerdictFaction ? machineVerdictFaction.name : 'null',
            kineticEnergy: Math.floor(wheelRotationAngle),
            isRitualInProgress: isMechanicalRitualActive
        });
    }, [gameState, playerSelectedFaction, machineVerdictFaction, wheelRotationAngle, isMechanicalRitualActive]);

    // --- Memoized Values ---
    const wheelConicBackground = useMemo(() => {
        const sliceAngle = 360 / WARHAMMER_FACTIONS_DATA.length;
        let gradientSegments = 'conic-gradient(';
        WARHAMMER_FACTIONS_DATA.forEach((_, index) => {
            const startAngle = sliceAngle * index;
            const endAngle = sliceAngle * (index + 1);
            const segmentColor = index % 2 === 0 ? '#1a1a1a' : '#262626';
            gradientSegments += `${segmentColor} ${startAngle}deg ${endAngle}deg, `;
        });
        return gradientSegments.slice(0, -2) + ')';
    }, []);

    // --- Action Handlers ---
    const handleFactionSelection = useCallback((factionData) => {
        if (isMechanicalRitualActive) return;
        setPlayerSelectedFaction(factionData);
    }, [isMechanicalRitualActive]);

    const initiateRitualOfSelection = useCallback(() => {
        if (!playerSelectedFaction || isMechanicalRitualActive) return;
        
        setGameState('spinning');
        setIsMechanicalRitualActive(true);
        
        const winningIndex = Math.floor(Math.random() * WARHAMMER_FACTIONS_DATA.length);
        const verdictFaction = WARHAMMER_FACTIONS_DATA[winningIndex];
        
        const sliceAngle = 360 / WARHAMMER_FACTIONS_DATA.length;
        const minimumSpins = 5 * 360; 
        const randomExtraMomentum = Math.random() * 5 * 360;
        
        const targetAngleOffset = (WARHAMMER_FACTIONS_DATA.length - winningIndex) * sliceAngle - (sliceAngle / 2) - 90;
        const totalKineticRotation = minimumSpins + randomExtraMomentum + targetAngleOffset;
        
        setWheelRotationAngle(totalKineticRotation);
        setMachineVerdictFaction(verdictFaction);

        // Feedback loops
        const ritualInterval = setInterval(() => {
            const wheelContainerElement = document.querySelector('.wheel-container');
            if (wheelContainerElement) {
                const wheelBounds = wheelContainerElement.getBoundingClientRect();
                spawnRitualSpark(wheelBounds.left + wheelBounds.width / 2, wheelBounds.top);
            }
        }, 100);

        setTimeout(() => {
            clearInterval(ritualInterval);
            setIsMechanicalRitualActive(false);
            setGameState('verdict');
            
            if (verdictFaction.id === playerSelectedFaction.id) {
                confetti({
                    particleCount: 150,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ['#c5a059', '#ffffff', '#8b0000']
                });
            }
        }, 5000);
    }, [playerSelectedFaction, isMechanicalRitualActive]);

    const resetRitualProtocol = useCallback(() => {
        setGameState('prediction');
        setPlayerSelectedFaction(null);
        setMachineVerdictFaction(null);
        setWheelRotationAngle(wheelRotationAngle % 360);
    }, [wheelRotationAngle]);

    // --- Rendering Logic ---
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 relative">
            <CogitatorDebugConsole monitoringData={cogitatorMonitoringData} />
            
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
                                        onClick={() => handleFactionSelection(faction)}
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
                                onClick={initiateRitualOfSelection}
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

                        <div className={`wheel-container ${isMechanicalRitualActive ? 'wheel-shaking' : ''}`}>
                            <div className="wheel-pointer"></div>
                            <motion.div 
                                className="wheel"
                                style={{ background: wheelConicBackground }}
                                animate={{ rotate: wheelRotationAngle }}
                                transition={{ duration: 5, ease: [0.15, 0, 0.15, 1] }}
                            >
                                {WARHAMMER_FACTIONS_DATA.map((faction, index) => {
                                    const sliceAngle = 360 / WARHAMMER_FACTIONS_DATA.length;
                                    const positioningAngle = (sliceAngle * index) + (sliceAngle / 2) - 90;
                                    const orbitRadius = 140; 
                                    
                                    const coordX = orbitRadius * Math.cos(positioningAngle * Math.PI / 180);
                                    const coordY = orbitRadius * Math.sin(positioningAngle * Math.PI / 180);

                                    return (
                                        <div 
                                            key={faction.id}
                                            className="wheel-content"
                                            style={{
                                                transform: `translate(-50%, -50%) translate(${coordX}px, ${coordY}px)`
                                            }}
                                        >
                                            <div style={{ transform: `rotate(${positioningAngle + 90}deg)` }}>
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
                                <button onClick={resetRitualProtocol} className="gothic-btn">
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
