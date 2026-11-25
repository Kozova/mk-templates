import { C } from "./brand";
import { Eyebrow, Logo, Page, Wordmark, body, headline, lines, mono } from "./parts";
import type { Data, Slide, Template } from "./types";

const s = (d: Data, k: string) => String(d[k] ?? "");

const themeField = {
  key: "theme",
  label: "Варіант кольору",
  type: "select" as const,
  options: [
    { value: "primary", label: "Жовтий фон" },
    { value: "inverse", label: "Графітовий фон" },
  ],
};

/* ───────────── Візитівка 90×50 мм ───────────── */
const businessCard: Template = {
  id: "business-card",
  name: "Візитівка",
  category: "Друк",
  description: "90×50 мм, дві сторони. PDF для друку з точним розміром.",
  width: 1063,
  height: 591,
  printMm: { w: 90, h: 50 },
  exportScale: 1,
  fields: [
    { key: "name", label: "Ім'я та прізвище", type: "text", maxLength: 32, placeholder: "Олена Коваленко" },
    { key: "position", label: "Посада", type: "text", maxLength: 48 },
    { key: "phone", label: "Телефон", type: "text", maxLength: 24 },
    { key: "email", label: "Email", type: "text", maxLength: 40 },
    { key: "website", label: "Сайт", type: "text", maxLength: 32 },
  ],
  defaults: {
    name: "Олена Коваленко",
    position: "Проєктна менеджерка",
    phone: "+380 67 000 00 00",
    email: "olena@consulting.mk",
    website: "consulting.mk",
  },
  aiBrief: "Візитівка співробітника. Ім'я коротко, посада до 4 слів.",
  aiPlaceholder: "Напр.: Іван Петренко, аналітик даних, +380 50 123 45 67, ivan@consulting.mk",
  render: (d) => [
    <Page key="front" w={1063} h={591} bg={C.paper} style={{ padding: 72 }}>
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 14, background: C.yellow }} />
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <Logo size={64} />
        <Wordmark size={22} color={C.ink} />
      </div>
      <div style={{ position: "absolute", left: 72, right: 72, top: 210 }}>
        <h1 style={headline(64, C.ink)}>{s(d, "name")}</h1>
        <p style={{ ...body(28, C.muted), marginTop: 16 }}>{s(d, "position")}</p>
      </div>
      <div style={{ position: "absolute", left: 72, right: 72, bottom: 64, display: "flex", flexDirection: "column", gap: 8 }}>
        {[s(d, "phone"), s(d, "email")].filter(Boolean).map((t) => (
          <span key={t} style={mono(24, C.ink)}>{t}</span>
        ))}
      </div>
    </Page>,
    <Page key="back" w={1063} h={591} bg={C.yellow}>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 28 }}>
        <Logo size={150} inverse />
        <Wordmark size={30} color={C.ink} />
      </div>
      <div style={{ position: "absolute", bottom: 48, width: "100%", textAlign: "center", ...mono(22, C.ink) }}>{s(d, "website")}</div>
    </Page>,
  ],
};

