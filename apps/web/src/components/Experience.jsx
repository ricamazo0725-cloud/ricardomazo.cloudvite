export default function Experience({ items }) {
  return (
    <section id="experience" className="max-w-6xl mx-auto px-6 py-20 border-t border-border">
      <span className="status-chip mb-6">Experiencia laboral</span>

      {items.length === 0 ? (
        <p className="text-muted font-mono text-sm">
          Todavía no hay experiencia cargada. Agrégala desde el panel admin.
        </p>
      ) : (
        <ol className="relative border-l border-border ml-2">
          {items.map((item) => (
            <li key={item.id} className="pl-8 pb-12 last:pb-0 relative">
              <span className="absolute -left-[7px] top-1 w-3 h-3 rounded-full bg-primary" />
              <div className="font-mono text-xs uppercase tracking-wider text-accent mb-1">
                {item.period}
              </div>
              <h3 className="font-display font-semibold text-xl">{item.role}</h3>
              <div className="text-sm text-muted mb-2">{item.company}</div>
              {item.description && (
                <p className="text-sm leading-relaxed text-foreground/80 max-w-2xl">
                  {item.description}
                </p>
              )}
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
