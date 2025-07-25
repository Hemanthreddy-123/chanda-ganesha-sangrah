import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { PersonCard } from '@/components/PersonCard';
import { ContactInfo } from '@/components/ContactInfo';
import FinancialSummary from '@/components/FinancialSummary';
import ScheduleManagement from '@/components/ScheduleManagement';
import { supabase } from '@/integrations/supabase/client';
import { Person } from '@/types/supabase';
import lordGaneshImage from '@/assets/lord-ganesh.jpg';

export const Home = () => {
  const [persons, setPersons] = useState<Person[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

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
      <section className="hero-gradient py-20 px-4 text-center relative overflow-hidden">
        <div className="container mx-auto relative z-10">
          <div className="mb-8">
            <img 
              src={lordGaneshImage} 
              alt="Lord Ganesh" 
              className="w-32 h-32 mx-auto rounded-full border-4 border-white shadow-2xl object-cover mb-6"
            />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-4 hero-text">
            Depur Vinayaka Chavithi 2k25
          </h1>
          <p className="text-xl md:text-2xl mb-8 hero-text opacity-90">
            Festival Collection & Management System
          </p>
          
          <div className="mt-12">
            <p className="text-lg hero-text opacity-90 mb-4">
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
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-primary">
            Financial Overview
          </h2>
          <FinancialSummary />
        </div>
      </section>

      {/* Schedule Management */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <ScheduleManagement />
        </div>
      </section>

      {/* Search and Filter */}
      <section className="py-8 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-primary mb-4">Community Members</h2>
            <p className="text-muted-foreground">
              Our festival participants and their contributions
            </p>
          </div>
          
          <div className="relative mb-8 max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              type="text"
              placeholder="Search by name, address, or admin..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 py-3 text-lg"
            />
          </div>

          {/* People Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-muted rounded-lg h-48"></div>
                </div>
              ))}
            </div>
          ) : filteredPersons.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPersons.map((person) => (
                <PersonCard
                  key={person.id}
                  person={person}
                />
              ))}
            </div>
          ) : persons.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🎭</div>
              <h3 className="text-2xl font-semibold mb-4">No People Listed Yet</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                The admin team hasn't added any people to the collection list yet. 
                Please check back later or contact an admin.
              </p>
              <div className="text-primary font-semibold">
                Ganpati Bappa Morya - Mangalmurti Morya
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <Search className="w-16 h-16 text-muted-foreground mx-auto mb-6" />
              <h3 className="text-2xl font-semibold mb-4">No Results Found</h3>
              <p className="text-muted-foreground">
                No people found matching your search criteria. Try a different search term.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Contact Information */}
      <ContactInfo />
    </div>
  );
};