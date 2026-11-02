import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

console.log("Testing Supabase connection with URL:", url);

const supabase = createClient(url, key);

async function test() {
  const { data, error } = await supabase.from("sources").select("*").limit(1);
  if (error) {
    console.error("Supabase query result:", error.code, error.message);
  } else {
    console.log("Query successful! Data:", data);
  }
}

test();
