import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AppShell } from "@/components/navigation/AppShell";
import { CaptureProvider } from "@/context/CaptureContext";
import { SourceDetailClient } from "@/components/library/SourceDetailClient";

interface SourceDetailPageProps {
  params: Promise<{
    sourceId: string;
  }>;
}

export default async function SourceDetailPage({ params }: SourceDetailPageProps) {
  const { sourceId } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch the source
  const { data: source, error: sourceErr } = await supabase
    .from("sources")
    .select("*")
    .eq("id", sourceId)
    .single();

  if (sourceErr || !source) {
    notFound();
  }

  // Fetch chapters for this source
  const { data: chapters } = await supabase
    .from("chapters")
    .select("*")
    .eq("source_id", sourceId)
    .order("chapter_number", { ascending: true });

  // Fetch entries for this source
  const { data: entries } = await supabase
    .from("knowledge_entries")
    .select("*")
    .eq("source_id", sourceId)
    .order("created_at", { ascending: false });

  return (
    <CaptureProvider>
      <AppShell userEmail={user.email} displayName={user.user_metadata?.display_name}>
        <SourceDetailClient
          source={source}
          chapters={chapters || []}
          entries={entries || []}
        />
      </AppShell>
    </CaptureProvider>
  );
}

