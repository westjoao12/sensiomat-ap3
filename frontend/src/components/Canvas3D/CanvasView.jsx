import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Sparkles } from '@react-three/drei';
import SensorStack from './SensorStack';

export default function CanvasView() {
  return (
    // Transição suave no fundo do 3D entre o tema claro e escuro
    <div className="w-full h-full bg-gradient-to-b from-slate-200 to-slate-400 dark:from-darkBg dark:to-slate-900 cursor-grab active:cursor-grabbing transition-colors duration-500">
      <Canvas camera={{ position: [5, 4, 6], fov: 45 }}>
        
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
        <pointLight position={[-10, -10, -5]} color="#38BDF8" intensity={2} />
        
        <Environment preset="city" />

        <Suspense fallback={null}>
          <SensorStack />
          {/* As partículas mantêm a cor da marca (brandAccent) que funciona bem em ambos os temas */}
          <Sparkles count={50} scale={10} size={2} speed={0.4} opacity={0.4} color="#38BDF8" />
          <ContactShadows position={[0, -2.5, 0]} opacity={0.4} scale={10} blur={2} far={4} />
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