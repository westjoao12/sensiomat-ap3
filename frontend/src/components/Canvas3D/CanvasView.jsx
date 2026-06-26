import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Sparkles } from '@react-three/drei';
import SensorStack from './SensorStack';

export default function CanvasView() {
  return (
    <div className="w-full h-full bg-gradient-to-b from-darkBg to-slate-900 cursor-grab active:cursor-grabbing">
      <Canvas camera={{ position: [5, 4, 6], fov: 45 }}>
        
        {/* Iluminação Científica */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
        <pointLight position={[-10, -10, -5]} color="#38BDF8" intensity={2} />
        
        {/* Reflexos e Ambiente (HDRI nativo do drei) */}
        <Environment preset="city" />

        <Suspense fallback={null}>
          <SensorStack />
          {/* Efeito de partículas sutis (o particles.js moderno) */}
          <Sparkles count={50} scale={10} size={2} speed={0.4} opacity={0.3} color="#38BDF8" />
          {/* Sombra de contacto na base para aterrar o modelo */}
          <ContactShadows position={[0, -2.5, 0]} opacity={0.4} scale={10} blur={2} far={4} />
        </Suspense>

        {/* Controlos para o utilizador rodar com o rato */}
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