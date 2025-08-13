import React, { useState, useEffect } from 'react';
import { Search, LogIn } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PersonCard } from '@/components/PersonCard';
import { ContactInfo } from '@/components/ContactInfo';
import FinancialSummary from '@/components/FinancialSummary';
import ScheduleManagement from '@/components/ScheduleManagement';
import { DonorInformation } from '@/components/DonorInformation';
import { LoginModal } from '@/components/LoginModal';
import { useAuth } from '@/context/SupabaseAuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Person } from '@/types/supabase';
import lordGaneshImage from '@/assets/lord-ganesh.jpg';

export const Home = () => {
  const [persons, setPersons] = useState<Person[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    loadPersons();
  }, []);

  const loadPersons = async () => {
    try {
      const { data, error } = await supabase
        .from('persons')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading persons:', error);
        return;
      }

      setPersons((data || []) as Person[]);
    } catch (error) {
      console.error('Error loading persons:', error);
    } finally {
      setLoading(false);
    }
  };


  const filteredPersons = persons.filter(person =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.admin_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-gradient py-16 sm:py-20 px-4 text-center relative overflow-hidden">
        <div className="container mx-auto relative z-10">
          {/* Admin Login Button - Hidden on mobile */}
          <div className="absolute top-4 right-4 z-20 hidden sm:block">
            {!user && (
              <Button 
                onClick={() => setIsLoginModalOpen(true)}
                variant="secondary"
                size="sm"
                className="bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Admin Login
              </Button>
            )}
          </div>

          <div className="mb-6 sm:mb-8">
            <img 
              src={lordGaneshImage} 
              alt="Lord Ganesh" 
              className="w-24 h-24 sm:w-32 sm:h-32 mx-auto rounded-full border-4 border-white shadow-2xl object-cover mb-4 sm:mb-6"
            />
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 hero-text">
            Depur Vinayaka Chavithi 2k25
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 hero-text opacity-90">
            Festival Collection & Management System
          </p>
          
          <div className="mt-8 sm:mt-12">
            <p className="text-base sm:text-lg hero-text opacity-90 mb-4">
              जय श्री गणेश! Welcome to our divine festival celebration
            </p>
            <p className="text-sm hero-text opacity-75">
              Managing collections with transparency and devotion
            </p>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 border-2 border-white rounded-full"></div>
          <div className="absolute top-32 right-16 w-16 h-16 border-2 border-white rounded-full"></div>
          <div className="absolute bottom-20 left-20 w-12 h-12 border-2 border-white rounded-full"></div>
          <div className="absolute bottom-10 right-10 w-24 h-24 border-2 border-white rounded-full"></div>
        </div>
      </section>

      {/* Enhanced Financial Summary */}
      <section className="py-12 sm:py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12 text-primary">
            Financial Overview
          </h2>
          <FinancialSummary />
        </div>
      </section>

      {/* Schedule Management */}
      <section className="py-12 sm:py-16 px-4">
        <div className="container mx-auto">
          <ScheduleManagement />
        </div>
      </section>

      {/* Donor Information */}
      <section className="py-12 sm:py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <DonorInformation />
        </div>
      </section>

      {/* Search and Filter */}
      <section className="py-6 sm:py-8 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-4">Community Members</h2>
            <p className="text-muted-foreground text-sm sm:text-base">
              Our festival participants and their contributions
            </p>
          </div>
          
          <div className="relative mb-6 sm:mb-8 max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              type="text"
              placeholder="Search by name, address, or admin..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 py-2 sm:py-3 text-base sm:text-lg"
            />
          </div>

          {/* People Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-muted rounded-lg h-40 sm:h-48"></div>
                </div>
              ))}
            </div>
          ) : filteredPersons.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredPersons.map((person) => (
                <PersonCard
                  key={person.id}
                  person={person}
                />
              ))}
            </div>
          ) : persons.length === 0 ? (
            <div className="text-center py-12 sm:py-16">
              <div className="text-4xl sm:text-6xl mb-4">🎭</div>
              <h3 className="text-xl sm:text-2xl font-semibold mb-4">No People Listed Yet</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto text-sm sm:text-base">
                The admin team hasn't added any people to the collection list yet. 
                Please check back later or contact an admin.
              </p>
              <div className="text-primary font-semibold text-sm sm:text-base">
                Ganpati Bappa Morya - Mangalmurti Morya
              </div>
            </div>
          ) : (
            <div className="text-center py-12 sm:py-16">
              <Search className="w-12 h-12 sm:w-16 sm:h-16 text-muted-foreground mx-auto mb-6" />
              <h3 className="text-xl sm:text-2xl font-semibold mb-4">No Results Found</h3>
              <p className="text-muted-foreground text-sm sm:text-base">
                No people found matching your search criteria. Try a different search term.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Contact Information */}
      <ContactInfo />

      {/* Mobile Admin Login Button */}
      {!user && (
        <div className="fixed bottom-4 right-4 z-50 sm:hidden">
          <Button 
            onClick={() => setIsLoginModalOpen(true)}
            size="lg"
            className="rounded-full shadow-lg donation-button"
          >
            <LogIn className="w-5 h-5 mr-2" />
            Admin
          </Button>
        </div>
      )}

      {/* Login Modal */}
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
    </div>
  );
};