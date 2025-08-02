import React from 'react';
import { LogOut, User, Mail, Calendar, IdCard, Settings, Edit3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

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

interface UserProfileProps {
  user: User;
  medicineCount: number;
  completionRate: number;
  onLogout: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ 
  user, 
  medicineCount, 
  completionRate, 
  onLogout 
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getCompletionBadge = (rate: number) => {
    if (rate >= 90) return { color: 'bg-success/15 text-success border-success/30', label: 'Excellent' };
    if (rate >= 70) return { color: 'bg-primary/15 text-primary border-primary/30', label: 'Good' };
    if (rate >= 50) return { color: 'bg-warning/15 text-warning border-warning/30', label: 'Fair' };
    return { color: 'bg-destructive/15 text-destructive border-destructive/30', label: 'Needs Attention' };
  };

  const completionBadge = getCompletionBadge(completionRate);

  return (
    <Card className="medical-card">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl text-foreground flex items-center">
            <User className="w-5 h-5 mr-2 text-primary" />
            User Profile
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="medical-btn-secondary"
            >
              <Edit3 className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button
              onClick={onLogout}
              variant="outline"
              size="sm"
              className="medical-btn-danger"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Profile Header */}
        <div className="flex items-center space-x-4">
          <Avatar className="w-16 h-16 border-4 border-primary/20">
            <AvatarFallback className="bg-gradient-medical text-white text-lg font-bold">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-foreground">{user.name}</h3>
            <p className="text-muted-foreground flex items-center">
              <Mail className="w-4 h-4 mr-1" />
              {user.email}
            </p>
            {user.medicalId && (
              <p className="text-sm text-muted-foreground flex items-center mt-1">
                <IdCard className="w-4 h-4 mr-1" />
                Medical ID: {user.medicalId}
              </p>
            )}
          </div>
        </div>

        {/* User Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-primary/5 rounded-xl border border-primary/20">
            <div className="text-2xl font-bold text-primary">{medicineCount}</div>
            <div className="text-xs text-muted-foreground">Medicines</div>
          </div>
          
          <div className="text-center p-3 bg-success/5 rounded-xl border border-success/20">
            <div className="text-2xl font-bold text-success">{completionRate}%</div>
            <div className="text-xs text-muted-foreground">Completion</div>
          </div>
          
          {user.age && (
            <div className="text-center p-3 bg-secondary/5 rounded-xl border border-secondary/20">
              <div className="text-2xl font-bold text-secondary">{user.age}</div>
              <div className="text-xs text-muted-foreground">Years Old</div>
            </div>
          )}
          
          <div className="text-center p-3 bg-muted/50 rounded-xl border border-border">
            <div className="text-sm font-bold text-foreground">
              {Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24))}
            </div>
            <div className="text-xs text-muted-foreground">Days Active</div>
          </div>
        </div>

        {/* Health Status */}
        <div className="space-y-3">
          <h4 className="font-semibold text-foreground flex items-center">
            <Settings className="w-4 h-4 mr-2 text-primary" />
            Health Status
          </h4>
          
          <div className="flex items-center justify-between p-3 bg-muted/30 rounded-xl">
            <span className="text-sm text-foreground">Medication Adherence</span>
            <Badge variant="outline" className={completionBadge.color}>
              {completionBadge.label}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-muted/30 rounded-xl">
            <span className="text-sm text-foreground">Account Status</span>
            <Badge variant="outline" className="bg-success/15 text-success border-success/30">
              Active
            </Badge>
          </div>
        </div>

        {/* Account Info */}
        <div className="space-y-3">
          <h4 className="font-semibold text-foreground flex items-center">
            <Calendar className="w-4 h-4 mr-2 text-primary" />
            Account Information
          </h4>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center p-3 bg-muted/30 rounded-xl">
              <span className="text-muted-foreground">Member Since</span>
              <span className="text-foreground font-medium">{formatDate(user.createdAt)}</span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-muted/30 rounded-xl">
              <span className="text-muted-foreground">Account Type</span>
              <span className="text-foreground font-medium">Healthcare Professional</span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-muted/30 rounded-xl">
              <span className="text-muted-foreground">Last Login</span>
              <span className="text-foreground font-medium">Today</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="pt-4 border-t border-border">
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="medical-btn-secondary">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Button variant="outline" className="medical-btn-secondary">
              <Calendar className="w-4 h-4 mr-2" />
              Schedule
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserProfile;