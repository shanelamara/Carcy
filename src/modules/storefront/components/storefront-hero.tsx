import { ArrowDown } from "lucide-react";
import { FacebookLink } from "@/components/shared/facebook-link";
import { MotionParallax, MotionReveal } from "@/components/shared/motion-effects";
import { OrganizerPreview } from "./organizer-preview";

export function StorefrontHero() {
  return (
    <section className="storefront-hero hero hero--product" aria-labelledby="hero-heading">
      <div className="shop-container wrap hero-layout">
        <div className="hero-heading-grid">
          <MotionReveal effect="unmask">
            <p className="section-label">Personalized 3D-printed products</p>
            <h1 id="hero-heading" className="hero-title">Small Details.<br />Big Creativity.<br /><span>Made Just for You.</span></h1>
          </MotionReveal>
          <MotionReveal className="hero-introduction" delay={0.12}>
            <p className="shop-lead">Discover cute, creative, and functional 3D-printed products personalized to match your style.</p>
            <div className="hero-actions">
              <FacebookLink variant="inverse" />
              <a href="#shop" className="shop-text-link">See the products <ArrowDown aria-hidden="true" /></a>
            </div>
          </MotionReveal>
        </div>
        <div className="hero-product-stage hero__stage">
          <span className="stage-word" aria-hidden="true">PRINTED<br />PERSONAL.</span>
          <MotionParallax className="hero-organizer" distance={24}><OrganizerPreview /></MotionParallax>
          <span className="stage-corner">Designed to be useful.<br />Made to be yours.</span>
          <a href="#shop" aria-label="See product gallery" className="hero-down"><ArrowDown aria-hidden="true" /></a>
        </div>
        <div className="hero-foot">
          <span>Cute finds. Useful things. Your ideas.</span>
          <span>Concept render · Real product photos below</span>
        </div>
      </div>
    </section>
  );
}
