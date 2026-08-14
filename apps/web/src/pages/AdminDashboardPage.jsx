import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getAllSections, upsertSection } from "@/api/content";
import {
  getServices,
  createService,
  updateService,
  deleteService,
} from "@/api/services";
import {
  getExperience,
  createExperience,
  updateExperience,
  deleteExperience,
} from "@/api/experience";

const TABS = ["Contenido", "Servicios", "Experiencia"];

export default function AdminDashboardPage() {
  const { signOut } = useAuth();
  const [tab, setTab] = useState("Contenido");

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="font-display font-semibold">Panel admin</span>
          <button
            onClick={signOut}
            className="font-mono text-xs uppercase tracking-wider border border-border rounded px-3 py-1.5 hover:border-primary hover:text-primary transition-colors focus-ring"
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <nav className="flex gap-2 mb-10 font-mono text-xs uppercase tracking-wider">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded border focus-ring ${
                tab === t
                  ? "border-primary text-primary"
                  : "border-border text-muted hover:text-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </nav>

        {tab === "Contenido" && <ContentEditor />}
        {tab === "Servicios" && <ServicesEditor />}
        {tab === "Experiencia" && <ExperienceEditor />}
      </div>
    </div>
  );
}

function SavedNote({ show }) {
  if (!show) return null;
  return <span className="font-mono text-xs text-primary">Guardado ✓</span>;
}

function ContentEditor() {
  const [hero, setHero] = useState({});
  const [about, setAbout] = useState({});
  const [contact, setContact] = useState({});
  const [savedKey, setSavedKey] = useState(null);

  useEffect(() => {
    getAllSections().then((s) => {
      setHero(s.hero || {});
      setAbout(s.about || { paragraphs: [], stats: [] });
      setContact(s.contact || {});
    });
  }, []);

  async function save(section, data) {
    await upsertSection(section, data);
    setSavedKey(section);
    setTimeout(() => setSavedKey(null), 2000);
  }

  return (
    <div className="space-y-14">
      {/* HERO */}
      <section className="card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-semibold text-lg">Hero</h2>
          <SavedNote show={savedKey === "hero"} />
        </div>
        <Field label="Estado (eyebrow)" value={hero.status} onChange={(v) => setHero({ ...hero, status: v })} />
        <Field label="Título" value={hero.title} onChange={(v) => setHero({ ...hero, title: v })} textarea />
        <Field label="Subtítulo" value={hero.subtitle} onChange={(v) => setHero({ ...hero, subtitle: v })} textarea />
        <div className="grid sm:grid-cols-2 gap-4">
          <Field
            label="Botón primario — texto"
            value={hero.primaryCta?.label}
            onChange={(v) => setHero({ ...hero, primaryCta: { ...hero.primaryCta, label: v } })}
          />
          <Field
            label="Botón primario — enlace"
            value={hero.primaryCta?.href}
            onChange={(v) => setHero({ ...hero, primaryCta: { ...hero.primaryCta, href: v } })}
          />
          <Field
            label="Botón secundario — texto"
            value={hero.secondaryCta?.label}
            onChange={(v) => setHero({ ...hero, secondaryCta: { ...hero.secondaryCta, label: v } })}
          />
          <Field
            label="Botón secundario — enlace"
            value={hero.secondaryCta?.href}
            onChange={(v) => setHero({ ...hero, secondaryCta: { ...hero.secondaryCta, href: v } })}
          />
        </div>
        <SaveButton onClick={() => save("hero", hero)} />
      </section>

      {/* ABOUT */}
      <section className="card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-semibold text-lg">Sobre mí</h2>
          <SavedNote show={savedKey === "about"} />
        </div>
        <Field
          label="Párrafos (uno por línea)"
          value={(about.paragraphs || []).join("\n")}
          onChange={(v) => setAbout({ ...about, paragraphs: v.split("\n").filter(Boolean) })}
          textarea
          rows={5}
        />
        <StatsEditor stats={about.stats || []} onChange={(stats) => setAbout({ ...about, stats })} />
        <SaveButton onClick={() => save("about", about)} />
      </section>

      {/* CONTACT */}
      <section className="card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-semibold text-lg">Contacto</h2>
          <SavedNote show={savedKey === "contact"} />
        </div>
        <Field label="Correo" value={contact.email} onChange={(v) => setContact({ ...contact, email: v })} />
        <Field
          label="WhatsApp (con código de país, solo números)"
          value={contact.whatsapp}
          onChange={(v) => setContact({ ...contact, whatsapp: v })}
        />
        <Field
          label="Mensaje predeterminado de WhatsApp"
          value={contact.whatsappMessage}
          onChange={(v) => setContact({ ...contact, whatsappMessage: v })}
        />
        <SaveButton onClick={() => save("contact", contact)} />
      </section>
    </div>
  );
}

