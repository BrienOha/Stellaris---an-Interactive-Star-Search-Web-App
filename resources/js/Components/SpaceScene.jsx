import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, OrbitControls, Billboard, Text } from '@react-three/drei';
import * as THREE from 'three';

// --- SUB-COMPONENT: A Single Planet ---
const Planet = ({ distance, size, color, speed, offset }) => {
    const meshRef = useRef();

    useFrame(({ clock }) => {
        // Calculate orbit position based on time
        const t = clock.getElapsedTime() * speed + offset;
        const x = Math.sin(t) * distance;
        const z = Math.cos(t) * distance;
        
        if (meshRef.current) {
            meshRef.current.position.set(x, 0, z);
            meshRef.current.rotation.y += 0.01; // Self-rotation
        }
    });

    return (
        <group>
            {/* The Planet Mesh */}
            <mesh ref={meshRef}>
                <sphereGeometry args={[size, 32, 32]} />
                <meshStandardMaterial color={color} roughness={0.7} />
            </mesh>
            
            {/* The Orbit Line (Visual Guide) */}
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[distance - 0.05, distance + 0.05, 64]} />
                <meshBasicMaterial color={color} opacity={0.1} transparent side={THREE.DoubleSide} />
            </mesh>
        </group>
    );
};

// --- MAIN COMPONENT ---
export default function SpaceScene({ searchedStar, onStarSelect }) {
    
    // GENERATE PLANETS based on the star
    // We use useMemo so the planets don't change on every frame, only when 'searchedStar' changes
    const planets = useMemo(() => {
        if (!searchedStar) return [];

        const count = Math.floor(Math.random() * 4) + 1; // 1 to 4 planets
        const newPlanets = [];

        for (let i = 0; i < count; i++) {
            newPlanets.push({
                id: i,
                distance: 8 + (i * 5), // Spaced out: 8, 13, 18...
                size: Math.random() * 0.8 + 0.3, // Random size 0.3 - 1.1
                speed: 0.2 / (i + 1), // Inner planets orbit faster
                offset: Math.random() * 10, // Random starting position
                color: new THREE.Color().setHSL(Math.random(), 0.7, 0.5) // Random sci-fi color
            });
        }
        return newPlanets;
    }, [searchedStar]); // Only regenerate if the star changes

    return (
        <div className="w-full h-full">
            <Canvas camera={{ position: [0, 20, 35], fov: 45 }}>
                {/* 1. Lighting */}
                <ambientLight intensity={0.2} />
                <pointLight position={[0, 0, 0]} intensity={2} color="#ffaa00" /> {/* Sun Light */}

                {/* 2. Background Stars */}
                <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

                {/* 3. The Central Star (If Searched) */}
                {searchedStar ? (
                    <group>
                        {/* The Sun Mesh */}
                        <mesh onClick={() => onStarSelect(searchedStar)}>
                            <sphereGeometry args={[4, 64, 64]} />
                            <meshBasicMaterial color={searchedStar.color || "#ffaa00"} />
                        </mesh>
                        
                        {/* Sun Glow/Atmosphere */}
                        <mesh scale={[1.2, 1.2, 1.2]}>
                            <sphereGeometry args={[4, 32, 32]} />
                            <meshBasicMaterial color={searchedStar.color || "#ffaa00"} transparent opacity={0.3} />
                        </mesh>

                        {/* Star Label */}
                        <Billboard position={[0, 5.5, 0]} follow={true} lockX={false} lockY={false} lockZ={false}>
                            <Text fontSize={1} color="white" anchorX="center" anchorY="middle">
                                {searchedStar.name}
                            </Text>
                        </Billboard>

                        {/* 4. Render the Procedural Planets */}
                        {planets.map((planet) => (
                            <Planet key={planet.id} {...planet} />
                        ))}
                    </group>
                ) : (
                    // Default Empty State Label
                    <Billboard position={[0, 0, 0]}>
                        <Text fontSize={2} color="#3b82f6" anchorX="center" anchorY="middle" fillOpacity={0.5} >
                            AWAITING TARGET COORDINATES... 
                        </Text>
                    </Billboard>
                )}

                <OrbitControls enableZoom={true} minDistance={10} maxDistance={100} />
            </Canvas>
        </div>
    );
}