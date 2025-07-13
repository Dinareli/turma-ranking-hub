import React from "react";
import { useAuth, useClassRanking } from "@/contexts/AuthContext";
import { RankingTable } from "@/components/RankingTable";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LogOut, User, Trophy, Users, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const classStudents = useClassRanking(user?.classCode || "");

  if (!user) {
    navigate("/");
    return null;
  }

  const userPosition =
    classStudents.findIndex((student) => student.id === user.id) + 1;
  const totalStudents = classStudents.length;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  const createNewClass = () => {
    if (user.role === "teacher") {
      navigate("/create-class");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-card">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Olá, {user.name}! 👋
            </h1>
            <p className="text-muted-foreground">
              Bem-vindo(a) ao painel da turma {user.classCode}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleProfileClick}>
              <User className="mr-2 h-4 w-4" />
              Perfil
            </Button>
            <Button variant="destructive" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sua Posição</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">#{userPosition}</div>
              <p className="text-xs text-muted-foreground">
                de {totalStudents} alunos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Sua Pontuação
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{user.score}</div>
              <p className="text-xs text-muted-foreground">pontos acumulados</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total de Alunos
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStudents}</div>
              <p className="text-xs text-muted-foreground">
                na turma {user.classCode}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Ranking Table */}
        <RankingTable students={classStudents} currentUser={user} />
      </div>
      {user.role === "teacher" && (
        <div className="fixed bottom-4 right-4">
          <Button onClick={createNewClass} className="bg-primary text-white">
            Criar Nova Turma
          </Button>
        </div>
      )}
    </div>
  );
};
