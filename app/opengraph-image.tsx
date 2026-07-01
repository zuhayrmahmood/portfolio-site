import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

// Root OG image — used for link previews across the site unless a segment
// provides its own. Statically generated at build time.
export const alt = `${site.name} — Portfolio`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  const domain = site.url.replace(/^https?:\/\//, "");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#faf8f4",
          color: "#2b2a28",
          padding: 80,
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 28,
            fontWeight: 600,
            letterSpacing: 10,
            color: "#c0663f",
          }}
        >
          PORTFOLIO
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 108, fontWeight: 600, lineHeight: 1 }}>
            {site.name}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 34,
              color: "#6b6660",
              marginTop: 28,
              maxWidth: 900,
            }}
          >
            Writing, projects, and ways to get in touch.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 26,
            color: "#6b6660",
          }}
        >
          <div
            style={{
              display: "flex",
              width: 72,
              height: 6,
              background: "#c0663f",
              borderRadius: 3,
            }}
          />
          <div style={{ display: "flex" }}>{domain}</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
