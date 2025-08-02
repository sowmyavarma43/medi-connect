import React, { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff, UserPlus, LogIn } from 'lucide-react';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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

interface AuthFormProps {
  onLogin: (user: User) => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ onLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    age: '',
    medicalId: ''
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Get users from localStorage
    const users: User[] = JSON.parse(localStorage.getItem('medconnect-users') || '[]');
    const user = users.find(u => u.email === formData.email && u.password === formData.password);

    if (user) {
      onLogin(user);
      toast.success(`Welcome back, ${user.name}!`, {
        position: "top-right",
        autoClose: 2000,
      });
    } else {
      toast.error('Invalid email or password');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password || !formData.name) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Get existing users
    const users: User[] = JSON.parse(localStorage.getItem('medconnect-users') || '[]');
    
    // Check if user already exists
    if (users.find(u => u.email === formData.email)) {
      toast.error('User with this email already exists');
      return;
    }

    // Create new user
    const newUser: User = {
      id: `user_${Date.now()}`,
      email: formData.email,
      name: formData.name,
      password: formData.password,
      age: formData.age ? parseInt(formData.age) : undefined,
      medicalId: formData.medicalId || undefined,
      createdAt: new Date().toISOString()
    };

    // Save user
    users.push(newUser);
    localStorage.setItem('medconnect-users', JSON.stringify(users));

    onLogin(newUser);
    toast.success(`Account created successfully! Welcome, ${newUser.name}!`, {
      position: "top-right",
      autoClose: 3000,
    });
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-secondary/95" />
      
      <Card className="relative z-10 w-full max-w-md bg-gradient-card border-0 shadow-medical">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto w-20 h-20 bg-gradient-medical rounded-3xl flex items-center justify-center mb-6 shadow-medical">
            <User className="w-10 h-10 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-medical bg-clip-text text-transparent">
            MedConnect
          </CardTitle>
          <p className="text-muted-foreground">Secure Healthcare Access</p>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="login" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 bg-muted/50">
              <TabsTrigger value="login" className="flex items-center gap-2">
                <LogIn className="w-4 h-4" />
                Login
              </TabsTrigger>
              <TabsTrigger value="register" className="flex items-center gap-2">
                <UserPlus className="w-4 h-4" />
                Register
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email" className="text-sm font-semibold text-foreground flex items-center">
                    <Mail className="w-4 h-4 mr-2 text-primary" />
                    Email Address
                  </Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="doctor@medconnect.com"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="medical-input"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-password" className="text-sm font-semibold text-foreground flex items-center">
                    <Lock className="w-4 h-4 mr-2 text-primary" />
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) => handleChange('password', e.target.value)}
                      className="medical-input pr-12"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                <Button type="submit" className="w-full medical-btn-primary">
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-name" className="text-sm font-semibold text-foreground flex items-center">
                    <User className="w-4 h-4 mr-2 text-primary" />
                    Full Name *
                  </Label>
                  <Input
                    id="register-name"
                    type="text"
                    placeholder="Dr. John Smith"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className="medical-input"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-email" className="text-sm font-semibold text-foreground flex items-center">
                    <Mail className="w-4 h-4 mr-2 text-primary" />
                    Email Address *
                  </Label>
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="doctor@medconnect.com"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="medical-input"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="age" className="text-sm font-semibold text-foreground">
                      Age
                    </Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="25"
                      value={formData.age}
                      onChange={(e) => handleChange('age', e.target.value)}
                      className="medical-input"
                      min="1"
                      max="120"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="medical-id" className="text-sm font-semibold text-foreground">
                      Medical ID
                    </Label>
                    <Input
                      id="medical-id"
                      type="text"
                      placeholder="MD12345"
                      value={formData.medicalId}
                      onChange={(e) => handleChange('medicalId', e.target.value)}
                      className="medical-input"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-password" className="text-sm font-semibold text-foreground flex items-center">
                    <Lock className="w-4 h-4 mr-2 text-primary" />
                    Password *
                  </Label>
                  <div className="relative">
                    <Input
                      id="register-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create a secure password"
                      value={formData.password}
                      onChange={(e) => handleChange('password', e.target.value)}
                      className="medical-input pr-12"
                      required
                      minLength={6}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                <Button type="submit" className="w-full medical-btn-primary">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Create Account
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-xs text-center text-muted-foreground">
              Demo users: doctor@test.com / admin@test.com (password: test123)
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthForm;