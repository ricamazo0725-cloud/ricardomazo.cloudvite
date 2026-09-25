import PrivacyScreen from "@/screens/PrivacyScreen";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ricardomazo.cloud";

export const metadata = {
  title: "Privacy policy",
  description: "Privacy and personal data policy of Ricardo Mazo, including the use of WhatsApp.",
  alternates: {
    canonical: `${siteUrl}/en/privacidad`,
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
