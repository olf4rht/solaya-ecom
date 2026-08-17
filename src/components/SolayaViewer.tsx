"use client";

const R2_PREFIX = "https://pub-b09a781e649c4a3facf5c63382f0302d.r2.dev/";

function getProxiedUrl(url: string): string {
  if (url.startsWith(R2_PREFIX)) {
    return `/api/r2-files/${url.slice(R2_PREFIX.length)}`;
  }
  return url;
}

interface SolayaViewerProps {
  splatUrl: string;
  previewImageUrl?: string;
  color?: string;
  initialAngle?: number;
  autoLoad?: boolean;
  blockBottom?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export default function SolayaViewer({
  splatUrl,
  previewImageUrl,
  color = "#FCFBFB",
  initialAngle = 180,
  autoLoad = true,
  blockBottom = false,
  className,
  style,
}: SolayaViewerProps) {
  const proxiedSplatUrl = getProxiedUrl(splatUrl);
  const params = new URLSearchParams({
    splatUrl: proxiedSplatUrl,
    color,
    initialAngle: String(initialAngle),
    autoLoad: String(autoLoad),
  });
  if (previewImageUrl) params.set("previewImgUrl", previewImageUrl);
  if (blockBottom) params.set("blockBottom", "true");

  return (
    <div
      style={{ width: "100%", height: "100%", touchAction: "none", ...style }}
      className={className}
    >
      <iframe
        src={`/solaya-viewer/index.html?${params.toString()}`}
        style={{
          border: "none",
          width: "100%",
          height: "100%",
          touchAction: "none",
        }}
        allow="fullscreen"
        loading="lazy"
      />
    </div>
  );
}
