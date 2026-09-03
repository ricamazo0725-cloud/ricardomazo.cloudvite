const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ricardomazo.cloud";

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
