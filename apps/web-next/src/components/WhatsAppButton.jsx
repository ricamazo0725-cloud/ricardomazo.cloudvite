"use client";

import { useLanguage } from "@/hooks/useLanguage";

export default function WhatsAppButton({ data }) {
    const { pick } = useLanguage();
    const whatsappMessage = pick(data?.whatsappMessage);
    const whatsappHref = data?.whatsapp
        ? `https://wa.me/${data.whatsapp.replace(/\D/g, "")}${whatsappMessage ? `?text=${encodeURIComponent(whatsappMessage)}` : ""
        }`
        : null;

    if (!whatsappHref) return null;

    return (
        <a href={whatsappHref} target="_blank" rel="noreferrer" aria-label="WhatsApp" className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-lg shadow-black/40 hover:scale-105 active:scale-95 transition-transform focus-ring">
            <svg viewBox="0 0 32 32" width="28" height="28" fill="currentColor" aria-hidden="true">
                <path d="M16.001 2.667c-7.363 0-13.334 5.97-13.334 13.333 0 2.352.615 4.66 1.784 6.687L2.667 29.333l6.79-1.78a13.27 13.27 0 0 0 6.544 1.727h.006c7.362 0 13.333-5.97 13.333-13.333 0-3.56-1.387-6.907-3.906-9.427a13.24 13.24 0 0 0-9.433-3.853Zm0 24.4h-.005a11.08 11.08 0 0 1-5.647-1.547l-.405-.24-4.03 1.057 1.076-3.929-.264-.403a11.05 11.05 0 0 1-1.696-5.905c0-6.115 4.977-11.09 11.096-11.09a11.03 11.03 0 0 1 7.844 3.25 11.02 11.02 0 0 1 3.246 7.847c-.003 6.116-4.98 11.09-11.215 11.09Zm6.086-8.31c-.334-.167-1.97-.972-2.276-1.083-.305-.111-.527-.167-.75.167-.222.334-.86 1.083-1.054 1.305-.194.223-.389.25-.723.084-.334-.167-1.409-.52-2.684-1.657-.992-.885-1.663-1.978-1.858-2.312-.194-.334-.02-.514.146-.68.15-.15.334-.39.5-.585.167-.195.223-.334.334-.556.111-.223.056-.417-.028-.584-.084-.167-.75-1.807-1.028-2.474-.271-.65-.546-.562-.75-.572l-.639-.011c-.222 0-.583.083-.888.417-.305.334-1.166 1.14-1.166 2.78 0 1.64 1.194 3.225 1.36 3.448.167.222 2.35 3.59 5.694 5.034.796.343 1.416.548 1.9.702.798.254 1.524.218 2.098.132.64-.096 1.97-.805 2.248-1.583.278-.778.278-1.445.194-1.584-.083-.14-.305-.222-.639-.39Z" />
            </svg>
        </a>
    );
}