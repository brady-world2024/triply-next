// app/lib/authApi.ts
import { http } from "@/app/lib/http";
import { setAccessToken } from "@/app/lib/authClient";

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

export async function register(email: string, password: string) {
  await http.post("/api/Auth/register", { email, password });
}

export async function login(email: string, password: string) {
  const resp = await http.post("/api/Auth/login", { email, password });

  const data: unknown = resp.data;
  const token =
    isRecord(data) && typeof data.token === "string" ? data.token : undefined;

  if (!token) throw new Error("Login failed: token missing");

setAccessToken(token);
  return token;
}

export function logout() {
  localStorage.removeItem("triply_token");
}
