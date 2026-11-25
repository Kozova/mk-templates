import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin", "cyrillic"], weight: ["300", "400", "500", "700"], variable: "--font-inter" });
const mono = JetBrains_Mono({ subsets: ["latin", "cyrillic"], weight: ["400", "500"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "MK Шаблони",
  description: "Брендові шаблони MK Consulting: презентації, пости, флаєри, візитівки",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk" className={`${inter.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
