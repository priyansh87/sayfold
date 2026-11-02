import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AppShell } from "@/components/navigation/AppShell";
import { CaptureProvider } from "@/context/CaptureContext";
import { VaultClient } from "@/components/vault/VaultClient";

export default async function VaultPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch entries with source and chapter details
  const { data: entries, error } = await supabase
    .from("knowledge_entries")
    .select(`
      *,
      sources:source_id (id, title, source_type),
      chapters:chapter_id (id, title, chapter_number)
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching vault entries:", error.message);
  }

  // Fetch sources and chapters for filters
  const { data: sources } = await supabase
    .from("sources")
    .select("*")
    .eq("user_id", user.id)
    .order("title");

  const { data: chapters } = await supabase
    .from("chapters")
    .select("*")
    .eq("user_id", user.id)
    .order("chapter_number");

  return (
    <CaptureProvider>
      <AppShell userEmail={user.email} displayName={user.user_metadata?.display_name}>
        <VaultClient
          initialEntries={(entries as any) || []}
          sources={sources || []}
          chapters={chapters || []}
        />
      </AppShell>
    </CaptureProvider>
  );
}
