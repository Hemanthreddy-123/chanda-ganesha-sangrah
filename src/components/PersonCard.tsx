import React from 'react';
import { Person } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, User, Calendar } from 'lucide-react';

interface PersonCardProps {
  person: Person;
  onDonate: (person: Person) => void;
}

export const PersonCard: React.FC<PersonCardProps> = ({ person, onDonate }) => {
  return (
    <Card className="festival-card hover:scale-105 transition-all duration-300 hover:blessing-shadow">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Person Info */}
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-card-foreground">{person.name}</h3>
                <p className="text-sm text-muted-foreground">Added by {person.adminName}</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>{person.address}</span>
              </div>
              
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Phone className="w-4 h-4" />
                <span>{person.phoneNumber}</span>
              </div>
              
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>Added {new Date(person.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Donate Button */}
          <Button 
            onClick={() => onDonate(person)}
            className="w-full donation-button"
          >
            Donate to {person.name}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};