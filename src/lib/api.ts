import axios from "axios";

import { User } from "@/types/auth";
import { UserRankings } from "@/types/UserRankings";

const API_URL = "http://localhost:8080/api/users";
const CLASSROOM_API_URL = "http://localhost:8080/api/classrooms";
const RANKING_API_URL = "http://localhost:8080/api/user-rankings";

export interface Classroom {
  id: number;
  name: string;
  password: string;
  teacherId: number;
}

export const api = {
  async login(email: string, password: string): Promise<User | null> {
    // Envia email e senha no corpo da requisição para autenticação
    try {
      const res = await axios.post<User>(`${API_URL}/login`, {
        email,
        password,
      });
      return { ...res.data, id: String(res.data.id) };
    } catch {
      return null;
    }
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

  async getAllRanking(classromId: string): Promise<UserRankings[]> {
    const res = await axios.get<UserRankings[]>(
      RANKING_API_URL + "/rank" + `/${classromId}`
    );
    return res.data;
  },
};

export const classroomApi = {
  async create(
    name: string,
    password: string,
    teacherId: number
  ): Promise<Classroom> {
    const res = await axios.post<Classroom>(CLASSROOM_API_URL, {
      name,
      password,
      teacherId,
    });
    return res.data;
  },

  async getByPassword(password: string): Promise<Classroom | null> {
    try {
      const res = await axios.get<Classroom>(
        `${CLASSROOM_API_URL}/password/${password}`
      );
      return res.data;
    } catch {
      return null;
    }
  },

  async getAll(): Promise<Classroom[]> {
    const res = await axios.get<Classroom[]>(CLASSROOM_API_URL);
    return res.data;
  },

  async update(id: number, updates: Partial<Classroom>): Promise<Classroom> {
    const res = await axios.put<Classroom>(`${CLASSROOM_API_URL}/${id}`, updates);
    return res.data;
  },

  async delete(id: number): Promise<void> {
    await axios.delete(`${CLASSROOM_API_URL}/${id}`);
  },
};
