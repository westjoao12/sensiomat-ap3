import React, { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MathUtils } from 'three';
import useStore from '../../store/useStore';
import { Html } from '@react-three/drei';
import { useTranslation } from 'react-i18next';

export default function SensorStack() {
  const { t } = useTranslation();
  
  const { slots, materials, simulationResult } = useStore((state) => ({
    slots: state.layers,
    materials: state.materials,
    simulationResult: state.simulationResult 
  }));
  
  const [exploded, setExploded] = useState(false);
  
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
    const status = simulationResult?.globalStatus;

    if (status) {
      if (status === 'APPROVED') {
        baseColor = '#22c55e';
      } else if (status === 'REJECTED') {
        baseColor = '#ef4444';
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
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.4;
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
        <p className="text-[10px] font-medium text-brandAccent mt-0.5">{materialName || t('empty_slot_label')}</p>
      </div>
    </Html>
  );

  return (
    <group 
      ref={groupRef}
      onClick={(e) => { e.stopPropagation(); setExploded(!exploded); }}
      onPointerOver={() => document.body.style.cursor = 'pointer'}
      onPointerOut={() => document.body.style.cursor = 'auto'}
    >
      <mesh ref={topRef} position={[0, 0.6, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[2, 2, 0.3, 64]} />
        <meshStandardMaterial {...getMaterialProps(topoMat)} />
        {exploded && <FloatingLabel title={t('layer_top')} materialName={topoMat?.name} />}
      </mesh>

      <mesh ref={midRef} position={[0, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.7, 1.7, 0.15, 64]} />
        <meshStandardMaterial {...getMaterialProps(meioMat)} />
        {exploded && <FloatingLabel title={t('layer_mid')} materialName={meioMat?.name} />}
      </mesh>

      <mesh ref={baseRef} position={[0, -0.6, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[2, 2, 0.3, 64]} />
        <meshStandardMaterial {...getMaterialProps(baseMat)} />
        {exploded && <FloatingLabel title={t('layer_base')} materialName={baseMat?.name} />}
      </mesh>
    </group>
  );
}