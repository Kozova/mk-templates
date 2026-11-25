import { C, logoDataUrl } from "@/lib/brand";

export function BrandMark() {
  return (
    <span className="brand">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={logoDataUrl(C.yellow, C.graphite2)} width={32} height={32} alt="" />
      MK CONSULTING <b>/ ШАБЛОНИ</b>
    </span>
  );
}
