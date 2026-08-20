import * as THREE from 'three';

export interface LogoGeometryOptions {
  theme: 'light' | 'dark';
}

/**
 * Creates a 3D representation of the 1PLUS brand mark.
 * Uses extruded shapes with CMYK-inspired materials.
 */
export class LogoMesh {
  public group: THREE.Group;
  private materials: THREE.MeshStandardMaterial[];
  private targetRotation = { x: 0, y: 0 };
  private currentRotation = { x: 0, y: 0 };

  constructor(options: LogoGeometryOptions) {
    this.group = new THREE.Group();
    this.materials = [];
    this.createGeometry(options.theme);
  }

  private createGeometry(theme: 'light' | 'dark') {
    // "1" character - tall vertical bar
    const oneShape = new THREE.Shape();
    oneShape.moveTo(-0.15, -1);
    oneShape.lineTo(0.15, -1);
    oneShape.lineTo(0.15, 1);
    oneShape.lineTo(-0.15, 1);
    oneShape.closePath();

    // "+" symbol - horizontal bar
    const plusHShape = new THREE.Shape();
    const t = 0.12;
    const l = 0.6;
    plusHShape.moveTo(-l, -t);
    plusHShape.lineTo(l, -t);
    plusHShape.lineTo(l, t);
    plusHShape.lineTo(-l, t);
    plusHShape.closePath();

    // "+" symbol - vertical bar
    const plusVShape = new THREE.Shape();
    plusVShape.moveTo(-t, -l);
    plusVShape.lineTo(t, -l);
    plusVShape.lineTo(t, l);
    plusVShape.lineTo(-t, l);
    plusVShape.closePath();

    const extrudeSettings: THREE.ExtrudeGeometryOptions = {
      depth: 0.3,
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.02,
      bevelSegments: 3,
    };

    const colors = this.getColors(theme);

    // Create "1" mesh
    const oneGeo = new THREE.ExtrudeGeometry(oneShape, extrudeSettings);
    const oneMaterial = new THREE.MeshStandardMaterial({
      color: colors.cyan,
      metalness: 0.3,
      roughness: 0.4,
      emissive: colors.cyan,
      emissiveIntensity: theme === 'dark' ? 0.15 : 0.05,
    });
    this.materials.push(oneMaterial);
    const oneMesh = new THREE.Mesh(oneGeo, oneMaterial);
    oneMesh.position.set(-0.8, 0, 0);

    // Create "+" horizontal mesh
    const plusHGeo = new THREE.ExtrudeGeometry(plusHShape, extrudeSettings);
    const plusMaterial = new THREE.MeshStandardMaterial({
      color: colors.magenta,
      metalness: 0.3,
      roughness: 0.4,
      emissive: colors.magenta,
      emissiveIntensity: theme === 'dark' ? 0.15 : 0.05,
    });
    this.materials.push(plusMaterial);
    const plusHMesh = new THREE.Mesh(plusHGeo, plusMaterial);
    plusHMesh.position.set(0.5, 0, 0);

    // Create "+" vertical mesh
    const plusVGeo = new THREE.ExtrudeGeometry(plusVShape, extrudeSettings);
    const plusVMaterial = new THREE.MeshStandardMaterial({
      color: colors.yellow,
      metalness: 0.3,
      roughness: 0.4,
      emissive: colors.yellow,
      emissiveIntensity: theme === 'dark' ? 0.15 : 0.05,
    });
    this.materials.push(plusVMaterial);
    const plusVMesh = new THREE.Mesh(plusVGeo, plusVMaterial);
    plusVMesh.position.set(0.5, 0, 0);

    this.group.add(oneMesh, plusHMesh, plusVMesh);
    this.group.scale.set(0.8, 0.8, 0.8);
  }

  private getColors(theme: 'light' | 'dark') {
    if (theme === 'dark') {
      return {
        cyan: new THREE.Color('#4DD0E1'),
        magenta: new THREE.Color('#F06292'),
        yellow: new THREE.Color('#FFD54F'),
      };
    }
    return {
      cyan: new THREE.Color('#00BCD4'),
      magenta: new THREE.Color('#E91E63'),
      yellow: new THREE.Color('#FFC107'),
    };
  }

  /** Update rotation target based on normalized mouse position (-1 to 1) */
  setMouseTarget(normalizedX: number, normalizedY: number) {
    this.targetRotation.x = normalizedY * 0.3;
    this.targetRotation.y = normalizedX * 0.4;
  }

  /** Called each frame to update animations */
  update(_deltaTime: number, time: number) {
    const lerpFactor = 0.05;

    // Lerp current rotation toward target
    this.currentRotation.x += (this.targetRotation.x - this.currentRotation.x) * lerpFactor;
    this.currentRotation.y += (this.targetRotation.y - this.currentRotation.y) * lerpFactor;

    // Apply rotation: subtle idle + mouse response
    this.group.rotation.x = this.currentRotation.x + Math.sin(time * 0.5) * 0.05;
    this.group.rotation.y = this.currentRotation.y + Math.cos(time * 0.3) * 0.08 + time * 0.1;
  }

  /** Smoothly transition colors when theme changes */
  transitionTheme(theme: 'light' | 'dark', duration: number = 0.6) {
    const colors = this.getColors(theme);
    const emissiveIntensity = theme === 'dark' ? 0.15 : 0.05;
    const colorArray = [colors.cyan, colors.magenta, colors.yellow];

    this.materials.forEach((mat, i) => {
      const targetColor = colorArray[i];
      const startColor = mat.color.clone();
      const startEmissive = mat.emissive.clone();
      const startIntensity = mat.emissiveIntensity;
      let elapsed = 0;

      const animateColor = () => {
        elapsed += 1 / 60;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);

        mat.color.lerpColors(startColor, targetColor, eased);
        mat.emissive.lerpColors(startEmissive, targetColor, eased);
        mat.emissiveIntensity = startIntensity + (emissiveIntensity - startIntensity) * eased;

        if (progress < 1) {
          requestAnimationFrame(animateColor);
        }
      };
      animateColor();
    });
  }

  /** Set scroll-based parallax offset */
  setScrollOffset(progress: number) {
    this.group.position.y = -progress * 2 * 0.3;
  }

  dispose() {
    this.group.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose();
        if (child.material instanceof THREE.Material) {
          child.material.dispose();
        }
      }
    });
  }
}
