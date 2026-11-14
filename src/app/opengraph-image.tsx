import { ImageResponse } from "next/og";
import { profile } from "@/data/resume";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${profile.name} — ${profile.role}`;

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f4f3ee",
          color: "#0b0b0c",
          padding: 72,
          fontSize: 28,
        }}
      >
        <div style={{ display: "flex", color: "#2261e9" }}>{profile.focus}</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 120, fontWeight: 700, lineHeight: 1 }}>{profile.name}</div>
          <div style={{ fontSize: 44, marginTop: 20 }}>{profile.role}</div>
        </div>
      </div>
    ),
    size
  );
}
