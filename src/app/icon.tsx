import { ImageResponse } from "next/og";

// Programmatic favicon — "CE" wordmark on a primary-color background.
// Next 16 auto-generates a 32×32 PNG and the appropriate <link rel="icon"> tags.

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#1f5fb1",
          color: "white",
          fontSize: 18,
          fontWeight: 700,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          letterSpacing: -0.5,
        }}
      >
        CE
      </div>
    ),
    { ...size },
  );
}
