import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Plus, Search, IndianRupee, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/SupabaseAuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface PeopleRecord {
  id: string;
  name: string;
  total_donations: number;
  upi_id?: string;
  admin_id: string;
  admin_name: string;
  created_at: string;
}

export const People: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [people, setPeople] = useState<PeopleRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    upi_id: ''
  });

  useEffect(() => {
    loadPeople();
  }, []);

  const loadPeople = async () => {
    try {
      const { data, error } = await supabase
        .from('people_management')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPeople(data || []);
    } catch (error) {
      console.error('Error loading people:', error);
      toast.error('Failed to load people data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddPerson = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !profile) {
      toast.error('Please login to add people');
      return;
    }

    if (!formData.name || !formData.amount) {
      toast.error('Please fill in name and amount');
      return;
    }

    try {
      const { error } = await supabase
        .from('people_management')
        .insert({
          name: formData.name,
          upi_id: formData.upi_id || null,
          admin_id: user.id,
          admin_name: profile.name,
          total_donations: Number(formData.amount),
          preferred_payment_method: 'cash',
          is_active: true
        });

      if (error) throw error;

      toast.success('Person added successfully!');
      setFormData({ name: '', amount: '', upi_id: '' });
      setIsAddModalOpen(false);
      loadPeople();
    } catch (error) {
      console.error('Error adding person:', error);
      toast.error('Failed to add person');
    }
  };

  const filteredPeople = people.filter(person =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.admin_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalAmount = people.reduce((sum, person) => sum + Number(person.total_donations || 0), 0);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>Please login to access the People page</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/donations')} className="w-full">
              Go Back to Donations
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-4 sm:py-8 px-2 sm:px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex-1">
            <Button 
              variant="outline" 
              onClick={() => navigate('/donations')}
              className="mb-4 w-full sm:w-auto"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Donations
            </Button>
            <h1 className="text-2xl sm:text-3xl font-bold ganesh-gradient bg-clip-text text-transparent">
              People Management
            </h1>
            <p className="text-muted-foreground mt-2 text-sm sm:text-base">
              Add and manage people with their contribution amounts
            </p>
          </div>
          <Button onClick={() => setIsAddModalOpen(true)} className="w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Add Person
          </Button>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <Card className="festival-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total People</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{people.length}</div>
              <p className="text-xs text-muted-foreground">
                People registered
              </p>
            </CardContent>
          </Card>

          <Card className="festival-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
              <IndianRupee className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">₹{totalAmount}</div>
              <p className="text-xs text-muted-foreground">
                Total contributions (display only)
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <Input
            type="text"
            placeholder="Search by name or admin..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12"
          />
        </div>

        {/* People Cards */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-muted rounded-lg h-32"></div>
              </div>
            ))}
          </div>
        ) : filteredPeople.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPeople.map((person) => (
              <Card key={person.id} className="festival-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{person.name}</CardTitle>
                  {person.upi_id && (
                    <CardDescription className="text-sm text-primary">
                      UPI: {person.upi_id}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Amount:</span>
                      <span className="text-lg font-bold text-primary">₹{person.total_donations}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Added by:</span>
                      <span className="text-sm font-medium">{person.admin_name}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(person.created_at).toLocaleDateString('en-IN')}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No People Found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm ? 'No people match your search criteria.' : 'No people have been added yet.'}
            </p>
            {!searchTerm && (
              <Button onClick={() => setIsAddModalOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add First Person
              </Button>
            )}
          </div>
        )}

        {/* Add Person Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Add New Person</CardTitle>
                <CardDescription>
                  Add a person with their contribution amount
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddPerson} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter person's name"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="amount">Amount *</Label>
                    <Input
                      id="amount"
                      type="number"
                      value={formData.amount}
                      onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                      placeholder="Enter amount"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="upi_id">UPI ID (Optional)</Label>
                    <Input
                      id="upi_id"
                      type="text"
                      value={formData.upi_id}
                      onChange={(e) => setFormData(prev => ({ ...prev, upi_id: e.target.value }))}
                      placeholder="example@upi"
                    />
                  </div>
                  
                  <div className="flex gap-2 pt-4">
                    <Button type="submit" className="flex-1">
                      Add Person
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsAddModalOpen(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};