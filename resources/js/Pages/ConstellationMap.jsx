import React, { useState, useEffect, useRef } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import CosmicLayout from '@/Layouts/CosmicLayout';
import ConstellationScene from '@/Components/ConstellationScene';
import { motion, AnimatePresence } from 'framer-motion';

// Added 'errors' to props
export default function ConstellationMap({ sidebarList, searchedConstellation, stars, auth, errors }) {
    const { data, setData, get, processing } = useForm({ query: searchedConstellation || '' });
    const [lastAdded, setLastAdded] = useState(null);

    // ... (Keep your existing Audio Logic here) ...
    const [audioEnabled, setAudioEnabled] = useState(false);
    const musicRef = useRef(null);

    useEffect(() => {
        musicRef.current = new Audio('/audio/space_ambient.mp3');
        musicRef.current.loop = true;
        musicRef.current.volume = 0.4; 
        musicRef.current.play()
            .then(() => setAudioEnabled(true))
            .catch(() => console.log("Auto-play blocked"));
        return () => { 
            if(musicRef.current) {
                musicRef.current.pause();
                musicRef.current.currentTime = 0;
            }
        };
    }, []);

    const toggleMusic = () => {
        if (!musicRef.current) return;
        if (!audioEnabled) {
            musicRef.current.play().then(() => setAudioEnabled(true));
        } else {
            musicRef.current.pause();
            setAudioEnabled(false);
        }
    };
    // ... (End Audio Logic) ...

    const handleSearch = (e) => {
        e.preventDefault();
        get(route('constellation.search'), { preserveState: true });
    };

    const handleDiscover = (star) => {
        if (star.is_discovered) return;
        router.post(route('constellation.discover'), {
            name: star.name,
            constellation: searchedConstellation,
            distance_light_year: star.distance_light_year,
            spectral_class: star.spectral_class
        }, {
            preserveScroll: true,
            onSuccess: () => setLastAdded(star.name)
        });
    };

    const loadConstellation = (name) => {
        setData('query', name);
        setTimeout(() => {
            router.get(route('constellation.search'), { query: name });
        }, 50);
    };

    return (
        <CosmicLayout>
            <Head title="Constellation Map" />
            <div className="w-screen h-screen overflow-hidden bg-space text-white relative font-sans">
                
                {/* 3D Scene */}
                <div className="absolute inset-0 z-0">
                    <ConstellationScene 
                        searchedConstellation={searchedConstellation} 
                        stars={stars} 
                        onDiscover={handleDiscover}
                    />
                </div>

                {/* Top Search & Notifications */}
                <div className="absolute top-0 left-0 w-full p-6 z-20 flex flex-col items-center pointer-events-none">
                    <div className="pointer-events-auto w-full max-w-xl">
                        <form onSubmit={handleSearch} className="relative group">
                            <input
                                type="text"
                                value={data.query}
                                onChange={e => setData('query', e.target.value)}
                                placeholder="ENTER CONSTELLATION (E.G. ORION)..."
                                className="w-full bg-[#050714]/90 backdrop-blur-md border border-purple-500/30 rounded-full py-4 px-8 text-white font-mono tracking-widest placeholder-purple-500/50 focus:border-purple-400 focus:shadow-[0_0_30px_#a855f7] outline-none transition-all uppercase"
                            />
                            <button disabled={processing} className="absolute right-2 top-2 bottom-2 px-6 bg-purple-600/80 hover:bg-purple-500 rounded-full text-xs font-bold tracking-widest uppercase transition">
                                {processing ? 'WARPING' : 'WARP'}
                            </button>
                        </form>
                    </div>

                    {/* --- ERROR MESSAGE (NEW) --- */}
                    <AnimatePresence>
                        {errors.search && (
                            <motion.div 
                                initial={{ opacity: 0, height: 0 }} 
                                animate={{ opacity: 1, height: 'auto' }} 
                                exit={{ opacity: 0 }}
                                className="mt-4 pointer-events-auto"
                            >
                                <div className="bg-red-900/80 border-l-4 border-red-500 text-red-200 p-4 font-mono text-xs shadow-[0_0_20px_rgba(220,38,38,0.5)] backdrop-blur-md flex items-start gap-3">
                                    <div className="text-2xl">⚠</div>
                                    <div>
                                        <p className="font-bold tracking-widest">SENSOR ERROR: SECTOR_EMPTY</p>
                                        <p className="mt-1 opacity-80">
                                            No star systems detected in this constellation. 
                                            Check spelling or try a known sector (e.g., 'Cassiopeia').
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    {/* --------------------------- */}

                    {/* Success Message */}
                    <AnimatePresence>
                        {lastAdded && (
                            <motion.div 
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                onAnimationComplete={() => setTimeout(() => setLastAdded(null), 3000)}
                                className="mt-4 pointer-events-auto bg-green-500/20 border border-green-500 text-green-200 px-6 py-2 rounded-full font-mono text-sm shadow-[0_0_20px_rgba(34,197,94,0.3)] backdrop-blur"
                            >
                                SYSTEM ACQUIRED: {lastAdded} ADDED TO DATABASE
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Sidebar (Existing) */}
                <div className="fixed left-9 top-24 bottom-6 z-40 flex items-center pointer-events-none">
                    <div className="w-72 h-full bg-[#050714]/90 backdrop-blur-xl border-r border-purple-500/50 shadow-[0_0_30px_rgba(168,85,247,0.2)] transform -translate-x-[17.5rem] hover:translate-x-0 transition-transform duration-500 flex flex-col overflow-hidden group pointer-events-auto">
                        <div className="absolute right-0 top-0 bottom-0 w-3 bg-purple-900/20 hover:bg-purple-600/20 cursor-pointer flex items-center justify-center transition-colors">
                            <div className="h-16 w-1 bg-purple-400/50 rounded-full shadow-[0_0_10px_#a855f7] group-hover:bg-purple-300 transition-all"></div>
                            <div className="absolute top-1/2 -right-12 transform -rotate-90 origin-center text-[10px] font-mono tracking-[0.3em] text-purple-400 w-40 text-center">CONSTELLATIONS</div>
                        </div>
                        <div className="p-5 border-b border-purple-500/20 bg-purple-900/10 shrink-0">
                            <h3 className="font-mono text-purple-300 tracking-widest uppercase text-sm">Discovered Sectors</h3>
                        </div>
                        <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
                            {sidebarList.map((cName, i) => (
                                <button
                                    key={i}
                                    onClick={() => loadConstellation(cName)}
                                    className="w-full text-left px-4 py-3 rounded border border-transparent hover:bg-purple-500/20 hover:border-purple-500/30 text-gray-400 hover:text-white transition-all font-mono text-sm tracking-wider uppercase"
                                >
                                    {cName}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Audio Toggle (Existing) */}
                <div className="fixed top-6 left-12 z-50">
                    <button
                        onClick={toggleMusic}
                        className={`
                            flex items-center gap-3 px-5 py-3 rounded-full border backdrop-blur-md transition-all duration-300
                            ${audioEnabled 
                                ? 'bg-purple-900/40 border-purple-400 text-purple-300 shadow-[0_0_20px_rgba(168,85,247,0.3)]' 
                                : 'bg-black/60 border-white/10 text-gray-500 hover:border-white/30 hover:text-gray-300'}
                        `}
                    >
                        <span className="text-lg">{audioEnabled ? '🎵' : '🔇'}</span>
                        <span className="text-[10px] font-mono tracking-widest uppercase">
                            {audioEnabled ? 'Audio Uplink: ONLINE' : 'Audio Uplink: OFFLINE'}
                        </span>
                    </button>
                </div>

                {/* Navigation Back (Existing) */}
                <div className="absolute bottom-6 right-6 z-50">
                     <button onClick={() => router.visit(route('home'))} className="px-8 py-3 bg-black/60 border border-white/20 hover:border-blue-400 text-gray-400 hover:text-white font-mono tracking-widest uppercase rounded transition">
                        Return to Star Map
                     </button>
                </div>
            </div>
        </CosmicLayout>
    );
}