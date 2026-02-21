// app/lib/authClient.ts
const KEY = "triply_token";
const AUTH_EVENT = "triply:auth";

function notifyAuthChanged() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(AUTH_EVENT));
}

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(KEY);
}

export function setAccessToken(token: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, token);
  notifyAuthChanged(); // Notifications after login
}

export function logoutClient() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
  notifyAuthChanged(); // Logout notification (you already had one)
}
