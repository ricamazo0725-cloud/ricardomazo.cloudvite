"use client";

// src/pages/BlogPage.jsx
import Link from "next/link";
import Layout from "@/components/Layout";
import AutomationShowcase from "@/components/AutomationShowcase";
import Blog from "@/components/Blog";
import { useLanguage } from "@/hooks/useLanguage";

export default function BlogPage({ initialPosts }) {
    const { t } = useLanguage();

    return (
        <Layout>
            <div className="max-w-6xl mx-auto px-6 pt-24 pb-4">
                <Link href="/" className="font-mono text-xs uppercase tracking-wider text-muted hover:text-foreground">
                    ← Volver al inicio
                </Link>
                <h1 className="font-display font-semibold text-3xl sm:text-4xl tracking-tight mt-6">
                    {t("blog.heading")}
                </h1>
            </div>
            <AutomationShowcase />
            <Blog initialPosts={initialPosts} />
        </Layout>
    );
}
