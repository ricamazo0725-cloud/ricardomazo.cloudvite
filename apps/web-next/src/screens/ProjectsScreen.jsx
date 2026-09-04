"use client";

// src/pages/LandingExamplesPage.jsx
// (nombre de archivo historico -- el componente ahora es la pagina general
// de Proyectos, con el stack real de cada trabajo. Lee de Supabase, tabla
// project_items, editable desde /admin -> Proyectos.)
import { useEffect, useState } from "react";
import Link from "next/link";
import Layout from "@/components/Layout";
import { useLanguage } from "@/hooks/useLanguage";
import { getProjects } from "@/api/projects";

export default function ProjectsPage({ initialItems, initialError }) {
  const { t, pick } = useLanguage();
  const [items, setItems] = useState(initialItems ?? null);
  const [error, setError] = useState(initialError ?? null);

  useEffect(() => {
    // Ya llega renderizado desde el servidor (ver app/proyectos/page.js);
    // solo se vuelve a pedir si por algún motivo no llegó nada por props.
    if (initialItems) return;
    getProjects().then(setItems).catch((err) => setError(err.message));
  }, [initialItems]);

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-6 pt-24 pb-4">
        <Link
          href="/"
          className="font-mono text-xs uppercase tracking-wider text-muted hover:text-foreground"
        >
          {"\u2190"} Volver al inicio
        </Link>
      </div>

      <section className="max-w-6xl mx-auto px-6 py-12">
        <span className="status-chip mb-6">{t("projects.eyebrow")}</span>
        <h1 className="font-display font-semibold text-3xl sm:text-4xl tracking-tight mb-4 max-w-xl">
          {t("projects.heading")}
        </h1>
        <p className="text-muted max-w-xl mb-12">{t("projects.intro")}</p>

        {error ? (
          <p className="text-sm text-red-400 font-mono">{error}</p>
        ) : items === null ? (
          <p className="text-muted font-mono text-sm">{t("projects.loading")}</p>
        ) : items.length === 0 ? (
          <p className="text-muted font-mono text-sm">{t("projects.empty")}</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item, i) => (
              <a
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="card relative p-6 sm:p-8 flex flex-col gap-3 hover:border-primary transition-colors"
                style={{ borderRadius: "1.25rem" }}
              >
                <div className="absolute top-6 right-8 font-mono text-xs text-muted tracking-wider">
                  {String(item.order_index ?? i).padStart(2, "0")}
                </div>
                <span className="font-mono text-xs uppercase tracking-wider text-accent">
                  {item.tag}
                </span>
                <h3 className="font-display font-semibold text-xl">{pick(item.title)}</h3>
                <p className="text-sm text-muted leading-relaxed">{pick(item.description)}</p>
                <span className="font-mono text-xs uppercase tracking-wider text-primary mt-auto">
                  {t("projects.cta")}
                </span>
              </a>
            ))}
          </div>
        )}
      </section>
    </Layout>
  );
}
