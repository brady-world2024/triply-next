// app/lib/requireAuth.ts
import { getAccessToken, logoutClient } from "@/app/lib/authClient";

export function shouldRedirectToLogin(): boolean {
  const token = getAccessToken();
  return !token;
}

export function handleUnauthorized(nextPath: string) {

  logoutClient();
  const next = encodeURIComponent(nextPath);
  window.location.replace(`/login?next=${next}`);
}
