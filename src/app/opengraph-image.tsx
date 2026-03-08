import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Pintu Kumar - Full Stack Software Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #030712 0%, #1e1b4b 50%, #030712 100%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Grid pattern */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.05,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Gradient orbs */}
        <div
          style={{
            position: "absolute",
            top: "20%",
            left: "15%",
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: "rgba(99, 102, 241, 0.15)",
            filter: "blur(80px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "20%",
            right: "15%",
            width: 250,
            height: 250,
            borderRadius: "50%",
            background: "rgba(139, 92, 246, 0.15)",
            filter: "blur(80px)",
          }}
        />

        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
            zIndex: 10,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 20px",
              borderRadius: 999,
              border: "1px solid rgba(99, 102, 241, 0.3)",
              background: "rgba(99, 102, 241, 0.1)",
              fontSize: 16,
              color: "rgba(165, 180, 252, 1)",
            }}
          >
            Full Stack Software Developer
          </div>

          <div
            style={{
              fontSize: 72,
              fontWeight: 800,
              color: "white",
              letterSpacing: "-2px",
            }}
          >
            Pintu Kumar
          </div>

          <div
            style={{
              fontSize: 24,
              color: "rgba(148, 163, 184, 1)",
              maxWidth: 600,
              textAlign: "center",
            }}
          >
            React &bull; Node.js &bull; TypeScript &bull; Cloud
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
