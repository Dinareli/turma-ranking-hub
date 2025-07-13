import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginForm } from '@/components/LoginForm';
import { RegisterForm } from '@/components/RegisterForm';
import { GraduationCap, BookOpen, Trophy } from 'lucide-react';

export const Auth: React.FC = () => {
  const navigate = useNavigate();

  const handleAuthSuccess = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center mb-6">
            <div className="bg-white/10 p-4 rounded-full backdrop-blur-sm">
              <GraduationCap className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Turma Ranking Hub
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Acompanhe seu progresso e veja como você está no ranking da sua turma
          </p>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="text-center text-white">
            <div className="bg-white/10 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center backdrop-blur-sm">
              <Trophy className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Ranking Interativo</h3>
            <p className="text-white/70">Veja sua posição em tempo real</p>
          </div>
          <div className="text-center text-white">
            <div className="bg-white/10 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center backdrop-blur-sm">
              <BookOpen className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Progresso Detalhado</h3>
            <p className="text-white/70">Acompanhe seu desenvolvimento</p>
          </div>
          <div className="text-center text-white">
            <div className="bg-white/10 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center backdrop-blur-sm">
              <GraduationCap className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Ambiente Educacional</h3>
            <p className="text-white/70">Focado no aprendizado</p>
          </div>
        </div>

        {/* Auth Forms */}
        <div className="grid lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="order-2 lg:order-1">
            <LoginForm onSuccess={handleAuthSuccess} />
          </div>
          <div className="order-1 lg:order-2">
            <RegisterForm onSuccess={handleAuthSuccess} />
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-white/60">
          <p>© 2024 Turma Ranking Hub - Plataforma Educacional</p>
        </div>
      </div>
    </div>
  );
};