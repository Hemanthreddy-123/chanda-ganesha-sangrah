
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/SupabaseAuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Minus, DollarSign, Receipt } from 'lucide-react';

const ManualFinancialEntry = () => {
  const [collectionAmount, setCollectionAmount] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expensePurpose, setExpensePurpose] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user, profile } = useAuth();

  const handleAddCollection = async () => {
    if (!user || !profile) {
      toast({
        title: "Error",
        description: "You must be logged in to add collections",
        variant: "destructive",
      });
      return;
    }

    if (!collectionAmount || Number(collectionAmount) <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid collection amount",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('admin_collections')
        .insert({
          admin_id: user.id,
          admin_name: profile.name,
          amount: Number(collectionAmount),
          date: new Date().toISOString().split('T')[0]
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: `Collection of ₹${collectionAmount} added successfully`,
      });

      setCollectionAmount('');
    } catch (error) {
      console.error('Error adding collection:', error);
      toast({
        title: "Error",
        description: "Failed to add collection. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddExpense = async () => {
    if (!user || !profile) {
      toast({
        title: "Error",
        description: "You must be logged in to add expenses",
        variant: "destructive",
      });
      return;
    }

    if (!expenseAmount || Number(expenseAmount) <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid expense amount",
        variant: "destructive",
      });
      return;
    }

    if (!expensePurpose.trim()) {
      toast({
        title: "Error",
        description: "Please enter the purpose of the expense",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('admin_expenses')
        .insert({
          admin_id: user.id,
          admin_name: profile.name,
          amount: Number(expenseAmount),
          purpose: expensePurpose.trim(),
          date: new Date().toISOString().split('T')[0]
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: `Expense of ₹${expenseAmount} added successfully`,
      });

      setExpenseAmount('');
      setExpensePurpose('');
    } catch (error) {
      console.error('Error adding expense:', error);
      toast({
        title: "Error",
        description: "Failed to add expense. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user || !profile) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
      {/* Manual Collection Entry */}
      <Card className="bg-gradient-to-br from-green-50 to-emerald-100 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            Add Collection
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4">
          <div>
            <Label htmlFor="collection-amount" className="text-green-700">Amount (₹)</Label>
            <Input
              id="collection-amount"
              type="number"
              placeholder="Enter collection amount"
              value={collectionAmount}
              onChange={(e) => setCollectionAmount(e.target.value)}
              className="mt-1"
            />
          </div>
          <Button 
            onClick={handleAddCollection}
            disabled={loading || !collectionAmount}
            className="w-full bg-green-600 hover:bg-green-700 text-white text-sm sm:text-base"
          >
            <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            Add Collection
          </Button>
        </CardContent>
      </Card>

      {/* Manual Expense Entry */}
      <Card className="bg-gradient-to-br from-red-50 to-rose-100 border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-800">
            <Minus className="w-4 h-4 sm:w-5 sm:h-5" />
            Add Expense
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4">
          <div>
            <Label htmlFor="expense-amount" className="text-red-700">Amount (₹)</Label>
            <Input
              id="expense-amount"
              type="number"
              placeholder="Enter expense amount"
              value={expenseAmount}
              onChange={(e) => setExpenseAmount(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="expense-purpose" className="text-red-700">Purpose</Label>
            <Textarea
              id="expense-purpose"
              placeholder="Describe the purpose of this expense"
              value={expensePurpose}
              onChange={(e) => setExpensePurpose(e.target.value)}
              className="mt-1 min-h-[60px] sm:min-h-[80px]"
              rows={2}
            />
          </div>
          <Button 
            onClick={handleAddExpense}
            disabled={loading || !expenseAmount || !expensePurpose.trim()}
            className="w-full bg-red-600 hover:bg-red-700 text-white text-sm sm:text-base"
          >
            <Receipt className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            Add Expense
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManualFinancialEntry;
