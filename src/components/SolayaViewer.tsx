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
  className?: string;
  style?: React.CSSProperties;
}

export default function SolayaViewer({
  splatUrl,
  previewImageUrl,
  color = "#FCFBFB",
  initialAngle = 0,
  autoLoad = true,
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

  return (
    <iframe
      src={`/solaya-viewer/index.html?${params.toString()}`}
      className={className}
      style={{
        border: "none",
        width: "100%",
        height: "100%",
        ...style,
      }}
      allow="fullscreen"
      loading="lazy"
    />
  );
}
