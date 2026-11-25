"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { exportPdf, exportPng, exportPptx } from "@/lib/export";
import { getTemplate } from "@/lib/templates";
import type { Data, Field, Slide, SlideLayout } from "@/lib/types";
import { BrandMark } from "./Logo";
import { Scaled } from "./Scaled";

const LAYOUTS: { value: SlideLayout; label: string }[] = [
  { value: "section", label: "Обкладинка / розділ" },
  { value: "bullets", label: "Список пунктів" },
  { value: "stats", label: "Цифри" },
  { value: "statement", label: "Акцентна теза" },
];

const SLIDE_HINT: Record<SlideLayout, string> = {
  section: "Підзаголовок",
  bullets: "Кожен пункт з нового рядка (до 5)",
  stats: "Рядки «число — підпис» (до 4)",
  statement: "Пояснення (необов'язково)",
};

export function Editor({ id }: { id: string }) {
  const t = getTemplate(id)!;
  const storageKey = `mk-tpl:${id}`;
  const [data, setData] = useState<Data>(t.defaults);
  const [loaded, setLoaded] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiBusy, setAiBusy] = useState(false);
  const [aiError, setAiError] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [stageW, setStageW] = useState(800);
  const stageRef = useRef<HTMLDivElement>(null);
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);

  // restore last edit
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) setData({ ...t.defaults, ...JSON.parse(raw) });
    } catch {}
    setLoaded(true);
  }, [storageKey, t.defaults]);

  useEffect(() => {
    if (loaded) localStorage.setItem(storageKey, JSON.stringify(data));
  }, [data, loaded, storageKey]);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setStageW(e.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const pages = t.render(data);
  const scale = Math.min(1, (stageW - 8) / t.width, 760 / t.height);
  const set = (k: string, v: string | Slide[]) => setData((d) => ({ ...d, [k]: v }));
  const baseName = `${t.name}-${String(data.title ?? data.name ?? data.position ?? "")}`;

  async function runExport(kind: "png" | "pdf" | "pptx") {
    setBusy(kind);
    try {
      const nodes = pageRefs.current.slice(0, pages.length).filter(Boolean) as HTMLDivElement[];
      if (kind === "png") await exportPng(t, nodes, baseName);
      if (kind === "pdf") await exportPdf(t, nodes, baseName);
      if (kind === "pptx") await exportPptx(t, nodes, baseName, data);
    } catch (e) {
      console.error(e);
      alert("Не вдалося експортувати файл. Спробуйте ще раз.");
    } finally {
      setBusy(null);
    }
  }

  async function runAi() {
    setAiBusy(true);
    setAiError("");
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templateId: id, prompt: aiPrompt, current: data }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Помилка AI");
      setData((d) => ({ ...d, ...json.values }));
    } catch (e) {
      setAiError(e instanceof Error ? e.message : "Помилка AI");
    } finally {
      setAiBusy(false);
    }
  }

  return (
    <>
      <header className="topbar">
        <Link href="/"><BrandMark /></Link>
        <Link href="/" className="btn btn-sm btn-ghost" style={{ color: "#fff", borderColor: "#5C5E58" }}>← Усі шаблони</Link>
      </header>
      <div className="editor">
        <aside className="panel">
          <div className="eyebrow">{t.category}</div>
          <h2>{t.name}</h2>
          <p className="desc">{t.description}</p>

          <div className="ai">
            <div className="eyebrow">AI-помічник</div>
            <textarea
              className="textarea"
              placeholder={t.aiPlaceholder}
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
            />
            <div className="row" style={{ marginTop: 10 }}>
              <button className="btn btn-yellow" disabled={aiBusy || !aiPrompt.trim()} onClick={runAi}>
                {aiBusy ? "Пишу…" : "Заповнити з AI"}
              </button>
            </div>
            {aiError && <div className="err">{aiError}</div>}
          </div>

          {t.fields.map((f) => (
            <FieldInput key={f.key} f={f} value={data[f.key]} onChange={(v) => set(f.key, v)} />
          ))}

          <button className="btn btn-ghost btn-sm" onClick={() => setData(t.defaults)}>Скинути до прикладу</button>
        </aside>

        <section className="stage">
          <div className="stage-bar">
            <div className="eyebrow">Прев&apos;ю · {pages.length} {pages.length === 1 ? "сторінка" : pages.length < 5 ? "сторінки" : "сторінок"}</div>
            <div className="row">
              <button className="btn btn-dark" disabled={!!busy} onClick={() => runExport("png")}>{busy === "png" ? "…" : "PNG"}</button>
              <button className="btn btn-dark" disabled={!!busy} onClick={() => runExport("pdf")}>{busy === "pdf" ? "…" : "PDF"}</button>
              <button className="btn btn-dark" disabled={!!busy} onClick={() => runExport("pptx")}>{busy === "pptx" ? "…" : "PPTX"}</button>
            </div>
          </div>
          <div className="pages" ref={stageRef}>
            {pages.map((p, i) => (
              <div key={i}>
                {pages.length > 1 && <div className="page-label">{String(i + 1).padStart(2, "0")}</div>}
                <Scaled w={t.width} h={t.height} scale={scale} className="thumb-shadow" ref={(el) => { pageRefs.current[i] = el; }}>
                  {p}
                </Scaled>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

function Counter({ value, max }: { value: string; max?: number }) {
  if (!max) return null;
  return <span className={value.length > max ? "over" : ""}>{value.length}/{max}</span>;
}

function FieldInput({ f, value, onChange }: { f: Field; value: Data[string]; onChange: (v: string | Slide[]) => void }) {
  if (f.type === "slides") {
    return <SlidesEditor slides={(Array.isArray(value) ? value : []) as Slide[]} onChange={onChange} />;
  }
  const v = String(value ?? "");
  return (
    <div className="field">
      <label>{f.label}<Counter value={v} max={f.maxLength} /></label>
      {f.type === "select" ? (
        <select className="select" value={v} onChange={(e) => onChange(e.target.value)}>
          {f.options!.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      ) : f.type === "text" ? (
        <input className="input" value={v} placeholder={f.placeholder} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <textarea className="textarea" value={v} placeholder={f.placeholder} onChange={(e) => onChange(e.target.value)} />
      )}
      {f.hint && <div className="hint">{f.hint}</div>}
    </div>
  );
}

function SlidesEditor({ slides, onChange }: { slides: Slide[]; onChange: (s: Slide[]) => void }) {
  const upd = (i: number, patch: Partial<Slide>) => onChange(slides.map((s, k) => (k === i ? { ...s, ...patch } : s)));
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= slides.length) return;
    const next = [...slides];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  return (
    <div className="field">
      <label>Слайди<span>{slides.length}</span></label>
      {slides.map((s, i) => (
        <div className="slide-item" key={i}>
          <div className="head">
            <span className="num">{String(i + 1).padStart(2, "0")}</span>
            <select className="select" value={s.layout} onChange={(e) => upd(i, { layout: e.target.value as SlideLayout })}>
              {LAYOUTS.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
            </select>
            <button className="icon-btn" title="Вгору" onClick={() => move(i, -1)}>↑</button>
            <button className="icon-btn" title="Вниз" onClick={() => move(i, 1)}>↓</button>
            <button className="icon-btn" title="Видалити" onClick={() => onChange(slides.filter((_, k) => k !== i))}>×</button>
          </div>
          <input className="input" placeholder="Заголовок" value={s.title} onChange={(e) => upd(i, { title: e.target.value })} />
          <textarea className="textarea" placeholder={SLIDE_HINT[s.layout]} value={s.text} onChange={(e) => upd(i, { text: e.target.value })} />
        </div>
      ))}
      <button className="btn btn-ghost btn-sm" onClick={() => onChange([...slides, { layout: "bullets", title: "Новий слайд", text: "" }])}>
        + Додати слайд
      </button>
    </div>
  );
}
