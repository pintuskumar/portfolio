"use client";

import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function Particles({ count = 300 }) {
  const mesh = useRef<THREE.Points>(null!);

  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
      vel[i * 3] = (Math.random() - 0.5) * 0.005;
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.005;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.002;
    }
    return [pos, vel];
  }, [count]);

  const sizes = useMemo(() => {
    const s = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      s[i] = Math.random() * 2 + 0.5;
    }
    return s;
  }, [count]);

  useFrame((state) => {
    if (!mesh.current) return;
    const geo = mesh.current.geometry;
    const posAttr = geo.getAttribute("position");
    const arr = posAttr.array as Float32Array;

    for (let i = 0; i < count; i++) {
      arr[i * 3] += velocities[i * 3];
      arr[i * 3 + 1] += velocities[i * 3 + 1];
      arr[i * 3 + 2] += velocities[i * 3 + 2];

      if (Math.abs(arr[i * 3]) > 10) velocities[i * 3] *= -1;
      if (Math.abs(arr[i * 3 + 1]) > 10) velocities[i * 3 + 1] *= -1;
      if (Math.abs(arr[i * 3 + 2]) > 5) velocities[i * 3 + 2] *= -1;
    }

    posAttr.needsUpdate = true;
    mesh.current.rotation.y = state.clock.elapsedTime * 0.02;
    mesh.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.01) * 0.1;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#6366f1"
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

function FloatingGeometry() {
  const torusRef = useRef<THREE.Mesh>(null!);
  const icoRef = useRef<THREE.Mesh>(null!);
  const octaRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (torusRef.current) {
      torusRef.current.rotation.x = t * 0.3;
      torusRef.current.rotation.y = t * 0.2;
      torusRef.current.position.y = Math.sin(t * 0.5) * 0.5;
    }
    if (icoRef.current) {
      icoRef.current.rotation.x = t * 0.2;
      icoRef.current.rotation.z = t * 0.3;
      icoRef.current.position.y = Math.cos(t * 0.4) * 0.3 + 1;
    }
    if (octaRef.current) {
      octaRef.current.rotation.y = t * 0.4;
      octaRef.current.rotation.z = t * 0.2;
      octaRef.current.position.x = Math.sin(t * 0.3) * 0.5 - 3;
    }
  });

  return (
    <>
      <mesh ref={torusRef} position={[3, 0, -2]}>
        <torusGeometry args={[0.6, 0.2, 16, 32]} />
        <meshBasicMaterial color="#6366f1" wireframe transparent opacity={0.15} />
      </mesh>
      <mesh ref={icoRef} position={[-2, 1, -3]}>
        <icosahedronGeometry args={[0.5, 1]} />
        <meshBasicMaterial color="#8b5cf6" wireframe transparent opacity={0.12} />
      </mesh>
      <mesh ref={octaRef} position={[-3, -1, -2]}>
        <octahedronGeometry args={[0.4, 0]} />
        <meshBasicMaterial color="#a78bfa" wireframe transparent opacity={0.12} />
      </mesh>
    </>
  );
}

export default function ParticleField() {
  const [shouldRender, setShouldRender] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mobile = window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 768;
    setIsMobile(mobile);

    // Defer 3D rendering to after LCP — wait for idle callback or 2s timeout
    if ("requestIdleCallback" in window) {
      const id = requestIdleCallback(() => setShouldRender(true), { timeout: 2000 });
      return () => cancelIdleCallback(id);
    } else {
      const timeout = setTimeout(() => setShouldRender(true), 1000);
      return () => clearTimeout(timeout);
    }
  }, []);

  // Skip 3D entirely on mobile for better performance
  if (!shouldRender || isMobile) return null;

  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        dpr={[1, 1.5]}
        style={{ background: "transparent" }}
        gl={{ alpha: true, antialias: false, powerPreference: "low-power" }}
      >
        <Particles count={300} />
        <FloatingGeometry />
      </Canvas>
    </div>
  );
}
