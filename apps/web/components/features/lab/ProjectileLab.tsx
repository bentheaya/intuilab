"use client";

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Grid, PerspectiveCamera, Environment, Trail, Sphere, Line } from '@react-three/drei';
import * as THREE from 'three';

interface ProjectileProps {
  position: [number, number, number];
  trajectory: [number, number, number][];
}

function Ball({ position }: { position: [number, number, number] }) {
  return (
    <Sphere position={position} args={[0.4, 32, 32]}>
      <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.5} />
    </Sphere>
  );
}

function Cannon({ angle }: { angle: number }) {
  const mountRef = useRef<THREE.Group>(null);
  const rad = (angle * Math.PI) / 180;

  return (
    <group ref={mountRef} position={[0, 0, 0]}>
      {/* Base */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.8, 1, 1, 16]} />
        <meshStandardMaterial color="#27272a" />
      </mesh>
      {/* Barrel */}
      <group rotation={[0, 0, rad]}>
        <mesh position={[1, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
          <cylinderGeometry args={[0.3, 0.4, 2, 16]} />
          <meshStandardMaterial color="#3f3f46" />
        </mesh>
      </group>
    </group>
  );
}

export function ProjectileLab({ currentPos, trajectory, angle }: { 
  currentPos: [number, number, number], 
  trajectory: [number, number, number][],
  angle: number 
}) {
  return (
    <div className="w-full h-full bg-zinc-950 rounded-2xl overflow-hidden relative border border-white/5">
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[10, 10, 20]} fov={50} />
        <OrbitControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 2.1} />
        
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} castShadow />
        <spotLight position={[-10, 20, 10]} angle={0.15} penumbra={1} intensity={2} castShadow />

        {/* Scene */}
        <Grid 
          infiniteGrid 
          fadeDistance={50} 
          sectionSize={5} 
          sectionColor="#3b82f6" 
          sectionThickness={1}
          cellColor="#27272a"
        />
        
        <Cannon angle={angle} />
        <Ball position={currentPos} />
        
        {trajectory.length > 1 && (
          <Line
            points={trajectory}
            color="#3b82f6"
            lineWidth={2}
            dashed={false}
          />
        )}

        {/* Floor */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
          <planeGeometry args={[100, 100]} />
          <meshStandardMaterial color="#09090b" transparent opacity={0.8} />
        </mesh>

        <Environment preset="city" />
      </Canvas>
      
      {/* HUD Info */}
      <div className="absolute top-4 left-4 p-4 rounded-xl bg-black/40 backdrop-blur-md border border-white/5 font-mono text-[10px] text-zinc-400 space-y-1">
        <div>X: {currentPos[0].toFixed(2)}m</div>
        <div>Y: {currentPos[1].toFixed(2)}m</div>
      </div>
    </div>
  );
}
