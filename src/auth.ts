import { api, getToken, setToken } from "./api/client";

const ACCESS_KEY = "acesso";

export async function login(email: string, password: string): Promise<boolean> {
  try {
    const result = await api.login(email, password);
    setToken(result.token);
    localStorage.setItem(ACCESS_KEY, "true");
    return true;
  } catch {
    setToken(null);
    localStorage.removeItem(ACCESS_KEY);
    return false;
  }
}

export function logout(): void {
  setToken(null);
  localStorage.removeItem(ACCESS_KEY);
}

export function isLoggedIn(): boolean {
  return Boolean(getToken()) || localStorage.getItem(ACCESS_KEY) === "true";
}
