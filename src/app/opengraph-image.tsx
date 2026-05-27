import { ImageResponse } from "next/og";
import { SITE } from "@/lib/site";

export const alt = `${SITE.name} — ${SITE.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Default OG image used when a page doesn't override its own.
// Each calc/article can still ship its own `opengraph-image.tsx` for a custom share.
export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          background:
            "linear-gradient(135deg, #1f5fb1 0%, #6f5675 60%, #555f71 100%)",
          color: "white",
          padding: "72px",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: 32,
            opacity: 0.9,
            letterSpacing: 0.5,
          }}
        >
          <span
            style={{
              width: 56,
              height: 56,
              borderRadius: 12,
              background: "white",
              color: "#1f5fb1",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: 32,
              marginRight: 18,
            }}
          >
            CE
          </span>
          {SITE.name}
        </div>

        <div
          style={{
            display: "flex",
            flex: 1,
            alignItems: "center",
            fontSize: 80,
            fontWeight: 600,
            lineHeight: 1.05,
            letterSpacing: -1,
          }}
        >
          {SITE.tagline}
        </div>

        <div style={{ display: "flex", fontSize: 28, opacity: 0.75 }}>
          calculators · formulas · sources cited
        </div>
      </div>
    ),
    { ...size },
  );
}
