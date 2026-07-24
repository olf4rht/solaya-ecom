"use client";

import { useRef, useEffect, useState } from "react";
import * as THREE from "three";

interface GaussianSplatViewerProps {
  plyUrl?: string;
  fallbackImage?: string;
  fallbackAlt?: string;
  className?: string;
  style?: React.CSSProperties;
}

// 130mm focal length on 35mm full-frame (24mm sensor height)
// FOV = 2 * atan(sensorHeight / (2 * focalLength))
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
}: GaussianSplatViewerProps) {
  const outerRef = useRef<HTMLDivElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<unknown>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");

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

        // Create our own camera with 130mm equivalent FOV
        const w = container.offsetWidth || 600;
        const h = container.offsetHeight || 600;
        const camera = new THREE.PerspectiveCamera(FOV_130MM, w / h, 0.1, 1000);
        // Position camera far enough to fit the whole model with narrow FOV
        camera.position.set(-12, 0.3, 0);
        camera.lookAt(0, 0, 0);

        const viewer = new GaussianSplats3D.Viewer({
          selfDrivenMode: true,
          useBuiltInControls: true,
          rootElement: container,
          camera: camera,
          initialCameraLookAt: [0, 0, 0],
          initialCameraPosition: [-12, 0.3, 0],
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

        // After loading: disable zoom/pan, compute center of gravity
        try {
          const viewerAny = viewer as unknown as Record<string, unknown>;

          // Disable zoom and pan — rotation only
          const controls = viewerAny.controls as {
            target: THREE.Vector3;
            enableZoom: boolean;
            enablePan: boolean;
            minDistance: number;
            maxDistance: number;
          } | undefined;

          if (controls) {
            controls.enableZoom = false;
            controls.enablePan = false;
            // Lock distance so scroll can't change it
            const currentDist = camera.position.length();
            controls.minDistance = currentDist;
            controls.maxDistance = currentDist;
          }

          // Compute center of gravity and re-target orbit
          const splatMesh = viewerAny.splatMesh as {
            getSplatCenter: (index: number, out: THREE.Vector3) => void;
            getSplatCount: () => number;
          } | undefined;

          if (splatMesh && splatMesh.getSplatCount && splatMesh.getSplatCenter) {
            const count = splatMesh.getSplatCount();
            const center = new THREE.Vector3();
            const temp = new THREE.Vector3();

            for (let i = 0; i < count; i++) {
              splatMesh.getSplatCenter(i, temp);
              center.add(temp);
            }
            center.divideScalar(count);

            console.log("[GS3D] Center of gravity:", center.x.toFixed(3), center.y.toFixed(3), center.z.toFixed(3));

            if (controls) {
              controls.target.copy(center);
            }
            camera.lookAt(center);
          }
        } catch (e) {
          console.warn("[GS3D] Could not configure controls:", e);
        }

        console.log("[GS3D] Model loaded — FOV:", FOV_130MM.toFixed(1) + "°");
        setStatus("ready");
      } catch (err) {
        console.error("[GS3D] Failed to load:", err);
        if (!disposed) setStatus("error");
      }
    };

    init();

    return () => {
      disposed = true;
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
  }, [plyUrl]);

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
