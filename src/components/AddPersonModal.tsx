import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/SupabaseAuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { logAdminActivity } from '@/components/AdminActivityLog';

interface AddPersonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPersonAdded: () => void;
}

export const AddPersonModal: React.FC<AddPersonModalProps> = ({
  isOpen,
  onClose,
  onPersonAdded
}) => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('persons')
        .insert({
          name: formData.name,
          phone_number: formData.phone,
          address: formData.address,
          admin_id: profile.id,
          admin_name: profile.name
        });

      if (error) throw error;

      await logAdminActivity(
        profile.id,
        profile.name,
        'person_added',
        `Added new person: ${formData.name}`
      );

      toast({
        title: "Success",
        description: "Person added successfully",
      });

      setFormData({ name: '', phone: '', address: '' });
      onPersonAdded();
      onClose();
    } catch (error) {
      console.error('Error adding person:', error);
      toast({
        title: "Error",
        description: "Failed to add person",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Person</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="Phone number"
            />
          </div>
          <div>
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Address"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Adding...' : 'Add Person'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};