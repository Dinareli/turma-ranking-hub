import axios from "axios";

import { User } from "@/types/auth";

const API_URL = "http://localhost:8080/api/users";

export const api = {
  async login(email: string, password: string): Promise<User | null> {
    // Simulação: buscar usuário por email (backend real deve implementar autenticação)
    const res = await axios.get<User[]>(API_URL);
    const user = res.data.find(
      (u) => u.email === email /* && u.password === password */
    );
    return user || null;
  },

  async register(
    user: Omit<User, "id" | "createdAt" | "score">
  ): Promise<User> {
    const res = await axios.post<User>(API_URL, user);
    return res.data;
  },

  async update(id: string, updates: Partial<User>): Promise<User> {
    const res = await axios.put<User>(`${API_URL}/${id}`, updates);
    return res.data;
  },

  async delete(id: string): Promise<void> {
    await axios.delete(`${API_URL}/${id}`);
  },

  async getAll(): Promise<User[]> {
    const res = await axios.get<User[]>(API_URL);
    return res.data;
  },
};
