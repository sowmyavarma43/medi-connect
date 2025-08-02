import React from 'react';
import { TrendingUp, Calendar, Pill, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Medicine {
  id: string;
  name: string;
  dosage: string;
  time: string;
  frequency: string;
  taken: boolean;
  createdAt: string;
}

interface MedicalStatsProps {
  medicines: Medicine[];
}

const MedicalStats: React.FC<MedicalStatsProps> = ({ medicines }) => {
  const totalMedicines = medicines.length;
  const takenToday = medicines.filter(m => m.taken).length;
  const completionRate = totalMedicines > 0 ? Math.round((takenToday / totalMedicines) * 100) : 0;
  
  const upcomingMedicine = medicines
    .filter(m => !m.taken)
    .sort((a, b) => a.time.localeCompare(b.time))[0];

  const stats = [
    {
      title: 'Total Medicines',
      value: totalMedicines,
      icon: Pill,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      borderColor: 'border-primary/20'
    },
    {
      title: 'Taken Today',
      value: takenToday,
      icon: TrendingUp,
      color: 'text-success',
      bgColor: 'bg-success/10',
      borderColor: 'border-success/20'
    },
    {
      title: 'Completion Rate',
      value: `${completionRate}%`,
      icon: Calendar,
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
      borderColor: 'border-secondary/20'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className={`medical-card border-2 ${stat.borderColor} hover:shadow-card-hover transition-all duration-300`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    {stat.title}
                  </p>
                  <p className={`text-3xl font-bold ${stat.color}`}>
                    {stat.value}
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Next Medicine Card */}
      {upcomingMedicine && (
        <Card className="medical-card border-2 border-warning/20 bg-warning/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center text-foreground">
              <Clock className="w-5 h-5 mr-2 text-warning" />
              Next Medicine
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-foreground mb-1">
                  {upcomingMedicine.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {upcomingMedicine.dosage} • {upcomingMedicine.time}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-medical rounded-2xl flex items-center justify-center shadow-medical">
                <Pill className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Progress Bar */}
      {totalMedicines > 0 && (
        <Card className="medical-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-foreground">Today's Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {takenToday} of {totalMedicines} medicines taken
                </span>
                <span className="font-semibold text-primary">
                  {completionRate}%
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                <div 
                  className="h-full bg-gradient-medical rounded-full transition-all duration-500 ease-out shadow-medical"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MedicalStats;