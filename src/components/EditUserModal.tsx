import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { User } from "@/types/auth";

interface EditUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  onSuccess: () => void;
}

export const EditUserModal = ({ open, onOpenChange, user, onSuccess }: EditUserModalProps) => {
  const { toast } = useToast();
  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    classCode: "",
  });

  useEffect(() => {
    if (user) {
      setUserForm({
        name: user.name,
        email: user.email,
        classCode: user.classCode || "",
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    try {
      await api.update(user.id, userForm);
      toast({
        title: "Usuário atualizado com sucesso!",
      });
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Erro ao atualizar usuário",
        variant: "destructive",
      });
    }
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar {user.role === "teacher" ? "Professor" : "Aluno"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="edit-name">Nome</Label>
            <Input
              id="edit-name"
              value={userForm.name}
              onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="edit-email">Email</Label>
            <Input
              id="edit-email"
              type="email"
              value={userForm.email}
              onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
              required
            />
          </div>
          {user.role === "student" && (
            <div>
              <Label htmlFor="edit-classCode">Código da Turma</Label>
              <Input
                id="edit-classCode"
                value={userForm.classCode}
                onChange={(e) => setUserForm({ ...userForm, classCode: e.target.value })}
              />
            </div>
          )}
          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1">
              Salvar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};