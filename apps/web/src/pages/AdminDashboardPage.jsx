import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
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

export default function AdminDashboardPage() {
  const { signOut } = useAuth();
  const { t, locales } = useLanguage();
  const TABS = [t("admin.tabs.content"), t("admin.tabs.services"), t("admin.tabs.experience")];
  const [tab, setTab] = useState(TABS[0]);
  // Idioma que se está editando en los campos bilingües del panel (independiente
  // del idioma en que el propio admin ve su interfaz).
  const [editLang, setEditLang] = useState(locales[0]);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="font-display font-semibold">{t("admin.title")}</span>
          <div className="flex items-center gap-3">
            <EditLangSwitch value={editLang} onChange={setEditLang} locales={locales} />
            <button
              onClick={signOut}
              className="font-mono text-xs uppercase tracking-wider border border-border rounded px-3 py-1.5 hover:border-primary hover:text-primary transition-colors focus-ring"
            >
              {t("admin.signOut")}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <nav className="flex gap-2 mb-10 font-mono text-xs uppercase tracking-wider">
          {TABS.map((tb) => (
            <button
              key={tb}
              onClick={() => setTab(tb)}
              className={`px-4 py-2 rounded border focus-ring ${
                tab === tb
                  ? "border-primary text-primary"
                  : "border-border text-muted hover:text-foreground"
              }`}
            >
              {tb}
            </button>
          ))}
        </nav>

        {tab === TABS[0] && <ContentEditor editLang={editLang} />}
        {tab === TABS[1] && <ServicesEditor editLang={editLang} />}
        {tab === TABS[2] && <ExperienceEditor editLang={editLang} />}
      </div>
    </div>
  );
}

function EditLangSwitch({ value, onChange, locales }) {
  const { t } = useLanguage();
  return (
    <div className="flex items-center border border-border rounded overflow-hidden font-mono text-xs uppercase tracking-wider">
      {locales.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => onChange(l)}
          className={`px-3 py-1.5 transition-colors focus-ring ${
            value === l ? "bg-primary text-primary-foreground" : "text-muted hover:text-foreground"
          }`}
        >
          {t(`admin.langTab.${l}`)}
        </button>
      ))}
    </div>
  );
}

function SavedNote({ show }) {
  const { t } = useLanguage();
  if (!show) return null;
  return <span className="font-mono text-xs text-primary">{t("admin.saved")}</span>;
}

// Lee/escribe el valor de un campo bilingüe { es: "...", en: "..." }.
// Si el dato aún es un string plano (contenido viejo sin migrar), lo trata
// como si fuera el valor del idioma por defecto (es) y lo convierte a objeto
// en cuanto el admin lo edita.
function readBilingual(value, editLang, fallbackLang = "es") {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value[editLang] ?? "";
  }
  return editLang === fallbackLang ? value ?? "" : "";
}

function writeBilingual(value, editLang, newText, fallbackLang = "es") {
  const base =
    value && typeof value === "object" && !Array.isArray(value)
      ? value
      : { [fallbackLang]: value ?? "" };
  return { ...base, [editLang]: newText };
}

function readBilingualArray(value, editLang, fallbackLang = "es") {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value[editLang] ?? [];
  }
  return editLang === fallbackLang ? value ?? [] : [];
}

function writeBilingualArray(value, editLang, newArray, fallbackLang = "es") {
  const base =
    value && typeof value === "object" && !Array.isArray(value)
      ? value
      : { [fallbackLang]: value ?? [] };
  return { ...base, [editLang]: newArray };
}

