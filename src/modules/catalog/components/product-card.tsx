import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { MotionReveal } from "@/components/shared/motion-effects";
import { FacebookLink } from "@/components/shared/facebook-link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import type { ConceptProduct } from "../types/product-types";

export function ProductCard({ product }: { product: ConceptProduct }) {
  return (
    <article className="h-full">
      <Card className="product-card card">
        <Dialog>
          <div className="product-card-heading">
            <span className="shop-note">Collection {String(product.order).padStart(2, "0")}</span>
            <h3>{product.collection}</h3>
          </div>
          <div className="product-art">
            <span className="product-number" aria-hidden="true">0{product.order}</span>
            <Image src={product.image} width={600} height={480} alt={`Illustrative ${product.collection} concept`} sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 20vw" className="h-full w-full object-contain" />
          </div>
          <p className="product-description">{product.description}</p>
          <DialogTrigger render={<Button variant="textLink" className="product-detail-link" />} aria-label={`View details for ${product.collection}`}>
            View collection <ArrowUpRight aria-hidden="true" />
          </DialogTrigger>
          <DialogContent className="product-detail-dialog" aria-label={product.collection}>
            <MotionReveal effect="stagger" className="detail-layout grid grid-cols-2 items-center gap-8">
              <Image src={product.image} width={500} height={400} alt={`Illustrative ${product.collection} concept`} className="h-[320px] w-full bg-muted object-contain" />
              <div><p className="shop-note">Collection {String(product.order).padStart(2, "0")}</p><DialogTitle className="my-4 font-heading text-3xl leading-tight font-normal tracking-tight">{product.collection}</DialogTitle><DialogDescription className="shop-body text-foreground">{product.description}</DialogDescription><p className="shop-body my-4">This is a concept preview. Product photos, dimensions, and available colors are to be confirmed.</p><p className="shop-body mb-6">₱ — Price to be confirmed</p><FacebookLink /></div>
            </MotionReveal>
          </DialogContent>
        </Dialog>
      </Card>
    </article>
  );
}
