"use client";
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import Image from 'next/image';
import phoneImg from '@/../public/images/phone.png';
import desktopImg from '@/../public/images/desktop.png';

const MidnightSatinShader = () => {
  const meshRef = useRef();
  const { viewport } = useThree();
  const mouse = useRef(new THREE.Vector2(0, 0));

  const shaderData = useMemo(() => ({
    uniforms: {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uResolution: { value: new THREE.Vector2(800, 800) },
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform vec2 uMouse;
      varying vec2 vUv;

      // High-precision grain
      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
      }

      // Domain Warping for the "Satin Folds"
      float noise(vec2 p) {
        return sin(p.x * 0.8 + sin(p.y * 1.2 + uTime * 0.3));
      }

      void main() {
        vec2 uv = vUv;
        vec2 m = uMouse;

        // Create the vertical "ribbed" fabric texture
        float warp = noise(uv * 3.0 + noise(uv * 2.0));
        float folds = sin(uv.x * 4.0 + warp * 2.5 + m.x * 0.5);
        folds += sin(uv.y * 1.5 + warp * 1.5 + m.y * 0.2);
        
        // Intensify the shadows and highlights (Max Verstappen Style)
        float colorShift = smoothstep(-1.2, 1.2, folds);
        
        // Colors: Midnight Black to Deep Royal Blue
        vec3 darkBlue = vec3(0.004, 0.015, 0.04);
        vec3 royalBlue = vec3(0.02, 0.12, 0.35);
        vec3 highlight = vec3(0.15, 0.35, 0.85);

        vec3 finalColor = mix(darkBlue, royalBlue, colorShift);
        finalColor = mix(finalColor, highlight, pow(colorShift, 8.0) * 0.6);

        // Heavy Film Grain Overlay
        float grain = (hash(uv + uTime * 0.05) - 0.5) * 0.12;
        finalColor += grain;

        // Vignette for cinematic depth
        float vignette = distance(uv, vec2(0.5));
        finalColor *= smoothstep(1.2, 0.2, vignette);

        gl_FragColor = vec4(finalColor, 1.0);
      }
    `
  }), []);

  useFrame((state) => {
    const { x, y } = state.mouse;
    mouse.current.x = THREE.MathUtils.lerp(mouse.current.x, (x + 1) / 2, 0.05);
    mouse.current.y = THREE.MathUtils.lerp(mouse.current.y, (y + 1) / 2, 0.05);
    
    meshRef.current.material.uniforms.uTime.value = state.clock.getElapsedTime();
    meshRef.current.material.uniforms.uMouse.value = mouse.current;
  });

  return (
    <mesh ref={meshRef} scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial args={[shaderData]} />
    </mesh>
  );
};

export default function CinematicComponent() {
  return (
    <div className="relative h-screen w-full bg-black overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 z-0">
        <Canvas>
          <MidnightSatinShader />
        </Canvas>
      </div>

  <Image src={desktopImg} alt="..." className="hidden z-10 md:block w-full h-auto" />
<Image src={phoneImg} alt="..." className="block z-10 md:hidden w-full h-auto" />

      <div className="absolute inset-0 z-[1] pointer-events-none opacity-[0.15] mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
    </div>
  );
}