import React, { useState } from 'react';
import { useAuth } from '@/context/SupabaseAuthContext';
import { Header } from '@/components/Header';
import { Home } from '@/pages/Home';
import { AdminDashboard } from '@/components/AdminDashboard';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import CurrentTime from '@/components/CurrentTime';
import ScrollingAnnouncements from '@/components/ScrollingAnnouncements';

const Index = () => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Scrolling Announcements */}
      <ScrollingAnnouncements />
      
      {/* Current Time */}
      <div className="container mx-auto px-4 py-3">
        <CurrentTime />
      </div>
      
      <Header />
      
      <main>
        {user && profile ? (
          <div className="container mx-auto px-4 py-8">
            <AdminDashboard />
          </div>
        ) : (
          <>
            <Home />
            <div className="fixed bottom-8 right-8">
              <Button 
                onClick={() => navigate('/auth')}
                className="donation-button shadow-lg"
                size="lg"
              >
                Admin Login
              </Button>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Index;
