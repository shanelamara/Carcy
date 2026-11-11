export type ConceptProduct = {
  id: string;
  collection: string;
  description: string;
  image: string;
  category: string;
  order: number;
};

export type ProductPhoto = {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
};
