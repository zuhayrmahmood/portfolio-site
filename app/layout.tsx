import type { Metadata, Viewport } from "next";
import { Fraunces, Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { site } from "@/lib/site";
import { THEME_STORAGE_KEY, THEME_COLORS } from "@/lib/theme";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.title,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  openGraph: {
    title: site.title,
    description: site.description,
    url: site.url,
    siteName: site.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
  },
};

export const viewport: Viewport = {
  themeColor: THEME_COLORS.light,
};

// Runs synchronously during HTML parsing, before first paint, so the right
// theme is on screen before React ever hydrates — see
// node_modules/next/dist/docs/01-app/02-guides/preventing-flash-before-hydration.md.
// Falls back to the OS preference when nothing is stored yet. Only the
// localStorage read is wrapped in try/catch (it's the only thing that can
// throw, e.g. Safari private browsing) — everything after it, including the
// matchMedia fallback, still has to run even when storage is blocked, or the
// toggle (already made visible by the .js class below) ends up with no
// data-theme attribute at all.
const themeInitScript = `(function(){document.documentElement.classList.add("js");var t;try{t=localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY,
)})}catch(e){}if(t!=="light"&&t!=="dark"){t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.documentElement.setAttribute("data-theme",t);var m=document.querySelector('meta[name="theme-color"]');if(m)m.setAttribute("content",t==="dark"?${JSON.stringify(
  THEME_COLORS.dark,
)}:${JSON.stringify(THEME_COLORS.light)})})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${fraunces.variable} ${geistMono.variable} h-full`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="flex min-h-full flex-col">
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
