'use client';

import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useTheme } from '@/lib/theme';
import { LogoMesh } from './LogoGeometry';
import { ParticleField } from './ParticleField';

interface HeroCanvasProps {
  mouseX: number;
  mouseY: number;
  scrollProgress: number;
  reducedMotion: boolean;
  isLowEnd: boolean;
}

/**
 * Three.js canvas component for the hero section.
 * Sets up WebGL renderer, scene, camera, and animation loop.
 * Must be client component with dynamic import (ssr: false).
 */
export function HeroCanvas({
  mouseX,
  mouseY,
  scrollProgress,
  reducedMotion,
  isLowEnd,
}: HeroCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const logoRef = useRef<LogoMesh | null>(null);
  const particlesRef = useRef<ParticleField | null>(null);
  const clockRef = useRef(new THREE.Clock());
  const frameRef = useRef<number | null>(null);
  const { theme } = useTheme();
  const prevThemeRef = useRef(theme);

  // Store mutable values in refs to avoid re-creating the animation loop
  const mouseXRef = useRef(mouseX);
  const mouseYRef = useRef(mouseY);
  const scrollRef = useRef(scrollProgress);

  useEffect(() => { mouseXRef.current = mouseX; }, [mouseX]);
  useEffect(() => { mouseYRef.current = mouseY; }, [mouseY]);
  useEffect(() => { scrollRef.current = scrollProgress; }, [scrollProgress]);

  // Initialize scene once on mount
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      50,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      100
    );
    camera.position.z = 6;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: !isLowEnd,
      alpha: true,
      powerPreference: isLowEnd ? 'low-power' : 'high-performance',
    });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isLowEnd ? 1 : 2));
    renderer.setClearColor(0x000000, 0);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(2, 3, 5);
    scene.add(directionalLight);

    const pointLightCyan = new THREE.PointLight(0x00bcd4, 0.5, 10);
    pointLightCyan.position.set(-3, 1, 2);
    scene.add(pointLightCyan);

    const pointLightMagenta = new THREE.PointLight(0xe91e63, 0.3, 10);
    pointLightMagenta.position.set(3, -1, 2);
    scene.add(pointLightMagenta);

    // Logo geometry
    const currentTheme = prevThemeRef.current;
    const logo = new LogoMesh({ theme: currentTheme });
    logoRef.current = logo;
    scene.add(logo.group);

    // Particle field
    const particleCount = isLowEnd ? 200 : 600;
    const particles = new ParticleField({
      count: particleCount,
      theme: currentTheme,
      reducedMotion,
    });
    particlesRef.current = particles;
    scene.add(particles.points);

    // Resize handler
    const handleResize = () => {
      if (!canvas || !cameraRef.current || !rendererRef.current) return;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Animation loop reads from refs so it never needs to be recreated
    const animate = () => {
      const time = clockRef.current.getElapsedTime();

      if (logoRef.current) {
        logoRef.current.setMouseTarget(mouseXRef.current, mouseYRef.current);
        logoRef.current.update(0, time);
        logoRef.current.setScrollOffset(scrollRef.current);
      }

      if (particlesRef.current) {
        particlesRef.current.setMouseTarget(mouseXRef.current, mouseYRef.current);
        particlesRef.current.update(time);
        particlesRef.current.setScrollOffset(scrollRef.current);
      }

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
      logoRef.current?.dispose();
      particlesRef.current?.dispose();
      renderer.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle theme transitions
  useEffect(() => {
    if (prevThemeRef.current !== theme) {
      logoRef.current?.transitionTheme(theme, 0.6);
      particlesRef.current?.transitionTheme(theme);
      prevThemeRef.current = theme;
    }
  }, [theme]);

  // Update reduced motion
  useEffect(() => {
    particlesRef.current?.setReducedMotion(reducedMotion);
  }, [reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      className="hero-canvas"
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    />
  );
}
