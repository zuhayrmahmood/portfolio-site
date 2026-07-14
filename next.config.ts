import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  // Let `.md`/`.mdx` files act as pages/imports alongside the usual extensions.
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
  // `next dev` blocks cross-origin requests to dev-only endpoints (like the
  // HMR websocket) from any host other than localhost — allowlist the LAN
  // IP so testing from a phone on the same WiFi works. Dev-only; has no
  // effect on production builds.
  allowedDevOrigins: ["192.168.2.224", "192.168.18.14"],
};

const withMDX = createMDX({
  options: {
    // Turbopack (the Next 16 default) needs plugins referenced by name, with
    // only serializable options (functions can't cross into the Rust worker).
    // remark-gfm = tables, task lists, strikethrough, autolinks.
    remarkPlugins: ["remark-gfm"],
    // rehype-img-size reads each post image from `public/` at build time and
    // stamps its intrinsic width/height onto the <img>, which the `img`
    // override in mdx-components.tsx forwards to next/image (Next 16 requires
    // explicit dimensions for string srcs). Prevents layout shift.
    rehypePlugins: [["rehype-img-size", { dir: "public" }]],
  },
});

export default withMDX(nextConfig);
