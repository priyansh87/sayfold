import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AppShell } from "@/components/navigation/AppShell";
import { CaptureProvider } from "@/context/CaptureContext";
import { LibraryClient } from "@/components/library/LibraryClient";

export default async function LibraryPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch user's sources
  const { data: sources, error } = await supabase
    .from("sources")
    .select(`
      *,
      chapters:chapters(id),
      entries:knowledge_entries(id)
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching sources:", error.message);
  }

  // Map counts
  const sourcesWithStats = (sources || []).map((source: any) => ({
    ...source,
    chaptersCount: source.chapters?.length || 0,
    entriesCount: source.entries?.length || 0,
  }));

  return (
    <CaptureProvider>
      <AppShell userEmail={user.email} displayName={user.user_metadata?.display_name}>
        <LibraryClient initialSources={sourcesWithStats} />
      </AppShell>
    </CaptureProvider>
  );
}
