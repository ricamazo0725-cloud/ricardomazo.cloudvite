/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.supabase.co" },
      { protocol: "https", hostname: "apod.nasa.gov" },
      { protocol: "https", hostname: "**.nasa.gov" },
    ],
  },
  async headers() {
    // Migrado desde apps/web/public/.htaccess -- ese archivo solo aplica en
    // hosting tipo Apache, no en un servidor Node.js, así que estos mismos
    // encabezados de seguridad se replican aquí para no perderlos.
    const securityHeaders = [
      { key: "X-Frame-Options", value: "SAMEORIGIN" },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      {
        key: "Strict-Transport-Security",
        value: "max-age=63072000; includeSubDomains; preload",
      },
      { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
      {
        key: "Permissions-Policy",
        value: "geolocation=(), microphone=(), camera=()",
      },
      {
        key: "Content-Security-Policy",
        value:
          "default-src 'self'; script-src 'self' 'unsafe-inline' https://maps.googleapis.com https://maps.gstatic.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://*.supabase.co https://*.supabase.in https://maps.googleapis.com https://api.nasa.gov; frame-ancestors 'self'; object-src 'none'; base-uri 'self'",
      },
    ];

    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
