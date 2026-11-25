import Link from "next/link";
import { BrandMark } from "@/components/Logo";
import { Thumb } from "@/components/Thumb";
import { TEMPLATES } from "@/lib/templates";

export default function Home() {
  const cats = [...new Set(TEMPLATES.map((t) => t.category))];
  return (
    <>
      <header className="topbar">
        <Link href="/"><BrandMark /></Link>
      </header>
      <main className="container">
        <div className="eyebrow">Брендові шаблони</div>
        <h1 className="page-title">Що створимо сьогодні?</h1>
        <p className="lead">
          Оберіть шаблон, впишіть свій текст або попросіть AI написати його, і завантажте готовий файл у PNG, PDF чи PPTX.
          Бренд MK уже вбудований, тож усе виходить у фірмовому стилі.
        </p>
        {cats.map((c) => (
          <section key={c}>
            <div className="eyebrow section-label">{c}</div>
            <div className="grid">
              {TEMPLATES.filter((t) => t.category === c).map((t) => (
                <Link key={t.id} href={`/t/${t.id}`} className="card">
                  <div className="thumb"><Thumb id={t.id} /></div>
                  <div className="meta">
                    <h3>{t.name}</h3>
                    <p>{t.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </main>
    </>
  );
}
