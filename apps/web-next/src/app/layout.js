import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import Providers from "@/components/Providers";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ricardomazo.cloud";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Ricardo Mazo | Digital Strategist & Solutions Developer",
    template: "%s | Ricardo Mazo",
  },
  description:
    "Ricardo Mazo — Estrategia Digital, Agentes de IA y Automatización. Panel de control de un especialista en integrar sistemas.",
  alternates: { canonical: siteUrl },
  openGraph: {
    type: "website",
    siteName: "Ricardo Mazo",
    title: "Ricardo Mazo | Digital Strategist & Solutions Developer",
    description:
      "Ricardo Mazo — Estrategia Digital, Agentes de IA y Automatización. Panel de control de un especialista en integrar sistemas.",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "Ricardo Mazo | Digital Strategist & Solutions Developer",
    description:
      "Ricardo Mazo — Estrategia Digital, Agentes de IA y Automatización.",
  },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Ricardo Mazo",
  url: siteUrl,
  jobTitle: "Digital Strategist & Solutions Developer",
  description:
    "Estrategia digital, agentes de IA y automatización de procesos para empresas.",
  sameAs: [],
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="es"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetBrainsMono.variable}`}
    >
      <body>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
