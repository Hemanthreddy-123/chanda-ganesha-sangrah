import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/context/SupabaseAuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useActivityLogger } from '@/hooks/useActivityLogger';

interface AddWrittenModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const AddWrittenModal: React.FC<AddWrittenModalProps> = ({ open, onOpenChange, onSuccess }) => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const { logActivity } = useActivityLogger();

  const [amount, setAmount] = useState('');
  const [personName, setPersonName] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!profile) {
      toast({ title: 'Error', description: 'You must be logged in to add a written entry', variant: 'destructive' });
      return;
    }

    const amt = parseFloat(amount);
    if (!amount || isNaN(amt) || amt <= 0) {
      toast({ title: 'Invalid amount', description: 'Please enter a valid amount', variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error, data } = await supabase.from('financial_transactions').insert({
        admin_id: profile.user_id,
        admin_name: profile.name,
        transaction_type: 'written',
        amount: amt,
        description: description || 'Book in cash (written) entry',
        payment_method: 'handcash',
        person_name: personName || null,
        date
      }).select().single();

      if (error) throw error;

      await logActivity({
        activityType: 'collection_added',
        description: `Written entry of ₹${amt}${personName ? ` for ${personName}` : ''}`,
        tableAffected: 'financial_transactions',
        recordId: data?.id,
        amount: amt,
        metadata: { mode: 'written', person_name: personName }
      });

      toast({ title: 'Success', description: 'Written entry added successfully' });
      handleClose();
      onSuccess();
    } catch (err: any) {
      console.error('Error adding written entry:', err);
      toast({ title: 'Error', description: err.message || 'Failed to add entry', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setAmount('');
    setPersonName('');
    setDescription('');
    setDate(new Date().toISOString().split('T')[0]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Book in Cash (Written)</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="amount">Amount (₹)</Label>
            <Input id="amount" type="number" placeholder="Enter amount" value={amount} onChange={(e) => setAmount(e.target.value)} min="0" step="0.01" required />
          </div>
          <div>
            <Label htmlFor="personName">Person Name (optional)</Label>
            <Input id="personName" placeholder="Enter name" value={personName} onChange={(e) => setPersonName(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="date">Date</Label>
            <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="description">Notes (optional)</Label>
            <Textarea id="description" placeholder="Add any notes" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={handleClose}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Adding...' : 'Add Written'}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddWrittenModal;
