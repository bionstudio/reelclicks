import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Manrope, JetBrains_Mono } from "next/font/google";
import { SITE_URL, site } from "@/lib/site";
import "./globals.css";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: "variable",
  axes: ["opsz", "wdth"],
  variable: "--font-bricolage",
  display: "swap",
});
const sans = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-jetbrains", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${site.name} — Cinematic Wedding Films, Reels & Brand Production in Maharashtra`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  keywords: [
    "wedding cinematography Maharashtra",
    "cinematic wedding reels",
    "wedding videographer Nashik",
    "videographer Malegaon",
    "videographer Manmad",
    "videographer Nandgaon",
    "brand video production",
    "corporate video shoot",
    "event videography",
    "Instagram reels production",
  ],
  authors: [{ name: site.name, url: SITE_URL }],
  creator: site.name,
  formatDetection: { telephone: false },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0e0e0e",
  colorScheme: "dark",
};

/**
 * Runs before paint:
 *  - marks the document for motion (so reveal targets start hidden only when JS + motion are available)
 *  - skips the preloader for visitors who've already seen it this session
 *  - fail-safe: never leave content hidden if scripts fail to load
 */
const bootScript = `(function(){try{var d=document.documentElement;var rm=window.matchMedia('(prefers-reduced-motion: reduce)').matches;if(!rm)d.classList.add('js-motion');if(sessionStorage.getItem('rc-intro')==='1'||rm){d.dataset.introDone='1';d.dataset.skipIntro='1';}setTimeout(function(){if(!d.dataset.motionReady){d.classList.remove('js-motion');d.dataset.introDone='1';var p=document.getElementById('preloader');if(p)p.style.display='none';}},5000);}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${display.variable} ${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
        <noscript>
          <style>{`#preloader{display:none!important}html{overflow:auto!important}`}</style>
        </noscript>
      </head>
      <body>{children}</body>
    </html>
  );
}
