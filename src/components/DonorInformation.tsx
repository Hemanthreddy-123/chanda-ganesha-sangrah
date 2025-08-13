import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Users, Gift, IndianRupee, Calendar } from 'lucide-react';

interface DonorInfo {
  id: string;
  donor_name: string;
  donor_phone: string;
  items_donated: string;
  amount: number;
  payment_method: string;
  created_at: string;
  receiving_admin_name: string;
}

export const DonorInformation: React.FC = () => {
  const [donors, setDonors] = useState<DonorInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDonors();
  }, []);

  const fetchDonors = async () => {
    try {
      const { data, error } = await supabase
        .from('donations')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setDonors(data || []);
    } catch (error) {
      console.error('Error fetching donors:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Recent Donations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Recent Donations ({donors.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {donors.length === 0 ? (
          <div className="text-center py-8">
            <Gift className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No donations recorded yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {donors.map((donor) => (
              <div
                key={donor.id}
                className="border rounded-lg p-4 hover:bg-accent/50 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {donor.donor_name || 'Anonymous'}
                    </h3>
                    {donor.donor_phone && (
                      <p className="text-sm text-muted-foreground">
                        {donor.donor_phone}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-emerald-600 font-semibold">
                      <IndianRupee className="h-4 w-4" />
                      {donor.amount}
                    </div>
                    <span className="text-xs text-muted-foreground capitalize">
                      {donor.payment_method?.replace('_', ' ')}
                    </span>
                  </div>
                </div>
                
                {donor.items_donated && (
                  <div className="mb-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Gift className="h-3 w-3 text-orange-500" />
                      <span className="text-muted-foreground">Items:</span>
                      <span className="text-foreground">{donor.items_donated}</span>
                    </div>
                  </div>
                )}
                
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(donor.created_at).toLocaleDateString()}
                  </div>
                  <div>
                    Received by: {donor.receiving_admin_name}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};