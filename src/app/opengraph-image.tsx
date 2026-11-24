import { ImageResponse } from "next/og";

export const alt = "REELCLICKS.IN — Turning Moments Into Memories";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0E0E0E",
          color: "#F4F1EA",
          padding: "64px 72px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 20, letterSpacing: 2, color: "rgba(244,241,234,0.6)" }}>
          <span>EVERY FRAME HAS A STORY</span>
          <span style={{ color: "#D7FF3A" }}>● REC</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "flex-end", fontSize: 160, fontWeight: 800, letterSpacing: -8, lineHeight: 1 }}>
            reelclicks
            <span style={{ color: "#D7FF3A" }}>.in</span>
          </div>
          <div style={{ display: "flex", height: 8, borderRadius: 8, background: "#D7FF3A", width: 220, marginTop: 28 }} />
          <div style={{ display: "flex", fontSize: 40, fontWeight: 700, color: "#0E0E0E", background: "#D7FF3A", padding: "4px 16px", borderRadius: 10, alignSelf: "flex-start", marginTop: 28 }}>
            Turning Moments Into Memories.
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 20, letterSpacing: 2, color: "rgba(244,241,234,0.6)" }}>
          <span>WEDDING FILMS · CINEMATIC REELS · BRAND FILMS</span>
          <span>ALL OVER MAHARASHTRA</span>
        </div>
      </div>
    ),
    size,
  );
}
