import React from 'react';
import { useAuth } from '@/context/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, User, Heart, IndianRupee } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import lordGaneshImage from '@/assets/lord-ganesh.jpg';

interface HeaderProps {}

export const Header: React.FC<HeaderProps> = () => {
  const { user, profile, signOut } = useAuth();
  const location = useLocation();

  return (
    <header className="bg-card border-b border-border blessing-shadow sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <Link to="/" className="flex items-center space-x-4">
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
          </Link>

          {/* Navigation */}
          <div className="flex items-center space-x-4">
            {/* Navigation Links */}
            <div className="flex items-center space-x-4">
              <Link 
                to="/donations" 
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  location.pathname === '/donations' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'text-muted-foreground hover:text-primary'
                }`}
              >
                <IndianRupee className="w-4 h-4" />
                <span className="font-medium">Donations</span>
              </Link>
            </div>
            
            <div className="flex items-center space-x-2 text-primary">
              <Heart className="w-5 h-5" />
              <span className="font-medium">Ganpati Bappa Morya</span>
            </div>
            
            {user && profile ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-primary" />
                  <span className="font-medium">{profile.name}</span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={signOut}
                  className="hover:bg-destructive hover:text-destructive-foreground"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="hidden sm:block">
                <Button 
                  variant="default" 
                  size="sm" 
                  onClick={() => window.location.href = '/auth'}
                >
                  Admin Login
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};