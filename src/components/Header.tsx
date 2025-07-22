import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, User, Heart } from 'lucide-react';
import lordGaneshImage from '@/assets/lord-ganesh.jpg';

interface HeaderProps {
  onLoginClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onLoginClick }) => {
  const { currentAdmin, logout } = useAuth();

  return (
    <header className="bg-card border-b border-border blessing-shadow sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary">
              <img 
                src={lordGaneshImage} 
                alt="Lord Ganesh" 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold ganesh-gradient bg-clip-text text-transparent">
                Depur Vinayaka Chavithi 2k25
              </h1>
              <p className="text-sm text-muted-foreground">Festival Collection Portal</p>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-primary">
              <Heart className="w-5 h-5" />
              <span className="font-medium">Ganpati Bappa Morya</span>
            </div>
            
            {currentAdmin ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-primary" />
                  <span className="font-medium">{currentAdmin.name}</span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={logout}
                  className="hover:bg-destructive hover:text-destructive-foreground"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              onLoginClick && (
                <Button variant="default" size="sm" onClick={onLoginClick}>
                  Admin Login
                </Button>
              )
            )}
          </div>
        </div>
      </div>
    </header>
  );
};