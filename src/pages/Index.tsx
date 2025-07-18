import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Header } from '@/components/Header';
import { Home } from '@/pages/Home';
import { AdminDashboard } from '@/components/AdminDashboard';
import { LoginModal } from '@/components/LoginModal';
import { Button } from '@/components/ui/button';

const Index = () => {
  const { currentAdmin } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {currentAdmin ? (
          <div className="container mx-auto px-4 py-8">
            <AdminDashboard />
          </div>
        ) : (
          <>
            <Home />
            <div className="fixed bottom-8 right-8">
              <Button 
                onClick={() => setIsLoginModalOpen(true)}
                className="donation-button shadow-lg"
                size="lg"
              >
                Admin Login
              </Button>
            </div>
          </>
        )}
      </main>

      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
    </div>
  );
};

export default Index;
