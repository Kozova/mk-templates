import type { ReactElement } from "react";

export type FieldType = "text" | "textarea" | "select" | "lines" | "slides";

export interface Field {
  key: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  maxLength?: number;
  options?: { value: string; label: string }[];
  hint?: string;
}

export type SlideLayout = "section" | "bullets" | "statement" | "stats";

export interface Slide {
  layout: SlideLayout;
  title: string;
  text: string;
}

export type Data = Record<string, string | Slide[]>;

export interface Template {
  id: string;
  name: string;
  category: string;
  description: string;
  /** Natural size of one page in CSS px */
  width: number;
  height: number;
  /** Physical print size, if this is a print format */
  printMm?: { w: number; h: number };
  /** pixelRatio used for PNG/PDF export */
  exportScale: number;
  fields: Field[];
  defaults: Data;
  /** What the AI helper should know about this format */
  aiBrief: string;
  /** Example request shown in the AI box */
  aiPlaceholder: string;
  render: (data: Data) => ReactElement[];
}
