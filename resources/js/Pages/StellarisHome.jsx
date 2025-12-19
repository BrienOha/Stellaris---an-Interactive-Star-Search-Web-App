import React, { useState, useEffect, useRef } from 'react';
import SpaceScene from '@/Components/SpaceScene';
import StarDetails from '@/Components/StarDetails';
import { Head, Link, useForm, router } from '@inertiajs/react';
import CosmicLayout from '@/Layouts/CosmicLayout';
import { motion, AnimatePresence } from 'framer-motion';

// --- COMPONENT: Captain's Message ---
const CaptainsMessage = ({ userName, onClose }) => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
        <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="max-w-xl w-full bg-[#0a0f1e] border border-blue-500/30 p-8 rounded shadow-2xl relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-blue-500 shadow-[0_0_10px_#3b82f6]"></div>
            <h2 className="text-2xl font-mono text-blue-400 mb-4 tracking-widest uppercase flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span> Incoming Transmission
            </h2>
            <div className="font-sans text-gray-300 leading-relaxed space-y-4 text-lg">
                <p> "Welcome back, Commander <span className="text-white font-bold">{userName}</span>." </p>
                <p> Our long-range sensors are online. The local database is currently incomplete. </p>
                <p> <strong className="text-white">Mission:</strong> Search for new star systems. If you find a star not in our records, it will be added to the Global Stardex for all commanders to see. </p>
            </div>
            <button onClick={onClose} className="mt-8 w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-mono uppercase tracking-widest rounded transition">
                Acknowledge & Begin Scanning
            </button>
        </motion.div>
    </motion.div>
);

// --- COMPONENT: Commander Profile Modal ---
const CommanderProfile = ({ auth, onClose }) => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
        <div className="w-full max-w-md bg-[#050714] border border-blue-500/30 p-8 rounded-lg relative overflow-hidden">
            <button onClick={onClose} className="absolute top-4 right-4 text-blue-500 hover:text-white font-mono uppercase text-xs">[ Close ]</button>
            <div className="text-center mb-8">
                <div className="w-24 h-24 bg-blue-900/20 rounded-full mx-auto mb-4 border-2 border-blue-500 flex items-center justify-center text-4xl">{auth.user.name.charAt(0)}</div>
                <h2 className="text-2xl font-mono text-white tracking-widest uppercase">{auth.user.name}</h2>
                <p className="text-blue-500 text-xs tracking-[0.3em] uppercase mt-1">Class A Commander</p>
            </div>
            <div className="space-y-4 font-mono text-sm">
                <div className="flex justify-between border-b border-blue-900/50 pb-2">
                    <span className="text-gray-500">EMAIL LINK</span>
                    <span className="text-blue-200">{auth.user.email}</span>
                </div>
                <div className="flex justify-between border-b border-blue-900/50 pb-2">
                    <span className="text-gray-500">STATUS</span>
                    <span className="text-green-400">ACTIVE</span>
                </div>
            </div>
        </div>
    </motion.div>
);

