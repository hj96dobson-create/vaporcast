type ClientEnvKey = "VITE_SUPABASE_URL" | "VITE_SUPABASE_PUBLISHABLE_KEY" | "VITE_RUNWAY_API_KEY";

type ClientEnvHealth = {
  missingRequired: ClientEnvKey[];
  missingOptional: ClientEnvKey[];
  ready: boolean;
};

const requiredClientEnv: ClientEnvKey[] = ["VITE_SUPABASE_URL", "VITE_SUPABASE_PUBLISHABLE_KEY"];

const optionalClientEnv: ClientEnvKey[] = ["VITE_RUNWAY_API_KEY"];

const values: Record<ClientEnvKey, string | undefined> = {
  VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
  VITE_SUPABASE_PUBLISHABLE_KEY: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
  VITE_RUNWAY_API_KEY: import.meta.env.VITE_RUNWAY_API_KEY,
};

function isMissing(value: string | undefined) {
  return !value || !value.trim();
}

export function getClientEnvHealth(): ClientEnvHealth {
  const missingRequired = requiredClientEnv.filter((key) => isMissing(values[key]));
  const missingOptional = optionalClientEnv.filter((key) => isMissing(values[key]));

  return {
    missingRequired,
    missingOptional,
    ready: missingRequired.length === 0,
  };
}

export function getClientEnvValue(key: ClientEnvKey): string | undefined {
  return values[key];
}

export function getClientEnvWarningMessage() {
  const health = getClientEnvHealth();
  if (health.ready) return null;
  return `Missing client environment variable(s): ${health.missingRequired.join(", ")}. Configure .env.local before using authentication features.`;
}
