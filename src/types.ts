export type TripType = 'one-way' | 'round-trip' | 'multi-city';
export type CabinClass = 'economy' | 'premium-economy' | 'business' | 'first';

export interface Airport {
  code: string;
  city: string;
  name: string;
  country: string;
  terminal?: string;
  timezone?: string;
}

export interface FlightSegment {
  flightNumber: string;
  airline: string;
  airlineCode: string;
  airlineLogoColor: string;
  aircraft: string;
  origin: Airport;
  destination: Airport;
  departureTime: string; // HH:mm format or ISO string
  arrivalTime: string;
  durationMinutes: number;
  stops: number;
  terminalDep: string;
  terminalArr: string;
  gate?: string;
}

export interface FareOption {
  tier: 'saver' | 'standard' | 'flexi';
  name: string;
  priceMultiplier: number;
  checkedBaggage: string;
  cabinBaggage: string;
  seatSelection: 'paid' | 'standard-free' | 'any-free';
  cancellation: string;
  refundPolicy: string;
  changePolicy: string;
  milesEarned: number;
}

export interface Flight {
  id: string;
  flightNumber: string;
  airline: string;
  airlineCode: string;
  airlineLogoColor: string;
  aircraft: string;
  origin: Airport;
  destination: Airport;
  departureDate: string; // YYYY-MM-DD
  departureTime: string; // e.g. "08:30"
  arrivalDate: string;
  arrivalTime: string;   // e.g. "14:45"
  durationMinutes: number;
  stops: number;
  layoverAirport?: Airport;
  layoverDurationMinutes?: number;
  basePrice: number; // in USD
  availableSeats: number;
  cabinClass: CabinClass;
  amenities: {
    wifi: boolean;
    meal: boolean;
    power: boolean;
    entertainment: boolean;
    seatPitch: string;
  };
  terminalDep: string;
  terminalArr: string;
  gate: string;
  status: 'SCHEDULED' | 'ON_TIME' | 'BOARDING' | 'DEPARTED' | 'DELAYED' | 'LANDED' | 'CANCELLED';
}

export interface PassengerInfo {
  id: string;
  type: 'adult' | 'child' | 'infant';
  title: string;
  firstName: string;
  lastName: string;
  dob: string;
  nationality: string;
  passportNumber: string;
  passportExpiry: string;
  seatNumber?: string;
  mealPreference?: string;
  specialAssistance?: boolean;
  extraBaggageKg?: number;
}

export interface Booking {
  id: string;
  pnr: string;
  eticketNumber: string;
  createdAt: string;
  tripType: TripType;
  departureFlight: Flight;
  returnFlight?: Flight;
  cabinClass: CabinClass;
  passengers: PassengerInfo[];
  fareTier: 'saver' | 'standard' | 'flexi';
  contactEmail: string;
  contactPhone: string;
  totalPriceUSD: number;
  currency: string;
  paidAmount: number;
  paymentMethod: string;
  paymentStatus: 'PAID' | 'PENDING' | 'REFUNDED';
  bookingStatus: 'CONFIRMED' | 'CHECKED_IN' | 'BOARDING' | 'CANCELLED' | 'PENDING';
  addOns: {
    travelInsurance: boolean;
    priorityBoarding: boolean;
    loungeAccess: boolean;
    carbonOffset: boolean;
  };
}

export interface CargoTimelineStep {
  status: string;
  location: string;
  timestamp: string;
  description: string;
  completed: boolean;
}

export interface CargoShipment {
  awbNumber: string;
  origin: string;
  destination: string;
  senderName: string;
  receiverName: string;
  cargoType: 'General Cargo' | 'Perishables' | 'Pharma / Temperature Controlled' | 'Express Courier' | 'Dangerous Goods' | 'Automotive / Heavy Equipment';
  weightKg: number;
  volumeCbm: number;
  pieces: number;
  flightAssigned?: string;
  bookingDate: string;
  estimatedDelivery: string;
  currentStatus: 'BOOKED' | 'RECEIVED' | 'CUSTOMS_CLEARED' | 'UPLIFTED' | 'IN_TRANSIT' | 'ARRIVED_DESTINATION' | 'DELIVERED';
  timeline: CargoTimelineStep[];
}

export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'INR' | 'AED' | 'SAR';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  rate: number; // multiplier from USD
}

export interface TourPackage {
  id: string;
  title: string;
  category: 'India' | 'International' | 'Group';
  destination: string;
  stateOrCountry: string;
  duration: string; // e.g. "4 Days / 3 Nights"
  priceINR: number;
  priceUSD: number;
  imageUrl: string;
  rating: number;
  highlights: string[];
  inclusions: string[];
  itinerary: { day: number; title: string; desc: string }[];
}

export interface VisaService {
  id: string;
  country: string;
  flagEmoji: string;
  visaType: string;
  processingTime: string;
  validity: string;
  stayPeriod: string;
  feeINR: number;
  documents: string[];
  description: string;
}

