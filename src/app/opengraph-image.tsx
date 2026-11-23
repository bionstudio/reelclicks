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
          background: "#080808",
          color: "#F5F3EF",
          padding: "64px 72px",
          fontFamily: "serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 18, letterSpacing: 4, color: "#A5A19A" }}>
          <span>FR.001 — EVERY FRAME HAS A STORY</span>
          <span style={{ color: "#C6A76A" }}>● REC</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "flex-start", fontSize: 150, letterSpacing: -4, lineHeight: 1 }}>
            REELCLICKS
            <span style={{ fontSize: 40, color: "#C6A76A", marginLeft: 8, marginTop: 18, letterSpacing: 2 }}>.IN</span>
          </div>
          <div style={{ display: "flex", height: 1, background: "#C6A76A", width: 420, marginTop: 28 }} />
          <div style={{ display: "flex", fontSize: 40, fontStyle: "italic", color: "#E7D8B5", marginTop: 28 }}>
            Turning Moments Into Memories.
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 18, letterSpacing: 4, color: "#A5A19A" }}>
          <span>WEDDING FILMS · CINEMATIC REELS · BRAND FILMS</span>
          <span>ALL OVER MAHARASHTRA</span>
        </div>
      </div>
    ),
    size,
  );
}
