import { useLanguage } from "@/hooks/useLanguage";

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
          {items.map((item) => (
            <div key={item.id} className="card p-6 flex flex-col gap-3">
              <div className="font-mono text-xs text-accent tracking-wider">SRV/{String(item.order_index ?? 0).padStart(2, "0")}</div>
              <h3 className="font-display font-semibold text-lg">{pick(item.title)}</h3>
              <p className="text-sm text-muted leading-relaxed">{pick(item.description)}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
