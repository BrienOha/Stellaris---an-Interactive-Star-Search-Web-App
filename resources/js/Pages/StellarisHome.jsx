import React, { useState, useEffect } from 'react';
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
    const { data, setData, get, processing } = useForm({ query: '' });

    // Handle Search Results
    useEffect(() => {
        if (searchedStar) setSelectedStar(searchedStar);
    }, [searchedStar]);

    // FIX: Handle Captain Message (Unique per user ID)
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
                
                {/* 1. 3D Scene (Empty Galaxy until searched) */}
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

                        {/* SCI-FI ERROR MESSAGE */}
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

                        {/* NEW DISCOVERY NOTIFICATION */}
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

                {/* 3. Left Sidebar (Stardex / Discovered Stars) */}
                <motion.div initial={{ x: -300 }} animate={{ x: 0 }} className="absolute top-24 left-6 bottom-6 w-64 z-20 pointer-events-none">
                    <div className="pointer-events-auto h-full bg-[#050714]/80 backdrop-blur-md border border-blue-500/20 rounded-lg flex flex-col overflow-hidden">
                        <div className="p-4 border-b border-blue-500/20 bg-blue-900/10">
                            <h3 className="font-mono text-blue-300 tracking-widest uppercase text-sm">Discovered Stars</h3>
                            <p className="text-[10px] text-gray-500 mt-1">Global Database ({sidebarList.length} Records)</p>
                        </div>
                        <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
                            {sidebarList.map((starName, i) => (
                                <button
                                    key={i}
                                    onClick={() => clickSuggestion(starName)}
                                    className="w-full text-left px-4 py-3 rounded hover:bg-blue-500/20 hover:border-l-2 hover:border-blue-400 text-gray-400 hover:text-white transition-all font-mono text-sm tracking-wider uppercase group"
                                >
                                    {starName}
                                </button>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* 4. Right Top (Profile & Logout) */}
                <div className="absolute top-6 right-6 z-20 flex flex-col items-end gap-2">
                     {/* Profile Button */}
                     <button onClick={() => setShowProfile(true)} className="group flex items-center gap-3 bg-black/40 border border-blue-500/30 px-12 py-6  rounded hover:bg-blue-900/30 transition backdrop-blur-md">
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

                {/* Modals & Panels */}
                <AnimatePresence>{showCaptain && <CaptainsMessage userName={auth.user.name} onClose={closeCaptain} />}</AnimatePresence>
                <AnimatePresence>{showProfile && <CommanderProfile auth={auth} onClose={() => setShowProfile(false)} />}</AnimatePresence>
                {selectedStar && <StarDetails star={selectedStar} userNote={currentNote} auth={auth} onClose={() => setSelectedStar(null)} />}
            </div>
        </CosmicLayout>
    );
}