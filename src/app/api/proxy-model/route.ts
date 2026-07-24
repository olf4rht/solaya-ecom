import { NextRequest, NextResponse } from "next/server";

/**
 * Proxies .ply model requests to Solaya's CloudFront CDN,
 * bypassing CORS restrictions for the Gaussian Splat viewer.
 *
 * Usage: /api/proxy-model?url=<encoded-solaya-model-url>
 */
export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
  }

  // Only allow proxying from Solaya's CDN
  if (!url.startsWith("https://assets-bear.solaya-app.com/")) {
    return NextResponse.json({ error: "Invalid model URL" }, { status: 403 });
  }

  try {
    const response = await fetch(url);

    if (!response.ok) {
      return NextResponse.json(
        { error: `Upstream error: ${response.status}` },
        { status: response.status }
      );
    }

    const body = response.body;
    if (!body) {
      return NextResponse.json({ error: "Empty response" }, { status: 502 });
    }

    return new NextResponse(body, {
      status: 200,
      headers: {
        "Content-Type": "application/octet-stream",
        "Cache-Control": "public, max-age=86400",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (err) {
    console.error("Proxy error:", err);
    return NextResponse.json({ error: "Failed to fetch model" }, { status: 502 });
  }
}
