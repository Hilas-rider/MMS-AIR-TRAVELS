import React, { useState } from 'react';
import { 
  Plane, 
  DollarSign, 
  Plus, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  Sliders, 
  Search, 
  ShieldCheck, 
  Phone, 
  Mail, 
  MessageSquare, 
  Tag, 
  Luggage, 
  FileText, 
  Layers, 
  Compass, 
  Users, 
  Lock, 
  Unlock, 
  RefreshCw,
  X,
  Check,
  Percent,
  ArrowUpRight,
  TrendingUp,
  AlertCircle,
  Eye,
  EyeOff,
  Key,
  ShieldAlert,
  Copy,
  BookmarkCheck,
  AlertTriangle,
  Download,
  FileSpreadsheet
} from 'lucide-react';
import { 
  Flight, 
  TourPackage, 
  VisaService, 
  FlightInquiry, 
  GlobalFareAdjustment, 
  CurrencyCode,
  CabinClass,
  GroupFareItem,
  Booking
} from '../types';
import { POPULAR_AIRPORTS, formatCurrency } from '../data/airports';
import { AIRLINE_INFO, AIRCRAFTS } from '../data/mockFlights';
import { copyTextToClipboard } from '../utils/referenceNumber';
import { exportBookingsToCSV, exportInquiriesToCSV } from '../utils/csvExport';

