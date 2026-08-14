import { supabase } from "@/lib/supabaseClient";

/**
 * Devuelve el contenido de una sección (hero | about | contact) como objeto.
 * Si no existe fila todavía, devuelve null (la UI debe mostrar un estado vacío).
 */
export async function getSection(section) {
  const { data, error } = await supabase
    .from("site_content")
    .select("data")
    .eq("section", section)
    .maybeSingle();

  if (error) throw error;
  return data?.data ?? null;
}

export async function getAllSections() {
  const { data, error } = await supabase.from("site_content").select("section, data");
  if (error) throw error;
  return Object.fromEntries((data ?? []).map((row) => [row.section, row.data]));
}

/**
 * Crea o reemplaza el contenido de una sección. Requiere sesión de admin (RLS).
 */
export async function upsertSection(section, data) {
  const { error } = await supabase
    .from("site_content")
    .upsert({ section, data, updated_at: new Date().toISOString() }, { onConflict: "section" });
  if (error) throw error;
}
