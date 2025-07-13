import React, { createContext, useContext, useState, useEffect } from "react";
import { User, AuthContextType } from "@/types/auth";
import { toast } from "@/hooks/use-toast";
import { api } from "@/lib/api";

const AuthContext = createContext<AuthContextType | null>(null);

type RegisterOptions = { role?: "student" | "teacher" | "admin" };

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    // Carrega todos os usuários ao iniciar
    api
      .getAll()
      .then(setUsers)
      .catch(() => setUsers([]));
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const foundUser = await api.login(email, password);
    if (foundUser) {
      setUser(foundUser);
      toast({
        title: "Login realizado!",
        description: `Bem-vindo(a), ${foundUser.name}!`,
      });
      return true;
    } else {
      toast({
        title: "Erro no login",
        description: "E-mail ou senha incorretos.",
        variant: "destructive",
      });
      return false;
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    classCode: string,
    options?: RegisterOptions
  ): Promise<boolean> => {
    try {
      const newUser = await api.register({
        name,
        email,
        classCode,
        role: options?.role || "student",
      });
      setUser(newUser);
      toast({
        title: "Cadastro realizado!",
        description: `Bem-vindo(a) à ${classCode}, ${name}!`,
      });
      return true;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      toast({
        title: "Erro no cadastro",
        description: e?.response?.data?.message || "Erro ao cadastrar.",
        variant: "destructive",
      });
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    toast({
      title: "Logout realizado",
      description: "Até logo!",
    });
  };

  const updateProfile = async (updates: Partial<User>): Promise<boolean> => {
    if (!user) return false;
    try {
      const updatedUser = await api.update(user.id, updates);
      setUser(updatedUser);
      toast({
        title: "Perfil atualizado!",
        description: "Suas informações foram salvas com sucesso.",
      });
      return true;
    } catch {
      toast({
        title: "Erro ao atualizar",
        description: "Não foi possível atualizar o perfil.",
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteAccount = async (): Promise<boolean> => {
    if (!user) return false;
    try {
      await api.delete(user.id);
      setUser(null);
      toast({
        title: "Conta excluída",
        description: "Sua conta foi excluída com sucesso.",
      });
      return true;
    } catch {
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir a conta.",
        variant: "destructive",
      });
      return false;
    }
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    updateProfile,
    deleteAccount,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const useClassRanking = (classCode: string) => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    api
      .getAll()
      .then(setUsers)
      .catch(() => setUsers([]));
  }, []);

  const classUsers = users
    .filter((user) => user.classCode === classCode)
    .sort((a, b) => b.score - a.score);

  return classUsers;
};
