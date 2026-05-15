import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { Float, Stars, Sparkles } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import './index.css';

const CameraRig = () => {
  useFrame((state) => {
    state.camera.position.lerp(
      new THREE.Vector3(state.pointer.x * 1.5, state.pointer.y * 1.5, 10),
      0.05
    );
    state.camera.lookAt(0, 0, 0);
  });
  return null;
};

const SubtleGalaxy = () => {
  const pointsRef = useRef<THREE.Points>(null);

  const [positions, colors] = useMemo(() => {
    const count = 15000; // Tăng gấp 5 lần số hạt
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const color1 = new THREE.Color('#00ffff'); // Cyan
    const color2 = new THREE.Color('#ff00ff'); // Magenta
    const color3 = new THREE.Color('#ffffff'); // Core White

    for (let i = 0; i < count; i++) {
      const radius = Math.random() * 20;
      const spinAngle = radius * 0.5;
      const branchAngle = (i % 3) * ((Math.PI * 2) / 3);
      const angle = branchAngle + spinAngle;

      // Giảm độ phân tán để dải ngân hà đặc và xoáy mạnh hơn
      const randomX = (Math.random() - 0.5) * 1.5;
      const randomY = (Math.random() - 0.5) * 1.5;
      const randomZ = (Math.random() - 0.5) * 1.5;

      positions[i * 3] = Math.cos(angle) * radius + randomX;
      positions[i * 3 + 1] = randomY - 2;
      positions[i * 3 + 2] = Math.sin(angle) * radius + randomZ;

      // Trộn màu cho rực rỡ
      let mixedColor = color1.clone().lerp(color2, radius / 15);
      if (radius < 4) mixedColor = color3; // Lõi sáng trắng

      colors[i * 3] = mixedColor.r;
      colors[i * 3 + 1] = mixedColor.g;
      colors[i * 3 + 2] = mixedColor.b;
    }
    return [positions, colors];
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.1; // Xoay nhanh hơn một chút
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.06} vertexColors transparent opacity={0.8} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
};

const TransparentAvatar = () => {
  const texture = useLoader(THREE.TextureLoader, avatarImg);
  return (
    <Float speed={2} floatIntensity={0.5} rotationIntensity={0.05}>
      <mesh position={[0, 0, 0]}>
        {/* Tăng kích thước để nhân vật làm điểm nhấn */}
        <planeGeometry args={[5, 6.25]} />
        <meshBasicMaterial
          map={texture}
          transparent={true}
          depthWrite={false}
        />
      </mesh>
    </Float>
  );
};

const SciFiPlanet = () => {
  const planetRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (planetRef.current) {
      planetRef.current.rotation.y = state.clock.getElapsedTime() * 0.1;
      planetRef.current.rotation.x = state.clock.getElapsedTime() * 0.05;
    }
  });

  return (
    <Float speed={1.5} floatIntensity={1} rotationIntensity={0.5}>
      {/* Đưa hành tinh lại gần và phát sáng mạnh hơn */}
      <group ref={planetRef} position={[-5, 2, -6]} scale={[1.5, 1.5, 1.5]}>
        <mesh>
          <icosahedronGeometry args={[1.8, 2]} />
          <meshStandardMaterial color="#0B3D91" roughness={0.9} metalness={0.1} flatShading />
        </mesh>

        <mesh scale={[1.05, 1.05, 1.05]}>
          <icosahedronGeometry args={[1.8, 3]} />
          <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={0.5} wireframe transparent opacity={0.6} blending={THREE.AdditiveBlending} />
        </mesh>

        <mesh rotation={[Math.PI / 3, 0, 0]}>
          <torusGeometry args={[2.8, 0.03, 16, 100]} />
          <meshStandardMaterial color="#ff00ff" emissive="#ff00ff" emissiveIntensity={3} />
        </mesh>

        <mesh rotation={[Math.PI / 3, 0, 0]} scale={[1.2, 1.2, 1.2]}>
          <torusGeometry args={[2.8, 0.01, 16, 100]} />
          <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={2} transparent opacity={0.8} />
        </mesh>
      </group>
    </Float>
  );
};