export interface FlightInquiry {
  id: string;
  token: string; // Official Inquiry Reference Number (e.g. MMS-FLT-84920173)
  referenceNumber?: string; // Standard alias for token
  caseId?: string; // 8-digit numeric Case ID (e.g. 84920173)
  assignedStaffName?: string; // Assigned Staff member name
  assignedBranch?: string; // e.g. Adirampattinam HQ, Madukkur Branch
  serviceType?: 'Flight' | 'GroupFare' | 'Visa' | 'Passport' | 'Package' | 'Hotel' | 'Cargo' | 'Contact' | 'Miscellaneous' | string;
  serviceName?: string;
  routeSummary?: string;
  createdAt: string;
  flight?: Flight;
  fareTier?: 'saver' | 'standard' | 'flexi';
  tripType?: TripType;
  departureDate?: string;
  returnDate?: string;
  passengers?: {
    adults: number;
    children: number;
    infants: number;
  };
  leadPassenger: {
    title: string;
    fullName: string;
    phone: string;
    whatsapp: string;
    email: string;
    cityOfResidence?: string;
    passportNumber?: string;
    passportExpiry?: string;
    nationality?: string;
  };
  preferences?: {
    seat?: string;
    meal?: string;
    extraBaggageKg?: number;
    specialAssistance?: boolean;
    visaAssistanceRequired?: boolean;
  };
  quotedPriceUSD?: number;
  currency?: CurrencyCode;
  notes?: string;
  status: 'NEW' | 'IN_REVIEW' | 'QUOTED' | 'CONFIRMED' | 'TICKET_ISSUED' | 'CLOSED';
  adminNotes?: string;
}

export interface GlobalFareAdjustment {
  percentage: number; // e.g. +10 or -5
  fixedUSD: number;    // e.g. +20
  lastUpdated: string;
}

export interface EnquiryData {
  serviceType: 'Flight' | 'Hotel' | 'Package' | 'Visa' | 'Passport' | 'Cargo' | 'SightSeeing' | 'Miscellaneous' | 'Transfer' | string;
  title: string;
  firstName: string;
  lastName: string;
  countryCode?: string;
  mobile?: string;
  phone?: string;
  email: string;
  // Flight specifics
  sourceCity?: string;
  destCity?: string;
  destinationCity?: string;
  tripType?: 'One Way' | 'Round Trip' | 'Multi City';
  departureDate?: string;
  travelDate?: string;
  returnDate?: string;
  cabinClass?: string;
  // Visa specifics
  visaCountry?: string;
  visaType?: string;
  visaDate?: string;
  countryOfVisit?: string;
  typeOfVisa?: string;
  purpose?: string;
  stayLength?: string;
  // Passport specifics
  passportType?: 'Fresh' | 'Renewal' | 'Tatkaal' | 'Minor' | 'Damage / Lost' | 'Correction' | 'PCC' | string;
  passportPages?: '36 Pages' | '60 Pages (Jumbo)' | string;
  preferredBranch?: string;
  existingPassportNo?: string;
  applicantDob?: string;
  // Package specifics
  packageName?: string;
  departureCity?: string;
  packageMonth?: string;
  packageDuration?: string;
  hotelPreference?: string;
  adultsCount?: number;
  childrenCount?: number;
  // Cargo specifics
  cargoType?: string;
  cargoWeight?: string;
  transportMode?: string;
  // Hotel specifics
  hotelCity?: string;
  checkInDate?: string;
  checkOutDate?: string;
  roomCount?: number;
  // Common
  paxCount?: number | string;
  remarks: string;
  agreeToContact?: boolean;
}

export interface GroupFareItem {
  id: string;
  groupCode: string; // e.g. "MMS-GRP-DXB-01"
  airline: string;
  airlineCode: string;
  airlineLogoColor: string;
  flightNumber: string;
  origin: Airport;
  destination: Airport;
  departureDate: string;
  departureTime: string;
  arrivalDate: string;
  arrivalTime: string;
  stops: number;
  aircraft: string;
  totalSeats: number;
  availableSeats: number;
  fareINR: number;
  fareUSD: number;
  regularFareINR: number;
  baggageAllowance: string;
  mealIncluded: boolean;
  category: 'Gulf / Dubai Bulk' | 'Umrah Group' | 'Hajj & Umrah Block' | 'Southeast Asia' | 'Holiday Group' | 'UK & Europe' | 'North America';
  featuredNote?: string;
  pnrStatus: 'CONFIRMED_BLOCKED' | 'SERIES_DEPARTURE' | 'FAST_SELLING';
  active: boolean;
}

export interface VisaEnquiryFormData {
  id?: string;
  referenceNumber?: string;
  visaType: 'Tourist' | 'Business';
  destinationCountry: string;
  duration: string;
  entryType: 'Single' | 'Multiple';
  numberOfApplicants: number;
  mobileNumber: string;
  emailId: string;
  surname: string;
  givenName: string;
  gender: 'Male' | 'Female' | 'Other';
  dateOfBirth: string;
  age: number | string;
  nationality: string;
  placeOfBirth: string;
  holdingDualNationality: 'Yes' | 'No';
  maritalStatus: 'Single' | 'Married' | 'Divorced' | 'Widowed';
  employment: 'Salaried' | 'Self-Employed' | 'Business' | 'Student' | 'Retired' | 'Unemployed';
  have3YearsItr: 'Yes' | 'No';
  address: string;
  city: string;
  pinCode: string;
  country: string;
  passportFirstPageFile?: string;
  passportLastPageFile?: string;
  panCardFile?: string;
  photoWhiteBgFile?: string;
  ticketCopyFile?: string;
  remark?: string;
  charges: string;
  createdAt?: string;
  status?: 'RECEIVED' | 'UNDER_REVIEW' | 'DOCS_VERIFIED' | 'SUBMITTED_TO_EMBASSY' | 'APPROVED' | 'REJECTED';
}


