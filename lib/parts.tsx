import type { CSSProperties, ReactNode } from "react";
import { C, FONT, MONO, logoDataUrl } from "./brand";

export function Logo({ size, inverse = false }: { size: number; inverse?: boolean }) {
  const src = inverse ? logoDataUrl(C.ink, C.yellow) : logoDataUrl(C.yellow, C.graphite2);
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} width={size} height={size} alt="MK" style={{ display: "block" }} />;
}

export function Wordmark({ size, color }: { size: number; color: string }) {
  return (
    <span style={{ fontFamily: MONO, fontWeight: 500, fontSize: size, letterSpacing: "0.02em", color }}>
      MK CONSULTING
    </span>
  );
}

export function Eyebrow({ children, size, color, tick = true }: { children: ReactNode; size: number; color: string; tick?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: size * 0.6 }}>
      {tick && <span style={{ width: size * 0.8, height: size * 0.8, background: C.yellow, display: "inline-block" }} />}
      <span style={{ fontFamily: MONO, fontWeight: 500, fontSize: size, textTransform: "uppercase", letterSpacing: "0.04em", color }}>
        {children}
      </span>
    </div>
  );
}

export function Page({ w, h, bg, children, style }: { w: number; h: number; bg: string; children: ReactNode; style?: CSSProperties }) {
  return (
    <div
      style={{
        width: w,
        height: h,
        background: bg,
        position: "relative",
        overflow: "hidden",
        fontFamily: FONT,
        color: C.ink,
        boxSizing: "border-box",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export const headline = (size: number, color: string): CSSProperties => ({
  fontFamily: FONT,
  fontWeight: 700,
  fontSize: size,
  lineHeight: 0.98,
  letterSpacing: size > 60 ? "-0.02em" : "-0.01em",
  color,
  margin: 0,
  whiteSpace: "pre-line",
  overflowWrap: "break-word",
});

export const body = (size: number, color: string): CSSProperties => ({
  fontFamily: FONT,
  fontWeight: 400,
  fontSize: size,
  lineHeight: 1.35,
  color,
  margin: 0,
  whiteSpace: "pre-line",
});

export const mono = (size: number, color: string): CSSProperties => ({
  fontFamily: MONO,
  fontWeight: 500,
  fontSize: size,
  color,
  letterSpacing: "0.02em",
});

export const lines = (v: unknown) =>
  String(v ?? "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
