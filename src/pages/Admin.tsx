import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { api, classroomApi, Classroom } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { User } from "@/types/auth";
import { ArrowLeft, LogOut, Plus, Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { CreateUserModal } from "@/components/CreateUserModal";
import { CreateClassroomModal } from "@/components/CreateClassroomModal";
import { EditUserModal } from "@/components/EditUserModal";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const Admin = () => {
  const { toast } = useToast();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Data states
  const [users, setUsers] = useState<User[]>([]);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  
  // Modal states
  const [createTeacherModal, setCreateTeacherModal] = useState(false);
  const [createStudentModal, setCreateStudentModal] = useState(false);
  const [createClassroomModal, setCreateClassroomModal] = useState(false);
  const [editUserModal, setEditUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

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

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setEditUserModal(true);
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await api.delete(userId);
      toast({
        title: "Usuário excluído com sucesso!",
      });
      loadData();
    } catch (error) {
      toast({
        title: "Erro ao excluir usuário",
        variant: "destructive",
      });
    }
  };

  const openDeleteDialog = (user: User) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const handleBack = () => {
    navigate('/dashboard');
  };

  const handleLogout = () => {
    logout();
    navigate('/auth');
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
      <div className="max-w-6xl mx-auto">
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
          <h1 className="text-3xl font-bold text-center mb-2">Painel Administrativo</h1>
          <p className="text-muted-foreground text-center">Bem-vindo, {user?.name}</p>
        </div>

        <Tabs defaultValue="list-teachers" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="list-teachers">Professores</TabsTrigger>
            <TabsTrigger value="list-students">Alunos</TabsTrigger>
            <TabsTrigger value="list-classrooms">Turmas</TabsTrigger>
          </TabsList>

          <TabsContent value="list-teachers">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Professores Cadastrados ({teachers.length})</CardTitle>
                <Button onClick={() => setCreateTeacherModal(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Professor
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Nome</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Data de Criação</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {teachers.map((teacher) => (
                      <TableRow key={teacher.id}>
                        <TableCell>{teacher.id}</TableCell>
                        <TableCell>{teacher.name}</TableCell>
                        <TableCell>{teacher.email}</TableCell>
                        <TableCell>{teacher.createdAt || 'N/A'}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleEditUser(teacher)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => openDeleteDialog(teacher)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
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
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Alunos Cadastrados ({students.length})</CardTitle>
                <Button onClick={() => setCreateStudentModal(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Aluno
                </Button>
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
                      <TableHead>Ações</TableHead>
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
                        <TableCell>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleEditUser(student)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => openDeleteDialog(student)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
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
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Turmas Cadastradas ({classrooms.length})</CardTitle>
                <Button onClick={() => setCreateClassroomModal(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Turma
                </Button>
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

        {/* Modals */}
        <CreateUserModal
          open={createTeacherModal}
          onOpenChange={setCreateTeacherModal}
          userType="teacher"
          onSuccess={loadData}
        />
        
        <CreateUserModal
          open={createStudentModal}
          onOpenChange={setCreateStudentModal}
          userType="student"
          onSuccess={loadData}
        />
        
        <CreateClassroomModal
          open={createClassroomModal}
          onOpenChange={setCreateClassroomModal}
          onSuccess={loadData}
        />
        
        <EditUserModal
          open={editUserModal}
          onOpenChange={setEditUserModal}
          user={selectedUser}
          onSuccess={loadData}
        />

        {/* Delete Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir {userToDelete?.role === "teacher" ? "o professor" : "o aluno"} {userToDelete?.name}?
                Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  if (userToDelete) {
                    handleDeleteUser(userToDelete.id);
                    setDeleteDialogOpen(false);
                    setUserToDelete(null);
                  }
                }}
              >
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};