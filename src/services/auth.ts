import { api } from "./api";

export async function login(email: string, password: string) {
  const res = await api.post("/auth/login", { email, password });
  return res.data;
}

export async function registerStudent(payload: any) {
  const res = await api.post("/auth/register-student", payload);
  return res.data;
}

export async function registerTeacher(payload: any) {
  const res = await api.post("/auth/register-teacher", payload);
  return res.data;
}
