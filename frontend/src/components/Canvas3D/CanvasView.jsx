import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Sparkles } from '@react-three/drei';
import useStore from '../../store/useStore';
import SensorStack from './SensorStack';

export default function CanvasView() {
  // Vamos buscar o tema atual ao nosso gestor de estado (Zustand)
  const theme = useStore((state) => state.theme);
  const isDark = theme === 'dark';

  return (
    <div className={`w-full h-full cursor-grab active:cursor-grabbing transition-colors duration-700 ${isDark ? 'bg-gradient-to-b from-darkBg to-slate-900' : 'bg-gradient-to-b from-slate-100 to-slate-300'}`}>
      <Canvas camera={{ position: [5, 4, 6], fov: 45 }} gl={{ preserveDrawingBuffer: true }} >
        
        {/* LUZES DINÂMICAS: No modo claro, precisamos de mais luz ambiente para os materiais não ficarem opacos */}
        <ambientLight intensity={isDark ? 0.4 : 0.7} />
        <directionalLight position={[10, 10, 5]} intensity={isDark ? 1 : 1.5} castShadow />
        <pointLight position={[-10, -10, -5]} color="#38BDF8" intensity={isDark ? 2 : 1} />
        
        {/* AMBIENTE: 'city' dá bons reflexos escuros, 'studio' ilumina uniformemente materiais no modo claro */}
        <Environment preset={isDark ? "city" : "studio"} />

        <Suspense fallback={null}>
          <SensorStack />
          
          {/* PARTÍCULAS DINÂMICAS: Ciano no escuro, Azul-Forte no claro */}
          <Sparkles 
            count={60} 
            scale={10} 
            size={isDark ? 2.5 : 3.5} 
            speed={0.4} 
            opacity={isDark ? 0.5 : 0.8} 
            color={isDark ? "#38BDF8" : "#0284C7"} 
          />
          
          {/* SOMBRAS: Mais intensas no modo claro para aterrar o modelo 3D no ecrã */}
          <ContactShadows 
            position={[0, -2.5, 0]} 
            opacity={isDark ? 0.4 : 0.6} 
            scale={10} 
            blur={2.5} 
            far={4} 
            color={isDark ? "#000000" : "#334155"} 
          />
        </Suspense>

        <OrbitControls 
          enablePan={false} 
          minPolarAngle={Math.PI / 4} 
          maxPolarAngle={Math.PI / 2} 
          minDistance={4}
          maxDistance={12}
        />
      </Canvas>
    </div>
  );
}