/* ───────────── Флаєр A5 ───────────── */
const flyer: Template = {
  id: "flyer-a5",
  name: "Флаєр A5",
  category: "Друк",
  description: "148×210 мм для події, вебінару чи анонсу. PDF 300 dpi.",
  width: 874,
  height: 1240,
  printMm: { w: 148, h: 210 },
  exportScale: 2,
  fields: [
    themeField,
    { key: "eyebrow", label: "Надзаголовок", type: "text", maxLength: 32, placeholder: "ВЕБІНАР" },
    { key: "title", label: "Заголовок", type: "textarea", maxLength: 70 },
    { key: "description", label: "Опис", type: "textarea", maxLength: 220 },
    { key: "date", label: "Дата і час", type: "text", maxLength: 32 },
    { key: "place", label: "Місце / формат", type: "text", maxLength: 40 },
    { key: "cta", label: "Заклик до дії", type: "text", maxLength: 28 },
    { key: "url", label: "Посилання", type: "text", maxLength: 40 },
  ],
  defaults: {
    theme: "primary",
    eyebrow: "Вебінар",
    title: "Цифрові послуги для громад",
    description: "Розповімо, як за 3 місяці перевести ключові послуги громади в онлайн і не загубитися в закупівлях.",
    date: "12 грудня, 15:00",
    place: "Онлайн, Zoom",
    cta: "Зареєструватися",
    url: "consulting.mk/webinar",
  },
  aiBrief: "Флаєр A5 для події. Заголовок до 6 слів, опис 1–2 речення.",
  aiPlaceholder: "Напр.: анонс вебінару про відкриті дані 12 грудня о 15:00, онлайн",
  render: (d) => {
    const inv = s(d, "theme") === "inverse";
    const bg = inv ? C.ink : C.yellow;
    const fg = inv ? C.white : C.ink;
    return [
      <Page key="p" w={874} h={1240} bg={bg} style={{ padding: 72 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Logo size={56} inverse={!inv} />
            <Wordmark size={20} color={fg} />
          </div>
        </div>
        <div style={{ marginTop: 170 }}>
          <Eyebrow size={22} color={inv ? C.yellow : C.ink} tick={inv}>{s(d, "eyebrow")}</Eyebrow>
          <h1 style={{ ...headline(96, fg), marginTop: 32 }}>{s(d, "title")}</h1>
          <p style={{ ...body(28, inv ? "#C9CAC4" : C.graphite2), marginTop: 40, maxWidth: 640 }}>{s(d, "description")}</p>
        </div>
        <div style={{ position: "absolute", left: 72, right: 72, bottom: 72 }}>
          <div style={{ display: "flex", gap: 16, marginBottom: 40, flexWrap: "wrap" }}>
            {[s(d, "date"), s(d, "place")].filter(Boolean).map((t) => (
              <span key={t} style={{ ...mono(22, fg), border: `2px solid ${inv ? C.yellow : C.ink}`, borderRadius: 999, padding: "12px 24px" }}>{t}</span>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ background: inv ? C.yellow : C.ink, color: inv ? C.ink : C.yellow, fontWeight: 700, fontSize: 28, padding: "22px 36px", borderRadius: 14 }}>
              {s(d, "cta")} →
            </span>
            <span style={mono(20, fg)}>{s(d, "url")}</span>
          </div>
        </div>
      </Page>,
    ];
  },
};

/* ───────────── Пост 1080×1080 ───────────── */
const post: Template = {
  id: "social-post",
  name: "Пост для соцмереж",
  category: "Соцмережі",
  description: "1080×1080 для LinkedIn, Facebook, Instagram.",
  width: 1080,
  height: 1080,
  exportScale: 1,
  fields: [
    themeField,
    { key: "eyebrow", label: "Надзаголовок", type: "text", maxLength: 32 },
    { key: "title", label: "Заголовок", type: "textarea", maxLength: 60 },
    { key: "subtitle", label: "Підзаголовок", type: "textarea", maxLength: 120 },
  ],
  defaults: {
    theme: "inverse",
    eyebrow: "Кейс",
    title: "40 послуг онлайн за пів року",
    subtitle: "Як ми допомогли міській раді скоротити черги в ЦНАП удвічі",
  },
  aiBrief: "Квадратний пост. Заголовок до 7 слів, ударний; підзаголовок одне речення.",
  aiPlaceholder: "Напр.: пост про те, що ми запустили 40 е-послуг для Львівської громади",
  render: (d) => {
    const inv = s(d, "theme") === "inverse";
    const bg = inv ? C.ink : C.yellow;
    const fg = inv ? C.white : C.ink;
    return [
      <Page key="p" w={1080} h={1080} bg={bg} style={{ padding: 88 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <Logo size={64} inverse={!inv} />
          <Wordmark size={22} color={fg} />
        </div>
        <div style={{ position: "absolute", left: 88, right: 88, bottom: 170 }}>
          <Eyebrow size={24} color={inv ? C.yellow : C.ink} tick={inv}>{s(d, "eyebrow")}</Eyebrow>
          <h1 style={{ ...headline(108, fg), marginTop: 32 }}>{s(d, "title")}</h1>
          <p style={{ ...body(34, inv ? "#C9CAC4" : C.graphite2), marginTop: 36, maxWidth: 820 }}>{s(d, "subtitle")}</p>
        </div>
        <div style={{ position: "absolute", left: 88, bottom: 80, ...mono(22, fg) }}>consulting.mk</div>
      </Page>,
    ];
  },
};

/* ───────────── Вакансія 1080×1080 ───────────── */
const hiring: Template = {
  id: "hiring",
  name: "Вакансія",
  category: "Соцмережі",
  description: "«We are hiring» 1080×1080 з посадою та умовами.",
  width: 1080,
  height: 1080,
  exportScale: 1,
  fields: [
    { key: "eyebrow", label: "Надзаголовок", type: "text", maxLength: 24 },
    { key: "position", label: "Посада", type: "textarea", maxLength: 50 },
    { key: "tags", label: "Умови (кожна з нового рядка)", type: "lines", hint: "до 4 пунктів", maxLength: 80 },
    { key: "cta", label: "Заклик до дії", type: "text", maxLength: 28 },
  ],
  defaults: {
    eyebrow: "We are hiring",
    position: "Senior Product Designer",
    tags: "Remote\nFull-time\nКиїв",
    cta: "Відгукнутися",
  },
  aiBrief: "Пост про вакансію. Посада коротко, умови — 2–4 коротких теги.",
  aiPlaceholder: "Напр.: шукаємо бізнес-аналітика, гібрид, Київ",
  render: (d) => [
    <Page key="p" w={1080} h={1080} bg={C.ink} style={{ padding: 88 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <Logo size={64} />
        <Wordmark size={22} color={C.white} />
      </div>
      <div style={{ position: "absolute", left: 88, right: 88, top: 300 }}>
        <Eyebrow size={26} color={C.yellow}>{s(d, "eyebrow")}</Eyebrow>
        <h1 style={{ ...headline(112, C.white), marginTop: 36 }}>{s(d, "position")}</h1>
        <div style={{ display: "flex", gap: 16, marginTop: 48, flexWrap: "wrap" }}>
          {lines(d.tags).slice(0, 4).map((t) => (
            <span key={t} style={{ ...mono(24, C.white), border: `2px solid ${C.yellow}`, borderRadius: 999, padding: "12px 26px" }}>{t}</span>
          ))}
        </div>
      </div>
      <div style={{ position: "absolute", left: 88, right: 88, bottom: 88, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ background: C.yellow, color: C.ink, fontWeight: 700, fontSize: 30, padding: "24px 40px", borderRadius: 14 }}>{s(d, "cta")} →</span>
        <span style={mono(22, C.white)}>consulting.mk</span>
      </div>
    </Page>,
  ],
};

/* ───────────── Презентація 1280×720 ───────────── */
function SlideView({ sl, i, total, title }: { sl: Slide; i: number; total: number; title: string }) {
  const W = 1280, H = 720;
  const footer = (color: string) => (
    <div style={{ position: "absolute", left: 64, right: 64, bottom: 36, display: "flex", justifyContent: "space-between", ...mono(14, color) }}>
      <span>{title}</span>
      <span>{String(i + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</span>
    </div>
  );
  if (sl.layout === "section") {
    return (
      <Page w={W} h={H} bg={C.ink} style={{ padding: 64 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <Logo size={48} />
          <Wordmark size={16} color={C.white} />
        </div>
        <div style={{ position: "absolute", left: 64, right: 200, bottom: 120 }}>
          <h1 style={headline(80, C.white)}>{sl.title}</h1>
          {sl.text && <p style={{ ...body(26, "#C9CAC4"), marginTop: 28 }}>{sl.text}</p>}
        </div>
        {footer("#8A8C86")}
      </Page>
    );
  }
  if (sl.layout === "statement") {
    return (
      <Page w={W} h={H} bg={C.yellow} style={{ padding: 64 }}>
        <Logo size={48} inverse />
        <div style={{ position: "absolute", left: 64, right: 160, top: 200 }}>
          <h1 style={headline(68, C.ink)}>{sl.title}</h1>
          {sl.text && <p style={{ ...body(26, C.graphite2), marginTop: 28 }}>{sl.text}</p>}
        </div>
        {footer(C.ink)}
      </Page>
    );
  }
  const header = (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <h1 style={{ ...headline(44, C.ink), maxWidth: 900 }}>{sl.title}</h1>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <Wordmark size={14} color={C.ink} />
        <Logo size={40} />
      </div>
    </div>
  );
  if (sl.layout === "stats") {
    const items = lines(sl.text).slice(0, 4).map((l) => {
      const [num, ...rest] = l.split(/\s+[—–-]\s+/);
      return { num, label: rest.join(" — ") };
    });
    return (
      <Page w={W} h={H} bg={C.paper} style={{ padding: 64 }}>
        {header}
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.max(items.length, 1)}, 1fr)`, gap: 20, marginTop: 90 }}>
          {items.map((it, k) => (
            <div key={k} style={{ background: C.white, borderRadius: 16, padding: 32, minHeight: 260, borderTop: `6px solid ${C.yellow}` }}>
              <div style={headline(64, C.ink)}>{it.num}</div>
              <p style={{ ...body(20, C.muted), marginTop: 20 }}>{it.label}</p>
            </div>
          ))}
        </div>
        {footer(C.muted)}
      </Page>
    );
  }
  // bullets
  const items = lines(sl.text).slice(0, 5);
  return (
    <Page w={W} h={H} bg={C.paper} style={{ padding: 64 }}>
      {header}
      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 48 }}>
        {items.map((t, k) => (
          <div key={k} style={{ display: "flex", alignItems: "center", gap: 24, background: C.white, borderRadius: 14, padding: "20px 28px", borderLeft: `6px solid ${C.yellow}` }}>
            <span style={mono(18, C.muted)}>{String(k + 1).padStart(2, "0")}</span>
            <span style={{ ...body(24, C.ink), fontWeight: 500 }}>{t}</span>
          </div>
        ))}
      </div>
      {footer(C.muted)}
    </Page>
  );
}

const presentation: Template = {
  id: "presentation",
  name: "Презентація",
  category: "Презентації",
  description: "16:9, 1280×720. Обкладинка, списки, цифри, акценти. PPTX з текстом, що редагується.",
  width: 1280,
  height: 720,
  exportScale: 1.5,
  fields: [
    { key: "title", label: "Назва презентації (у футері)", type: "text", maxLength: 60 },
    { key: "slides", label: "Слайди", type: "slides" },
  ],
  defaults: {
    title: "MK Consulting · Стратегія цифровізації",
    slides: [
      { layout: "section", title: "Стратегія цифровізації громади", text: "Пропозиція для міської ради · 2026" },
      { layout: "bullets", title: "Що ми пропонуємо", text: "Аудит наявних послуг\nДорожня карта на 12 місяців\nЗапуск 10 пріоритетних е-послуг\nНавчання команди ЦНАП" },
      { layout: "stats", title: "Результати попередніх проєктів", text: "40+ — е-послуг запущено\n2× — коротші черги в ЦНАП\n12 — громад-партнерів" },
      { layout: "statement", title: "Перші результати — вже за 90 днів", text: "" },
    ],
  },
  aiBrief:
    "Презентація. Макети слайдів: section (обкладинка/розділ: заголовок + підзаголовок), bullets (заголовок + 3–5 пунктів, кожен з нового рядка, до 8 слів), stats (заголовок + 2–4 рядки формату «число — підпис»), statement (одна сильна теза). Перший слайд — section.",
  aiPlaceholder: "Напр.: презентація на 6 слайдів про наш підхід до цифровізації ЦНАП для міської ради",
  render: (d) => {
    const slides = (Array.isArray(d.slides) ? d.slides : []) as Slide[];
    return slides.map((sl, i) => <SlideView key={i} sl={sl} i={i} total={slides.length} title={s(d, "title")} />);
  },
};

export const TEMPLATES: Template[] = [presentation, post, hiring, flyer, businessCard];

export const getTemplate = (id: string) => TEMPLATES.find((t) => t.id === id);
