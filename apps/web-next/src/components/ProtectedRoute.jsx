"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function ProtectedRoute({ children }) {
  const { session, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !session) {
      router.replace("/admin/login");
    }
  }, [loading, session, router]);

  if (loading || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-muted font-mono text-sm">
        Verificando sesión…
      </div>
    );
  }

  return children;
}
