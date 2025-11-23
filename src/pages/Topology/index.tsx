import React, { useRef, useEffect } from 'react';
import styles from '@pages/Topology/styles.module.scss';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { regions } from './data.js';

const Topology: React.FC = () => {
  const viewRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Three.js objects stored in refs to persist across renders
  const sceneRef = useRef<THREE.Scene>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const controlsRef = useRef<OrbitControls>();
  const regionNodesRef = useRef<any[]>([]);
  const nodeObjectsRef = useRef<Map<string, THREE.Object3D>>(new Map());
  const linkObjectsRef = useRef<Map<string, THREE.Object3D>>(new Map());
  const animationFunctionsRef = useRef<(() => void)[]>([]);
  const raycasterRef = useRef<THREE.Raycaster>(new THREE.Raycaster());
  const mouseRef = useRef<THREE.Vector2>(new THREE.Vector2());
  const isAnimatingRef = useRef<boolean>(false);
  const animationIdRef = useRef<number>();

  // Utility: easeInOutCubic
  const easeInOutCubic = (t: number): number => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  };

  // Initialize Three.js
  useEffect(() => {
    if (!viewRef.current || !containerRef.current || !tooltipRef.current) return;

    const scene = new THREE.Scene();
    const aspect = viewRef.current.offsetWidth / viewRef.current.offsetHeight;
    const camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });

    camera.position.set(200, 200, 400);
    camera.lookAt(0, 0, 0);

    renderer.setSize(viewRef.current.offsetWidth, viewRef.current.offsetHeight);
    renderer.setClearColor(0x000000);
    containerRef.current.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Assign to refs
    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;

    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;

    // Reset state
    regionNodesRef.current = [];
    nodeObjectsRef.current.clear();
    linkObjectsRef.current.clear();
    animationFunctionsRef.current = [];

    // Helper functions
    const createLabel = (text: string, position: [number, number, number], color: number) => {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 128;
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = 'rgba(0,0,0,0.7)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = 'Bold 40px Arial';
      ctx.textAlign = 'center';
      ctx.fillStyle = `rgb(${(color >> 16) & 0xff}, ${(color >> 8) & 0xff}, ${color & 0xff})`;
      ctx.fillText(text, canvas.width / 2, canvas.height / 2 + 15);

      const texture = new THREE.CanvasTexture(canvas);
      const material = new THREE.SpriteMaterial({ map: texture });
      const sprite = new THREE.Sprite(material);
      sprite.position.set(position[0], position[1] + 40, position[2]);
      sprite.scale.set(60, 30, 1);
      scene.add(sprite);
    };

    const addFlowAnimation = (
      startPos: [number, number, number],
      endPos: [number, number, number],
      color: number
    ) => {
      const curve = new THREE.LineCurve3(
        new THREE.Vector3(...startPos),
        new THREE.Vector3(...endPos)
      );
      const tubeGeometry = new THREE.TubeGeometry(curve, 20, 1, 8, false);
      const tubeMaterial = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide,
      });
      const tube = new THREE.Mesh(tubeGeometry, tubeMaterial);
      scene.add(tube);

      const particleCount = 30;
      const particles = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);
      const colorObj = new THREE.Color(color);

      for (let i = 0; i < particleCount; i++) {
        const t = Math.random();
        positions[i * 3] = startPos[0] + t * (endPos[0] - startPos[0]);
        positions[i * 3 + 1] = startPos[1] + t * (endPos[1] - startPos[1]);
        positions[i * 3 + 2] = startPos[2] + t * (endPos[2] - startPos[2]);

        const fade = 0.2 + 0.8 * Math.random();
        colors[i * 3] = colorObj.r * fade;
        colors[i * 3 + 1] = colorObj.g * fade;
        colors[i * 3 + 2] = colorObj.b * fade;
      }

      particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      const particleMaterial = new THREE.PointsMaterial({
        size: 3,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
      });

      const particleSystem = new THREE.Points(particles, particleMaterial);
      scene.add(particleSystem);

      const animateFlow = () => {
        tubeMaterial.opacity = 0.2 + Math.sin(Date.now() * 0.002) * 0.1;

        const posArray = particles.attributes.position.array as Float32Array;
        for (let i = 0; i < particleCount; i++) {
          const dx = endPos[0] - posArray[i * 3];
          const dy = endPos[1] - posArray[i * 3 + 1];
          const dz = endPos[2] - posArray[i * 3 + 2];

          posArray[i * 3] += dx * 0.02;
          posArray[i * 3 + 1] += dy * 0.02;
          posArray[i * 3 + 2] += dz * 0.02;

          if (Math.abs(dx) < 1 && Math.abs(dy) < 1 && Math.abs(dz) < 1) {
            posArray[i * 3] = startPos[0] + (Math.random() - 0.5) * 10;
            posArray[i * 3 + 1] = startPos[1] + (Math.random() - 0.5) * 10;
            posArray[i * 3 + 2] = startPos[2] + (Math.random() - 0.5) * 10;
          }
        }
        particles.attributes.position.needsUpdate = true;
      };

      animationFunctionsRef.current.push(animateFlow);
    };

    const createRegions = () => {
      const coreRegion = regions[0];
      const coreNode = {
        id: `region-${coreRegion.name}`,
        name: coreRegion.name,
        isCore: true,
        position: coreRegion.position,
        devices: coreRegion.devices,
      };
      regionNodesRef.current.push(coreNode);

      const coreGeometry = new THREE.CylinderGeometry(20, 20, 30, 32);
      const coreMaterial = new THREE.MeshPhongMaterial({
        color: coreRegion.color,
        shininess: 100,
        specular: 0xffffff,
        emissive: coreRegion.color,
        emissiveIntensity: 0.2,
      });
      const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
      coreMesh.rotation.x = Math.PI / 2;
      coreMesh.position.set(...(coreRegion.position as [number, number, number]));
      coreMesh.userData = { ...coreNode, type: 'region' };
      nodeObjectsRef.current.set(coreNode.id, coreMesh);
      scene.add(coreMesh);
      createLabel(coreRegion.name, coreRegion.position, coreRegion.color);

      coreRegion.children.forEach((region: any) => {
        const regionNode = {
          id: `region-${region.name}`,
          name: region.name,
          isCore: false,
          position: region.position,
          devices: region.devices,
        };
        regionNodesRef.current.push(regionNode);

        const geometry = new THREE.CylinderGeometry(15, 15, 25, 32);
        const material = new THREE.MeshPhongMaterial({
          color: region.color,
          shininess: 100,
          specular: 0xffffff,
          emissive: region.color,
          emissiveIntensity: 0.2,
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.rotation.x = Math.PI / 2;
        mesh.position.set(...(region.position as [number, number, number]));
        mesh.userData = { ...regionNode, type: 'region' };
        nodeObjectsRef.current.set(regionNode.id, mesh);
        scene.add(mesh);
        createLabel(region.name, region.position, region.color);
      });
    };

    const createRegionLinks = () => {
      const coreRegion = regionNodesRef.current.find((r) => r.isCore)!;
      regionNodesRef.current.forEach((region) => {
        if (!region.isCore) {
          const lineGeometry = new THREE.BufferGeometry();
          const points = [
            new THREE.Vector3(...coreRegion.position),
            new THREE.Vector3(...region.position),
          ];
          lineGeometry.setFromPoints(points);
          const lineMaterial = new THREE.LineBasicMaterial({
            color: 0x00ff00,
            transparent: true,
            opacity: 0.6,
          });
          const line = new THREE.Line(lineGeometry, lineMaterial);
          scene.add(line);
          linkObjectsRef.current.set(`link-${coreRegion.id}-${region.id}`, line);
          addFlowAnimation(coreRegion.position, region.position, 0x00ff00);
        }
      });
    };

    const createDevices = () => {
      regionNodesRef.current.forEach((region) => {
        region.devices.forEach((device: any, i: any) => {
          const angle = (i / region.devices.length) * Math.PI * 2;
          const radius = region.isCore ? 50 : 30;
          const x = region.position[0] + Math.cos(angle) * radius;
          const y = region.position[1];
          const z = region.position[2] + Math.sin(angle) * radius;

          const deviceNode = {
            id: `device-${region.name}-${i}`,
            name: device.name,
            region: region.name,
            position: [x, y, z],
            type: 'device',
          };

          const geometry = new THREE.SphereGeometry(5, 16, 16);
          const material = new THREE.MeshPhongMaterial({
            color: region.isCore ? 0xffffff : region.color,
            emissive: region.color,
            emissiveIntensity: 0.1,
          });
          const mesh = new THREE.Mesh(geometry, material);
          mesh.position.set(x, y, z);
          mesh.userData = { ...deviceNode, type: 'device' };
          nodeObjectsRef.current.set(deviceNode.id, mesh);
          scene.add(mesh);

          const lineGeometry = new THREE.BufferGeometry();
          const points = [new THREE.Vector3(...region.position), new THREE.Vector3(x, y, z)];
          lineGeometry.setFromPoints(points);
          const lineMaterial = new THREE.LineBasicMaterial({
            color: region.color,
            transparent: true,
            opacity: 0.3,
          });
          const line = new THREE.Line(lineGeometry, lineMaterial);
          scene.add(line);
          linkObjectsRef.current.set(`link-${region.id}-${deviceNode.id}`, line);
        });
      });
    };

    const animate = () => {
      const controls = controlsRef.current;
      const renderer = rendererRef.current;
      const scene = sceneRef.current;
      const camera = cameraRef.current;
      if (!controls || !renderer || !scene || !camera) return;

      controls.update();
      renderer.render(scene, camera);
      animationFunctionsRef.current.forEach((fn) => fn());
      animationIdRef.current = requestAnimationFrame(animate);
    };

    // Build scene
    createRegions();
    createRegionLinks();
    createDevices();

    // Start animation loop
    animate();

    // Event handlers
    const onClickRegion = (event: MouseEvent) => {
      if (isAnimatingRef.current || !rendererRef.current || !cameraRef.current || !sceneRef.current)
        return;

      const rect = rendererRef.current.domElement.getBoundingClientRect();
      mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
      const intersects = raycasterRef.current.intersectObjects(sceneRef.current.children, true);

      if (intersects.length > 0) {
        const obj = intersects[0].object;
        if (obj.userData?.type === 'region') {
          const targetPos = obj.position.clone();
          const offset = new THREE.Vector3(0, 50, -100);
          offset.applyQuaternion(cameraRef.current.quaternion);
          const camTarget = targetPos.clone().add(offset);
          animateCameraToPosition(camTarget, targetPos);
        }
      }
    };

    const animateCameraToPosition = (targetCamPos: THREE.Vector3, targetLookAt: THREE.Vector3) => {
      isAnimatingRef.current = true;
      if (controlsRef.current) controlsRef.current.enabled = false;

      const camera = cameraRef.current!;
      const startPos = camera.position.clone();
      const startLookAt = new THREE.Vector3();
      camera.getWorldDirection(startLookAt);
      startLookAt.add(camera.position);

      const duration = 1000;
      const startTime = Date.now();

      const tick = () => {
        const now = Date.now();
        let progress = (now - startTime) / duration;
        if (progress >= 1) progress = 1;

        const eased = easeInOutCubic(progress);
        camera.position.lerpVectors(startPos, targetCamPos, eased);

        const currentLook = new THREE.Vector3();
        currentLook.lerpVectors(startLookAt, targetLookAt, eased);
        camera.lookAt(currentLook);

        if (progress < 1) {
          animationIdRef.current = requestAnimationFrame(tick);
        } else {
          isAnimatingRef.current = false;
          if (controlsRef.current) {
            controlsRef.current.enabled = true;
            controlsRef.current.target.copy(targetLookAt);
          }
        }
      };

      tick();
    };

    const handleShowTooltip = (event: MouseEvent) => {
      if (!rendererRef.current || !sceneRef.current || !tooltipRef.current) return;

      const rect = rendererRef.current.domElement.getBoundingClientRect();
      mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current!);
      const intersects = raycasterRef.current.intersectObjects(sceneRef.current.children, true);

      if (intersects.length > 0) {
        const obj = intersects[0].object;
        if (obj.userData?.type === 'region') {
          tooltipRef.current.style.display = 'block';
          tooltipRef.current.textContent = obj.userData.name;
          // Optional: position tooltip near cursor
          tooltipRef.current.style.left = event.clientX + 10 + 'px';
          tooltipRef.current.style.top = event.clientY + 10 + 'px';
          return;
        }
      }
      tooltipRef.current.style.display = 'none';
    };

    const domElement = rendererRef.current.domElement;
    domElement.addEventListener('click', onClickRegion);
    domElement.addEventListener('mousemove', handleShowTooltip);

    const handleResize = () => {
      if (!viewRef.current || !cameraRef.current || !rendererRef.current) return;
      const width = viewRef.current.offsetWidth;
      const height = viewRef.current.offsetHeight;
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);
      domElement.removeEventListener('click', onClickRegion);
      domElement.removeEventListener('mousemove', handleShowTooltip);
      window.removeEventListener('resize', handleResize);
      containerRef.current?.removeChild(domElement);
      renderer.dispose();
    };
  }, []);

  return (
    <div className={styles.view} ref={viewRef}>
      <div ref={containerRef}></div>
      <div ref={tooltipRef} className={styles.tooltip}></div>
    </div>
  );
};

export default Topology;
