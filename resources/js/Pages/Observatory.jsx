import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import CosmicLayout from '@/Layouts/CosmicLayout'; // Import Layout
import { motion } from 'framer-motion';

export default function Observatory({ favorites }) {
    const { delete: destroy } = useForm();

    const handleDelete = (starName) => {
        if(confirm('Purge this data record?')) {
            destroy(route('chapter.delete', starName));
        }
    };

    return (
        <CosmicLayout> 
            <Head title="Observatory" />
            
            <div className="min-h-screen p-8 pt-20">
                <div className="max-w-5xl mx-auto">
                    
                    {/* Header */}
                    <div className="flex justify-between items-end mb-12 border-b border-white/10 pb-4">
                        <div>
                            <h1 className="text-5xl font-mono font-bold text-white tracking-wider">OBSERVATORY</h1>
                            <p className="text-blue-400/60 font-mono mt-1">/// ARCHIVED DISCOVERIES</p>
                        </div>
                        
                        <Link 
                            href={route('home')} 
                            className="px-6 py-2 border border-white/20 text-xs font-mono tracking-widest hover:bg-white hover:text-black transition uppercase"
                        >
                            ← Return to Space
                        </Link>
                    </div>

                    {favorites.length === 0 ? (
                        <div className="h-64 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-lg bg-white/5">
                            <p className="text-gray-500 font-mono text-lg">NO DATA FOUND</p>
                            <Link href={route('home')} className="mt-4 text-blue-400 hover:text-white underline text-sm">Scan for new systems</Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {favorites.map((fav, i) => (
                                <motion.div 
                                    key={fav.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="bg-black/40 border border-white/10 p-6 rounded hover:border-blue-500/50 transition group"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-2xl font-bold font-mono text-white group-hover:text-blue-300 transition">{fav.star_name}</h3>
                                        <button 
                                            onClick={() => handleDelete(fav.star_name)}
                                            className="text-red-500/50 hover:text-red-400 text-xs font-mono uppercase border border-red-500/20 px-2 py-1 rounded hover:bg-red-500/10 transition"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                    <div className="p-4 bg-blue-900/10 rounded border-l-2 border-blue-500 text-gray-300 font-sans leading-relaxed text-sm">
                                        "{fav.story_chapter || "Data corrupted or empty..."}"
                                    </div>
                                    <div className="mt-4 text-[10px] font-mono text-gray-600 uppercase">
                                        Log Date: {new Date(fav.created_at).toLocaleDateString()}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </CosmicLayout>
    );
}