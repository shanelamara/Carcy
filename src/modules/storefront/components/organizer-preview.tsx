"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useStorefrontMotion } from "./storefront-motion-provider";

// A local procedural version of the prototype's concept, not a saleable product model.
export function OrganizerPreview() {
  const host = useRef<HTMLDivElement>(null);
  const paused = useRef(false);
  const [isReady, setIsReady] = useState(false);
  const { canAnimate } = useStorefrontMotion();

  useEffect(() => { paused.current = !canAnimate; }, [canAnimate]);

  useEffect(() => {
    let isDisposed = false;
    let dispose: (() => void) | undefined;

    async function initialize() {
      const [THREE, { RoundedBoxGeometry }] = await Promise.all([
        import("three"),
        import("three/addons/geometries/RoundedBoxGeometry.js"),
      ]);
      const container = host.current;
      if (!container || isDisposed) return;

      let renderer: InstanceType<typeof THREE.WebGLRenderer>;
      try {
        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      } catch {
        return;
      }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFShadowMap;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = .9;
      renderer.domElement.setAttribute("aria-hidden", "true");
      container.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
      camera.position.set(2.8, 2.2, 10);
      camera.lookAt(0, .65, 0);
      scene.add(new THREE.HemisphereLight(0xffffff, 0x78502f, 1.5));
      const light = new THREE.DirectionalLight(0xffffff, 2.5);
      light.position.set(-3, 8, 5);
      light.castShadow = true;
      light.shadow.mapSize.set(1024, 1024);
      light.shadow.normalBias = .025;
      scene.add(light);
      const fill = new THREE.DirectionalLight(0xffffff, 1.2);
      fill.position.set(4, 2, -2);
      scene.add(fill);

      const grainCanvas = document.createElement("canvas");
      grainCanvas.width = 8;
      grainCanvas.height = 64;
      const context = grainCanvas.getContext("2d");
      if (context) {
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, 8, 64);
        for (let y = 0; y < 64; y += 4) {
          context.fillStyle = "#e0d8cb";
          context.fillRect(0, y, 8, 1);
        }
      }
      const texture = new THREE.CanvasTexture(grainCanvas);
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(2, 7);
      texture.colorSpace = THREE.SRGBColorSpace;
      const orange = new THREE.MeshStandardMaterial({ color: 0xff6500, roughness: .66, map: texture });
      const dark = new THREE.MeshStandardMaterial({ color: 0x191919, roughness: .7 });
      const white = new THREE.MeshStandardMaterial({ color: 0xf8f7f2, roughness: .6 });
      const model = new THREE.Group();
      model.scale.setScalar(1.3);
      scene.add(model);

      function box(width: number, height: number, depth: number, x: number, y: number, z: number, material: InstanceType<typeof THREE.MeshStandardMaterial>, radius = .09) {
        const geometry = new RoundedBoxGeometry(width, height, depth, 4, radius);
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(x, y, z);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        model.add(mesh);
        return mesh;
      }

      box(2.25, .18, 1.6, 0, -.85, 0, orange);
      box(2.25, 1.75, .18, 0, 0, .72, orange);
      box(2.25, 1.75, .18, 0, 0, -.72, orange);
      box(.18, 1.75, 1.6, -1.04, 0, 0, orange);
      box(.18, 1.75, 1.6, 1.04, 0, 0, orange);
      box(2.29, .15, .2, 0, .85, .72, orange, .07);
      box(2.29, .15, .2, 0, .85, -.72, orange, .07);
      box(.2, .15, 1.6, -1.05, .85, 0, orange, .07);
      box(.2, .15, 1.6, 1.05, .85, 0, orange, .07);
      box(1.94, .86, .12, 0, -.05, .86, dark, .1);
      box(.23, .29, .05, -.55, .05, .945, white, .045);
      box(.23, .29, .05, .55, .05, .945, white, .045);
      box(.18, .055, .05, 0, -.18, .945, white, .015);
      box(.23, .42, .5, -1.2, .04, 0, dark, .1);
      box(.23, .42, .5, 1.2, .04, 0, dark, .1);
      box(.55, .23, .68, -.67, -1.03, .32, dark, .08);
      box(.55, .23, .68, .67, -1.03, .32, dark, .08);
      for (const [x, height, material] of [[-.65, 2.35, dark], [0, 2.15, white], [.65, 2.25, dark]] as const) {
        const pencil = new THREE.Mesh(new THREE.CylinderGeometry(.065, .065, height, 12), material);
        pencil.position.set(x, 1.15, -.25);
        pencil.castShadow = true;
        model.add(pencil);
      }
      const ground = new THREE.Mesh(new THREE.PlaneGeometry(12, 12), new THREE.ShadowMaterial({ opacity: .09 }));
      ground.rotation.x = -Math.PI / 2;
      ground.position.y = -1.5;
      ground.receiveShadow = true;
      scene.add(ground);

      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
      const render = () => renderer.render(scene, camera);
      const resize = () => {
        const { width, height } = container.getBoundingClientRect();
        if (!width || !height) return;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        render();
      };
      const observer = new ResizeObserver(resize);
      observer.observe(container);
      let isVisible = true;
      const visibilityObserver = new IntersectionObserver(([entry]) => { isVisible = entry.isIntersecting; });
      visibilityObserver.observe(container);
      let frame = 0;
      let time = 0;
      let previous = 0;
      function animate(now: number) {
        frame = requestAnimationFrame(animate);
        const delta = Math.min((now - previous) / 1000, .05);
        previous = now;
        if (paused.current || reducedMotion.matches || document.hidden || !isVisible) return;
        time += delta;
        model.rotation.y = Math.sin(time * .5) * .18;
        model.position.y = Math.sin(time * .8) * .035;
        render();
      }
      resize();
      frame = requestAnimationFrame(animate);
      setIsReady(true);
      dispose = () => {
        cancelAnimationFrame(frame);
        observer.disconnect();
        visibilityObserver.disconnect();
        scene.traverse((object) => {
          if (object instanceof THREE.Mesh) object.geometry.dispose();
        });
        orange.dispose(); dark.dispose(); white.dispose(); texture.dispose();
        (ground.material as InstanceType<typeof THREE.ShadowMaterial>).dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    }

    initialize().catch(() => { /* The original SVG remains visible without WebGL. */ });
    return () => { isDisposed = true; dispose?.(); };
  }, []);

  return (
    <div className="h-full w-full" role="img" aria-label="3D-printed robot organizer concept">
      <div className="absolute inset-0" ref={host} />
      {!isReady && <Image src="/images/organizer-concept.svg" alt="" width={700} height={620} preload className="h-full w-full object-contain" />}
    </div>
  );
}
