import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AddCollectionModal } from '@/components/AddCollectionModal';
import { AddExpenseModal } from '@/components/AddExpenseModal';
import { AddBookcashModal } from '@/components/AddBookcashModal';
import { AddDonorModal } from '@/components/AddDonorModal';
import { useAuth } from '@/context/SupabaseAuthContext';
import { supabase } from '@/integrations/supabase/client';
import { 
  IndianRupee, 
  TrendingUp, 
  Calendar, 
  Users, 
  Search,
  ArrowLeft,
  Download,
  Plus,
  Minus,
  Wallet,
  Receipt,
  Gift
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Admin contact mapping
const ADMIN_PHONES: Record<string, string> = {
  'Mukkamalla Manohar Reddy': '7569158421',
  'Ravilla Balaji': '8179914192',
  'Siddavatam Harsha': '9392312978',
  'Chagam Madhu Reddy': '7095712647',
};

export const Donations: React.FC = () => {
  const { profile } = useAuth();
  const [persons, setPersons] = useState<any[]>([]);
  const [donations, setDonations] = useState<any[]>([]);
  const [collections, setCollections] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [bookcash, setBookcash] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isBookcashModalOpen, setIsBookcashModalOpen] = useState(false);
  const [isDonorModalOpen, setIsDonorModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);

      // Load persons with their payments
      const { data: personsData, error: personsError } = await supabase
        .from('persons')
        .select('*')
        .order('created_at', { ascending: false });

      if (personsError) throw personsError;

      // Load donations
      const { data: donationsData, error: donationsError } = await supabase
        .from('donations')
        .select('*')
        .order('created_at', { ascending: false });

      if (donationsError) throw donationsError;

      // Load admin collections
      const { data: collectionsData, error: collectionsError } = await supabase
        .from('admin_collections')
        .select('*')
        .order('created_at', { ascending: false });

      if (collectionsError) throw collectionsError;

      // Load expenses
      const { data: expensesData, error: expensesError } = await supabase
        .from('admin_expenses')
        .select('*')
        .order('created_at', { ascending: false });

      if (expensesError) throw expensesError;

      // Load bookcash
      const { data: bookcashData, error: bookcashError } = await supabase
        .from('bookcash')
        .select('*')
        .order('created_at', { ascending: false });

      if (bookcashError) throw bookcashError;

      setPersons(personsData || []);
      setDonations(donationsData || []);
      setCollections(collectionsData || []);
      setExpenses(expensesData || []);
      setBookcash(bookcashData || []);

    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate totals
  const totalFromPersons = persons.reduce((sum, person) => sum + Number(person.amount_paid || 0), 0);
  const totalFromDonations = donations.reduce((sum, donation) => sum + Number(donation.amount), 0);
  const totalFromCollections = collections.reduce((sum, collection) => sum + Number(collection.amount), 0);
  const totalFromExpenses = expenses.reduce((sum, expense) => sum + Number(expense.amount), 0);
  const totalFromBookcash = bookcash.reduce((sum, entry) => sum + Number(entry.amount), 0);

  const grandTotal = totalFromPersons + totalFromDonations + totalFromCollections;
  const availableAmount = grandTotal - totalFromExpenses;

  // Group admin data for collections and expenses
  const adminData = new Map();
  
  // Process collections
  collections.forEach(collection => {
    if (!adminData.has(collection.admin_id)) {
      adminData.set(collection.admin_id, {
        adminId: collection.admin_id,
        adminName: collection.admin_name,
        totalCollected: 0,
        totalExpenses: 0
      });
    }
    adminData.get(collection.admin_id).totalCollected += Number(collection.amount);
  });

  // Process expenses
  expenses.forEach(expense => {
    if (!adminData.has(expense.admin_id)) {
      adminData.set(expense.admin_id, {
        adminId: expense.admin_id,
        adminName: expense.admin_name,
        totalCollected: 0,
        totalExpenses: 0
      });
    }
    adminData.get(expense.admin_id).totalExpenses += Number(expense.amount);
  });

  // Calculate daily reports from donations
  const dailyReports: {[key: string]: number} = {};
  donations.forEach(donation => {
    const date = new Date(donation.created_at).toLocaleDateString('en-IN');
    dailyReports[date] = (dailyReports[date] || 0) + Number(donation.amount);
  });

  const filteredPersons = persons.filter(person =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.admin_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const exportReport = () => {
    // Create CSV content
    const csvHeaders = [
      'Date',
      'Type',
      'Name/Purpose',
      'Amount',
      'Payment Method',
      'Admin',
      'Phone',
      'Address'
    ];

    const csvRows = [];
    
    // Add persons data
    persons.forEach(person => {
      csvRows.push([
        new Date(person.created_at).toLocaleDateString('en-IN'),
        'Member Payment',
        person.name,
        person.amount_paid || 0,
        person.payment_method === 'handcash' ? 'Hand Cash' : 'PhonePe',
        person.admin_name,
        person.phone_number,
        person.address
      ]);
    });

    // Add donations
    donations.forEach(donation => {
      csvRows.push([
        new Date(donation.created_at).toLocaleDateString('en-IN'),
        'Donation',
        donation.donor_name || 'Anonymous',
        donation.amount,
        donation.payment_method === 'handcash' ? 'Hand Cash' : 'PhonePe',
        donation.receiving_admin_name,
        donation.donor_phone || '',
        ''
      ]);
    });

    // Add collections
    collections.forEach(collection => {
      csvRows.push([
        new Date(collection.created_at).toLocaleDateString('en-IN'),
        'Collection',
        'Direct Collection',
        collection.amount,
        'Mixed',
        collection.admin_name,
        '',
        ''
      ]);
    });

    // Add expenses
    expenses.forEach(expense => {
      csvRows.push([
        new Date(expense.created_at).toLocaleDateString('en-IN'),
        'Expense',
        expense.purpose,
        -Number(expense.amount),
        'Expense',
        expense.admin_name,
        '',
        ''
      ]);
    });

    // Create CSV content
    const csvContent = [
      csvHeaders.join(','),
      ...csvRows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `depur-vinayaka-chavithi-report-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
              Collection & Expense Management
            </h1>
            <p className="text-muted-foreground mt-2 text-sm sm:text-base">
              Track collections, expenses, and available funds for Depur Vinayaka Chavithi 2k25
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            {profile && (
              <>
                <Button onClick={() => navigate('/people')} variant="secondary" className="w-full sm:w-auto">
                  <Users className="w-4 h-4 mr-2" />
                  People
                </Button>
                <Button onClick={() => navigate('/donors')} variant="secondary" className="w-full sm:w-auto">
                  <Gift className="w-4 h-4 mr-2" />
                  Donors
                </Button>
                <Button onClick={() => setIsDonorModalOpen(true)} className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700">
                  <Gift className="w-4 h-4 mr-2" />
                  Add Donor
                </Button>
                <Button onClick={() => setIsCollectionModalOpen(true)} className="w-full sm:w-auto">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Collection
                </Button>
                <Button variant="outline" onClick={() => setIsExpenseModalOpen(true)} className="w-full sm:w-auto">
                  <Minus className="w-4 h-4 mr-2" />
                  Add Expense
                </Button>
                <Button onClick={() => setIsBookcashModalOpen(true)} className="w-full sm:w-auto bg-amber-600 hover:bg-amber-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Book Cash
                </Button>
              </>
            )}
            <Button variant="outline" onClick={exportReport} className="w-full sm:w-auto">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-6 mb-8">
          <Card className="festival-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Total Collected</CardTitle>
              <IndianRupee className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-primary">₹{grandTotal}</div>
              <p className="text-xs text-muted-foreground">
                All collections combined
              </p>
            </CardContent>
          </Card>

          <Card className="festival-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Total Expenses</CardTitle>
              <Receipt className="h-3 w-3 sm:h-4 sm:w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-red-600">₹{totalFromExpenses}</div>
              <p className="text-xs text-muted-foreground">
                All expenses
              </p>
            </CardContent>
          </Card>

          <Card className="festival-card col-span-2 lg:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Available Amount</CardTitle>
              <Wallet className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600">₹{availableAmount}</div>
              <p className="text-xs text-muted-foreground">
                After expenses
              </p>
            </CardContent>
          </Card>

          <Card className="festival-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Admin Collections</CardTitle>
              <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-600">₹{totalFromCollections}</div>
              <p className="text-xs text-muted-foreground">
                Direct admin collections
              </p>
            </CardContent>
          </Card>

          <Card className="festival-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Book Cash</CardTitle>
              <Wallet className="h-3 w-3 sm:h-4 sm:w-4 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-amber-600">₹{totalFromBookcash}</div>
              <p className="text-xs text-muted-foreground">
                Separate book cash entries
              </p>
            </CardContent>
          </Card>
        </div>
        {/* Admin Summary */}
        {adminData.size > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">
              <span className="ganesh-gradient bg-clip-text text-transparent">
                Admin-wise Summary
              </span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from(adminData.values()).map((admin) => (
                <Card key={admin.adminId} className="festival-card">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base sm:text-lg">
                      {admin.adminName}
                      {ADMIN_PHONES[admin.adminName] && (
                        <span className="text-xs sm:text-sm text-primary font-medium ml-2 block sm:inline">
                          📞 {ADMIN_PHONES[admin.adminName]}
                        </span>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Collected:</span>
                        <span className="text-base sm:text-lg font-bold text-primary">₹{admin.totalCollected}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Expenses:</span>
                        <span className="text-base sm:text-lg font-bold text-red-600">₹{admin.totalExpenses}</span>
                      </div>
                      <div className="flex justify-between items-center border-t pt-2">
                        <span className="text-sm font-medium">Available:</span>
                        <span className="text-base sm:text-lg font-bold text-green-600">
                          ₹{admin.totalCollected - admin.totalExpenses}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Daily Collection Reports */}
        {Object.keys(dailyReports).length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">
              <span className="ganesh-gradient bg-clip-text text-transparent">
                Daily Collection Reports
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(dailyReports)
                .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
                .map(([date, amount]) => (
                  <Card key={date} className="festival-card">
                    <CardContent className="text-center py-4">
                      <Calendar className="w-6 h-6 text-primary mx-auto mb-2" />
                      <div className="font-semibold mb-1">{date}</div>
                      <div className="text-xl font-bold text-primary">₹{amount}</div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        )}

        {/* Person Payments Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">
            <span className="ganesh-gradient bg-clip-text text-transparent">
              Member Contributions (₹{totalFromPersons})
            </span>
          </h2>
          
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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPersons.map((person) => (
                <Card key={person.id} className="festival-card">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base sm:text-lg">{person.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Amount:</span>
                        <span className="text-base sm:text-lg font-bold text-primary">₹{person.amount_paid || 0}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Method:</span>
                        <Badge variant={person.payment_method === 'cash' ? 'default' : 'secondary'}>
                          {person.payment_method === 'cash' ? 'Cash' : 'UPI'}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Added by:</span>
                        <span className="text-xs sm:text-sm">
                          {person.admin_name}
                          {ADMIN_PHONES[person.admin_name] && (
                            <span className="text-primary font-medium ml-1 block sm:inline">
                              📞 {ADMIN_PHONES[person.admin_name]}
                            </span>
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Date:</span>
                        <span className="text-sm">{new Date(person.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
        </div>

        {/* Additional Donations Section */}
        {donations.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">
              <span className="ganesh-gradient bg-clip-text text-transparent">
                Member Contributions (₹{totalFromPersons})
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {donations.map((donation) => (
                <Card key={donation.id} className="festival-card">
                  <CardHeader className="pb-3">
                     <CardTitle className="text-base sm:text-lg">{donation.donor_name || 'Anonymous'}</CardTitle>
                     <CardDescription className="text-sm">Donated to {donation.person_name}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Amount:</span>
                        <span className="text-base sm:text-lg font-bold text-primary">₹{donation.amount}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Method:</span>
                        <Badge variant={donation.payment_method === 'handcash' ? 'default' : 'secondary'}>
                          {donation.payment_method === 'handcash' ? 'Hand Cash' : 'PhonePe'}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Received by:</span>
                         <span className="text-xs sm:text-sm">
                           {donation.receiving_admin_name}
                           {ADMIN_PHONES[donation.receiving_admin_name] && (
                             <span className="text-primary font-medium ml-1 block sm:inline">
                               📞 {ADMIN_PHONES[donation.receiving_admin_name]}
                             </span>
                           )}
                         </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Date:</span>
                        <span className="text-xs sm:text-sm">{new Date(donation.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Expense History */}
        {expenses.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">
              <span className="ganesh-gradient bg-clip-text text-transparent">
                Expense History
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {expenses
                .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                .map((expense) => (
                  <Card key={expense.id} className="festival-card">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg text-red-600">₹{expense.amount}</CardTitle>
                      <CardDescription>{expense.purpose}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Spent by:</span>
                          <span className="text-sm">
                            {expense.admin_name}
                            {ADMIN_PHONES[expense.admin_name] && (
                              <span className="text-primary font-medium ml-1">
                                📞 {ADMIN_PHONES[expense.admin_name]}
                              </span>
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Date:</span>
                          <span className="text-sm">{new Date(expense.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {collections.length === 0 && donations.length === 0 && persons.length === 0 && (
          <Card className="festival-card">
            <CardContent className="text-center py-16">
              <IndianRupee className="w-16 h-16 text-muted-foreground mx-auto mb-6" />
              <h3 className="text-2xl font-semibold mb-4">No Data Yet</h3>
              <p className="text-muted-foreground">
                No collections or expenses have been recorded yet. Start by adding a collection.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Modals */}
        <AddCollectionModal
          open={isCollectionModalOpen}
          onOpenChange={setIsCollectionModalOpen}
          onSuccess={loadAllData}
        />

        <AddExpenseModal
          open={isExpenseModalOpen}
          onOpenChange={setIsExpenseModalOpen}
          onSuccess={loadAllData}
        />

        <AddBookcashModal
          open={isBookcashModalOpen}
          onOpenChange={setIsBookcashModalOpen}
          onBookcashAdded={loadAllData}
        />

        <AddDonorModal
          isOpen={isDonorModalOpen}
          onClose={() => setIsDonorModalOpen(false)}
          onSuccess={loadAllData}
        />
      </div>
    </div>
  );
};