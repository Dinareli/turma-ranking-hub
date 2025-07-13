export interface UserRankings {
  id: number;
  studentId: number;
  clasroomId: number;
  weeklyPoints: number;
  generalPoints: number;
  studentName: string; // Added to hold the student's name
}
