"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { industries, TOTAL_INDUSTRIES } from "@/lib/industries";
import GaussianSplatViewer from "@/components/GaussianSplatViewer";
import Navbar from "@/components/Navbar";

const PLY_URL = "/assets/models/pink-sneaker.ply";
const FALLBACK_IMAGE = "/assets/products/pink-sneaker.png";

function padIndex(i: number) {
  return String(i + 1).padStart(2, "0");
}

export default function IndustryPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [showControls, setShowControls] = useState(false);
  const [camPos, setCamPos] = useState<[number, number, number]>([-0.3, 5.7, -10.9]);
  const [camLookAt, setCamLookAt] = useState<[number, number, number]>([0, 0, 0]);
  const [objRotation, setObjRotation] = useState<[number, number, number]>([72, -50, 92]);

  const currentIndex = industries.findIndex((item) => item.slug === slug);
  const industry = industries[currentIndex];

  if (!industry) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-[14px] text-content-secondary">Industry not found.</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-white">
      <Navbar />

      {/* Industry info — top left */}
      <div style={{ paddingTop: "130px", paddingLeft: "41px", paddingRight: "41px" }}>
        <p className="text-[11px] font-medium text-content-secondary tracking-wide mb-2">
          Industry {padIndex(currentIndex)} / {padIndex(TOTAL_INDUSTRIES)}
        </p>
        <h2 className="text-[30px] font-normal text-[#302c2c] tracking-[-0.6px] leading-[1.1]">
          {industry.industry}
        </h2>
      </div>

      {/* Rotation toggle — fixed bottom right */}
      <button
        onClick={() => setShowControls(!showControls)}
        className="fixed bottom-[30px] right-[41px] z-50 text-[11px] font-medium cursor-pointer hover:opacity-70 transition-opacity"
        style={{
          background: "#2A2A27",
          color: "#fff",
          padding: "6px 14px",
          borderRadius: "8px",
        }}
      >
        {showControls ? "Hide" : "Adjust"} Camera
      </button>

      {showControls && (
        <div
          className="fixed bottom-[70px] right-[41px] z-50 bg-white rounded-[12px] p-4"
          style={{
            border: "1px solid #e5e5e0",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            width: 280,
          }}
        >
          <p className="text-[11px] font-medium text-content-primary mb-3">Camera Position</p>
          {(["X", "Y", "Z"] as const).map((axis, i) => (
            <div key={axis} className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-medium text-content-secondary w-[14px]">{axis}</span>
              <input
                type="range"
                min="-20"
                max="20"
                step="0.1"
                value={camPos[i]}
                onChange={(e) => {
                  const next = [...camPos] as [number, number, number];
                  next[i] = parseFloat(e.target.value);
                  setCamPos(next);
                }}
                className="flex-1"
              />
              <span className="text-[10px] font-mono text-content-secondary w-[40px] text-right">
                {camPos[i].toFixed(1)}
              </span>
            </div>
          ))}
          <p className="text-[11px] font-medium text-content-primary mb-3 mt-4">Look At</p>
          {(["X", "Y", "Z"] as const).map((axis, i) => (
            <div key={axis} className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-medium text-content-secondary w-[14px]">{axis}</span>
              <input
                type="range"
                min="-5"
                max="5"
                step="0.1"
                value={camLookAt[i]}
                onChange={(e) => {
                  const next = [...camLookAt] as [number, number, number];
                  next[i] = parseFloat(e.target.value);
                  setCamLookAt(next);
                }}
                className="flex-1"
              />
              <span className="text-[10px] font-mono text-content-secondary w-[40px] text-right">
                {camLookAt[i].toFixed(1)}
              </span>
            </div>
          ))}
          <p className="text-[11px] font-medium text-content-primary mb-3 mt-4">Object Rotation (deg)</p>
          {(["X", "Y", "Z"] as const).map((axis, i) => (
            <div key={axis} className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-medium text-content-secondary w-[14px]">{axis}</span>
              <input
                type="range"
                min="-180"
                max="180"
                step="1"
                value={objRotation[i]}
                onChange={(e) => {
                  const next = [...objRotation] as [number, number, number];
                  next[i] = parseFloat(e.target.value);
                  setObjRotation(next);
                }}
                className="flex-1"
              />
              <span className="text-[10px] font-mono text-content-secondary w-[40px] text-right">
                {objRotation[i].toFixed(0)}
              </span>
            </div>
          ))}
          <div className="mt-3 p-2 bg-[#f5f5f0] rounded-[6px]">
            <p className="text-[10px] font-mono text-content-secondary break-all select-all">
              pos: [{camPos.map((v) => v.toFixed(1)).join(", ")}]
              <br />
              lookAt: [{camLookAt.map((v) => v.toFixed(1)).join(", ")}]
              <br />
              rotation: [{objRotation.map((v) => v.toFixed(0)).join(", ")}]
            </p>
          </div>
        </div>
      )}

      {/* 3x2 Grid of .ply viewers */}
      <div
        style={{
          margin: "30px 41px 80px 41px",
          aspectRatio: "3 / 2",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gridTemplateRows: "repeat(2, 1fr)",
            width: "100%",
            height: "100%",
            border: "1px solid #e5e5e0",
          }}
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              style={{
                borderRight: (i % 3) < 2 ? "1px solid #e5e5e0" : "none",
                borderBottom: i < 3 ? "1px solid #e5e5e0" : "none",
                position: "relative",
              }}
            >
              <GaussianSplatViewer
                plyUrl={PLY_URL}
                fallbackImage={FALLBACK_IMAGE}
                fallbackAlt={`${industry.industry} product ${i + 1}`}
                cameraPosition={camPos}
                cameraLookAt={camLookAt}
                objectRotation={objRotation}
                style={{ width: "100%", height: "100%" }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{ padding: "0 41px 30px 41px" }} className="flex items-center gap-[40px]">
        <span className="text-[11px] font-medium text-content-secondary cursor-pointer hover:opacity-70 transition-opacity">
          Terms of Service
        </span>
        <span className="text-[11px] font-medium text-content-secondary cursor-pointer hover:opacity-70 transition-opacity">
          Contact
        </span>
        <a
          href="https://linkedin.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[11px] font-medium text-content-secondary hover:opacity-70 transition-opacity"
        >
          LinkedIn
        </a>
      </div>
    </div>
  );
}
