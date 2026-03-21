import type { ReactNode } from "react";

export type SlideStat = {
  label: string;
  value: string;
};

export type SlideSection = {
  title: string;
  body: string;
};

export type Slide = {
  id: string;
  eyebrow: string;
  title: string;
  thesis: string;
  bullets?: string[];
  sections?: SlideSection[];
  stats?: SlideStat[];
  takeaway?: string;
  citations?: string[];
  image?: string;
  imageAlt?: string;
  image2?: string;
  image2Alt?: string;
  visual?: ReactNode;
  layout?: "split" | "wide" | "text";
  appendix?: boolean;
};