const Spaceship = () => {
  const shipRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (shipRef.current) {
      shipRef.current.position.y = -1 + Math.sin(state.clock.getElapsedTime() * 1.5) * 0.3;
      shipRef.current.rotation.z = Math.sin(state.clock.getElapsedTime() * 1.2) * 0.1;
      shipRef.current.rotation.y = state.clock.getElapsedTime() * 0.8;
    }
  });

  return (
    <group position={[6, -2, -2]}>
      {/* Đặt đĩa bay góc dưới bên phải */}
      <group ref={shipRef} scale={[0.8, 0.8, 0.8]} rotation={[0.2, 0, 0]}>
        <mesh>
          <cylinderGeometry args={[2, 1.5, 0.4, 32]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.3} />
        </mesh>

        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[2.05, 1.55, 0.1, 32]} />
          <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={2} />
        </mesh>

        <mesh position={[0, 0.2, 0]}>
          <sphereGeometry args={[1, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#ff00ff" emissive="#ff00ff" emissiveIntensity={0.5} transparent opacity={0.6} />
        </mesh>

        <mesh position={[0, 0.5, 0]}>
          <octahedronGeometry args={[0.4, 0]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={2} wireframe />
        </mesh>

        <mesh position={[0, -0.3, 0]}>
          <cylinderGeometry args={[0.8, 0.5, 0.4, 32]} />
          <meshStandardMaterial color="#111111" metalness={0.8} />
        </mesh>

        <mesh position={[0, -0.6, 0]}>
          <sphereGeometry args={[0.5, 32, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
          <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={3} transparent opacity={0.8} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      </group>
    </group >
  );
};

const PlanetAndSpaceship = () => {
  return (
    <>
      <SciFiPlanet />
      <Spaceship />
    </>
  );
};

const TypewriterText = ({ text, delay = 0 }: { text: string, delay?: number }) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    let interval: ReturnType<typeof setInterval>;
    let currentIndex = 0;

    timeout = setTimeout(() => {
      interval = setInterval(() => {
        if (currentIndex <= text.length) {
          setDisplayedText(text.slice(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(interval);
        }
      }, 50);
    }, delay);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [text, delay]);

  return <span>{displayedText}<span className="blink-cursor">_</span></span>;
};

export default function App() {
  const urlParams = new URLSearchParams(window.location.search);
  const guestName = urlParams.get('name') || 'KHÁCH QUÝ';

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="app-container">
      <div className="canvas-container">
        <Canvas
          camera={{ position: [0, 0, 10], fov: 50 }}
          gl={{ antialias: true, powerPreference: "high-performance" }}
        >
          <color attach="background" args={['#010103']} />
          <fog attach="fog" args={['#010103', 5, 20]} />

          <ambientLight intensity={1} />
          <directionalLight position={[5, 5, 5]} intensity={2} color="#00ffff" />
          <directionalLight position={[-5, -5, 5]} intensity={2} color="#ff00ff" />

          <CameraRig />
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          <SubtleGalaxy />

          {/* Bụi ánh sáng lơ lửng tạo chiều sâu */}
          <Sparkles count={400} scale={15} size={2} speed={0.2} opacity={0.6} color="#00ffff" />
          <Sparkles count={400} scale={15} size={2} speed={0.4} opacity={0.6} color="#ff00ff" />

          <React.Suspense fallback={null}>
            <TransparentAvatar />
            <PlanetAndSpaceship />
          </React.Suspense>

          <EffectComposer>
            <Bloom luminanceThreshold={0.2} mipmapBlur intensity={1.8} />
            <Vignette eskil={false} offset={0.1} darkness={1.1} />
          </EffectComposer>
        </Canvas>
      </div>

      <div className={`ui-overlay ${isLoaded ? 'show' : ''}`}>

        {/* TOP SECTION */}
        <div className="top-title stagger-1">
          <div className="system-status">[ SYSTEM.ONLINE ] // INVITATION_DECRYPTED</div>
          <h1 className="glitch-title" data-text="LỄ TỐT NGHIỆP">LỄ TỐT NGHIỆP</h1>
          <h2 className="host-name">LƯU KHANG HUY</h2>
        </div>

        {/* MIDDLE SECTION: Floating around the Avatar */}
        <div className="middle-hud">
          <div className="guest-hud stagger-2">
            <div className="bracket">[</div>
            <div className="hud-content">
              <span className="hud-label">AUTHORIZATION GRANTED TO:</span>
              <h3 className="guest-name">{guestName.toUpperCase()}</h3>
            </div>
            <div className="bracket">]</div>
          </div>
        </div>

        {/* BOTTOM SECTION */}
        <div className="bottom-section stagger-3">
          <div className="thank-you-typing">
            <p className="tech-text">
              <TypewriterText text="Cảm ơn bạn đã đồng hành cùng hành trình của mình. Sự hiện diện của bạn là mảnh ghép hoàn hảo nhất cho ngày vui này!" delay={1500} />
            </p>
          </div>

          <div className="info-cards">
            <div className="info-box">
              <div className="icon">📍</div>
              <div className="details">
                <span>TỌA ĐỘ</span>
                <p>ĐH Tôn Đức Thắng</p>
              </div>
            </div>
            <div className="info-divider"></div>
            <div className="info-box">
              <div className="icon" style={{ color: '#ff00ff' }}>🕒</div>
              <div className="details">
                <span>THỜI GIAN</span>
                <p>Chiều ngày 29/05</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
