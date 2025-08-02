import React, { useState } from 'react';
import { Plus, Pill, Clock, User } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Medicine {
  id: string;
  name: string;
  dosage: string;
  time: string;
  frequency: string;
  taken: boolean;
  createdAt: string;
}

interface MedicineFormProps {
  onAddMedicine: (medicine: Medicine) => void;
}

const MedicineForm: React.FC<MedicineFormProps> = ({ onAddMedicine }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    time: '',
    frequency: 'daily'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.dosage || !formData.time) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newMedicine: Medicine = {
      id: uuidv4(),
      name: formData.name,
      dosage: formData.dosage,
      time: formData.time,
      frequency: formData.frequency,
      taken: false,
      createdAt: new Date().toISOString()
    };

    onAddMedicine(newMedicine);
    toast.success(`${formData.name} added successfully!`, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });

    // Reset form
    setFormData({
      name: '',
      dosage: '',
      time: '',
      frequency: 'daily'
    });
    setIsOpen(false);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          className="medical-btn-primary group hover:shadow-card-hover transition-all duration-300"
          size="lg"
        >
          <Plus className="mr-2 h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
          Add Medicine
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md bg-gradient-card border-0 shadow-medical">
        <DialogHeader className="text-center pb-6">
          <div className="mx-auto w-16 h-16 bg-gradient-medical rounded-2xl flex items-center justify-center mb-4 shadow-medical">
            <Pill className="w-8 h-8 text-white" />
          </div>
          <DialogTitle className="text-2xl font-bold bg-gradient-medical bg-clip-text text-transparent">
            Add New Medicine
          </DialogTitle>
          <p className="text-muted-foreground">Set up your medication reminder</p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="medicine-name" className="text-sm font-semibold text-foreground flex items-center">
              <Pill className="w-4 h-4 mr-2 text-primary" />
              Medicine Name *
            </Label>
            <Input
              id="medicine-name"
              type="text"
              placeholder="e.g., Aspirin, Vitamin D"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="medical-input"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dosage" className="text-sm font-semibold text-foreground flex items-center">
              <User className="w-4 h-4 mr-2 text-primary" />
              Dosage *
            </Label>
            <Input
              id="dosage"
              type="text"
              placeholder="e.g., 500mg, 1 tablet, 2 capsules"
              value={formData.dosage}
              onChange={(e) => handleChange('dosage', e.target.value)}
              className="medical-input"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="time" className="text-sm font-semibold text-foreground flex items-center">
              <Clock className="w-4 h-4 mr-2 text-primary" />
              Time *
            </Label>
            <Input
              id="time"
              type="time"
              value={formData.time}
              onChange={(e) => handleChange('time', e.target.value)}
              className="medical-input"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="frequency" className="text-sm font-semibold text-foreground">
              Frequency
            </Label>
            <Select value={formData.frequency} onValueChange={(value) => handleChange('frequency', value)}>
              <SelectTrigger className="medical-input">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="twice-daily">Twice Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="as-needed">As Needed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1 medical-btn-secondary"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 medical-btn-primary"
            >
              Add Medicine
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MedicineForm;