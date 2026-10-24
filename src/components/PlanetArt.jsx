
import { useEffect, useRef } from "react";
import * as THREE from "three";

const TEXTURES = {
  mercury: "2k_mercury.jpg",
  venus: "2k_venus_atmosphere.jpg",
  earth: "2k_earth_daymap.jpg",
  mars: "2k_mars.jpg",
  jupiter: "2k_jupiter.jpg",
  saturn: "2k_saturn.jpg",
  uranus: "2k_uranus.jpg",
  neptune: "2k_neptune.jpg",
};

const PLANET_INFO = {
  mercury: { size: 1.15, roughness: 0.95, rotation: 0.08 },
  venus: { size: 1.2, roughness: 0.88, rotation: 0.025 },
  earth: { size: 1.23, roughness: 0.82, rotation: 0.22 },
  mars: { size: 1.18, roughness: 0.96, rotation: 0.19 },
  jupiter: { size: 1.32, roughness: 0.91, rotation: 0.3 },
  saturn: { size: 1.2, roughness: 0.94, rotation: 0.25 },
  uranus: { size: 1.2, roughness: 0.88, rotation: -0.12 },
  neptune: { size: 1.2, roughness: 0.86, rotation: 0.18 },
};

const BASE_TEXTURE_URL = `${import.meta.env.BASE_URL}textures/`;

export default function PlanetArt({
  body,
  className = "h-40 w-40",
}) {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    const id = String(body?.id || "earth").toLowerCase();
    const info = PLANET_INFO[id];

    if (!mount || !info) return;

    let renderer;
    let observer;
    let frameId;
    let disposed = false;

    const resources = new Set();
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 50);
    camera.position.set(0, 0, 4.1);

    function showMessage(message) {
      if (disposed || !mount) return;

      let error = mount.querySelector("[data-planet-error]");

      if (!error) {
        error = document.createElement("div");
        error.dataset.planetError = "true";
        error.style.cssText = [
          "position:absolute",
          "inset:0",
          "display:flex",
          "align-items:center",
          "justify-content:center",
          "padding:16px",
          "text-align:center",
          "font:12px system-ui",
          "color:#fca5a5",
          "background:rgba(3,7,18,.8)",
          "border-radius:12px",
          "z-index:5",
        ].join(";");
        mount.appendChild(error);
      }

      error.textContent = message;
    }

    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "low-power",
      });
    } catch {
      showMessage("3D rendering is unavailable on this device.");
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.setClearColor(0x000000, 0);

    mount.appendChild(renderer.domElement);

    // Lighting: strong directional sunlight with restrained fill light.
    scene.add(new THREE.AmbientLight(0x8a9bb8, 0.42));

    const sunLight = new THREE.DirectionalLight(0xffffff, 3.1);
    sunLight.position.set(-4, 2.2, 5);
    scene.add(sunLight);

    const fillLight = new THREE.DirectionalLight(0x6c88bb, 0.28);
    fillLight.position.set(3, -1, -3);
    scene.add(fillLight);

    const group = new THREE.Group();
    scene.add(group);

    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(info.size, 96, 64),
      new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: info.roughness,
        metalness: 0,
      })
    );

    sphere.rotation.z = id === "uranus" ? 0.9 : 0.06;
    group.add(sphere);

    const loader = new THREE.TextureLoader();
    const loadedMaterials = new Set();
    const loadedTextures = new Set();

    function loadLocalTexture(filename, onLoad, required = false) {
      const url = BASE_TEXTURE_URL + filename;

      loader.load(
        url,
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

          loadedTextures.add(texture);
          onLoad(texture);
        },
        undefined,
        () => {
          console.error("Planet texture failed:", url);

          if (required) {
            showMessage(
              `Could not load ${filename}. Check that it exists in public/textures/.`
            );
          }
        }
      );
    }

    // Main surface map. No external server and no silent colour fallback.
    loadLocalTexture(
      TEXTURES[id],
      (texture) => {
        const material = new THREE.MeshStandardMaterial({
          map: texture,
          roughness: info.roughness,
          metalness: 0,
        });

        loadedMaterials.add(material);
        sphere.material.dispose();
        sphere.material = material;
        sphere.material.needsUpdate = true;

        const error = mount.querySelector("[data-planet-error]");
        if (error) error.remove();
      },
      true
    );

    // Earth: use the cloud image as a separate translucent cloud layer.
    if (id === "earth") {
      loadLocalTexture("2k_earth_clouds.jpg", (texture) => {
        const cloudMaterial = new THREE.MeshStandardMaterial({
          map: texture,
          alphaMap: texture,
          color: 0xffffff,
          transparent: true,
          opacity: 0.4,
          depthWrite: false,
          roughness: 1,
        });

        loadedMaterials.add(cloudMaterial);

        const clouds = new THREE.Mesh(
          new THREE.SphereGeometry(info.size * 1.008, 72, 48),
          cloudMaterial
        );

        clouds.userData.clouds = true;
        group.add(clouds);
      });
    }

    // Saturn: use the downloaded ring alpha map.
    if (id === "saturn") {
      loadLocalTexture("2k_saturn_ring_alpha.png", (texture) => {
        const ringMaterial = new THREE.MeshStandardMaterial({
          map: texture,
          alphaMap: texture,
          color: 0xe2d0ac,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.96,
          roughness: 1,
          depthWrite: false,
        });

        loadedMaterials.add(ringMaterial);

        const ring = new THREE.Mesh(
          new THREE.RingGeometry(
            info.size * 1.35,
            info.size * 2.0,
            160
          ),
          ringMaterial
        );

        ring.rotation.x = Math.PI * 0.43;
        ring.rotation.y = -0.12;
        ring.renderOrder = 2;
        group.add(ring);
      });
    }

    // Subtle atmospheric rim, kept restrained.
    const atmosphereColors = {
      earth: 0x4a90ff,
      venus: 0xd5a46e,
      uranus: 0x72dbe5,
      neptune: 0x426fff,
    };

    if (atmosphereColors[id]) {
      const atmosphereMaterial = new THREE.MeshBasicMaterial({
        color: atmosphereColors[id],
        side: THREE.BackSide,
        transparent: true,
        opacity: id === "earth" ? 0.1 : 0.065,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });

      loadedMaterials.add(atmosphereMaterial);

      group.add(
        new THREE.Mesh(
          new THREE.SphereGeometry(info.size * 1.035, 64, 48),
          atmosphereMaterial
        )
      );
    }

    function resize() {
      if (disposed || !mount) return;

      const width = Math.max(mount.clientWidth, 1);
      const height = Math.max(mount.clientHeight, 1);

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    }

    observer = new ResizeObserver(resize);
    observer.observe(mount);
    resize();

    let previousTime = 0;

    function animate(time) {
      if (disposed) return;

      frameId = requestAnimationFrame(animate);

      const delta = previousTime
        ? Math.min((time - previousTime) / 1000, 0.05)
        : 0;

      previousTime = time;

      sphere.rotation.y += delta * info.rotation;

      group.children.forEach((child) => {
        if (child.userData.clouds) {
          child.rotation.y += delta * info.rotation * 1.12;
        }
      });

      renderer.render(scene, camera);
    }

    frameId = requestAnimationFrame(animate);

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      observer?.disconnect();

      scene.traverse((object) => {
        object.geometry?.dispose();
      });

      loadedMaterials.forEach((material) => material.dispose());
      loadedTextures.forEach((texture) => texture.dispose());

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
        minWidth: 0,
        minHeight: 120,
        overflow: "hidden",
        isolation: "isolate",
      }}
    />
  );
}
