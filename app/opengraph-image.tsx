import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { site } from "@/lib/site";

// Root OG image — used for link previews across the site unless a segment
// provides its own. Statically generated at build time. Echoes the live
// homepage hero: the name in Fraunces, the editorial ground-rule, and the
// typed tagline with its accent caret, on the warm "paper" background.
//
// Note: an OG image is a single static PNG, so it can't be theme-aware — this
// renders the light ("warm minimal") palette, which is the site's default and
// first-paint theme. Colors are hard-coded (not the CSS vars) because Satori
// resolves no cascade; they mirror the light tokens in app/globals.css.
export const alt = `${site.name} — Portfolio`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Light-palette tokens, copied from app/globals.css (@theme block).
const BG = "#faf8f4";
const FG = "#2b2a28";
const MUTED = "#6b6660";
const SUBTLE = "#9a938a";
const ACCENT = "#3d84b8";
const GROUND = "#ded5c8";

export default async function OpengraphImage() {
  const domain = site.url.replace(/^https?:\/\//, "");

  // Satori can't use CSS-linked fonts — it needs the raw bytes. These are
  // tiny glyph-subsets of the real site fonts (see assets/); process.cwd()
  // is the project root at build time.
  const [fraunces, interRegular, interMedium] = await Promise.all([
    readFile(join(process.cwd(), "assets/Fraunces-Medium.ttf")),
    readFile(join(process.cwd(), "assets/Inter-Regular.ttf")),
    readFile(join(process.cwd(), "assets/Inter-Medium.ttf")),
  ]);

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        // Warm "lit paper" wash — a lighter cream up top settling into the
        // page cream, echoing the radial highlight on the live site.
        backgroundColor: BG,
        backgroundImage: `linear-gradient(180deg, #fffefb 0%, ${BG} 46%)`,
        color: FG,
        fontFamily: "Inter",
        padding: "84px 88px",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column" }}>
        {/* The name, exactly as the hero stacks it: Fraunces, two lines. */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontFamily: "Fraunces",
            fontWeight: 500,
            fontSize: 150,
            lineHeight: 0.95,
            letterSpacing: -4,
            color: FG,
          }}
        >
          <div style={{ display: "flex" }}>Zuhayr</div>
          <div style={{ display: "flex" }}>Mahmood</div>
        </div>

        {/* The delicate editorial rule the name sits above (.hero-ground). */}
        <div
          style={{
            display: "flex",
            width: 560,
            height: 1,
            marginTop: 40,
            backgroundImage: `linear-gradient(to right, transparent, ${GROUND} 12%, ${GROUND} 88%, transparent)`,
          }}
        />

        {/* The typed tagline + blinking accent caret (<TypingText>). */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginTop: 34,
            fontSize: 40,
            color: MUTED,
          }}
        >
          <span style={{ marginRight: 12 }}>I&apos;m a</span>
          <span style={{ color: FG, fontWeight: 500 }}>software developer</span>
          <span>.</span>
          <div
            style={{
              display: "flex",
              width: 4,
              height: 40,
              marginLeft: 10,
              borderRadius: 1,
              backgroundColor: ACCENT,
            }}
          />
        </div>
      </div>

      {/* Footer: accent bar (footer + caret motif) and the domain. */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            width: 72,
            height: 6,
            borderRadius: 3,
            backgroundColor: ACCENT,
          }}
        />
        <div
          style={{
            display: "flex",
            fontSize: 26,
            fontWeight: 500,
            color: MUTED,
          }}
        >
          {domain}
        </div>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: "Fraunces", data: fraunces, style: "normal", weight: 500 },
        { name: "Inter", data: interRegular, style: "normal", weight: 400 },
        { name: "Inter", data: interMedium, style: "normal", weight: 500 },
      ],
    },
  );
}
