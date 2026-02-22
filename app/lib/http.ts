// app/lib/http.ts
import axios, { AxiosError, AxiosInstance } from "axios";

export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE?.trim() || "http://localhost:8080";

export type ApiError = {
  message: string;
  status?: number;
  data?: unknown;
  code?: string;
  requestId?: string;
};

const TOKEN_KEY = "triply_token";
let redirecting = false;

function clearToken() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  window.dispatchEvent(new Event("triply:auth"));
}

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

function getMessageFromData(data: unknown): string | null {
  if (!isRecord(data)) return null;
  const m = data.message ?? data.error;
  return typeof m === "string" ? m : null;
}

function toApiError(err: unknown): ApiError {
  if (axios.isAxiosError(err)) {
    const e = err as AxiosError<unknown>;
    const status = e.response?.status;
    const data = e.response?.data;
    const requestId =
      (e.response?.headers?.["x-request-id"] as string | undefined) ||
      (e.response?.headers?.["traceparent"] as string | undefined);

    return {
      message: getMessageFromData(data) ?? e.message,
      status,
      data,
      code: e.code,
      requestId,
    };
  }
  if (err instanceof Error) return { message: err.message };
  return { message: "Unknown error" };
}

export function createHttpClient(): AxiosInstance {
  const client = axios.create({
    baseURL: API_BASE,
    timeout: 60_000,
    headers: { "Content-Type": "application/json" },
  });

  client.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });


client.interceptors.response.use(
  (resp) => resp,
  (err) => {

    if (typeof window !== "undefined") {
      const p = window.location.pathname;
      if (p.startsWith("/login") || p.startsWith("/register")) {
        redirecting = false;
      }
    }

    const apiErr = toApiError(err);

    if (apiErr.status === 401 && typeof window !== "undefined") {
      clearToken();

      const path = window.location.pathname;
      const isAuthPage =
        path.startsWith("/login") || path.startsWith("/register");

      if (!redirecting && !isAuthPage) {
        redirecting = true;
        const next = encodeURIComponent(path + window.location.search);
        window.location.replace(`/login?next=${next}`);
      }
    }

    return Promise.reject(apiErr);
  },
);

  return client;
}

export const http = createHttpClient();
