import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AddDonorModal } from '@/components/AddDonorModal';
import { EditDonorModal } from '@/components/EditDonorModal';
import { useAuth } from '@/context/SupabaseAuthContext';
import { supabase } from '@/integrations/supabase/client';
import { 
  Gift, 
  Phone, 
  Calendar, 
  Search,
  Edit,
  Plus,
  ArrowLeft,
  Star
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface Donor {
  id: string;
  donor_name: string;
  donor_phone?: string;
  items_donated?: string;
  amount: number;
  receiving_admin_name: string;
  priority_order?: number;
  created_at: string;
}

export const Donors: React.FC = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [donors, setDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);

  useEffect(() => {
    loadDonors();

    // Set up real-time subscription for donations
    const channel = supabase
      .channel('donations-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'donations',
          filter: 'items_donated=not.is.null'
        },
        (payload) => {
          console.log('Donor change detected:', payload);
          loadDonors(); // Reload donors when any change occurs
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadDonors = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('donations')
        .select('*')
        .not('items_donated', 'is', null)
        .order('priority_order', { ascending: true })
        .order('amount', { ascending: false });

      if (error) throw error;
      setDonors(data || []);
    } catch (error) {
      console.error('Error loading donors:', error);
      toast.error('Failed to load donors');
    } finally {
      setLoading(false);
    }
  };

  const handleEditDonor = (donor: Donor) => {
    setSelectedDonor(donor);
    setIsEditModalOpen(true);
  };

  const filteredDonors = donors.filter(donor =>
    donor.donor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (donor.items_donated && donor.items_donated.toLowerCase().includes(searchTerm.toLowerCase())) ||
    donor.receiving_admin_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPriorityBadge = (priority: number = 1) => {
    const colors = {
      1: 'bg-red-100 text-red-800 border-red-300',
      2: 'bg-orange-100 text-orange-800 border-orange-300', 
      3: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      4: 'bg-blue-100 text-blue-800 border-blue-300',
      5: 'bg-green-100 text-green-800 border-green-300'
    };
    const labels = {
      1: 'Highest',
      2: 'High', 
      3: 'Medium',
      4: 'Low',
      5: 'Lowest'
    };
    return { color: colors[priority as keyof typeof colors] || colors[1], label: labels[priority as keyof typeof labels] || 'Medium' };
  };

  if (loading) {
    return (
      <div className="min-h-screen py-4 sm:py-8 px-2 sm:px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-muted rounded-lg h-48"></div>
              </div>
            ))}
          </div>
        </div>
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
              onClick={() => navigate('/')}
              className="mb-4 w-full sm:w-auto"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            <h1 className="text-2xl sm:text-3xl font-bold ganesh-gradient bg-clip-text text-transparent">
              Donors Management
            </h1>
            <p className="text-muted-foreground mt-2 text-sm sm:text-base">
              Manage donors and their contributions with priority system
            </p>
          </div>
          {profile && (
            <Button onClick={() => setIsAddModalOpen(true)} className="w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Add Donor
            </Button>
          )}
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <Input
            type="text"
            placeholder="Search by donor name, items, or admin..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Real-time Status & Stats */}
        <div className="mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Live updates enabled - Changes reflect in real-time</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
          <Card className="festival-card">
            <CardContent className="text-center py-4">
              <Gift className="w-8 h-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-primary">{donors.length}</div>
              <div className="text-sm text-muted-foreground">Total Donors</div>
            </CardContent>
          </Card>
          <Card className="festival-card">
            <CardContent className="text-center py-4">
              <Star className="w-8 h-8 text-red-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-red-600">
                {donors.filter(d => d.priority_order === 1).length}
              </div>
              <div className="text-sm text-muted-foreground">Highest Priority</div>
            </CardContent>
          </Card>
          <Card className="festival-card">
            <CardContent className="text-center py-4">
              <Star className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-yellow-600">
                {donors.filter(d => d.priority_order === 2).length}
              </div>
              <div className="text-sm text-muted-foreground">High Priority</div>
            </CardContent>
          </Card>
          <Card className="festival-card">
            <CardContent className="text-center py-4">
              <div className="text-2xl font-bold text-green-600">
                ₹{donors.reduce((sum, donor) => sum + Number(donor.amount || 0), 0)}
              </div>
              <div className="text-sm text-muted-foreground">Total Value</div>
            </CardContent>
          </Card>
        </div>

        {/* Donors Grid */}
        {filteredDonors.length === 0 ? (
          <div className="text-center py-8">
            <Gift className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {searchTerm ? 'No donors found' : 'No donors yet'}
            </h3>
            <p className="text-muted-foreground">
              {searchTerm 
                ? 'Try adjusting your search criteria'
                : 'Donors will appear here once added by admins'
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDonors.map((donor) => {
              const priorityInfo = getPriorityBadge(donor.priority_order || 1);
              return (
                <Card key={donor.id} className="festival-card relative">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Gift className="w-5 h-5 text-primary" />
                        {donor.donor_name}
                      </CardTitle>
                      {profile && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditDonor(donor)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      {donor.donor_phone && (
                        <CardDescription className="flex items-center gap-1 text-sm">
                          <Phone className="w-3 h-3" />
                          {donor.donor_phone}
                        </CardDescription>
                      )}
                      <div className="flex items-center gap-2">
                        <Badge className={`text-xs font-medium ${priorityInfo.color}`}>
                          <Star className="w-3 h-3 mr-1" />
                          {priorityInfo.label}
                        </Badge>
                        {profile && (
                          <Badge variant="outline" className="text-xs">
                            #{donor.priority_order || 1}
                          </Badge>
                        )}
                      </div>
                    </div>
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
                          <Badge variant="secondary" className="text-primary">
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
              );
            })}
          </div>
        )}

        {/* Modals */}
        <AddDonorModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={loadDonors}
        />
        
        {selectedDonor && (
          <EditDonorModal
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedDonor(null);
            }}
            onSuccess={loadDonors}
            donor={selectedDonor}
          />
        )}
      </div>
    </div>
  );
};