import { Link } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";

// "/blog" -> ruta interna (navegación SPA con react-router).
// "https://..." o "#..." -> se deja como <a> normal.
function isInternalPath(href) {
  return typeof href === "string" && href.startsWith("/") && !href.startsWith("//");
}

export default function Services({ items }) {
  const { t, pick } = useLanguage();

  return (
    <section id="services" className="max-w-6xl mx-auto px-6 py-20 border-t border-border">
      <span className="status-chip mb-6">{t("services.eyebrow")}</span>
      <h2 className="font-display font-semibold text-3xl sm:text-4xl tracking-tight mb-12 max-w-xl">
        {t("services.heading")}
      </h2>

      {items.length === 0 ? (
        <p className="text-muted font-mono text-sm">{t("services.empty")}</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => {
            const href = item.link?.href;
            const linkLabel = pick(item.link?.label);
            const cardClass =
              "card relative p-6 sm:p-8 flex flex-col gap-3" +
              (href ? " hover:border-primary transition-colors" : "");
            const cardStyle = { borderRadius: "1.25rem" };

            const cardBody = (
              <>
                <div className="absolute top-6 right-8 font-mono text-xs text-muted tracking-wider">
                  {String(item.order_index ?? 0).padStart(2, "0")}
                </div>
                <h3 className="font-display font-semibold text-xl">{pick(item.title)}</h3>
                <p className="text-sm text-muted leading-relaxed">{pick(item.description)}</p>
                {href && linkLabel && (
                  <span className="font-mono text-xs uppercase tracking-wider text-primary mt-auto">
                    {linkLabel}
                  </span>
                )}
              </>
            );

            if (!href) {
              return (
                <div key={item.id} className={cardClass} style={cardStyle}>
                  {cardBody}
                </div>
              );
            }

            return isInternalPath(href) ? (
              <Link key={item.id} to={href} className={cardClass} style={cardStyle}>
                {cardBody}
              </Link>
            ) : (
              <a key={item.id} href={href} className={cardClass} style={cardStyle}>
                {cardBody}
              </a>
            );
          })}
        </div>
      )}
    </section>
  );
}
