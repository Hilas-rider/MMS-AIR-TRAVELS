import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  X, 
  Send, 
  MessageSquare, 
  Phone, 
  Plane, 
  Bus, 
  Globe, 
  Ticket, 
  HelpCircle, 
  MapPin, 
  RotateCcw, 
  ExternalLink,
  ChevronRight,
  Sparkles,
  Luggage,
  DollarSign,
  UserCheck,
  Minimize2,
  Maximize2,
  Copy,
  Check,
  ChevronUp,
  ChevronDown,
  FileText,
  CheckCircle2,
  Clock,
  Building2
} from 'lucide-react';
import { CONTACT_NUMBERS, LOCATIONS } from '../data/contactInfo';

export type ChatLanguage = 'en' | 'ta' | 'tanglish';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  buttons?: {
    label: string;
    action: () => void;
    icon?: string;
    variant?: 'primary' | 'whatsapp' | 'secondary';
    href?: string;
  }[];
}

type FlowStep = 
  | 'idle'
  | 'flight_from' | 'flight_to' | 'flight_date' | 'flight_trip_type' | 'flight_passengers' | 'flight_airline'
  | 'bus_from' | 'bus_to' | 'bus_date' | 'bus_passengers' | 'bus_boarding'
  | 'visa_country' | 'visa_purpose' | 'visa_date' | 'visa_type'
  | 'ticket_pnr' | 'ticket_issue';

interface FlowData {
  flight: {
    from: string;
    to: string;
    date: string;
    tripType: string;
    passengers: string;
    airline: string;
  };
  bus: {
    from: string;
    to: string;
    date: string;
    passengers: string;
    boarding: string;
  };
  visa: {
    country: string;
    purpose: string;
    date: string;
    visaType: string;
  };
  ticket: {
    pnr: string;
    issue: string;
  };
}

interface MmsTravelAssistantProps {
  isOpen: boolean;
  onOpen?: () => void;
  onClose: () => void;
  initialIntent?: string;
  initialCategory?: string;
  onNavigate?: (tab: string, subCategory?: string) => void;
  onNavigateTab?: (tab: string, subCategory?: string) => void;
  onOpenBusModal?: () => void;
  onOpenEnquiry?: (service?: string, notes?: string) => void;
}

