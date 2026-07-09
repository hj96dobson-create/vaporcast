import { createServerFn } from "@tanstack/start";

export const createLead = createServerFn({ method: "POST" }).handler(async ({ data }) => {
  const email = data?.email;

  if (!email) {
    return { error: "Email is required" };
  }

  console.log("Lead captured:", data);

  return { success: true };
});
