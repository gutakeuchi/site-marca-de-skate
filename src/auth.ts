const ACCESS_KEY = "acesso";

const ALLOWED_EMAILS = [
  "vitor.silva1048@etec.sp.gov.br",
  "gustavo.takeuchi@etec.sp.gov.br",
  "gabriel.ferreira428@etec.sp.gov.br",
  "gustavo.azevedo11@etec.sp.gov.br",
] as const;

const DEMO_PASSWORD = "admin";

export function login(email: string, password: string): boolean {
  const normalizedEmail = email.trim().toLowerCase();
  const isAllowedEmail = ALLOWED_EMAILS.some(
    (allowed) => allowed.toLowerCase() === normalizedEmail,
  );
  const isValid = isAllowedEmail && password === DEMO_PASSWORD;

  if (isValid) {
    localStorage.setItem(ACCESS_KEY, "true");
  }

  return isValid;
}

export function logout(): void {
  localStorage.removeItem(ACCESS_KEY);
}

export function isLoggedIn(): boolean {
  return localStorage.getItem(ACCESS_KEY) === "true";
}
