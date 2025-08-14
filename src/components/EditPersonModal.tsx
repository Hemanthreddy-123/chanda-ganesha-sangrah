import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface PersonRecord {
  id: string;
  name: string;
  amount: number;
  upi_id?: string;
  admin_id: string;
  admin_name: string;
  created_at: string;
  payment_status?: string;
  priority_order?: number;
}

interface EditPersonModalProps {
  isOpen: boolean;
  onClose: () => void;
  person: PersonRecord;
  onUpdate: (id: string, updates: Partial<PersonRecord>) => Promise<void>;
}

export const EditPersonModal: React.FC<EditPersonModalProps> = ({
  isOpen,
  onClose,
  person,
  onUpdate
}) => {
  const [formData, setFormData] = useState({
    name: person.name,
    amount: person.amount.toString(),
    upi_id: person.upi_id || '',
    payment_status: person.payment_status || 'pending',
    priority_order: person.priority_order?.toString() || '0'
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onUpdate(person.id, {
        name: formData.name,
        amount: Number(formData.amount),
        upi_id: formData.upi_id || null,
        payment_status: formData.payment_status,
        priority_order: Number(formData.priority_order)
      });
      
      toast.success('Person updated successfully!');
      onClose();
    } catch (error) {
      console.error('Error updating person:', error);
      toast.error('Failed to update person');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Person</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter person's name"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="amount">Amount *</Label>
            <Input
              id="amount"
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
              placeholder="Enter amount"
              min="0"
              step="0.01"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="upi_id">UPI ID</Label>
            <Input
              id="upi_id"
              value={formData.upi_id}
              onChange={(e) => setFormData(prev => ({ ...prev, upi_id: e.target.value }))}
              placeholder="example@upi"
            />
          </div>

          <div>
            <Label htmlFor="payment_status">Payment Status</Label>
            <Select
              value={formData.payment_status}
              onValueChange={(value) => setFormData(prev => ({ ...prev, payment_status: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select payment status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="priority_order">Priority Order</Label>
            <Input
              id="priority_order"
              type="number"
              value={formData.priority_order}
              onChange={(e) => setFormData(prev => ({ ...prev, priority_order: e.target.value }))}
              placeholder="Enter priority (1=highest, 4=lowest)"
              min="1"
              max="10"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Lower numbers = higher priority (1 = highest priority)
            </p>
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Updating...' : 'Update Person'}
            </Button>
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};