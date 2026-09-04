"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Layout from "@/components/Layout";
import { useLanguage } from "@/hooks/useLanguage";
import { supabase } from "@/lib/supabaseClient";

function splitIntoSentences(text) {
    if (!text) return [];
    const matches = text.match(/[^.!?]+[.!?]+(\s|$)/g);
    return matches ? matches.map((s) => s.trim()) : [text.trim()];
}

const VOICE_LANG = {
    en: "en-US",
    es: "es-ES",
};

export default function BlogPostPage({ initialPost }) {
    const { slug } = useParams();
    const { pick, lang, t } = useLanguage();
    const basePrefix = lang === "en" ? "/en" : "";
    const [post, setPost] = useState(initialPost ?? null);
    const [loading, setLoading] = useState(!initialPost);
    const [notFound, setNotFound] = useState(false);

    // Lightbox de la imagen
    const [lightboxMounted, setLightboxMounted] = useState(false);
    const [lightboxVisible, setLightboxVisible] = useState(false);
    const [zoomed, setZoomed] = useState(false);
    const [zoomOrigin, setZoomOrigin] = useState("50% 50%");

    const [sentences, setSentences] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [rate, setRate] = useState(0.9);
    const autoAdvanceRef = useRef(true);

    useEffect(() => {
        // El post ya llega renderizado desde el servidor (ver
        // app/blog/[slug]/page.js) para que el contenido esté presente en
        // el HTML inicial. Solo se vuelve a pedir a Supabase si por algún
        // motivo no llegó (ej. navegación client-side sin props, poco
        // probable en una ruta dinámica de App Router, pero se deja como
        // respaldo defensivo).
        if (initialPost) return;

        async function fetchPost() {
            setLoading(true);
            const { data, error } = await supabase
                .from("blog_posts")
                .select("*")
                .eq("slug", slug)
                .eq("published", true)
                .single();

            if (error || !data) {
                setNotFound(true);
            } else {
                setPost(data);
            }
            setLoading(false);
        }
        fetchPost();
    }, [slug, initialPost]);

    useEffect(() => {
        window.speechSynthesis.cancel();
        setIsPlaying(false);
        setCurrentIndex(0);
        if (post) {
            setSentences(splitIntoSentences(post.content?.[lang]));
        }
    }, [post, lang]);

    useEffect(() => {
        return () => window.speechSynthesis.cancel();
    }, []);

    useEffect(() => {
        function handleKeyDown(e) {
            if (e.key === "Escape") closeLightbox();
        }
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    function openLightbox() {
        setZoomed(false);
        setZoomOrigin("50% 50%");
        setLightboxMounted(true);
        // Pequeño delay para que el navegador registre el estado inicial
        // antes de animar a la posición final (fade + scale in).
        requestAnimationFrame(() => {
            requestAnimationFrame(() => setLightboxVisible(true));
        });
    }

    function closeLightbox() {
        setLightboxVisible(false);
        setTimeout(() => {
            setLightboxMounted(false);
            setZoomed(false);
        }, 250);
    }

    function handleImageClick(e) {
        e.stopPropagation();
        if (!zoomed) {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            setZoomOrigin(`${x}% ${y}%`);
            setZoomed(true);
        } else {
            setZoomed(false);
        }
    }

    function speakSentence(index) {
        if (index < 0 || index >= sentences.length) {
            setIsPlaying(false);
            return;
        }
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(sentences[index]);
        utterance.lang = VOICE_LANG[lang] || "en-US";
        utterance.rate = rate;
        utterance.onend = () => {
            if (autoAdvanceRef.current && index + 1 < sentences.length) {
                setCurrentIndex(index + 1);
                speakSentence(index + 1);
            } else {
                setIsPlaying(false);
            }
        };
        utterance.onerror = () => setIsPlaying(false);
        window.speechSynthesis.speak(utterance);
    }

    function handlePlayPause() {
        if (isPlaying) {
            autoAdvanceRef.current = false;
            window.speechSynthesis.cancel();
            setIsPlaying(false);
            return;
        }
        autoAdvanceRef.current = true;
        setIsPlaying(true);
        speakSentence(currentIndex);
    }

    function handlePrev() {
        const newIndex = Math.max(0, currentIndex - 1);
        setCurrentIndex(newIndex);
        if (isPlaying) {
            autoAdvanceRef.current = true;
            speakSentence(newIndex);
        }
    }

    function handleNext() {
        const newIndex = Math.min(sentences.length - 1, currentIndex + 1);
        setCurrentIndex(newIndex);
        if (isPlaying) {
            autoAdvanceRef.current = true;
            speakSentence(newIndex);
        }
    }

    function handleRestart() {
        setCurrentIndex(0);
        autoAdvanceRef.current = true;
        setIsPlaying(true);
        speakSentence(0);
    }

    function handleRateChange(e) {
        const newRate = parseFloat(e.target.value);
        setRate(newRate);
        if (isPlaying) {
            autoAdvanceRef.current = true;
            window.speechSynthesis.cancel();
            setTimeout(() => speakSentence(currentIndex), 50);
        }
    }

    function handleSentenceClick(index) {
        setCurrentIndex(index);
        if (isPlaying) {
            autoAdvanceRef.current = true;
            speakSentence(index);
        }
    }

    return (
        <Layout>
            <div className="max-w-3xl mx-auto px-6 pt-24 pb-20">
                <Link
                    href={`${basePrefix}/blog`}
                    className="font-mono text-xs uppercase tracking-wider text-muted hover:text-foreground transition-colors"
                >
                    {t("nav.backBlog")}
                </Link>

                {loading ? (
                    <p className="text-muted font-mono text-sm mt-10">Cargando...</p>
                ) : notFound ? (
                    <p className="text-muted font-mono text-sm mt-10">
                        No encontramos esta publicación.
                    </p>
                ) : (
                    <article className="mt-8">
                        {post.source && (
                            <div className="inline-flex items-center gap-1.5 border border-primary/40 rounded-full px-2.5 py-1 mb-4">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                                <span className="font-mono text-[10px] uppercase tracking-wider text-primary">
                                    Auto-generado
                                </span>
                            </div>
                        )}
                        <span className="font-mono text-xs uppercase tracking-wider text-primary block mb-3">
                            {post.category}
                        </span>
                        <h1 className="font-display font-semibold text-3xl text-foreground mb-4">
                            {pick(post.title)}
                        </h1>
                        <div className="flex items-center gap-3 font-mono text-xs text-muted mb-8">
                            <span>
                                {new Date(post.published_at).toLocaleDateString(lang === "en" ? "en-US" : "es-CO")}
                            </span>
                            {post.source && <span>· {post.source}</span>}
                        </div>

                        {post.cover_image && (
                            <div
                                className="relative group mb-6 overflow-hidden rounded-lg cursor-zoom-in"
                                onClick={openLightbox}
                            >
                                <img
                                    src={post.cover_image}
                                    alt={pick(post.title)}
                                    className="w-full rounded-lg transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                                    <span className="opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300 font-mono text-xs uppercase tracking-wider text-white bg-black/60 rounded-full px-3 py-1.5">
                                        🔍 Ampliar
                                    </span>
                                </div>
                            </div>
                        )}

                        {sentences.length > 0 && (
                            <div className="card p-4 mb-8 flex flex-col gap-3">
                                <div className="flex items-center justify-between flex-wrap gap-3">
                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={handlePrev}
                                            disabled={currentIndex === 0}
                                            className="font-mono text-xs border border-border rounded-full px-3 py-1.5 hover:border-primary hover:text-primary transition-colors disabled:opacity-30 disabled:hover:border-border disabled:hover:text-foreground"
                                        >
                                            ⏮ Anterior
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handlePlayPause}
                                            className="font-mono text-xs border border-primary text-primary rounded-full px-4 py-1.5 hover:bg-primary/10 transition-colors"
                                        >
                                            {isPlaying
                                                ? "⏸ Pausar"
                                                : lang === "en"
                                                    ? "▶ Listen"
                                                    : "▶ Escuchar"}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleNext}
                                            disabled={currentIndex >= sentences.length - 1}
                                            className="font-mono text-xs border border-border rounded-full px-3 py-1.5 hover:border-primary hover:text-primary transition-colors disabled:opacity-30 disabled:hover:border-border disabled:hover:text-foreground"
                                        >
                                            Siguiente ⏭
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleRestart}
                                            className="font-mono text-xs text-muted hover:text-foreground transition-colors"
                                            title="Empezar desde el inicio"
                                        >
                                            ↺ Reiniciar
                                        </button>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <label className="font-mono text-[10px] uppercase tracking-wider text-muted">
                                            Velocidad
                                        </label>
                                        <select
                                            value={rate}
                                            onChange={handleRateChange}
                                            className="bg-background border border-border rounded px-2 py-1 font-mono text-xs"
                                        >
                                            <option value="0.6">0.6x</option>
                                            <option value="0.75">0.75x</option>
                                            <option value="0.9">0.9x</option>
                                            <option value="1">1x</option>
                                            <option value="1.25">1.25x</option>
                                        </select>
                                    </div>
                                </div>

                                <span className="font-mono text-[10px] uppercase tracking-wider text-muted">
                                    Oración {currentIndex + 1} de {sentences.length} — clic en cualquier oración de abajo para saltar ahí
                                </span>
                            </div>
                        )}

                        {sentences.length > 0 ? (
                            <p className="text-foreground/90 leading-relaxed">
                                {sentences.map((sentence, i) => (
                                    <span
                                        key={i}
                                        onClick={() => handleSentenceClick(i)}
                                        className={`cursor-pointer rounded px-0.5 transition-colors ${i === currentIndex
                                                ? "bg-primary/25 text-foreground"
                                                : "hover:bg-primary/10"
                                            }`}
                                    >
                                        {sentence}{" "}
                                    </span>
                                ))}
                            </p>
                        ) : (
                            <p className="text-foreground/90 leading-relaxed whitespace-pre-line">
                                {pick(post.content)}
                            </p>
                        )}

                        {post.source_url && (
                            <a
                                href={post.source_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block mt-8 font-mono text-xs uppercase tracking-wider text-primary hover:underline"
                            >
                                Ver fuente original →
                            </a>
                        )}
                    </article>
                )}
            </div>

            {lightboxMounted && post?.cover_image && (
                <div
                    onClick={closeLightbox}
                    className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-250 ease-out ${lightboxVisible ? "bg-black/90 opacity-100" : "bg-black/90 opacity-0"
                        }`}
                >
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            closeLightbox();
                        }}
                        className="absolute top-4 right-4 font-mono text-xs uppercase tracking-wider text-white border border-white/40 rounded-full px-3 py-1.5 hover:border-white transition-colors z-10"
                    >
                        ✕ Cerrar
                    </button>
                    <span className="absolute bottom-4 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-wider text-white/60">
                        {zoomed ? "Clic para alejar" : "Clic en la imagen para acercar"}
                    </span>
                    <img
                        src={post.cover_image}
                        alt={pick(post.title)}
                        onClick={handleImageClick}
                        style={{ transformOrigin: zoomOrigin }}
                        className={`max-w-full max-h-full object-contain rounded-lg transition-all duration-500 ease-out ${lightboxVisible ? "scale-100 opacity-100" : "scale-90 opacity-0"
                            } ${zoomed ? "scale-[2.2] cursor-zoom-out" : "cursor-zoom-in"}`}
                    />
                </div>
            )}
        </Layout>
    );
}