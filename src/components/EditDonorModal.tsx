import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface Donor {
  id: string;
  donor_name: string;
  donor_phone?: string;
  items_donated?: string;
  amount: number;
  receiving_admin_name: string;
  created_at: string;
  priority_order?: number;
}

interface EditDonorModalProps {
  isOpen: boolean;
  onClose: () => void;
  donor: Donor;
  onUpdate: (id: string, updates: Partial<Donor>) => Promise<void>;
}

export const EditDonorModal: React.FC<EditDonorModalProps> = ({
  isOpen,
  onClose,
  donor,
  onUpdate
}) => {
  const [formData, setFormData] = useState({
    donor_name: donor.donor_name,
    donor_phone: donor.donor_phone || '',
    items_donated: donor.items_donated || '',
    amount: donor.amount.toString(),
    priority_order: donor.priority_order?.toString() || '1'
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onUpdate(donor.id, {
        donor_name: formData.donor_name,
        donor_phone: formData.donor_phone || null,
        items_donated: formData.items_donated,
        amount: Number(formData.amount),
        priority_order: Number(formData.priority_order)
      });
      
      toast.success('Donor updated successfully!');
      onClose();
    } catch (error) {
      console.error('Error updating donor:', error);
      toast.error('Failed to update donor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Donor</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="donor_name">Donor Name *</Label>
            <Input
              id="donor_name"
              value={formData.donor_name}
              onChange={(e) => setFormData(prev => ({ ...prev, donor_name: e.target.value }))}
              placeholder="Enter donor's name"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="donor_phone">Phone Number</Label>
            <Input
              id="donor_phone"
              value={formData.donor_phone}
              onChange={(e) => setFormData(prev => ({ ...prev, donor_phone: e.target.value }))}
              placeholder="Enter phone number"
            />
          </div>
          
          <div>
            <Label htmlFor="items_donated">Items Donated</Label>
            <Input
              id="items_donated"
              value={formData.items_donated}
              onChange={(e) => setFormData(prev => ({ ...prev, items_donated: e.target.value }))}
              placeholder="Enter items donated"
            />
          </div>

          <div>
            <Label htmlFor="amount">Estimated Value</Label>
            <Input
              id="amount"
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
              placeholder="Enter estimated value"
              min="0"
              step="0.01"
            />
          </div>

          <div>
            <Label htmlFor="priority_order">Priority Order</Label>
            <Select
              value={formData.priority_order}
              onValueChange={(value) => setFormData(prev => ({ ...prev, priority_order: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 (Highest)</SelectItem>
                <SelectItem value="2">2</SelectItem>
                <SelectItem value="3">3</SelectItem>
                <SelectItem value="4">4</SelectItem>
                <SelectItem value="5">5 (Lowest)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">
              Lower numbers = higher priority for display
            </p>
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Updating...' : 'Update Donor'}
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