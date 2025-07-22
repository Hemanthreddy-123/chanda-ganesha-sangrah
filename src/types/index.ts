export interface Admin {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
}

export interface Person {
  id: string;
  name: string;
  address: string;
  phoneNumber: string;
  adminId: string;
  adminName: string;
  createdAt: Date;
}

export interface Donation {
  id: string;
  personId: string;
  personName: string;
  amount: number;
  paymentMethod: 'handcash' | 'phonepay';
  receivingAdminId: string;
  receivingAdminName: string;
  donorName?: string;
  donorPhone?: string;
  createdAt: Date;
}

export interface AdminActivity {
  id: string;
  adminId: string;
  adminName: string;
  action: string;
  details: string;
  timestamp: Date;
}

export interface AuthContextType {
  currentAdmin: Admin | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}