function StatsEditor({ stats, onChange }) {
  function update(i, field, value) {
    const next = [...stats];
    next[i] = { ...next[i], [field]: value };
    onChange(next);
  }
  function add() {
    onChange([...stats, { value: "", label: "" }]);
  }
  function remove(i) {
    onChange(stats.filter((_, idx) => idx !== i));
  }

  return (
    <div className="space-y-2">
      <label className="font-mono text-xs uppercase tracking-wider text-muted">Métricas</label>
      {stats.map((s, i) => (
        <div key={i} className="flex gap-2">
          <input
            placeholder="Valor (ej. 100%)"
            value={s.value}
            onChange={(e) => update(i, "value", e.target.value)}
            className="w-1/3 bg-surface-2 border border-border rounded px-3 py-2 text-sm focus-ring"
          />
          <input
            placeholder="Etiqueta"
            value={s.label}
            onChange={(e) => update(i, "label", e.target.value)}
            className="flex-1 bg-surface-2 border border-border rounded px-3 py-2 text-sm focus-ring"
          />
          <button
            onClick={() => remove(i)}
            className="font-mono text-xs text-muted hover:text-red-400 px-2"
            type="button"
          >
            Quitar
          </button>
        </div>
      ))}
      <button
        onClick={add}
        type="button"
        className="font-mono text-xs uppercase tracking-wider text-accent hover:opacity-80"
      >
        + Agregar métrica
      </button>
    </div>
  );
}

function Field({ label, value, onChange, textarea, rows = 3 }) {
  const Comp = textarea ? "textarea" : "input";
  return (
    <div className="space-y-1">
      <label className="font-mono text-xs uppercase tracking-wider text-muted">{label}</label>
      <Comp
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        rows={textarea ? rows : undefined}
        className="w-full bg-surface-2 border border-border rounded px-3 py-2 text-sm focus-ring"
      />
    </div>
  );
}

function SaveButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      type="button"
      className="font-mono text-xs uppercase tracking-wider bg-primary text-primary-foreground rounded px-4 py-2 hover:opacity-90 transition-opacity focus-ring"
    >
      Guardar
    </button>
  );
}

function ServicesEditor() {
  const [items, setItems] = useState([]);
  const [draft, setDraft] = useState({ title: "", description: "", order_index: 0 });

  function refresh() {
    getServices().then(setItems);
  }
  useEffect(refresh, []);

  async function add() {
    if (!draft.title) return;
    await createService(draft);
    setDraft({ title: "", description: "", order_index: 0 });
    refresh();
  }
  async function remove(id) {
    await deleteService(id);
    refresh();
  }

  return (
    <div className="space-y-6">
      <div className="card p-6 space-y-3">
        <h2 className="font-display font-semibold text-lg">Nuevo servicio</h2>
        <Field label="Título" value={draft.title} onChange={(v) => setDraft({ ...draft, title: v })} />
        <Field
          label="Descripción"
          value={draft.description}
          onChange={(v) => setDraft({ ...draft, description: v })}
          textarea
        />
        <Field
          label="Orden"
          value={draft.order_index}
          onChange={(v) => setDraft({ ...draft, order_index: Number(v) || 0 })}
        />
        <SaveButton onClick={add} />
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="card p-4 flex items-start justify-between gap-4">
            <div>
              <div className="font-mono text-xs text-accent">#{item.order_index}</div>
              <h3 className="font-display font-semibold">{item.title}</h3>
              <p className="text-sm text-muted">{item.description}</p>
            </div>
            <button
              onClick={() => remove(item.id)}
              className="font-mono text-xs text-muted hover:text-red-400"
            >
              Eliminar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function ExperienceEditor() {
  const [items, setItems] = useState([]);
  const [draft, setDraft] = useState({ role: "", company: "", period: "", description: "", order_index: 0 });

  function refresh() {
    getExperience().then(setItems);
  }
  useEffect(refresh, []);

  async function add() {
    if (!draft.role) return;
    await createExperience(draft);
    setDraft({ role: "", company: "", period: "", description: "", order_index: 0 });
    refresh();
  }
  async function remove(id) {
    await deleteExperience(id);
    refresh();
  }

  return (
    <div className="space-y-6">
      <div className="card p-6 space-y-3">
        <h2 className="font-display font-semibold text-lg">Nueva experiencia</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Cargo" value={draft.role} onChange={(v) => setDraft({ ...draft, role: v })} />
          <Field label="Empresa" value={draft.company} onChange={(v) => setDraft({ ...draft, company: v })} />
          <Field
            label="Periodo (ej. 2022 — Presente)"
            value={draft.period}
            onChange={(v) => setDraft({ ...draft, period: v })}
          />
          <Field
            label="Orden"
            value={draft.order_index}
            onChange={(v) => setDraft({ ...draft, order_index: Number(v) || 0 })}
          />
        </div>
        <Field
          label="Descripción"
          value={draft.description}
          onChange={(v) => setDraft({ ...draft, description: v })}
          textarea
        />
        <SaveButton onClick={add} />
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="card p-4 flex items-start justify-between gap-4">
            <div>
              <div className="font-mono text-xs text-accent">{item.period}</div>
              <h3 className="font-display font-semibold">
                {item.role} · {item.company}
              </h3>
              <p className="text-sm text-muted">{item.description}</p>
            </div>
            <button
              onClick={() => remove(item.id)}
              className="font-mono text-xs text-muted hover:text-red-400"
            >
              Eliminar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
