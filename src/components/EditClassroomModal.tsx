import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { classroomApi, Classroom } from "@/lib/api";

interface EditClassroomModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  classroom: Classroom | null;
  onSuccess: () => void;
}

export const EditClassroomModal = ({ open, onOpenChange, classroom, onSuccess }: EditClassroomModalProps) => {
  const { toast } = useToast();
  const [classroomForm, setClassroomForm] = useState({
    name: "",
    password: "",
  });

  useEffect(() => {
    if (classroom) {
      setClassroomForm({
        name: classroom.name,
        password: classroom.password,
      });
    }
  }, [classroom]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!classroom) return;
    
    try {
      await classroomApi.update(classroom.id, classroomForm);
      toast({
        title: "Turma atualizada com sucesso!",
      });
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Erro ao atualizar turma",
        variant: "destructive",
      });
    }
  };

  if (!classroom) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Turma</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="edit-classroom-name">Nome da Turma</Label>
            <Input
              id="edit-classroom-name"
              value={classroomForm.name}
              onChange={(e) => setClassroomForm({ ...classroomForm, name: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="edit-classroom-password">Código da Turma</Label>
            <Input
              id="edit-classroom-password"
              value={classroomForm.password}
              onChange={(e) => setClassroomForm({ ...classroomForm, password: e.target.value })}
              required
            />
          </div>
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