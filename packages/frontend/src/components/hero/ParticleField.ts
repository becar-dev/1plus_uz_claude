import * as THREE from 'three';

export interface ParticleFieldOptions {
  count: number;
  theme: 'light' | 'dark';
  reducedMotion: boolean;
}

/**
 * Floating particle system using THREE.Points.
 * Particles in CMYK colors respond to mouse position with gentle push/pull effect.
 */
export class ParticleField {
  public points: THREE.Points;
  private positions: Float32Array;
  private basePositions: Float32Array;
  private colors: Float32Array;
  private count: number;
  private mouseTarget = { x: 0, y: 0 };
  private mouseCurrent = { x: 0, y: 0 };
  private reducedMotion: boolean;
  private material: THREE.PointsMaterial;

  constructor(options: ParticleFieldOptions) {
    this.count = options.count;
    this.reducedMotion = options.reducedMotion;

    const geometry = new THREE.BufferGeometry();
    this.positions = new Float32Array(this.count * 3);
    this.basePositions = new Float32Array(this.count * 3);
    this.colors = new Float32Array(this.count * 3);

    const cmykColors = this.getColors(options.theme);

    for (let i = 0; i < this.count; i++) {
      const i3 = i * 3;

      const radius = 3 + Math.random() * 4;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      this.positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      this.positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      this.positions[i3 + 2] = (Math.random() - 0.5) * 4;

      this.basePositions[i3] = this.positions[i3];
      this.basePositions[i3 + 1] = this.positions[i3 + 1];
      this.basePositions[i3 + 2] = this.positions[i3 + 2];

      const colorIndex = i % 3;
      const color = cmykColors[colorIndex];
      this.colors[i3] = color.r;
      this.colors[i3 + 1] = color.g;
      this.colors[i3 + 2] = color.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(this.colors, 3));

    this.material = new THREE.PointsMaterial({
      size: 0.04,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    this.points = new THREE.Points(geometry, this.material);
  }

  private getColors(theme: 'light' | 'dark'): THREE.Color[] {
    if (theme === 'dark') {
      return [
        new THREE.Color('#4DD0E1'),
        new THREE.Color('#F06292'),
        new THREE.Color('#FFD54F'),
      ];
    }
    return [
      new THREE.Color('#00BCD4'),
      new THREE.Color('#E91E63'),
      new THREE.Color('#FFC107'),
    ];
  }

  /** Update mouse target for particle interaction */
  setMouseTarget(normalizedX: number, normalizedY: number) {
    this.mouseTarget.x = normalizedX;
    this.mouseTarget.y = normalizedY;
  }

  /** Called each frame */
  update(time: number) {
    if (this.reducedMotion) return;

    this.mouseCurrent.x += (this.mouseTarget.x - this.mouseCurrent.x) * 0.03;
    this.mouseCurrent.y += (this.mouseTarget.y - this.mouseCurrent.y) * 0.03;

    const positions = this.points.geometry.attributes.position as THREE.BufferAttribute;

    for (let i = 0; i < this.count; i++) {
      const i3 = i * 3;

      const baseX = this.basePositions[i3];
      const baseY = this.basePositions[i3 + 1];
      const baseZ = this.basePositions[i3 + 2];

      const offsetX = Math.sin(time * 0.3 + i * 0.1) * 0.1;
      const offsetY = Math.cos(time * 0.2 + i * 0.15) * 0.1;
      const offsetZ = Math.sin(time * 0.4 + i * 0.05) * 0.05;

      const mouseInfluenceX = this.mouseCurrent.x * 0.5;
      const mouseInfluenceY = -this.mouseCurrent.y * 0.5;

      const dx = (baseX / 5) - this.mouseCurrent.x;
      const dy = (baseY / 5) - this.mouseCurrent.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const influence = Math.max(0, 1 - dist) * 0.3;

      this.positions[i3] = baseX + offsetX + mouseInfluenceX * influence;
      this.positions[i3 + 1] = baseY + offsetY + mouseInfluenceY * influence;
      this.positions[i3 + 2] = baseZ + offsetZ;
    }

    positions.needsUpdate = true;
  }

  /** Smoothly transition colors when theme changes */
  transitionTheme(theme: 'light' | 'dark') {
    const newColors = this.getColors(theme);
    const colorAttr = this.points.geometry.attributes.color as THREE.BufferAttribute;
    const colorArray = colorAttr.array as Float32Array;

    for (let i = 0; i < this.count; i++) {
      const i3 = i * 3;
      const colorIndex = i % 3;
      const color = newColors[colorIndex];
      colorArray[i3] = color.r;
      colorArray[i3 + 1] = color.g;
      colorArray[i3 + 2] = color.b;
    }

    colorAttr.needsUpdate = true;
  }

  /** Set scroll-based parallax offset */
  setScrollOffset(progress: number) {
    this.points.position.y = -progress * 2 * 0.5;
  }

  /** Update reduced motion preference */
  setReducedMotion(reduced: boolean) {
    this.reducedMotion = reduced;
  }

  dispose() {
    this.points.geometry.dispose();
    this.material.dispose();
  }
}
