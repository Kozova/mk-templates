"use client";

import { forwardRef, type ReactNode } from "react";

/** Renders children at natural size (w×h) scaled down visually. The ref points to the natural-size node for export. */
export const Scaled = forwardRef<HTMLDivElement, { w: number; h: number; scale: number; children: ReactNode; className?: string }>(
  function Scaled({ w, h, scale, children, className }, ref) {
    return (
      <div className={className} style={{ width: w * scale, height: h * scale, overflow: "hidden", flex: "none" }}>
        <div style={{ transform: `scale(${scale})`, transformOrigin: "0 0", width: w, height: h }}>
          <div ref={ref} style={{ width: w, height: h }}>
            {children}
          </div>
        </div>
      </div>
    );
  },
);
