import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  // Let `.md`/`.mdx` files act as pages/imports alongside the usual extensions.
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
};

const withMDX = createMDX({
  options: {
    // Turbopack (the Next 16 default) needs plugins referenced by name.
    // remark-gfm = tables, task lists, strikethrough, autolinks.
    remarkPlugins: ["remark-gfm"],
    rehypePlugins: [],
  },
});

export default withMDX(nextConfig);
