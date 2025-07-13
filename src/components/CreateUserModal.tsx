import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";

interface CreateUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userType: "teacher" | "student";
  onSuccess: () => void;
}

export const CreateUserModal = ({
  open,
  onOpenChange,
  userType,
  onSuccess,
}: CreateUserModalProps) => {
  const { toast } = useToast();
  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    password: "",
    classCode: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.register({
        ...userForm,
        role: userType,
        ...(userType === "teacher" && { classCode: "" }),
      });

      toast({
        title: `${
          userType === "teacher" ? "Professor" : "Aluno"
        } cadastrado com sucesso!`,
      });

      setUserForm({ name: "", email: "", password: "", classCode: "" });
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: `Erro ao cadastrar ${
          userType === "teacher" ? "professor" : "aluno"
        }`,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Cadastrar {userType === "teacher" ? "Professor" : "Aluno"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              value={userForm.name}
              onChange={(e) =>
                setUserForm({ ...userForm, name: e.target.value })
              }
              required
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={userForm.email}
              onChange={(e) =>
                setUserForm({ ...userForm, email: e.target.value })
              }
              required
            />
          </div>
          <div>
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              value={userForm.password}
              onChange={(e) =>
                setUserForm({ ...userForm, password: e.target.value })
              }
              required
            />
          </div>
          {userType === "student" && (
            <div>
              <Label htmlFor="classCode">Código da Turma</Label>
              <Input
                id="classCode"
                value={userForm.classCode}
                onChange={(e) =>
                  setUserForm({ ...userForm, classCode: e.target.value })
                }
                required
              />
            </div>
          )}
          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button type="submit" className="flex-1">
              Cadastrar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
