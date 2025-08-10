import React from "react";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/SupabaseAuthContext";

export const MobileLoginFAB: React.FC = () => {
  const { user } = useAuth();

  if (user) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 block sm:hidden">
      <Link to="/auth" aria-label="Admin Login">
        <Button size="lg" className="rounded-full shadow-lg donation-button px-5 py-3">
          <LogIn className="w-5 h-5 mr-2" />
          Login
        </Button>
      </Link>
    </div>
  );
};
