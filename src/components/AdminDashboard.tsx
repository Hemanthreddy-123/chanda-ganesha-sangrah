
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/SupabaseAuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AddPersonModal } from '@/components/AddPersonModal';
import { AdminActivityLog } from '@/components/AdminActivityLog';
import { DonationModal } from '@/components/DonationModal';
import { AddCollectionModal } from '@/components/AddCollectionModal';
import { AddExpenseModal } from '@/components/AddExpenseModal';
import ManualFinancialEntry from '@/components/ManualFinancialEntry';
import FinancialSummary from '@/components/FinancialSummary';
import { supabase } from '@/integrations/supabase/client';
import {
  LogOut,
  Users,
  DollarSign,
  Activity,
  Plus,
  TrendingUp,
  TrendingDown,
  Calendar,
  Bell
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DashboardStats {
  totalPersons: number;
  totalDonations: number;
  totalCollections: number;
  totalExpenses: number;
  recentActivities: number;
}

export const AdminDashboard = () => {
  const { user, profile, signOut } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState<DashboardStats>({
    totalPersons: 0,
    totalDonations: 0,
    totalCollections: 0,
    totalExpenses: 0,
    recentActivities: 0
  });
  const [isAddPersonModalOpen, setIsAddPersonModalOpen] = useState(false);
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);
  const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      // Load persons count
      const { count: personsCount } = await supabase
        .from('persons')
        .select('*', { count: 'exact', head: true });

      // Load donations count
      const { count: donationsCount } = await supabase
        .from('donations')
        .select('*', { count: 'exact', head: true });

      // Load collections count
      const { count: collectionsCount } = await supabase
        .from('admin_collections')
        .select('*', { count: 'exact', head: true });

      // Load expenses count
      const { count: expensesCount } = await supabase
        .from('admin_expenses')
        .select('*', { count: 'exact', head: true });

      // Load recent activities count (last 24 hours)
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      const { count: activitiesCount } = await supabase
        .from('activity_logs')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', yesterday.toISOString());

      setStats({
        totalPersons: personsCount || 0,
        totalDonations: donationsCount || 0,
        totalCollections: collectionsCount || 0,
        totalExpenses: expensesCount || 0,
        recentActivities: activitiesCount || 0
      });
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed Out",
      description: "You have been successfully signed out.",
    });
  };

  if (!user || !profile) {
    return null;
  }

  return (
    <div className="space-y-4 sm:space-y-6 p-3 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-3xl font-bold text-primary">Admin Dashboard</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Welcome back, <span className="font-semibold">{profile.name}</span>
          </p>
        </div>
        <Button 
          onClick={handleSignOut} 
          variant="outline" 
          className="text-sm sm:text-base px-3 sm:px-4 py-2"
        >
          <LogOut className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
          Sign Out
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">People</CardTitle>
            <Users className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold">{stats.totalPersons}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Donations</CardTitle>
            <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold">{stats.totalDonations}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Collections</CardTitle>
            <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold">{stats.totalCollections}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Expenses</CardTitle>
            <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold">{stats.totalExpenses}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Activities</CardTitle>
            <Activity className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold">{stats.recentActivities}</div>
            <p className="text-xs text-muted-foreground">Last 24h</p>
          </CardContent>
        </Card>
      </div>

      {/* Manual Financial Entry - Only for admins */}
      <ManualFinancialEntry />

      {/* Financial Summary */}
      <div>
        <h2 className="text-lg sm:text-2xl font-bold mb-4 sm:mb-6">Financial Overview</h2>
        <FinancialSummary />
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="actions" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-2 text-xs sm:text-sm">
          <TabsTrigger value="actions" className="text-xs sm:text-sm">Quick Actions</TabsTrigger>
          <TabsTrigger value="activity" className="text-xs sm:text-sm">Activity Log</TabsTrigger>
        </TabsList>

        <TabsContent value="actions" className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <Button 
              onClick={() => setIsAddPersonModalOpen(true)}
              className="flex items-center justify-center gap-2 h-12 sm:h-16 text-sm sm:text-base"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              Add Person
            </Button>

            <Button 
              onClick={() => setIsDonationModalOpen(true)}
              variant="secondary"
              className="flex items-center justify-center gap-2 h-12 sm:h-16 text-sm sm:text-base"
            >
              <DollarSign className="w-4 h-4 sm:w-5 sm:h-5" />
              Record Donation
            </Button>

            <Button 
              onClick={() => setIsCollectionModalOpen(true)}
              variant="outline"
              className="flex items-center justify-center gap-2 h-12 sm:h-16 text-sm sm:text-base"
            >
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
              Add Collection
            </Button>

            <Button 
              onClick={() => setIsExpenseModalOpen(true)}
              variant="destructive"
              className="flex items-center justify-center gap-2 h-12 sm:h-16 text-sm sm:text-base"
            >
              <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5" />
              Record Expense
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <AdminActivityLog />
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <AddPersonModal 
        isOpen={isAddPersonModalOpen} 
        onClose={() => setIsAddPersonModalOpen(false)}
        onPersonAdded={loadDashboardStats}
      />
      
      <DonationModal 
        isOpen={isDonationModalOpen} 
        onClose={() => setIsDonationModalOpen(false)}
        person={null}
        onDonationComplete={() => {
          loadDashboardStats();
          setIsDonationModalOpen(false);
        }}
      />

      <AddCollectionModal 
        open={isCollectionModalOpen} 
        onOpenChange={setIsCollectionModalOpen}
        onSuccess={loadDashboardStats}
      />

      <AddExpenseModal 
        open={isExpenseModalOpen} 
        onOpenChange={setIsExpenseModalOpen}
        onSuccess={loadDashboardStats}
      />
    </div>
  );
};
