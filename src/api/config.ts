const configured = import.meta.env.VITE_API_URL as string | undefined;

/** Base URL for the Wolf Board API. Empty = same origin (Vite proxy in dev). */
export const API_BASE_URL = (configured ?? "").replace(/\/$/, "");

export function apiUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalized}`;
}
