import { supabase } from "@/lib/supabaseClient";

export async function getExperience() {
  const { data, error } = await supabase
    .from("experience_items")
    .select("*")
    .order("order_index", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function createExperience(item) {
  const { data, error } = await supabase.from("experience_items").insert(item).select().single();
  if (error) throw error;
  return data;
}

export async function updateExperience(id, item) {
  const { error } = await supabase.from("experience_items").update(item).eq("id", id);
  if (error) throw error;
}

export async function deleteExperience(id) {
  const { error } = await supabase.from("experience_items").delete().eq("id", id);
  if (error) throw error;
}
