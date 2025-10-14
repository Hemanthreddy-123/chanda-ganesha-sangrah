import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Phone, MapPin, MessageCircle } from 'lucide-react';

const ADMIN_CONTACTS = [
  { name: 'Mukkamalla Baskar Reddy', phone: '8985011137', whatsapp: '8985011137' },
  { name: 'Kukkapalli Srinivasulu naidu', phone: '9441843101', whatsapp: '9441843101' },
  { name: 'Siddavatam venkata ramanareddy', phone: '9441443925', whatsapp: '9441443925' },
];

const UPI_ID = "madhureddych10@ybl";

export const ContactInfo: React.FC = () => {
  const handleWhatsAppMessage = (phone: string) => {
    const message = encodeURIComponent("Hi! I have donated for Depur Vinayaka Chavithi 2k25. Please find the payment screenshot attached.");
    window.open(`https://wa.me/91${phone.replace(/[^0-9]/g, '')}?text=${message}`, '_blank');
  };

  const copyUpiId = () => {
    navigator.clipboard.writeText(UPI_ID);
    // You can add a toast notification here
  };

  return (
    <section className="py-12 px-4 bg-muted/30">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">
            <span className="ganesh-gradient bg-clip-text text-transparent">
              Donation Information
            </span>
          </h2>
          <p className="text-muted-foreground">
            Contact our team members or use UPI for donations
          </p>
        </div>

        {/* Address */}
        <Card className="festival-card mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Festival Location
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg">
              Depur Village, Atmakur Mandal, Nellore District, Pincode 524322
            </p>
          </CardContent>
        </Card>

        {/* UPI Information */}
        <Card className="festival-card mb-6">
          <CardHeader>
            <CardTitle>UPI Payment</CardTitle>
            <CardDescription>
              Send money via UPI and share screenshot on WhatsApp
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-primary/10 p-4 rounded-lg mb-4">
              <p className="font-mono text-lg text-center">{UPI_ID}</p>
            </div>
            <Button onClick={copyUpiId} variant="outline" className="w-full">
              Copy UPI ID
            </Button>
            <p className="text-sm text-muted-foreground mt-2 text-center">
              After payment, send screenshot to any WhatsApp number below
            </p>
          </CardContent>
        </Card>

        {/* Contact List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ADMIN_CONTACTS.map((contact, index) => (
            <Card key={index} className="festival-card">
              <CardHeader>
                <CardTitle className="text-lg">{contact.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-primary" />
                      <span className="font-mono">+91 {contact.phone}</span>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => window.open(`tel:+91${contact.phone}`, '_self')}
                    >
                      Call
                    </Button>
                  </div>
                <Button 
                  className="w-full" 
                  variant="default"
                  onClick={() => handleWhatsAppMessage(contact.whatsapp)}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Send Screenshot on WhatsApp
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
