import { siteConfig } from "@/lib/site";
import { ImageResponse } from "next/og";

export const alt = siteConfig.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: 80,
        color: "white",
        background:
          "radial-gradient(circle at 15% 20%, rgba(139,92,246,0.55), transparent 50%), radial-gradient(circle at 85% 85%, rgba(190,242,100,0.30), transparent 45%), #05060a",
      }}
    >
      <div style={{ fontSize: 30, color: "#bef264", letterSpacing: 6 }}>
        SECURE · FAST · MODERN
      </div>

      <div style={{ fontSize: 96, fontWeight: 800, marginTop: 24 }}>
        {siteConfig.name}
      </div>

      <div style={{ fontSize: 36, color: "#a1a1aa", marginTop: 16 }}>
        {siteConfig.tagline}
      </div>
    </div>,
    size,
  );
}
