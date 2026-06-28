import React, { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MathUtils } from 'three';
import useStore from '../../store/useStore';
import { Html } from '@react-three/drei'; // Trocámos o Text por Html para melhor legibilidade

export default function SensorStack() {
  const { slots, materials } = useStore((state) => ({
    slots: state.layers,
    materials: state.materials
  }));
  
  const [exploded, setExploded] = useState(false);
  const topRef = useRef();
  const midRef = useRef();
  const baseRef = useRef();

  // Segurança para evitar erros se os materiais ainda estiverem a carregar da API
  const findMaterial = (id) => {
    if (!Array.isArray(materials) || !id) return null;
    return materials.find(m => m.id === id);
  };

  const topoMat = findMaterial(slots.encapsulation);
  const meioMat = findMaterial(slots.circuit);
  const baseMat = findMaterial(slots.substrate);

  // Como o JSON não tem cores, mapeamos os IDs para cores realistas aqui
  const getMaterialColor = (id) => {
    const colors = {
      'mat_cu_01': '#ea580c', // Cobre / Laranja
      'mat_au_01': '#facc15', // Ouro / Amarelo brilhante
      'mat_steel_01': '#94a3b8', // Aço / Cinza
      'mat_alumina_01': '#f8fafc', // Alumina / Branco cerâmico
      'mat_pdms_01': '#67e8f9', // PDMS / Ciano translúcido
      'mat_si_01': '#10b981', // Silício / Verde esmeralda
      'mat_graphene_01': '#0f172a', // Grafeno / Escuro
      'mat_mos2_01': '#a855f7' // MoS2 / Púrpura
    };
    return colors[id] || '#cbd5e1'; // Cor padrão (cinza) para materiais desconhecidos
  };

  const getMaterialProps = (material) => {
    if (!material) return { color: '#e2e8f0', metalness: 0.1, roughness: 0.8, transparent: true, opacity: 0.3 };
    
    // Agora lemos os dados exatamente como estão no seu JSON
    const isMetal = material.category === 'Metal';
    const isTransparent = material.optical?.isTransparent === true;
    
    return {
      color: getMaterialColor(material.id),
      metalness: isMetal ? 1.0 : 0.1, // Metais com reflexo máximo no ambiente
      roughness: isMetal ? 0.15 : (isTransparent ? 0.3 : 0.8), // Metais lisos, polímeros foscos
      transparent: isTransparent,
      opacity: isTransparent ? 0.6 : 1, // Lemos o optical.isTransparent do JSON
      side: 2
    };
  };

  useFrame(() => {
    const topTargetY = exploded ? 1.5 : 0.6;
    const midTargetY = 0;
    const baseTargetY = exploded ? -1.5 : -0.6;

    if (topRef.current) topRef.current.position.y = MathUtils.lerp(topRef.current.position.y, topTargetY, 0.1);
    if (midRef.current) midRef.current.position.y = MathUtils.lerp(midRef.current.position.y, midTargetY, 0.1);
    if (baseRef.current) baseRef.current.position.y = MathUtils.lerp(baseRef.current.position.y, baseTargetY, 0.1);
  });

  // Componente de Etiqueta Reutilizável
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