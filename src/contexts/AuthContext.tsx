import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextType } from '@/types/auth';
import { toast } from '@/hooks/use-toast';

const AuthContext = createContext<AuthContextType | null>(null);

// Mock data for demonstration
const MOCK_USERS: User[] = [
  { id: '1', name: 'Ana Silva', email: 'ana@email.com', classCode: 'TURMA123', score: 850, createdAt: new Date().toISOString() },
  { id: '2', name: 'Carlos Santos', email: 'carlos@email.com', classCode: 'TURMA123', score: 920, createdAt: new Date().toISOString() },
  { id: '3', name: 'Beatriz Costa', email: 'beatriz@email.com', classCode: 'TURMA123', score: 780, createdAt: new Date().toISOString() },
  { id: '4', name: 'Diego Oliveira', email: 'diego@email.com', classCode: 'TURMA123', score: 890, createdAt: new Date().toISOString() },
  { id: '5', name: 'Elena Rodrigues', email: 'elena@email.com', classCode: 'TURMA123', score: 950, createdAt: new Date().toISOString() },
  { id: '6', name: 'Felipe Lima', email: 'felipe@email.com', classCode: 'TURMA456', score: 720, createdAt: new Date().toISOString() },
  { id: '7', name: 'Gabriela Souza', email: 'gabriela@email.com', classCode: 'TURMA456', score: 680, createdAt: new Date().toISOString() },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);

  // Load user from localStorage on component mount
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    const savedUsers = localStorage.getItem('users');
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    }
  }, []);

  // Save users to localStorage whenever users change
  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
  }, [users]);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = users.find(u => u.email === email);
    if (foundUser) {
      // In a real app, you'd verify the password here
      setUser(foundUser);
      localStorage.setItem('currentUser', JSON.stringify(foundUser));
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

  const register = async (name: string, email: string, password: string, classCode: string): Promise<boolean> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user already exists
    if (users.find(u => u.email === email)) {
      toast({
        title: "Erro no cadastro",
        description: "E-mail já cadastrado.",
        variant: "destructive",
      });
      return false;
    }

    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      classCode,
      score: Math.floor(Math.random() * 200) + 600, // Random score between 600-800 for new users
      createdAt: new Date().toISOString(),
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    setUser(newUser);
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    
    toast({
      title: "Cadastro realizado!",
      description: `Bem-vindo(a) à ${classCode}, ${name}!`,
    });
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
    toast({
      title: "Logout realizado",
      description: "Até logo!",
    });
  };

  const updateProfile = async (updates: Partial<User>): Promise<boolean> => {
    if (!user) return false;

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const updatedUser = { ...user, ...updates };
    const updatedUsers = users.map(u => u.id === user.id ? updatedUser : u);
    
    setUsers(updatedUsers);
    setUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    
    toast({
      title: "Perfil atualizado!",
      description: "Suas informações foram salvas com sucesso.",
    });
    return true;
  };

  const deleteAccount = async (): Promise<boolean> => {
    if (!user) return false;

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const updatedUsers = users.filter(u => u.id !== user.id);
    setUsers(updatedUsers);
    setUser(null);
    localStorage.removeItem('currentUser');
    
    toast({
      title: "Conta excluída",
      description: "Sua conta foi excluída com sucesso.",
    });
    return true;
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    updateProfile,
    deleteAccount,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const useClassRanking = (classCode: string) => {
  const [users] = useState<User[]>(() => {
    const savedUsers = localStorage.getItem('users');
    return savedUsers ? JSON.parse(savedUsers) : MOCK_USERS;
  });

  const classUsers = users
    .filter(user => user.classCode === classCode)
    .sort((a, b) => b.score - a.score);

  return classUsers;
};