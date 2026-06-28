import React, { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MathUtils } from 'three';
import useStore from '../../store/useStore';
import { Html } from '@react-three/drei';

export default function SensorStack() {
  // Lemos o state.simulationResult para saber se foi Aprovado ou Falhou
  const { slots, materials, simulationResult } = useStore((state) => ({
    slots: state.layers,
    materials: state.materials,
    simulationResult: state.simulationResult 
  }));
  
  const [exploded, setExploded] = useState(false);
  
  // Nova referência que controla TODO o conjunto para a rotação
  const groupRef = useRef();
  
  const topRef = useRef();
  const midRef = useRef();
  const baseRef = useRef();

  const findMaterial = (id) => {
    if (!Array.isArray(materials) || !id) return null;
    return materials.find(m => m.id === id);
  };

  const topoMat = findMaterial(slots.encapsulation);
  const meioMat = findMaterial(slots.circuit);
  const baseMat = findMaterial(slots.substrate);

  const getMaterialColor = (id) => {
    const colors = {
      'mat_cu_01': '#ea580c',
      'mat_au_01': '#facc15',
      'mat_steel_01': '#94a3b8',
      'mat_alumina_01': '#f8fafc',
      'mat_pdms_01': '#67e8f9',
      'mat_si_01': '#10b981',
      'mat_graphene_01': '#0f172a',
      'mat_mos2_01': '#a855f7'
    };
    return colors[id] || '#cbd5e1';
  };

  const getMaterialProps = (material) => {
    let baseColor = getMaterialColor(material?.id);
    
    // VERIFICAÇÃO DE STATUS: Sobrepõe a cor se houver uma simulação concluída
    if (simulationResult && simulationResult.status) {
      if (simulationResult.status === 'Aprovado') {
        baseColor = '#22c55e'; // Verde de sucesso
      } else if (simulationResult.status === 'Falha Crítica' || simulationResult.status === 'Inviável') {
        baseColor = '#ef4444'; // Vermelho de erro
      }
    }

    if (!material) return { color: baseColor, metalness: 0.1, roughness: 0.8, transparent: true, opacity: 0.3 };
    
    const isMetal = material.category === 'Metal';
    const isTransparent = material.optical?.isTransparent === true;
    
    return {
      color: baseColor,
      metalness: isMetal ? 1.0 : 0.1,
      roughness: isMetal ? 0.15 : (isTransparent ? 0.3 : 0.8),
      transparent: isTransparent,
      opacity: isTransparent ? 0.6 : 1,
      side: 2
    };
  };

  useFrame((state, delta) => {
    // ROTAÇÃO SUAVE DO SENSOR (recuperada)
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.4; // Ajuste o 0.4 para girar mais rápido ou mais devagar
    }

    const topTargetY = exploded ? 1.5 : 0.6;
    const midTargetY = 0;
    const baseTargetY = exploded ? -1.5 : -0.6;

    if (topRef.current) topRef.current.position.y = MathUtils.lerp(topRef.current.position.y, topTargetY, 0.1);
    if (midRef.current) midRef.current.position.y = MathUtils.lerp(midRef.current.position.y, midTargetY, 0.1);
    if (baseRef.current) baseRef.current.position.y = MathUtils.lerp(baseRef.current.position.y, baseTargetY, 0.1);
  });

  const FloatingLabel = ({ title, materialName }) => (
    <Html position={[2.5, 0, 0]} center zIndexRange={[100, 0]}>
      <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur px-3 py-1.5 rounded-md shadow-lg border border-slate-200 dark:border-slate-700 whitespace-nowrap pointer-events-none transition-colors">
        <p className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">{title}</p>
        <p className="text-[10px] font-medium text-brandAccent mt-0.5">{materialName || 'Slot Vazio'}</p>
      </div>
    </Html>
  );

  return (
    <group 
      ref={groupRef} // A REFERÊNCIA AQUI FAZ TUDO GIRAR JUNTO
      onClick={(e) => { e.stopPropagation(); setExploded(!exploded); }}
      onPointerOver={() => document.body.style.cursor = 'pointer'}
      onPointerOut={() => document.body.style.cursor = 'auto'}
    >
      <mesh ref={topRef} position={[0, 0.6, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[2, 2, 0.3, 64]} />
        <meshStandardMaterial {...getMaterialProps(topoMat)} />
        {exploded && <FloatingLabel title="Encapsulamento" materialName={topoMat?.name} />}
      </mesh>

      <mesh ref={midRef} position={[0, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.7, 1.7, 0.15, 64]} />
        <meshStandardMaterial {...getMaterialProps(meioMat)} />
        {exploded && <FloatingLabel title="Circuito Ativo" materialName={meioMat?.name} />}
      </mesh>

      <mesh ref={baseRef} position={[0, -0.6, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[2, 2, 0.3, 64]} />
        <meshStandardMaterial {...getMaterialProps(baseMat)} />
        {exploded && <FloatingLabel title="Substrato" materialName={baseMat?.name} />}
      </mesh>
    </group>
  );
}