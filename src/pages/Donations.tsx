import React, { useState, useEffect } from 'react';
import { Person, Donation } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  IndianRupee, 
  TrendingUp, 
  Calendar, 
  Users, 
  Search,
  ArrowLeft,
  Download
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Donations: React.FC = () => {
  const [persons, setPersons] = useState<Person[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [dailyReports, setDailyReports] = useState<{[key: string]: number}>({});
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    // Load persons with payments
    const storedPersons = localStorage.getItem('persons');
    if (storedPersons) {
      setPersons(JSON.parse(storedPersons));
    }

    // Load donations
    const storedDonations = localStorage.getItem('donations');
    if (storedDonations) {
      const donationData: Donation[] = JSON.parse(storedDonations);
      setDonations(donationData);

      // Calculate daily reports from donations
      const dailyData: {[key: string]: number} = {};
      donationData.forEach(donation => {
        const date = new Date(donation.createdAt).toLocaleDateString('en-IN');
        dailyData[date] = (dailyData[date] || 0) + donation.amount;
      });
      setDailyReports(dailyData);
    }
  };

  // Calculate totals from persons (actual payments)
  const totalFromPersons = persons.reduce((sum, person) => sum + (person.amountPaid || 0), 0);
  const handCashFromPersons = persons.filter(p => p.paymentMethod === 'handcash').reduce((sum, p) => sum + (p.amountPaid || 0), 0);
  const phonePeFromPersons = persons.filter(p => p.paymentMethod === 'phonepay').reduce((sum, p) => sum + (p.amountPaid || 0), 0);

  // Calculate totals from donations (additional donations)
  const totalFromDonations = donations.reduce((sum, d) => sum + d.amount, 0);
  const handCashFromDonations = donations.filter(d => d.paymentMethod === 'handcash').reduce((sum, d) => sum + d.amount, 0);
  const phonePeFromDonations = donations.filter(d => d.paymentMethod === 'phonepay').reduce((sum, d) => sum + d.amount, 0);

  // Grand totals
  const grandTotal = totalFromPersons + totalFromDonations;
  const totalHandCash = handCashFromPersons + handCashFromDonations;
  const totalPhonePe = phonePeFromPersons + phonePeFromDonations;

  const filteredPersons = persons.filter(person =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.adminName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Button 
              variant="outline" 
              onClick={() => navigate('/')}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            <h1 className="text-3xl font-bold ganesh-gradient bg-clip-text text-transparent">
              Donation Details & Financial Reports
            </h1>
            <p className="text-muted-foreground mt-2">
              Complete collection tracking for Depur Vinayaka Chavithi 2k25
            </p>
          </div>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="festival-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Grand Total</CardTitle>
              <IndianRupee className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">₹{grandTotal}</div>
              <p className="text-xs text-muted-foreground">
                All collections combined
              </p>
            </CardContent>
          </Card>

          <Card className="festival-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Contributors</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{persons.length + donations.length}</div>
              <p className="text-xs text-muted-foreground">
                People + Additional donations
              </p>
            </CardContent>
          </Card>

          <Card className="festival-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Hand Cash Total</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">₹{totalHandCash}</div>
              <p className="text-xs text-muted-foreground">
                Cash collections
              </p>
            </CardContent>
          </Card>

          <Card className="festival-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Digital Total</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">₹{totalPhonePe}</div>
              <p className="text-xs text-muted-foreground">
                PhonePe/UPI payments
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Daily Collection Reports */}
        {Object.keys(dailyReports).length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">
              <span className="ganesh-gradient bg-clip-text text-transparent">
                Daily Collection Reports
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(dailyReports)
                .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
                .map(([date, amount]) => (
                  <Card key={date} className="festival-card">
                    <CardContent className="text-center py-4">
                      <Calendar className="w-6 h-6 text-primary mx-auto mb-2" />
                      <div className="font-semibold mb-1">{date}</div>
                      <div className="text-xl font-bold text-primary">₹{amount}</div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        )}

        {/* Person Payments Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">
            <span className="ganesh-gradient bg-clip-text text-transparent">
              Member Contributions (₹{totalFromPersons})
            </span>
          </h2>
          
          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              type="text"
              placeholder="Search by name, address, or admin..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPersons.map((person) => (
              <Card key={person.id} className="festival-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{person.name}</CardTitle>
                  <CardDescription>{person.address}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Amount:</span>
                      <span className="text-lg font-bold text-primary">₹{person.amountPaid || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Method:</span>
                      <Badge variant={person.paymentMethod === 'handcash' ? 'default' : 'secondary'}>
                        {person.paymentMethod === 'handcash' ? 'Hand Cash' : 'PhonePe'}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Phone:</span>
                      <span className="text-sm">{person.phoneNumber}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Added by:</span>
                      <span className="text-sm">{person.adminName}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Date:</span>
                      <span className="text-sm">{new Date(person.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Additional Donations Section */}
        {donations.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">
              <span className="ganesh-gradient bg-clip-text text-transparent">
                Additional Donations (₹{totalFromDonations})
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {donations.map((donation) => (
                <Card key={donation.id} className="festival-card">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">{donation.donorName || 'Anonymous'}</CardTitle>
                    <CardDescription>Donated to {donation.personName}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Amount:</span>
                        <span className="text-lg font-bold text-primary">₹{donation.amount}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Method:</span>
                        <Badge variant={donation.paymentMethod === 'handcash' ? 'default' : 'secondary'}>
                          {donation.paymentMethod === 'handcash' ? 'Hand Cash' : 'PhonePe'}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Received by:</span>
                        <span className="text-sm">{donation.receivingAdminName}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Date:</span>
                        <span className="text-sm">{new Date(donation.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {persons.length === 0 && donations.length === 0 && (
          <Card className="festival-card">
            <CardContent className="text-center py-16">
              <IndianRupee className="w-16 h-16 text-muted-foreground mx-auto mb-6" />
              <h3 className="text-2xl font-semibold mb-4">No Donations Yet</h3>
              <p className="text-muted-foreground">
                No contributions have been recorded yet. Check back later for updates.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};