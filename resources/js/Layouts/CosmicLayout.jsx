import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CosmicLayout({ children }) {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    
    useEffect(() => {
        const mouseMove = (e) => setMousePosition({ x: e.clientX, y: e.clientY });
        window.addEventListener("mousemove", mouseMove);
        return () => window.removeEventListener("mousemove", mouseMove);
    }, []);

    return (
        <div className="bg-space min-h-screen text-starlight overflow-hidden cursor-none relative font-sans selection:bg-blue-500 selection:text-white">
            
            {/* 1. CRT Scanline & Vignette Overlay (The "Screen" Effect) */}
            <div className="fixed inset-0 pointer-events-none z-[50]">
                {/* Vignette */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_50%,rgba(0,0,0,0.6)_100%)]"></div>
                {/* Scanlines */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] z-[50] bg-[length:100%_4px,6px_100%] pointer-events-none"></div>
            </div>

            {/* 2. Custom HUD Cursor */}
            <motion.div
                className="fixed top-0 left-0 w-6 h-6 border border-blue-400/80 rounded-full pointer-events-none z-[9999] backdrop-blur-[1px]"
                animate={{ x: mousePosition.x - 12, y: mousePosition.y - 12 }}
                transition={{ type: "tween", ease: "backOut", duration: 0.1 }}
            >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-white rounded-full"></div>
            </motion.div>

            {/* 3. Page Content Transition */}
            <AnimatePresence mode="wait">
                <motion.div
                    initial={{ opacity: 0, filter: "blur(10px)" }}
                    animate={{ opacity: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, scale: 0.98, filter: "blur(5px)" }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} // Bezier for "Motion Graphic" feel
                    className="relative z-10"
                >
                    {children}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}