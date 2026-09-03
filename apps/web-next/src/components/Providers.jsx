"use client";

import { AuthProvider } from "@/hooks/useAuth";
import { LanguageProvider } from "@/hooks/useLanguage";

export default function Providers({ children }) {
  return (
    <LanguageProvider>
      <AuthProvider>{children}</AuthProvider>
    </LanguageProvider>
  );
}
