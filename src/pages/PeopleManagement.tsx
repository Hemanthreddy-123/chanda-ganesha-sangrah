import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { EditPersonModal } from '@/components/EditPersonModal';
import { useAuth } from '@/context/SupabaseAuthContext';
import { useEnhancedPeople, PersonRecord } from '@/hooks/useEnhancedPeople';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, 
  Search, 
  Plus, 
  Edit, 
  ArrowUp, 
  ArrowDown, 
  IndianRupee, 
  Phone,
  CheckCircle,
  Clock,
  ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const PeopleManagement: React.FC = () => {
  const { profile } = useAuth();
  const { people, addPerson, updatePerson, loading, refreshPeople } = useEnhancedPeople();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingPerson, setEditingPerson] = useState<PersonRecord | null>(null);
  const [newPerson, setNewPerson] = useState({
    name: '',
    total_donations: 0,
    upi_id: '',
    preferred_payment_method: 'cash',
    is_active: true
  });

  const handleAddPerson = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!profile) {
      toast({
        title: "Error",
        description: "You must be logged in as an admin to add people.",
        variant: "destructive",
      });
      return;
    }

    if (!newPerson.name.trim()) {
      toast({
        title: "Error", 
        description: "Name is required.",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await addPerson({
        name: newPerson.name,
        total_donations: newPerson.total_donations,
        upi_id: newPerson.upi_id || undefined,
        preferred_payment_method: newPerson.preferred_payment_method,
        is_active: newPerson.is_active
      });

      if (result) {
        toast({
          title: "Success",
          description: `${newPerson.name} has been added successfully!`,
        });
        
        setNewPerson({
          name: '',
          total_donations: 0,
          upi_id: '',
          preferred_payment_method: 'cash',
          is_active: true
        });
        setIsAddModalOpen(false);
      } else {
        throw new Error('Failed to add person');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add person. Please try again.",
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

  const totalAmount = people.reduce((sum, person) => sum + Number(person.total_donations || 0), 0);

  if (!profile) {
    return (
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Access Restricted</h1>
          <p className="text-muted-foreground">
            Please login as an admin to access the people management section.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-4 sm:py-8 px-2 sm:px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex-1">
            <Button 
              variant="outline" 
              onClick={() => navigate('/donations')}
              className="mb-4 w-full sm:w-auto"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Donations
            </Button>
            <h1 className="text-2xl sm:text-3xl font-bold ganesh-gradient bg-clip-text text-transparent">
              People Management
            </h1>
            <p className="text-muted-foreground mt-2 text-sm sm:text-base">
              Manage people, payment status, and priority ordering
            </p>
          </div>
          <Button onClick={() => setIsAddModalOpen(true)} className="w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Add Person
          </Button>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <Card className="festival-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total People</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{people.length}</div>
              <p className="text-xs text-muted-foreground">
                People registered
              </p>
            </CardContent>
          </Card>

          <Card className="festival-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
              <IndianRupee className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">₹{totalAmount}</div>
              <p className="text-xs text-muted-foreground">
                Total contributions
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <Input
            type="text"
            placeholder="Search by name or admin..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12"
          />
        </div>

        {/* People Cards */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-muted rounded-lg h-32"></div>
              </div>
            ))}
          </div>
        ) : filteredPeople.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPeople.map((person) => (
              <Card key={person.id} className="festival-card border-l-4 border-l-primary/20">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Users className="w-5 h-5 text-primary" />
                      {person.name}
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
                    </CardTitle>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingPerson(person)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
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
                  {person.upi_id && (
                    <CardDescription className="flex items-center gap-1 text-sm">
                      <Phone className="w-3 h-3" />
                      UPI: {person.upi_id}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Amount:</span>
                      <Badge variant="secondary" className="text-primary text-lg font-bold">
                        ₹{person.total_donations}
                      </Badge>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Priority:</span>
                      <Badge variant="outline">
                        {person.priority_order || 0}
                      </Badge>
                    </div>
                    
                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                      <span>Added by: {person.admin_name}</span>
                      <span>{new Date(person.created_at).toLocaleDateString('en-IN')}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No People Found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm ? 'No people match your search criteria.' : 'No people have been added yet.'}
            </p>
            {!searchTerm && (
              <Button onClick={() => setIsAddModalOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add First Person
              </Button>
            )}
          </div>
        )}

        {/* Add Person Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Add New Person</CardTitle>
                <CardDescription>
                  Add a person with their contribution details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddPerson} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="text-sm font-medium">Name *</label>
                    <Input
                      id="name"
                      type="text"
                      value={newPerson.name}
                      onChange={(e) => setNewPerson({ ...newPerson, name: e.target.value })}
                      placeholder="Enter person's name"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="amount" className="text-sm font-medium">Amount (₹) *</label>
                    <Input
                      id="amount"
                      type="number"
                      value={newPerson.total_donations}
                      onChange={(e) => setNewPerson({ ...newPerson, total_donations: parseFloat(e.target.value) || 0 })}
                      placeholder="Enter amount"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="upi_id" className="text-sm font-medium">UPI ID (Optional)</label>
                    <Input
                      id="upi_id"
                      type="text"
                      value={newPerson.upi_id}
                      onChange={(e) => setNewPerson({ ...newPerson, upi_id: e.target.value })}
                      placeholder="example@upi"
                    />
                  </div>
                  
                  <div className="flex gap-2 pt-4">
                    <Button type="submit" className="flex-1">
                      Add Person
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsAddModalOpen(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Edit Person Modal */}
        <EditPersonModal
          isOpen={!!editingPerson}
          onClose={() => setEditingPerson(null)}
          onSuccess={() => {
            refreshPeople();
            setEditingPerson(null);
          }}
          person={editingPerson}
          onUpdate={updatePerson}
        />
      </div>
    </div>
  );
};