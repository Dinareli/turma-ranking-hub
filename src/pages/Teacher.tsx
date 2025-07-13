import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { classroomApi, Classroom } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { Eye, ArrowLeft, LogOut, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ClassRanking } from "@/components/ClassRanking";
import { CreateUserModal } from "@/components/CreateUserModal";
import { CreateClassroomModal } from "@/components/CreateClassroomModal";

export const Teacher = () => {
  const { toast } = useToast();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  
  // Modal states
  const [createStudentModal, setCreateStudentModal] = useState(false);
  const [createClassroomModal, setCreateClassroomModal] = useState(false);

  const handleBack = () => {
    navigate('/dashboard');
  };

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  // Load classrooms on component mount
  useEffect(() => {
    loadClassrooms();
  }, []);

  const loadClassrooms = async () => {
    try {
      const data = await classroomApi.getAll();
      setClassrooms(data);
    } catch (error) {
      toast({
        title: "Erro ao carregar turmas",
        variant: "destructive",
      });
    }
  };


  if (user?.role !== "teacher") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-96">
          <CardHeader>
            <CardTitle>Acesso Negado</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Apenas professores podem acessar esta página.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-primary/10 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <Button variant="outline" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
          <h1 className="text-3xl font-bold text-center mb-2">
            Painel do Professor
          </h1>
          <p className="text-muted-foreground text-center">
            Bem-vindo, {user?.name}
          </p>
        </div>

        <Tabs defaultValue="manage" className="w-full">
          <TabsList className="grid w-full grid-cols-1">
            <TabsTrigger value="manage">Gerenciar Turmas</TabsTrigger>
          </TabsList>

          <TabsContent value="manage">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Turmas Cadastradas</CardTitle>
                <div className="flex gap-2">
                  <Button onClick={() => setCreateStudentModal(true)} variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Aluno
                  </Button>
                  <Button onClick={() => setCreateClassroomModal(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Turma
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {classrooms.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      Nenhuma turma cadastrada ainda.
                    </p>
                  ) : (
                    classrooms.map((classroom) => (
                      <div
                        key={classroom.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div>
                          <h3 className="font-medium">{classroom.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            Código: {classroom.password}
                          </p>
                        </div>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-2" />
                              Ver Ranking
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>
                                Ranking - {classroom.name}
                              </DialogTitle>
                            </DialogHeader>
                            <ClassRanking classCode={String(classroom.id)} />
                          </DialogContent>
                        </Dialog>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Modals */}
        <CreateUserModal
          open={createStudentModal}
          onOpenChange={setCreateStudentModal}
          userType="student"
          onSuccess={loadClassrooms}
        />
        
        <CreateClassroomModal
          open={createClassroomModal}
          onOpenChange={setCreateClassroomModal}
          onSuccess={loadClassrooms}
        />
      </div>
    </div>
  );
};
