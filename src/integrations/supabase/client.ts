import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";
import {
  getClientEnvHealth,
  getClientEnvWarningMessage,
  getClientEnvValue,
} from "@/lib/env-browser";

const health = getClientEnvHealth();
const SUPABASE_URL =
  getClientEnvValue("VITE_SUPABASE_URL") ?? "https://missing-project.supabase.co";
const SUPABASE_ANON_KEY =
  getClientEnvValue("VITE_SUPABASE_PUBLISHABLE_KEY") ?? "missing-publishable-key";

if (!health.ready) {
  const warning = getClientEnvWarningMessage();
  if (warning) {
    console.warn(`[env] ${warning}`);
  }
}

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
export const supabaseClientReady = health.ready;
export const supabaseClientMissingEnv = health.missingRequired;
