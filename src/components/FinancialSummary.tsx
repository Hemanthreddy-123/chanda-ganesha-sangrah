
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  IndianRupee, 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  CreditCard,
  Users,
  DollarSign,
  BookOpen,
  HandCoins
} from 'lucide-react';

interface FinancialData {
  totalCollected: number;
  totalSpent: number;
  availableAmount: number;
  phonePeAmount: number;
  handCashAmount: number;
  totalPersons: number;
  totalDonations: number;
  peopleInBook: number;
  peopleGivenHandMoney: number;
  manualCollections: number;
  manualExpenses: number;
}

const FinancialSummary = () => {
  const [financialData, setFinancialData] = useState<FinancialData>({
    totalCollected: 0,
    totalSpent: 0,
    availableAmount: 0,
    phonePeAmount: 0,
    handCashAmount: 0,
    totalPersons: 0,
    totalDonations: 0,
    peopleInBook: 0,
    peopleGivenHandMoney: 0,
    manualCollections: 0,
    manualExpenses: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFinancialData();
  }, []);

  const loadFinancialData = async () => {
    try {
      setLoading(true);

      // Load persons with their payments
      const { data: persons, error: personsError } = await supabase
        .from('persons')
        .select('amount_paid, payment_method');

      if (personsError) throw personsError;

      // Load donations
      const { data: donations, error: donationsError } = await supabase
        .from('donations')
        .select('amount, payment_method');

      if (donationsError) throw donationsError;

      // Load admin collections (manual collections)
      const { data: collections, error: collectionsError } = await supabase
        .from('admin_collections')
        .select('amount');

      if (collectionsError) throw collectionsError;

      // Load expenses (manual expenses)
      const { data: expenses, error: expensesError } = await supabase
        .from('admin_expenses')
        .select('amount');

      if (expensesError) throw expensesError;

      // Calculate totals
      const personsTotal = persons?.reduce((sum, person) => sum + Number(person.amount_paid), 0) || 0;
      const donationsTotal = donations?.reduce((sum, donation) => sum + Number(donation.amount), 0) || 0;
      const collectionsTotal = collections?.reduce((sum, collection) => sum + Number(collection.amount), 0) || 0;
      const expensesTotal = expenses?.reduce((sum, expense) => sum + Number(expense.amount), 0) || 0;

      const totalCollected = personsTotal + donationsTotal + collectionsTotal;
      const availableAmount = totalCollected - expensesTotal;

      // Calculate payment method totals
      const allPayments = [
        ...(persons?.map(p => ({ amount: p.amount_paid, method: p.payment_method })) || []),
        ...(donations?.map(d => ({ amount: d.amount, method: d.payment_method })) || [])
      ];

      const phonePeAmount = allPayments
        .filter(payment => payment.method === 'phonepay')
        .reduce((sum, payment) => sum + Number(payment.amount), 0);

      const handCashAmount = allPayments
        .filter(payment => payment.method === 'handcash')
        .reduce((sum, payment) => sum + Number(payment.amount), 0);

      // Count people in book (persons with amount > 0)
      const peopleInBook = persons?.filter(p => Number(p.amount_paid) > 0).length || 0;
      
      // Count people given hand money (handcash payments)
      const peopleGivenHandMoney = allPayments.filter(p => p.method === 'handcash').length;

      setFinancialData({
        totalCollected,
        totalSpent: expensesTotal,
        availableAmount,
        phonePeAmount,
        handCashAmount,
        totalPersons: persons?.length || 0,
        totalDonations: donations?.length || 0,
        peopleInBook,
        peopleGivenHandMoney,
        manualCollections: collectionsTotal,
        manualExpenses: expensesTotal
      });

    } catch (error) {
      console.error('Error loading financial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4 sm:p-6">
              <div className="h-16 sm:h-20 bg-muted rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Main Financial Cards - Requested Format */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-blue-800">People in Book</CardTitle>
            <BookOpen className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold text-blue-900">
              {financialData.peopleInBook}
            </div>
            <p className="text-xs text-blue-700 mt-1">
              Entered money in book
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-100 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-green-800">Hand Money Given</CardTitle>
            <HandCoins className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold text-green-900">
              {financialData.peopleGivenHandMoney}
            </div>
            <p className="text-xs text-green-700 mt-1">
              People given hand money
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-rose-100 border-red-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-red-800">Financial Usage</CardTitle>
            <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold text-red-900">
              {formatCurrency(financialData.totalSpent)}
            </div>
            <p className="text-xs text-red-700 mt-1">
              Total expenses
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-violet-100 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-purple-800">Remaining Amount</CardTitle>
            <Wallet className="h-3 w-3 sm:h-4 sm:w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold text-purple-900">
              {formatCurrency(financialData.availableAmount)}
            </div>
            <p className="text-xs text-purple-700 mt-1">
              Available balance
            </p>
            <Badge 
              variant={financialData.availableAmount > 0 ? "default" : "destructive"}
              className="mt-2 text-xs"
            >
              {financialData.availableAmount > 0 ? "Profit" : "Loss"}
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Additional Financial Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-6">
        <Card className="bg-gradient-to-br from-green-50 to-emerald-100 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-green-800">Total Collected</CardTitle>
            <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold text-green-900">
              {formatCurrency(financialData.totalCollected)}
            </div>
            <p className="text-xs text-green-700 mt-1">
              From all sources
            </p>
            {financialData.manualCollections > 0 && (
              <p className="text-xs text-green-600 mt-1">
                Manual: {formatCurrency(financialData.manualCollections)}
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-rose-100 border-red-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-red-800">Total Spent</CardTitle>
            <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold text-red-900">
              {formatCurrency(financialData.totalSpent)}
            </div>
            <p className="text-xs text-red-700 mt-1">
              All expenses
            </p>
            {financialData.manualExpenses > 0 && (
              <p className="text-xs text-red-600 mt-1">
                Manual: {formatCurrency(financialData.manualExpenses)}
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-blue-800">Available Amount</CardTitle>
            <Wallet className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold text-blue-900">
              {formatCurrency(financialData.availableAmount)}
            </div>
            <p className="text-xs text-blue-700 mt-1">
              After expenses
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Payment Method Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="bg-gradient-to-br from-purple-50 to-violet-100 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-purple-800">PhonePe</CardTitle>
            <CreditCard className="h-3 w-3 sm:h-4 sm:w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-base sm:text-xl font-bold text-purple-900">
              {formatCurrency(financialData.phonePeAmount)}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-yellow-100 border-amber-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-amber-800">Hand Cash</CardTitle>
            <IndianRupee className="h-3 w-3 sm:h-4 sm:w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-base sm:text-xl font-bold text-amber-900">
              {formatCurrency(financialData.handCashAmount)}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-teal-50 to-cyan-100 border-teal-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-teal-800">Total People</CardTitle>
            <Users className="h-3 w-3 sm:h-4 sm:w-4 text-teal-600" />
          </CardHeader>
          <CardContent>
            <div className="text-base sm:text-xl font-bold text-teal-900">
              {financialData.totalPersons}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-red-100 border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-orange-800">Donations</CardTitle>
            <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-base sm:text-xl font-bold text-orange-900">
              {financialData.totalDonations}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FinancialSummary;
