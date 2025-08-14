import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useEnhancedPeople, PersonRecord } from '@/hooks/useEnhancedPeople';
import { useAuth } from '@/context/SupabaseAuthContext';
import { Search, ArrowUp, ArrowDown, CheckCircle, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const PaymentStatusManager: React.FC = () => {
  const { people, updatePerson, loading } = useEnhancedPeople();
  const { profile } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');

  const updatePaymentStatus = async (personId: string, status: 'paid' | 'pending') => {
    const result = await updatePerson(personId, { payment_status: status });
    if (result) {
      toast({
        title: "Success",
        description: `Payment status updated to ${status}`,
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to update payment status",
        variant: "destructive",
      });
    }
  };

  const updatePriority = async (personId: string, newPriority: number) => {
    const result = await updatePerson(personId, { priority_order: newPriority });
    if (result) {
      toast({
        title: "Success",
        description: "Priority updated successfully",
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to update priority",
        variant: "destructive",
      });
    }
  };

  const filteredPeople = people.filter(person =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.admin_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!profile) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">Please login to manage payment status</p>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">Loading people...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-primary" />
            Payment Status & Priority Management
          </CardTitle>
          <CardDescription>
            Manage payment status and donor priority for all registered people
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              type="text"
              placeholder="Search by name or admin..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="space-y-4">
            {filteredPeople.map((person) => (
              <Card key={person.id} className="border-l-4 border-l-primary/20">
                <CardContent className="p-4">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{person.name}</h3>
                        <Badge 
                          variant={person.payment_status === 'paid' ? 'default' : 'secondary'}
                          className={person.payment_status === 'paid' ? 'bg-green-600' : 'bg-amber-600'}
                        >
                          {person.payment_status === 'paid' ? (
                            <CheckCircle className="w-3 h-3 mr-1" />
                          ) : (
                            <Clock className="w-3 h-3 mr-1" />
                          )}
                          {person.payment_status || 'pending'}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p>Amount: ₹{person.total_donations}</p>
                        <p>Added by: {person.admin_name}</p>
                        <p>Priority: {person.priority_order || 0}</p>
                        {person.upi_id && <p>UPI: {person.upi_id}</p>}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant={person.payment_status === 'paid' ? 'default' : 'outline'}
                          onClick={() => updatePaymentStatus(person.id, 'paid')}
                          className={person.payment_status === 'paid' ? 'bg-green-600 hover:bg-green-700' : ''}
                        >
                          Mark Paid
                        </Button>
                        <Button
                          size="sm"
                          variant={person.payment_status === 'pending' ? 'default' : 'outline'}
                          onClick={() => updatePaymentStatus(person.id, 'pending')}
                          className={person.payment_status === 'pending' ? 'bg-amber-600 hover:bg-amber-700' : ''}
                        >
                          Mark Pending
                        </Button>
                      </div>

                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updatePriority(person.id, (person.priority_order || 0) + 1)}
                        >
                          <ArrowUp className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updatePriority(person.id, Math.max(0, (person.priority_order || 0) - 1))}
                        >
                          <ArrowDown className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredPeople.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {searchTerm ? 'No people found matching your search' : 'No people registered yet'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};