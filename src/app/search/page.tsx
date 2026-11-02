import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AppShell } from "@/components/navigation/AppShell";
import { CaptureProvider } from "@/context/CaptureContext";
import { SearchAskClient } from "@/components/search/SearchAskClient";

export default async function SearchPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <CaptureProvider>
      <AppShell userEmail={user.email} displayName={user.user_metadata?.display_name}>
        <SearchAskClient />
      </AppShell>
    </CaptureProvider>
  );
}

