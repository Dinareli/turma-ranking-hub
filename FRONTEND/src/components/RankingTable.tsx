import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User } from '@/types/auth';
import { Trophy, Medal, Award, Star } from 'lucide-react';

interface RankingTableProps {
  students: User[];
  currentUser: User;
}

export const RankingTable: React.FC<RankingTableProps> = ({ students, currentUser }) => {
  const getRankIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Award className="h-5 w-5 text-orange-500" />;
      default:
        return <Star className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getRankBadgeVariant = (position: number) => {
    if (position === 1) return 'default';
    if (position <= 3) return 'secondary';
    return 'outline';
  };

  const isCurrentUser = (student: User) => student.id === currentUser.id;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-6 w-6" />
          Ranking da Turma {students[0]?.classCode}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {students.map((student, index) => {
            const position = index + 1;
            const isUser = isCurrentUser(student);
            
            return (
              <div
                key={student.id}
                className={`flex items-center justify-between p-4 rounded-lg transition-all duration-300 ${
                  isUser 
                    ? 'bg-gradient-primary text-primary-foreground shadow-primary/20 shadow-lg transform scale-105' 
                    : 'bg-muted/50 hover:bg-muted'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-background/20">
                    <Badge 
                      variant={getRankBadgeVariant(position)}
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                    >
                      #{position}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {getRankIcon(position)}
                    <div>
                      <h3 className={`font-semibold ${isUser ? 'text-primary-foreground' : 'text-foreground'}`}>
                        {student.name}
                        {isUser && (
                          <span className="ml-2 text-xs font-normal opacity-80">(Você)</span>
                        )}
                      </h3>
                      <p className={`text-sm ${isUser ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                        {student.email}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className={`text-2xl font-bold ${isUser ? 'text-primary-foreground' : 'text-foreground'}`}>
                    {student.score}
                  </div>
                  <div className={`text-xs ${isUser ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                    pontos
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {students.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Nenhum aluno encontrado nesta turma.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};