import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { api, classroomApi, Classroom } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ClassRanking } from "@/components/ClassRanking";

export const Teacher = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);

  // Student form state
  const [studentForm, setStudentForm] = useState({
    name: "",
    email: "",
    password: "",
    classCode: "",
  });

  // Classroom form state
  const [classroomForm, setClassroomForm] = useState({
    name: "",
    password: "",
  });

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

  const validateClassCode = async (classCode: string): Promise<boolean> => {
    try {
      const classroom = await classroomApi.getByPassword(classCode);
      return classroom !== null;
    } catch (error) {
      return false;
    }
  };

  const generateClassCode = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setClassroomForm({ ...classroomForm, password: code });
  };

  const handleStudentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate class code
    const isValidCode = await validateClassCode(studentForm.classCode);
    if (!isValidCode) {
      toast({
        title: "Código de turma inválido",
        description: "O código da turma não existe.",
        variant: "destructive",
      });
      return;
    }

    try {
      await api.register({
        ...studentForm,
        role: "student",
      });
      toast({
        title: "Aluno cadastrado com sucesso!",
      });
      setStudentForm({ name: "", email: "", password: "", classCode: "" });
    } catch (error) {
      toast({
        title: "Erro ao cadastrar aluno",
        variant: "destructive",
      });
    }
  };

  const handleClassroomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    try {
      await classroomApi.create(
        classroomForm.name,
        classroomForm.password,
        Number(user.id)
      );
      toast({
        title: "Turma cadastrada com sucesso!",
        description: `Código gerado: ${classroomForm.password}`,
      });
      setClassroomForm({ name: "", password: "" });
      loadClassrooms(); // Reload classrooms
    } catch (error) {
      toast({
        title: "Erro ao cadastrar turma",
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
          <h1 className="text-3xl font-bold text-center mb-2">
            Painel do Professor
          </h1>
          <p className="text-muted-foreground text-center">
            Bem-vindo, {user?.name}
          </p>
        </div>

        <Tabs defaultValue="students" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="students">Alunos</TabsTrigger>
            <TabsTrigger value="classrooms">Turmas</TabsTrigger>
            <TabsTrigger value="manage">Gerenciar Turmas</TabsTrigger>
          </TabsList>

          <TabsContent value="students">
            <Card>
              <CardHeader>
                <CardTitle>Cadastro de Alunos</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleStudentSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="student-name">Nome</Label>
                    <Input
                      id="student-name"
                      value={studentForm.name}
                      onChange={(e) =>
                        setStudentForm({ ...studentForm, name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="student-email">Email</Label>
                    <Input
                      id="student-email"
                      type="email"
                      value={studentForm.email}
                      onChange={(e) =>
                        setStudentForm({
                          ...studentForm,
                          email: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="student-password">Senha</Label>
                    <Input
                      id="student-password"
                      type="password"
                      value={studentForm.password}
                      onChange={(e) =>
                        setStudentForm({
                          ...studentForm,
                          password: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="student-class">Código da Turma</Label>
                    <Input
                      id="student-class"
                      value={studentForm.classCode}
                      onChange={(e) =>
                        setStudentForm({
                          ...studentForm,
                          classCode: e.target.value,
                        })
                      }
                      placeholder="Digite o código da turma"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Cadastrar Aluno
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="classrooms">
            <Card>
              <CardHeader>
                <CardTitle>Cadastro de Turmas</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleClassroomSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="classroom-name">Nome da Turma</Label>
                    <Input
                      id="classroom-name"
                      value={classroomForm.name}
                      onChange={(e) =>
                        setClassroomForm({
                          ...classroomForm,
                          name: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="classroom-password">Código da Turma</Label>
                    <div className="flex gap-2">
                      <Input
                        id="classroom-password"
                        value={classroomForm.password}
                        onChange={(e) =>
                          setClassroomForm({
                            ...classroomForm,
                            password: e.target.value,
                          })
                        }
                        placeholder="Código será gerado automaticamente"
                        required
                        readOnly
                      />
                      <Button
                        type="button"
                        onClick={generateClassCode}
                        variant="outline"
                      >
                        Gerar Código
                      </Button>
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={!classroomForm.password}
                  >
                    Cadastrar Turma
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="manage">
            <Card>
              <CardHeader>
                <CardTitle>Turmas Cadastradas</CardTitle>
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
      </div>
    </div>
  );
};
