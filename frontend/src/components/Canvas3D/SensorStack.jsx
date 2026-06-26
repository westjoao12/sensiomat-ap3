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

  // Função avançada: Mapeia o ID do material para propriedades visuais e físicas reais
  const getMaterialAesthetics = (materialId, layerDefaultColor) => {
    // Se a camada estiver vazia, fica quase invisível (efeito fantasma)
    if (!materialId) return { color: layerDefaultColor, opacity: 0.1, transparent: true, roughness: 0.5, metalness: 0 };
    
    const mat = materials.find(m => m.id === materialId);
    if (!mat) return { color: layerDefaultColor, opacity: 0.5, transparent: true, roughness: 0.5, metalness: 0 };

    // Cores e texturas reais baseadas na Ciência dos Materiais
    if (mat.id.includes('cu_')) return { color: '#b87333', opacity: 1, transparent: false, roughness: 0.2, metalness: 0.9 }; // Cobre Metálico
    if (mat.id.includes('au_')) return { color: '#ffd700', opacity: 1, transparent: false, roughness: 0.1, metalness: 1.0 }; // Ouro Brilhante
    if (mat.id.includes('steel')) return { color: '#a0b0c0', opacity: 1, transparent: false, roughness: 0.3, metalness: 0.8 }; // Aço Inoxidável
    if (mat.id.includes('alumina')) return { color: '#fdfdfd', opacity: 1, transparent: false, roughness: 0.9, metalness: 0.0 }; // Cerâmica Branca Fosca
    if (mat.id.includes('pdms')) return { color: '#e0f7fa', opacity: 0.3, transparent: true, roughness: 0.0, metalness: 0.1, transmission: 0.9 }; // Silicone Transparente (Efeito Vidro)
    if (mat.id.includes('si_')) return { color: '#2f4f4f', opacity: 1, transparent: false, roughness: 0.2, metalness: 0.6 }; // Silício Monocristalino
    if (mat.id.includes('graphene')) return { color: '#1a1a1a', opacity: 0.85, transparent: true, roughness: 0.2, metalness: 0.9 }; // Grafeno (Carbono Escuro)
    if (mat.id.includes('mos2')) return { color: '#4b0082', opacity: 1, transparent: false, roughness: 0.4, metalness: 0.5 }; // MoS2 (Púrpura Escuro Metálico)

    // Fallback genérico
    return { color: layerDefaultColor, opacity: 1, transparent: false, roughness: 0.5, metalness: 0.2 };
  };

  // Função que combina a estética do material com o resultado da simulação
  const getLayerProps = (layerName, defaultColor) => {
    const materialId = layers[layerName];
    let props = getMaterialAesthetics(materialId, defaultColor);

    // Se a simulação rodou, pintamos de vermelho (falha) ou verde (sucesso)
    if (simulationResult) {
      // Como a estrutura do teu backend pode variar ligeiramente, usamos o encadeamento opcional (?.)
      const warnings = simulationResult?.report?.warnings || [];
      const successes = simulationResult?.report?.successes || [];

      const hasError = warnings.some(w => w.layer === layerName);
      if (hasError) {
        // Modo Alerta: Vermelho Neon
        return { ...props, color: '#ef4444', emissive: '#ef4444', emissiveIntensity: 0.5, opacity: 0.9, transparent: true }; 
      }
      
      const isSuccess = successes.some(s => s.layer === layerName);
      if (simulationResult.isApproved && isSuccess) {
        // Modo Aprovação: Verde Neon
        return { ...props, color: '#22c55e', emissive: '#22c55e', emissiveIntensity: 0.2, opacity: 0.9, transparent: true }; 
      }
    }

    return props;
  };

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      
      {/* Camada: Encapsulamento (Topo) */}
      <mesh position={[0, 1.2, 0]}>
        <cylinderGeometry args={[2, 2, 0.4, 32]} />
        {/* Substituímos meshStandardMaterial por meshPhysicalMaterial para suportar efeitos de vidro (transmission) */}
        <meshPhysicalMaterial {...getLayerProps('encapsulation', '#38BDF8')} />
      </mesh>

      {/* Camada: Circuito (Meio) */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[1.8, 1.8, 0.1, 32]} />
        <meshPhysicalMaterial {...getLayerProps('circuit', '#F59E0B')} />
      </mesh>

      {/* Camada: Substrato (Base) */}
      <mesh position={[0, -1.2, 0]}>
        <cylinderGeometry args={[2, 2, 0.4, 32]} />
        <meshPhysicalMaterial {...getLayerProps('substrate', '#475569')} />
      </mesh>

    </group>
  );
}