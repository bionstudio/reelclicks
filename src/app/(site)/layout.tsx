import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { Preloader } from "@/components/layout/Preloader";
import { SiteHeader } from "@/components/navigation/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SectionIndicator } from "@/components/layout/SectionIndicator";
import { RouteEffects } from "@/components/layout/RouteEffects";
import { WhatsAppFloat } from "@/components/layout/WhatsAppFloat";
import { JsonLd } from "@/components/seo/JsonLd";
import { organizationSchema } from "@/lib/seo/schema";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <SmoothScroll>
      <JsonLd data={organizationSchema()} />
      <Preloader />
      <SiteHeader />
      <main id="main" className="relative z-10 bg-ink">
        {children}
      </main>
      <SiteFooter />
      <SectionIndicator />
      <WhatsAppFloat />
      <RouteEffects />
      <div className="grain" aria-hidden />
    </SmoothScroll>
  );
}
