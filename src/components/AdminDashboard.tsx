import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Person, Donation } from '@/types';
import { AdminActivityLog, logAdminActivity } from '@/components/AdminActivityLog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Users, IndianRupee, TrendingUp, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const AdminDashboard: React.FC = () => {
  const { currentAdmin } = useAuth();
  const [persons, setPersons] = useState<Person[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [isAddPersonOpen, setIsAddPersonOpen] = useState(false);
  const [newPerson, setNewPerson] = useState({
    name: '',
    address: '',
    phoneNumber: '',
  });
  const { toast } = useToast();

  // Load data on mount
  useEffect(() => {
    loadPersons();
    loadDonations();
  }, [currentAdmin]);

  const loadPersons = () => {
    // In a real app, this would be a Firebase query
    const stored = localStorage.getItem('persons');
    if (stored) {
      const allPersons = JSON.parse(stored);
      setPersons(allPersons.filter((p: Person) => p.adminId === currentAdmin?.id));
    }
  };

  const loadDonations = () => {
    // In a real app, this would be a Firebase query
    const stored = localStorage.getItem('donations');
    if (stored) {
      const allDonations = JSON.parse(stored);
      setDonations(allDonations.filter((d: Donation) => d.receivingAdminId === currentAdmin?.id));
    }
  };

  const handleAddPerson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentAdmin) return;

    const person: Person = {
      id: `person_${Date.now()}`,
      name: newPerson.name,
      address: newPerson.address,
      phoneNumber: newPerson.phoneNumber,
      adminId: currentAdmin.id,
      adminName: currentAdmin.name,
      createdAt: new Date(),
    };

    // Save to localStorage (in real app, save to Firebase)
    const stored = localStorage.getItem('persons');
    const allPersons = stored ? JSON.parse(stored) : [];
    allPersons.push(person);
    localStorage.setItem('persons', JSON.stringify(allPersons));

    setPersons(prev => [...prev, person]);
    setNewPerson({ name: '', address: '', phoneNumber: '' });
    setIsAddPersonOpen(false);

    // Log the activity
    logAdminActivity(
      currentAdmin.id,
      currentAdmin.name,
      'Added person',
      `Added ${person.name} from ${person.address} to the collection list`
    );

    toast({
      title: "Person Added",
      description: `${person.name} has been added to your list.`,
    });
  };

  const totalDonations = donations.reduce((sum, d) => sum + d.amount, 0);
  const handCashTotal = donations.filter(d => d.paymentMethod === 'handcash').reduce((sum, d) => sum + d.amount, 0);
  const phonePeTotal = donations.filter(d => d.paymentMethod === 'phonepay').reduce((sum, d) => sum + d.amount, 0);

  if (!currentAdmin) return null;

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="text-center py-8">
        <h1 className="text-3xl font-bold ganesh-gradient bg-clip-text text-transparent">
          Welcome, {currentAdmin.name}
        </h1>
        <p className="text-muted-foreground mt-2">Manage Depur Vinayaka Chavithi 2k25 Collection</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="festival-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total People</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{persons.length}</div>
            <p className="text-xs text-muted-foreground">
              People in your list
            </p>
          </CardContent>
        </Card>

        <Card className="festival-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
            <IndianRupee className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalDonations}</div>
            <p className="text-xs text-muted-foreground">
              {donations.length} donations received
            </p>
          </CardContent>
        </Card>

        <Card className="festival-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hand Cash</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{handCashTotal}</div>
            <p className="text-xs text-muted-foreground">
              Cash collections
            </p>
          </CardContent>
        </Card>

        <Card className="festival-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">PhonePe/UPI</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{phonePeTotal}</div>
            <p className="text-xs text-muted-foreground">
              Digital payments
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Add Person Dialog */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Your People List</h2>
        <Dialog open={isAddPersonOpen} onOpenChange={setIsAddPersonOpen}>
          <DialogTrigger asChild>
            <Button className="donation-button">
              <Plus className="w-4 h-4 mr-2" />
              Add Person
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Person</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddPerson} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={newPerson.name}
                  onChange={(e) => setNewPerson(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter person's name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address *</Label>
                <Input
                  id="address"
                  value={newPerson.address}
                  onChange={(e) => setNewPerson(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="Enter address"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  value={newPerson.phoneNumber}
                  onChange={(e) => setNewPerson(prev => ({ ...prev, phoneNumber: e.target.value }))}
                  placeholder="Enter phone number"
                  required
                />
              </div>
              <Button type="submit" className="w-full donation-button">
                Add Person
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* People List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {persons.map((person) => (
          <Card key={person.id} className="festival-card">
            <CardHeader>
              <CardTitle className="text-lg">{person.name}</CardTitle>
              <CardDescription>{person.address}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">{person.phoneNumber}</p>
              <div className="flex justify-between items-center">
                <Badge variant="secondary">
                  Added {new Date(person.createdAt).toLocaleDateString()}
                </Badge>
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-2" />
                  View
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {persons.length === 0 && (
        <Card className="festival-card">
          <CardContent className="text-center py-12">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No People Added Yet</h3>
            <p className="text-muted-foreground mb-4">
              Start by adding people to your collection list.
            </p>
            <Button onClick={() => setIsAddPersonOpen(true)} className="donation-button">
              <Plus className="w-4 h-4 mr-2" />
              Add First Person
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Recent Donations */}
      {donations.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Recent Donations</h2>
          <Card className="festival-card">
            <CardContent className="p-0">
              <div className="space-y-0">
                {donations.slice(0, 5).map((donation, index) => (
                  <div key={donation.id} className={`p-4 ${index !== donations.length - 1 ? 'border-b border-border' : ''}`}>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{donation.personName}</p>
                        <p className="text-sm text-muted-foreground">
                          by {donation.donorName || 'Anonymous'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary">₹{donation.amount}</p>
                        <Badge variant={donation.paymentMethod === 'handcash' ? 'default' : 'secondary'}>
                          {donation.paymentMethod === 'handcash' ? 'Hand Cash' : 'PhonePe'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Admin Activity Log */}
      <AdminActivityLog />
    </div>
  );
};