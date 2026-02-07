export type AuthUser = {
  id: string;
  role: "SUPER_ADMIN" | "TEACHER" | "STUDENT";
  status: "ACTIVE" | "INACTIVE" | "PENDING";
  email: string;
  name?: string;
};

export const setAuth = (token: string, user: AuthUser) => {
  localStorage.setItem("accessToken", token);
  localStorage.setItem("user", JSON.stringify(user));
};

export const getToken = () => localStorage.getItem("accessToken");

export const getUser = (): AuthUser | null => {
  const raw = localStorage.getItem("user");
  return raw ? (JSON.parse(raw) as AuthUser) : null;
};

export const clearAuth = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("user");
};
