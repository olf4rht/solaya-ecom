"use client";

import { useRef, useEffect, useState } from "react";
import * as THREE from "three";

interface GaussianSplatViewerProps {
  plyUrl?: string;
  fallbackImage?: string;
  fallbackAlt?: string;
  className?: string;
  style?: React.CSSProperties;
  cameraPosition?: [number, number, number];
  cameraLookAt?: [number, number, number];
  objectRotation?: [number, number, number]; // Euler degrees [x, y, z]
}

function eulerDegreesToQuat(degrees: [number, number, number]): [number, number, number, number] {
  const euler = new THREE.Euler(
    degrees[0] * Math.PI / 180,
    degrees[1] * Math.PI / 180,
    degrees[2] * Math.PI / 180,
  );
  const q = new THREE.Quaternion().setFromEuler(euler);
  return [q.w, q.x, q.y, q.z];
}

// 130mm focal length on 35mm full-frame (24mm sensor height)
const FOV_130MM = 2 * Math.atan(24 / (2 * 130)) * (180 / Math.PI); // ~10.5°

function getProxiedUrl(url: string): string {
  const prefix = "https://assets-bear.solaya-app.com/";
  if (url.startsWith(prefix)) {
    return `/api/solaya-models/${url.slice(prefix.length)}`;
  }
  return url;
}

export default function GaussianSplatViewer({
  plyUrl,
  fallbackImage,
  fallbackAlt = "",
  className = "",
  style,
  cameraPosition = [-12, 0.3, 0],
  cameraLookAt = [0, 0, 0],
  objectRotation = [0, 0, 0],
}: GaussianSplatViewerProps) {
  const outerRef = useRef<HTMLDivElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<unknown>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<{
    target: THREE.Vector3;
    enableZoom: boolean;
    enablePan: boolean;
    minDistance: number;
    maxDistance: number;
  } | null>(null);
  const splatMeshRef = useRef<THREE.Object3D | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");

  // Load model — only depends on plyUrl
  useEffect(() => {
    if (!plyUrl || !canvasContainerRef.current || !outerRef.current) return;

    let disposed = false;

    const init = async () => {
      setStatus("loading");
      const container = canvasContainerRef.current;
      if (!container) return;

      try {
        const GaussianSplats3D = await import("@mkkellogg/gaussian-splats-3d");

        if (disposed) return;

        const proxiedUrl = getProxiedUrl(plyUrl);
        console.log("[GS3D] Loading model from:", proxiedUrl);

        const w = container.offsetWidth || 600;
        const h = container.offsetHeight || 600;
        const camera = new THREE.PerspectiveCamera(FOV_130MM, w / h, 0.1, 1000);
        camera.position.set(...cameraPosition);
        camera.lookAt(...cameraLookAt);
        cameraRef.current = camera;

        const viewer = new GaussianSplats3D.Viewer({
          selfDrivenMode: true,
          useBuiltInControls: true,
          rootElement: container,
          camera: camera,
          initialCameraLookAt: cameraLookAt,
          initialCameraPosition: cameraPosition,
          ignoreDevicePixelRatio: false,
        });

        viewerRef.current = viewer;

        await viewer.addSplatScene(proxiedUrl, {
          splatAlphaRemovalThreshold: 5,
          showLoadingUI: false,
          position: [0, 0, 0],
          rotation: [1, 0, 0, 0],
          scale: [1, 1, 1],
          format: 2,
        });

        if (disposed) {
          viewer.dispose();
          return;
        }

        await viewer.start();

        try {
          const viewerAny = viewer as unknown as Record<string, unknown>;

          const controls = viewerAny.controls as typeof controlsRef.current;

          if (controls) {
            controls.enableZoom = false;
            controls.enablePan = false;
            const currentDist = camera.position.length();
            controls.minDistance = currentDist;
            controls.maxDistance = currentDist;
            controlsRef.current = controls;
          }

          const splatMesh = viewerAny.splatMesh as (THREE.Object3D & {
            getSplatCenter: (index: number, out: THREE.Vector3) => void;
            getSplatCount: () => number;
          }) | undefined;

          if (splatMesh) {
            splatMeshRef.current = splatMesh;
            // Apply initial rotation via mesh quaternion (same path as live updates)
            const euler = new THREE.Euler(
              objectRotation[0] * Math.PI / 180,
              objectRotation[1] * Math.PI / 180,
              objectRotation[2] * Math.PI / 180,
            );
            splatMesh.quaternion.setFromEuler(euler);
          }

          // Use provided lookAt instead of computing center of gravity
          if (controls) {
            controls.target.set(...cameraLookAt);
          }
          camera.lookAt(...cameraLookAt);
        } catch (e) {
          console.warn("[GS3D] Could not configure controls:", e);
        }

        setStatus("ready");
      } catch (err) {
        console.error("[GS3D] Failed to load:", err);
        if (!disposed) setStatus("error");
      }
    };

    init();

    return () => {
      disposed = true;
      cameraRef.current = null;
      controlsRef.current = null;
      splatMeshRef.current = null;
      if (viewerRef.current) {
        try {
          (viewerRef.current as { dispose: () => void }).dispose();
        } catch {
          // ignore
        }
        viewerRef.current = null;
      }
      if (canvasContainerRef.current) {
        canvasContainerRef.current.innerHTML = "";
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plyUrl]);

  // Update camera position/lookAt live without reloading the model
  useEffect(() => {
    const camera = cameraRef.current;
    if (!camera) return;
    camera.position.set(...cameraPosition);
    camera.lookAt(...cameraLookAt);
    if (controlsRef.current) {
      controlsRef.current.target.set(...cameraLookAt);
      const dist = camera.position.length();
      controlsRef.current.minDistance = dist;
      controlsRef.current.maxDistance = dist;
    }
  }, [cameraPosition, cameraLookAt]);

  // Update object rotation live
  useEffect(() => {
    const mesh = splatMeshRef.current;
    if (!mesh) return;
    const euler = new THREE.Euler(
      objectRotation[0] * Math.PI / 180,
      objectRotation[1] * Math.PI / 180,
      objectRotation[2] * Math.PI / 180,
    );
    mesh.quaternion.setFromEuler(euler);
  }, [objectRotation]);

  if (!plyUrl) {
    return (
      <div className={className} style={style}>
        {fallbackImage && (
          <img
            src={fallbackImage}
            alt={fallbackAlt}
            className="w-full h-full object-contain pointer-events-none"
            draggable={false}
          />
        )}
      </div>
    );
  }

  return (
    <div
      ref={outerRef}
      className={className}
      style={{
        position: "relative",
        overflow: "hidden",
        ...style,
      }}
    >
      <div
        ref={canvasContainerRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
        }}
      />
      {status !== "ready" && fallbackImage && (
        <img
          src={fallbackImage}
          alt={fallbackAlt}
          className={`w-full h-full object-contain pointer-events-none absolute inset-0 ${
            status === "loading" ? "animate-pulse opacity-50" : ""
          }`}
          draggable={false}
        />
      )}
    </div>
  );
}
