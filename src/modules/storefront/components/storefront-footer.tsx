import Image from "next/image";
import logo from "@/assets/logos/logo.png";
import { FacebookLink } from "@/components/shared/facebook-link";
import { MotionParallax, MotionReveal } from "@/components/shared/motion-effects";
import { FACEBOOK_URL } from "@/config/site";
import { storefrontLinks } from "../config/navigation";

export function StorefrontFooter() {
  return (
    <footer id="contact" className="storefront-footer closing">
      <div className="shop-container wrap footer-layout">
        <div className="close-word">
          <p className="section-label">Your next idea starts here</p>
          <div className="closing-head">
            <MotionReveal effect="unmask">
              <h2 className="shop-heading">Like it?<br />Let&apos;s make it <span>yours.</span></h2>
            </MotionReveal>
            <div className="closing-copy">
              <p>To place an order, contact our Facebook account. Send us the product you love and your personalization details.</p>
              <FacebookLink />
              <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" className="facebook-address">
                facebook.com/CarCyPrinting
              </a>
            </div>
          </div>
          <MotionParallax className="footer-word" distance={20}>
            <span aria-hidden="true">CarCy<span>3D</span></span>
          </MotionParallax>
        </div>
        <div className="footer-bottom">
          <a href="#home" className="footer-brand" aria-label="CarCy 3D Shop home">
            <Image src={logo} alt="" width={56} height={56} />
          </a>
          <p>Made with Creativity. Personalized for You.<br />Designed for Everyday Joy.</p>
          <nav aria-label="Footer">
            {storefrontLinks.map((link) => <a key={link.href} href={link.href} className="navigation-link">{link.label}</a>)}
          </nav>
          <span>© 2026 CarCy 3D Shop</span>
        </div>
      </div>
    </footer>
  );
}