function ContentEditor({ editLang }) {
  const { t } = useLanguage();
  const [hero, setHero] = useState({});
  const [about, setAbout] = useState({});
  const [contact, setContact] = useState({});
  const [savedKey, setSavedKey] = useState(null);

  useEffect(() => {
    getAllSections().then((s) => {
      setHero(s.hero || {});
      setAbout(s.about || { paragraphs: {}, stats: [] });
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
          <h2 className="font-display font-semibold text-lg">{t("admin.hero.title")}</h2>
          <SavedNote show={savedKey === "hero"} />
        </div>
        <BilingualField
          label={t("admin.hero.status")}
          value={hero.status}
          editLang={editLang}
          onChange={(v) => setHero({ ...hero, status: v })}
        />
        <BilingualField
          label={t("admin.hero.heroTitle")}
          value={hero.title}
          editLang={editLang}
          onChange={(v) => setHero({ ...hero, title: v })}
          textarea
        />
        <BilingualField
          label={t("admin.hero.subtitle")}
          value={hero.subtitle}
          editLang={editLang}
          onChange={(v) => setHero({ ...hero, subtitle: v })}
          textarea
        />
        <div className="grid sm:grid-cols-2 gap-4">
          <BilingualField
            label={t("admin.hero.primaryLabel")}
            value={hero.primaryCta?.label}
            editLang={editLang}
            onChange={(v) => setHero({ ...hero, primaryCta: { ...hero.primaryCta, label: v } })}
          />
          <Field
            label={t("admin.hero.primaryHref")}
            value={hero.primaryCta?.href}
            onChange={(v) => setHero({ ...hero, primaryCta: { ...hero.primaryCta, href: v } })}
          />
          <BilingualField
            label={t("admin.hero.secondaryLabel")}
            value={hero.secondaryCta?.label}
            editLang={editLang}
            onChange={(v) => setHero({ ...hero, secondaryCta: { ...hero.secondaryCta, label: v } })}
          />
          <Field
            label={t("admin.hero.secondaryHref")}
            value={hero.secondaryCta?.href}
            onChange={(v) => setHero({ ...hero, secondaryCta: { ...hero.secondaryCta, href: v } })}
          />
        </div>
        <SaveButton onClick={() => save("hero", hero)} />
      </section>

      {/* ABOUT */}
      <section className="card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-semibold text-lg">{t("admin.about.title")}</h2>
          <SavedNote show={savedKey === "about"} />
        </div>
        <BilingualParagraphsField
          label={t("admin.about.paragraphs")}
          value={about.paragraphs}
          editLang={editLang}
          onChange={(paragraphs) => setAbout({ ...about, paragraphs })}
        />
        <StatsEditor
          stats={about.stats || []}
          editLang={editLang}
          onChange={(stats) => setAbout({ ...about, stats })}
        />
        <SaveButton onClick={() => save("about", about)} />
      </section>

      {/* CONTACT */}
      <section className="card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-semibold text-lg">{t("admin.contact.title")}</h2>
          <SavedNote show={savedKey === "contact"} />
        </div>
        <Field label={t("admin.contact.email")} value={contact.email} onChange={(v) => setContact({ ...contact, email: v })} />
        <Field
          label={t("admin.contact.whatsapp")}
          value={contact.whatsapp}
          onChange={(v) => setContact({ ...contact, whatsapp: v })}
        />
        <BilingualField
          label={t("admin.contact.whatsappMessage")}
          value={contact.whatsappMessage}
          editLang={editLang}
          onChange={(v) => setContact({ ...contact, whatsappMessage: v })}
        />
        <SaveButton onClick={() => save("contact", contact)} />
      </section>
    </div>
  );
}

function StatsEditor({ stats, editLang, onChange }) {
  const { t } = useLanguage();
  function update(i, field, value) {
    const next = [...stats];
    next[i] = { ...next[i], [field]: value };
    onChange(next);
  }
  function add() {
    onChange([...stats, { value: "", label: {} }]);
  }
  function remove(i) {
    onChange(stats.filter((_, idx) => idx !== i));
  }

  return (
    <div className="space-y-2">
      <label className="font-mono text-xs uppercase tracking-wider text-muted">{t("admin.about.stats")}</label>
      {stats.map((s, i) => (
        <div key={i} className="flex gap-2">
          <input
            placeholder={t("admin.about.statValue")}
            value={s.value || ""}
            onChange={(e) => update(i, "value", e.target.value)}
            className="w-1/3 bg-surface-2 border border-border rounded px-3 py-2 text-sm focus-ring"
          />
          <input
            placeholder={t("admin.about.statLabel")}
            value={readBilingual(s.label, editLang)}
            onChange={(e) => update(i, "label", writeBilingual(s.label, editLang, e.target.value))}
            className="flex-1 bg-surface-2 border border-border rounded px-3 py-2 text-sm focus-ring"
          />
          <button
            onClick={() => remove(i)}
            className="font-mono text-xs text-muted hover:text-red-400 px-2"
            type="button"
          >
            {t("admin.remove")}
          </button>
        </div>
      ))}
      <button
        onClick={add}
        type="button"
        className="font-mono text-xs uppercase tracking-wider text-accent hover:opacity-80"
      >
        {t("admin.about.addStat")}
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

// Igual que Field, pero el valor guardado es { es: "...", en: "..." } y
// muestra/edita solo el idioma seleccionado (editLang) a la vez.
function BilingualField({ label, value, editLang, onChange, textarea, rows = 3 }) {
  return (
    <Field
      label={label}
      value={readBilingual(value, editLang)}
      onChange={(text) => onChange(writeBilingual(value, editLang, text))}
      textarea={textarea}
      rows={rows}
    />
  );
}

// Para arreglos bilingües (ej. párrafos): se edita como texto, una línea por
// elemento, guardando { es: [...], en: [...] }.
function BilingualParagraphsField({ label, value, editLang, onChange, rows = 5 }) {
  const current = readBilingualArray(value, editLang);
  return (
    <Field
      label={label}
      value={current.join("\n")}
      onChange={(text) => onChange(writeBilingualArray(value, editLang, text.split("\n").filter(Boolean)))}
      textarea
      rows={rows}
    />
  );
}

function SaveButton({ onClick }) {
  const { t } = useLanguage();
  return (
    <button
      onClick={onClick}
      type="button"
      className="font-mono text-xs uppercase tracking-wider bg-primary text-primary-foreground rounded px-4 py-2 hover:opacity-90 transition-opacity focus-ring"
    >
      {t("admin.save")}
    </button>
  );
}

// Enlace opcional de una tarjeta de servicio (ej. "Ver ejemplo en vivo" -> /blog).
// Mismo formato que hero.primaryCta/secondaryCta: { label: {es,en}, href: "..." }.
// Si href queda vacío al guardar, no se manda link (la tarjeta se ve sin enlace).
function cleanLink(link) {
  if (!link || !link.href) return null;
  return link;
}

function ServiceLinkFields({ link, editLang, onChange }) {
  const { t } = useLanguage();
  const current = link || { label: {}, href: "" };
  return (
    <div className="grid sm:grid-cols-2 gap-4 pt-2 border-t border-border">
      <BilingualField
        label={t("admin.servicesEditor.linkLabel")}
        value={current.label}
        editLang={editLang}
        onChange={(v) => onChange({ ...current, label: v })}
      />
      <Field
        label={t("admin.servicesEditor.linkHref")}
        value={current.href}
        onChange={(v) => onChange({ ...current, href: v })}
      />
    </div>
  );
}

function ServicesEditor({ editLang }) {
  const { t } = useLanguage();
  const [items, setItems] = useState([]);
  const [draft, setDraft] = useState({ title: {}, description: {}, order_index: 0, link: { label: {}, href: "" } });

  function refresh() {
    getServices().then(setItems);
  }
  useEffect(refresh, []);

  async function add() {
    if (!readBilingual(draft.title, editLang)) return;
    await createService({ ...draft, link: cleanLink(draft.link) });
    setDraft({ title: {}, description: {}, order_index: 0, link: { label: {}, href: "" } });
    refresh();
  }
  async function remove(id) {
    await deleteService(id);
    refresh();
  }
  async function saveItem(item) {
    await updateService(item.id, {
      title: item.title,
      description: item.description,
      order_index: item.order_index,
      link: cleanLink(item.link),
    });
    refresh();
  }

  return (
    <div className="space-y-6">
      <div className="card p-6 space-y-3">
        <h2 className="font-display font-semibold text-lg">{t("admin.servicesEditor.newTitle")}</h2>
        <BilingualField
          label={t("admin.servicesEditor.fieldTitle")}
          value={draft.title}
          editLang={editLang}
          onChange={(v) => setDraft({ ...draft, title: v })}
        />
        <BilingualField
          label={t("admin.servicesEditor.fieldDescription")}
          value={draft.description}
          editLang={editLang}
          onChange={(v) => setDraft({ ...draft, description: v })}
          textarea
        />
        <Field
          label={t("admin.servicesEditor.order")}
          value={draft.order_index}
          onChange={(v) => setDraft({ ...draft, order_index: Number(v) || 0 })}
        />
        <ServiceLinkFields
          link={draft.link}
          editLang={editLang}
          onChange={(link) => setDraft({ ...draft, link })}
        />
        <SaveButton onClick={add} />
      </div>

      <div className="space-y-3">
        {items.map((item, idx) => (
          <div key={item.id} className="card p-4 space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div className="font-mono text-xs text-accent">#{item.order_index}</div>
              <button
                onClick={() => remove(item.id)}
                className="font-mono text-xs text-muted hover:text-red-400"
              >
                {t("admin.delete")}
              </button>
            </div>
            <BilingualField
              label={t("admin.servicesEditor.fieldTitle")}
              value={item.title}
              editLang={editLang}
              onChange={(v) => {
                const next = [...items];
                next[idx] = { ...item, title: v };
                setItems(next);
              }}
            />
            <BilingualField
              label={t("admin.servicesEditor.fieldDescription")}
              value={item.description}
              editLang={editLang}
              onChange={(v) => {
                const next = [...items];
                next[idx] = { ...item, description: v };
                setItems(next);
              }}
              textarea
            />
            <ServiceLinkFields
              link={item.link || { label: {}, href: "" }}
              editLang={editLang}
              onChange={(link) => {
                const next = [...items];
                next[idx] = { ...item, link };
                setItems(next);
              }}
            />
            <SaveButton onClick={() => saveItem(items[idx])} />
          </div>
        ))}
      </div>
    </div>
  );
}

function ExperienceEditor({ editLang }) {
  const { t } = useLanguage();
  const [items, setItems] = useState([]);
  const [draft, setDraft] = useState({ role: {}, company: "", period: {}, description: {}, order_index: 0 });

  function refresh() {
    getExperience().then(setItems);
  }
  useEffect(refresh, []);

  async function add() {
    if (!readBilingual(draft.role, editLang)) return;
    await createExperience(draft);
    setDraft({ role: {}, company: "", period: {}, description: {}, order_index: 0 });
    refresh();
  }
  async function remove(id) {
    await deleteExperience(id);
    refresh();
  }
  async function saveItem(item) {
    await updateExperience(item.id, {
      role: item.role,
      company: item.company,
      period: item.period,
      description: item.description,
      order_index: item.order_index,
    });
    refresh();
  }

  return (
    <div className="space-y-6">
      <div className="card p-6 space-y-3">
        <h2 className="font-display font-semibold text-lg">{t("admin.experienceEditor.newTitle")}</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <BilingualField
            label={t("admin.experienceEditor.role")}
            value={draft.role}
            editLang={editLang}
            onChange={(v) => setDraft({ ...draft, role: v })}
          />
          <Field label={t("admin.experienceEditor.company")} value={draft.company} onChange={(v) => setDraft({ ...draft, company: v })} />
          <BilingualField
            label={t("admin.experienceEditor.period")}
            value={draft.period}
            editLang={editLang}
            onChange={(v) => setDraft({ ...draft, period: v })}
          />
          <Field
            label={t("admin.experienceEditor.order")}
            value={draft.order_index}
            onChange={(v) => setDraft({ ...draft, order_index: Number(v) || 0 })}
          />
        </div>
        <BilingualField
          label={t("admin.experienceEditor.description")}
          value={draft.description}
          editLang={editLang}
          onChange={(v) => setDraft({ ...draft, description: v })}
          textarea
        />
        <SaveButton onClick={add} />
      </div>

      <div className="space-y-3">
        {items.map((item, idx) => (
          <div key={item.id} className="card p-4 space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div className="font-mono text-xs text-accent">{readBilingual(item.period, editLang)}</div>
              <button
                onClick={() => remove(item.id)}
                className="font-mono text-xs text-muted hover:text-red-400"
              >
                {t("admin.delete")}
              </button>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <BilingualField
                label={t("admin.experienceEditor.role")}
                value={item.role}
                editLang={editLang}
                onChange={(v) => {
                  const next = [...items];
                  next[idx] = { ...item, role: v };
                  setItems(next);
                }}
              />
              <Field
                label={t("admin.experienceEditor.company")}
                value={item.company}
                onChange={(v) => {
                  const next = [...items];
                  next[idx] = { ...item, company: v };
                  setItems(next);
                }}
              />
              <BilingualField
                label={t("admin.experienceEditor.period")}
                value={item.period}
                editLang={editLang}
                onChange={(v) => {
                  const next = [...items];
                  next[idx] = { ...item, period: v };
                  setItems(next);
                }}
              />
            </div>
            <BilingualField
              label={t("admin.experienceEditor.description")}
              value={item.description}
              editLang={editLang}
              onChange={(v) => {
                const next = [...items];
                next[idx] = { ...item, description: v };
                setItems(next);
              }}
              textarea
            />
            <SaveButton onClick={() => saveItem(items[idx])} />
          </div>
        ))}
      </div>
    </div>
  );
}
