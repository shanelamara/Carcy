import Image from "next/image";
import logo from "@/assets/logos/logo.png";
import { MotionReveal } from "@/components/shared/motion-effects";

export function StorefrontStory() {
  return (
    <section id="about" className="shop-section story-section" aria-labelledby="story-heading">
      <div className="shop-container wrap story-layout">
        <p className="section-label">03 / The people behind the print</p>
        <h2 id="story-heading" className="shop-heading">Turning Creative Ideas{" "}<br />into Everyday Treasures.</h2>
        <div className="story-grid">
          <MotionReveal className="brand-scene" effect="unmask">
            <div className="brand-orbit" aria-hidden="true">
              <span>CREATIVITY</span>
              <span>PERSONALITY</span>
              <span>EVERYDAY JOY</span>
            </div>
            <Image src={logo} alt="CarCy 3D Shop original logo" width={600} height={600} sizes="(max-width: 767px) 100vw, 50vw" />
          </MotionReveal>
          <MotionReveal className="story-copy">
            <p className="story-lead">Useful can be cute.<br />Personal can be practical.</p>
            <p>CarCy 3D Shop creates personalized 3D-printed items that make everyday life more creative, convenient, and enjoyable.</p>
            <p>From aesthetic accessories to functional essentials, we bring ideas to life with creativity and attention to detail.</p>
            <div className="story-values"><span>Creativity</span><span>Personalization</span><span>Functionality</span></div>
          </MotionReveal>
        </div>
      </div>
    </section>
  );
}
