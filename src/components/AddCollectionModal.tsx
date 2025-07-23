import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { AdminCollection } from '@/types';
import { toast } from 'sonner';

interface AddCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCollectionAdded: (collection: AdminCollection) => void;
}

export const AddCollectionModal: React.FC<AddCollectionModalProps> = ({
  isOpen,
  onClose,
  onCollectionAdded
}) => {
  const { currentAdmin } = useAuth();
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentAdmin) {
      toast.error('You must be logged in to add a collection');
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    setIsSubmitting(true);

    try {
      const collection: AdminCollection = {
        id: Math.random().toString(36).substr(2, 9),
        adminId: currentAdmin.id,
        adminName: currentAdmin.name,
        amount: parseFloat(amount),
        date,
        createdAt: new Date()
      };

      // Save to localStorage
      const existingCollections = JSON.parse(localStorage.getItem('adminCollections') || '[]');
      const updatedCollections = [...existingCollections, collection];
      localStorage.setItem('adminCollections', JSON.stringify(updatedCollections));

      onCollectionAdded(collection);
      toast.success(`Collection of ₹${amount} added successfully`);
      
      // Reset form
      setAmount('');
      setDate(new Date().toISOString().split('T')[0]);
      onClose();
    } catch (error) {
      toast.error('Failed to add collection');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setAmount('');
    setDate(new Date().toISOString().split('T')[0]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Daily Collection</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="amount">Amount Collected (₹)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0"
              step="0.01"
              required
            />
          </div>

          <div>
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Adding...' : 'Add Collection'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};