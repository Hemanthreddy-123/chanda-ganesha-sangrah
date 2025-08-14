import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Search, Gift, Phone, Calendar, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/SupabaseAuthContext';
import { useUserRole } from '@/hooks/useUserRole';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Donor {
  id: string;
  donor_name: string;
  donor_phone?: string;
  items_donated?: string;
  amount: number;
  receiving_admin_name: string;
  created_at: string;
}

export const Donors: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { isAdmin } = useUserRole();
  const [donors, setDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadDonors();
  }, []);

  const loadDonors = async () => {
    try {
      const { data, error } = await supabase
        .from('donations')
        .select('*')
        .not('items_donated', 'is', null)
        .order('amount', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDonors(data || []);
    } catch (error) {
      console.error('Error loading donors:', error);
      toast.error('Failed to load donors data');
    } finally {
      setLoading(false);
    }
  };

  const filteredDonors = donors.filter(donor =>
    donor.donor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    donor.receiving_admin_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (donor.items_donated && donor.items_donated.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalValue = donors.reduce((sum, donor) => sum + Number(donor.amount || 0), 0);

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
              Item Donors
            </h1>
            <p className="text-muted-foreground mt-2 text-sm sm:text-base">
              Community members who have contributed items for our festival
            </p>
          </div>
          {isAdmin && (
            <Button onClick={() => navigate('/donations')} className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Donor
            </Button>
          )}
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <Card className="festival-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Donors</CardTitle>
              <Gift className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{donors.length}</div>
              <p className="text-xs text-muted-foreground">
                Item contributors
              </p>
            </CardContent>
          </Card>

          <Card className="festival-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Estimated Value</CardTitle>
              <Gift className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">₹{totalValue}</div>
              <p className="text-xs text-muted-foreground">
                Estimated value of all items
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <Input
            type="text"
            placeholder="Search by donor name, admin, or items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12"
          />
        </div>

        {/* Donors Cards */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-muted rounded-lg h-40"></div>
              </div>
            ))}
          </div>
        ) : filteredDonors.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDonors.map((donor) => (
              <Card key={donor.id} className="festival-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Gift className="w-5 h-5 text-primary" />
                    {donor.donor_name}
                  </CardTitle>
                  {donor.donor_phone && (
                    <CardDescription className="flex items-center gap-1 text-sm">
                      <Phone className="w-3 h-3" />
                      {donor.donor_phone}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {donor.items_donated && (
                      <div>
                        <span className="text-sm font-medium text-muted-foreground">Items Donated:</span>
                        <p className="text-sm mt-1 p-2 bg-muted/50 rounded-md">
                          {donor.items_donated}
                        </p>
                      </div>
                    )}
                    
                    {donor.amount > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Estimated Value:</span>
                        <Badge variant="secondary" className="text-primary text-lg font-bold">
                          ₹{donor.amount}
                        </Badge>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(donor.created_at).toLocaleDateString('en-IN')}
                      </span>
                      <span>By: {donor.receiving_admin_name}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Gift className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Donors Found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm ? 'No donors match your search criteria.' : 'No item donors have been added yet.'}
            </p>
            {!searchTerm && isAdmin && (
              <Button onClick={() => navigate('/donations')} className="bg-orange-600 hover:bg-orange-700">
                <Plus className="w-4 h-4 mr-2" />
                Add First Donor
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};