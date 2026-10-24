
import { useEffect, useRef } from "react";
import * as THREE from "three";

const TEXTURES = {
  mercury: "2k_mercury.jpg",
  venus: "2k_venus_surface.jpg",
  earth: "2k_earth_daymap.jpg",
  mars: "2k_mars.jpg",
  jupiter: "2k_jupiter.jpg",
  saturn: "2k_saturn.jpg",
  uranus: "2k_uranus.jpg",
  neptune: "2k_neptune.jpg",
};

const BASE_URL = "https://edu.solarsystemscope.com/textures/download/";

const COLORS = {
  mercury: "#99958e",
  venus: "#d4a66b",
  earth: "#1b5b9b",
  mars: "#ad5037",
  jupiter: "#c4a17c",
  saturn: "#d6c29a",
  uranus: "#73cbd0",
  neptune: "#2454ca",
};

export default function PlanetArt({
  body,
  className = "h-40 w-40",
}) {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    const id = String(body?.id || "earth").toLowerCase();

    if (!mount || !COLORS[id]) return;

    let renderer;
    let animationFrame;
    let observer;
    let disposed = false;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    camera.position.set(0, 0, 4.2);

    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "low-power",
      });
    } catch {
      mount.textContent = "3D rendering is not supported on this device.";
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.setClearColor(0x000000, 0);

    mount.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0x8298bb, 0.5));

    const sunlight = new THREE.DirectionalLight(0xffffff, 3.2);
    sunlight.position.set(-4, 2, 5);
    scene.add(sunlight);

    const rimLight = new THREE.DirectionalLight(0x416da9, 0.65);
    rimLight.position.set(3, 0, -4);
    scene.add(rimLight);

    const planetGroup = new THREE.Group();
    scene.add(planetGroup);

    const geometry = new THREE.SphereGeometry(1.25, 96, 64);
    const fallbackMaterial = new THREE.MeshStandardMaterial({
      color: COLORS[id],
      roughness: 0.95,
      metalness: 0,
    });

    const planet = new THREE.Mesh(geometry, fallbackMaterial);
    planetGroup.add(planet);

    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin("anonymous");

    const loadedTextures = [];
    const originalMaterials = [];

    function loadTexture(filename, onSuccess) {
      loader.load(
        BASE_URL + filename,
        (texture) => {
          if (disposed) {
            texture.dispose();
            return;
          }

          texture.colorSpace = THREE.SRGBColorSpace;
          texture.anisotropy = Math.min(
            renderer.capabilities.getMaxAnisotropy(),
            4
          );

          loadedTextures.push(texture);
          onSuccess(texture);
        },
        undefined,
        () => {
          console.warn("Planet texture failed to load:", filename);
        }
      );
    }

    loadTexture(TEXTURES[id], (texture) => {
      const material = new THREE.MeshStandardMaterial({
        map: texture,
        roughness: id === "venus" ? 0.86 : 0.96,
        metalness: 0,
      });

      originalMaterials.push(material);
      planet.material = material;
      fallbackMaterial.dispose();
    });

    // Earth cloud layer: separate, semi-transparent texture.
    if (id === "earth") {
      loadTexture("2k_earth_clouds.png", (texture) => {
        const clouds = new THREE.Mesh(
          new THREE.SphereGeometry(1.27, 72, 48),
          new THREE.MeshStandardMaterial({
            map: texture,
            transparent: true,
            opacity: 0.26,
            depthWrite: false,
            roughness: 1,
          })
        );

        originalMaterials.push(clouds.material);
        planetGroup.add(clouds);
        clouds.userData.cloudLayer = true;
      });
    }

    // Saturn's rings use a real ring texture rather than a flat colored band.
    if (id === "saturn") {
      loadTexture("2k_saturn_ring_alpha.png", (texture) => {
        const ringMaterial = new THREE.MeshStandardMaterial({
          map: texture,
          alphaMap: texture,
          color: 0xe7d4aa,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.96,
          roughness: 1,
          depthWrite: false,
        });

        const ring = new THREE.Mesh(
          new THREE.RingGeometry(1.55, 2.3, 160),
          ringMaterial
        );

        ring.rotation.x = Math.PI * 0.43;
        ring.rotation.y = -0.12;
        ring.renderOrder = 1;
        planetGroup.add(ring);
        originalMaterials.push(ringMaterial);
      });
    }

    // Subtle atmospheric rim. Keep it restrained, not cartoon-like.
    if (["earth", "venus", "uranus", "neptune"].includes(id)) {
      const atmosphereColor = {
        earth: 0x559bff,
        venus: 0xe7a65c,
        uranus: 0x7ce8ed,
        neptune: 0x4779ff,
      }[id];

      const atmosphere = new THREE.Mesh(
        new THREE.SphereGeometry(1.29, 64, 48),
        new THREE.MeshBasicMaterial({
          color: atmosphereColor,
          transparent: true,
          opacity: id === "earth" ? 0.075 : 0.045,
          side: THREE.BackSide,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        })
      );

      planetGroup.add(atmosphere);
    }

    function resize() {
      if (!mount || disposed) return;

      const width = Math.max(mount.clientWidth, 1);
      const height = Math.max(mount.clientHeight, 1);

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    }

    observer = new ResizeObserver(resize);
    observer.observe(mount);
    resize();

    let lastTime = 0;

    function animate(time) {
      if (disposed) return;

      animationFrame = requestAnimationFrame(animate);

      // Rotate gently, with a stable speed on mobile.
      const delta = lastTime ? Math.min((time - lastTime) / 1000, 0.05) : 0;
      lastTime = time;

      planet.rotation.y += delta * 0.12;

      planetGroup.children.forEach((child) => {
        if (child.userData.cloudLayer) {
          child.rotation.y += delta * 0.018;
        }
      });

      renderer.render(scene, camera);
    }

    animationFrame = requestAnimationFrame(animate);

    return () => {
      disposed = true;
      cancelAnimationFrame(animationFrame);
      observer?.disconnect();

      scene.traverse((object) => {
        if (object.geometry) object.geometry.dispose();
      });

      originalMaterials.forEach((material) => material.dispose());
      loadedTextures.forEach((texture) => texture.dispose());
      fallbackMaterial.dispose();

      renderer.dispose();

      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [body?.id]);

  return (
    <div
      ref={mountRef}
      className={className}
      role="img"
      aria-label={`3D model of ${body?.name || body?.id || "planet"}`}
      style={{
        position: "relative",
        overflow: "hidden",
        minWidth: 0,
        minHeight: 120,
      }}
    />
  );
}
