import React, { useState, useRef, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import CosmicLayout from '@/Layouts/CosmicLayout';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';

const WarpStars = ({ isWarping }) => {
    const ref = useRef();
    
    useFrame((state, delta) => {
        if (!isWarping) {
            ref.current.rotation.y += delta * 0.1;
            ref.current.rotation.x += delta * 0.05;
        } 
        else {
            ref.current.rotation.z += delta * 2; 
            ref.current.position.z += delta * 50; 
        }
    });

    return (
        <group ref={ref}>
            <Stars radius={100} depth={50} count={6000} factor={4} saturation={0} fade speed={1} />
        </group>
    );
};

export default function Welcome() {
    const [isWarping, setWarping] = useState(false);

    const [audioEnabled, setAudioEnabled] = useState(false);
    const musicRef = useRef(null);

    useEffect(() => {
        musicRef.current = new Audio('/audio/space_music.mp3');
        musicRef.current.loop = true;
        musicRef.current.volume = 0.4; 

        musicRef.current.play()
            .then(() => setAudioEnabled(true))
            .catch(() => console.log("Auto-play blocked, waiting for interaction"));


        return () => { 
            if(musicRef.current) musicRef.current.pause(); 
        };
    }, []);

    const toggleMusic = () => {
        if (!audioEnabled) {
            musicRef.current.play();
            setAudioEnabled(true);
        } else {
            musicRef.current.pause();
            setAudioEnabled(false);
        }
    };

    const handleStart = (e) => {
        e.preventDefault();
        
        if (musicRef.current && !audioEnabled) {
             musicRef.current.play().catch(e => {});
        }

        setWarping(true);
        
        setTimeout(() => {
            router.visit(route('login')); 
        }, 1500);
    };

    return (
        <div className="w-screen h-screen overflow-hidden bg-black">
            <CosmicLayout>
                <Head title="Welcome" />

                <div className="absolute inset-0 z-0">
                    <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
                        <WarpStars isWarping={isWarping} />
                    
                        {isWarping && <fog attach="fog" args={['#ffffff', 0, 20]} />}
                    </Canvas>
                </div>

                <AnimatePresence>
                    {!isWarping && (
                        <motion.div 
                            exit={{ opacity: 0, scale: 2, filter: 'blur(10px)' }} 
                            transition={{ duration: 0.5 }}
                            className="relative z-10 flex flex-col items-center justify-center h-screen"
                        >
                            <motion.h1 
                                initial={{ letterSpacing: "1em", opacity: 0 }}
                                animate={{ letterSpacing: "0.2em", opacity: 1 }}
                                transition={{ duration: 2, ease: "easeOut" }}
                                className="text-7xl md:text-9xl font-bold font-mono text-transparent bg-clip-text bg-gradient-to-b from-blue-100 to-transparent text-center"
                            >
                                STELLARIS
                            </motion.h1>

                            <motion.p 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1 }}
                                className="text-blue-300 font-mono tracking-widest mt-4 uppercase text-sm"
                            >
                                Initializing Deep Space Travel
                            </motion.p>

                            <motion.button
                                onClick={handleStart}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                whileHover={{ scale: 1.05 }}
                                transition={{ delay: 1.5 }}
                                className="mt-12 px-10 py-4 bg-white/5 border border-white/20 rounded-full text-white font-mono tracking-widest hover:bg-blue-500 hover:border-blue-500 hover:shadow-[0_0_40px_rgba(59,130,246,0.5)] transition-all duration-300"
                            >
                                ENGAGE WARP DRIVE
                            </motion.button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {!isWarping && (
                    <div className="absolute bottom-6 left-6 z-50">
                        <button 
                            onClick={toggleMusic}
                            className={`p-3 rounded-full border transition ${audioEnabled ? 'bg-purple-600/20 border-purple-400 text-purple-300' : 'bg-gray-900/50 border-gray-600 text-gray-500'}`}
                            title={audioEnabled ? "Mute Music" : "Play Music"}
                        >
                            {audioEnabled ? '🎵' : '🔇'}
                        </button>
                    </div>
                )}

            </CosmicLayout>
        </div>
    );
}