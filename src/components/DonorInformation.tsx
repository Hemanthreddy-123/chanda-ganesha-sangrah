import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Gift, Phone, Calendar } from 'lucide-react';

interface Donor {
  id: string;
  donor_name: string;
  donor_phone?: string;
  items_donated?: string;
  amount: number;
  receiving_admin_name: string;
  created_at: string;
}

export const DonorInformation: React.FC = () => {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDonors();
  }, []);

  const loadDonors = async () => {
    try {
      const { data, error } = await supabase
        .from('donations')
        .select('*')
        .not('items_donated', 'is', null)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setDonors(data || []);
    } catch (error) {
      console.error('Error loading donors:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-muted rounded-lg h-40"></div>
          </div>
        ))}
      </div>
    );
  }

  if (donors.length === 0) {
    return (
      <div className="text-center py-8">
        <Gift className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Donors Yet</h3>
        <p className="text-muted-foreground">
          No donors have been added yet. Donors will appear here once added by admins.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-2">
          Recent Donors
        </h2>
        <p className="text-muted-foreground">
          Community members who have contributed items for our festival
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {donors.map((donor) => (
          <Card key={donor.id} className="festival-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Gift className="w-5 h-5 text-primary" />
                {donor.donor_name}
              </CardTitle>
              {donor.donor_phone && (
                <CardDescription className="flex items-center gap-1 text-sm">
                  <Phone className="w-3 h-3" />
                  {donor.donor_phone}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {donor.items_donated && (
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Items Donated:</span>
                    <p className="text-sm mt-1 p-2 bg-muted/50 rounded-md">
                      {donor.items_donated}
                    </p>
                  </div>
                )}
                
                {donor.amount > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Estimated Value:</span>
                    <Badge variant="secondary" className="text-primary">
                      ₹{donor.amount}
                    </Badge>
                  </div>
                )}
                
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(donor.created_at).toLocaleDateString('en-IN')}
                  </span>
                  <span>By: {donor.receiving_admin_name}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};