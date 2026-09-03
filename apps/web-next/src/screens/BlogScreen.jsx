"use client";

// src/pages/BlogPage.jsx
import Link from "next/link";
import Layout from "@/components/Layout";
import AutomationShowcase from "@/components/AutomationShowcase";
import Blog from "@/components/Blog";

export default function BlogPage() {
    return (
        <Layout>
            <div className="max-w-6xl mx-auto px-6 pt-24 pb-4">
                <Link href="/" className="font-mono text-xs uppercase tracking-wider text-muted hover:text-foreground">
                    ← Volver al inicio
                </Link>
            </div>
            <AutomationShowcase />
            <Blog />
        </Layout>
    );
}