export default function StellarisHome({ sidebarList, searchedStar, userNotes, auth, errors, isNewDiscovery }) {
    const [selectedStar, setSelectedStar] = useState(null);
    const [showCaptain, setShowCaptain] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    
    // --- AUDIO LOGIC ---
    const [audioEnabled, setAudioEnabled] = useState(false);
    const musicRef = useRef(null);

    const { data, setData, get, processing } = useForm({ query: '' });

    // 1. Initialize Audio
    useEffect(() => {
        musicRef.current = new Audio('/audio/space_ambient.mp3'); 
        musicRef.current.loop = true;
        musicRef.current.volume = 0.4; 

        return () => { 
            if(musicRef.current) {
                musicRef.current.pause();
                musicRef.current.currentTime = 0;
            }
        };
    }, []);

    // 2. Toggle Function
    const toggleMusic = () => {
        if (!musicRef.current) return;

        if (!audioEnabled) {
            musicRef.current.play()
                .then(() => setAudioEnabled(true))
                .catch(e => console.error("Audio interaction needed:", e));
        } else {
            musicRef.current.pause();
            setAudioEnabled(false);
        }
    };

    // Handle Search Results
    useEffect(() => {
        if (searchedStar) setSelectedStar(searchedStar);
    }, [searchedStar]);

    // Handle Captain Message
    useEffect(() => {
        const key = `captain_greeted_${auth.user.id}`;
        if (!sessionStorage.getItem(key)) {
            setShowCaptain(true);
        }
    }, [auth.user.id]);

    const closeCaptain = () => {
        const key = `captain_greeted_${auth.user.id}`;
        sessionStorage.setItem(key, 'true');
        setShowCaptain(false);
        
        if (musicRef.current && !audioEnabled) {
            musicRef.current.play()
                .then(() => setAudioEnabled(true))
                .catch(e => console.error("Auto-play blocked:", e));
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        get(route('star.search'), { preserveState: true, preserveScroll: true });
    };

    const clickSuggestion = (name) => {
        setData('query', name);
        setTimeout(() => router.get(route('star.search'), { query: name }, { preserveState: true }), 100);
    };

    const currentNote = selectedStar && userNotes ? userNotes[selectedStar.name] : null;

    return (
        <CosmicLayout>
            <Head title="Star Search" />
            
            <div className="w-screen h-screen overflow-hidden bg-space text-white relative font-sans">
                
                {/* 1. 3D Scene */}
                <div className="absolute inset-0 z-0">
                    <SpaceScene searchedStar={searchedStar} onStarSelect={setSelectedStar} />
                </div>

                {/* 2. Top Bar (Search) */}
                <div className="absolute top-0 left-0 w-full p-6 z-20 flex flex-col items-center pointer-events-none">
                    <div className="pointer-events-auto w-full max-w-xl">
                        <form onSubmit={handleSearch} className="relative group">
                            <input
                                type="text"
                                value={data.query}
                                onChange={e => setData('query', e.target.value)}
                                placeholder="ENTER TARGET SYSTEM..."
                                className="w-full bg-[#050714]/90 backdrop-blur-md border border-blue-500/30 rounded-full py-4 px-8 text-white font-mono tracking-widest placeholder-blue-500/50 focus:border-blue-400 focus:shadow-[0_0_30px_#3b82f6] outline-none transition-all uppercase"
                            />
                            <button disabled={processing} className="absolute right-2 top-2 bottom-2 px-6 bg-blue-600/80 hover:bg-blue-500 rounded-full text-xs font-bold tracking-widest uppercase transition">
                                {processing ? 'SCANNING' : 'SCAN'}
                            </button>
                        </form>

                        <AnimatePresence>
                            {errors.search && (
                                <motion.div 
                                    initial={{ opacity: 0, height: 0 }} 
                                    animate={{ opacity: 1, height: 'auto' }} 
                                    exit={{ opacity: 0 }}
                                    className="mt-4"
                                >
                                    <div className="bg-red-900/80 border-l-4 border-red-500 text-red-200 p-4 font-mono text-xs shadow-[0_0_20px_rgba(220,38,38,0.5)] backdrop-blur-md flex items-start gap-3">
                                        <div className="text-2xl">⚠</div>
                                        <div>
                                            <p className="font-bold tracking-widest">SYSTEM ALERT: 404_NOT_FOUND</p>
                                            <p className="mt-1 opacity-80">
                                                Target coordinates invalid or object is beyond sensor range. 
                                                Check spelling or try a known bright star (e.g., 'Antares').
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <AnimatePresence>
                            {isNewDiscovery && (
                                <motion.div 
                                    initial={{ opacity: 0, y: -20 }} 
                                    animate={{ opacity: 1, y: 0 }} 
                                    exit={{ opacity: 0 }}
                                    className="mt-4"
                                >
                                    <div className="bg-green-900/80 border-l-4 border-green-500 text-green-100 p-4 font-mono text-xs shadow-[0_0_20px_rgba(34,197,94,0.5)] backdrop-blur-md flex items-center gap-3">
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                        <div>
                                            <p className="font-bold tracking-widest">NEW DATA ACQUIRED</p>
                                            <p className="mt-1">
                                                Target added to the Global Stardex. Nice work, Commander.
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* 3. Left Sliding Sidebar 
                    FIX: Added pointer-events-none to container, pointer-events-auto to inner content.
                    This prevents the invisible container space from blocking clicks on the Audio button.
                */}
                <div className="fixed left-5 top-24 bottom-6 z-40 flex items-center pointer-events-none">
                    <div className="w-72 h-full bg-[#050714]/90 backdrop-blur-xl border-r border-blue-500/50 shadow-[0_0_30px_rgba(59,130,246,0.2)] transform -translate-x-[17.5rem] hover:translate-x-0 transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] flex flex-col overflow-hidden group pointer-events-auto">
                        <div className="absolute right-0 top-0 bottom-0 w-3 bg-blue-900/20 hover:bg-blue-600/20 cursor-pointer flex items-center justify-center transition-colors">
                            <div className="h-16 w-1 bg-blue-400/50 rounded-full shadow-[0_0_10px_#60a5fa] group-hover:bg-blue-300 transition-all"></div>
                            <div className="absolute top-1/2 -right-8 transform -rotate-90 origin-center text-[10px] font-mono tracking-[0.3em] text-blue-400 opacity-100 group-hover:opacity-0 transition-opacity w-32 text-center">DATABASE</div>
                        </div>
                        <div className="p-5 border-b border-blue-500/20 bg-blue-900/10 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                            <h3 className="font-mono text-blue-300 tracking-widest uppercase text-sm flex items-center gap-2">
                                <span className="text-xl">ST</span> Discovered Stars
                            </h3>
                            <p className="text-[10px] text-gray-400 mt-1 font-mono">
                                Local Database // {sidebarList.length} Records
                            </p>
                        </div>
                        <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-150">
                            {sidebarList.map((starName, i) => (
                                <button
                                    key={i}
                                    onClick={() => clickSuggestion(starName)}
                                    className="w-full text-left px-4 py-3 rounded border border-transparent hover:bg-blue-500/20 hover:border-blue-500/30 text-gray-400 hover:text-white transition-all font-mono text-sm tracking-wider uppercase group/item flex justify-between items-center"
                                >
                                    <span>{starName}</span>
                                    <span className="text-blue-500 opacity-0 group-hover/item:opacity-100 text-xs">→</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 4. Right Top (Profile & Logout) */}
                <div className="absolute top-6 right-6 z-20 flex flex-col items-end gap-2">
                     <button onClick={() => setShowProfile(true)} className="group flex items-center gap-3 bg-black/40 border border-blue-500/30 px-12 py-6 rounded hover:bg-blue-900/30 transition backdrop-blur-md">
                        <div className="text-right">
                            <span className="block text-[15px] text-blue-400 uppercase tracking-widest">Commander</span>
                            <span className="text-[20px] font-bold font-mono text-white group-hover:text-blue-200">{auth.user.name}</span>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-blue-600/20 border border-blue-400 flex items-center justify-center text-xs">{auth.user.name.charAt(0)}</div>
                     </button>
                     
                     <div className="flex gap-2">
                        <Link href={route('observatory')} className="px-10 py-5 bg-black/60 border border-white/10 rounded hover:border-blue-400 text-[15px] font-mono tracking-widest uppercase text-gray-400 hover:text-white transition">
                            Observatory
                        </Link>
                        <Link href={route('logout')} method="post" as="button" className="px-10 py-5 bg-red-900/20 border border-red-500/20 rounded hover:bg-red-900/50 text-[15px] font-mono tracking-widest uppercase text-red-300 transition">
                            Logout
                        </Link>
                     </div>
                </div>

                {/* 5. BOTTOM LEFT: AUDIO TOGGLE 
                    FIX: Increased Z-index to 50 to ensure it floats above ambient layers if necessary.
                */}
                <div className="fixed bottom-8 left-16 z-50">
                    <button
                        onClick={toggleMusic}
                        className={`
                            flex items-center gap-3 px-5 py-3 rounded-full border backdrop-blur-md transition-all duration-300
                            ${audioEnabled 
                                ? 'bg-blue-900/40 border-blue-400 text-blue-300 shadow-[0_0_20px_rgba(59,130,246,0.3)]' 
                                : 'bg-black/60 border-white/10 text-gray-500 hover:border-white/30 hover:text-gray-300'}
                        `}
                    >
                        <span className="text-lg">{audioEnabled ? '🎵' : '🔇'}</span>
                        <span className="text-[10px] font-mono tracking-widest uppercase">
                            {audioEnabled ? 'Audio Uplink: ONLINE' : 'Audio Uplink: OFFLINE'}
                        </span>
                    </button>
                </div>

                {/* Modals & Panels */}
                <AnimatePresence>{showCaptain && <CaptainsMessage userName={auth.user.name} onClose={closeCaptain} />}</AnimatePresence>
                <AnimatePresence>{showProfile && <CommanderProfile auth={auth} onClose={() => setShowProfile(false)} />}</AnimatePresence>
                {selectedStar && <StarDetails star={selectedStar} userNote={currentNote} auth={auth} onClose={() => setSelectedStar(null)} />}
            </div>
        </CosmicLayout>
    );
}