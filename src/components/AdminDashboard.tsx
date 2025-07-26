import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/SupabaseAuthContext';
import { Person, Donation } from '@/types/supabase';
import { AdminActivityLog, logAdminActivity } from '@/components/AdminActivityLog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Users, IndianRupee, TrendingUp, Eye, Calendar, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import ScheduleManagement from '@/components/ScheduleManagement';
import FinancialSummary from '@/components/FinancialSummary';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const AdminDashboard: React.FC = () => {
  const { profile } = useAuth();
  const [persons, setPersons] = useState<any[]>([]);
  const [donations, setDonations] = useState<any[]>([]);
  const [isAddPersonOpen, setIsAddPersonOpen] = useState(false);
  const [newPerson, setNewPerson] = useState({
    name: '',
    address: '',
    phoneNumber: '',
    amountPaid: '',
    paymentMethod: 'handcash' as 'handcash' | 'phonepay',
  });
  const { toast } = useToast();

  // Load data on mount
  useEffect(() => {
    if (profile) {
      loadPersons();
      loadDonations();
    }
  }, [profile]);

  const loadPersons = async () => {
    try {
      const { data, error } = await supabase
        .from('persons')
        .select('*')
        .eq('admin_id', profile?.user_id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPersons(data || []);
    } catch (error) {
      console.error('Error loading persons:', error);
      toast({
        title: "Error",
        description: "Failed to load persons data",
        variant: "destructive",
      });
    }
  };

  const loadDonations = async () => {
    try {
      const { data, error } = await supabase
        .from('donations')
        .select('*')
        .eq('receiving_admin_id', profile?.user_id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDonations(data || []);
    } catch (error) {
      console.error('Error loading donations:', error);
      toast({
        title: "Error",
        description: "Failed to load donations data",
        variant: "destructive",
      });
    }
  };

  const handleAddPerson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    try {
      const { data, error } = await supabase
        .from('persons')
        .insert([
          {
            name: newPerson.name,
            address: newPerson.address,
            phone_number: newPerson.phoneNumber,
            admin_id: profile.user_id,
            admin_name: profile.name,
            amount_paid: parseFloat(newPerson.amountPaid),
            payment_method: newPerson.paymentMethod,
          }
        ])
        .select();

      if (error) throw error;

      // Log the activity
      logAdminActivity(
        profile.user_id,
        profile.name,
        'Added person with payment',
        `Added ${newPerson.name} from ${newPerson.address} with ₹${newPerson.amountPaid} payment via ${newPerson.paymentMethod}`
      );

      setNewPerson({ name: '', address: '', phoneNumber: '', amountPaid: '', paymentMethod: 'handcash' });
      setIsAddPersonOpen(false);
      loadPersons(); // Reload data

      toast({
        title: "Person Added",
        description: `${newPerson.name} has been added to your list.`,
      });
    } catch (error: any) {
      console.error('Error adding person:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add person",
        variant: "destructive",
      });
    }
  };

  const totalDonations = donations.reduce((sum, d) => sum + Number(d.amount), 0);
  const handCashTotal = donations.filter(d => d.payment_method === 'handcash').reduce((sum, d) => sum + Number(d.amount), 0);
  const phonePeTotal = donations.filter(d => d.payment_method === 'phonepay').reduce((sum, d) => sum + Number(d.amount), 0);

  if (!profile) return null;

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="text-center py-8">
        <h1 className="text-3xl font-bold ganesh-gradient bg-clip-text text-transparent">
          Welcome, {profile.name}
        </h1>
        <p className="text-muted-foreground mt-2">Manage Depur Vinayaka Chavithi 2k25 Collection</p>
      </div>

      {/* Advanced Admin Dashboard with Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="people" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            People
          </TabsTrigger>
          <TabsTrigger value="financial" className="flex items-center gap-2">
            <IndianRupee className="w-4 h-4" />
            Financial
          </TabsTrigger>
          <TabsTrigger value="schedule" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Schedule
          </TabsTrigger>
          <TabsTrigger value="donations" className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Donations
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Activity
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="festival-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total People</CardTitle>
                <Users className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{persons.length}</div>
                <p className="text-xs text-muted-foreground">People in your list</p>
              </CardContent>
            </Card>

            <Card className="festival-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
                <IndianRupee className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹{totalDonations}</div>
                <p className="text-xs text-muted-foreground">{donations.length} donations received</p>
              </CardContent>
            </Card>

            <Card className="festival-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Hand Cash</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹{handCashTotal}</div>
                <p className="text-xs text-muted-foreground">Cash collections</p>
              </CardContent>
            </Card>

            <Card className="festival-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">PhonePe/UPI</CardTitle>
                <TrendingUp className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹{phonePeTotal}</div>
                <p className="text-xs text-muted-foreground">Digital payments</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          {donations.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Recent Donations</h3>
              <Card className="festival-card">
                <CardContent className="p-0">
                  <div className="space-y-0">
                    {donations.slice(0, 5).map((donation, index) => (
                      <div key={donation.id} className={`p-4 ${index !== donations.slice(0, 5).length - 1 ? 'border-b border-border' : ''}`}>
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">{donation.person_name}</p>
                            <p className="text-sm text-muted-foreground">
                              by {donation.donor_name || 'Anonymous'}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-primary">₹{donation.amount}</p>
                            <Badge variant={donation.payment_method === 'handcash' ? 'default' : 'secondary'}>
                              {donation.payment_method === 'handcash' ? 'Hand Cash' : 'PhonePe'}
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
        </TabsContent>

        {/* People Management Tab */}
        <TabsContent value="people" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">People Management</h3>
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
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount Paid *</Label>
                    <Input
                      id="amount"
                      type="number"
                      value={newPerson.amountPaid}
                      onChange={(e) => setNewPerson(prev => ({ ...prev, amountPaid: e.target.value }))}
                      placeholder="Enter amount paid"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="paymentMethod">Payment Method *</Label>
                    <select 
                      id="paymentMethod"
                      value={newPerson.paymentMethod}
                      onChange={(e) => setNewPerson(prev => ({ ...prev, paymentMethod: e.target.value as 'handcash' | 'phonepay' }))}
                      className="w-full px-3 py-2 border border-input bg-background rounded-md"
                      required
                    >
                      <option value="handcash">Hand Cash</option>
                      <option value="phonepay">PhonePe/UPI</option>
                    </select>
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
                  <p className="text-sm text-muted-foreground mb-3">{person.phone_number}</p>
                  <div className="flex justify-between items-center mb-3">
                    <Badge variant="outline">₹{person.amount_paid}</Badge>
                    <Badge variant={person.payment_method === 'handcash' ? 'default' : 'secondary'}>
                      {person.payment_method === 'handcash' ? 'Cash' : 'Digital'}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <Badge variant="secondary">
                      {new Date(person.created_at).toLocaleDateString()}
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
        </TabsContent>

        {/* Financial Tab */}
        <TabsContent value="financial" className="space-y-6">
          <FinancialSummary />
        </TabsContent>

        {/* Schedule Tab */}
        <TabsContent value="schedule" className="space-y-6">
          <ScheduleManagement />
        </TabsContent>

        {/* Donations Tab */}
        <TabsContent value="donations" className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">All Donations</h3>
            {donations.length > 0 ? (
              <div className="grid gap-4">
                {donations.map((donation) => (
                  <Card key={donation.id} className="festival-card">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <h4 className="font-medium">{donation.person_name}</h4>
                          <p className="text-sm text-muted-foreground">
                            Donated by: {donation.donor_name || 'Anonymous'}
                          </p>
                          {donation.donor_phone && (
                            <p className="text-sm text-muted-foreground">
                              Phone: {donation.donor_phone}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground">
                            {new Date(donation.created_at).toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right space-y-2">
                          <div className="text-xl font-bold text-primary">₹{donation.amount}</div>
                          <Badge variant={donation.payment_method === 'handcash' ? 'default' : 'secondary'}>
                            {donation.payment_method === 'handcash' ? 'Hand Cash' : 'PhonePe/UPI'}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="festival-card">
                <CardContent className="text-center py-12">
                  <IndianRupee className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Donations Yet</h3>
                  <p className="text-muted-foreground">
                    Donations will appear here as they are received.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Activity Log Tab */}
        <TabsContent value="settings" className="space-y-6">
          <AdminActivityLog />
        </TabsContent>
      </Tabs>
    </div>
  );
};