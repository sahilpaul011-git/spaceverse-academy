
import { useEffect, useRef } from "react";
import * as THREE from "three";

const PLANET_STYLE = {
  mercury: { base: "#77736d", light: "#c0b8a8", dark: "#34343a", type: "rock" },
  venus: { base: "#c88d45", light: "#f4d49a", dark: "#774528", type: "cloud" },
  earth: { base: "#1255a3", light: "#3c9bd5", dark: "#061c45", type: "earth" },
  mars: { base: "#a8472d", light: "#e18a54", dark: "#4e2020", type: "mars" },
  jupiter: { base: "#b9825d", light: "#f0d0a1", dark: "#774630", type: "bands" },
  saturn: { base: "#c6a36b", light: "#f0ddb0", dark: "#826443", type: "bands" },
  uranus: { base: "#5eb7c0", light: "#a0e4e6", dark: "#28717f", type: "cloud" },
  neptune: { base: "#1647b4", light: "#4389ef", dark: "#07184e", type: "bands" },
};

function makeTexture(style) {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 512;

  const ctx = canvas.getContext("2d");
  const gradient = ctx.createLinearGradient(0, 0, 0, 512);
  gradient.addColorStop(0, style.light);
  gradient.addColorStop(0.5, style.base);
  gradient.addColorStop(1, style.dark);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1024, 512);

  if (style.type === "bands") {
    for (let y = 0; y < 512; y += 5) {
      const wave = Math.sin(y * 0.075) * 8;
      ctx.fillStyle = y % 31 < 14 ? style.light : style.dark;
      ctx.globalAlpha = 0.12 + Math.random() * 0.22;
      ctx.fillRect(0, y + wave, 1024, 2 + Math.random() * 9);
    }

    if (style.base === "#b9825d") {
      ctx.globalAlpha = 0.8;
      ctx.fillStyle = "#b74f36";
      ctx.beginPath();
      ctx.ellipse(700, 270, 56, 31, -0.15, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }

  if (style.type === "earth") {
    ctx.globalAlpha = 0.9;
    ctx.fillStyle = "#59a45e";

    for (let i = 0; i < 26; i++) {
      const x = Math.random() * 1024;
      const y = Math.random() * 512;
      ctx.beginPath();
      ctx.ellipse(
        x, y,
        18 + Math.random() * 65,
        9 + Math.random() * 35,
        Math.random() * 3,
        0, Math.PI * 2
      );
      ctx.fill();
    }

    ctx.globalAlpha = 0.5;
    ctx.fillStyle = "#f6f5ec";

    for (let i = 0; i < 80; i++) {
      ctx.beginPath();
      ctx.ellipse(
        Math.random() * 1024,
        Math.random() * 512,
        8 + Math.random() * 50,
        2 + Math.random() * 10,
        Math.random() * 3,
        0, Math.PI * 2
      );
      ctx.fill();
    }

    ctx.globalAlpha = 1;
  }

  if (style.type === "rock" || style.type === "mars") {
    for (let i = 0; i < 950; i++) {
      const x = Math.random() * 1024;
      const y = Math.random() * 512;
      const radius = 1 + Math.random() * (style.type === "rock" ? 12 : 8);

      ctx.fillStyle = i % 2 ? style.dark : style.light;
      ctx.globalAlpha = 0.12 + Math.random() * 0.3;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = style.light;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(x, y, radius * 1.25, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }

  if (style.type === "cloud") {
    for (let i = 0; i < 160; i++) {
      ctx.fillStyle = style.light;
      ctx.globalAlpha = 0.05 + Math.random() * 0.13;
      ctx.beginPath();
      ctx.ellipse(
        Math.random() * 1024,
        Math.random() * 512,
        10 + Math.random() * 70,
        3 + Math.random() * 14,
        0, 0, Math.PI * 2
      );
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export default function PlanetArt({
  body,
  className = "h-40 w-40",
}) {
  const mountRef = useRef(null);
  const id = String(body?.id || "earth").toLowerCase();

  useEffect(() => {
    const mount = mountRef.current;
    const style = PLANET_STYLE[id];

    if (!mount || !style) return undefined;

    let renderer;
    let observer;
    let frame = 0;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
    camera.position.set(0, 0, 5.2);

    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "low-power",
      });
    } catch {
      mount.textContent = `${body?.name || id} 3D model requires WebGL`;
      return undefined;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const sphereGeometry = new THREE.SphereGeometry(1.35, 64, 48);
    const material = new THREE.MeshStandardMaterial({
      map: makeTexture(style),
      roughness: 0.94,
      metalness: 0,
    });

    const planet = new THREE.Mesh(sphereGeometry, material);
    planet.rotation.z = id === "uranus" ? 0.75 : 0.08;
    scene.add(planet);

    if (id === "saturn") {
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(1.65, 2.35, 128),
        new THREE.MeshStandardMaterial({
          color: "#d8c49a",
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.82,
          roughness: 1,
        })
      );
      ring.rotation.x = 1.22;
      ring.rotation.y = -0.18;
      planet.add(ring);
    }

    if (id === "earth") {
      const cloud = new THREE.Mesh(
        new THREE.SphereGeometry(1.37, 48, 36),
        new THREE.MeshBasicMaterial({
          color: "#e4f6ff",
          transparent: true,
          opacity: 0.12,
          wireframe: true,
        })
      );
      planet.add(cloud);
    }

    scene.add(new THREE.AmbientLight(0xffffff, 1.25));

    const sunlight = new THREE.DirectionalLight(0xffffff, 3.2);
    sunlight.position.set(-4, 3, 5);
    scene.add(sunlight);

    const fillLight = new THREE.PointLight(style.light, 14, 12);
    fillLight.position.set(3, -1, 2);
    scene.add(fillLight);

    const resize = () => {
      const width = Math.max(100, mount.clientWidth);
      const height = Math.max(100, mount.clientHeight);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    observer = new ResizeObserver(resize);
    observer.observe(mount);
    resize();

    const animate = () => {
      frame = requestAnimationFrame(animate);
      planet.rotation.y += 0.003;
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
      sphereGeometry.dispose();
      material.map?.dispose();
      material.dispose();
      scene.traverse((object) => {
        if (object.geometry && object.geometry !== sphereGeometry) {
          object.geometry.dispose();
        }
        if (object.material && object.material !== material) {
          object.material.dispose();
        }
      });
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [id, body?.name]);

  return (
    <div
      ref={mountRef}
      className={className}
      role="img"
      aria-label={`Rotating 3D model of ${body?.name || id}`}
      style={{
        minWidth: 0,
        minHeight: 100,
        overflow: "hidden",
        borderRadius: "50%",
        background:
          "radial-gradient(circle at 35% 25%, #17255466, #02061700 72%)",
        touchAction: "pan-y",
      }}
    />
  );
}
