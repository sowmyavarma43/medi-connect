import React, { useState, useEffect } from 'react';
import { Heart, Stethoscope, Shield, Users, User as UserIcon, Bell, Activity } from 'lucide-react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MedicineForm from '@/components/MedicineForm';
import MedicineList from '@/components/MedicineList';
import MedicalStats from '@/components/MedicalStats';
import AuthForm from '@/components/AuthForm';
import UserProfile from '@/components/UserProfile';
import heroImage from '@/assets/medical-hero.jpg';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Medicine {
  id: string;
  name: string;
  dosage: string;
  time: string;
  frequency: string;
  taken: boolean;
  createdAt: string;
  userId: string;
}

interface User {
  id: string;
  email: string;
  name: string;
  password: string;
  createdAt: string;
  avatar?: string;
  age?: number;
  medicalId?: string;
}

const Index = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Initialize demo users
  useEffect(() => {
    const existingUsers = localStorage.getItem('medconnect-users');
    if (!existingUsers) {
      const demoUsers: User[] = [
        {
          id: 'user_demo1',
          email: 'doctor@test.com',
          name: 'Dr. Sarah Johnson',
          password: 'test123',
          age: 34,
          medicalId: 'MD12345',
          createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'user_demo2',
          email: 'admin@test.com',
          name: 'Admin User',
          password: 'test123',
          age: 28,
          medicalId: 'ADM001',
          createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];
      localStorage.setItem('medconnect-users', JSON.stringify(demoUsers));
      
      // Add demo medicines for the demo user
      const demoMedicines: Medicine[] = [
        {
          id: 'med_demo1',
          name: 'Aspirin',
          dosage: '100mg',
          time: '08:00',
          frequency: 'daily',
          taken: true,
          createdAt: new Date().toISOString(),
          userId: 'user_demo1'
        },
        {
          id: 'med_demo2',
          name: 'Vitamin D',
          dosage: '1000 IU',
          time: '12:00',
          frequency: 'daily',
          taken: false,
          createdAt: new Date().toISOString(),
          userId: 'user_demo1'
        },
        {
          id: 'med_demo3',
          name: 'Omega-3',
          dosage: '1 capsule',
          time: '18:00',
          frequency: 'daily',
          taken: false,
          createdAt: new Date().toISOString(),
          userId: 'user_demo1'
        }
      ];
      localStorage.setItem('medconnect-medicines', JSON.stringify(demoMedicines));
    }

    // Check if user is already logged in
    const savedUser = localStorage.getItem('medconnect-current-user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  // Load user-specific medicines when user changes
  useEffect(() => {
    if (currentUser) {
      const allMedicines: Medicine[] = JSON.parse(localStorage.getItem('medconnect-medicines') || '[]');
      const userMedicines = allMedicines.filter(med => med.userId === currentUser.id);
      setMedicines(userMedicines);
    } else {
      setMedicines([]);
    }
  }, [currentUser]);

  // Save medicines to localStorage whenever medicines change
  useEffect(() => {
    if (currentUser) {
      const allMedicines: Medicine[] = JSON.parse(localStorage.getItem('medconnect-medicines') || '[]');
      const otherUserMedicines = allMedicines.filter(med => med.userId !== currentUser.id);
      const updatedMedicines = [...otherUserMedicines, ...medicines];
      localStorage.setItem('medconnect-medicines', JSON.stringify(updatedMedicines));
    }
  }, [medicines, currentUser]);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('medconnect-current-user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setMedicines([]);
    localStorage.removeItem('medconnect-current-user');
    setActiveTab('dashboard');
  };

  const handleAddMedicine = (medicine: Omit<Medicine, 'userId'>) => {
    if (!currentUser) return;
    
    const medicineWithUser: Medicine = {
      ...medicine,
      userId: currentUser.id
    };
    setMedicines(prev => [...prev, medicineWithUser]);
  };

  const handleToggleTaken = (id: string) => {
    setMedicines(prev =>
      prev.map(medicine =>
        medicine.id === id
          ? { ...medicine, taken: !medicine.taken }
          : medicine
      )
    );
  };

  const handleDeleteMedicine = (id: string) => {
    setMedicines(prev => prev.filter(medicine => medicine.id !== id));
  };

  // If no user is logged in, show auth form
  if (!currentUser) {
    return <AuthForm onLogin={handleLogin} />;
  }

  const completionRate = medicines.length > 0 
    ? Math.round((medicines.filter(m => m.taken).length / medicines.length) * 100) 
    : 0;

  const features = [
    {
      icon: Heart,
      title: 'Smart Reminders',
      description: 'Never miss a dose with intelligent notifications'
    },
    {
      icon: Stethoscope,
      title: 'Professional Grade',
      description: 'Hospital-quality interface designed for healthcare'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your medical data stays safe and private'
    },
    {
      icon: Users,
      title: 'Family Friendly',
      description: 'Manage medications for your entire family'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header Navigation */}
      <header className="bg-gradient-medical shadow-medical sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">MedConnect</h1>
                <p className="text-white/80 text-sm">Welcome, {currentUser.name}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
              >
                <Bell className="w-5 h-5" />
              </Button>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="border-white/30 text-white hover:bg-white/20"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 bg-muted/50">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="medicines" className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              Medicines
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <UserIcon className="w-4 h-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="about" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              About
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-8">
            {/* Dashboard Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <MedicalStats medicines={medicines} />
              </div>
              <div className="lg:col-span-2">
                <Card className="medical-card">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Quick Actions</span>
                      <MedicineForm onAddMedicine={handleAddMedicine} />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <Button 
                        onClick={() => setActiveTab('medicines')}
                        className="medical-btn-secondary h-20 flex-col space-y-2"
                      >
                        <Heart className="w-8 h-8" />
                        <span>View Medicines</span>
                      </Button>
                      <Button 
                        onClick={() => setActiveTab('profile')}
                        className="medical-btn-secondary h-20 flex-col space-y-2"
                      >
                        <UserIcon className="w-8 h-8" />
                        <span>My Profile</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Recent Medicines Preview */}
            {medicines.length > 0 && (
              <Card className="medical-card">
                <CardHeader>
                  <CardTitle>Today's Medicines</CardTitle>
                </CardHeader>
                <CardContent>
                  <MedicineList
                    medicines={medicines.slice(0, 3)}
                    onToggleTaken={handleToggleTaken}
                    onDeleteMedicine={handleDeleteMedicine}
                  />
                  {medicines.length > 3 && (
                    <div className="mt-4 text-center">
                      <Button 
                        onClick={() => setActiveTab('medicines')}
                        variant="outline"
                        className="medical-btn-secondary"
                      >
                        View All Medicines ({medicines.length})
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="medicines" className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-foreground">Medicine Management</h2>
                <p className="text-muted-foreground">Manage your daily medications and track adherence</p>
              </div>
              <MedicineForm onAddMedicine={handleAddMedicine} />
            </div>
            
            <MedicineList
              medicines={medicines}
              onToggleTaken={handleToggleTaken}
              onDeleteMedicine={handleDeleteMedicine}
            />
          </TabsContent>

          <TabsContent value="profile" className="space-y-8">
            <UserProfile
              user={currentUser}
              medicineCount={medicines.length}
              completionRate={completionRate}
              onLogout={handleLogout}
            />
          </TabsContent>

          <TabsContent value="about" className="space-y-8">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-hero rounded-3xl">
              <div className="absolute inset-0 bg-secondary/90" />
              <div className="relative z-10 px-8 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <div className="text-center lg:text-left">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                      MedConnect
                      <span className="block text-primary text-2xl md:text-3xl mt-2">
                        Smart Medicine Reminder
                      </span>
                    </h1>
                    
                    <p className="text-xl text-white/80 mb-8">
                      Take control of your health with our professional-grade medication management system. 
                      Never miss a dose again.
                    </p>
                  </div>
                  
                  <div className="hidden lg:block">
                    <div className="relative">
                      <img 
                        src={heroImage} 
                        alt="Medical Dashboard" 
                        className="rounded-2xl shadow-2xl w-full h-auto"
                      />
                      <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-2xl" />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Features Section */}
            <section>
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Why Choose MedConnect?
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Built with healthcare professionals in mind, featuring enterprise-grade security 
                  and intuitive design for better health outcomes.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {features.map((feature, index) => (
                  <div key={index} className="medical-card p-6 text-center hover:shadow-card-hover transition-all duration-300">
                    <div className="w-16 h-16 bg-gradient-medical rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-medical">
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </TabsContent>
        </Tabs>
      </div>

      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        className="!font-sans"
        toastClassName="!bg-card !text-card-foreground !border !border-border !rounded-2xl !shadow-medical"
        progressClassName="!bg-gradient-medical"
      />
    </div>
  );
};

export default Index;