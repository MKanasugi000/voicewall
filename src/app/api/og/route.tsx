import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
          fontFamily: "sans-serif",
        }}
      >
        {/* Background decorations */}
        <div
          style={{
            position: "absolute",
            top: -80,
            right: -80,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "rgba(37, 99, 235, 0.15)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -60,
            left: -60,
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: "rgba(37, 99, 235, 0.1)",
            display: "flex",
          }}
        />

        {/* Speech bubble icon */}
        <div
          style={{
            fontSize: 72,
            marginBottom: 20,
            display: "flex",
          }}
        >
          💬
        </div>

        {/* Logo */}
        <div
          style={{
            display: "flex",
            fontSize: 64,
            fontWeight: 800,
            marginBottom: 16,
          }}
        >
          <span style={{ color: "#60a5fa" }}>Voice</span>
          <span style={{ color: "#ffffff" }}>Wall</span>
        </div>

        {/* Tagline */}
        <div
          style={{
            display: "flex",
            fontSize: 28,
            color: "#94a3b8",
            marginBottom: 40,
          }}
        >
          口コミを集めて、見せる。
        </div>

        {/* Feature pills */}
        <div
          style={{
            display: "flex",
            gap: 16,
          }}
        >
          {["簡単収集", "一元管理", "ウィジェット埋め込み"].map((text) => (
            <div
              key={text}
              style={{
                display: "flex",
                padding: "10px 24px",
                borderRadius: 99,
                background: "rgba(37, 99, 235, 0.2)",
                color: "#93c5fd",
                fontSize: 18,
                fontWeight: 600,
              }}
            >
              {text}
            </div>
          ))}
        </div>

        {/* URL */}
        <div
          style={{
            position: "absolute",
            bottom: 40,
            display: "flex",
            fontSize: 18,
            color: "#475569",
          }}
        >
          voicewall.vercel.app
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
