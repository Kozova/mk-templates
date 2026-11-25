import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { getTemplate } from "@/lib/templates";
import type { Field } from "@/lib/types";

export const maxDuration = 60;

const client = new Anthropic(); // reads ANTHROPIC_API_KEY

const SYSTEM = `Ти — копірайтер MK Consulting, консалтингової компанії, що працює з державним сектором і цифровою трансформацією в Україні.
Тон: впевнений, точний, сучасний, без канцеляриту і без емодзі. Пиши українською, якщо користувач не попросив іншою мовою.
Ти заповнюєш поля готового брендового шаблону. Дизайн змінювати не можна — лише текст у полях.
Суворо дотримуйся лімітів довжини: текст має влазити в макет. Коротше — краще.
Не вигадуй контактних даних (телефонів, email, імен): якщо їх не дали, залиш поточне значення поля.`;

function fieldSchema(f: Field): Record<string, unknown> {
  const desc = `${f.label}${f.maxLength ? `. Максимум ${f.maxLength} символів` : ""}${f.hint ? `. ${f.hint}` : ""}`;
  if (f.type === "select") {
    return { type: "string", enum: f.options!.map((o) => o.value), description: desc };
  }
  if (f.type === "lines") {
    return { type: "string", description: `${desc}. Кожен пункт з нового рядка (\\n).` };
  }
  if (f.type === "slides") {
    return {
      type: "array",
      description: "Слайди презентації, 3–12 штук",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["layout", "title", "text"],
        properties: {
          layout: { type: "string", enum: ["section", "bullets", "statement", "stats"] },
          title: { type: "string", description: "Заголовок слайда, до 60 символів" },
          text: { type: "string", description: "Для bullets — пункти з нового рядка; для stats — рядки «число — підпис»; для section/statement — підзаголовок або порожньо" },
        },
      },
    };
  }
  return { type: "string", description: desc };
}

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "AI ще не налаштовано: додайте ANTHROPIC_API_KEY у налаштуваннях Vercel." }, { status: 503 });
  }
  const { templateId, prompt, current } = (await req.json()) as { templateId: string; prompt: string; current: unknown };
  const t = getTemplate(templateId);
  if (!t || typeof prompt !== "string" || !prompt.trim() || prompt.length > 4000) {
    return NextResponse.json({ error: "Некоректний запит" }, { status: 400 });
  }

  const schema = {
    type: "object",
    additionalProperties: false,
    required: t.fields.map((f) => f.key),
    properties: Object.fromEntries(t.fields.map((f) => [f.key, fieldSchema(f)])),
  };

  try {
    const response = await client.beta.messages.create({
      model: "claude-opus-5-5",
      max_tokens: 8000,
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      output_config: { effort: "low", format: { type: "json_schema", schema } },
      system: SYSTEM,
      messages: [
        {
          role: "user",
          content: `Шаблон: ${t.name}. ${t.aiBrief}\n\nПоточні значення полів:\n${JSON.stringify(current, null, 2)}\n\nЗапит користувача:\n${prompt}\n\nПоверни нові значення для всіх полів.`,
        },
      ],
    });

    if (response.stop_reason === "refusal") {
      return NextResponse.json({ error: "AI не може виконати цей запит. Спробуйте сформулювати інакше." }, { status: 422 });
    }
    const text = response.content.find((b) => b.type === "text");
    if (!text || text.type !== "text") throw new Error("Empty response");
    return NextResponse.json({ values: JSON.parse(text.text) });
  } catch (err) {
    if (err instanceof Anthropic.RateLimitError) {
      return NextResponse.json({ error: "Забагато запитів до AI, спробуйте за хвилину." }, { status: 429 });
    }
    if (err instanceof Anthropic.APIError) {
      console.error("Anthropic API error", err.status, err.message);
      return NextResponse.json({ error: "AI тимчасово недоступний." }, { status: 502 });
    }
    console.error(err);
    return NextResponse.json({ error: "Не вдалося обробити відповідь AI." }, { status: 500 });
  }
}
