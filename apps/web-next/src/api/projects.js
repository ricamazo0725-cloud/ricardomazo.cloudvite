import { supabase } from "@/lib/supabaseClient";

export async function getProjects() {
  const { data, error } = await supabase
    .from("project_items")
    .select("*")
    .order("order_index", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function createProject(item) {
  const { data, error } = await supabase.from("project_items").insert(item).select().single();
  if (error) throw error;
  return data;
}

export async function updateProject(id, item) {
  const { error } = await supabase.from("project_items").update(item).eq("id", id);
  if (error) throw error;
}

export async function deleteProject(id) {
  const { error } = await supabase.from("project_items").delete().eq("id", id);
  if (error) throw error;
}
