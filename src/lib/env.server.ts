type ServerEnvKey =
  | "SUPABASE_URL"
  | "SUPABASE_PUBLISHABLE_KEY"
  | "SUPABASE_SERVICE_ROLE_KEY"
  | "VAPORCAST_AVATAR_PROVIDER"
  | "HEYGEN_API_KEY"
  | "TAVUS_API_KEY"
  | "LOVABLE_API_KEY";

type ServerEnvReport = {
  missingRequired: ServerEnvKey[];
  missingOptional: ServerEnvKey[];
  warnings: string[];
};

const requiredCore: ServerEnvKey[] = [
  "SUPABASE_URL",
  "SUPABASE_PUBLISHABLE_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
];

function readEnv(key: ServerEnvKey): string {
  return (process.env[key] ?? "").trim();
}

export function getServerEnvReport(): ServerEnvReport {
  const missingRequired = requiredCore.filter((key) => !readEnv(key));
  const missingOptional: ServerEnvKey[] = [];
  const warnings: string[] = [];

  const provider = readEnv("VAPORCAST_AVATAR_PROVIDER").toLowerCase();

  if (provider && provider !== "heygen" && provider !== "tavus") {
    warnings.push(
      `Invalid VAPORCAST_AVATAR_PROVIDER value "${provider}". Expected "heygen" or "tavus".`,
    );
  } else if (provider === "heygen" && !readEnv("HEYGEN_API_KEY")) {
    missingOptional.push("HEYGEN_API_KEY");
  } else if (provider === "tavus" && !readEnv("TAVUS_API_KEY")) {
    missingOptional.push("TAVUS_API_KEY");
  }

  if (!readEnv("LOVABLE_API_KEY")) {
    missingOptional.push("LOVABLE_API_KEY");
  }

  return {
    missingRequired,
    missingOptional,
    warnings,
  };
}

let didLogServerEnvReport = false;

export function reportServerEnvHealth() {
  if (didLogServerEnvReport) return;
  didLogServerEnvReport = true;

  const report = getServerEnvReport();

  if (report.missingRequired.length > 0) {
    console.error(
      `[env] Missing required server variable(s): ${report.missingRequired.join(", ")}. Core authenticated features may fail until configured.`,
    );
  }

  if (report.missingOptional.length > 0) {
    console.warn(
      `[env] Missing optional server variable(s): ${report.missingOptional.join(", ")}. Related features will degrade gracefully.`,
    );
  }

  for (const warning of report.warnings) {
    console.warn(`[env] ${warning}`);
  }
}
