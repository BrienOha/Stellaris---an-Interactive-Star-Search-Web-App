import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Float, Html } from '@react-three/drei';
import * as THREE from 'three';

// 1. The Rotating Milky Way (Particles)
const GalaxyParticles = () => {
    const points = useRef();

    // Generate 5000 random points in a spiral
    const particlesPosition = useMemo(() => {
        const positions = new Float32Array(5000 * 3);
        for (let i = 0; i < 5000; i++) {
            const angle = Math.random() * Math.PI * 2;
            const radius = 5 + Math.random() * 25; // Spiral spread
            const spiralOffset = angle * 2; 
            
            const x = Math.cos(angle + spiralOffset) * radius;
            const y = (Math.random() - 0.5) * 2; // Flat disc
            const z = Math.sin(angle + spiralOffset) * radius;

            positions[i * 3] = x;
            positions[i * 3 + 1] = y;
            positions[i * 3 + 2] = z;
        }
        return positions;
    }, []);

    useFrame((state) => {
        points.current.rotation.y += 0.001; // Slow Galaxy Rotation
    });

    return (
        <points ref={points}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={5000}
                    array={particlesPosition}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.15}
                color="#88ccff"
                transparent
                opacity={0.6}
                sizeAttenuation={true}
                depthWrite={false}
            />
        </points>
    );
};

// 2. The Searched Star (Only appears when found)
const FoundStar = ({ data, onSelect }) => {
    const ref = useRef();
    useFrame((state) => {
        ref.current.rotation.y += 0.01;
        // Pulse
        ref.current.scale.setScalar(2 + Math.sin(state.clock.elapsedTime * 2) * 0.2);
    });

    return (
        <group position={[0, 0, 0]}> {/* Always center the found star */}
            <mesh ref={ref} onClick={() => onSelect(data)}>
                <sphereGeometry args={[1.5, 64, 64]} />
                <meshStandardMaterial 
                    color={data.color} 
                    emissive={data.color}
                    emissiveIntensity={3}
                    toneMapped={false}
                />
            </mesh>
            {/* Huge Glow */}
            <mesh scale={[3, 3, 3]}>
                <sphereGeometry args={[1.5, 32, 32]} />
                <meshBasicMaterial color={data.color} transparent opacity={0.2} />
            </mesh>
            
            <Html position={[0, -3.5, 0]} center>
                <div className="flex flex-col items-center animate-bounce">
                    <div className="w-[1px] h-8 bg-blue-500"></div>
                    <div className="px-4 py-2 bg-black/90 border border-blue-500 text-blue-100 font-mono tracking-[0.2em] uppercase text-lg shadow-[0_0_30px_#3b82f6]">
                        {data.name}
                    </div>
                </div>
            </Html>
        </group>
    );
};

export default function SpaceScene({ searchedStar, onStarSelect }) {
    return (
        <div className="absolute inset-0 z-0 bg-[#030508]">
            <Canvas camera={{ position: [0, 20, 40], fov: 50 }} gl={{ antialias: true, toneMapping: THREE.ReinhardToneMapping }}>
                <fog attach="fog" args={['#030508', 30, 100]} />
                <ambientLight intensity={0.1} />
                <pointLight position={[10, 10, 10]} intensity={1} />

                {/* Background Stars */}
                <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={0.5} />
                
                {/* The Galaxy (Always visible) */}
                <GalaxyParticles />

                {/* The Found Star (Only visible if searched) */}
                {searchedStar && (
                    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
                        <FoundStar data={searchedStar} onSelect={onStarSelect} />
                    </Float>
                )}
                
                <OrbitControls enableZoom={true} autoRotate autoRotateSpeed={0.5} maxPolarAngle={Math.PI/2} minDistance={10} maxDistance={80} />
            </Canvas>
        </div>
    );
}