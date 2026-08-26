import { useLanguage } from "@/hooks/useLanguage";

export default function AutomationShowcase() {
    const { t } = useLanguage();

    const steps = [
        { emoji: "🛰️", label: t("automation.steps.connect") },
        { emoji: "✍️", label: t("automation.steps.write") },
        { emoji: "📤", label: t("automation.steps.publish") },
        { emoji: "🔁", label: t("automation.steps.repeat") },
    ];

    return (
        <section className="max-w-6xl mx-auto px-6 py-16 border-t border-border">
            <span className="status-chip mb-4">{t("automation.eyebrow")}</span>
            <h2 className="font-display font-semibold text-2xl text-foreground mb-3">
                {t("automation.title")}
            </h2>
            <p className="text-foreground/80 max-w-2xl mb-10">
                {t("automation.description")}
            </p>

            <div className="flex flex-wrap gap-4">
                {steps.map((step, i) => (
                    <div key={i} className="card px-5 py-4 flex items-center gap-3">
                        <span className="text-2xl">{step.emoji}</span>
                        <span className="text-sm text-foreground/90">{step.label}</span>
                    </div>
                ))}
            </div>
        </section>
    );
}