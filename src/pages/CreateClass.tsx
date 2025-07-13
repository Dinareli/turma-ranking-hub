import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Plus, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { classroomApi } from "@/lib/api";

interface CreateClassroomProps {
    teacherId: string;
}

const CreateClass: React.FC<CreateClassroomProps> = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [className, setClassName] = useState("");
    const [passcode, setPasscode] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!className.trim() || !passcode.trim()) {
            toast({
                title: "Erro",
                description: "Todos os campos são obrigatórios",
                variant: "destructive",
            });
            return;
        }

        setLoading(true);

        try {
            if (!user?.id) {
                throw new Error("Usuário não encontrado");
            }

            await classroomApi.create(className, passcode, parseInt(user.id));
            
            toast({
                title: "Turma criada com sucesso!",
                description: `Código: ${passcode.toUpperCase()}`,
            });
            
            setClassName("");
            setPasscode("");
            setTimeout(() => navigate("/dashboard"), 2000);
        } catch (err) {
            toast({
                title: "Erro",
                description: "Falha ao criar turma. Verifique se o código não já existe.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    if (!user || user.role !== "teacher") {
        navigate("/dashboard");
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-card">
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-md mx-auto">
                    <div className="mb-6">
                        <Button
                            variant="ghost"
                            onClick={() => navigate("/dashboard")}
                            className="mb-4"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Voltar ao Dashboard
                        </Button>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold text-center bg-gradient-secondary bg-clip-text text-transparent">
                                Criar Nova Turma
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="className">Nome da Turma</Label>
                                    <Input
                                        id="className"
                                        type="text"
                                        placeholder="Ex: Matemática 2024"
                                        value={className}
                                        onChange={(e) => setClassName(e.target.value)}
                                        disabled={loading}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="passcode">Código da Turma</Label>
                                    <Input
                                        id="passcode"
                                        type="text"
                                        placeholder="Ex: MAT2024"
                                        value={passcode}
                                        onChange={(e) => setPasscode(e.target.value.toUpperCase())}
                                        disabled={loading}
                                        required
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full"
                                    variant="secondary"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                        <Plus className="mr-2 h-4 w-4" />
                                    )}
                                    {loading ? "Criando..." : "Criar Turma"}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default CreateClass;