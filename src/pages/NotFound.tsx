import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-card flex items-center justify-center p-4">
      <Card className="max-w-md mx-auto text-center">
        <CardHeader>
          <CardTitle className="text-6xl font-bold text-muted-foreground mb-4">
            404
          </CardTitle>
          <h1 className="text-2xl font-bold text-foreground">
            Página não encontrada
          </h1>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            A página que você está procurando não existe ou foi removida.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={() => navigate(-1)}
              variant="outline"
              className="flex-1"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
            <Button 
              onClick={() => navigate('/')}
              variant="default"
              className="flex-1"
            >
              <Home className="mr-2 h-4 w-4" />
              Início
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;