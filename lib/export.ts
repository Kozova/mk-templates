"use client";

import { toPng } from "html-to-image";
import { C, logoSvg } from "./brand";
import { lines } from "./parts";
import type { Data, Slide, Template } from "./types";

const slug = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9а-яіїєґ]+/gi, "-").replace(/^-|-$/g, "").slice(0, 40) || "mk";

function download(href: string, name: string) {
  const a = document.createElement("a");
  a.href = href;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

async function renderPages(nodes: HTMLElement[], scale: number) {
  await document.fonts.ready;
  const out: string[] = [];
  for (const n of nodes) {
    out.push(await toPng(n, { pixelRatio: scale, cacheBust: true }));
  }
  return out;
}

export async function exportPng(t: Template, nodes: HTMLElement[], base: string) {
  const imgs = await renderPages(nodes, t.exportScale);
  imgs.forEach((src, i) => download(src, `${slug(base)}${imgs.length > 1 ? `-${i + 1}` : ""}.png`));
}

export async function exportPdf(t: Template, nodes: HTMLElement[], base: string) {
  const { jsPDF } = await import("jspdf");
  const imgs = await renderPages(nodes, t.printMm ? Math.max(t.exportScale, 1) : t.exportScale);
  const w = t.printMm ? t.printMm.w : t.width;
  const h = t.printMm ? t.printMm.h : t.height;
  const unit = t.printMm ? "mm" : "px";
  const pdf = new jsPDF({ orientation: w > h ? "landscape" : "portrait", unit, format: [w, h], hotfixes: ["px_scaling"] });
  imgs.forEach((src, i) => {
    if (i > 0) pdf.addPage([w, h], w > h ? "landscape" : "portrait");
    pdf.addImage(src, "PNG", 0, 0, w, h);
  });
  pdf.save(`${slug(base)}.pdf`);
}

async function svgToPng(svg: string, size: number): Promise<string> {
  const img = new Image();
  img.src = "data:image/svg+xml;base64," + btoa(svg);
  await img.decode();
  const c = document.createElement("canvas");
  c.width = c.height = size;
  c.getContext("2d")!.drawImage(img, 0, 0, size, size);
  return c.toDataURL("image/png");
}

const hex = (c: string) => c.replace("#", "");
const px = (v: number) => v / 96; // 1280px = 13.333in

export async function exportPptx(t: Template, nodes: HTMLElement[], base: string, data: Data) {
  const PptxGenJS = (await import("pptxgenjs")).default;
  const pptx = new PptxGenJS();
  pptx.defineLayout({ name: "TPL", width: px(t.width), height: px(t.height) });
  pptx.layout = "TPL";

  if (t.id === "presentation") {
    await buildNativeDeck(pptx, data);
  } else {
    const imgs = await renderPages(nodes, t.exportScale);
    for (const src of imgs) {
      const sl = pptx.addSlide();
      sl.addImage({ data: src, x: 0, y: 0, w: px(t.width), h: px(t.height) });
    }
  }
  await pptx.writeFile({ fileName: `${slug(base)}.pptx` });
}

// Editable PowerPoint version of the presentation template
async function buildNativeDeck(pptx: InstanceType<typeof import("pptxgenjs").default>, data: Data) {
  const slides = (Array.isArray(data.slides) ? data.slides : []) as Slide[];
  const title = String(data.title ?? "");
  const logoPrimary = await svgToPng(logoSvg(C.yellow, C.graphite2), 256);
  const logoInverse = await svgToPng(logoSvg(C.ink, C.yellow), 256);
  const F = "e-Ukraine";
  const M = "JetBrains Mono";

  slides.forEach((s, i) => {
    const sl = pptx.addSlide();
    const footerColor = s.layout === "section" ? "8A8C86" : s.layout === "statement" ? hex(C.ink) : hex(C.muted);
    const footer = () => {
      sl.addText(title, { x: px(64), y: px(660), w: px(900), h: px(30), fontFace: M, fontSize: 10, color: footerColor, margin: 0 });
      sl.addText(`${String(i + 1).padStart(2, "0")} / ${String(slides.length).padStart(2, "0")}`, {
        x: px(1000), y: px(660), w: px(216), h: px(30), fontFace: M, fontSize: 10, color: footerColor, align: "right", margin: 0,
      });
    };

    if (s.layout === "section") {
      sl.background = { color: hex(C.ink) };
      sl.addImage({ data: logoPrimary, x: px(64), y: px(64), w: px(48), h: px(48) });
      sl.addText("MK CONSULTING", { x: px(126), y: px(72), w: px(400), h: px(32), fontFace: M, fontSize: 12, color: "FFFFFF", margin: 0 });
      sl.addText(s.title, { x: px(64), y: px(300), w: px(1016), h: px(190), fontFace: F, bold: true, fontSize: 54, color: "FFFFFF", valign: "bottom", margin: 0 });
      if (s.text) sl.addText(s.text, { x: px(64), y: px(505), w: px(1016), h: px(60), fontFace: F, fontSize: 18, color: "C9CAC4", margin: 0 });
    } else if (s.layout === "statement") {
      sl.background = { color: hex(C.yellow) };
      sl.addImage({ data: logoInverse, x: px(64), y: px(64), w: px(48), h: px(48) });
      sl.addText(s.title, { x: px(64), y: px(200), w: px(1056), h: px(220), fontFace: F, bold: true, fontSize: 46, color: hex(C.ink), valign: "top", margin: 0 });
      if (s.text) sl.addText(s.text, { x: px(64), y: px(440), w: px(1056), h: px(80), fontFace: F, fontSize: 18, color: hex(C.graphite2), margin: 0 });
    } else {
      sl.background = { color: hex(C.paper) };
      sl.addText(s.title, { x: px(64), y: px(64), w: px(900), h: px(100), fontFace: F, bold: true, fontSize: 30, color: hex(C.ink), valign: "top", margin: 0 });
      sl.addText("MK CONSULTING", { x: px(960), y: px(72), w: px(200), h: px(24), fontFace: M, fontSize: 10, color: hex(C.ink), align: "right", margin: 0 });
      sl.addImage({ data: logoPrimary, x: px(1176), y: px(64), w: px(40), h: px(40) });

      if (s.layout === "stats") {
        const items = lines(s.text).slice(0, 4);
        const n = Math.max(items.length, 1);
        const gap = 20;
        const cw = (1152 - gap * (n - 1)) / n;
        items.forEach((l, k) => {
          const [num, ...rest] = l.split(/\s+[—–-]\s+/);
          const x = 64 + k * (cw + gap);
          sl.addShape("rect", { x: px(x), y: px(250), w: px(cw), h: px(270), fill: { color: "FFFFFF" }, rectRadius: 0.15 });
          sl.addShape("rect", { x: px(x), y: px(250), w: px(cw), h: px(6), fill: { color: hex(C.yellow) } });
          sl.addText(num, { x: px(x + 32), y: px(285), w: px(cw - 64), h: px(80), fontFace: F, bold: true, fontSize: 44, color: hex(C.ink), margin: 0 });
          sl.addText(rest.join(" — "), { x: px(x + 32), y: px(380), w: px(cw - 64), h: px(120), fontFace: F, fontSize: 14, color: hex(C.muted), valign: "top", margin: 0 });
        });
      } else {
        lines(s.text).slice(0, 5).forEach((t, k) => {
          const y = 180 + k * 82;
          sl.addShape("rect", { x: px(64), y: px(y), w: px(1152), h: px(70), fill: { color: "FFFFFF" }, rectRadius: 0.12 });
          sl.addShape("rect", { x: px(64), y: px(y), w: px(6), h: px(70), fill: { color: hex(C.yellow) } });
          sl.addText(String(k + 1).padStart(2, "0"), { x: px(96), y: px(y), w: px(50), h: px(70), fontFace: M, fontSize: 13, color: hex(C.muted), valign: "middle", margin: 0 });
          sl.addText(t, { x: px(160), y: px(y), w: px(1030), h: px(70), fontFace: F, fontSize: 17, color: hex(C.ink), valign: "middle", margin: 0 });
        });
      }
    }
    footer();
  });
}
