import { ImageResponse } from "next/og";

// iOS home-screen icon (180×180 PNG), generated to match the favicon.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#78629c",
          color: "#faf4ed",
          fontSize: 120,
          fontWeight: 600,
        }}
      >
        Z
      </div>
    ),
    { ...size },
  );
}
