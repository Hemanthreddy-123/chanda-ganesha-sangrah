import React, { useState, useEffect } from 'react';
import { Person, Donation, AdminCollection, AdminExpense } from '@/types/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AddCollectionModal } from '@/components/AddCollectionModal';
import { AddExpenseModal } from '@/components/AddExpenseModal';
import { useAuth } from '@/context/SupabaseAuthContext';
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
  Receipt
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Donations: React.FC = () => {
  const { profile } = useAuth();
  const [persons, setPersons] = useState<Person[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [adminCollections, setAdminCollections] = useState<AdminCollection[]>([]);
  const [adminExpenses, setAdminExpenses] = useState<AdminExpense[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [dailyReports, setDailyReports] = useState<{[key: string]: number}>({});
  const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    // Load persons with payments
    const storedPersons = localStorage.getItem('persons');
    if (storedPersons) {
      setPersons(JSON.parse(storedPersons));
    }

    // Load donations
    const storedDonations = localStorage.getItem('donations');
    if (storedDonations) {
      const donationData: Donation[] = JSON.parse(storedDonations);
      setDonations(donationData);

      // Calculate daily reports from donations
      const dailyData: {[key: string]: number} = {};
      donationData.forEach(donation => {
        const date = new Date(donation.created_at).toLocaleDateString('en-IN');
        dailyData[date] = (dailyData[date] || 0) + donation.amount;
      });
      setDailyReports(dailyData);
    }

    // Load admin collections
    const storedCollections = localStorage.getItem('adminCollections');
    if (storedCollections) {
      setAdminCollections(JSON.parse(storedCollections));
    }

    // Load admin expenses
    const storedExpenses = localStorage.getItem('adminExpenses');
    if (storedExpenses) {
      setAdminExpenses(JSON.parse(storedExpenses));
    }
  };

  // Calculate totals from persons (actual payments)
  const totalFromPersons = persons.reduce((sum, person) => sum + (person.amount_paid || 0), 0);
  const handCashFromPersons = persons.filter(p => p.payment_method === 'handcash').reduce((sum, p) => sum + (p.amount_paid || 0), 0);
  const phonePeFromPersons = persons.filter(p => p.payment_method === 'phonepay').reduce((sum, p) => sum + (p.amount_paid || 0), 0);

  // Calculate totals from donations (additional donations)
  const totalFromDonations = donations.reduce((sum, d) => sum + d.amount, 0);
  const handCashFromDonations = donations.filter(d => d.payment_method === 'handcash').reduce((sum, d) => sum + d.amount, 0);
  const phonePeFromDonations = donations.filter(d => d.payment_method === 'phonepay').reduce((sum, d) => sum + d.amount, 0);

  // Calculate admin collections and expenses
  const totalAdminCollections = adminCollections.reduce((sum, c) => sum + c.amount, 0);
  const totalAdminExpenses = adminExpenses.reduce((sum, e) => sum + e.amount, 0);

  // Grand totals
  const grandTotal = totalFromPersons + totalFromDonations + totalAdminCollections;
  const totalHandCash = handCashFromPersons + handCashFromDonations;
  const totalPhonePe = phonePeFromPersons + phonePeFromDonations;
  const availableAmount = grandTotal - totalAdminExpenses;

  // Group admin data
  const adminData = new Map();
  adminCollections.forEach(collection => {
    if (!adminData.has(collection.admin_id)) {
      adminData.set(collection.admin_id, {
        adminId: collection.admin_id,
        adminName: collection.admin_name,
        totalCollected: 0,
        totalExpenses: 0
      });
    }
    adminData.get(collection.admin_id).totalCollected += collection.amount;
  });

  adminExpenses.forEach(expense => {
    if (!adminData.has(expense.admin_id)) {
      adminData.set(expense.admin_id, {
        adminId: expense.admin_id,
        adminName: expense.admin_name,
        totalCollected: 0,
        totalExpenses: 0
      });
    }
    adminData.get(expense.admin_id).totalExpenses += expense.amount;
  });

  const filteredPersons = persons.filter(person =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
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

    // Add donations data
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

    // Add admin collections
    adminCollections.forEach(collection => {
      csvRows.push([
        new Date(collection.created_at).toLocaleDateString('en-IN'),
        'Admin Collection',
        'Direct Collection',
        collection.amount,
        'Mixed',
        collection.admin_name,
        '',
        ''
      ]);
    });

    // Add admin expenses
    adminExpenses.forEach(expense => {
      csvRows.push([
        new Date(expense.created_at).toLocaleDateString('en-IN'),
        'Expense',
        expense.purpose,
        -expense.amount, // Negative for expenses
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
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Button 
              variant="outline" 
              onClick={() => navigate('/')}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            <h1 className="text-3xl font-bold ganesh-gradient bg-clip-text text-transparent">
              Collection & Expense Management
            </h1>
            <p className="text-muted-foreground mt-2">
              Track collections, expenses, and available funds for Depur Vinayaka Chavithi 2k25
            </p>
          </div>
          <div className="flex gap-2">
            {profile && (
              <>
                <Button onClick={() => setIsCollectionModalOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Collection
                </Button>
                <Button variant="outline" onClick={() => setIsExpenseModalOpen(true)}>
                  <Minus className="w-4 h-4 mr-2" />
                  Add Expense
                </Button>
              </>
            )}
            <Button variant="outline" onClick={exportReport}>
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="festival-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Collected</CardTitle>
              <IndianRupee className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">₹{grandTotal}</div>
              <p className="text-xs text-muted-foreground">
                All collections combined
              </p>
            </CardContent>
          </Card>

          <Card className="festival-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
              <Receipt className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">₹{totalAdminExpenses}</div>
              <p className="text-xs text-muted-foreground">
                All expenses
              </p>
            </CardContent>
          </Card>

          <Card className="festival-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Amount</CardTitle>
              <Wallet className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">₹{availableAmount}</div>
              <p className="text-xs text-muted-foreground">
                After expenses
              </p>
            </CardContent>
          </Card>

          <Card className="festival-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Admin Collections</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">₹{totalAdminCollections}</div>
              <p className="text-xs text-muted-foreground">
                Direct admin collections
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from(adminData.values()).map((admin) => (
                <Card key={admin.adminId} className="festival-card">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">{admin.adminName}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Collected:</span>
                        <span className="text-lg font-bold text-primary">₹{admin.totalCollected}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Expenses:</span>
                        <span className="text-lg font-bold text-red-600">₹{admin.totalExpenses}</span>
                      </div>
                      <div className="flex justify-between items-center border-t pt-2">
                        <span className="text-sm font-medium">Available:</span>
                        <span className="text-lg font-bold text-green-600">
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
              placeholder="Search by name, address, or admin..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPersons.map((person) => (
              <Card key={person.id} className="festival-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{person.name}</CardTitle>
                  <CardDescription>{person.address}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Amount:</span>
                      <span className="text-lg font-bold text-primary">₹{person.amount_paid || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Method:</span>
                      <Badge variant={person.payment_method === 'handcash' ? 'default' : 'secondary'}>
                        {person.payment_method === 'handcash' ? 'Hand Cash' : 'PhonePe'}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Phone:</span>
                      <span className="text-sm">{person.phone_number}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Added by:</span>
                      <span className="text-sm">{person.admin_name}</span>
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
                Additional Donations (₹{totalFromDonations})
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {donations.map((donation) => (
                <Card key={donation.id} className="festival-card">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">{donation.donor_name || 'Anonymous'}</CardTitle>
                    <CardDescription>Donated to {donation.person_name}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Amount:</span>
                        <span className="text-lg font-bold text-primary">₹{donation.amount}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Method:</span>
                        <Badge variant={donation.payment_method === 'handcash' ? 'default' : 'secondary'}>
                          {donation.payment_method === 'handcash' ? 'Hand Cash' : 'PhonePe'}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Received by:</span>
                        <span className="text-sm">{donation.receiving_admin_name}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Date:</span>
                        <span className="text-sm">{new Date(donation.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Expense History */}
        {adminExpenses.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">
              <span className="ganesh-gradient bg-clip-text text-transparent">
                Expense History
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {adminExpenses
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
                          <span className="text-sm">{expense.admin_name}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Date:</span>
                          <span className="text-sm">{expense.date}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {persons.length === 0 && donations.length === 0 && adminCollections.length === 0 && (
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
          onSuccess={loadData}
        />

        <AddExpenseModal
          open={isExpenseModalOpen}
          onOpenChange={setIsExpenseModalOpen}
          onSuccess={loadData}
        />
      </div>
    </div>
  );
};