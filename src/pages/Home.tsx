import React, { useState, useEffect } from 'react';
import { Person, Donation } from '@/types';
import { PersonCard } from '@/components/PersonCard';
import { DonationModal } from '@/components/DonationModal';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Heart, Users, IndianRupee, Sparkles } from 'lucide-react';
import lordGaneshImage from '@/assets/lord-ganesh.jpg';

export const Home: React.FC = () => {
  const [persons, setPersons] = useState<Person[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);
  const [totalDonations, setTotalDonations] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    loadPersons();
    loadDonationStats();
  }, []);

  const loadPersons = () => {
    // In a real app, this would be a Firebase query
    const stored = localStorage.getItem('persons');
    if (stored) {
      setPersons(JSON.parse(stored));
    }
  };

  const loadDonationStats = () => {
    const stored = localStorage.getItem('donations');
    if (stored) {
      const donations: Donation[] = JSON.parse(stored);
      setTotalDonations(donations.length);
      setTotalAmount(donations.reduce((sum, d) => sum + d.amount, 0));
    }
  };

  const handleDonate = (person: Person) => {
    setSelectedPerson(person);
    setIsDonationModalOpen(true);
  };

  const handleDonationComplete = (donation: Donation) => {
    // Save donation to localStorage (in real app, save to Firebase)
    const stored = localStorage.getItem('donations');
    const allDonations = stored ? JSON.parse(stored) : [];
    allDonations.push(donation);
    localStorage.setItem('donations', JSON.stringify(allDonations));
    
    // Update stats
    loadDonationStats();
    setIsDonationModalOpen(false);
  };

  const filteredPersons = persons.filter(person =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.adminName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center">
        <div className="absolute inset-0 sacred-gradient opacity-10"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="mb-8">
            <img 
              src={lordGaneshImage} 
              alt="Lord Ganesh" 
              className="w-32 h-24 object-cover rounded-xl mx-auto mb-6 divine-shadow"
            />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="ganesh-gradient bg-clip-text text-transparent">
              गणेश चतुर्थी
            </span>
            <br />
            <span className="text-foreground">Chanda Collection</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join us in celebrating Lord Ganesh by contributing to our community collection. 
            Every donation brings blessings and supports our festive celebrations.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Badge variant="secondary" className="text-lg py-2 px-4">
              <Sparkles className="w-4 h-4 mr-2" />
              गणपति बाप्पा मोरया
            </Badge>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
            <Card className="festival-card">
              <CardContent className="text-center py-6">
                <Users className="w-8 h-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold">{persons.length}</div>
                <div className="text-sm text-muted-foreground">People Listed</div>
              </CardContent>
            </Card>
            
            <Card className="festival-card">
              <CardContent className="text-center py-6">
                <Heart className="w-8 h-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold">{totalDonations}</div>
                <div className="text-sm text-muted-foreground">Donations Made</div>
              </CardContent>
            </Card>
            
            <Card className="festival-card">
              <CardContent className="text-center py-6">
                <IndianRupee className="w-8 h-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold">₹{totalAmount}</div>
                <div className="text-sm text-muted-foreground">Total Collected</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="relative mb-8">
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
          {filteredPersons.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPersons.map((person) => (
                <PersonCard
                  key={person.id}
                  person={person}
                  onDonate={handleDonate}
                />
              ))}
            </div>
          ) : persons.length === 0 ? (
            <Card className="festival-card">
              <CardContent className="text-center py-16">
                <Users className="w-16 h-16 text-muted-foreground mx-auto mb-6" />
                <h3 className="text-2xl font-semibold mb-4">No People Listed Yet</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  The admin team hasn't added any people to the collection list yet. 
                  Please check back later or contact an admin.
                </p>
                <Badge variant="outline" className="text-sm">
                  गणपति बाप्पा मोरया - मंगलमूर्ति मोरया
                </Badge>
              </CardContent>
            </Card>
          ) : (
            <Card className="festival-card">
              <CardContent className="text-center py-16">
                <Search className="w-16 h-16 text-muted-foreground mx-auto mb-6" />
                <h3 className="text-2xl font-semibold mb-4">No Results Found</h3>
                <p className="text-muted-foreground">
                  No people found matching your search criteria. Try a different search term.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Donation Modal */}
      <DonationModal
        isOpen={isDonationModalOpen}
        onClose={() => setIsDonationModalOpen(false)}
        person={selectedPerson}
        onDonationComplete={handleDonationComplete}
      />
    </div>
  );
};