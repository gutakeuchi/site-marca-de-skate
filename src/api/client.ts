import { apiUrl } from "./config";

const TOKEN_KEY = "wolf-board-token";

export type ApiProduct = {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
};

export type ApiCategory = {
  slug: string;
  title: string;
  group: string;
};

export type ApiCartItem = {
  productId: number;
  name: string;
  image: string;
  price: number;
  size: string;
  qty: number;
};

export type ApiCart = {
  items: ApiCartItem[];
  itemCount: number;
  total: number;
};

export type AuthResponse = {
  token: string;
  email: string;
  expiresAt: string;
};

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null): void {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  if (!headers.has("Content-Type") && init.body) {
    headers.set("Content-Type", "application/json");
  }

  const token = getToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const response = await fetch(apiUrl(path), { ...init, headers });
  if (!response.ok) {
    let message = `Erro ${response.status}`;
    try {
      const payload = (await response.json()) as { message?: string };
      if (payload.message) message = payload.message;
    } catch {
      // ignore
    }
    throw new Error(message);
  }

  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

export const api = {
  health: () => request<{ status: string }>("/api/health"),
  login: (email: string, password: string) =>
    request<AuthResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  me: () => request<{ email: string; id: string }>("/api/auth/me"),
  categories: () => request<ApiCategory[]>("/api/categories"),
  products: (params?: { category?: string; q?: string }) => {
    const query = new URLSearchParams();
    if (params?.category) query.set("category", params.category);
    if (params?.q) query.set("q", params.q);
    query.set("take", "200");
    const suffix = query.toString() ? `?${query}` : "";
    return request<{ items: ApiProduct[]; total: number }>(`/api/products${suffix}`);
  },
  product: (id: number) => request<ApiProduct>(`/api/products/${id}`),
  cart: {
    get: () => request<ApiCart>("/api/cart"),
    addItem: (productId: number, size: string, qty: number) =>
      request<ApiCart>("/api/cart/items", {
        method: "POST",
        body: JSON.stringify({ productId, size, qty }),
      }),
    setQty: (productId: number, size: string, qty: number) =>
      request<ApiCart>("/api/cart/items", {
        method: "PUT",
        body: JSON.stringify({ productId, size, qty }),
      }),
    removeItem: (productId: number, size: string) =>
      request<ApiCart>(`/api/cart/items/${productId}/${encodeURIComponent(size)}`, {
        method: "DELETE",
      }),
    clear: () => request<ApiCart>("/api/cart", { method: "DELETE" }),
  },
};
