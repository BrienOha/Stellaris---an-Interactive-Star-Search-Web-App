import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, OrbitControls, Billboard, Text } from '@react-three/drei';
import * as THREE from 'three';

// Helper to generate consistent numbers based on a string (Star Name)
// This ensures "Betelgeuse" always gets the same speed/offset, even after a re-render.
const getStableRandom = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    // Return a normalized value between 0 and 1
    return Math.abs(hash % 1000) / 1000;
};

const OrbitingStar = ({ star, radius, speed, offset, onDiscover }) => {
    const ref = useRef();

    useFrame(({ clock }) => {
        // The orbit logic remains the same, but 'speed' and 'offset' are now stable
        const t = clock.getElapsedTime() * speed + offset;
        ref.current.position.x = Math.sin(t) * radius;
        ref.current.position.z = Math.cos(t) * radius;
    });

    return (
        <group>
            {/* Orbit Ring */}
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[radius - 0.05, radius + 0.05, 64]} />
                <meshBasicMaterial color="#3b82f6" opacity={0.1} transparent side={THREE.DoubleSide} />
            </mesh>

            {/* The Star */}
            <group ref={ref}>
                <mesh onClick={() => onDiscover(star)}>
                    <sphereGeometry args={[0.5, 16, 16]} />
                    <meshBasicMaterial color={star.color || "white"} />
                </mesh>
                {/* Glow */}
                <mesh scale={[1.5, 1.5, 1.5]}>
                     <sphereGeometry args={[0.5, 16, 16]} />
                     <meshBasicMaterial color={star.color || "white"} transparent opacity={0.4} />
                </mesh>
                
                {/* Label */}
                <Billboard position={[0, 1, 0]}>
                    <Text fontSize={0.5} color={star.is_discovered ? "#4ade80" : "white"}>
                        {star.name}
                    </Text>
                    {!star.is_discovered && (
                         <Text position={[0, 0.5, 0]} fontSize={0.25} color="#3b82f6">
                            [ CLICK TO ADD ]
                         </Text>
                    )}
                </Billboard>
            </group>
        </group>
    );
};

export default function ConstellationScene({ searchedConstellation, stars, onDiscover }) {
    
    // 1. Sort stars by name to ensure the "Ring Index" (i) stays the same
    // 2. We use useMemo to be efficient, though the sorting is fast enough to run often.
    const stableStars = useMemo(() => {
        return [...stars].sort((a, b) => a.name.localeCompare(b.name));
    }, [stars]);

    return (
        <div className="w-full h-full">
            <Canvas camera={{ position: [0, 15, 25], fov: 50 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[0, 10, 0]} intensity={1} />
                <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade />

                {/* Central Constellation Marker */}
                <group>
                    <Billboard>
                        <Text fontSize={2} color="#93c5fd">
                            {searchedConstellation || "CHOOSE OR SEARCH A CONSTELLATION"}
                        </Text>
                        <Text position={[0, -1.5, 0]} fontSize={0.5} color="#60a5fa" letterSpacing={0.2}>
                            CONSTELLATION CENTER
                        </Text>
                    </Billboard>
                </group>

                {/* Orbiting Stars */}
                {stableStars.map((star, i) => {
                    // Generate stable visual properties derived from the star name
                    const rng = getStableRandom(star.name);
                    
                    return (
                        <OrbitingStar 
                            key={star.name} // Use Name as key, not index
                            star={star} 
                            radius={6 + (i * 1.5)} 
                            speed={0.1 + (rng * 0.2)} // Deterministic speed
                            offset={rng * 10}        // Deterministic start position
                            onDiscover={onDiscover}
                        />
                    );
                })}

                <OrbitControls enableZoom={true} minDistance={10} maxDistance={80} />
            </Canvas>
        </div>
    );
}