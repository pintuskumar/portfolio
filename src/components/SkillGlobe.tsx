"use client";

import { useRef, useMemo, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, OrbitControls, Line } from "@react-three/drei";
import * as THREE from "three";
import { skills as portfolioSkills } from "../data/portfolio-data";
import { CATEGORY_COLORS } from "../lib/skill-colors";

interface SkillNode {
  name: string;
  position: [number, number, number];
  color: string;
}

// Derive from portfolio data, limit to 16 for clean globe layout
const SKILL_DATA = portfolioSkills.slice(0, 16).map((s) => ({
  name: s.name.replace(/ \(.*\)/, ""), // Clean up names like "AWS (EC2/S3/RDS)"
  category: s.category,
}));

function distributeOnSphere(count: number, radius: number): [number, number, number][] {
  const points: [number, number, number][] = [];
  const goldenRatio = (1 + Math.sqrt(5)) / 2;

  for (let i = 0; i < count; i++) {
    const theta = Math.acos(1 - (2 * (i + 0.5)) / count);
    const phi = (2 * Math.PI * i) / goldenRatio;
    points.push([
      radius * Math.sin(theta) * Math.cos(phi),
      radius * Math.sin(theta) * Math.sin(phi),
      radius * Math.cos(theta),
    ]);
  }
  return points;
}

function SkillLabel({ skill }: { skill: SkillNode }) {
  const [hovered, setHovered] = useState(false);

  return (
    <group position={skill.position}>
      {/* Dot */}
      <mesh
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[hovered ? 0.1 : 0.06, 12, 12]} />
        <meshBasicMaterial color={skill.color} />
      </mesh>
      {/* Glow */}
      <mesh>
        <sphereGeometry args={[hovered ? 0.18 : 0.12, 12, 12]} />
        <meshBasicMaterial color={skill.color} transparent opacity={hovered ? 0.35 : 0.15} />
      </mesh>
      {/* HTML label - always faces camera */}
      <Html
        position={[0, 0.22, 0]}
        center
        distanceFactor={6}
        style={{ pointerEvents: "none" }}
      >
        <span
          style={{
            color: skill.color,
            fontSize: hovered ? "13px" : "11px",
            fontWeight: 600,
            whiteSpace: "nowrap",
            textShadow: "0 0 8px rgba(0,0,0,0.8), 0 0 2px rgba(0,0,0,1)",
            transition: "font-size 0.2s",
            userSelect: "none",
          }}
        >
          {skill.name}
        </span>
      </Html>
    </group>
  );
}

function Globe() {
  const groupRef = useRef<THREE.Group>(null!);
  const wireRef = useRef<THREE.Mesh>(null!);

  const skills: SkillNode[] = useMemo(() => {
    const positions = distributeOnSphere(SKILL_DATA.length, 2);
    return SKILL_DATA.map((s, i) => ({
      name: s.name,
      position: positions[i],
      color: CATEGORY_COLORS[s.category] || "#ffffff",
    }));
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
    if (wireRef.current) {
      wireRef.current.rotation.y = state.clock.elapsedTime * 0.05;
      wireRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.03) * 0.1;
    }
  });

  return (
    <>
      {/* Wireframe sphere */}
      <mesh ref={wireRef}>
        <sphereGeometry args={[2.1, 24, 24]} />
        <meshBasicMaterial color="#6366f1" wireframe transparent opacity={0.06} />
      </mesh>

      {/* Skill nodes */}
      <group ref={groupRef}>
        {skills.map((skill) => (
          <SkillLabel key={skill.name} skill={skill} />
        ))}

        {/* Connection lines between nearby nodes */}
        {skills.map((a, i) =>
          skills.slice(i + 1).map((b) => {
            const dist = Math.sqrt(
              (a.position[0] - b.position[0]) ** 2 +
              (a.position[1] - b.position[1]) ** 2 +
              (a.position[2] - b.position[2]) ** 2
            );
            if (dist > 2.2) return null;
            return (
              <Line
                key={`${a.name}-${b.name}`}
                points={[a.position, b.position]}
                color="#6366f1"
                transparent
                opacity={0.08}
                lineWidth={1}
              />
            );
          })
        )}
      </group>
    </>
  );
}

export default function SkillGlobe() {
  return (
    <div className="h-[280px] sm:h-[350px] md:h-[400px] w-full">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.5} />
        <Globe />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={(3 * Math.PI) / 4}
        />
      </Canvas>
    </div>
  );
}
