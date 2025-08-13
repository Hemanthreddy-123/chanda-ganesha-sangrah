import React, { useState } from 'react';
import { useAuth } from '@/context/SupabaseAuthContext';
import { useEnhancedPeople } from '@/hooks/useEnhancedPeople';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Plus, User, CreditCard, Smartphone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export const People = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { people, addPerson, loading } = useEnhancedPeople();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    total_donations: 0,
    preferred_payment_method: 'upi',
    upi_id: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to add people",
        variant: "destructive"
      });
      return;
    }

    const result = await addPerson({
      name: formData.name,
      total_donations: formData.total_donations,
      preferred_payment_method: formData.preferred_payment_method,
      upi_id: formData.upi_id,
      is_active: true
    });

    if (result) {
      toast({
        title: "Success",
        description: "Person added successfully"
      });
      setFormData({
        name: '',
        total_donations: 0,
        preferred_payment_method: 'upi',
        upi_id: ''
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to add person",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate('/donations')}
            className="shrink-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">People Management</h1>
            <p className="text-muted-foreground">Add and manage people information</p>
          </div>
        </div>

        {/* Add Person Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add New Person
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Name *
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter person's name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount" className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Amount
                  </Label>
                  <Input
                    id="amount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.total_donations}
                    onChange={(e) => setFormData(prev => ({ ...prev, total_donations: parseFloat(e.target.value) || 0 }))}
                    placeholder="Enter amount"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="payment_method">Payment Method</Label>
                  <Select
                    value={formData.preferred_payment_method}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, preferred_payment_method: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="upi">UPI</SelectItem>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="card">Card</SelectItem>
                      <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="upi_id" className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4" />
                    UPI ID
                  </Label>
                  <Input
                    id="upi_id"
                    value={formData.upi_id}
                    onChange={(e) => setFormData(prev => ({ ...prev, upi_id: e.target.value }))}
                    placeholder="example@upi"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full md:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                Add Person
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* People List */}
        <Card>
          <CardHeader>
            <CardTitle>People List ({people.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-muted-foreground">Loading people...</p>
              </div>
            ) : people.length === 0 ? (
              <div className="text-center py-8">
                <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No people added yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {people.map((person) => (
                  <Card key={person.id} className="border">
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <h3 className="font-semibold text-foreground">{person.name}</h3>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <p className="flex items-center gap-2">
                            <CreditCard className="h-3 w-3" />
                            Amount: ₹{person.total_donations}
                          </p>
                          <p className="flex items-center gap-2">
                            <span className="h-3 w-3 rounded-full bg-primary/20"></span>
                            {person.preferred_payment_method.toUpperCase()}
                          </p>
                          {person.upi_id && (
                            <p className="flex items-center gap-2">
                              <Smartphone className="h-3 w-3" />
                              {person.upi_id}
                            </p>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Added by: {person.admin_name}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};