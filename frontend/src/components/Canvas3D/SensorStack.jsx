import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import useStore from '../../store/useStore';

export default function SensorStack() {
  const groupRef = useRef();
  const { layers, simulationResult } = useStore();

  // Rotação suave constante para dar um ar profissional à apresentação
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.2;
    }
  });

  // Função para determinar a cor do material baseado no resultado da simulação
  const getLayerColor = (layerName, defaultColor) => {
    if (!simulationResult) return defaultColor;
    
    // Se houver um aviso (warning) para esta camada, fica vermelho/laranja neon
    const hasError = simulationResult.report.warnings.some(w => w.layer === layerName);
    if (hasError) return '#ef4444'; // Red-500 Tailwind
    
    // Se foi aprovado e tem sucesso, fica verde neon
    const isSuccess = simulationResult.report.successes.some(s => s.layer === layerName);
    if (simulationResult.isApproved && isSuccess) return '#22c55e'; // Green-500 Tailwind

    return defaultColor;
  };

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      
      {/* Camada: Encapsulamento (Topo) */}
      <mesh position={[0, 1.2, 0]}>
        <cylinderGeometry args={[2, 2, 0.4, 32]} />
        <meshPhysicalMaterial 
          color={getLayerColor('encapsulation', '#38BDF8')} 
          transparent={true} 
          opacity={layers.encapsulation ? 0.6 : 0.2}
          roughness={0.1}
          metalness={0.2}
        />
      </mesh>

      {/* Camada: Circuito (Meio) */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[1.8, 1.8, 0.1, 32]} />
        <meshStandardMaterial 
          color={getLayerColor('circuit', '#F59E0B')} 
          opacity={layers.circuit ? 1 : 0.2}
          transparent={true}
          emissive={getLayerColor('circuit', '#000000')}
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Camada: Substrato (Base) */}
      <mesh position={[0, -1.2, 0]}>
        <cylinderGeometry args={[2, 2, 0.4, 32]} />
        <meshStandardMaterial 
          color={getLayerColor('substrate', '#475569')} 
          opacity={layers.substrate ? 1 : 0.3}
          transparent={true}
          roughness={0.8}
        />
      </mesh>

    </group>
  );
}