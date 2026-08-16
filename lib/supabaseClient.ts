import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type SupabaseError = {
  message?: string;
  details?: string;
  hint?: string;
  code?: string;
};

export const logSupabaseError = (
  context: string,
  error: SupabaseError | null
) => {
  console.error(`[Supabase] ${context}`, {
    message: error?.message ?? null,
    details: error?.details ?? null,
    hint: error?.hint ?? null,
    code: error?.code ?? null,
  });
};
