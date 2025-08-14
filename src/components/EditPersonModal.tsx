import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { PersonRecord } from '@/hooks/useEnhancedPeople';

interface EditPersonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  person: PersonRecord | null;
  onUpdate: (id: string, updates: Partial<PersonRecord>) => Promise<any>;
}

export const EditPersonModal: React.FC<EditPersonModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  person,
  onUpdate
}) => {
  const [formData, setFormData] = useState({
    name: '',
    upi_id: '',
    total_donations: 0,
    preferred_payment_method: 'cash',
    payment_status: 'pending' as 'paid' | 'pending',
    priority_order: 0,
    is_active: true
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (person) {
      setFormData({
        name: person.name,
        upi_id: person.upi_id || '',
        total_donations: person.total_donations,
        preferred_payment_method: person.preferred_payment_method,
        payment_status: person.payment_status || 'pending',
        priority_order: person.priority_order || 0,
        is_active: person.is_active
      });
    }
  }, [person]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!person) return;

    setLoading(true);
    try {
      const result = await onUpdate(person.id, {
        name: formData.name,
        upi_id: formData.upi_id || undefined,
        total_donations: formData.total_donations,
        preferred_payment_method: formData.preferred_payment_method,
        payment_status: formData.payment_status,
        priority_order: formData.priority_order,
        is_active: formData.is_active
      });

      if (result) {
        toast({
          title: "Success",
          description: "Person updated successfully!",
        });
        onSuccess();
        onClose();
      } else {
        throw new Error('Update failed');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update person. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      upi_id: '',
      total_donations: 0,
      preferred_payment_method: 'cash',
      payment_status: 'pending',
      priority_order: 0,
      is_active: true
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Person</DialogTitle>
          <DialogDescription>
            Update person information and settings
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter full name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="total_donations">Total Donations (₹) *</Label>
            <Input
              id="total_donations"
              type="number"
              min="0"
              step="0.01"
              value={formData.total_donations}
              onChange={(e) => setFormData({ ...formData, total_donations: parseFloat(e.target.value) || 0 })}
              placeholder="Enter amount"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="upi_id">UPI ID (Optional)</Label>
            <Input
              id="upi_id"
              value={formData.upi_id}
              onChange={(e) => setFormData({ ...formData, upi_id: e.target.value })}
              placeholder="Enter UPI ID"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="preferred_payment_method">Preferred Payment Method</Label>
            <Select value={formData.preferred_payment_method} onValueChange={(value) => setFormData({ ...formData, preferred_payment_method: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="phonepay">PhonePe</SelectItem>
                <SelectItem value="upi">UPI</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="payment_status">Payment Status</Label>
            <Select value={formData.payment_status} onValueChange={(value: 'paid' | 'pending') => setFormData({ ...formData, payment_status: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-amber-600">Pending</Badge>
                  </div>
                </SelectItem>
                <SelectItem value="paid">
                  <div className="flex items-center gap-2">
                    <Badge variant="default" className="bg-green-600">Paid</Badge>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority_order">Priority Order</Label>
            <Input
              id="priority_order"
              type="number"
              min="0"
              value={formData.priority_order}
              onChange={(e) => setFormData({ ...formData, priority_order: parseInt(e.target.value) || 0 })}
              placeholder="Higher number = higher priority"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="is_active">Status</Label>
            <Select value={formData.is_active.toString()} onValueChange={(value) => setFormData({ ...formData, is_active: value === 'true' })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">
                  <Badge variant="default" className="bg-green-600">Active</Badge>
                </SelectItem>
                <SelectItem value="false">
                  <Badge variant="secondary" className="bg-red-600">Inactive</Badge>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Updating..." : "Update Person"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};