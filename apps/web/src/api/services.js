import { supabase } from "@/lib/supabaseClient";

export async function getServices() {
  const { data, error } = await supabase
    .from("service_items")
    .select("*")
    .order("order_index", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function createService(item) {
  const { data, error } = await supabase.from("service_items").insert(item).select().single();
  if (error) throw error;
  return data;
}

export async function updateService(id, item) {
  const { error } = await supabase.from("service_items").update(item).eq("id", id);
  if (error) throw error;
}

export async function deleteService(id) {
  const { error } = await supabase.from("service_items").delete().eq("id", id);
  if (error) throw error;
}
