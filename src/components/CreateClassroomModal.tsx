import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { classroomApi } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

interface CreateClassroomModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const CreateClassroomModal = ({ open, onOpenChange, onSuccess }: CreateClassroomModalProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [classroomForm, setClassroomForm] = useState({
    name: "",
    password: "",
  });

  const generateClassCode = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setClassroomForm({ ...classroomForm, password: code });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;
    
    try {
      await classroomApi.create(classroomForm.name, classroomForm.password, Number(user.id));
      toast({
        title: "Turma cadastrada com sucesso!",
        description: `Código gerado: ${classroomForm.password}`,
      });
      setClassroomForm({ name: "", password: "" });
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Erro ao cadastrar turma",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cadastrar Turma</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
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
            <div className="flex gap-2">
              <Input
                id="classroom-password"
                value={classroomForm.password}
                onChange={(e) => setClassroomForm({ ...classroomForm, password: e.target.value })}
                placeholder="Código será gerado automaticamente"
                required
                readOnly
              />
              <Button type="button" onClick={generateClassCode} variant="outline">
                Gerar Código
              </Button>
            </div>
          </div>
          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1" disabled={!classroomForm.password}>
              Cadastrar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};