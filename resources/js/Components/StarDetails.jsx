import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from '@inertiajs/react';

export default function StarDetails({ star, userNote, onClose, auth }) {
    // Setup Form for CRUD
    const { data, setData, post, delete: destroy, processing } = useForm({
        star_name: star ? star.name : '',
        story_chapter: userNote ? userNote.story_chapter : ''
    });

    // FIX: Force form data to update when the selected star changes
    useEffect(() => {
        setData({
            star_name: star ? star.name : '',
            story_chapter: userNote ? userNote.story_chapter : ''
        });
    }, [star, userNote]);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('chapter.save'), { 
            preserveScroll: true, 
            preserveState: true,
            onSuccess: () => {
                // Optional: Play a sound or show a toast here
            }
        });
    };

    const handleDelete = () => {
        if (confirm('WARNING: Confirm deletion of this data record?')) {
            destroy(route('chapter.delete', star.name), {
                preserveScroll: true, 
                preserveState: true, 
                onSuccess: onClose
            });
        }
    };

    if (!star) return null;

    return (
        <AnimatePresence>
            <motion.div 
                initial={{ x: '100%', opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: '100%', opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="fixed right-0 top-0 bottom-0 w-full md:w-[450px] bg-[#050714]/95 text-blue-100 border-l border-blue-500/30 p-8 shadow-[0_0_80px_rgba(0,0,0,0.9)] backdrop-blur-xl z-50 overflow-y-auto font-sans"
            >
                {/* Close Button */}
                <button 
                    onClick={onClose} 
                    className="absolute top-1 right-4 text-blue-400/90 hover:text-white transition font-mono uppercase text-s tracking-widest border border-transparent hover:border-blue-500/30 px-2 py-1 rounded"
                >
                    [ Close Terminal ]
                </button>
                
                {/* Header Section */}
                <div className="mb-8 border-b border-blue-500/20 pb-4">
                    <h2 className="text-5xl font-mono font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-400">
                        {star.name}
                    </h2>
                    <div className="flex items-center gap-2">
                        <div className="h-1 w-12 bg-blue-500 rounded-full shadow-[0_0_10px_#3b82f6]"></div>
                        <span className="text-blue-400 text-xs font-mono uppercase tracking-widest">
                            Spectral Class {star.spectral_class || 'Unknown'}
                        </span>
                    </div>
                </div>

                {/* Data Grid (Adapted for API-Ninjas) */}
                <div className="grid grid-cols-2 gap-3 mb-8 text-xs font-mono uppercase tracking-wider">
                    {/* Distance */}
                    <div className="bg-blue-900/10 p-4 rounded border border-blue-500/20 hover:bg-blue-900/20 transition">
                        <span className="block text-gray-500 mb-1">Distance From Earth</span>
                        <span className="text-white text-lg">
                            {star.distance_ly} <span className="text-xs text-blue-400">LY</span>
                        </span>
                    </div>

                    {/* Constellation */}
                    <div className="bg-blue-900/10 p-4 rounded border border-blue-500/20 hover:bg-blue-900/20 transition">
                        <span className="block text-gray-500 mb-1">Constellation</span>
                        <span className="text-white text-lg truncate" title={star.constellation}>
                            {star.constellation || 'N/A'}
                        </span>
                    </div>

                    {/* Additional Info (Static/Placeholder since API is limited) */}
                    <div className="bg-blue-900/10 p-4 rounded border border-blue-500/20 col-span-2">
                        <div className="flex justify-between items-center">
                            <div>
                                <span className="block text-gray-500 mb-1">Visual Magnitude</span>
                                <span className="text-white text-base">Variable</span>
                            </div>
                            <div className="text-right">
                                <span className="block text-gray-500 mb-1">System Status</span>
                                <span className="text-green-400 text-base animate-pulse">Charted</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CRUD Form: Captain's Log */}
                <div className="mt-8 border-t border-white/10 pt-6">
                    <h3 className="text-lg font-bold flex items-center gap-2 mb-4 text-white font-mono uppercase tracking-wider">
                        <span className="text-blue-500">///</span> Captain's Log
                    </h3>

                    {auth && auth.user ? (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <textarea
                                value={data.story_chapter}
                                onChange={e => setData('story_chapter', e.target.value)}
                                className="w-full h-48 bg-black/60 border border-blue-900/50 rounded p-4 text-white text-sm focus:border-blue-400 focus:shadow-[0_0_15px_rgba(59,130,246,0.2)] outline-none transition font-mono leading-relaxed placeholder-gray-600 resize-none"
                                placeholder={`Enter observation notes regarding ${star.name}...`}
                            />

                            <div className="flex justify-between items-center pt-2">
                                {/* Delete Button (Only shows if a note exists) */}
                                {userNote ? (
                                    <button 
                                        type="button" 
                                        onClick={handleDelete}
                                        className="text-red-400 text-xs font-mono uppercase tracking-widest hover:text-white transition border border-transparent hover:border-red-500/30 px-3 py-1 rounded"
                                    >
                                        Delete Entry
                                    </button>
                                ) : (
                                    <div></div> // Spacer
                                )}

                                {/* Save Button */}
                                <button 
                                    type="submit" 
                                    disabled={processing}
                                    className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-sm text-xs font-mono uppercase tracking-widest transition shadow-[0_0_20px_rgba(37,99,235,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {processing ? 'Uploading...' : (userNote ? 'Update Log' : 'Save Entry')}
                                </button>
                            </div>
                            
                            {/* Status Indicator */}
                            {userNote && (
                                <div className="text-center mt-2">
                                    <span className="text-[10px] text-green-500 font-mono tracking-widest uppercase">
                                        ✓ Record stored in secure database
                                    </span>
                                </div>
                            )}
                        </form>
                    ) : (
                         <div className="p-6 bg-red-900/10 border border-red-500/30 rounded text-center">
                             <p className="text-red-400 text-xs font-mono uppercase tracking-widest mb-2">Access Denied</p>
                             <p className="text-gray-400 text-xs">Encryption active. Login required to decrypt logs.</p>
                         </div>
                    )}
                </div>
            </motion.div>
        </AnimatePresence>
    );
}