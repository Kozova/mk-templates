// MK Consulting brand tokens (source: mk-brand-design skill)
export const C = {
  yellow: "#F3FF00",
  ink: "#202220",
  graphite2: "#373935",
  paper: "#EDEEE9",
  white: "#FFFFFF",
  muted: "#5C5E58",
  hairline: "#D1D2CC",
};

export const FONT = "'e-Ukraine', var(--font-inter), Inter, Arial, sans-serif";
export const MONO = "var(--font-mono), 'JetBrains Mono', monospace";

export const logoSvg = (rect: string, letter: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="70" height="70" viewBox="0 0 70 70"><rect width="70" height="70" rx="10" fill="${rect}"/><path d="M55.1744 42.5789H56V47H53.5232C50.7288 47 49.1411 45.4842 49.1411 42.6421V36.9579H40.5675V47H35.6774V23H40.5675V32.6632H44.6956L50.5383 23H55.9365L49.6492 32.6632H54.0312V41.4421C54.0312 42.1368 54.4758 42.5789 55.1744 42.5789Z" fill="${letter}"/><path d="M42.0071 23V47H37.244V29.1263L30.5756 47H25.495L18.7631 28.9368V47H14V23H21.3034L28.0353 41.1895L34.8306 23H42.0071Z" fill="${letter}"/></svg>`;

export const logoDataUrl = (rect: string, letter: string) =>
  "data:image/svg+xml;base64," +
  (typeof window === "undefined"
    ? Buffer.from(logoSvg(rect, letter)).toString("base64")
    : btoa(logoSvg(rect, letter)));
