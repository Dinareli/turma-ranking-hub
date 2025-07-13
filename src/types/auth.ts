export interface User {
  id: string;
  name: string;
  email: string;
  role: "student" | "teacher" | "admin";
  classCode: string;
  score: number;
  createdAt: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (
    name: string,
    email: string,
    password: string,
    classCode: string,
    options?: { role?: "student" | "teacher" | "admin" }
  ) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<boolean>;
  deleteAccount: () => Promise<boolean>;
}

export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  name: string;
  email: string;
  password: string;
  classCode: string;
}
