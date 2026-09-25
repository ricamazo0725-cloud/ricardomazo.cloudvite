import PrivacyScreen from "@/screens/PrivacyScreen";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ricardomazo.cloud";

export const metadata = {
  title: "Política de privacidad",
  description:
    "Política de privacidad y tratamiento de datos personales de Ricardo Mazo (Ley 1581 de 2012), incluido el uso de WhatsApp.",
  alternates: {
    canonical: "/privacidad",
    languages: {
      es: `${siteUrl}/privacidad`,
      en: `${siteUrl}/en/privacidad`,
      "x-default": `${siteUrl}/privacidad`,
    },
  },
};

export default function Page() {
  return <PrivacyScreen />;
}