interface AdminPortalProps {
  flights: Flight[];
  onUpdateFlights: (flights: Flight[]) => void;
  groupFares: GroupFareItem[];
  onUpdateGroupFares: (fares: GroupFareItem[]) => void;
  tourPackages: TourPackage[];
  onUpdateTourPackages: (tours: TourPackage[]) => void;
  visaServices: VisaService[];
  onUpdateVisaServices: (visas: VisaService[]) => void;
  inquiries: FlightInquiry[];
  onUpdateInquiries: (inquiries: FlightInquiry[]) => void;
  globalAdjustment: GlobalFareAdjustment;
  onUpdateGlobalAdjustment: (adj: GlobalFareAdjustment) => void;
  currency: CurrencyCode;
  onClose: () => void;
  bookings?: Booking[];
  onUpdateBooking?: (booking: Booking) => void;
  onDeleteBooking?: (bookingId: string) => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  flights,
  onUpdateFlights,
  groupFares,
  onUpdateGroupFares,
  tourPackages,
  onUpdateTourPackages,
  visaServices,
  onUpdateVisaServices,
  inquiries,
  onUpdateInquiries,
  globalAdjustment,
  onUpdateGlobalAdjustment,
  currency,
  onClose,
  bookings,
  onUpdateBooking,
  onDeleteBooking
}) => {
  // Private & Secure Staff Authentication Lock
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('mms_admin_auth_active') === 'true';
    } catch {
      return false;
    }
  });
  const [enteredPin, setEnteredPin] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [pinError, setPinError] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutSeconds, setLockoutSeconds] = useState(0);

  // Custom passcode management
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changePassSuccess, setChangePassSuccess] = useState(false);
  const [changePassError, setChangePassError] = useState('');

  // Lockout countdown timer effect
  React.useEffect(() => {
    if (lockoutSeconds <= 0) return;
    const timer = setInterval(() => {
      setLockoutSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setFailedAttempts(0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [lockoutSeconds]);

  // Active Admin Sub-tab
  const [adminTab, setAdminTab] = useState<'flights' | 'tickets' | 'group-fares' | 'global' | 'tours' | 'visas' | 'inquiries'>('flights');

  // Tickets & Bookings State
  const bookingsList = bookings || [];
  const [ticketSearch, setTicketSearch] = useState('');
  const [ticketStatusFilter, setTicketStatusFilter] = useState<'ALL' | 'CONFIRMED' | 'CHECKED_IN' | 'BOARDING' | 'CANCELLED'>('ALL');
  const [ticketPaymentFilter, setTicketPaymentFilter] = useState<'ALL' | 'PAID' | 'PENDING' | 'REFUNDED'>('ALL');
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [deletingBooking, setDeletingBooking] = useState<Booking | null>(null);
  const [copiedPnr, setCopiedPnr] = useState<string | null>(null);
  const [ticketToast, setTicketToast] = useState<string | null>(null);

  // Search & Filter within Admin
  const [flightSearch, setFlightSearch] = useState('');
  const [groupFareSearch, setGroupFareSearch] = useState('');
  const [tourCategoryFilter, setTourCategoryFilter] = useState<'ALL' | 'India' | 'International' | 'Group'>('ALL');
  const [inquiryStatusFilter, setInquiryStatusFilter] = useState<string>('ALL');
  const [inquirySearch, setInquirySearch] = useState<string>('');
  const [copiedInquiryToken, setCopiedInquiryToken] = useState<string | null>(null);

  // Group Fare State
  const [editingGroupFare, setEditingGroupFare] = useState<GroupFareItem | null>(null);
  const [isAddingGroupFare, setIsAddingGroupFare] = useState(false);
  const [newGroupFareForm, setNewGroupFareForm] = useState({
    groupCode: 'MMS-GRP-BULK',
    airline: 'Air India Express',
    airlineCode: 'IX',
    airlineLogoColor: 'from-orange-600 to-amber-600',
    flightNumber: 'IX-689',
    originCode: 'TRZ',
    destCode: 'DXB',
    departureDate: '2026-09-25',
    departureTime: '14:30',
    arrivalDate: '2026-09-25',
    arrivalTime: '17:15',
    aircraft: 'Boeing 737-800',
    totalSeats: 30,
    availableSeats: 15,
    fareINR: 16500,
    fareUSD: 198,
    regularFareINR: 24500,
    baggageAllowance: '35 Kg Check-in + 7 Kg Cabin',
    mealIncluded: true,
    category: 'Gulf / Dubai Bulk',
    featuredNote: 'Trichy Direct • Confirmed Blocked PNR',
    pnrStatus: 'CONFIRMED_BLOCKED' as GroupFareItem['pnrStatus'],
    active: true
  });

  // Modal for Editing a Flight
  const [editingFlight, setEditingFlight] = useState<Flight | null>(null);

  // Modal for Adding a New Flight ("Add option for all")
  const [isAddingFlight, setIsAddingFlight] = useState(false);
  const [newFlightForm, setNewFlightForm] = useState({
    airlineName: 'MMS Sky Express',
    airlineCode: 'MM',
    flightNumber: 'MM-350',
    aircraft: 'Airbus A350-900',
    originCode: 'MAA',
    destCode: 'DXB',
    departureDate: '2026-09-10',
    departureTime: '08:30',
    arrivalDate: '2026-09-10',
    arrivalTime: '13:45',
    durationMinutes: 315,
    stops: 0,
    basePrice: 380,
    availableSeats: 18,
    cabinClass: 'economy' as CabinClass,
    terminalDep: 'T2',
    terminalArr: 'T3',
    status: 'SCHEDULED' as Flight['status']
  });

  // Modal for Editing / Adding a Tour Package
  const [editingTour, setEditingTour] = useState<TourPackage | null>(null);
  const [isAddingTour, setIsAddingTour] = useState(false);
  const [newTourForm, setNewTourForm] = useState<Partial<TourPackage>>({
    title: '',
    category: 'India',
    destination: '',
    stateOrCountry: '',
    duration: '5 Days / 4 Nights',
    priceINR: 22000,
    priceUSD: 265,
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    highlights: ['Scenic sightseeing', 'Deluxe accommodation', 'Daily breakfast', 'Guided transfers'],
    inclusions: ['Hotels', 'Breakfast', 'Private vehicle']
  });

  // Global markup adjustment state
  const [markupPercent, setMarkupPercent] = useState(globalAdjustment.percentage || 0);
  const [fixedMarkupUSD, setFixedMarkupUSD] = useState(globalAdjustment.fixedUSD || 0);

  // Handle Passcode verification with brute-force protection
  const handleVerifyPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutSeconds > 0) return;

    let storedMaster = 'MMS@7442';
    try {
      storedMaster = localStorage.getItem('mms_admin_secret_pass') || 'MMS@7442';
    } catch {
      storedMaster = 'MMS@7442';
    }

    const trimmed = enteredPin.trim();

    // Accepted secure keys:
    // 1. Custom master key (default: MMS@7442)
    // 2. Owner phone PINs: 6369012360, 9384567440, 9500977442, 7442
    const isValid =
      trimmed === storedMaster ||
      trimmed === 'MMS@7442' ||
      trimmed === 'mms@7442' ||
      trimmed === '7442' ||
      trimmed === '6369012360' ||
      trimmed === '9384567440' ||
      trimmed === '9500977442';

    if (isValid) {
      try {
        sessionStorage.setItem('mms_admin_auth_active', 'true');
      } catch {
        // fallback
      }
      setIsAuthenticated(true);
      setPinError(false);
      setEnteredPin('');
      setFailedAttempts(0);
    } else {
      const nextFail = failedAttempts + 1;
      setFailedAttempts(nextFail);
      setPinError(true);
      if (nextFail >= 5) {
        setLockoutSeconds(30);
      }
    }
  };

  const handleSaveNewPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 5) {
      setChangePassError('Passcode must be at least 5 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setChangePassError('Passcodes do not match.');
      return;
    }
    try {
      localStorage.setItem('mms_admin_secret_pass', newPassword);
    } catch {
      // fallback
    }
    setChangePassSuccess(true);
    setChangePassError('');
    setTimeout(() => {
      setIsChangingPassword(false);
      setChangePassSuccess(false);
      setNewPassword('');
      setConfirmPassword('');
    }, 1500);
  };

  const handleSignOut = () => {
    try {
      sessionStorage.removeItem('mms_admin_auth_active');
    } catch {
      // fallback
    }
    setIsAuthenticated(false);
    setEnteredPin('');
    setPinError(false);
  };

  // FLIGHT MANAGEMENT HANDLERS
  const handleSaveFlightEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFlight) return;

    onUpdateFlights(flights.map(f => f.id === editingFlight.id ? editingFlight : f));
    setEditingFlight(null);
  };

  const handleDeleteFlight = (id: string) => {
    if (confirm('Are you sure you want to remove this flight schedule from active inventory?')) {
      onUpdateFlights(flights.filter(f => f.id !== id));
    }
  };

  const handleCreateNewFlight = (e: React.FormEvent) => {
    e.preventDefault();
    const origin = POPULAR_AIRPORTS.find(a => a.code === newFlightForm.originCode) || {
      code: newFlightForm.originCode,
      city: newFlightForm.originCode,
      name: `${newFlightForm.originCode} Airport`,
      country: 'International',
      terminal: newFlightForm.terminalDep
    };

    const dest = POPULAR_AIRPORTS.find(a => a.code === newFlightForm.destCode) || {
      code: newFlightForm.destCode,
      city: newFlightForm.destCode,
      name: `${newFlightForm.destCode} Airport`,
      country: 'International',
      terminal: newFlightForm.terminalArr
    };

    const airline = AIRLINE_INFO.find(a => a.code === newFlightForm.airlineCode) || {
      name: newFlightForm.airlineName,
      code: newFlightForm.airlineCode,
      color: 'from-blue-700 to-indigo-900',
      hub: newFlightForm.destCode
    };

    const newFlight: Flight = {
      id: `flt-${newFlightForm.originCode}-${newFlightForm.destCode}-${newFlightForm.flightNumber}-${Date.now()}`,
      flightNumber: newFlightForm.flightNumber,
      airline: airline.name,
      airlineCode: airline.code,
      airlineLogoColor: airline.color,
      aircraft: newFlightForm.aircraft,
      origin: origin,
      destination: dest,
      departureDate: newFlightForm.departureDate,
      departureTime: newFlightForm.departureTime,
      arrivalDate: newFlightForm.arrivalDate,
      arrivalTime: newFlightForm.arrivalTime,
      durationMinutes: Number(newFlightForm.durationMinutes),
      stops: Number(newFlightForm.stops),
      basePrice: Number(newFlightForm.basePrice),
      availableSeats: Number(newFlightForm.availableSeats),
      cabinClass: newFlightForm.cabinClass,
      amenities: {
        wifi: true,
        meal: true,
        power: true,
        entertainment: true,
        seatPitch: '33"'
      },
      terminalDep: newFlightForm.terminalDep,
      terminalArr: newFlightForm.terminalArr,
      gate: 'G08',
      status: newFlightForm.status
    };

    onUpdateFlights([newFlight, ...flights]);
    setIsAddingFlight(false);
  };

  // GLOBAL ADJUSTMENT HANDLER ("Change or modify fare for all")
  const handleApplyGlobalAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    const newAdj: GlobalFareAdjustment = {
      percentage: Number(markupPercent),
      fixedUSD: Number(fixedMarkupUSD),
      lastUpdated: new Date().toISOString()
    };
    onUpdateGlobalAdjustment(newAdj);

    // Apply the adjustment directly to existing flights
    const updatedFlights = flights.map(f => {
      // Base calculation
      let newPrice = f.basePrice;
      if (newAdj.percentage !== 0) {
        newPrice = Math.round(newPrice * (1 + newAdj.percentage / 100));
      }
      if (newAdj.fixedUSD !== 0) {
        newPrice = Math.round(newPrice + newAdj.fixedUSD);
      }
      return { ...f, basePrice: Math.max(80, newPrice) };
    });

    onUpdateFlights(updatedFlights);
    alert(`Global Fare Adjustment applied! All flights updated with ${markupPercent}% and $${fixedMarkupUSD} adjustment.`);
  };

  const handleResetToBaseline = () => {
    if (confirm('Reset all fare adjustments back to baseline?')) {
      onUpdateGlobalAdjustment({ percentage: 0, fixedUSD: 0, lastUpdated: new Date().toISOString() });
      setMarkupPercent(0);
      setFixedMarkupUSD(0);
    }
  };

  // TOUR MANAGEMENT HANDLERS
  const handleSaveTourEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTour) return;
    onUpdateTourPackages(tourPackages.map(t => t.id === editingTour.id ? editingTour : t));
    setEditingTour(null);
  };

  const handleCreateNewTour = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTourForm.title || !newTourForm.destination) {
      alert('Please provide a Title and Destination.');
      return;
    }

    const createdTour: TourPackage = {
      id: `tour-${Date.now()}`,
      title: newTourForm.title || 'New Tour Package',
      category: newTourForm.category as 'India' | 'International' | 'Group',
      destination: newTourForm.destination || '',
      stateOrCountry: newTourForm.stateOrCountry || newTourForm.destination || '',
      duration: newTourForm.duration || '4 Days / 3 Nights',
      priceINR: Number(newTourForm.priceINR) || 15000,
      priceUSD: Number(newTourForm.priceUSD) || 180,
      imageUrl: newTourForm.imageUrl || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
      rating: Number(newTourForm.rating) || 4.8,
      highlights: newTourForm.highlights || ['Scenic locations', 'Hotel stay', 'Daily meals'],
      inclusions: newTourForm.inclusions || ['Accommodation', 'Transfers', 'Breakfast'],
      itinerary: [
        { day: 1, title: 'Arrival & Welcome', desc: 'Airport pickup, hotel check-in and evening leisure.' },
        { day: 2, title: 'City & Scenic Explorer', desc: 'Guided full-day excursion with lunch.' },
        { day: 3, title: 'Local Culture & Shopping', desc: 'Heritage walking tour and local markets.' },
        { day: 4, title: 'Departure Transfer', desc: 'Hotel checkout and flight transfer.' }
      ]
    };

    onUpdateTourPackages([createdTour, ...tourPackages]);
    setIsAddingTour(false);
  };

  const handleDeleteTour = (id: string) => {
    if (confirm('Delete this tour package from the catalog?')) {
      onUpdateTourPackages(tourPackages.filter(t => t.id !== id));
    }
  };

  // INQUIRIES MANAGEMENT HANDLERS
  const handleUpdateInquiryStatus = (id: string, status: FlightInquiry['status'], adminNotes?: string) => {
    onUpdateInquiries(inquiries.map(inq => {
      if (inq.id === id) {
        return {
          ...inq,
          status,
          adminNotes: adminNotes !== undefined ? adminNotes : inq.adminNotes
        };
      }
      return inq;
    }));
  };

  const handleDeleteInquiry = (id: string) => {
    if (confirm('Archive / delete this inquiry record?')) {
      onUpdateInquiries(inquiries.filter(i => i.id !== id));
    }
  };

  // GROUP FARES MANAGEMENT HANDLERS
  const handleSaveGroupFareEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGroupFare) return;
    onUpdateGroupFares(groupFares.map(g => g.id === editingGroupFare.id ? editingGroupFare : g));
    setEditingGroupFare(null);
  };

  const handleCreateNewGroupFare = (e: React.FormEvent) => {
    e.preventDefault();
    const origin = POPULAR_AIRPORTS.find(a => a.code === newGroupFareForm.originCode) || POPULAR_AIRPORTS[0];
    const destination = POPULAR_AIRPORTS.find(a => a.code === newGroupFareForm.destCode) || POPULAR_AIRPORTS[1];

    const created: GroupFareItem = {
      id: `grp-${Date.now()}`,
      groupCode: newGroupFareForm.groupCode || `MMS-GRP-${origin.code}-${destination.code}`,
      airline: newGroupFareForm.airline || 'Air India Express',
      airlineCode: newGroupFareForm.airlineCode || 'IX',
      airlineLogoColor: newGroupFareForm.airlineLogoColor || 'from-orange-600 to-amber-600',
      flightNumber: newGroupFareForm.flightNumber || 'IX-689',
      origin,
      destination,
      departureDate: newGroupFareForm.departureDate || '2026-09-25',
      departureTime: newGroupFareForm.departureTime || '14:30',
      arrivalDate: newGroupFareForm.arrivalDate || '2026-09-25',
      arrivalTime: newGroupFareForm.arrivalTime || '17:15',
      stops: 0,
      aircraft: newGroupFareForm.aircraft || 'Boeing 737-800',
      totalSeats: Number(newGroupFareForm.totalSeats) || 30,
      availableSeats: Number(newGroupFareForm.availableSeats) || 15,
      fareINR: Number(newGroupFareForm.fareINR) || 16500,
      fareUSD: Number(newGroupFareForm.fareUSD) || 198,
      regularFareINR: Number(newGroupFareForm.regularFareINR) || 24500,
      baggageAllowance: newGroupFareForm.baggageAllowance || '35 Kg Check-in + 7 Kg Cabin',
      mealIncluded: Boolean(newGroupFareForm.mealIncluded),
      category: newGroupFareForm.category || 'Gulf / Dubai Bulk',
      featuredNote: newGroupFareForm.featuredNote || 'Special Wholesale Block',
      pnrStatus: newGroupFareForm.pnrStatus || 'CONFIRMED_BLOCKED',
      active: true
    };

    onUpdateGroupFares([created, ...groupFares]);
    setIsAddingGroupFare(false);
  };

  const handleToggleGroupFareActive = (id: string) => {
    onUpdateGroupFares(groupFares.map(g => g.id === id ? { ...g, active: !g.active } : g));
  };

  const handleDeleteGroupFare = (id: string) => {
    if (confirm('Delete this group fare block from inventory?')) {
      onUpdateGroupFares(groupFares.filter(g => g.id !== id));
    }
  };

  // TICKET MANAGEMENT HANDLERS
  const handleSaveTicketEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBooking) return;
    if (onUpdateBooking) {
      onUpdateBooking(editingBooking);
    }
    setTicketToast(`Ticket PNR ${editingBooking.pnr} modified successfully.`);
    setTimeout(() => setTicketToast(null), 3500);
    setEditingBooking(null);
  };

  const handleConfirmDeleteTicket = () => {
    if (!deletingBooking) return;
    if (onDeleteBooking) {
      onDeleteBooking(deletingBooking.id);
    }
    setTicketToast(`Ticket PNR ${deletingBooking.pnr} permanently deleted.`);
    setTimeout(() => setTicketToast(null), 3500);
    setDeletingBooking(null);
  };

  const handleQuickCancelTicket = (b: Booking) => {
    if (confirm(`Cancel ticket reservation for PNR ${b.pnr}? Status will be CANCELLED and payment marked as REFUNDED.`)) {
      if (onUpdateBooking) {
        onUpdateBooking({
          ...b,
          bookingStatus: 'CANCELLED',
          paymentStatus: 'REFUNDED'
        });
      }
      setTicketToast(`Ticket PNR ${b.pnr} marked as CANCELLED.`);
      setTimeout(() => setTicketToast(null), 3500);
    }
  };

  // Filtered lists
  const filteredBookings = bookingsList.filter(b => {
    if (ticketStatusFilter !== 'ALL' && b.bookingStatus !== ticketStatusFilter) return false;
    if (ticketPaymentFilter !== 'ALL' && b.paymentStatus !== ticketPaymentFilter) return false;
    if (!ticketSearch.trim()) return true;
    const q = ticketSearch.toLowerCase();
    const pnr = (b.pnr || '').toLowerCase();
    const eticket = (b.eTicketNumber || '').toLowerCase();
    const leadPax = b.passengers && b.passengers[0];
    const paxName = leadPax ? `${leadPax.firstName} ${leadPax.lastName}`.toLowerCase() : '';
    const phone = (leadPax?.contactPhone || '').toLowerCase();
    const email = (leadPax?.contactEmail || '').toLowerCase();
    const airline = (b.flight?.airline?.name || '').toLowerCase();
    const flightNum = (b.flight?.flightNumber || '').toLowerCase();
    const route = `${b.flight?.origin?.code} ${b.flight?.origin?.city} ${b.flight?.destination?.code} ${b.flight?.destination?.city}`.toLowerCase();

    return (
      pnr.includes(q) ||
      eticket.includes(q) ||
      paxName.includes(q) ||
      phone.includes(q) ||
      email.includes(q) ||
      airline.includes(q) ||
      flightNum.includes(q) ||
      route.includes(q)
    );
  });
  const filteredGroupFares = groupFares.filter(g => {
    if (!groupFareSearch.trim()) return true;
    const q = groupFareSearch.toLowerCase();
    return (
      g.groupCode.toLowerCase().includes(q) ||
      g.airline.toLowerCase().includes(q) ||
      g.flightNumber.toLowerCase().includes(q) ||
      g.origin.city.toLowerCase().includes(q) ||
      g.origin.code.toLowerCase().includes(q) ||
      g.destination.city.toLowerCase().includes(q) ||
      g.destination.code.toLowerCase().includes(q) ||
      g.category.toLowerCase().includes(q)
    );
  });
  const filteredFlights = flights.filter(f => {
    if (!flightSearch.trim()) return true;
    const q = flightSearch.toLowerCase();
    return (
      f.airline.toLowerCase().includes(q) ||
      f.flightNumber.toLowerCase().includes(q) ||
      f.origin.city.toLowerCase().includes(q) ||
      f.origin.code.toLowerCase().includes(q) ||
      f.destination.city.toLowerCase().includes(q) ||
      f.destination.code.toLowerCase().includes(q)
    );
  });

  const filteredTours = tourPackages.filter(t => {
    if (tourCategoryFilter === 'ALL') return true;
    return t.category === tourCategoryFilter;
  });

  const filteredInquiries = inquiries.filter(inq => {
    if (inquiryStatusFilter !== 'ALL' && inq.status !== inquiryStatusFilter) return false;
    if (!inquirySearch.trim()) return true;
    const q = inquirySearch.toLowerCase();
    const token = (inq.token || inq.referenceNumber || '').toLowerCase();
    const name = (inq.leadPassenger?.fullName || '').toLowerCase();
    const phone = (inq.leadPassenger?.phone || '').toLowerCase();
    const email = (inq.leadPassenger?.email || '').toLowerCase();
    const service = (inq.serviceType || '').toLowerCase();
    const route = (
      inq.routeSummary ||
      (inq.flight ? `${inq.flight.origin?.city} ${inq.flight.origin?.code} ${inq.flight.destination?.city} ${inq.flight.destination?.code}` : '') ||
      inq.serviceName ||
      ''
    ).toLowerCase();
    return token.includes(q) || name.includes(q) || phone.includes(q) || email.includes(q) || service.includes(q) || route.includes(q);
  });

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-sm animate-fadeIn">
        <div className="w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-2xl text-center space-y-6 text-white relative">
          
          {/* Security Shield Icon */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 text-slate-950 flex items-center justify-center mx-auto shadow-xl ring-4 ring-amber-500/20">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <span className="inline-block px-3 py-0.5 rounded-full bg-red-950/80 text-red-400 border border-red-800/60 text-[10px] font-black uppercase tracking-widest mb-2">
              Restricted Operational Gateway
            </span>
            <h3 className="text-xl font-black text-white tracking-tight">
              MMS Travel Desk Staff Access
            </h3>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Protected administration interface. Confidential passenger inquiries, wholesale GDS blocks & fare modification.
            </p>
          </div>

          {lockoutSeconds > 0 ? (
            <div className="p-4 bg-red-950/60 border border-red-800/70 rounded-xl text-red-300 text-xs font-bold space-y-1">
              <ShieldAlert className="w-5 h-5 mx-auto text-red-400" />
              <p>Security lock activated due to multiple failed attempts.</p>
              <p className="font-mono text-amber-400">Try again in {lockoutSeconds} seconds</p>
            </div>
          ) : (
            <form onSubmit={handleVerifyPin} className="space-y-4 text-left">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                  Security Passcode
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter Private Passcode"
                    value={enteredPin}
                    onChange={(e) => {
                      setEnteredPin(e.target.value);
                      setPinError(false);
                    }}
                    className="w-full text-sm font-mono tracking-wider p-3 pr-10 bg-slate-950/70 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 cursor-pointer"
                    aria-label={showPassword ? 'Hide passcode' : 'Show passcode'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {pinError && (
                <div className="p-2.5 bg-red-950/50 border border-red-800/50 rounded-lg text-red-300 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                  <span>Access denied. Invalid credentials. Attempt logged.</span>
                </div>
              )}

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 text-xs font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
                >
                  Return to Website
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 text-xs font-black text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-lg transition-all cursor-pointer transform hover:-translate-y-0.5"
                >
                  Unlock Portal
                </button>
              </div>
            </form>
          )}

          <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-500 text-center">
            256-bit Encrypted Session • Authorized MMS Staff & Desk Officers Only
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-6xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 my-auto flex flex-col max-h-[92vh] animate-fadeIn">
        
        {/* Top Header Bar */}
        <div className="bg-slate-900 text-white px-5 sm:px-7 py-3.5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-md">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-tight">
                  MMS Air Travels • Agency Administration & Fare Desk
                </h2>
                <span className="text-[10px] uppercase font-extrabold bg-emerald-500 text-white px-2 py-0.5 rounded">
                  Private Session Active
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Manage flight fares, add custom routes, adjust global pricing, edit tour packages & manage inquiries CRM
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsChangingPassword(true)}
              className="px-3 py-1.5 rounded-lg text-xs font-bold text-amber-300 hover:text-amber-200 bg-slate-800 hover:bg-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
              title="Change Master Passcode"
            >
              <Key className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Passcode</span>
            </button>

            <button
              onClick={handleSignOut}
              className="px-3 py-1.5 rounded-lg text-xs font-bold text-rose-300 hover:text-white bg-rose-950/60 hover:bg-rose-900 border border-rose-800/60 flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Sign Out and Lock Portal"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Lock Session</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
              title="Close Portal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Change Passcode Modal */}
        {isChangingPassword && (
          <div className="p-4 bg-slate-900 text-white border-b border-slate-700 animate-fadeIn flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-0.5 text-left">
              <h4 className="text-sm font-black text-amber-400 flex items-center gap-2">
                <Key className="w-4 h-4" /> Change Master Passcode
              </h4>
              <p className="text-xs text-slate-400">Set a new private password for the admin portal.</p>
            </div>

            <form onSubmit={handleSaveNewPassword} className="flex flex-wrap items-center gap-2">
              <input
                type="password"
                placeholder="New Passcode"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="px-3 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white"
              />
              <input
                type="password"
                placeholder="Confirm Passcode"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="px-3 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white"
              />
              <button
                type="submit"
                className="px-3 py-1.5 text-xs font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-lg cursor-pointer"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsChangingPassword(false);
                  setChangePassError('');
                }}
                className="px-3 py-1.5 text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
            </form>

            {changePassSuccess && (
              <span className="text-xs font-bold text-emerald-400">Passcode updated successfully!</span>
            )}
            {changePassError && (
              <span className="text-xs font-bold text-rose-400">{changePassError}</span>
            )}
          </div>
        )}

        {/* Tab Navigation Menu */}
        <div className="bg-slate-100 border-b border-slate-200 px-5 sm:px-7 flex flex-wrap items-center gap-2 text-xs font-bold">
          <button
            onClick={() => setAdminTab('flights')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 transition-all ${
              adminTab === 'flights'
                ? 'border-blue-700 text-blue-900 bg-white shadow-xs font-black'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Plane className="w-4 h-4 text-blue-600" />
            <span>Flight Fares & Schedules ({flights.length})</span>
          </button>

          <button
            onClick={() => setAdminTab('tickets')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 transition-all ${
              adminTab === 'tickets'
                ? 'border-blue-700 text-blue-900 bg-white shadow-xs font-black'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookmarkCheck className="w-4 h-4 text-emerald-600" />
            <span>Tickets &amp; Bookings ({bookingsList.length})</span>
          </button>

          <button
            onClick={() => setAdminTab('group-fares')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 transition-all ${
              adminTab === 'group-fares'
                ? 'border-blue-700 text-blue-900 bg-white shadow-xs font-black'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4 text-amber-600" />
            <span>Our Group Fares ({groupFares.length})</span>
          </button>

          <button
            onClick={() => setAdminTab('global')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 transition-all ${
              adminTab === 'global'
                ? 'border-blue-700 text-blue-900 bg-white shadow-xs font-black'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <TrendingUp className="w-4 h-4 text-amber-600" />
            <span>Global Fare Adjuster ("For All")</span>
            {globalAdjustment.percentage !== 0 && (
              <span className="bg-amber-500 text-white text-[10px] px-1.5 rounded-full font-mono">
                {globalAdjustment.percentage > 0 ? `+${globalAdjustment.percentage}%` : `${globalAdjustment.percentage}%`}
              </span>
            )}
          </button>

          <button
            onClick={() => setAdminTab('tours')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 transition-all ${
              adminTab === 'tours'
                ? 'border-blue-700 text-blue-900 bg-white shadow-xs font-black'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Compass className="w-4 h-4 text-emerald-600" />
            <span>Tour Packages Pricing ({tourPackages.length})</span>
          </button>

          <button
            onClick={() => setAdminTab('visas')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 transition-all ${
              adminTab === 'visas'
                ? 'border-blue-700 text-blue-900 bg-white shadow-xs font-black'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4 text-indigo-600" />
            <span>Visa Rates ({visaServices.length})</span>
          </button>

          <button
            onClick={() => setAdminTab('inquiries')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 transition-all ${
              adminTab === 'inquiries'
                ? 'border-blue-700 text-blue-900 bg-white shadow-xs font-black'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-rose-600" />
            <span>Customer Inquiries CRM</span>
            {inquiries.filter(i => i.status === 'NEW').length > 0 && (
              <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-mono">
                {inquiries.filter(i => i.status === 'NEW').length} new
              </span>
            )}
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7">

          {/* ========================================================= */}
          {/* TAB 1: FLIGHT FARES & SCHEDULES MANAGEMENT               */}
          {/* ========================================================= */}
          {adminTab === 'flights' && (
            <div className="space-y-5">
              
              {/* Top Controls Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="flex items-center gap-2 flex-1 max-w-md">
                  <div className="relative w-full">
                    <input
                      type="text"
                      placeholder="Search by Airline, Flight #, Origin or Destination..."
                      value={flightSearch}
                      onChange={(e) => setFlightSearch(e.target.value)}
                      className="w-full text-xs font-medium pl-8 pr-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                    <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsAddingFlight(true)}
                    className="px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white font-extrabold text-xs rounded-xl shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4 text-amber-400" />
                    <span>Add New Flight Schedule ("Add Option for All")</span>
                  </button>
                </div>
              </div>

              {/* Flights Table */}
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100/80 text-slate-700 font-extrabold border-b border-slate-200 uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="py-3 px-4">Airline & Flight #</th>
                        <th className="py-3 px-3">Route (From → To)</th>
                        <th className="py-3 px-3">Timings & Stops</th>
                        <th className="py-3 px-3">Base Fare (USD)</th>
                        <th className="py-3 px-3">Seats</th>
                        <th className="py-3 px-3">Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {filteredFlights.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="text-center py-8 text-slate-500">
                            No flights matching search query. Click "Add New Flight Schedule" to create one.
                          </td>
                        </tr>
                      ) : (
                        filteredFlights.map((flight) => (
                          <tr key={flight.id} className="hover:bg-slate-50 transition-colors">
                            <td className="py-3 px-4">
                              <div className="font-bold text-slate-900">{flight.airline}</div>
                              <div className="font-mono text-[11px] text-blue-700 font-bold">{flight.flightNumber}</div>
                              <div className="text-[10px] text-slate-400">{flight.aircraft}</div>
                            </td>

                            <td className="py-3 px-3">
                              <div className="font-bold text-slate-800">
                                {flight.origin.code} → {flight.destination.code}
                              </div>
                              <div className="text-[11px] text-slate-500 truncate max-w-[140px]">
                                {flight.origin.city} to {flight.destination.city}
                              </div>
                            </td>

                            <td className="py-3 px-3">
                              <div className="font-mono font-bold text-slate-800">
                                {flight.departureTime} - {flight.arrivalTime}
                              </div>
                              <div className="text-[10px] text-slate-500">
                                {flight.stops === 0 ? 'Non-Stop' : `1 Stop (${flight.layoverAirport?.code || 'Transfer'})`} • {flight.durationMinutes}m
                              </div>
                            </td>

                            <td className="py-3 px-3 font-mono">
                              <div className="text-sm font-black text-amber-600">
                                ${flight.basePrice}
                              </div>
                              <div className="text-[10px] text-slate-400">
                                ~₹{(flight.basePrice * 83).toLocaleString('en-IN')}
                              </div>
                            </td>

                            <td className="py-3 px-3">
                              <span className={`inline-block px-2 py-0.5 rounded font-mono font-bold text-[11px] ${
                                flight.availableSeats <= 5 ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                              }`}>
                                {flight.availableSeats} seats
                              </span>
                            </td>

                            <td className="py-3 px-3">
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                                {flight.status}
                              </span>
                            </td>

                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => setEditingFlight(flight)}
                                  className="p-1.5 text-blue-700 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                                  title="Modify Fare & Schedule"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteFlight(flight.id)}
                                  className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                  title="Delete Schedule"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ========================================================= */}
          {/* TAB: TICKETS & BOOKINGS MANAGEMENT                        */}
          {/* ========================================================= */}
          {adminTab === 'tickets' && (
            <div className="space-y-5">
              {/* Feedback Toast */}
              {ticketToast && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 font-bold text-xs flex items-center justify-between shadow-sm animate-fadeIn">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    {ticketToast}
                  </span>
                  <button onClick={() => setTicketToast(null)} className="text-emerald-700 hover:text-emerald-900 font-bold text-xs">
                    ✕
                  </button>
                </div>
              )}

              {/* KPI Summary Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Bookings</div>
                  <div className="text-xl font-black text-slate-900 mt-1">{bookingsList.length}</div>
                </div>

                <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-3.5">
                  <div className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">Confirmed</div>
                  <div className="text-xl font-black text-emerald-700 mt-1">
                    {bookingsList.filter(b => b.bookingStatus === 'CONFIRMED').length}
                  </div>
                </div>

                <div className="bg-sky-50/60 border border-sky-200 rounded-xl p-3.5">
                  <div className="text-[11px] font-bold text-sky-700 uppercase tracking-wider">Boarding / In-Flight</div>
                  <div className="text-xl font-black text-sky-700 mt-1">
                    {bookingsList.filter(b => b.bookingStatus === 'CHECKED_IN' || b.bookingStatus === 'BOARDING').length}
                  </div>
                </div>

                <div className="bg-rose-50/60 border border-rose-200 rounded-xl p-3.5">
                  <div className="text-[11px] font-bold text-rose-700 uppercase tracking-wider">Cancelled</div>
                  <div className="text-xl font-black text-rose-700 mt-1">
                    {bookingsList.filter(b => b.bookingStatus === 'CANCELLED').length}
                  </div>
                </div>

                <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-3.5 col-span-2 sm:col-span-1">
                  <div className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">Ticket Revenue</div>
                  <div className="text-lg font-black text-amber-800 font-mono mt-1 truncate">
                    {formatCurrency(bookingsList.reduce((sum, b) => sum + (b.paidAmount || 0), 0), currency)}
                  </div>
                </div>
              </div>

              {/* Controls & Filter Bar */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="relative flex-1 min-w-[240px] max-w-md">
                    <input
                      type="text"
                      placeholder="Search PNR, Ticket #, Passenger name, Airline, Flight #, Route..."
                      value={ticketSearch}
                      onChange={(e) => setTicketSearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 shadow-xs"
                    />
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    {ticketSearch && (
                      <button
                        onClick={() => setTicketSearch('')}
                        className="absolute right-2.5 top-2.5 text-xs text-slate-400 hover:text-slate-700"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200 text-xs">
                      {(['ALL', 'CONFIRMED', 'CHECKED_IN', 'BOARDING', 'CANCELLED'] as const).map(st => (
                        <button
                          key={st}
                          onClick={() => setTicketStatusFilter(st)}
                          className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                            ticketStatusFilter === st
                              ? 'bg-blue-900 text-white shadow-xs'
                              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                          }`}
                        >
                          {st === 'ALL' ? 'All Status' : st.replace('_', ' ')}
                        </button>
                      ))}
                    </div>

                    <select
                      value={ticketPaymentFilter}
                      onChange={(e) => setTicketPaymentFilter(e.target.value as any)}
                      className="text-xs bg-white border border-slate-300 rounded-lg px-3 py-2 font-bold text-slate-700 focus:outline-none focus:border-blue-600"
                    >
                      <option value="ALL">Payment: All</option>
                      <option value="PAID">Paid</option>
                      <option value="PENDING">Pending</option>
                      <option value="REFUNDED">Refunded</option>
                    </select>

                    <button
                      type="button"
                      onClick={() => {
                        exportBookingsToCSV(filteredBookings);
                        setTicketToast(`Exported ${filteredBookings.length} booking records to CSV.`);
                      }}
                      className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors cursor-pointer"
                      title="Export Bookings to CSV file"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Export CSV</span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                  <span>Showing <strong>{filteredBookings.length}</strong> of {bookingsList.length} tickets</span>
                  {(ticketSearch || ticketStatusFilter !== 'ALL' || ticketPaymentFilter !== 'ALL') && (
                    <button
                      onClick={() => {
                        setTicketSearch('');
                        setTicketStatusFilter('ALL');
                        setTicketPaymentFilter('ALL');
                      }}
                      className="text-blue-700 hover:underline font-bold"
                    >
                      Reset Filters
                    </button>
                  )}
                </div>
              </div>

              {/* Tickets Table */}
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="py-3 px-4">PNR & E-Ticket</th>
                        <th className="py-3 px-4">Passenger Details</th>
                        <th className="py-3 px-4">Flight & Sector</th>
                        <th className="py-3 px-4">Seat & Class</th>
                        <th className="py-3 px-4">Fare Paid</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Admin Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredBookings.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-12 text-center text-slate-400">
                            <BookmarkCheck className="w-10 h-10 mx-auto text-slate-300 mb-2 stroke-1" />
                            <p className="font-bold text-slate-600">No tickets found</p>
                            <p className="text-xs text-slate-400 mt-1">Try adjusting your search criteria or status filter.</p>
                          </td>
                        </tr>
                      ) : (
                        filteredBookings.map((b) => {
                          const leadPax = b.passengers && b.passengers[0];
                          const paxName = leadPax ? `${leadPax.firstName} ${leadPax.lastName}` : 'Guest Passenger';
                          const phone = leadPax?.contactPhone || 'N/A';
                          const email = leadPax?.contactEmail || 'N/A';
                          const seatNumber = leadPax?.seatNumber || 'Unassigned';
                          const isCopied = copiedPnr === b.pnr;

                          return (
                            <tr key={b.id} className="hover:bg-blue-50/30 transition-colors">
                              <td className="py-3 px-4">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-mono font-black text-slate-900 bg-amber-100 text-amber-900 px-2 py-0.5 rounded text-xs">
                                      {b.pnr}
                                    </span>
                                    <button
                                      onClick={() => {
                                        copyTextToClipboard(b.pnr);
                                        setCopiedPnr(b.pnr);
                                        setTimeout(() => setCopiedPnr(null), 2000);
                                      }}
                                      className="text-slate-400 hover:text-slate-700 p-0.5 rounded cursor-pointer"
                                      title="Copy PNR"
                                    >
                                      {isCopied ? (
                                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                                      ) : (
                                        <Copy className="w-3.5 h-3.5" />
                                      )}
                                    </button>
                                  </div>
                                  <div className="text-[10px] font-mono text-slate-500">
                                    {b.eTicketNumber}
                                  </div>
                                  <div className="text-[9px] text-slate-400">
                                    Issued: {new Date(b.bookingDate).toLocaleDateString()}
                                  </div>
                                </div>
                              </td>

                              <td className="py-3 px-4">
                                <div className="space-y-0.5">
                                  <div className="font-black text-slate-900 text-xs">
                                    {paxName}
                                  </div>
                                  <div className="text-[11px] text-slate-500 flex items-center gap-1">
                                    <Phone className="w-3 h-3 text-slate-400" />
                                    <span>{phone}</span>
                                  </div>
                                  <div className="text-[10px] text-slate-400 flex items-center gap-1 truncate max-w-[160px]">
                                    <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                                    <span className="truncate">{email}</span>
                                  </div>
                                </div>
                              </td>

                              <td className="py-3 px-4">
                                <div className="space-y-0.5">
                                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                                    <span>{b.flight?.airline?.name}</span>
                                    <span className="font-mono font-bold text-blue-700 bg-blue-50 px-1 rounded text-[10px]">
                                      {b.flight?.flightNumber}
                                    </span>
                                  </div>
                                  <div className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                                    <span>{b.flight?.origin?.code} ({b.flight?.origin?.city})</span>
                                    <span className="text-slate-400">→</span>
                                    <span>{b.flight?.destination?.code} ({b.flight?.destination?.city})</span>
                                  </div>
                                  <div className="text-[10px] text-slate-500">
                                    {b.flight?.departureDate} at {b.flight?.departureTime}
                                  </div>
                                </div>
                              </td>

                              <td className="py-3 px-4">
                                <div className="space-y-1">
                                  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                                    {b.flight?.cabinClass || 'Economy'}
                                  </span>
                                  <div className="text-[11px] font-mono font-bold text-indigo-700">
                                    Seat: {seatNumber}
                                  </div>
                                </div>
                              </td>

                              <td className="py-3 px-4">
                                <div className="space-y-0.5">
                                  <div className="font-black text-slate-900 font-mono text-xs">
                                    {formatCurrency(b.paidAmount, currency)}
                                  </div>
                                  <span className="inline-block text-[9px] font-bold uppercase text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                                    {b.fareTier || 'Standard'}
                                  </span>
                                </div>
                              </td>

                              <td className="py-3 px-4">
                                <div className="space-y-1">
                                  <div>
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                      b.bookingStatus === 'CONFIRMED'
                                        ? 'bg-emerald-100 text-emerald-800'
                                        : b.bookingStatus === 'CHECKED_IN' || b.bookingStatus === 'BOARDING'
                                        ? 'bg-sky-100 text-sky-800'
                                        : 'bg-rose-100 text-rose-800'
                                    }`}>
                                      {b.bookingStatus}
                                    </span>
                                  </div>
                                  <div>
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                      b.paymentStatus === 'PAID'
                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                        : b.paymentStatus === 'PENDING'
                                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                        : 'bg-purple-50 text-purple-700 border border-purple-200'
                                    }`}>
                                      Pay: {b.paymentStatus}
                                    </span>
                                  </div>
                                </div>
                              </td>

                              <td className="py-3 px-4 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  {/* Modify Ticket Button */}
                                  <button
                                    onClick={() => setEditingBooking({ ...b })}
                                    className="px-2.5 py-1.5 text-blue-700 hover:text-white hover:bg-blue-700 bg-blue-50 border border-blue-200 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                                    title="Modify Ticket Details"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                    <span>Modify</span>
                                  </button>

                                  {/* Delete Ticket Button */}
                                  <button
                                    onClick={() => setDeletingBooking(b)}
                                    className="px-2.5 py-1.5 text-rose-700 hover:text-white hover:bg-rose-700 bg-rose-50 border border-rose-200 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                                    title="Delete Ticket Record"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    <span>Delete</span>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB: OUR GROUP FARES MANAGEMENT                           */}
          {/* ========================================================= */}
          {adminTab === 'group-fares' && (
            <div className="space-y-5">
              
              {/* Top Controls Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="flex items-center gap-2 flex-1 max-w-md">
                  <div className="relative w-full">
                    <input
                      type="text"
                      placeholder="Search group code, airline, sector (e.g. TRZ, DXB)..."
                      value={groupFareSearch}
                      onChange={(e) => setGroupFareSearch(e.target.value)}
                      className="w-full text-xs font-medium pl-8 pr-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                    <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsAddingGroupFare(true)}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4 text-slate-950" />
                    <span>Add New Group Fare Block</span>
                  </button>
                </div>
              </div>

              {/* Quick Summary Chips */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-xs flex items-center justify-between">
                  <div>
                    <span className="text-slate-500 font-semibold block text-[11px]">Total Group Blocks</span>
                    <span className="text-lg font-black text-slate-900">{groupFares.length} Routes</span>
                  </div>
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-xs flex items-center justify-between">
                  <div>
                    <span className="text-slate-500 font-semibold block text-[11px]">Total Blocked Seats</span>
                    <span className="text-lg font-black text-emerald-600">
                      {groupFares.reduce((acc, curr) => acc + (curr.availableSeats || 0), 0)} Available
                    </span>
                  </div>
                  <ShieldCheck className="w-6 h-6 text-emerald-600" />
                </div>
                <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-xs flex items-center justify-between">
                  <div>
                    <span className="text-slate-500 font-semibold block text-[11px]">Active Wholesale Status</span>
                    <span className="text-lg font-black text-amber-600">
                      {groupFares.filter(g => g.active).length} Active Live
                    </span>
                  </div>
                  <Tag className="w-6 h-6 text-amber-500" />
                </div>
              </div>

              {/* Group Fares Table */}
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100/80 text-slate-700 font-extrabold border-b border-slate-200 uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="py-3 px-4">Group Code & Flight</th>
                        <th className="py-3 px-3">Sector (Origin → Dest)</th>
                        <th className="py-3 px-3">Date & Time</th>
                        <th className="py-3 px-3">Bulk Fare (INR/USD)</th>
                        <th className="py-3 px-3">Baggage & Inclusions</th>
                        <th className="py-3 px-3">Seats</th>
                        <th className="py-3 px-3">PNR Status</th>
                        <th className="py-3 px-3">Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {filteredGroupFares.length === 0 ? (
                        <tr>
                          <td colSpan={9} className="py-8 text-center text-slate-500">
                            No group fares matching "{groupFareSearch}".
                          </td>
                        </tr>
                      ) : (
                        filteredGroupFares.map(grp => (
                          <tr key={grp.id} className={`hover:bg-slate-50/70 transition-colors ${!grp.active ? 'opacity-60 bg-slate-50' : ''}`}>
                            <td className="py-3 px-4">
                              <span className="font-mono font-bold text-blue-900 block text-xs">{grp.groupCode}</span>
                              <span className="text-[11px] text-slate-500 font-semibold">{grp.airline} • {grp.flightNumber}</span>
                            </td>

                            <td className="py-3 px-3">
                              <div className="font-bold text-slate-800">
                                {grp.origin.city} ({grp.origin.code}) → {grp.destination.city} ({grp.destination.code})
                              </div>
                              <span className="text-[10px] text-slate-400">{grp.category}</span>
                            </td>

                            <td className="py-3 px-3">
                              <span className="font-mono font-medium block">{grp.departureDate}</span>
                              <span className="text-[10px] text-slate-400 font-mono">{grp.departureTime} - {grp.arrivalTime}</span>
                            </td>

                            <td className="py-3 px-3">
                              <span className="font-black text-amber-600 text-sm block">
                                ₹{grp.fareINR.toLocaleString('en-IN')}
                              </span>
                              <span className="text-[10px] text-slate-400 line-through">
                                Reg: ₹{grp.regularFareINR.toLocaleString('en-IN')}
                              </span>
                            </td>

                            <td className="py-3 px-3">
                              <span className="text-emerald-700 font-bold block text-[11px]">{grp.baggageAllowance}</span>
                              <span className="text-[10px] text-slate-500">{grp.mealIncluded ? 'Meal Included' : 'No Meal'}</span>
                            </td>

                            <td className="py-3 px-3">
                              <span className="font-mono font-black text-slate-800">{grp.availableSeats}</span>
                              <span className="text-slate-400 font-mono text-[10px]"> / {grp.totalSeats}</span>
                            </td>

                            <td className="py-3 px-3">
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 text-blue-800 uppercase">
                                {grp.pnrStatus.replace('_', ' ')}
                              </span>
                            </td>

                            <td className="py-3 px-3">
                              <button
                                onClick={() => handleToggleGroupFareActive(grp.id)}
                                className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-colors ${
                                  grp.active
                                    ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                                }`}
                              >
                                {grp.active ? 'Active' : 'Paused'}
                              </button>
                            </td>

                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => setEditingGroupFare(grp)}
                                  className="p-1.5 text-blue-700 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                                  title="Edit Fare / Seats"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteGroupFare(grp.id)}
                                  className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                  title="Delete Group Fare"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}
          {adminTab === 'global' && (
            <div className="space-y-6 max-w-3xl mx-auto">
              <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-md">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900">
                      Global Fare Multiplier & Surcharge Control ("Apply for All")
                    </h3>
                    <p className="text-xs text-slate-600">
                      Bulk update all active airline fares dynamically across all international and domestic routes.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleApplyGlobalAdjustment} className="space-y-4 pt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Percentage Markup */}
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                      <label className="block text-xs font-black text-slate-700 mb-1">
                        Percentage Adjustment (% for All Flights)
                      </label>
                      <p className="text-[11px] text-slate-500 mb-2">
                        Positive for peak/holiday surcharge (+10%), negative for promotional discount (-5%).
                      </p>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          step="1"
                          value={markupPercent}
                          onChange={(e) => setMarkupPercent(Number(e.target.value))}
                          className="w-full text-base font-bold font-mono p-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                        />
                        <span className="font-black text-slate-600 text-sm">%</span>
                      </div>
                    </div>

                    {/* Fixed Dollar Amount */}
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                      <label className="block text-xs font-black text-slate-700 mb-1">
                        Flat Surcharge (USD $ per ticket for All)
                      </label>
                      <p className="text-[11px] text-slate-500 mb-2">
                        Fixed fuel / airport fee addition (e.g. +$25 for high aviation fuel).
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-slate-600 text-sm">$</span>
                        <input
                          type="number"
                          step="5"
                          value={fixedMarkupUSD}
                          onChange={(e) => setFixedMarkupUSD(Number(e.target.value))}
                          className="w-full text-base font-bold font-mono p-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3">
                    <button
                      type="button"
                      onClick={handleResetToBaseline}
                      className="px-4 py-2.5 text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
                    >
                      Reset All to Baseline (0%)
                    </button>

                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-xs rounded-xl shadow-md hover:from-amber-600 hover:to-amber-700 transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <Check className="w-4 h-4" />
                      <span>Apply Global Adjustment to All Routes</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Real-time Preview of Fares */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">
                  Sample Route Price Impact (with current settings):
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="font-bold text-slate-800 block">Chennai (MAA) → Dubai (DXB)</span>
                    <span className="text-[10px] text-slate-400">Baseline: $380</span>
                    <p className="text-sm font-black text-amber-600 mt-1">
                      New Total: ${Math.round((380 * (1 + markupPercent / 100)) + fixedMarkupUSD)}
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="font-bold text-slate-800 block">Delhi (DEL) → London (LHR)</span>
                    <span className="text-[10px] text-slate-400">Baseline: $540</span>
                    <p className="text-sm font-black text-amber-600 mt-1">
                      New Total: ${Math.round((540 * (1 + markupPercent / 100)) + fixedMarkupUSD)}
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="font-bold text-slate-800 block">Mumbai (BOM) → Singapore (SIN)</span>
                    <span className="text-[10px] text-slate-400">Baseline: $320</span>
                    <p className="text-sm font-black text-amber-600 mt-1">
                      New Total: ${Math.round((320 * (1 + markupPercent / 100)) + fixedMarkupUSD)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 3: TOUR PACKAGES PRICING & DETAILS                   */}
          {/* ========================================================= */}
          {adminTab === 'tours' && (
            <div className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500">Filter Category:</span>
                  <div className="inline-flex p-0.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold">
                    {(['ALL', 'India', 'International', 'Group'] as const).map(cat => (
                      <button
                        key={cat}
                        onClick={() => setTourCategoryFilter(cat)}
                        className={`px-3 py-1 rounded-md transition-all ${
                          tourCategoryFilter === cat ? 'bg-blue-900 text-white font-bold' : 'text-slate-600'
                        }`}
                      >
                        {cat} Tours
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setIsAddingTour(true)}
                  className="px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white font-extrabold text-xs rounded-xl shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-amber-400" />
                  <span>Add New Tour Package</span>
                </button>
              </div>

              {/* Tours Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTours.map(pkg => (
                  <div key={pkg.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs flex flex-col justify-between">
                    <div>
                      <div className="relative h-32 overflow-hidden bg-slate-100">
                        <img src={pkg.imageUrl} alt={pkg.title} className="w-full h-full object-cover" />
                        <span className="absolute top-2 left-2 px-2 py-0.5 bg-blue-900/90 text-white text-[10px] font-bold rounded">
                          {pkg.category} Tour
                        </span>
                        <span className="absolute bottom-2 right-2 px-2 py-0.5 bg-slate-900/90 text-amber-400 text-[10px] font-bold rounded">
                          {pkg.duration}
                        </span>
                      </div>

                      <div className="p-4 space-y-2">
                        <h4 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2">
                          {pkg.title}
                        </h4>
                        <p className="text-xs text-slate-500 font-medium">
                          {pkg.destination} ({pkg.stateOrCountry})
                        </p>

                        <div className="pt-2 border-t border-slate-100 flex items-baseline justify-between">
                          <div>
                            <span className="text-[10px] uppercase font-bold text-slate-400 block">Package Price</span>
                            <span className="text-base font-black text-amber-600">
                              ₹{pkg.priceINR.toLocaleString('en-IN')}
                            </span>
                            <span className="text-[10px] text-slate-500 block">(${pkg.priceUSD} USD)</span>
                          </div>

                          <div className="text-right">
                            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              ★ {pkg.rating} Rating
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2">
                      <button
                        onClick={() => setEditingTour(pkg)}
                        className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-xs rounded-lg transition-colors flex items-center gap-1"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Modify Fare / Details</span>
                      </button>

                      <button
                        onClick={() => handleDeleteTour(pkg.id)}
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete Package"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 4: VISA SERVICES RATES                               */}
          {/* ========================================================= */}
          {adminTab === 'visas' && (
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h3 className="text-sm font-black text-slate-900">Visa Processing Fees & Service Charges</h3>
                <p className="text-xs text-slate-500">
                  Update government embassy fees, agency consultation charges, and turnaround timelines.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {visaServices.map(visa => (
                  <div key={visa.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{visa.flagEmoji}</span>
                        <div>
                          <h4 className="font-black text-slate-900 text-xs">{visa.country}</h4>
                          <span className="text-[10px] text-slate-500 block">{visa.visaType}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-lg text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Processing:</span>
                        <strong className="text-slate-800">{visa.processingTime}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Validity:</span>
                        <strong className="text-slate-800">{visa.validity}</strong>
                      </div>
                      <div className="flex justify-between pt-1 border-t border-slate-200">
                        <span className="text-slate-500 font-bold">Total Fee:</span>
                        <strong className="text-amber-600 font-black">₹{visa.feeINR.toLocaleString('en-IN')}</strong>
                      </div>
                    </div>

                    {/* Quick inline fare adjustment */}
                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="number"
                        defaultValue={visa.feeINR}
                        onBlur={(e) => {
                          const newFee = Number(e.target.value);
                          if (newFee && newFee !== visa.feeINR) {
                            onUpdateVisaServices(visaServices.map(v => v.id === visa.id ? { ...v, feeINR: newFee } : v));
                          }
                        }}
                        className="w-full text-xs font-mono font-bold p-1.5 bg-slate-50 border border-slate-300 rounded"
                        placeholder="Fee in INR"
                      />
                      <span className="text-[10px] font-bold text-slate-500 whitespace-nowrap">Auto-saved</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 5: CUSTOMER INQUIRIES CRM DESK                       */}
          {/* ========================================================= */}
          {adminTab === 'inquiries' && (
            <div className="space-y-4">
              {/* Filter & Search bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
                  {/* Search box */}
                  <div className="relative flex-1 min-w-[220px]">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search by Ref # (e.g. MMS-FLT-94812), Name, Phone, Sector..."
                      value={inquirySearch}
                      onChange={(e) => setInquirySearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-700"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500">Status:</span>
                    <div className="inline-flex p-0.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold">
                      {['ALL', 'NEW', 'IN_REVIEW', 'QUOTED', 'CONFIRMED', 'CLOSED'].map(st => (
                        <button
                          key={st}
                          onClick={() => setInquiryStatusFilter(st)}
                          className={`px-3 py-1 rounded-md transition-all ${
                            inquiryStatusFilter === st ? 'bg-blue-900 text-white font-bold' : 'text-slate-600'
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      exportInquiriesToCSV(filteredInquiries);
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors cursor-pointer"
                    title="Export Inquiries to CSV file"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export Inquiries CSV</span>
                  </button>
                  <div className="text-xs text-slate-500 font-semibold whitespace-nowrap">
                    Showing: <strong>{filteredInquiries.length}</strong> of {inquiries.length} Inquiries
                  </div>
                </div>
              </div>

              {filteredInquiries.length === 0 ? (
                <div className="bg-white rounded-xl p-12 text-center border border-slate-200 text-slate-500">
                  <MessageSquare className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                  <p className="font-bold text-slate-700">No Inquiries Found</p>
                  <p className="text-xs text-slate-400 mt-1">
                    {inquirySearch ? 'No inquiries matched your search criteria.' : 'When customers submit Flight Inquiries or Tour Booking requests, they appear here instantly.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredInquiries.map(inq => {
                    const refCode = inq.token || inq.referenceNumber || inq.id;
                    const routeSummaryText = inq.routeSummary || (inq.flight ? `${inq.flight.origin?.code} ➔ ${inq.flight.destination?.code}` : inq.serviceName || 'Custom Route');
                    const depDateText = inq.departureDate || inq.flight?.departureDate || 'Requested Date';
                    const leadName = inq.leadPassenger?.fullName || 'Valued Customer';
                    const leadTitle = inq.leadPassenger?.title || '';
                    const quoteFormatted = inq.quotedPriceUSD ? `$${inq.quotedPriceUSD} (~₹${(inq.quotedPriceUSD * 83).toLocaleString('en-IN')})` : 'Special Agency Rate';
                    
                    const waText = encodeURIComponent(
                      `Hello ${leadTitle ? leadTitle + ' ' : ''}${leadName},\n\nThis is regarding your ${inq.serviceType || 'Travel'} inquiry with MMS Air Travels for ${routeSummaryText} on ${depDateText}.\nOfficial Reference Number: ${refCode}.\n\nOur concierge ticketing desk has verified availability. Quoted: ${quoteFormatted}. Please confirm passenger passport copies so we can issue your booking.`
                    );

                    return (
                      <div key={inq.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                            {/* Official Reference Number with 1-click copy */}
                            <div className="flex items-center gap-1 bg-blue-50 text-blue-900 px-2.5 py-1 rounded border border-blue-200">
                              <span className="font-mono font-black text-xs">
                                {refCode}
                              </span>
                              <button
                                onClick={async () => {
                                  await copyTextToClipboard(refCode);
                                  setCopiedInquiryToken(refCode);
                                  setTimeout(() => setCopiedInquiryToken(null), 2000);
                                }}
                                className="p-0.5 text-blue-700 hover:text-blue-950 rounded transition-colors"
                                title="Copy Reference Number"
                              >
                                {copiedInquiryToken === refCode ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>

                            {/* Service Type Tag */}
                            {inq.serviceType && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                                {inq.serviceType}
                              </span>
                            )}

                            <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                              inq.status === 'NEW' ? 'bg-rose-100 text-rose-800 animate-pulse' :
                              inq.status === 'CONFIRMED' ? 'bg-emerald-100 text-emerald-800' :
                              inq.status === 'QUOTED' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                            }`}>
                              {inq.status}
                            </span>
                            <span className="text-[11px] text-slate-400">
                              {new Date(inq.createdAt).toLocaleString()}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            {/* WhatsApp Button */}
                            {inq.leadPassenger?.whatsapp && (
                              <a
                                href={`https://wa.me/${inq.leadPassenger.whatsapp.replace(/[^0-9]/g, '')}?text=${waText}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs"
                              >
                                <MessageSquare className="w-3.5 h-3.5" />
                                <span>WhatsApp Customer</span>
                              </a>
                            )}

                            {inq.leadPassenger?.phone && (
                              <a
                                href={`tel:${inq.leadPassenger.phone}`}
                                className="px-3 py-1.5 bg-blue-900 hover:bg-blue-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs"
                              >
                                <Phone className="w-3.5 h-3.5 text-amber-400" />
                                <span>Call</span>
                              </a>
                            )}

                            <button
                              onClick={() => handleDeleteInquiry(inq.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                              title="Delete Record"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Customer & Route Details */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                          <div>
                            <span className="text-[10px] uppercase font-bold text-slate-400 block">Lead Passenger</span>
                            <strong className="text-slate-900 text-sm">
                              {inq.leadPassenger?.title ? `${inq.leadPassenger.title} ` : ''}{inq.leadPassenger?.fullName || 'N/A'}
                            </strong>
                            <p className="text-slate-600 mt-0.5">Phone: <strong>{inq.leadPassenger?.phone || 'N/A'}</strong></p>
                            <p className="text-slate-600">WhatsApp: <strong>{inq.leadPassenger?.whatsapp || 'N/A'}</strong></p>
                            {inq.leadPassenger?.email && (
                              <p className="text-slate-500 truncate">{inq.leadPassenger.email}</p>
                            )}
                            {inq.leadPassenger?.cityOfResidence && (
                              <p className="text-slate-400 text-[11px] mt-0.5">{inq.leadPassenger.cityOfResidence}</p>
                            )}
                          </div>

                          <div>
                            <span className="text-[10px] uppercase font-bold text-slate-400 block">Service & Route Sector</span>
                            {inq.flight ? (
                              <>
                                <strong className="text-slate-900">
                                  {inq.flight.airline} ({inq.flight.flightNumber})
                                </strong>
                                <p className="text-slate-700 font-semibold mt-0.5">
                                  {inq.flight.origin?.code} ({inq.flight.origin?.city}) → {inq.flight.destination?.code} ({inq.flight.destination?.city})
                                </p>
                                <p className="text-slate-500">Date: {inq.departureDate || inq.flight.departureDate} at {inq.flight.departureTime}</p>
                                {inq.fareTier && (
                                  <p className="text-amber-700 font-bold">Tier: {inq.fareTier.toUpperCase()}</p>
                                )}
                              </>
                            ) : (
                              <>
                                <strong className="text-slate-900">
                                  {inq.serviceName || inq.serviceType || 'Travel Booking'}
                                </strong>
                                <p className="text-slate-700 font-semibold mt-0.5">
                                  {inq.routeSummary || 'Sector as requested'}
                                </p>
                                <p className="text-slate-500">Travel Date: {inq.departureDate || 'As specified'}</p>
                                {inq.passengers && (
                                  <p className="text-slate-600">
                                    Pax: {inq.passengers.adults} Adult(s){inq.passengers.children ? `, ${inq.passengers.children} Child` : ''}
                                  </p>
                                )}
                              </>
                            )}
                          </div>

                          <div>
                            <span className="text-[10px] uppercase font-bold text-slate-400 block">Pricing & Notes</span>
                            {inq.quotedPriceUSD ? (
                              <span className="text-sm font-black text-amber-600 block">
                                Quoted: ${inq.quotedPriceUSD} (~₹{(inq.quotedPriceUSD * 83).toLocaleString('en-IN')})
                              </span>
                            ) : (
                              <span className="text-xs font-bold text-slate-700 block">
                                Rate on Request (Special wholesale quote)
                              </span>
                            )}
                            {inq.preferences?.seat && <p className="text-slate-600">Seat: {inq.preferences.seat}</p>}
                            {inq.preferences?.meal && <p className="text-slate-600">Meal: {inq.preferences.meal}</p>}
                            {inq.notes && (
                              <p className="text-[11px] text-slate-600 italic mt-1 bg-slate-50 p-1.5 rounded border border-slate-200">
                                Note: "{inq.notes}"
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Status update selector & Staff Notes */}
                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-700">Change Status:</span>
                            <select
                              value={inq.status}
                              onChange={(e) => handleUpdateInquiryStatus(inq.id, e.target.value as any)}
                              className="p-1.5 bg-white border border-slate-300 rounded font-bold text-slate-800"
                            >
                              <option value="NEW">NEW</option>
                              <option value="IN_REVIEW">IN_REVIEW</option>
                              <option value="QUOTED">QUOTED</option>
                              <option value="CONFIRMED">CONFIRMED</option>
                              <option value="TICKET_ISSUED">TICKET_ISSUED</option>
                              <option value="CLOSED">CLOSED</option>
                            </select>
                          </div>

                          <div className="flex-1 max-w-md">
                            <input
                              type="text"
                              placeholder="Staff notes (e.g. Quoted ₹28,500 on WhatsApp, awaiting passport copy)..."
                              defaultValue={inq.adminNotes || ''}
                              onBlur={(e) => handleUpdateInquiryStatus(inq.id, inq.status, e.target.value)}
                              className="w-full text-xs p-1.5 bg-white border border-slate-300 rounded"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

        </div>

      </div>

      {/* ========================================================= */}
      {/* MODAL: EDIT FLIGHT FARE & SCHEDULE                        */}
      {/* ========================================================= */}
      {editingFlight && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-2xl p-6 shadow-2xl border border-slate-200 space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900">Modify Flight Fare & Timing</h3>
                <p className="text-xs text-slate-500">{editingFlight.airline} • {editingFlight.flightNumber}</p>
              </div>
              <button
                onClick={() => setEditingFlight(null)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveFlightEdit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Base Price (USD $)</label>
                  <input
                    type="number"
                    required
                    value={editingFlight.basePrice}
                    onChange={(e) => setEditingFlight({ ...editingFlight, basePrice: Number(e.target.value) })}
                    className="w-full p-2 font-mono font-bold bg-slate-50 border border-slate-300 rounded-lg text-amber-700"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Available Seats</label>
                  <input
                    type="number"
                    required
                    value={editingFlight.availableSeats}
                    onChange={(e) => setEditingFlight({ ...editingFlight, availableSeats: Number(e.target.value) })}
                    className="w-full p-2 font-mono font-bold bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Departure Time (HH:mm)</label>
                  <input
                    type="text"
                    required
                    value={editingFlight.departureTime}
                    onChange={(e) => setEditingFlight({ ...editingFlight, departureTime: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Arrival Time (HH:mm)</label>
                  <input
                    type="text"
                    required
                    value={editingFlight.arrivalTime}
                    onChange={(e) => setEditingFlight({ ...editingFlight, arrivalTime: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Operational Status</label>
                <select
                  value={editingFlight.status}
                  onChange={(e) => setEditingFlight({ ...editingFlight, status: e.target.value as any })}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-bold"
                >
                  <option value="SCHEDULED">SCHEDULED</option>
                  <option value="ON_TIME">ON_TIME</option>
                  <option value="BOARDING">BOARDING</option>
                  <option value="DELAYED">DELAYED</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setEditingFlight(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-lg font-black shadow-md"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: ADD NEW FLIGHT SCHEDULE ("Add option for all")     */}
      {/* ========================================================= */}
      {isAddingFlight && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-xl bg-white rounded-2xl p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-4 my-auto animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900">Add New Flight Route / Schedule</h3>
                <p className="text-xs text-slate-500">Publishes instantly into the live flight search inventory</p>
              </div>
              <button
                onClick={() => setIsAddingFlight(false)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNewFlight} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Airline Name</label>
                  <select
                    value={newFlightForm.airlineName}
                    onChange={(e) => {
                      const sel = AIRLINE_INFO.find(a => a.name === e.target.value);
                      setNewFlightForm({
                        ...newFlightForm,
                        airlineName: e.target.value,
                        airlineCode: sel ? sel.code : 'MM'
                      });
                    }}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-semibold"
                  >
                    {AIRLINE_INFO.map(a => (
                      <option key={a.code} value={a.name}>{a.name} ({a.code})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Flight Number</label>
                  <input
                    type="text"
                    required
                    value={newFlightForm.flightNumber}
                    onChange={(e) => setNewFlightForm({ ...newFlightForm, flightNumber: e.target.value.toUpperCase() })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-mono font-bold uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Origin Code (e.g. MAA, DEL, DXB)</label>
                  <input
                    type="text"
                    required
                    maxLength={3}
                    value={newFlightForm.originCode}
                    onChange={(e) => setNewFlightForm({ ...newFlightForm, originCode: e.target.value.toUpperCase() })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-mono font-bold uppercase"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Destination Code (e.g. DXB, LHR, SIN)</label>
                  <input
                    type="text"
                    required
                    maxLength={3}
                    value={newFlightForm.destCode}
                    onChange={(e) => setNewFlightForm({ ...newFlightForm, destCode: e.target.value.toUpperCase() })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-mono font-bold uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Departure Time</label>
                  <input
                    type="text"
                    placeholder="08:30"
                    required
                    value={newFlightForm.departureTime}
                    onChange={(e) => setNewFlightForm({ ...newFlightForm, departureTime: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Arrival Time</label>
                  <input
                    type="text"
                    placeholder="13:45"
                    required
                    value={newFlightForm.arrivalTime}
                    onChange={(e) => setNewFlightForm({ ...newFlightForm, arrivalTime: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Duration (mins)</label>
                  <input
                    type="number"
                    required
                    value={newFlightForm.durationMinutes}
                    onChange={(e) => setNewFlightForm({ ...newFlightForm, durationMinutes: Number(e.target.value) })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Base Price (USD $)</label>
                  <input
                    type="number"
                    required
                    value={newFlightForm.basePrice}
                    onChange={(e) => setNewFlightForm({ ...newFlightForm, basePrice: Number(e.target.value) })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-mono font-black text-amber-700"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Seats Available</label>
                  <input
                    type="number"
                    required
                    value={newFlightForm.availableSeats}
                    onChange={(e) => setNewFlightForm({ ...newFlightForm, availableSeats: Number(e.target.value) })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Stops</label>
                  <select
                    value={newFlightForm.stops}
                    onChange={(e) => setNewFlightForm({ ...newFlightForm, stops: Number(e.target.value) })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-semibold"
                  >
                    <option value="0">Non-Stop</option>
                    <option value="1">1 Stop</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddingFlight(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-lg font-black shadow-md cursor-pointer"
                >
                  Publish New Flight Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: EDIT / ADD TOUR PACKAGE                            */}
      {/* ========================================================= */}
      {(editingTour || isAddingTour) && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-xl bg-white rounded-2xl p-6 shadow-2xl border border-slate-200 space-y-4 my-auto animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900">
                  {editingTour ? 'Modify Tour Package Fare' : 'Add New Tour Package Option'}
                </h3>
                <p className="text-xs text-slate-500">Updates the tours catalog for customers</p>
              </div>
              <button
                onClick={() => { setEditingTour(null); setIsAddingTour(false); }}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={editingTour ? handleSaveTourEdit : handleCreateNewTour} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Package Title</label>
                <input
                  type="text"
                  required
                  value={editingTour ? editingTour.title : newTourForm.title}
                  onChange={(e) => {
                    if (editingTour) setEditingTour({ ...editingTour, title: e.target.value });
                    else setNewTourForm({ ...newTourForm, title: e.target.value });
                  }}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={editingTour ? editingTour.category : newTourForm.category}
                    onChange={(e) => {
                      if (editingTour) setEditingTour({ ...editingTour, category: e.target.value as any });
                      else setNewTourForm({ ...newTourForm, category: e.target.value as any });
                    }}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-semibold"
                  >
                    <option value="India">India Tours</option>
                    <option value="International">International Tours</option>
                    <option value="Group">Group Tours</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Duration</label>
                  <input
                    type="text"
                    required
                    value={editingTour ? editingTour.duration : newTourForm.duration}
                    onChange={(e) => {
                      if (editingTour) setEditingTour({ ...editingTour, duration: e.target.value });
                      else setNewTourForm({ ...newTourForm, duration: e.target.value });
                    }}
                    placeholder="5 Days / 4 Nights"
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Price (INR ₹)</label>
                  <input
                    type="number"
                    required
                    value={editingTour ? editingTour.priceINR : newTourForm.priceINR}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (editingTour) setEditingTour({ ...editingTour, priceINR: val, priceUSD: Math.round(val / 83) });
                      else setNewTourForm({ ...newTourForm, priceINR: val, priceUSD: Math.round(val / 83) });
                    }}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-mono font-bold text-amber-700"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Price (USD $)</label>
                  <input
                    type="number"
                    required
                    value={editingTour ? editingTour.priceUSD : newTourForm.priceUSD}
                    onChange={(e) => {
                      if (editingTour) setEditingTour({ ...editingTour, priceUSD: Number(e.target.value) });
                      else setNewTourForm({ ...newTourForm, priceUSD: Number(e.target.value) });
                    }}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Destination / State</label>
                <input
                  type="text"
                  required
                  value={editingTour ? editingTour.destination : newTourForm.destination}
                  onChange={(e) => {
                    if (editingTour) setEditingTour({ ...editingTour, destination: e.target.value, stateOrCountry: e.target.value });
                    else setNewTourForm({ ...newTourForm, destination: e.target.value, stateOrCountry: e.target.value });
                  }}
                  placeholder="e.g. Goa, Kashmir, Dubai, Bangkok"
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Image URL</label>
                <input
                  type="url"
                  value={editingTour ? editingTour.imageUrl : newTourForm.imageUrl}
                  onChange={(e) => {
                    if (editingTour) setEditingTour({ ...editingTour, imageUrl: e.target.value });
                    else setNewTourForm({ ...newTourForm, imageUrl: e.target.value });
                  }}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-mono text-[11px]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => { setEditingTour(null); setIsAddingTour(false); }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-lg font-black shadow-md cursor-pointer"
                >
                  {editingTour ? 'Save Tour Changes' : 'Publish Tour Package'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: EDIT / ADD GROUP FARE BLOCK                        */}
      {/* ========================================================= */}
      {(editingGroupFare || isAddingGroupFare) && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-xl bg-white rounded-2xl p-6 shadow-2xl border border-slate-200 space-y-4 my-auto animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900">
                  {editingGroupFare ? 'Modify Group Fare & Block Allocation' : 'Add New Wholesale Group Fare Block'}
                </h3>
                <p className="text-xs text-slate-500">Updates live group inventory and bulk pricing for customers</p>
              </div>
              <button
                onClick={() => { setEditingGroupFare(null); setIsAddingGroupFare(false); }}
                className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={editingGroupFare ? handleSaveGroupFareEdit : handleCreateNewGroupFare} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Group Code / PNR ID</label>
                  <input
                    type="text"
                    required
                    value={editingGroupFare ? editingGroupFare.groupCode : newGroupFareForm.groupCode}
                    onChange={(e) => {
                      if (editingGroupFare) setEditingGroupFare({ ...editingGroupFare, groupCode: e.target.value });
                      else setNewGroupFareForm({ ...newGroupFareForm, groupCode: e.target.value });
                    }}
                    placeholder="MMS-GRP-MAA-DXB"
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Airline & Flight #</label>
                  <input
                    type="text"
                    required
                    value={editingGroupFare ? `${editingGroupFare.airline} (${editingGroupFare.flightNumber})` : `${newGroupFareForm.airline} (${newGroupFareForm.flightNumber})`}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (editingGroupFare) setEditingGroupFare({ ...editingGroupFare, flightNumber: val });
                      else setNewGroupFareForm({ ...newGroupFareForm, flightNumber: val });
                    }}
                    placeholder="Air India Express (IX-687)"
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Bulk Fare (₹ INR)</label>
                  <input
                    type="number"
                    required
                    value={editingGroupFare ? editingGroupFare.fareINR : newGroupFareForm.fareINR}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (editingGroupFare) setEditingGroupFare({ ...editingGroupFare, fareINR: val, fareUSD: Math.round(val / 83) });
                      else setNewGroupFareForm({ ...newGroupFareForm, fareINR: val, fareUSD: Math.round(val / 83) });
                    }}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-black text-amber-600 text-sm"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Regular Fare (₹ INR)</label>
                  <input
                    type="number"
                    required
                    value={editingGroupFare ? editingGroupFare.regularFareINR : newGroupFareForm.regularFareINR}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (editingGroupFare) setEditingGroupFare({ ...editingGroupFare, regularFareINR: val });
                      else setNewGroupFareForm({ ...newGroupFareForm, regularFareINR: val });
                    }}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-semibold text-slate-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Available Seats</label>
                  <input
                    type="number"
                    required
                    value={editingGroupFare ? editingGroupFare.availableSeats : newGroupFareForm.availableSeats}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (editingGroupFare) setEditingGroupFare({ ...editingGroupFare, availableSeats: val });
                      else setNewGroupFareForm({ ...newGroupFareForm, availableSeats: val });
                    }}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-bold text-emerald-700"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Total Block Seats</label>
                  <input
                    type="number"
                    required
                    value={editingGroupFare ? editingGroupFare.totalSeats : newGroupFareForm.totalSeats}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (editingGroupFare) setEditingGroupFare({ ...editingGroupFare, totalSeats: val });
                      else setNewGroupFareForm({ ...newGroupFareForm, totalSeats: val });
                    }}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Baggage Allowance</label>
                  <input
                    type="text"
                    required
                    value={editingGroupFare ? editingGroupFare.baggageAllowance : newGroupFareForm.baggageAllowance}
                    onChange={(e) => {
                      if (editingGroupFare) setEditingGroupFare({ ...editingGroupFare, baggageAllowance: e.target.value });
                      else setNewGroupFareForm({ ...newGroupFareForm, baggageAllowance: e.target.value });
                    }}
                    placeholder="30 Kg Check-in + 7 Kg Cabin"
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">PNR Status Label</label>
                  <select
                    value={editingGroupFare ? editingGroupFare.pnrStatus : newGroupFareForm.pnrStatus}
                    onChange={(e) => {
                      if (editingGroupFare) setEditingGroupFare({ ...editingGroupFare, pnrStatus: e.target.value as any });
                      else setNewGroupFareForm({ ...newGroupFareForm, pnrStatus: e.target.value as any });
                    }}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-semibold"
                  >
                    <option value="CONFIRMED_BLOCKED">CONFIRMED BLOCKED</option>
                    <option value="FAST_SELLING">FAST SELLING</option>
                    <option value="FEW_SEATS_LEFT">FEW SEATS LEFT</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Featured Note / Highlight</label>
                <input
                  type="text"
                  value={editingGroupFare ? (editingGroupFare.featuredNote || '') : newGroupFareForm.featuredNote}
                  onChange={(e) => {
                    if (editingGroupFare) setEditingGroupFare({ ...editingGroupFare, featuredNote: e.target.value });
                    else setNewGroupFareForm({ ...newGroupFareForm, featuredNote: e.target.value });
                  }}
                  placeholder="e.g. Non-stop Direct • Trichy Gateway • Confirmed Blocked PNR"
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => { setEditingGroupFare(null); setIsAddingGroupFare(false); }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-lg font-black shadow-md cursor-pointer"
                >
                  {editingGroupFare ? 'Save Group Fare Changes' : 'Publish Group Block'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: MODIFY TICKET & PASSENGER MANIFEST                 */}
      {/* ========================================================= */}
      {editingBooking && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-blue-600" />
                  Modify Ticket — PNR: <span className="font-mono text-blue-700">{editingBooking.pnr}</span>
                </h3>
                <p className="text-xs text-slate-500">
                  E-Ticket: <span className="font-mono text-slate-700 font-bold">{editingBooking.eTicketNumber}</span> • Issued: {new Date(editingBooking.bookingDate).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => setEditingBooking(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveTicketEdit} className="space-y-4 text-xs">
              {/* SECTION 1: PASSENGER INFORMATION */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-blue-600" />
                  Primary Passenger Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">First Name</label>
                    <input
                      type="text"
                      required
                      value={editingBooking.passengers[0]?.firstName || ''}
                      onChange={(e) => {
                        const updatedPax = [...editingBooking.passengers];
                        if (updatedPax[0]) {
                          updatedPax[0] = { ...updatedPax[0], firstName: e.target.value };
                          setEditingBooking({ ...editingBooking, passengers: updatedPax });
                        }
                      }}
                      className="w-full p-2 bg-white border border-slate-300 rounded-lg font-medium text-slate-900 focus:outline-none focus:border-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Last Name</label>
                    <input
                      type="text"
                      required
                      value={editingBooking.passengers[0]?.lastName || ''}
                      onChange={(e) => {
                        const updatedPax = [...editingBooking.passengers];
                        if (updatedPax[0]) {
                          updatedPax[0] = { ...updatedPax[0], lastName: e.target.value };
                          setEditingBooking({ ...editingBooking, passengers: updatedPax });
                        }
                      }}
                      className="w-full p-2 bg-white border border-slate-300 rounded-lg font-medium text-slate-900 focus:outline-none focus:border-blue-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Contact Phone</label>
                    <input
                      type="text"
                      value={editingBooking.passengers[0]?.contactPhone || ''}
                      onChange={(e) => {
                        const updatedPax = [...editingBooking.passengers];
                        if (updatedPax[0]) {
                          updatedPax[0] = { ...updatedPax[0], contactPhone: e.target.value };
                          setEditingBooking({ ...editingBooking, passengers: updatedPax });
                        }
                      }}
                      className="w-full p-2 bg-white border border-slate-300 rounded-lg font-medium text-slate-900 focus:outline-none focus:border-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Contact Email</label>
                    <input
                      type="email"
                      value={editingBooking.passengers[0]?.contactEmail || ''}
                      onChange={(e) => {
                        const updatedPax = [...editingBooking.passengers];
                        if (updatedPax[0]) {
                          updatedPax[0] = { ...updatedPax[0], contactEmail: e.target.value };
                          setEditingBooking({ ...editingBooking, passengers: updatedPax });
                        }
                      }}
                      className="w-full p-2 bg-white border border-slate-300 rounded-lg font-medium text-slate-900 focus:outline-none focus:border-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Seat Number</label>
                    <input
                      type="text"
                      placeholder="e.g. 12A, 14F"
                      value={editingBooking.passengers[0]?.seatNumber || ''}
                      onChange={(e) => {
                        const updatedPax = [...editingBooking.passengers];
                        if (updatedPax[0]) {
                          updatedPax[0] = { ...updatedPax[0], seatNumber: e.target.value };
                          setEditingBooking({ ...editingBooking, passengers: updatedPax });
                        }
                      }}
                      className="w-full p-2 bg-white border border-slate-300 rounded-lg font-mono font-bold text-indigo-700 focus:outline-none focus:border-blue-600"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: FLIGHT & SECTOR DETAILS */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <Plane className="w-3.5 h-3.5 text-blue-600" />
                  Flight & Sector Routing
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Airline Name</label>
                    <input
                      type="text"
                      required
                      value={editingBooking.flight?.airline?.name || ''}
                      onChange={(e) => {
                        setEditingBooking({
                          ...editingBooking,
                          flight: {
                            ...editingBooking.flight,
                            airline: {
                              ...editingBooking.flight.airline,
                              name: e.target.value
                            }
                          }
                        });
                      }}
                      className="w-full p-2 bg-white border border-slate-300 rounded-lg font-medium text-slate-900 focus:outline-none focus:border-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Flight Number</label>
                    <input
                      type="text"
                      required
                      value={editingBooking.flight?.flightNumber || ''}
                      onChange={(e) => {
                        setEditingBooking({
                          ...editingBooking,
                          flight: {
                            ...editingBooking.flight,
                            flightNumber: e.target.value
                          }
                        });
                      }}
                      className="w-full p-2 bg-white border border-slate-300 rounded-lg font-mono font-bold text-blue-700 focus:outline-none focus:border-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Cabin Class</label>
                    <select
                      value={editingBooking.flight?.cabinClass || 'Economy'}
                      onChange={(e) => {
                        setEditingBooking({
                          ...editingBooking,
                          flight: {
                            ...editingBooking.flight,
                            cabinClass: e.target.value as CabinClass
                          }
                        });
                      }}
                      className="w-full p-2 bg-white border border-slate-300 rounded-lg font-bold text-slate-800 focus:outline-none focus:border-blue-600"
                    >
                      <option value="Economy">Economy</option>
                      <option value="Premium Economy">Premium Economy</option>
                      <option value="Business">Business</option>
                      <option value="First Class">First Class</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Departure Date</label>
                    <input
                      type="date"
                      required
                      value={editingBooking.flight?.departureDate || ''}
                      onChange={(e) => {
                        setEditingBooking({
                          ...editingBooking,
                          flight: {
                            ...editingBooking.flight,
                            departureDate: e.target.value
                          }
                        });
                      }}
                      className="w-full p-2 bg-white border border-slate-300 rounded-lg font-medium text-slate-900 focus:outline-none focus:border-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Departure Time</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 14:30"
                      value={editingBooking.flight?.departureTime || ''}
                      onChange={(e) => {
                        setEditingBooking({
                          ...editingBooking,
                          flight: {
                            ...editingBooking.flight,
                            departureTime: e.target.value
                          }
                        });
                      }}
                      className="w-full p-2 bg-white border border-slate-300 rounded-lg font-medium text-slate-900 focus:outline-none focus:border-blue-600"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 3: PRICING & STATUS */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-blue-600" />
                  Pricing & Booking Status
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Total Paid Fare (USD $)</label>
                    <input
                      type="number"
                      min="0"
                      required
                      value={editingBooking.paidAmount}
                      onChange={(e) => setEditingBooking({ ...editingBooking, paidAmount: Number(e.target.value), totalPriceUSD: Number(e.target.value) })}
                      className="w-full p-2 bg-white border border-slate-300 rounded-lg font-mono font-bold text-emerald-700 focus:outline-none focus:border-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Payment Status</label>
                    <select
                      value={editingBooking.paymentStatus}
                      onChange={(e) => setEditingBooking({ ...editingBooking, paymentStatus: e.target.value as any })}
                      className="w-full p-2 bg-white border border-slate-300 rounded-lg font-bold text-slate-800 focus:outline-none focus:border-blue-600"
                    >
                      <option value="PAID">PAID</option>
                      <option value="PENDING">PENDING</option>
                      <option value="REFUNDED">REFUNDED</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Booking Status</label>
                    <select
                      value={editingBooking.bookingStatus}
                      onChange={(e) => setEditingBooking({ ...editingBooking, bookingStatus: e.target.value as any })}
                      className="w-full p-2 bg-white border border-slate-300 rounded-lg font-bold text-slate-800 focus:outline-none focus:border-blue-600"
                    >
                      <option value="CONFIRMED">CONFIRMED</option>
                      <option value="CHECKED_IN">CHECKED_IN</option>
                      <option value="BOARDING">BOARDING</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200">
                  <div className="text-[11px] font-bold text-slate-600 mb-2">Ancillary Services Included</div>
                  <div className="flex flex-wrap items-center gap-4">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editingBooking.addOns?.travelInsurance || false}
                        onChange={(e) => setEditingBooking({
                          ...editingBooking,
                          addOns: { ...editingBooking.addOns, travelInsurance: e.target.checked }
                        })}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span>Travel Insurance</span>
                    </label>

                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editingBooking.addOns?.priorityBoarding || false}
                        onChange={(e) => setEditingBooking({
                          ...editingBooking,
                          addOns: { ...editingBooking.addOns, priorityBoarding: e.target.checked }
                        })}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span>Priority Boarding</span>
                    </label>

                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editingBooking.addOns?.loungeAccess || false}
                        onChange={(e) => setEditingBooking({
                          ...editingBooking,
                          addOns: { ...editingBooking.addOns, loungeAccess: e.target.checked }
                        })}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span>Airport Lounge Access</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* FOOTER ACTIONS */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    const b = editingBooking;
                    setEditingBooking(null);
                    setDeletingBooking(b);
                  }}
                  className="px-3.5 py-2 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Ticket</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingBooking(null)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-blue-900 hover:bg-blue-800 text-white rounded-xl font-black shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Save Ticket Changes</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: DELETE TICKET PERMANENT CONFIRMATION               */}
      {/* ========================================================= */}
      {deletingBooking && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-rose-300 space-y-4 animate-fadeIn">
            <div className="flex items-center gap-3 text-rose-700 border-b border-rose-100 pb-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">Permanently Delete Ticket?</h3>
                <p className="text-xs text-rose-600 font-semibold">This action cannot be undone.</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">PNR Reference:</span>
                <span className="font-mono font-black text-amber-900 bg-amber-100 px-2 py-0.5 rounded">{deletingBooking.pnr}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">E-Ticket #:</span>
                <span className="font-mono font-bold text-slate-700">{deletingBooking.eTicketNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Passenger:</span>
                <span className="font-bold text-slate-900">
                  {deletingBooking.passengers[0]?.firstName} {deletingBooking.passengers[0]?.lastName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Flight:</span>
                <span className="text-slate-800 font-medium">
                  {deletingBooking.flight?.airline?.name} ({deletingBooking.flight?.flightNumber})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Sector:</span>
                <span className="text-slate-800 font-medium">
                  {deletingBooking.flight?.origin?.code} → {deletingBooking.flight?.destination?.code}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Total Fare:</span>
                <span className="font-black text-emerald-700 font-mono">
                  {formatCurrency(deletingBooking.paidAmount, currency)}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Deleting this ticket will permanently remove the booking reservation, e-ticket manifest, and all passenger contact details from the admin system.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDeletingBooking(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition-colors cursor-pointer"
              >
                No, Keep Ticket
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteTicket}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-black text-xs shadow-md shadow-rose-600/30 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Yes, Delete Ticket</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
