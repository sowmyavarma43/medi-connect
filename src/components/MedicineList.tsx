import React from 'react';
import { Clock, Pill, Check, RotateCcw, Trash2, Calendar } from 'lucide-react';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Medicine {
  id: string;
  name: string;
  dosage: string;
  time: string;
  frequency: string;
  taken: boolean;
  createdAt: string;
}

interface MedicineListProps {
  medicines: Medicine[];
  onToggleTaken: (id: string) => void;
  onDeleteMedicine: (id: string) => void;
}

const MedicineList: React.FC<MedicineListProps> = ({ 
  medicines, 
  onToggleTaken, 
  onDeleteMedicine 
}) => {
  const handleToggleTaken = (medicine: Medicine) => {
    onToggleTaken(medicine.id);
    
    if (!medicine.taken) {
      toast.success(`✅ ${medicine.name} marked as taken!`, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        className: 'medical-toast-success',
      });
    } else {
      toast.info(`🔄 ${medicine.name} marked as not taken`, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const handleDelete = (medicine: Medicine) => {
    onDeleteMedicine(medicine.id);
    toast.error(`🗑️ ${medicine.name} removed from your list`, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getFrequencyColor = (frequency: string) => {
    switch (frequency) {
      case 'daily': return 'bg-primary/10 text-primary border-primary/20';
      case 'twice-daily': return 'bg-warning/10 text-warning border-warning/20';
      case 'weekly': return 'bg-secondary/10 text-secondary border-secondary/20';
      case 'as-needed': return 'bg-muted text-muted-foreground border-border';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  if (medicines.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="mx-auto w-24 h-24 bg-gradient-medical rounded-3xl flex items-center justify-center mb-6 shadow-medical">
          <Pill className="w-12 h-12 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-3">No medicines added yet</h3>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          Start by adding your first medicine to create your personalized medication schedule.
        </p>
        <div className="w-16 h-1 bg-gradient-medical rounded-full mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Your Medicines</h2>
          <p className="text-muted-foreground">
            {medicines.filter(m => m.taken).length} of {medicines.length} taken today
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </span>
        </div>
      </div>

      <div className="grid gap-4">
        {medicines.map((medicine) => (
          <Card 
            key={medicine.id} 
            className={`medical-card group transition-all duration-300 hover:shadow-card-hover ${
              medicine.taken 
                ? 'bg-success/5 border-success/20' 
                : 'bg-gradient-card border-border hover:border-primary/30'
            }`}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                    medicine.taken 
                      ? 'bg-success text-success-foreground shadow-lg' 
                      : 'bg-gradient-medical text-white shadow-medical'
                  }`}>
                    {medicine.taken ? (
                      <Check className="w-6 h-6" />
                    ) : (
                      <Pill className="w-6 h-6" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className={`text-lg font-semibold transition-colors ${
                        medicine.taken ? 'text-success line-through' : 'text-foreground'
                      }`}>
                        {medicine.name}
                      </h3>
                      <Badge 
                        variant="outline" 
                        className={`text-xs font-medium ${getFrequencyColor(medicine.frequency)}`}
                      >
                        {medicine.frequency.replace('-', ' ')}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Pill className="w-4 h-4 mr-1 text-primary" />
                        <span className="font-medium">{medicine.dosage}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1 text-primary" />
                        <span className="font-medium">{formatTime(medicine.time)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    onClick={() => handleToggleTaken(medicine)}
                    size="sm"
                    className={`transition-all duration-300 ${
                      medicine.taken
                        ? 'medical-btn-secondary hover:bg-warning hover:text-warning-foreground'
                        : 'medical-btn-success hover:scale-105'
                    }`}
                  >
                    {medicine.taken ? (
                      <>
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Undo
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Take
                      </>
                    )}
                  </Button>

                  <Button
                    onClick={() => handleDelete(medicine)}
                    size="sm"
                    variant="outline"
                    className="medical-btn-danger opacity-0 group-hover:opacity-100 transition-all duration-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MedicineList;