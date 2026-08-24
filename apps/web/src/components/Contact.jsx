import { useLanguage } from "@/hooks/useLanguage";

export default function Contact({ data }) {
  const { t, pick } = useLanguage();
  const whatsappMessage = pick(data?.whatsappMessage);
  const whatsappHref = data?.whatsapp
    ? `https://wa.me/${data.whatsapp.replace(/\D/g, "")}${
        whatsappMessage ? `?text=${encodeURIComponent(whatsappMessage)}` : ""
      }`
    : null;

  return (
    <section id="contact" className="max-w-6xl mx-auto px-6 py-20 border-t border-border">
      <span className="status-chip mb-6">{t("contact.eyebrow")}</span>
      <h2 className="font-display font-semibold text-3xl sm:text-4xl tracking-tight mb-10 max-w-xl">
        {t("contact.heading")}
      </h2>

      {!data ? (
        <p className="text-muted font-mono text-sm">{t("contact.empty")}</p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-6 max-w-2xl">
          {data.email && (
            <div className="card p-6">
              <div className="font-mono text-xs uppercase tracking-wider text-muted mb-2">
                {t("contact.email")}
              </div>
              <a
                href={`mailto:${data.email}`}
                className="font-display text-lg hover:text-primary transition-colors focus-ring rounded"
              >
                {data.email}
              </a>
            </div>
          )}
          {whatsappHref && (
            <div className="card p-6">
              <div className="font-mono text-xs uppercase tracking-wider text-muted mb-2">
                {t("contact.whatsapp")}
              </div>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="font-display text-lg hover:text-primary transition-colors focus-ring rounded"
              >
                {data.whatsapp}
              </a>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
