import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { api, classroomApi, Classroom } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { User } from "@/types/auth";

export const Admin = () => {
  const { toast } = useToast();
  const { user } = useAuth();

  // Teacher form state
  const [teacherForm, setTeacherForm] = useState({
    name: "",
    email: "",
    password: "",
  });

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

  // Data states
  const [users, setUsers] = useState<User[]>([]);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);

  // Load data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [usersData, classroomsData] = await Promise.all([
        api.getAll(),
        classroomApi.getAll()
      ]);
      setUsers(usersData);
      setClassrooms(classroomsData);
    } catch (error) {
      toast({
        title: "Erro ao carregar dados",
        variant: "destructive",
      });
    }
  };

  const teachers = users.filter(u => u.role === "teacher");
  const students = users.filter(u => u.role === "student");

  const handleTeacherSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.register({
        ...teacherForm,
        role: "teacher",
        classCode: "",
      });
      toast({
        title: "Professor cadastrado com sucesso!",
      });
      setTeacherForm({ name: "", email: "", password: "" });
      loadData();
    } catch (error) {
      toast({
        title: "Erro ao cadastrar professor",
        variant: "destructive",
      });
    }
  };

  const handleStudentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.register({
        ...studentForm,
        role: "student",
      });
      toast({
        title: "Aluno cadastrado com sucesso!",
      });
      setStudentForm({ name: "", email: "", password: "", classCode: "" });
      loadData();
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
      await classroomApi.create(classroomForm.name, classroomForm.password, Number(user.id));
      toast({
        title: "Turma cadastrada com sucesso!",
      });
      setClassroomForm({ name: "", password: "" });
      loadData();
    } catch (error) {
      toast({
        title: "Erro ao cadastrar turma",
        variant: "destructive",
      });
    }
  };

  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-96">
          <CardHeader>
            <CardTitle>Acesso Negado</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Apenas administradores podem acessar esta página.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-primary/10 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-center mb-2">Painel Administrativo</h1>
          <p className="text-muted-foreground text-center">Bem-vindo, {user?.name}</p>
        </div>

        <Tabs defaultValue="teachers" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="teachers">Cadastrar Professores</TabsTrigger>
            <TabsTrigger value="students">Cadastrar Alunos</TabsTrigger>
            <TabsTrigger value="classrooms">Cadastrar Turmas</TabsTrigger>
            <TabsTrigger value="list-teachers">Ver Professores</TabsTrigger>
            <TabsTrigger value="list-students">Ver Alunos</TabsTrigger>
            <TabsTrigger value="list-classrooms">Ver Turmas</TabsTrigger>
          </TabsList>

          <TabsContent value="teachers">
            <Card>
              <CardHeader>
                <CardTitle>Cadastro de Professores</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleTeacherSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="teacher-name">Nome</Label>
                    <Input
                      id="teacher-name"
                      value={teacherForm.name}
                      onChange={(e) => setTeacherForm({ ...teacherForm, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="teacher-email">Email</Label>
                    <Input
                      id="teacher-email"
                      type="email"
                      value={teacherForm.email}
                      onChange={(e) => setTeacherForm({ ...teacherForm, email: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="teacher-password">Senha</Label>
                    <Input
                      id="teacher-password"
                      type="password"
                      value={teacherForm.password}
                      onChange={(e) => setTeacherForm({ ...teacherForm, password: e.target.value })}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Cadastrar Professor
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

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
                      onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="student-email">Email</Label>
                    <Input
                      id="student-email"
                      type="email"
                      value={studentForm.email}
                      onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="student-password">Senha</Label>
                    <Input
                      id="student-password"
                      type="password"
                      value={studentForm.password}
                      onChange={(e) => setStudentForm({ ...studentForm, password: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="student-class">Código da Turma</Label>
                    <Input
                      id="student-class"
                      value={studentForm.classCode}
                      onChange={(e) => setStudentForm({ ...studentForm, classCode: e.target.value })}
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
                      onChange={(e) => setClassroomForm({ ...classroomForm, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="classroom-password">Código da Turma</Label>
                    <Input
                      id="classroom-password"
                      value={classroomForm.password}
                      onChange={(e) => setClassroomForm({ ...classroomForm, password: e.target.value })}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Cadastrar Turma
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="list-teachers">
            <Card>
              <CardHeader>
                <CardTitle>Professores Cadastrados ({teachers.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Nome</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Data de Criação</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {teachers.map((teacher) => (
                      <TableRow key={teacher.id}>
                        <TableCell>{teacher.id}</TableCell>
                        <TableCell>{teacher.name}</TableCell>
                        <TableCell>{teacher.email}</TableCell>
                        <TableCell>{teacher.createdAt || 'N/A'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {teachers.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Nenhum professor cadastrado.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="list-students">
            <Card>
              <CardHeader>
                <CardTitle>Alunos Cadastrados ({students.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Nome</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Turma</TableHead>
                      <TableHead>Pontuação</TableHead>
                      <TableHead>Data de Criação</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell>{student.id}</TableCell>
                        <TableCell>{student.name}</TableCell>
                        <TableCell>{student.email}</TableCell>
                        <TableCell>{student.classCode}</TableCell>
                        <TableCell>{student.score}</TableCell>
                        <TableCell>{student.createdAt || 'N/A'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {students.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Nenhum aluno cadastrado.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="list-classrooms">
            <Card>
              <CardHeader>
                <CardTitle>Turmas Cadastradas ({classrooms.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Nome</TableHead>
                      <TableHead>Código</TableHead>
                      <TableHead>Professor ID</TableHead>
                      <TableHead>Professor</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {classrooms.map((classroom) => {
                      const teacher = teachers.find(t => Number(t.id) === classroom.teacherId);
                      return (
                        <TableRow key={classroom.id}>
                          <TableCell>{classroom.id}</TableCell>
                          <TableCell>{classroom.name}</TableCell>
                          <TableCell>{classroom.password}</TableCell>
                          <TableCell>{classroom.teacherId}</TableCell>
                          <TableCell>{teacher?.name || 'Professor não encontrado'}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
                {classrooms.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Nenhuma turma cadastrada.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};