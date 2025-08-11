import React from 'react';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';
import { useAuth } from '@/context/SupabaseAuthContext';
import { useNavigate } from 'react-router-dom';

const MobileLoginFAB = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (user) return null;

  return (
    <Button
      onClick={() => navigate('/auth')}
      className="fixed bottom-4 right-4 z-50 md:hidden rounded-full h-14 w-14 shadow-lg"
      size="icon"
    >
      <LogIn className="h-6 w-6" />
    </Button>
  );
};

export default MobileLoginFAB;