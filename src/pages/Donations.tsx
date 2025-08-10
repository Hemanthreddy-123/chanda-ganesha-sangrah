
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Search, Filter, DollarSign, Users, Calendar, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import AddWrittenModal from '@/components/AddWrittenModal';
import { AddCollectionModal } from '@/components/AddCollectionModal';
import { AddExpenseModal } from '@/components/AddExpenseModal';

interface DonationData {
  id: string;
  person_name: string;
  donor_name?: string;
  donor_phone?: string;
  amount: number;
  payment_method: string;
  receiving_admin_name: string;
  created_at: string;
}

interface PersonData {
  id: string;
  name: string;
  amount_paid: number;
  payment_method: string;
  admin_name: string;
  created_at: string;
}

const Donations = () => {
  const navigate = useNavigate();
  const [donations, setDonations] = useState<DonationData[]>([]);
  const [persons, setPersons] = useState<PersonData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMethod, setFilterMethod] = useState<string>('all');
  const [isWrittenOpen, setIsWrittenOpen] = useState(false);
  const [isCollectionOpen, setIsCollectionOpen] = useState(false);
  const [isExpenseOpen, setIsExpenseOpen] = useState(false);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);

      // Load donations
      const { data: donationsData, error: donationsError } = await supabase
        .from('donations')
        .select('*')
        .order('created_at', { ascending: false });

      if (donationsError) {
        console.error('Error loading donations:', donationsError);
      } else {
        setDonations(donationsData || []);
      }

      // Load persons data
      const { data: personsData, error: personsError } = await supabase
        .from('persons')
        .select('*')
        .order('created_at', { ascending: false });

      if (personsError) {
        console.error('Error loading persons:', personsError);
      } else {
        setPersons(personsData || []);
      }

    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Combine and filter data
  const allContributions = [
    ...donations.map(d => ({
      id: d.id,
      type: 'donation' as const,
      name: d.donor_name || d.person_name,
      phone: d.donor_phone,
      amount: d.amount,
      payment_method: d.payment_method,
      admin_name: d.receiving_admin_name,
      created_at: d.created_at
    })),
    ...persons.filter(p => p.amount_paid > 0).map(p => ({
      id: p.id,
      type: 'person' as const,
      name: p.name,
      phone: undefined,
      amount: p.amount_paid,
      payment_method: p.payment_method,
      admin_name: p.admin_name,
      created_at: p.created_at
    }))
  ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const filteredContributions = allContributions.filter(contribution => {
    const matchesSearch = contribution.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contribution.admin_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (contribution.phone && contribution.phone.includes(searchTerm));
    
    const matchesFilter = filterMethod === 'all' || contribution.payment_method === filterMethod;
    
    return matchesSearch && matchesFilter;
  });

  const totalAmount = filteredContributions.reduce((sum, item) => sum + Number(item.amount), 0);
  const totalCount = filteredContributions.length;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getPaymentMethodBadge = (method: string) => {
    const variants = {
      'phonepay': 'bg-blue-100 text-blue-800 border-blue-200',
      'handcash': 'bg-green-100 text-green-800 border-green-200',
      'online': 'bg-purple-100 text-purple-800 border-purple-200'
    };
    
    return variants[method as keyof typeof variants] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-3 sm:p-6">
        <div className="container mx-auto max-w-6xl">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-24 bg-muted rounded"></div>
              ))}
            </div>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="h-20 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-3 sm:p-6 max-w-6xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-3">
          <div className="flex items-center gap-3 sm:gap-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/')}
              className="text-xs sm:text-sm px-2 sm:px-3"
            >
              <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-xl sm:text-3xl font-bold text-primary">All Contributions</h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Track all donations and payments
              </p>
            </div>
          </div>
          <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-2">
            <Button size="sm" variant="outline" className="w-full sm:w-auto" onClick={() => setIsCollectionOpen(true)}>
              Add Collection
            </Button>
            <Button size="sm" variant="destructive" className="w-full sm:w-auto" onClick={() => setIsExpenseOpen(true)}>
              Add Expense
            </Button>
            <Button size="sm" className="w-full sm:w-auto" onClick={() => setIsWrittenOpen(true)}>
              Add Book in Cash
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <Card className="bg-gradient-to-br from-green-50 to-emerald-100 border-green-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm sm:text-base font-medium text-green-800 flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Total Amount
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold text-green-900">
                {formatCurrency(totalAmount)}
              </div>
              <p className="text-xs text-green-700 mt-1">From all contributions</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm sm:text-base font-medium text-blue-800 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Contributors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold text-blue-900">
                {totalCount}
              </div>
              <p className="text-xs text-blue-700 mt-1">People contributed</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-violet-100 border-purple-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm sm:text-base font-medium text-purple-800 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Latest Entry
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm sm:text-base font-bold text-purple-900">
                {filteredContributions.length > 0 
                  ? format(new Date(filteredContributions[0].created_at), 'MMM dd, yyyy')
                  : 'No entries'
                }
              </div>
              <p className="text-xs text-purple-700 mt-1">Most recent</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              type="text"
              placeholder="Search by name, admin, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 text-sm sm:text-base"
            />
          </div>
          
          <div className="flex gap-2">
            <Button
              variant={filterMethod === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterMethod('all')}
              className="text-xs sm:text-sm"
            >
              All
            </Button>
            <Button
              variant={filterMethod === 'phonepay' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterMethod('phonepay')}
              className="text-xs sm:text-sm"
            >
              PhonePe
            </Button>
            <Button
              variant={filterMethod === 'handcash' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterMethod('handcash')}
              className="text-xs sm:text-sm"
            >
              Cash
            </Button>
          </div>
        </div>

        {/* Contributions List */}
        <div className="space-y-3 sm:space-y-4">
          {filteredContributions.length === 0 ? (
            <Card className="text-center py-8 sm:py-12">
              <CardContent>
                <div className="text-4xl sm:text-6xl mb-4">💰</div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2">No Contributions Found</h3>
                <p className="text-muted-foreground text-sm sm:text-base">
                  {searchTerm ? 'Try adjusting your search criteria.' : 'No contributions have been recorded yet.'}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredContributions.map((contribution) => (
              <Card key={contribution.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-3 sm:p-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2">
                        <h3 className="font-semibold text-sm sm:text-lg text-primary truncate">
                          {contribution.name}
                        </h3>
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant="secondary" 
                            className={`text-xs ${getPaymentMethodBadge(contribution.payment_method)}`}
                          >
                            {contribution.payment_method === 'phonepay' ? 'PhonePe' : 
                             contribution.payment_method === 'handcash' ? 'Hand Cash' : 
                             contribution.payment_method}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {contribution.type === 'donation' ? 'Donation' : 'Person'}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="space-y-1 text-xs sm:text-sm text-muted-foreground">
                        <p>Admin: <span className="font-medium">{contribution.admin_name}</span></p>
                        {contribution.phone && (
                          <p className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {contribution.phone}
                          </p>
                        )}
                        <p>Date: {format(new Date(contribution.created_at), 'PPp')}</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-lg sm:text-xl font-bold text-green-600">
                        {formatCurrency(contribution.amount)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
        <AddWrittenModal 
          open={isWrittenOpen}
          onOpenChange={setIsWrittenOpen}
          onSuccess={loadAllData}
        />
        <AddCollectionModal 
          open={isCollectionOpen}
          onOpenChange={setIsCollectionOpen}
          onSuccess={loadAllData}
        />
        <AddExpenseModal 
          open={isExpenseOpen}
          onOpenChange={setIsExpenseOpen}
          onSuccess={loadAllData}
        />
      </div>
    </div>
  );
};

export default Donations;
