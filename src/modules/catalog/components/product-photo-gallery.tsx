"use client";

import Image from "next/image";
import { useState } from "react";
import { MotionReveal } from "@/components/shared/motion-effects";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import type { ProductPhoto } from "../types/product-types";

function createPhotoRails(photos: ProductPhoto[], railCount: number) {
  return Array.from({ length: railCount }, (_, railIndex) =>
    photos.filter((_, photoIndex) => photoIndex % railCount === railIndex),
  );
}

function PhotoRail({
  photos,
  label,
  direction,
  duration,
  onSelect,
}: {
  photos: ProductPhoto[];
  label: string;
  direction: "up" | "down";
  duration: number;
  onSelect: (photo: ProductPhoto) => void;
}) {
  return (
    <div className="photo-rail" role="group" aria-label={label}>
      <div className="photo-rail-viewport">
        <div
          className="photo-track"
          data-direction={direction}
          style={{ animationDuration: `${duration}s` }}
        >
          {[0, 1].map((copy) => (
            <ul
              key={copy}
              className="photo-track-set"
              aria-hidden={copy === 1}
            >
              {photos.map((photo) => (
                <li key={`${copy}-${photo.id}`} className="photo-tile">
                  <button
                    type="button"
                    className="photo-tile-button"
                    onClick={() => onSelect(photo)}
                    // The second copy only fills the loop; keep it out of the tab order.
                    tabIndex={copy === 1 ? -1 : undefined}
                    aria-label={`View larger: ${photo.alt}`}
                  >
                    <Image
                      src={photo.src}
                      width={photo.width}
                      height={photo.height}
                      alt=""
                      sizes="(max-width: 639px) 48vw, 32vw"
                      className="h-full w-full object-contain"
                    />
                  </button>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </div>
  );
}

function PhotoRails({
  photos,
  railCount,
  onSelect,
}: {
  photos: ProductPhoto[];
  railCount: number;
  onSelect: (photo: ProductPhoto) => void;
}) {
  return (
    <div className={`photo-rails photo-rails-${railCount}`}>
      {createPhotoRails(photos, railCount).map((railPhotos, index) => (
        <PhotoRail
          key={index}
          photos={railPhotos}
          label={`Product photos, column ${index + 1} of ${railCount}`}
          direction={index % 2 === 0 ? "up" : "down"}
          duration={26 + index * 3}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}

export function ProductPhotoGallery({ photos }: { photos: ProductPhoto[] }) {
  const [selectedPhoto, setSelectedPhoto] = useState<ProductPhoto | null>(null);
  // Separate from the photo so the image stays visible during the close animation.
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const openPhoto = (photo: ProductPhoto) => { setSelectedPhoto(photo); setIsViewerOpen(true); };

  return (
    <section
      id="shop"
      className="photo-gallery shop-section"
      aria-labelledby="photo-gallery-heading"
    >
      <div className="shop-container wrap flex flex-col">
        <MotionReveal className="photo-gallery-heading" effect="unmask">
          <div>
            <p className="section-label">Gallery</p>
            <h2 id="photo-gallery-heading" className="shop-heading">A closer look at the prints.</h2>
          </div>
          <div className="photo-gallery-intro">
            <p className="shop-body max-w-[42ch]">Explore a selection of CarCy product photos. Contact us to confirm details, pricing, and availability.</p>
          </div>
        </MotionReveal>
        <div className="photo-carousel" role="group" aria-label="CarCy product photos">
          <PhotoRails photos={photos} railCount={3} onSelect={openPhoto} />
          <PhotoRails photos={photos} railCount={2} onSelect={openPhoto} />
        </div>
      </div>
      <Dialog open={isViewerOpen} onOpenChange={setIsViewerOpen}>
        <DialogContent className="photo-viewer">
          {selectedPhoto && (
            <>
              <DialogTitle className="sr-only">{selectedPhoto.alt}</DialogTitle>
              <Image
                src={selectedPhoto.src}
                width={selectedPhoto.width}
                height={selectedPhoto.height}
                alt={selectedPhoto.alt}
                sizes="92vw"
                className="photo-viewer-image"
              />
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
