"use client";

import { getTemplate } from "@/lib/templates";
import { Scaled } from "./Scaled";

export function Thumb({ id }: { id: string }) {
  const t = getTemplate(id)!;
  const page = t.render(t.defaults)[0];
  const scale = Math.min(230 / t.width, 180 / t.height);
  return (
    <Scaled w={t.width} h={t.height} scale={scale} className="thumb-shadow">
      {page}
    </Scaled>
  );
}