export const MmsTravelAssistant: React.FC<MmsTravelAssistantProps> = ({
  isOpen,
  onOpen,
  onClose,
  initialIntent,
  initialCategory,
  onNavigate,
  onNavigateTab,
  onOpenBusModal,
  onOpenEnquiry
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [language, setLanguage] = useState<ChatLanguage>('en');
  const [currentFlow, setCurrentFlow] = useState<FlowStep>('idle');
  const [flowData, setFlowData] = useState<FlowData>({
    flight: { from: '', to: '', date: '', tripType: '', passengers: '', airline: '' },
    bus: { from: '', to: '', date: '', passengers: '', boarding: '' },
    visa: { country: '', purpose: '', date: '', visaType: '' },
    ticket: { pnr: '', issue: '' }
  });
  const [isTyping, setIsTyping] = useState(false);

  // Reference / Case ID for customer and admin tracking
  const [caseId] = useState<string>(() => {
    const existing = typeof window !== 'undefined' ? sessionStorage.getItem('mms_chat_case_id') : null;
    if (existing) return existing;
    const generated = 'MMS-CAS-' + Math.floor(100000 + Math.random() * 900000);
    if (typeof window !== 'undefined') sessionStorage.setItem('mms_chat_case_id', generated);
    return generated;
  });
  const [copiedCaseId, setCopiedCaseId] = useState(false);

  // Common Inquiry Form State
  const [showCommonInquiry, setShowCommonInquiry] = useState(false);
  const [commonInquiryData, setCommonInquiryData] = useState({
    name: '',
    phone: '',
    branch: 'Madukkur',
    service: 'General Inquiry',
    message: ''
  });
  const [submittingInquiry, setSubmittingInquiry] = useState(false);
  const [inquirySuccess, setInquirySuccess] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToTop = () => {
    messagesContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, showCommonInquiry]);

  const handleCopyCaseId = () => {
    navigator.clipboard.writeText(caseId);
    setCopiedCaseId(true);
    setTimeout(() => setCopiedCaseId(false), 2000);
  };

  // Initial welcome greeting
  const getGreetingText = (lang: ChatLanguage) => {
    if (lang === 'ta') {
      return `வணக்கம்! 👋 MMS AIR TRAVELS-க்கு வரவேற்கிறோம்!

நான் உங்கள் MMS Travel Assistant. உங்களுக்கு எப்படி உதவ முடியும்?

📌 **உங்கள் Reference / Case ID:** \`${caseId}\`
(எங்கள் உதவி மையத்துடன் தொடர்புகொள்ள இந்த Case ID-ஐ பயன்படுத்தலாம்)

நாங்கள் **Madukkur** மற்றும் **Adirampattinam** கிளைகளில் **2020 முதல்** உங்கள் நம்பகமான Travel Partner.

❤️ **49K+ Happy Customers**`;
    }
    if (lang === 'tanglish') {
      return `Vanakkam! 👋 Welcome to MMS AIR TRAVELS!

Naan unga MMS Travel Assistant 🤖. Ungalukku eppadi help panna mudiyum?

📌 **Unga Reference / Case ID:** \`${caseId}\`
(Enga support team kitta share panni direct tracking pannalam)

Naanga **Madukkur** and **Adirampattinam** branches-la **2020 mudhal** unga Trusted Travel Partner.

❤️ **49K+ Happy Customers**`;
    }
    return `வணக்கம்! 👋 Welcome to MMS AIR TRAVELS!

I’m your **MMS Travel Assistant 🤖**. How can I assist your journey today?

📌 **Your Reference / Case ID:** \`${caseId}\`
*(Keep this Case ID handy for instant tracking with our support desk)*

Serving travelers from **Madukkur & Adirampattinam** branches **Since 2020**.

❤️ **49K+ Happy Customers**`;
  };

  const getMainQuickButtons = () => [
    { label: '📝 Send Common Inquiry', action: () => openCommonInquiry() },
    { label: '✈️ Flight Booking', action: () => startFlightFlow() },
    { label: '🚌 Bus Booking', action: () => startBusFlow() },
    { label: '🌍 Visa Enquiry', action: () => startVisaFlow() },
    { label: '🎫 Ticket Enquiry', action: () => startTicketFlow() },
    { label: '💰 Fare Enquiry', action: () => handleFareEnquiry() },
    { label: '🧳 Travel Services', action: () => handleTravelServices() },
    { label: '📍 Our Locations', action: () => handleLocations() },
    { label: '📞 Contact Us', action: () => handleContactUs() },
    { 
      label: '💬 WhatsApp Us', 
      action: () => {}, 
      href: `https://wa.me/91${CONTACT_NUMBERS.general.number}?text=${encodeURIComponent(`Hello MMS AIR TRAVELS, I have an inquiry [Case ID: ${caseId}]`)}`, 
      variant: 'whatsapp' as const 
    }
  ];

  // Initialize messages when component opens
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'welcome-1',
          sender: 'bot',
          text: getGreetingText(language),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          buttons: getMainQuickButtons()
        }
      ]);
    }
  }, []);

  // React to language change
  useEffect(() => {
    if (messages.length > 0 && currentFlow === 'idle') {
      appendBotMessage(
        language === 'ta' 
          ? `மொழி தமிழுக்கு மாற்றப்பட்டது. உங்கள் Case ID: ${caseId}. உங்கள் கேள்வி அல்லது தேவையை தேர்வு செய்யுங்கள்.` 
          : language === 'tanglish' 
          ? `Language Tanglish-ku change aagirukku. Case ID: ${caseId}. Keela irukkura options-la select pannunga.` 
          : `Language set to English. Case ID: ${caseId}. How may I assist your journey today?`,
        getMainQuickButtons()
      );
    }
  }, [language]);

  // Handle external intent or category trigger
  useEffect(() => {
    const trigger = initialIntent || initialCategory;
    if (trigger) {
      if (trigger === 'flight') startFlightFlow();
      else if (trigger === 'bus') startBusFlow();
      else if (trigger === 'visa') startVisaFlow();
      else if (trigger === 'ticket') startTicketFlow();
      else if (trigger === 'contact') handleContactUs();
      else if (trigger === 'enquiry') openCommonInquiry();
    }
  }, [initialIntent, initialCategory]);

  const appendUserMessage = (text: string) => {
    const newMsg: ChatMessage = {
      id: 'msg-' + Date.now() + '-' + Math.random(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, newMsg]);
  };

  const appendBotMessage = (text: string, buttons?: ChatMessage['buttons']) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const newMsg: ChatMessage = {
        id: 'msg-' + Date.now() + '-' + Math.random(),
        sender: 'bot',
        text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        buttons
      };
      setMessages(prev => [...prev, newMsg]);
    }, 400);
  };

  // Open Common Inquiry Flow / Form
  const openCommonInquiry = () => {
    setShowCommonInquiry(true);
  };

  const handleCommonInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commonInquiryData.name || !commonInquiryData.phone) return;

    setSubmittingInquiry(true);
    const enquiryPayload = {
      caseId,
      customerName: commonInquiryData.name,
      phone: commonInquiryData.phone,
      branch: commonInquiryData.branch,
      serviceType: commonInquiryData.service,
      notes: commonInquiryData.message || 'Common Inquiry submitted from MMS Travel Assistant',
      timestamp: new Date().toISOString()
    };

    try {
      // 1. Send to server endpoint
      await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(enquiryPayload)
      }).catch(() => null);

      // 2. Save locally for offline / backup
      try {
        const storedCases = JSON.parse(localStorage.getItem('mms_chat_cases') || '[]');
        localStorage.setItem('mms_chat_cases', JSON.stringify([enquiryPayload, ...storedCases]));
      } catch (err) {
        // ignore storage error
      }

      setInquirySuccess(true);
      setShowCommonInquiry(false);

      const branchPhone = commonInquiryData.branch === 'Madukkur'
        ? (commonInquiryData.service.includes('Ticket') ? '9500977442' : '9500567442')
        : (commonInquiryData.service.includes('Visa') ? '9384567442' : '9500567442');

      const waText = encodeURIComponent(
        `Hello MMS AIR TRAVELS (${commonInquiryData.branch} Branch),\n` +
        `I have submitted an inquiry:\n` +
        `• Case ID: ${caseId}\n` +
        `• Name: ${commonInquiryData.name}\n` +
        `• Phone: ${commonInquiryData.phone}\n` +
        `• Service: ${commonInquiryData.service}\n` +
        `• Details: ${commonInquiryData.message || 'General inquiry'}`
      );

      appendBotMessage(
        `✅ **Common Inquiry Registered Successfully!**\n\n` +
        `📌 **Reference / Case ID:** \`${caseId}\`\n` +
        `👤 **Name:** ${commonInquiryData.name}\n` +
        `📞 **Phone:** ${commonInquiryData.phone}\n` +
        `🏢 **Branch:** ${commonInquiryData.branch} Branch\n` +
        `🎯 **Service:** ${commonInquiryData.service}\n` +
        `📝 **Details:** ${commonInquiryData.message || 'Standard inquiry'}\n\n` +
        `Our executive desk has logged your case. For instant verification or urgent bookings, tap below to continue on WhatsApp:`,
        [
          {
            label: `💬 Send via WhatsApp (${commonInquiryData.branch})`,
            action: () => {},
            href: `https://wa.me/91${branchPhone}?text=${waText}`,
            variant: 'whatsapp'
          },
          {
            label: '📞 Call Desk Now',
            action: () => window.location.href = `tel:${branchPhone}`
          },
          {
            label: '📋 Copy Case ID',
            action: () => handleCopyCaseId()
          },
          {
            label: '🔄 New Enquiry',
            action: () => handleRestart()
          }
        ]
      );
    } finally {
      setSubmittingInquiry(false);
    }
  };

  // -------------------------------------------------------------
  // FLOW 1: FLIGHT BOOKING
  // -------------------------------------------------------------
  const startFlightFlow = () => {
    setCurrentFlow('flight_from');
    setFlowData(prev => ({
      ...prev,
      flight: { from: '', to: '', date: '', tripType: '', passengers: '', airline: '' }
    }));
    appendBotMessage(
      `✈️ **Flight Booking Inquiry [Case ID: ${caseId}]**\n\nWhere are you departing from?\n\n(e.g., Trichy TRZ, Chennai MAA, Madurai IXM, Coimbatore CJB, or type any city):`,
      [
        { label: 'Trichy (TRZ)', action: () => handleFlightFromSelect('Trichy (TRZ)') },
        { label: 'Chennai (MAA)', action: () => handleFlightFromSelect('Chennai (MAA)') },
        { label: 'Madurai (IXM)', action: () => handleFlightFromSelect('Madurai (IXM)') },
        { label: 'Coimbatore (CJB)', action: () => handleFlightFromSelect('Coimbatore (CJB)') },
        { label: 'Bangalore (BLR)', action: () => handleFlightFromSelect('Bangalore (BLR)') }
      ]
    );
  };

  const handleFlightFromSelect = (city: string) => {
    appendUserMessage(city);
    setFlowData(prev => ({ ...prev, flight: { ...prev.flight, from: city } }));
    setCurrentFlow('flight_to');
    appendBotMessage(
      `Where are you travelling to?\n\n(Select destination or type any city/airport):`,
      [
        { label: 'Dubai (DXB)', action: () => handleFlightToSelect('Dubai (DXB)') },
        { label: 'Sharjah (SHJ)', action: () => handleFlightToSelect('Sharjah (SHJ)') },
        { label: 'Singapore (SIN)', action: () => handleFlightToSelect('Singapore (SIN)') },
        { label: 'Kuala Lumpur (KUL)', action: () => handleFlightToSelect('Kuala Lumpur (KUL)') },
        { label: 'Kuwait (KWI)', action: () => handleFlightToSelect('Kuwait (KWI)') },
        { label: 'Doha (DOH)', action: () => handleFlightToSelect('Doha (DOH)') },
        { label: 'Jeddah (JED)', action: () => handleFlightToSelect('Jeddah (JED)') }
      ]
    );
  };

  const handleFlightToSelect = (city: string) => {
    appendUserMessage(city);
    setFlowData(prev => ({ ...prev, flight: { ...prev.flight, to: city } }));
    setCurrentFlow('flight_date');
    appendBotMessage(
      `What is your preferred travel date?\n\n(e.g., Tomorrow, 15 Oct, Next Month, or type your date):`,
      [
        { label: 'Tomorrow', action: () => handleFlightDateSelect('Tomorrow') },
        { label: 'This Weekend', action: () => handleFlightDateSelect('This Weekend') },
        { label: 'Next Week', action: () => handleFlightDateSelect('Next Week') },
        { label: 'Within 30 Days', action: () => handleFlightDateSelect('Within 30 Days') }
      ]
    );
  };

  const handleFlightDateSelect = (dateStr: string) => {
    appendUserMessage(dateStr);
    setFlowData(prev => ({ ...prev, flight: { ...prev.flight, date: dateStr } }));
    setCurrentFlow('flight_trip_type');
    appendBotMessage(
      `Is this a One-Way or Round-Trip journey?`,
      [
        { label: 'One Way', action: () => handleFlightTripTypeSelect('One Way') },
        { label: 'Round Trip', action: () => handleFlightTripTypeSelect('Round Trip') }
      ]
    );
  };

  const handleFlightTripTypeSelect = (tripType: string) => {
    appendUserMessage(tripType);
    setFlowData(prev => ({ ...prev, flight: { ...prev.flight, tripType } }));
    setCurrentFlow('flight_passengers');
    appendBotMessage(
      `How many passengers are traveling?`,
      [
        { label: '1 Adult', action: () => handleFlightPassengersSelect('1 Adult') },
        { label: '2 Adults', action: () => handleFlightPassengersSelect('2 Adults') },
        { label: 'Family (2 Adults + 1 Child)', action: () => handleFlightPassengersSelect('2 Adults + 1 Child') },
        { label: 'Group (4+ Pax)', action: () => handleFlightPassengersSelect('Group (4+ Pax)') }
      ]
    );
  };

  const handleFlightPassengersSelect = (passengers: string) => {
    appendUserMessage(passengers);
    setFlowData(prev => ({ ...prev, flight: { ...prev.flight, passengers } }));
    setCurrentFlow('flight_airline');
    appendBotMessage(
      `Do you have an airline preference?`,
      [
        { label: 'Any Airline (Best Fare)', action: () => completeFlightFlow('Any Airline') },
        { label: 'Air India Express', action: () => completeFlightFlow('Air India Express') },
        { label: 'IndiGo', action: () => completeFlightFlow('IndiGo') },
        { label: 'Air Arabia', action: () => completeFlightFlow('Air Arabia') },
        { label: 'Emirates / Qatar', action: () => completeFlightFlow('Emirates / Qatar Airways') },
        { label: 'Scoot / Batik', action: () => completeFlightFlow('Scoot / Batik Air') }
      ]
    );
  };

  const completeFlightFlow = (airline: string) => {
    appendUserMessage(airline);
    const finalData = {
      ...flowData.flight,
      airline
    };
    setCurrentFlow('idle');

    const summaryText = 
      `• Case ID: ${caseId}\n` +
      `• Route: ${finalData.from} ➔ ${finalData.to}\n` +
      `• Date: ${finalData.date}\n` +
      `• Trip Type: ${finalData.tripType}\n` +
      `• Passengers: ${finalData.passengers}\n` +
      `• Airline: ${airline}`;

    const waMsg = encodeURIComponent(
      `Hello MMS AIR TRAVELS,\nI need flight booking assistance:\n${summaryText}`
    );

    appendBotMessage(
      `**Flight Booking Enquiry Received! ✈️**\n\n` +
      `📌 **Reference / Case ID:** \`${caseId}\`\n` +
      `${summaryText}\n\n` +
      `Our ticket reservation desk is checking direct airline GDS seat availability and lowest group/retail fares.\n\n` +
      `Tap below to connect directly with our flight desk on WhatsApp:`,
      [
        {
          label: '📱 Continue on WhatsApp',
          action: () => {},
          href: `https://wa.me/91${CONTACT_NUMBERS.ticket.number}?text=${waMsg}`,
          variant: 'whatsapp'
        },
        {
          label: '📞 Call Ticket Desk (95009 77442)',
          action: () => window.location.href = CONTACT_NUMBERS.ticket.tel
        },
        {
          label: '📋 Copy Case ID',
          action: () => handleCopyCaseId()
        },
        {
          label: '🔄 New Enquiry',
          action: () => handleRestart()
        }
      ]
    );
  };

  // -------------------------------------------------------------
  // FLOW 2: BUS BOOKING
  // -------------------------------------------------------------
  const startBusFlow = () => {
    setCurrentFlow('bus_from');
    setFlowData(prev => ({
      ...prev,
      bus: { from: '', to: '', date: '', passengers: '', boarding: '' }
    }));
    appendBotMessage(
      `🚌 **Bus Booking Assistance [Case ID: ${caseId}]**\n\nWhere are you departing from?`,
      [
        { label: 'Madukkur', action: () => handleBusFromSelect('Madukkur') },
        { label: 'Adirampattinam', action: () => handleBusFromSelect('Adirampattinam') },
        { label: 'Pattukkottai', action: () => handleBusFromSelect('Pattukkottai') },
        { label: 'Chennai', action: () => handleBusFromSelect('Chennai') },
        { label: 'Bangalore', action: () => handleBusFromSelect('Bangalore') }
      ]
    );
  };

  const handleBusFromSelect = (fromCity: string) => {
    appendUserMessage(fromCity);
    setFlowData(prev => ({ ...prev, bus: { ...prev.bus, from: fromCity } }));
    setCurrentFlow('bus_to');
    appendBotMessage(
      `Where are you travelling to?`,
      [
        { label: 'Chennai (Koyambedu / Kilambakkam)', action: () => handleBusToSelect('Chennai') },
        { label: 'Bangalore (Silk Board / Majestic)', action: () => handleBusToSelect('Bangalore') },
        { label: 'Coimbatore', action: () => handleBusToSelect('Coimbatore') },
        { label: 'Tiruppur', action: () => handleBusToSelect('Tiruppur') },
        { label: 'Ernakulam / Cochin', action: () => handleBusToSelect('Cochin') }
      ]
    );
  };

  const handleBusToSelect = (toCity: string) => {
    appendUserMessage(toCity);
    setFlowData(prev => ({ ...prev, bus: { ...prev.bus, to: toCity } }));
    setCurrentFlow('bus_date');
    appendBotMessage(
      `When do you want to travel?`,
      [
        { label: 'Tonight', action: () => handleBusDateSelect('Tonight') },
        { label: 'Tomorrow', action: () => handleBusDateSelect('Tomorrow') },
        { label: 'This Friday', action: () => handleBusDateSelect('This Friday') },
        { label: 'This Sunday', action: () => handleBusDateSelect('This Sunday') }
      ]
    );
  };

  const handleBusDateSelect = (dateStr: string) => {
    appendUserMessage(dateStr);
    setFlowData(prev => ({ ...prev, bus: { ...prev.bus, date: dateStr } }));
    setCurrentFlow('bus_passengers');
    appendBotMessage(
      `How many seats do you need?`,
      [
        { label: '1 Seat', action: () => handleBusPassengersSelect('1 Seat') },
        { label: '2 Seats', action: () => handleBusPassengersSelect('2 Seats') },
        { label: '3 Seats', action: () => handleBusPassengersSelect('3 Seats') },
        { label: '4+ Seats', action: () => handleBusPassengersSelect('4+ Seats') }
      ]
    );
  };

  const handleBusPassengersSelect = (passengers: string) => {
    appendUserMessage(passengers);
    setFlowData(prev => ({ ...prev, bus: { ...prev.bus, passengers } }));
    setCurrentFlow('bus_boarding');
    appendBotMessage(
      `Preferred boarding point:`,
      [
        { label: 'Madukkur Bus Stand', action: () => completeBusFlow('Madukkur Bus Stand') },
        { label: 'Adirampattinam', action: () => completeBusFlow('Adirampattinam') },
        { label: 'Pattukkottai', action: () => completeBusFlow('Pattukkottai') },
        { label: 'No Preference', action: () => completeBusFlow('No Preference') }
      ]
    );
  };

  const completeBusFlow = (boarding: string) => {
    appendUserMessage(boarding);
    const finalData = {
      ...flowData.bus,
      boarding
    };
    setCurrentFlow('idle');

    const waMsg = encodeURIComponent(
      `Hello MMS AIR TRAVELS, I need bus booking assistance:\n` +
      `• Case ID: ${caseId}\n` +
      `• From: ${finalData.from}\n` +
      `• To: ${finalData.to}\n` +
      `• Date: ${finalData.date}\n` +
      `• Passengers: ${finalData.passengers}\n` +
      `• Boarding Point: ${boarding}`
    );

    appendBotMessage(
      `**Bus Booking Enquiry Received! 🚌**\n\n` +
      `📌 **Reference / Case ID:** \`${caseId}\`\n` +
      `• From: ${finalData.from}\n` +
      `• To: ${finalData.to}\n` +
      `• Date: ${finalData.date}\n` +
      `• Passengers: ${finalData.passengers}\n` +
      `• Boarding: ${boarding}\n\n` +
      `Our team will check available AC Sleeper, Semi-Sleeper, and Volvo buses for your sector.`,
      [
        {
          label: '📱 WhatsApp MMS AIR TRAVELS',
          action: () => {},
          href: `https://wa.me/91${CONTACT_NUMBERS.services.number}?text=${waMsg}`,
          variant: 'whatsapp'
        },
        {
          label: '📞 Call Bus Desk (63690 12360)',
          action: () => window.location.href = CONTACT_NUMBERS.services.tel
        },
        {
          label: '🔄 New Enquiry',
          action: () => handleRestart()
        }
      ]
    );
  };

  // -------------------------------------------------------------
  // FLOW 3: VISA ENQUIRY
  // -------------------------------------------------------------
  const startVisaFlow = () => {
    setCurrentFlow('visa_country');
    setFlowData(prev => ({
      ...prev,
      visa: { country: '', purpose: '', date: '', visaType: '' }
    }));
    appendBotMessage(
      `🌍 **Worldwide Visa Services [Case ID: ${caseId}]**\n\nWhich country do you need a visa for?`,
      [
        { label: 'Dubai / UAE (24H Express)', action: () => handleVisaCountrySelect('Dubai / UAE') },
        { label: 'Saudi Arabia (Tourist/Umrah)', action: () => handleVisaCountrySelect('Saudi Arabia') },
        { label: 'Singapore', action: () => handleVisaCountrySelect('Singapore') },
        { label: 'Malaysia (eNTRI/eVISA)', action: () => handleVisaCountrySelect('Malaysia') },
        { label: 'Qatar / Oman / Bahrain / Kuwait', action: () => handleVisaCountrySelect('GCC Countries') },
        { label: 'Schengen / UK / USA', action: () => handleVisaCountrySelect('Europe/UK/USA') }
      ]
    );
  };

  const handleVisaCountrySelect = (country: string) => {
    appendUserMessage(country);
    setFlowData(prev => ({ ...prev, visa: { ...prev.visa, country } }));
    setCurrentFlow('visa_purpose');
    appendBotMessage(
      `What is the purpose of your travel?`,
      [
        { label: 'Tourist / Holiday', action: () => handleVisaPurposeSelect('Tourist') },
        { label: 'Business / Conference', action: () => handleVisaPurposeSelect('Business') },
        { label: 'Family / Friends Visit', action: () => handleVisaPurposeSelect('Family Visit') },
        { label: 'Employment / Work', action: () => handleVisaPurposeSelect('Employment') }
      ]
    );
  };

  const handleVisaPurposeSelect = (purpose: string) => {
    appendUserMessage(purpose);
    setFlowData(prev => ({ ...prev, visa: { ...prev.visa, purpose } }));
    setCurrentFlow('visa_date');
    appendBotMessage(
      `When do you plan to travel?`,
      [
        { label: 'Urgent (Within 3 Days)', action: () => handleVisaDateSelect('Urgent (Within 3 Days)') },
        { label: 'Next Week', action: () => handleVisaDateSelect('Next Week') },
        { label: 'This Month', action: () => handleVisaDateSelect('This Month') },
        { label: 'Next Month', action: () => handleVisaDateSelect('Next Month') }
      ]
    );
  };

  const handleVisaDateSelect = (dateStr: string) => {
    appendUserMessage(dateStr);
    setFlowData(prev => ({ ...prev, visa: { ...prev.visa, date: dateStr } }));
    setCurrentFlow('visa_type');
    appendBotMessage(
      `Which visa duration do you need?`,
      [
        { label: '30 Days Tourist', action: () => completeVisaFlow('30 Days Tourist') },
        { label: '60 Days Tourist', action: () => completeVisaFlow('60 Days Tourist') },
        { label: 'Multi-Entry Visa', action: () => completeVisaFlow('Multi-Entry') },
        { label: 'Not Sure (Need Advice)', action: () => completeVisaFlow('Advice Needed') }
      ]
    );
  };

  const completeVisaFlow = (visaType: string) => {
    appendUserMessage(visaType);
    const finalData = {
      ...flowData.visa,
      visaType
    };
    setCurrentFlow('idle');

    const waMsg = encodeURIComponent(
      `Hello MMS AIR TRAVELS,\nI need visa assistance:\n` +
      `• Case ID: ${caseId}\n` +
      `• Country: ${finalData.country}\n` +
      `• Purpose: ${finalData.purpose}\n` +
      `• Planned Travel: ${finalData.date}\n` +
      `• Visa Category: ${visaType}`
    );

    appendBotMessage(
      `**Visa Consultation Request Received! 🌍**\n\n` +
      `📌 **Reference / Case ID:** \`${caseId}\`\n` +
      `• Country: ${finalData.country}\n` +
      `• Purpose: ${finalData.purpose}\n` +
      `• Planned Date: ${finalData.date}\n` +
      `• Duration: ${visaType}\n\n` +
      `Our specialized visa desk will provide document checklists, embassy guidelines, and expedited processing assistance.`,
      [
        {
          label: '📱 Get Visa Assistance on WhatsApp',
          action: () => {},
          href: `https://wa.me/91${CONTACT_NUMBERS.visa.number}?text=${waMsg}`,
          variant: 'whatsapp'
        },
        {
          label: '📞 Call Visa Desk (93845 67442)',
          action: () => window.location.href = CONTACT_NUMBERS.visa.tel
        },
        {
          label: '🔄 New Enquiry',
          action: () => handleRestart()
        }
      ]
    );
  };

  // -------------------------------------------------------------
  // FLOW 4: TICKET ENQUIRY
  // -------------------------------------------------------------
  const startTicketFlow = () => {
    setCurrentFlow('ticket_pnr');
    setFlowData(prev => ({
      ...prev,
      ticket: { pnr: '', issue: '' }
    }));
    appendBotMessage(
      `🎫 **Ticket Support Desk [Case ID: ${caseId}]**\n\nPlease enter your Airline PNR or Booking Reference number (or type "None" if booking new ticket):`
    );
  };

  const completeTicketFlow = (issue: string) => {
    appendUserMessage(issue);
    setCurrentFlow('idle');

    const waMsg = encodeURIComponent(
      `Hello MMS AIR TRAVELS,\nI need ticket assistance:\n` +
      `• Case ID: ${caseId}\n` +
      `• PNR/Reference: ${flowData.ticket.pnr || 'Not provided'}\n` +
      `• Request: ${issue}`
    );

    appendBotMessage(
      `**Ticket Request Logged! 🎫**\n\n` +
      `📌 **Reference / Case ID:** \`${caseId}\`\n` +
      `• **PNR / Ref:** ${flowData.ticket.pnr || 'None'}\n` +
      `• **Service:** ${issue}\n\n` +
      `Our airline reservation officers will inspect your ticket rules on the reservation system.`,
      [
        {
          label: '📱 Continue on WhatsApp',
          action: () => {},
          href: `https://wa.me/91${CONTACT_NUMBERS.ticket.number}?text=${waMsg}`,
          variant: 'whatsapp'
        },
        {
          label: '📞 Call Ticket Desk (95009 77442)',
          action: () => window.location.href = CONTACT_NUMBERS.ticket.tel
        },
        {
          label: '🔄 New Enquiry',
          action: () => handleRestart()
        }
      ]
    );
  };

  // -------------------------------------------------------------
  // FARE ENQUIRY
  // -------------------------------------------------------------
  const handleFareEnquiry = () => {
    appendBotMessage(
      `💰 **Fare Information & Wholesale Group Fares**\n\n` +
      `📌 **Your Case ID:** \`${caseId}\`\n\n` +
      `We offer:\n` +
      `• Direct Airline GDS Ticketing (Zero Hidden Fees)\n` +
      `• Gulf Wholesale Group Fares (DXB, SHJ, DOH, KWI, JED)\n` +
      `• South East Asia Group Deals (KUL, SIN, BKK)\n\n` +
      `Would you like to check specific flight fares?`,
      [
        { label: '✈️ Search Flight Fares', action: () => startFlightFlow() },
        { label: '📝 Submit Common Inquiry', action: () => openCommonInquiry() },
        { 
          label: '💬 Chat with Fare Desk', 
          action: () => {}, 
          href: `https://wa.me/91${CONTACT_NUMBERS.ticket.number}?text=${encodeURIComponent(`Hello MMS AIR TRAVELS, I want to inquire about lowest fares [Case ID: ${caseId}]`)}`,
          variant: 'whatsapp'
        }
      ]
    );
  };

  // -------------------------------------------------------------
  // TRAVEL SERVICES
  // -------------------------------------------------------------
  const handleTravelServices = () => {
    appendBotMessage(
      `🧳 **Comprehensive Travel & Allied Services**\n\n` +
      `📌 **Case ID:** \`${caseId}\`\n\n` +
      `MMS AIR TRAVELS provides end-to-end travel solutions:\n` +
      `• ✈️ International & Domestic Flight Tickets\n` +
      `• 🌍 UAE, Gulf & Worldwide Visa Assistance\n` +
      `• 🚌 Intercity Luxury Bus Bookings\n` +
      `• 📦 Air Cargo Freight & Logistics\n` +
      `• 🛂 Passport Seva & Document Verification\n` +
      `• 🕌 Haj & Umrah Pilgrimage Packages\n` +
      `• 🛡️ Travel Insurance & Forex Guidance`,
      [
        { label: '📝 Send Common Inquiry', action: () => openCommonInquiry() },
        { label: '✈️ Flight Booking', action: () => startFlightFlow() },
        { label: '🌍 Visa Services', action: () => startVisaFlow() },
        { label: '🚌 Bus Booking', action: () => startBusFlow() },
        { label: '📞 Contact Us', action: () => handleContactUs() }
      ]
    );
  };

  // -------------------------------------------------------------
  // LOCATIONS
  // -------------------------------------------------------------
  const handleLocations = () => {
    appendBotMessage(
      `📍 **MMS AIR TRAVELS Branches – Since 2020**\n\n` +
      `🏢 **1. Madukkur Branch**\n` +
      `• ${LOCATIONS.madukkur.address}\n` +
      `• General Inquiry: +91 95005 67442\n` +
      `• Ticket Booking: +91 95009 77442\n` +
      `• Other Services: +91 63690 12360\n\n` +
      `🏢 **2. Adirampattinam Branch**\n` +
      `• ${LOCATIONS.adirampattinam.address}\n` +
      `• General Inquiry: +91 95005 67442\n` +
      `• Visa & Booking: +91 93845 67442\n` +
      `• Other Services: +91 63690 12360\n\n` +
      `❤️ **49K+ Happy Customers**`,
      [
        { 
          label: '📍 Madukkur Map', 
          action: () => window.open(LOCATIONS.madukkur.mapsUrl, '_blank') 
        },
        { 
          label: '📍 Adirampattinam Map', 
          action: () => window.open(LOCATIONS.adirampattinam.mapsUrl, '_blank') 
        },
        { 
          label: '📞 Call Madukkur Desk', 
          action: () => window.location.href = 'tel:9500977442' 
        },
        { 
          label: '📞 Call Adirampattinam Desk', 
          action: () => window.location.href = 'tel:9384567442' 
        },
        { 
          label: '💬 WhatsApp Us', 
          action: () => {}, 
          href: `https://wa.me/91${CONTACT_NUMBERS.general.number}?text=${encodeURIComponent(`Hello MMS AIR TRAVELS, I have a query regarding your branches [Case ID: ${caseId}]`)}`, 
          variant: 'whatsapp' 
        }
      ]
    );
  };

  // -------------------------------------------------------------
  // CONTACT US
  // -------------------------------------------------------------
  const handleContactUs = () => {
    appendBotMessage(
      `📞 **Direct Contact Desks – MMS AIR TRAVELS**\n\n` +
      `📌 **Reference / Case ID:** \`${caseId}\`\n\n` +
      `• 🌐 **General Inquiry**: +91 95005 67442\n` +
      `• ✈️ **Flight Ticket Desk**: +91 95009 77442\n` +
      `• 🌍 **Visa Services**: +91 93845 67442\n` +
      `• 📦 **Other Services**: +91 63690 12360\n` +
      `• 📧 **Email**: mmsairtravels@gmail.com\n\n` +
      `📍 **Madukkur & Adirampattinam – Since 2020**`,
      [
        { 
          label: '📝 Send Common Inquiry', 
          action: () => openCommonInquiry() 
        },
        { 
          label: '📞 Call General (95005 67442)', 
          action: () => window.location.href = 'tel:9500567442' 
        },
        { 
          label: '📞 Call Tickets (95009 77442)', 
          action: () => window.location.href = 'tel:9500977442' 
        },
        { 
          label: '📞 Call Visa (93845 67442)', 
          action: () => window.location.href = 'tel:9384567442' 
        },
        { 
          label: '💬 WhatsApp Support', 
          action: () => {}, 
          href: `https://wa.me/91${CONTACT_NUMBERS.general.number}?text=${encodeURIComponent(`Hello MMS AIR TRAVELS, I need support [Case ID: ${caseId}]`)}`, 
          variant: 'whatsapp' 
        }
      ]
    );
  };

  // -------------------------------------------------------------
  // FALLBACK & TEXT INPUT PARSER
  // -------------------------------------------------------------
  const handleSend = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    appendUserMessage(text);
    setInputText('');

    const lower = text.toLowerCase();

    // Guided flows
    if (currentFlow === 'flight_from') {
      handleFlightFromSelect(text);
      return;
    }
    if (currentFlow === 'flight_to') {
      handleFlightToSelect(text);
      return;
    }
    if (currentFlow === 'flight_date') {
      handleFlightDateSelect(text);
      return;
    }
    if (currentFlow === 'flight_trip_type') {
      handleFlightTripTypeSelect(text);
      return;
    }
    if (currentFlow === 'flight_passengers') {
      handleFlightPassengersSelect(text);
      return;
    }
    if (currentFlow === 'flight_airline') {
      completeFlightFlow(text);
      return;
    }

    if (currentFlow === 'bus_from') {
      handleBusFromSelect(text);
      return;
    }
    if (currentFlow === 'bus_to') {
      handleBusToSelect(text);
      return;
    }
    if (currentFlow === 'bus_date') {
      handleBusDateSelect(text);
      return;
    }
    if (currentFlow === 'bus_passengers') {
      handleBusPassengersSelect(text);
      return;
    }
    if (currentFlow === 'bus_boarding') {
      completeBusFlow(text);
      return;
    }

    if (currentFlow === 'visa_country') {
      handleVisaCountrySelect(text);
      return;
    }
    if (currentFlow === 'visa_purpose') {
      handleVisaPurposeSelect(text);
      return;
    }
    if (currentFlow === 'visa_date') {
      handleVisaDateSelect(text);
      return;
    }
    if (currentFlow === 'visa_type') {
      completeVisaFlow(text);
      return;
    }

    if (currentFlow === 'ticket_pnr') {
      setFlowData(prev => ({ ...prev, ticket: { ...prev.ticket, pnr: text } }));
      setCurrentFlow('ticket_issue');
      appendBotMessage(`What assistance do you need with ticket **${text}**?`, [
        { label: 'Date Change', action: () => completeTicketFlow('Date Change') },
        { label: 'Cancellation / Refund', action: () => completeTicketFlow('Cancellation') },
        { label: 'Baggage Allowance', action: () => completeTicketFlow('Baggage Allowance') },
        { label: 'Name Correction', action: () => completeTicketFlow('Name Correction') },
        { label: 'Other Issue', action: () => completeTicketFlow('Other Issue') }
      ]);
      return;
    }

    // Keyword detection
    if (lower.includes('inquiry') || lower.includes('common') || lower.includes('enquiry') || lower.includes('கேள்வி')) {
      openCommonInquiry();
      return;
    }
    if (lower.includes('flight') || lower.includes('airline') || lower.includes('fly') || lower.includes('விமானம்')) {
      startFlightFlow();
      return;
    }
    if (lower.includes('bus') || lower.includes('பேருந்து') || lower.includes('travels bus')) {
      startBusFlow();
      return;
    }
    if (lower.includes('visa') || lower.includes('விசா') || lower.includes('dubai visa')) {
      startVisaFlow();
      return;
    }
    if (lower.includes('ticket') || lower.includes('pnr') || lower.includes('டிக்கெட்')) {
      startTicketFlow();
      return;
    }
    if (lower.includes('phone') || lower.includes('number') || lower.includes('contact') || lower.includes('call') || lower.includes('தொடர்பு')) {
      handleContactUs();
      return;
    }
    if (lower.includes('address') || lower.includes('location') || lower.includes('branch') || lower.includes('madukkur') || lower.includes('adiram')) {
      handleLocations();
      return;
    }

    // Default Fallback
    appendBotMessage(
      language === 'ta'
        ? `உங்கள் செய்தியை பதிவு செய்துள்ளோம். கீழ்கண்ட தேர்வுகளில் உங்களுக்கு தேவையான சேவையை தேர்ந்தெடுக்கவும்:`
        : language === 'tanglish'
        ? `Unga query receive aagirukku. Keela irukura options-la choose pannunga:`
        : `I've received your note! Please select a category below or submit a common inquiry:`,
      getMainQuickButtons()
    );
  };

  const handleRestart = () => {
    setCurrentFlow('idle');
    setShowCommonInquiry(false);
    setFlowData({
      flight: { from: '', to: '', date: '', tripType: '', passengers: '', airline: '' },
      bus: { from: '', to: '', date: '', passengers: '', boarding: '' },
      visa: { country: '', purpose: '', date: '', visaType: '' },
      ticket: { pnr: '', issue: '' }
    });
    appendBotMessage(
      getGreetingText(language),
      getMainQuickButtons()
    );
  };

  // Launcher button when assistant is closed
  if (!isOpen) {
    return (
      <button
        id="mms-chatbot-launcher"
        type="button"
        onClick={() => {
          if (onOpen) onOpen();
          else onClose();
        }}
        aria-label="Open MMS Travel Assistant"
        className="fixed bottom-20 sm:bottom-6 right-3 sm:right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-[#006097] to-[#007abd] hover:from-[#004f7c] hover:to-[#006097] text-white font-bold text-xs sm:text-sm shadow-2xl shadow-[#006097]/40 border-2 border-white/30 transition-all duration-200 transform hover:scale-105 active:scale-95 cursor-pointer group"
      >
        <div className="relative">
          <span className="w-3 h-3 rounded-full bg-emerald-400 absolute -top-0.5 -right-0.5 animate-ping opacity-75"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 absolute -top-0.5 -right-0.5"></span>
          <Bot className="w-5 h-5 text-amber-300 transition-transform group-hover:rotate-12" />
        </div>
        <span className="tracking-wide">MMS Travel Assistant 🤖</span>
        <span className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-white/20 text-[10px] font-mono">
          Online
        </span>
      </button>
    );
  }

  return (
    <aside 
      aria-label="MMS Travel Assistant AI Chatbot"
      className="fixed bottom-20 sm:bottom-6 right-2 sm:right-6 z-50 w-[calc(100vw-16px)] sm:w-[410px] h-[580px] max-h-[78vh] sm:max-h-[82vh] bg-white rounded-3xl shadow-2xl border border-blue-200/80 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300 ease-out"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-[#082c74] via-[#006097] to-[#082c74] text-white p-3.5 flex items-center justify-between shadow-md select-none shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="relative w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center border border-white/20 shadow-inner">
            <Bot className="w-5 h-5 text-amber-300" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 absolute bottom-0 right-0 border-2 border-[#082c74]"></span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="font-bold text-xs sm:text-sm tracking-wide text-white">
                MMS Travel Assistant
              </h4>
              <span className="text-[10px] bg-amber-400 text-slate-900 font-bold px-1.5 py-0.2 rounded">
                AI
              </span>
            </div>
            <p className="text-[10px] text-blue-100/90 font-medium">
              Madukkur & Adirampattinam • Since 2020
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Case ID Reference Pill */}
          <button
            onClick={handleCopyCaseId}
            title="Click to copy your Case ID for tracking"
            className="hidden xs:flex items-center gap-1 bg-white/15 hover:bg-white/25 px-2 py-1 rounded-md text-[10px] font-mono text-amber-300 border border-white/20 active:scale-95 transition-transform cursor-pointer"
          >
            <span>{caseId}</span>
            {copiedCaseId ? <Check className="w-3 h-3 text-emerald-300" /> : <Copy className="w-3 h-3 text-white/80" />}
          </button>

          {/* Language Switcher */}
          <div className="flex items-center bg-white/10 rounded-lg p-0.5 text-[10px] font-bold border border-white/15">
            <button
              onClick={() => setLanguage('en')}
              className={`px-1.5 py-0.5 rounded transition-all active:scale-95 ${language === 'en' ? 'bg-white text-slate-900 shadow-xs' : 'text-white/80 hover:text-white'}`}
              title="English"
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('ta')}
              className={`px-1.5 py-0.5 rounded transition-all active:scale-95 ${language === 'ta' ? 'bg-white text-slate-900 shadow-xs' : 'text-white/80 hover:text-white'}`}
              title="தமிழ்"
            >
              தமிழ்
            </button>
            <button
              onClick={() => setLanguage('tanglish')}
              className={`px-1.5 py-0.5 rounded transition-all active:scale-95 ${language === 'tanglish' ? 'bg-white text-slate-900 shadow-xs' : 'text-white/80 hover:text-white'}`}
              title="Tanglish"
            >
              Tang
            </button>
          </div>

          <button
            onClick={handleRestart}
            title="Restart Chat"
            className="p-1.5 rounded-lg hover:bg-white/15 text-white/80 hover:text-white active:scale-90 transition-transform cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onClose}
            title="Minimize Assistant"
            className="p-1.5 rounded-lg hover:bg-white/15 text-white/80 hover:text-white active:scale-90 transition-transform cursor-pointer"
          >
            <Minimize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Sub-strip with Case ID & Quick Common Inquiry Shortcut */}
      <div className="bg-slate-50 px-3 py-1.5 border-b border-slate-200/80 flex items-center justify-between text-[11px] text-slate-600 font-medium shrink-0">
        <div className="flex items-center gap-1.5 truncate">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
          <span className="truncate">Case Ref: <strong className="text-slate-900 font-mono">{caseId}</strong></span>
          <button 
            onClick={handleCopyCaseId}
            className="text-[10px] text-[#006097] hover:underline font-bold active:scale-95 cursor-pointer ml-1"
          >
            {copiedCaseId ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <button
          onClick={openCommonInquiry}
          className="text-xs bg-[#006097] hover:bg-[#004f7c] text-white px-2.5 py-1 rounded-full font-bold flex items-center gap-1 shadow-xs active:scale-95 transition-transform cursor-pointer shrink-0"
        >
          <FileText className="w-3 h-3" />
          <span>Common Inquiry</span>
        </button>
      </div>

      {/* Messages / Interactive Content Area */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-3.5 space-y-3 bg-[#f8fafc]/60 text-xs relative"
      >
        {/* Common Inquiry Interactive Form (Modal Overlay inside chat) */}
        {showCommonInquiry && (
          <div className="bg-white border-2 border-blue-400/80 rounded-2xl p-4 shadow-lg mb-3 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
              <div className="flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-[#006097]" />
                <h5 className="font-bold text-slate-900 text-xs">Send Common Inquiry</h5>
              </div>
              <button
                type="button"
                onClick={() => setShowCommonInquiry(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg active:scale-90"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <form onSubmit={handleCommonInquirySubmit} className="space-y-2.5">
              <div className="text-[10px] bg-blue-50 text-blue-900 p-2 rounded-lg font-mono flex items-center justify-between">
                <span>Case Reference ID:</span>
                <strong>{caseId}</strong>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mohamed Ali"
                  value={commonInquiryData.name}
                  onChange={(e) => setCommonInquiryData({ ...commonInquiryData, name: e.target.value })}
                  className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:border-[#006097]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">
                  Mobile Number (Calling & WhatsApp) *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 9500567442"
                  value={commonInquiryData.phone}
                  onChange={(e) => setCommonInquiryData({ ...commonInquiryData, phone: e.target.value })}
                  className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:border-[#006097]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">
                    Branch *
                  </label>
                  <select
                    value={commonInquiryData.branch}
                    onChange={(e) => setCommonInquiryData({ ...commonInquiryData, branch: e.target.value })}
                    className="w-full text-xs px-2 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:border-[#006097] bg-white"
                  >
                    <option value="Madukkur">Madukkur</option>
                    <option value="Adirampattinam">Adirampattinam</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">
                    Service Required *
                  </label>
                  <select
                    value={commonInquiryData.service}
                    onChange={(e) => setCommonInquiryData({ ...commonInquiryData, service: e.target.value })}
                    className="w-full text-xs px-2 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:border-[#006097] bg-white"
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Flight Ticket Booking">Flight Ticket</option>
                    <option value="Visa Assistance">Visa Assistance</option>
                    <option value="Bus Booking">Bus Booking</option>
                    <option value="Other Travel Services">Other Services</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">
                  Inquiry Details / Travel Dates
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Need flight quotation from Trichy to Dubai for next week"
                  value={commonInquiryData.message}
                  onChange={(e) => setCommonInquiryData({ ...commonInquiryData, message: e.target.value })}
                  className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:border-[#006097] resize-none"
                />
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="submit"
                  disabled={submittingInquiry}
                  className="flex-1 py-2 px-3 rounded-xl bg-[#006097] hover:bg-[#004f7c] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submittingInquiry ? 'Sending...' : 'Submit Inquiry'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowCommonInquiry(false)}
                  className="py-2 px-3 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold text-xs active:scale-95 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Message Bubble Stream */}
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} space-y-1.5 animate-in fade-in duration-200`}
          >
            <div 
              className={`max-w-[86%] rounded-2xl px-3.5 py-2.5 text-xs shadow-xs leading-relaxed whitespace-pre-line ${
                msg.sender === 'user'
                  ? 'bg-[#006097] text-white rounded-br-none'
                  : 'bg-white text-slate-800 border border-slate-200/90 rounded-bl-none'
              }`}
            >
              {msg.text}
            </div>

            {/* Action Buttons Attached to Bot Response */}
            {msg.buttons && msg.buttons.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1 max-w-[95%]">
                {msg.buttons.map((btn, bIdx) => {
                  if (btn.href) {
                    return (
                      <a
                        key={bIdx}
                        href={btn.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center gap-1 px-3 py-2 rounded-xl text-[11px] font-bold transition-all shadow-xs active:scale-95 cursor-pointer ${
                          btn.variant === 'whatsapp'
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                            : 'bg-[#006097] hover:bg-[#004f7c] text-white'
                        }`}
                      >
                        {btn.variant === 'whatsapp' && <MessageSquare className="w-3.5 h-3.5" />}
                        <span>{btn.label}</span>
                        <ExternalLink className="w-2.5 h-2.5 opacity-80" />
                      </a>
                    );
                  }
                  return (
                    <button
                      key={bIdx}
                      onClick={btn.action}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-[11px] font-bold bg-white hover:bg-blue-50 text-slate-800 border border-slate-300 hover:border-[#006097] hover:text-[#006097] transition-all shadow-xs active:scale-95 cursor-pointer"
                    >
                      <span>{btn.label}</span>
                    </button>
                  );
                })}
              </div>
            )}

            <span className="text-[9px] text-slate-400 px-1">
              {msg.timestamp}
            </span>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-2xl rounded-bl-none px-3.5 py-2 w-fit shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.2s]"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.4s]"></span>
          </div>
        )}

        <div ref={messagesEndRef} />

        {/* Floating Scroll Controls (Smooth Scroll Up & Down Animation) */}
        <div className="sticky bottom-2 flex justify-end gap-1.5 pointer-events-none pr-1">
          <button
            type="button"
            onClick={scrollToTop}
            title="Scroll to Top"
            aria-label="Scroll to Top"
            className="pointer-events-auto w-7 h-7 rounded-full bg-white/90 backdrop-blur-md shadow-md border border-slate-300 flex items-center justify-center text-slate-700 hover:text-[#006097] hover:bg-white active:scale-90 transition-all duration-150 cursor-pointer"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={scrollToBottom}
            title="Scroll to Bottom"
            aria-label="Scroll to Bottom"
            className="pointer-events-auto w-7 h-7 rounded-full bg-white/90 backdrop-blur-md shadow-md border border-slate-300 flex items-center justify-center text-slate-700 hover:text-[#006097] hover:bg-white active:scale-90 transition-all duration-150 cursor-pointer"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Input Bar */}
      <form 
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-2.5 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0"
      >
        <button
          type="button"
          onClick={openCommonInquiry}
          title="Send Common Inquiry"
          className="p-2 rounded-xl bg-blue-50 text-[#006097] hover:bg-blue-100 active:scale-90 transition-transform cursor-pointer shrink-0"
        >
          <FileText className="w-4 h-4" />
        </button>

        <input 
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={
            language === 'ta' 
              ? 'உங்கள் கேள்வியை தட்டச்சு செய்யவும்...' 
              : language === 'tanglish'
              ? 'Type panlaam (e.g. Dubai flight ticket)...'
              : 'Type here (e.g. Flight to Dubai, Bus to Chennai)...'
          }
          className="flex-1 bg-slate-100 focus:bg-white text-xs text-slate-800 rounded-xl px-3 py-2.5 border border-transparent focus:border-[#006097] focus:outline-none transition-all placeholder:text-slate-400"
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="p-2.5 rounded-xl bg-[#006097] hover:bg-[#004f7c] disabled:opacity-40 text-white active:scale-95 transition-transform cursor-pointer shadow-xs shrink-0"
          title="Send message"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </aside>
  );
};
