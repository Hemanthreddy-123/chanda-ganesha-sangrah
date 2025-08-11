import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/context/SupabaseAuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useActivityLogger } from '@/hooks/useActivityLogger';
import { useToast } from '@/hooks/use-toast';

interface AddPersonModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPersonAdded: () => void;
}

const AddPersonModal: React.FC<AddPersonModalProps> = ({
  open,
  onOpenChange,
  onPersonAdded,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    amount_paid: '',
    payment_method: 'cash'
  });
  const [loading, setLoading] = useState(false);
  const { user, profile } = useAuth();
  const { logActivity } = useActivityLogger();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !profile) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('persons')
        .insert({
          name: formData.name,
          amount_paid: Number(formData.amount_paid),
          payment_method: formData.payment_method,
          admin_id: user.id,
          admin_name: profile.name,
        })
        .select()
        .single();

      if (error) throw error;

      // Log the activity
      await logActivity({
        activityType: 'person_added',
        description: `Added person: ${formData.name} with payment of ₹${formData.amount_paid}`,
        tableAffected: 'persons',
        recordId: data.id,
        amount: Number(formData.amount_paid),
        metadata: {
          person_name: formData.name,
          payment_method: formData.payment_method
        }
      });

      toast({
        title: "Success",
        description: "Person added successfully!",
      });

      setFormData({
        name: '',
        amount_paid: '',
        payment_method: 'cash'
      });
      
      onPersonAdded();
      onOpenChange(false);
    } catch (error) {
      console.error('Error adding person:', error);
      toast({
        title: "Error",
        description: "Failed to add person. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Person</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter person's name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount_paid">Amount Paid (₹)</Label>
            <Input
              id="amount_paid"
              type="number"
              step="0.01"
              value={formData.amount_paid}
              onChange={(e) => setFormData(prev => ({ ...prev, amount_paid: e.target.value }))}
              placeholder="Enter amount"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="payment_method">Payment Method</Label>
            <Select value={formData.payment_method} onValueChange={(value) => setFormData(prev => ({ ...prev, payment_method: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="upi">UPI</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add Person'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddPersonModal;