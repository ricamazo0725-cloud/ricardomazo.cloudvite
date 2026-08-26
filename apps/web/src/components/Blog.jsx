import { useState, useEffect } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { supabase } from "@/lib/supabaseClient";

export default function Blog() {
    const { t, pick, lang } = useLanguage();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState("todas");

    useEffect(() => {
        async function fetchPosts() {
            setLoading(true);
            let query = supabase
                .from("blog_posts")
                .select("*")
                .eq("published", true)
                .order("published_at", { ascending: false });

            if (category !== "todas") {
                query = query.eq("category", category);
            }

            const { data, error } = await query;
            if (!error) setPosts(data || []);
            setLoading(false);
        }
        fetchPosts();
    }, [category]);

    const categories = ["todas", "ciencia", "tecnologia", "general"];

    return (
        <section id="blog" className="max-w-6xl mx-auto px-6 py-20 border-t border-border">
            <span className="status-chip mb-6">{t("blog.eyebrow") || "Blog"}</span>

            <div className="flex flex-wrap gap-2 mb-10">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setCategory(cat)}
                        className={`font-mono text-xs uppercase tracking-wider px-3 py-1.5 rounded-full border transition-colors ${category === cat
                                ? "bg-primary text-primary-foreground border-primary"
                                : "border-border text-muted hover:text-foreground"
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {loading ? (
                <p className="text-muted font-mono text-sm">{t("blog.loading") || "Cargando..."}</p>
            ) : posts.length === 0 ? (
                <p className="text-muted font-mono text-sm">{t("blog.empty") || "Aún no hay publicaciones."}</p>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {posts.map((post) => (
                        <article key={post.id} className="card overflow-hidden flex flex-col">
                            {post.cover_image && (
                                <img
                                    src={post.cover_image}
                                    alt={pick(post.title)}
                                    loading="lazy"
                                    className="w-full h-44 object-cover"
                                />
                            )}
                            <div className="p-5 flex flex-col gap-2 flex-1">
                                <span className="font-mono text-xs uppercase tracking-wider text-primary">
                                    {post.category}
                                </span>
                                <h3 className="font-display font-semibold text-lg text-foreground">
                                    {pick(post.title)}
                                </h3>
                                <p className="text-sm text-foreground/80 flex-1">
                                    {pick(post.excerpt)}
                                </p>
                                <div className="flex items-center justify-between mt-2 font-mono text-xs text-muted">
                                    <span>
                                        {new Date(post.published_at).toLocaleDateString(lang === "en" ? "en-US" : "es-CO")}
                                    </span>
                                    {post.source && <span>{post.source}</span>}
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </section>
    );
}