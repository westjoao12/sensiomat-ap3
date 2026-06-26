import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import useStore from '../../store/useStore';

export default function SensorStack() {
  const groupRef = useRef();
  const { layers, simulationResult, materials } = useStore();

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.2;
    }
  });

  const getMaterialAesthetics = (materialId, layerDefaultColor) => {
    if (!materialId) return { color: layerDefaultColor, opacity: 0.1, transparent: true, roughness: 0.5, metalness: 0 };
    
    const mat = materials.find(m => m.id === materialId);
    if (!mat) return { color: layerDefaultColor, opacity: 0.5, transparent: true, roughness: 0.5, metalness: 0 };

    if (mat.id.includes('cu_')) return { color: '#b87333', opacity: 1, transparent: false, roughness: 0.2, metalness: 0.9 }; 
    if (mat.id.includes('au_')) return { color: '#ffd700', opacity: 1, transparent: false, roughness: 0.1, metalness: 1.0 }; 
    if (mat.id.includes('steel')) return { color: '#a0b0c0', opacity: 1, transparent: false, roughness: 0.3, metalness: 0.8 }; 
    if (mat.id.includes('alumina')) return { color: '#fdfdfd', opacity: 1, transparent: false, roughness: 0.9, metalness: 0.0 }; 
    if (mat.id.includes('pdms')) return { color: '#e0f7fa', opacity: 0.3, transparent: true, roughness: 0.0, metalness: 0.1, transmission: 0.9 }; 
    if (mat.id.includes('si_')) return { color: '#2f4f4f', opacity: 1, transparent: false, roughness: 0.2, metalness: 0.6 }; 
    if (mat.id.includes('graphene')) return { color: '#1a1a1a', opacity: 0.85, transparent: true, roughness: 0.2, metalness: 0.9 }; 
    if (mat.id.includes('mos2')) return { color: '#4b0082', opacity: 1, transparent: false, roughness: 0.4, metalness: 0.5 }; 

    return { color: layerDefaultColor, opacity: 1, transparent: false, roughness: 0.5, metalness: 0.2 };
  };

  const getLayerProps = (layerName, defaultColor) => {
    const materialId = layers[layerName];
    let props = getMaterialAesthetics(materialId, defaultColor);

    if (simulationResult) {
      // Mapeamento correto para os logs do SimulationEngine.js
      const logs = simulationResult?.diagnosticLogs || [];
      const warnings = logs.filter(log => log.status === "CRITICAL_FAIL");
      const successes = logs.filter(log => log.status === "PASS");
      const isApproved = simulationResult?.globalStatus === "APPROVED";

      // Tradução dos nomes das camadas do frontend para o backend para fazer o match das cores
      const layerNamesMap = {
        'substrate': 'Substrato',
        'circuit': 'Circuito / Trilhas',
        'encapsulation': 'Encapsulamento'
      };
      
      const backendLayerName = layerNamesMap[layerName];

      // Verifica se há erros nesta camada ou erros globais/múltiplos
      const hasError = warnings.some(w => w.layer.includes(backendLayerName) || w.layer.includes("Múltiplos") || w.layer.includes("Sistema Global") || w.layer.includes("Camadas Externas"));
      
      if (hasError) {
        return { ...props, color: '#ef4444', emissive: '#ef4444', emissiveIntensity: 0.5, opacity: 0.9, transparent: true }; 
      }
      
      const isSuccess = successes.some(s => s.layer.includes(backendLayerName) || s.layer.includes("Sistema Global"));
      if (isApproved && isSuccess) {
        return { ...props, color: '#22c55e', emissive: '#22c55e', emissiveIntensity: 0.2, opacity: 0.9, transparent: true }; 
      }
    }

    return props;
  };

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      
      <mesh position={[0, 1.2, 0]}>
        <cylinderGeometry args={[2, 2, 0.4, 32]} />
        <meshPhysicalMaterial {...getLayerProps('encapsulation', '#38BDF8')} />
      </mesh>

      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[1.8, 1.8, 0.1, 32]} />
        <meshPhysicalMaterial {...getLayerProps('circuit', '#F59E0B')} />
      </mesh>

      <mesh position={[0, -1.2, 0]}>
        <cylinderGeometry args={[2, 2, 0.4, 32]} />
        <meshPhysicalMaterial {...getLayerProps('substrate', '#475569')} />
      </mesh>

    </group>
  );
}