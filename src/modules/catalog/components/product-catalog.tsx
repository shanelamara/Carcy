"use client";

import { AnimatePresence, motion, useIsPresent } from "framer-motion";
import { Search } from "lucide-react";
import { useState, type Ref } from "react";
import { MotionReveal } from "@/components/shared/motion-effects";
import { useMotionPreferences } from "@/components/shared/motion-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { ProductCard } from "./product-card";
import { collectionFilters } from "../config/collection-filters";
import type { ConceptProduct } from "../types/product-types";

export function ProductCatalog({ products }: { products: ConceptProduct[] }) {
  const { canAnimate } = useMotionPreferences();
  const [category, setCategory] = useState("All little things");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("featured");
  const query = search.trim().toLocaleLowerCase();
  const visibleProducts = products.filter((product) => (category === "All little things" || product.category === category) && `${product.collection} ${product.description}`.toLocaleLowerCase().includes(query)).toSorted((a, b) => sort === "az" ? a.collection.localeCompare(b.collection) : sort === "za" ? b.collection.localeCompare(a.collection) : a.order - b.order);
  return (
    <section id="shop" className="shop-section catalog-section" aria-labelledby="catalog-heading">
      <div className="shop-container wrap flex h-full flex-col">
        <MotionReveal className="catalog-heading" effect="unmask">
          <div>
            <h2 id="catalog-heading" className="shop-heading">Small things.<br /><span className="text-muted-foreground">Full of character.</span></h2>
          </div>
          <p className="shop-body max-w-[42ch]">Accessories, desk companions, and thoughtful gifts.{" "}<br />Find the collection that feels like you.</p>
        </MotionReveal>
        <div className="catalog-controls">
          <div className="collection-filters flex flex-wrap gap-2" role="group" aria-label="Filter by collection">{collectionFilters.map((filter) => <Button key={filter} variant="filter" aria-pressed={category === filter} onClick={() => setCategory(filter)}>{filter}</Button>)}</div>
          <div className="flex items-center justify-between gap-4 max-sm:gap-3">
            <label className="catalog-search flex max-w-[360px] min-w-0 flex-1 items-center gap-3 border-b border-input"><span className="sr-only">Search products</span><Search className="size-5 shrink-0" aria-hidden="true" /><Input type="search" placeholder="Find your kind of thing" value={search} onChange={(event) => setSearch(event.target.value)} className="catalog-search-input" /></label>
            <label><span className="sr-only">Sort products</span><NativeSelect className="catalog-sort" value={sort} onChange={(event) => setSort(event.target.value)}><NativeSelectOption value="featured">Featured</NativeSelectOption><NativeSelectOption value="az">Name: A–Z</NativeSelectOption><NativeSelectOption value="za">Name: Z–A</NativeSelectOption></NativeSelect></label>
          </div>
        </div>
        <p role="status" className="sr-only">{visibleProducts.length} concept {visibleProducts.length === 1 ? "collection" : "collections"} shown.</p>
        <div aria-label="Concept collections"><MotionReveal effect="stagger" className="product-grid"><AnimatePresence initial={false} mode="popLayout">{visibleProducts.map((product) => <AnimatedProduct key={product.id} product={product} canAnimate={canAnimate} />)}</AnimatePresence></MotionReveal></div>
        {visibleProducts.length === 0 && <div className="py-14"><h3 className="font-heading text-2xl font-semibold">No matching products.</h3><p className="mt-3 text-muted-foreground">Try another collection or search.</p><Button className="mt-5" onClick={() => { setSearch(""); setCategory("All little things"); }}>Clear filters</Button></div>}
        <p className="shop-note mt-6">Concept previews only. Product names, photos, prices, and available colors are editable placeholders.</p>
      </div>
    </section>
  );
}

function AnimatedProduct({ product, canAnimate, ref }: { product: ConceptProduct; canAnimate: boolean; ref?: Ref<HTMLDivElement> }) {
  const isPresent = useIsPresent();
  return (
    <motion.div ref={ref} layout={canAnimate} inert={!isPresent} aria-hidden={!isPresent || undefined}
      initial={canAnimate ? { opacity: 0, y: 28, scale: 0.96 } : false}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: canAnimate ? 0.94 : 1 }}
      transition={{ duration: canAnimate ? 0.35 : 0 }}
      whileHover={canAnimate ? { y: -2 } : undefined}>
      <ProductCard product={product} />
    </motion.div>
  );
}
