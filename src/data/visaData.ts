import { VisaService } from '../types';

export const VISA_SERVICES: VisaService[] = [
  {
    id: 'visa-uae-dubai',
    country: 'United Arab Emirates (Dubai)',
    flagEmoji: '🇦🇪',
    visaType: '30 Days / 60 Days Tourist E-Visa',
    processingTime: '24 - 48 Hours',
    validity: '60 Days from issuance',
    stayPeriod: '30 or 60 Days Single/Multiple',
    feeINR: 6500,
    documents: [
      'Original Passport front and back scan (6 months validity)',
      'White background passport size color photograph',
      'Confirmed return flight ticket',
      'PAN card copy of applicant / sponsor'
    ],
    description: 'Express electronic visa for tourism, business visits, transit, and family meet-ups in Dubai, Abu Dhabi, Sharjah, and across the UAE with 99.8% approval rate.'
  },
  {
    id: 'visa-singapore',
    country: 'Singapore',
    flagEmoji: '🇸🇬',
    visaType: '30 Days Multiple Entry E-Visa',
    processingTime: '3 - 4 Working Days',
    validity: 'Up to 2 Years Multiple Entry',
    stayPeriod: 'Up to 30 Days per entry',
    feeINR: 2800,
    documents: [
      'Original Passport copy with minimum 6 months validity',
      'ICA standard photo (35mm x 45mm, matte finish, 80% face view)',
      'Form 14A duly completed and signed',
      'Last 3 months bank statement attested with minimum balance of ₹50,000',
      'Confirmed return flight tickets and hotel vouchers'
    ],
    description: 'Authorized Singapore ICA e-Visa submission with fast track processing for vacation, medical, and business travelers.'
  },
  {
    id: 'visa-thailand',
    country: 'Thailand',
    flagEmoji: '🇹🇭',
    visaType: 'Tourist E-Visa / Visa on Arrival Assistance',
    processingTime: '2 - 3 Working Days',
    validity: '90 Days',
    stayPeriod: 'Up to 60 Days',
    feeINR: 3200,
    documents: [
      'Valid Passport with at least 2 blank pages',
      'Recent photo against white backdrop (4x6 cm)',
      'Bank statement showing minimum ₹50,000 balance for single applicant',
      'Proof of accommodation and return travel reservation'
    ],
    description: 'Seamless Thailand tourist visa application and fast-track immigration clearance pass service at Bangkok Suvarnabhumi & Don Mueang airports.'
  },
  {
    id: 'visa-saudi-arabia',
    country: 'Saudi Arabia (Umrah & Tourist)',
    flagEmoji: '🇸🇦',
    visaType: '1 Year Multiple Entry E-Tourist / Umrah Visa',
    processingTime: 'Instant (1 - 2 Hours)',
    validity: '1 Year Multiple Entry',
    stayPeriod: '90 Days per visit',
    feeINR: 11500,
    documents: [
      'Scanned copy of passport bio-data page',
      'Passport size digital photograph with white background',
      'Mandatory COVID/Medical health insurance (included in fee)'
    ],
    description: 'Instant official Saudi tourist & Umrah electronic visa permitting travel to Makkah, Madinah, Riyadh, Jeddah, and across KSA with complete medical insurance coverage.'
  },
  {
    id: 'visa-uk',
    country: 'United Kingdom (UK)',
    flagEmoji: '🇬🇧',
    visaType: 'Standard Visitor Visa (6 Months / 2 Years)',
    processingTime: '15 Working Days',
    validity: '6 Months, 2 Years, or 5 Years',
    stayPeriod: 'Up to 180 Days',
    feeINR: 12900,
    documents: [
      'Current passport and old passports if any',
      'Last 6 months salary slips and bank statement with seal & signature',
      'Income Tax Returns (ITR-V) for last 3 financial years',
      'Employment letter / Leave sanction / Company incorporation documents',
      'Day-wise travel itinerary and accommodation proof'
    ],
    description: 'End-to-end UK VFS appointment booking, document scrutiny, cover letter drafting, and biometric assistance.'
  },
  {
    id: 'visa-schengen',
    country: 'Schengen (France, Germany, Switzerland, Italy)',
    flagEmoji: '🇪🇺',
    visaType: 'Short Stay Uniform Tourist / Business (Type C)',
    processingTime: '15 - 20 Calendar Days',
    validity: 'As per travel itinerary (Up to 90 Days)',
    stayPeriod: 'Up to 90 Days in any 180-day period',
    feeINR: 9800,
    documents: [
      'Original Passport valid for 3 months beyond intended departure from Schengen',
      'Two recent biometric passport photographs (35x45mm, 80% face coverage)',
      'Cover letter explaining purpose of visit and detailed itinerary',
      'Last 6 months bank statement with bank seal and sufficient financial proofs',
      '3 years ITR forms and Form 16',
      'Travel Medical Insurance with minimum coverage of €30,000'
    ],
    description: 'Comprehensive Schengen visa dossier preparation, insurance issuance, flight dummy reservation, and VFS/TLS biometric slot securing.'
  },
  {
    id: 'visa-malaysia',
    country: 'Malaysia',
    flagEmoji: '🇲🇾',
    visaType: 'eNTRI / Tourist E-Visa',
    processingTime: '24 - 48 Hours',
    validity: '3 Months Single / Multiple Entry',
    stayPeriod: '30 Days',
    feeINR: 2600,
    documents: [
      'Clear passport scan front and last page',
      'Studio photograph 35mm x 50mm white background without glasses',
      'Confirmed round trip flight tickets',
      'Hotel reservation confirmation'
    ],
    description: 'Quick approval Malaysia tourist e-visa with direct electronic authorization delivered directly to your email.'
  },
  {
    id: 'visa-usa',
    country: 'United States of America (USA)',
    flagEmoji: '🇺🇸',
    visaType: 'B1/B2 Tourist & Business Visitor Visa',
    processingTime: 'Slot availability dependent',
    validity: '10 Years Multiple Entry',
    stayPeriod: 'Up to 6 Months per entry (determined at Port of Entry)',
    feeINR: 17500,
    documents: [
      'Valid Passport and old passports',
      'Form DS-160 confirmation barcode page',
      'Appointment confirmation letter for VAC Biometrics and Consular Interview',
      'Financial bank statements, property documents, business/salary records'
    ],
    description: 'Expert DS-160 application form filing, early appointment date tracking & rescheduling, mock interview preparation with experienced visa consultants.'
  },
  {
    id: 'visa-canada',
    country: 'Canada',
    flagEmoji: '🇨🇦',
    visaType: 'V-1 Visitor / Tourist Visa',
    processingTime: '20 - 35 Working Days',
    validity: 'Up to Passport Expiry (up to 10 Years)',
    stayPeriod: 'Up to 6 Months per entry',
    feeINR: 12500,
    documents: [
      'Passport with 6 months validity',
      'IRCC portal application with biometrics at VFS Global',
      '6 months bank statement with proof of financial ties',
      'Employment verification or business registration proof'
    ],
    description: 'Complete Canada tourist and family visit visa filing with IRCC document preparation and VFS biometrics coordination.'
  },
  {
    id: 'visa-australia',
    country: 'Australia',
    flagEmoji: '🇦🇺',
    visaType: 'Subclass 600 Tourist Stream',
    processingTime: '15 - 25 Working Days',
    validity: '1 to 3 Years Multiple Entry',
    stayPeriod: '3 Months per visit',
    feeINR: 13200,
    documents: [
      'Valid Indian Passport scan',
      'Recent passport photograph',
      'Detailed travel itinerary and proof of funds',
      'Income tax returns for past 3 years'
    ],
    description: 'Official Australian Department of Home Affairs ImmiAccount electronic visitor visa filing with comprehensive cover letter drafting.'
  },
  {
    id: 'visa-new-zealand',
    country: 'New Zealand',
    flagEmoji: '🇳🇿',
    visaType: 'Visitor Visa / NZeTA Support',
    processingTime: '20 - 30 Working Days',
    validity: 'Up to 9 Months',
    stayPeriod: 'Up to 9 Months within 18 months',
    feeINR: 14800,
    documents: [
      'Valid Passport bio page',
      'Proof of genuine temporary stay and financial stability',
      'Covering letter outlining sightseeing itinerary',
      'Hotel bookings and onward flight proof'
    ],
    description: 'Immigration New Zealand visitor visa advisory ensuring complete compliance with INZ evidence requirements.'
  },
  {
    id: 'visa-japan',
    country: 'Japan',
    flagEmoji: '🇯🇵',
    visaType: 'Single Entry / 3-Year Multiple Entry E-Visa',
    processingTime: '5 - 7 Working Days',
    validity: '3 Months to 3 Years',
    stayPeriod: '15 to 30 Days',
    feeINR: 3500,
    documents: [
      'Original Passport',
      'VFS Japan visa application form',
      'Form 16 or 3 years ITR',
      'Detailed day-to-day schedule in Japan (Taizai Nitteihyo)'
    ],
    description: 'Official Japan Embassy and Consulate e-Visa filing for vacationers, business travelers, and cruise passengers.'
  },
  {
    id: 'visa-south-korea',
    country: 'South Korea',
    flagEmoji: '🇰🇷',
    visaType: 'C-3-9 Individual Tourist Visa',
    processingTime: '7 - 10 Working Days',
    validity: '3 Months Single Entry',
    stayPeriod: 'Up to 90 Days',
    feeINR: 6200,
    documents: [
      'Passport valid for 6 months',
      'Korea Visa Application Form with 35x45mm photo',
      'Personal bank statements for 6 months verified by bank',
      'Company leave sanction letter and ITR'
    ],
    description: 'Korean Embassy KVAC visa submission with certified document verification and express tracking.'
  },
  {
    id: 'visa-turkey',
    country: 'Turkey (Türkiye)',
    flagEmoji: '🇹🇷',
    visaType: 'Single Entry E-Visa (with US/UK/Schengen Visa)',
    processingTime: '24 Hours',
    validity: '180 Days',
    stayPeriod: '30 Days',
    feeINR: 5400,
    documents: [
      'Passport with 6 months validity',
      'Valid supporting visa or residence permit from USA, UK, Ireland, or Schengen',
      'Return flight ticket on Turkish Airlines or partner carrier',
      'Confirmed hotel reservation'
    ],
    description: 'Instant Turkish electronic visa delivery for qualified Indian passport holders with supporting valid visas.'
  },
  {
    id: 'visa-egypt',
    country: 'Egypt',
    flagEmoji: '🇪🇬',
    visaType: '30 Days Tourist E-Visa',
    processingTime: '3 - 5 Working Days',
    validity: '90 Days',
    stayPeriod: '30 Days Single Entry',
    feeINR: 3900,
    documents: [
      'Passport scan valid for at least 8 months',
      'Clear passport size photo',
      'Confirmed flight and hotel voucher in Cairo/Hurghada',
      'Host invitation or tour program'
    ],
    description: 'Official Egypt E-Visa portal processing with fast issuance for Nile cruises and Pyramids tours.'
  },
  {
    id: 'visa-vietnam',
    country: 'Vietnam',
    flagEmoji: '🇻🇳',
    visaType: '30 or 90 Days E-Visa (Single / Multiple)',
    processingTime: '3 - 4 Working Days',
    validity: '30 to 90 Days',
    stayPeriod: '30 to 90 Days',
    feeINR: 2900,
    documents: [
      'Passport bio page scan in high resolution',
      'Portrait photo without glasses against white wall',
      'Entry and exit international checkpoints declaration'
    ],
    description: 'Official Vietnam Immigration Department e-Visa issuing direct approval barcodes for Hanoi, Da Nang, and Ho Chi Minh City.'
  },
  {
    id: 'visa-indonesia',
    country: 'Indonesia (Bali)',
    flagEmoji: '🇮🇩',
    visaType: '30 Days Electronic Visa on Arrival (e-VoA B213)',
    processingTime: '24 Hours',
    validity: '90 Days',
    stayPeriod: '30 Days (Extendable once for 30 days)',
    feeINR: 3400,
    documents: [
      'Passport scan with 6 months validity from date of arrival',
      'Square passport photograph',
      'Return flight confirmation out of Indonesia'
    ],
    description: 'Pre-approved Indonesia e-VoA enabling VIP airport autogate clearance at Bali Ngurah Rai & Jakarta Soekarno-Hatta airports.'
  },
  {
    id: 'visa-qatar',
    country: 'Qatar',
    flagEmoji: '🇶🇦',
    visaType: '30 Days Visa on Arrival / Hayya A1 Entry',
    processingTime: 'Instant / 24 Hours',
    validity: '30 Days',
    stayPeriod: '30 Days (Extendable)',
    feeINR: 2200,
    documents: [
      'Passport with minimum 6 months validity',
      'Confirmed return flight ticket to India or next destination',
      'Hotel reservation booked via Discover Qatar or approved voucher',
      'Credit/Debit card under passenger name'
    ],
    description: 'Hassle-free Qatar visa-on-arrival pre-registration, Discover Qatar mandatory hotel booking assistance, and Hayya entry filing.'
  },
  {
    id: 'visa-oman',
    country: 'Oman',
    flagEmoji: '🇴🇲',
    visaType: '10 Days / 30 Days Royal Oman Police E-Visa',
    processingTime: '24 - 48 Hours',
    validity: '30 Days',
    stayPeriod: '10 or 30 Days Single Entry',
    feeINR: 3100,
    documents: [
      'Valid passport scan',
      'Recent passport photo',
      'Hotel reservation and flight itinerary'
    ],
    description: 'Royal Oman Police (ROP) official e-Visa submission with immediate electronic delivery for Muscat, Salalah, and trade trips.'
  },
  {
    id: 'visa-sri-lanka',
    country: 'Sri Lanka',
    flagEmoji: '🇱🇰',
    visaType: '30 Days Double Entry Tourist ETA',
    processingTime: '12 - 24 Hours',
    validity: '180 Days',
    stayPeriod: '30 Days Double Entry',
    feeINR: 1900,
    documents: [
      'Passport copy valid for 6 months',
      'Return flight ticket confirmation',
      'Hotel or resort booking voucher'
    ],
    description: 'Direct Electronic Travel Authorization (ETA) approval with instant QR token for Colombo and beach holiday arrivals.'
  }
];
