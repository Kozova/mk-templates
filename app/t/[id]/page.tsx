import { notFound } from "next/navigation";
import { Editor } from "@/components/Editor";
import { TEMPLATES, getTemplate } from "@/lib/templates";

export function generateStaticParams() {
  return TEMPLATES.map((t) => ({ id: t.id }));
}

export default async function TemplatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!getTemplate(id)) notFound();
  return <Editor id={id} />;
}
