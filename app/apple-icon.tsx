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
          background: "#c0663f",
          color: "#faf8f4",
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
