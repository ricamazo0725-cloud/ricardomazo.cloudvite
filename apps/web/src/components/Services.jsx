export default function Services({ items }) {
  return (
    <section id="services" className="max-w-6xl mx-auto px-6 py-20 border-t border-border">
      <span className="status-chip mb-6">Servicios</span>
      <h2 className="font-display font-semibold text-3xl sm:text-4xl tracking-tight mb-12 max-w-xl">
        Soluciones a medida para transformar tus operaciones.
      </h2>

      {items.length === 0 ? (
        <p className="text-muted font-mono text-sm">
          Todavía no hay servicios cargados. Agrégalos desde el panel admin.
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div key={item.id} className="card p-6 flex flex-col gap-3">
              <div className="font-mono text-xs text-accent tracking-wider">SRV/{String(item.order_index ?? 0).padStart(2, "0")}</div>
              <h3 className="font-display font-semibold text-lg">{item.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
