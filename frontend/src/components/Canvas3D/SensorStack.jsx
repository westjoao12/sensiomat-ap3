import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import useStore from '../../store/useStore';

export default function SensorStack() {
  const groupRef = useRef();
  const { layers, simulationResult } = useStore();

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.2;
    }
  });

  const getLayerColor = (layerName, defaultColor) => {
    if (!simulationResult) return defaultColor;
    
    // CORREÇÃO: Uso de Encadeamento Opcional (?.) para evitar o crash visual
    const warnings = simulationResult?.report?.warnings || [];
    const successes = simulationResult?.report?.successes || [];

    const hasError = warnings.some(w => w.layer === layerName);
    if (hasError) return '#ef4444'; 
    
    const isSuccess = successes.some(s => s.layer === layerName);
    if (simulationResult.isApproved && isSuccess) return '#22c55e'; 

    return defaultColor;
  };

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      
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