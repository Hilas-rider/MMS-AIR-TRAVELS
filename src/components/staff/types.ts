export type StaffRole = 'OWNER' | 'MANAGER' | 'STAFF';

export interface StaffUser {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: StaffRole;
  isActive?: boolean;
  twoFactorEnabled?: boolean;
  lastLogin?: string;
  createdAt?: string;
}

export interface FareRecord {
  id: string;
  airline: string;
  airlineCode: string;
  flightNumber: string;
  originCity: string;
  originCode: string;
  destCity: string;
  destCode: string;
  travelDate: string;
  departureTime: string;
  arrivalTime: string;
  cabinClass: 'Economy' | 'Premium Economy' | 'Business';
  baseFare: number;
  taxes: number;
  totalFare: number;
  baggageAllowance: string;
  seatsAvailable: number;
  status: 'Active' | 'Inactive';
  notes?: string;
  updatedBy: string;
  updatedAt: string;
}

export interface FareHistoryEntry {
  id: string;
  fareId: string;
  flightNumber: string;
  route: string;
  previousTotal: number;
  newTotal: number;
  changedBy: string;
  changedByName: string;
  date: string;
  reason: string;
  ip: string;
}

export interface AirlineRecord {
  id: string;
  name: string;
  code: string;
  country: string;
  status: 'Active' | 'Inactive';
  notes: string;
}

export interface ActivityLogEntry {
  id: string;
  action: string;
  staffEmail: string;
  staffName: string;
  role: string;
  timestamp: string;
  ip: string;
  result: 'Success' | 'Denied' | 'Failed';
  details: string;
}

export interface CustomerRecord {
  id: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  enquiriesCount: number;
  bookingsCount: number;
  totalSpend: number;
  lastInteraction: string;
  status: 'Active' | 'VIP' | 'New';
  notes: string;
  travelHistory: {
    route: string;
    date: string;
    pnr: string;
    airline: string;
    amount: number;
  }[];
}

export interface EnquiryRecord {
  id: string;
  referenceNumber?: string;
  token?: string;
  serviceType?: string;
  customerName: string;
  phone: string;
  email: string;
  origin: string;
  destination: string;
  travelDate: string;
  passengers: number;
  cabinClass: string;
  budget?: number;
  status: 'New' | 'Contacted' | 'Quotation Sent' | 'Confirmed' | 'Completed' | 'Cancelled';
  createdAt: string;
  notes?: string;
}

export interface BookingRecord {
  id: string;
  pnr: string;
  customerName: string;
  phone: string;
  email: string;
  airline: string;
  flightNumber: string;
  route: string;
  travelDate: string;
  departureTime: string;
  passengers: number;
  amount: number;
  paymentStatus: 'Pending' | 'Partial' | 'Paid' | 'Refunded';
  bookingStatus: 'Confirmed' | 'Ticketed' | 'Cancelled';
  createdAt: string;
}

export interface OfferRecord {
  id: string;
  title: string;
  airline: string;
  airlineCode: string;
  sector: string;
  fare: number;
  discountNote: string;
  validTill: string;
  status: 'Active' | 'Expired';
}

export interface SecuritySettings {
  require2FAAllStaff: boolean;
  maxLoginAttempts: number;
  lockoutDurationMinutes: number;
  sessionTimeoutHours: number;
}
