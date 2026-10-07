export type LanguageCode = 'en' | 'ta' | 'ml' | 'ar' | 'hi';

export interface LanguageOption {
  code: LanguageCode;
  label: string;
  nativeName: string;
  flag: string;
  dir: 'ltr' | 'rtl';
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', label: 'English', nativeName: 'English', flag: '🇬🇧', dir: 'ltr' },
  { code: 'ta', label: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳', dir: 'ltr' },
  { code: 'ml', label: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳', dir: 'ltr' },
  { code: 'ar', label: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', dir: 'rtl' },
  { code: 'hi', label: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', dir: 'ltr' },
];

export interface TranslationStrings {
  // Top Blessing Bar
  divineBlessing: string;
  visaHighlight: string;
  branchAdirampattinam: string;
  hotline: string;

  // Header
  searchPlacePlaceholder: string;
  emailBooking: string;
  adminDesk: string;

  // Navigation
  navHome: string;
  navFlightBooking: string;
  navGroupFares: string;
  navIndiaTours: string;
  navIntlTours: string;
  navGroupTours: string;
  navVisas: string;
  navCargo: string;
  navOtherServices: string;
  navContact: string;

  // Flight Ticket Enquiry Section
  flightBookingTitle: string;
  flightBookingSubtitle: string;
  whyBookWithUs: string;
  benefitInsurance: string;
  benefitManager: string;
  benefitSupport: string;
  benefitReviews: string;
  iataCertifiedBadge: string;
  
  // Enquiry Form
  sendEnquiry: string;
  callUsAt: string;
  titleMr: string;
  titleMrs: string;
  titleMs: string;
  titleDr: string;
  firstName: string;
  lastName: string;
  mobile: string;
  emailAddress: string;
  sourceCityPlaceholder: string;
  destCityPlaceholder: string;
  tripOneWay: string;
  tripRoundTrip: string;
  tripMultiCity: string;
  departureDate: string;
  returnDate: string;
  noOfPax: string;
  remarksPlaceholder: string;
  authorizeCheckbox: string;
  sendEnquiryButton: string;
  submittingButton: string;

  // Services
  serviceFlight: string;
  serviceHotel: string;
  servicePackage: string;
  serviceVisa: string;
  serviceSightseeing: string;
  serviceMisc: string;
  serviceTransfer: string;
  serviceCargo: string;

  // Enquiry Success Confirmation
  enquirySuccessTitle: string;
  enquirySuccessDesc: string;
  enquiryRefNumber: string;
  connectWhatsApp: string;
  callBookingDesk: string;
  printSlip: string;
  doneAndReturn: string;

  // Quick Assistance
  agencyHotlineTitle: string;
  agencyHotlineDesc: string;
  instantQuoteGuarantee: string;
  officeLocationsTitle: string;
}

export const TRANSLATIONS: Record<LanguageCode, TranslationStrings> = {
  en: {
    divineBlessing: 'In The Name Of Allah, The Most Beneficent, The Most Merciful',
    visaHighlight: 'Dubai Visit Visa within 24 Hours!',
    branchAdirampattinam: 'Branches: Adirampattinam • Madukkur',
    hotline: 'General: 63690 12360 | Tickets: 93845 67440 | Visas/Tours: 95009 77442',
    searchPlacePlaceholder: 'Search destination (e.g. Dubai, Andaman, Singapore)...',
    emailBooking: 'Email Booking',
    adminDesk: 'Admin Desk',

    navHome: 'Home',
    navFlightBooking: 'Flight Ticket Booking',
    navGroupFares: 'Our Group Fares',
    navIndiaTours: 'India Tours',
    navIntlTours: 'International Tours',
    navGroupTours: 'Group Tours',
    navVisas: 'Visas',
    navCargo: 'Cargo & Courier',
    navOtherServices: 'Other Services',
    navContact: 'Contact Us',

    flightBookingTitle: 'Flight Ticket Booking & Instant Enquiry',
    flightBookingSubtitle: 'Submit your flight enquiry directly. Live discounted fares, group blocks, and confirmed seats from certified booking experts.',
    whyBookWithUs: 'Why book with us',
    benefitInsurance: 'Complimentary Travel Insurance',
    benefitManager: 'Personalized Relationship Manager',
    benefitSupport: '24 X 7 On Ground Support',
    benefitReviews: 'Rated 4.7 across Social Media Platforms (2500+ Reviews)',
    iataCertifiedBadge: 'Verified Agency • 100% Reliable Airline Ticketing',

    sendEnquiry: 'Send Enquiry',
    callUsAt: 'CALL US AT :',
    titleMr: 'Mr.',
    titleMrs: 'Mrs.',
    titleMs: 'Ms.',
    titleDr: 'Dr.',
    firstName: 'First Name *',
    lastName: 'Last Name *',
    mobile: 'Mobile *',
    emailAddress: 'Email Address *',
    sourceCityPlaceholder: 'Type source city..',
    destCityPlaceholder: 'Type destination city..',
    tripOneWay: 'One Way',
    tripRoundTrip: 'Round Trip',
    tripMultiCity: 'Multi City',
    departureDate: 'Departure',
    returnDate: 'Return',
    noOfPax: 'No. of Pax',
    remarksPlaceholder: 'Remarks.... *',
    authorizeCheckbox: 'I request and authorize MMS AIR TRAVELS to contact me.',
    sendEnquiryButton: 'Send Enquiry',
    submittingButton: 'Submitting...',

    serviceFlight: 'Flight',
    serviceHotel: 'Hotel',
    servicePackage: 'Package',
    serviceVisa: 'Visa',
    serviceSightseeing: 'SightSeeing',
    serviceMisc: 'Miscellaneous',
    serviceTransfer: 'Transfer',
    serviceCargo: 'Cargo',

    enquirySuccessTitle: 'Enquiry Submitted Successfully!',
    enquirySuccessDesc: 'Thank you! Your official flight ticket enquiry reference number is:',
    enquiryRefNumber: 'Reference Token',
    connectWhatsApp: 'Connect on WhatsApp Now',
    callBookingDesk: 'Call Booking Desk',
    printSlip: 'Print Slip',
    doneAndReturn: 'Done & Return',

    agencyHotlineTitle: 'Direct Booking Assistance',
    agencyHotlineDesc: 'Call or WhatsApp our travel desk directly for instant live fare quotes and seat reservations.',
    instantQuoteGuarantee: '15-Minute Guaranteed Agent Callback',
    officeLocationsTitle: 'Visit Our Branch Offices'
  },

  ta: {
    divineBlessing: 'ஏக இறைவனின் திருப்பெயரால் (எல்லாம் வல்ல அல்லாஹ்வின் அருளால்)',
    visaHighlight: 'துபாய் விசிட் விசா 24 மணி நேரத்தில் தயார்!',
    branchAdirampattinam: 'கிளைகள்: அதிராம்பட்டினம் • மதுக்கூர்',
    hotline: 'பொது: 63690 12360 | டிக்கெட்: 93845 67440 | விசா/சுற்றுலா: 95009 77442',
    searchPlacePlaceholder: 'இடத்தை தேடுங்கள் (எ.கா. துபாய், அந்தமான், சிங்கப்பூர்)...',
    emailBooking: 'மின்னஞ்சல் பதிவு',
    adminDesk: 'நிர்வாகப் பிரிவு',

    navHome: 'முகப்பு',
    navFlightBooking: 'விமான டிக்கெட் பதிவு',
    navGroupFares: 'எங்கள் குழு கட்டணங்கள்',
    navIndiaTours: 'இந்திய சுற்றுலா',
    navIntlTours: 'சர்வதேச சுற்றுலா',
    navGroupTours: 'குழு சுற்றுலா',
    navVisas: 'விசா சேவைகள்',
    navCargo: 'கார்கோ & கூரியர்',
    navOtherServices: 'பிற சேவைகள்',
    navContact: 'தொடர்புக்கு',

    flightBookingTitle: 'விமான டிக்கெட் முன்பதிவு & நேரடி விசாரணை',
    flightBookingSubtitle: 'உங்கள் பயண விவரங்களை அனுப்பவும். சிறந்த குறைந்த கட்டணங்கள், உறுதிப்படுத்தப்பட்ட இருக்கைகள் மற்றும் 24x7 வாடிக்கையாளர் ஆதரவு.',
    whyBookWithUs: 'எங்களுடன் முன்பதிவு செய்வது ஏன்?',
    benefitInsurance: 'இலவச பயணக் காப்பீடு (Travel Insurance)',
    benefitManager: 'தனிப்பட்ட வாடிக்கையாளர் மேலாளர்',
    benefitSupport: '24 X 7 நேரடி உதவி மற்றும் வழிகாட்டுதல்',
    benefitReviews: 'சமூக ஊடகங்களில் 4.7 மதிப்பீடு (2500+ திருப்தியான வாடிக்கையாளர்கள்)',
    iataCertifiedBadge: 'அங்கீகரிக்கப்பட்ட நிறுவனம் • 100% நம்பகமான விமான முன்பதிவு',

    sendEnquiry: 'விசாரணை அனுப்பவும்',
    callUsAt: 'அழைக்க வேண்டிய எண்கள் :',
    titleMr: 'திரு.',
    titleMrs: 'திருமதி.',
    titleMs: 'செல்வி.',
    titleDr: 'டாக்டர்.',
    firstName: 'முதல் பெயர் *',
    lastName: 'கடைசி பெயர் *',
    mobile: 'மொபைல் எண் *',
    emailAddress: 'மின்னஞ்சல் முகவரி *',
    sourceCityPlaceholder: 'புறப்படும் ஊர் (Source City)..',
    destCityPlaceholder: 'சென்றடையும் ஊர் (Destination City)..',
    tripOneWay: 'ஒரு வழிப் பயணம் (One Way)',
    tripRoundTrip: 'இரு வழிப் பயணம் (Round Trip)',
    tripMultiCity: 'பல நகரப் பயணம் (Multi City)',
    departureDate: 'புறப்படும் தேதி',
    returnDate: 'திரும்பும் தேதி',
    noOfPax: 'பயணிகள் எண்ணிக்கை',
    remarksPlaceholder: 'குறிப்புகள் & விருப்பங்கள்.... *',
    authorizeCheckbox: 'MMS AIR TRAVELS நிறுவனம் என்னை தொடர்பு கொள்ள முழு அனுமதி அளிக்கிறேன்.',
    sendEnquiryButton: 'விசாரணை அனுப்பவும்',
    submittingButton: 'பதிவாகிறது...',

    serviceFlight: 'விமானம் (Flight)',
    serviceHotel: 'ஹோட்டல் (Hotel)',
    servicePackage: 'சுற்றுலா பேக்கேஜ் (Package)',
    serviceVisa: 'விசா (Visa)',
    serviceSightseeing: 'பார்வை இடங்கள் (SightSeeing)',
    serviceMisc: 'இதர சேவைகள் (Miscellaneous)',
    serviceTransfer: 'வாகனப் போக்குவரத்து (Transfer)',
    serviceCargo: 'கார்கோ (Cargo)',

    enquirySuccessTitle: 'விசாரணை வெற்றிகரமாகப் பெறப்பட்டது!',
    enquirySuccessDesc: 'நன்றி! உங்களின் அதிகாரப்பூர்வ விசாரணை குறிப்பு எண்:',
    enquiryRefNumber: 'குறிப்பு எண்',
    connectWhatsApp: 'வாட்ஸ்அப்பில் உடனடியாக தொடர்புகொள்ள',
    callBookingDesk: 'அலுவலகத்தை அழைக்க',
    printSlip: 'ரசீது அச்சிட',
    doneAndReturn: 'முடிந்தது & திரும்பு',

    agencyHotlineTitle: 'நேரடி முன்பதிவு உதவி',
    agencyHotlineDesc: 'உடனடி விமான டிக்கெட் விலை நிலவரம் அறிய எங்கள் டிக்கெட்டிங் அதிகாரியை அழைக்கவும் அல்லது வாட்ஸ்அப் செய்யவும்.',
    instantQuoteGuarantee: '15 நிமிடங்களில் எங்கள் அலுவலர் உங்களைத் தொடர்புகொள்வார்',
    officeLocationsTitle: 'எங்கள் கிளை அலுவலகங்கள்'
  },

  ml: {
    divineBlessing: 'പരമകാരുണികനും കരുണാമയനുമായ അല്ലാഹുവിന്റെ നാമത്തിൽ',
    visaHighlight: 'ദുബായ് വിസിറ്റ് വിസ 24 മണിക്കൂറിനുള്ളിൽ ലഭ്യമാണ്!',
    branchAdirampattinam: 'ശാഖകൾ: അതിരാമ്പട്ടിനം • മദുക്കൂർ',
    hotline: 'ജനറൽ: 63690 12360 | ടിക്കറ്റ്: 93845 67440 | വിസ/ടൂർ: 95009 77442',
    searchPlacePlaceholder: 'സ്ഥലം തിരയുക (ഉദാ: ദുബായ്, അന്തമാൻ, സിംഗപ്പൂർ)...',
    emailBooking: 'ഇമെയിൽ ബുക്കിംഗ്',
    adminDesk: 'അഡ്മിൻ ഡെസ്ക്',

    navHome: 'ഹോം',
    navFlightBooking: 'ഫ്ലൈറ്റ് ടിക്കറ്റ് ബുക്കിംഗ്',
    navGroupFares: 'ഞങ്ങളുടെ ഗ്രൂപ്പ് നിരക്കുകൾ',
    navIndiaTours: 'ഇന്ത്യൻ ടൂറുകൾ',
    navIntlTours: 'അന്താരാഷ്ട്ര ടൂറുകൾ',
    navGroupTours: 'ഗ്രൂപ്പ് ടൂറുകൾ',
    navVisas: 'വിസ സേവനങ്ങൾ',
    navCargo: 'കാർഗോ & കൊറിയർ',
    navOtherServices: 'മറ്റ് സേവനങ്ങൾ',
    navContact: 'ഞങ്ങളെ ബന്ധപ്പെടുക',

    flightBookingTitle: 'ഫ്ലൈറ്റ് ടിക്കറ്റ് ബുക്കിംഗും അന്വേഷണവും',
    flightBookingSubtitle: 'നിങ്ങളുടെ ഫ്ലൈറ്റ് അന്വേഷണം അയക്കുക. തത്സമയ നിരക്കുകളും ഇളവുകളും ഗ്രൂപ്പ് ഫെയറുകളും പ്രൊഫഷണൽ സർവീസും.',
    whyBookWithUs: 'എന്തുകൊണ്ട് ഞങ്ങളോടൊപ്പം ബുക്ക് ചെയ്യണം?',
    benefitInsurance: 'സൗജന്യ ട്രാവൽ ഇൻഷുറൻസ്',
    benefitManager: 'വ്യക്തിഗത റിലേഷൻഷിപ്പ് മാനേജർ',
    benefitSupport: '24 X 7 തത്സമയ ഗ്രൗണ്ട് സപ്പോർട്ട്',
    benefitReviews: 'സോഷ്യൽ മീഡിയയിൽ 4.7 റേറ്റിംഗ് (2500+ ഉപഭോക്താക്കൾ)',
    iataCertifiedBadge: 'അംഗീകൃത ഏജൻസി • 100% വിശ്വസനീയമായ ടിക്കറ്റിംഗ്',

    sendEnquiry: 'അന്വേഷണം അയക്കുക',
    callUsAt: 'വിളിക്കേണ്ട നമ്പറുകൾ :',
    titleMr: 'മിസ്റ്റർ',
    titleMrs: 'മിസിസ്',
    titleMs: 'മിസ്',
    titleDr: 'ഡോക്ടർ',
    firstName: 'ആദ്യ നാമം *',
    lastName: 'അവസാന നാമം *',
    mobile: 'മൊബൈൽ നമ്പർ *',
    emailAddress: 'ഇമെയിൽ വിലാസം *',
    sourceCityPlaceholder: 'പുറപ്പെടുന്ന സ്ഥലം (Source City)..',
    destCityPlaceholder: 'എത്തിച്ചേരേണ്ട സ്ഥലം (Destination City)..',
    tripOneWay: 'വൺ വേ (One Way)',
    tripRoundTrip: 'റൗണ്ട് ട്രിപ്പ് (Round Trip)',
    tripMultiCity: 'മൾട്ടി സിറ്റി (Multi City)',
    departureDate: 'യാത്രാ തീയതി',
    returnDate: 'തിരിച്ചുവരുന്ന തീയതി',
    noOfPax: 'യാത്രക്കാരുടെ എണ്ണം',
    remarksPlaceholder: 'നിർദ്ദേശങ്ങളും വിവരങ്ങളും.... *',
    authorizeCheckbox: 'MMS AIR TRAVELS എന്നെ ബന്ധപ്പെടാൻ ഞാൻ പൂർണ്ണ അനുമതി നൽകുന്നു.',
    sendEnquiryButton: 'അന്വേഷണം സമർപ്പിക്കുക',
    submittingButton: 'സമർപ്പിക്കുന്നു...',

    serviceFlight: 'ഫ്ലൈറ്റ് (Flight)',
    serviceHotel: 'ഹോട്ടൽ (Hotel)',
    servicePackage: 'ടൂർ പാക്കേജ് (Package)',
    serviceVisa: 'വിസ (Visa)',
    serviceSightseeing: 'കാഴ്ചകൾ (SightSeeing)',
    serviceMisc: 'മറ്റ് സേവനങ്ങൾ (Miscellaneous)',
    serviceTransfer: 'ട്രാൻസ്ഫർ (Transfer)',
    serviceCargo: 'കാർഗോ (Cargo)',

    enquirySuccessTitle: 'അന്വേഷണം വിജയകരമായി ലഭിച്ചു!',
    enquirySuccessDesc: 'നന്ദി! നിങ്ങളുടെ ഒഫീഷ്യൽ റഫറൻസ് നമ്പർ:',
    enquiryRefNumber: 'റഫറൻസ് നമ്പർ',
    connectWhatsApp: 'വാട്ട്‌സ്ആപ്പിൽ ഉടനടി ബന്ധപ്പെടുക',
    callBookingDesk: 'ബുക്കിംഗ് ഡെസ്കിലേക്ക് വിളിക്കുക',
    printSlip: 'സ്ലിപ്പ് പ്രിന്റ് ചെയ്യുക',
    doneAndReturn: 'പൂർത്തിയായി & മടങ്ങുക',

    agencyHotlineTitle: 'തത്സമയ ബുക്കിംഗ് സഹായം',
    agencyHotlineDesc: 'തത്സമയ നിരക്കുകൾക്കും റിസർവേഷനുകൾക്കുമായി ഞങ്ങളുടെ ഡെസ്കിലേക്ക് നേരിട്ട് വിളിക്കുകയോ വാട്ട്‌സ്ആപ്പ് ചെയ്യുകയോ ചെയ്യുക.',
    instantQuoteGuarantee: '15 മിനിറ്റിനുള്ളിൽ മറുപടി ലഭിക്കുന്നതാണ്',
    officeLocationsTitle: 'ഞങ്ങളുടെ ശാഖകൾ'
  },

  ar: {
    divineBlessing: 'بسم الله الرحمن الرحيم',
    visaHighlight: 'تأشيرة زيارة دبي خلال 24 ساعة فقط!',
    branchAdirampattinam: 'الفروع: أديرامباتينام • مادوكور',
    hotline: 'عام: 63690 12360 | تذاكر: 93845 67440 | تأشيرات وجولات: 95009 77442',
    searchPlacePlaceholder: 'ابحث عن وجهتك (مثل دبي، جزر أندامان، سنغافورة)...',
    emailBooking: 'الحجز عبر البريد',
    adminDesk: 'مكتب الإدارة',

    navHome: 'الرئيسية',
    navFlightBooking: 'حجز تذاكر الطيران',
    navGroupFares: 'أسعار المجموعات الخاصة',
    navIndiaTours: 'رحلات الهند',
    navIntlTours: 'رحلات دولية',
    navGroupTours: 'رحلات جماعية',
    navVisas: 'خدمات التأشيرات',
    navCargo: 'الشحن الجوي والطرود',
    navOtherServices: 'خدمات أخرى',
    navContact: 'اتصل بنا',

    flightBookingTitle: 'حجز تذاكر الطيران والاستفسار المباشر',
    flightBookingSubtitle: 'أرسل طلبك مباشرة للحصول على أفضل أسعار التذاكر المخفضة والمقاعد المؤكدة عبر خبراء حجز معتمدين.',
    whyBookWithUs: 'لماذا تحجز معنا؟',
    benefitInsurance: 'تأمين سفر مجاني وشامل',
    benefitManager: 'مدير علاقات وخدمة عملاء مخصص',
    benefitSupport: 'دعم ومتابعة على مدار الساعة 24 × 7',
    benefitReviews: 'تقييم 4.7 عبر منصات التواصل الاجتماعي (أكثر من 2500 مراجعة)',
    iataCertifiedBadge: 'وكالة معتمدة وموثوقة • حجز تذاكر طيران موثوق بنسبة 100%',

    sendEnquiry: 'إرسال الاستفسار',
    callUsAt: 'اتصل بنا على :',
    titleMr: 'السيد',
    titleMrs: 'السيدة',
    titleMs: 'الآنسة',
    titleDr: 'الدكتور',
    firstName: 'الاسم الأول *',
    lastName: 'اسم العائلة *',
    mobile: 'رقم الجوال *',
    emailAddress: 'البريد الإلكتروني *',
    sourceCityPlaceholder: 'مدينة المغادرة (Source City)..',
    destCityPlaceholder: 'مدينة الوصول (Destination City)..',
    tripOneWay: 'ذهاب فقط (One Way)',
    tripRoundTrip: 'ذهاب وعودة (Round Trip)',
    tripMultiCity: 'وجهات متعددة (Multi City)',
    departureDate: 'تاريخ المغادرة',
    returnDate: 'تاريخ العودة',
    noOfPax: 'عدد المسافرين',
    remarksPlaceholder: 'ملاحظات وتفاصيل إضافية.... *',
    authorizeCheckbox: 'أفوض شركة MMS AIR TRAVELS للتواصل معي بخصوص طلبي.',
    sendEnquiryButton: 'إرسال الاستفسار',
    submittingButton: 'جاري الإرسال...',

    serviceFlight: 'طيران (Flight)',
    serviceHotel: 'فنادق (Hotel)',
    servicePackage: 'باقات سياحية (Package)',
    serviceVisa: 'تأشيرات (Visa)',
    serviceSightseeing: 'جولات ومعالم (SightSeeing)',
    serviceMisc: 'خدمات متنوعة (Miscellaneous)',
    serviceTransfer: 'توصيل ومواصلات (Transfer)',
    serviceCargo: 'شحن جوي (Cargo)',

    enquirySuccessTitle: 'تم إرسال الاستفسار بنجاح!',
    enquirySuccessDesc: 'شكراً لك! رقم مرجع حجز التذكرة الخاص بك هو:',
    enquiryRefNumber: 'الرقم المرجعي',
    connectWhatsApp: 'تواصل عبر واتساب الآن',
    callBookingDesk: 'الاتصال بمكتب الحجوزات',
    printSlip: 'طباعة الإيصال',
    doneAndReturn: 'تم والعودة',

    agencyHotlineTitle: 'مساعدة الحجز المباشر',
    agencyHotlineDesc: 'اتصل بمكتبنا أو راسلنا عبر واتساب للحصول على أسعار فورية وتأكيد حجز التذاكر.',
    instantQuoteGuarantee: 'نضمن الرد خلال 15 دقيقة بواسطة مسؤول الحجز',
    officeLocationsTitle: 'فروعنا ومكاتبنا'
  },

  hi: {
    divineBlessing: 'अल्लाह के नाम से, जो बड़ा मेहरबान और निहायत रहम वाला है',
    visaHighlight: 'दुबई विज़िट वीज़ा सिर्फ़ 24 घंटे में तैयार!',
    branchAdirampattinam: 'शाखाएं: अदिरामपट्टिनम • मदुक्कूर',
    hotline: 'सामान्य: 63690 12360 | टिकट: 93845 67440 | वीज़ा/टूर: 95009 77442',
    searchPlacePlaceholder: 'गंतव्य खोजें (जैसे दुबई, अंडमान, सिंगापुर)...',
    emailBooking: 'ईमेल बुकिंग',
    adminDesk: 'व्यवस्थापक डेस्क',

    navHome: 'होम',
    navFlightBooking: 'फ़्लाइट टिकट बुकिंग',
    navGroupFares: 'विशेष ग्रुप किराये',
    navIndiaTours: 'भारत यात्रा',
    navIntlTours: 'अंतर्राष्ट्रीय यात्रा',
    navGroupTours: 'ग्रुप टूर',
    navVisas: 'वीज़ा सेवाएं',
    navCargo: 'कार्गो एवं कूरियर',
    navOtherServices: 'अन्य सेवाएं',
    navContact: 'संपर्क करें',

    flightBookingTitle: 'फ़्लाइट टिकट बुकिंग एवं सीधी पूछताछ',
    flightBookingSubtitle: 'अपनी यात्रा विवरण भेजें। प्रमाणित विशेषज्ञों द्वारा सबसे कम रियायती किराया, ग्रुप सीट्स और लाइव कन्फर्मेशन।',
    whyBookWithUs: 'हमारे साथ क्यों बुक करें?',
    benefitInsurance: 'मुफ़्त यात्रा बीमा (Complimentary Travel Insurance)',
    benefitManager: 'व्यक्तिगत रिलेशनशिप मैनेजर',
    benefitSupport: '24 X 7 ऑन-ग्राउंड सहायता',
    benefitReviews: 'सोशल मीडिया पर 4.7 रेटिंग (2500+ संतुष्ट ग्राहक)',
    iataCertifiedBadge: 'प्रमाणित एजेंसी • 100% भरोसेमंद एयरलाइन टिकटिंग',

    sendEnquiry: 'पूछताछ भेजें',
    callUsAt: 'कॉल करें :',
    titleMr: 'श्री',
    titleMrs: 'श्रीमती',
    titleMs: 'सुश्री',
    titleDr: 'डॉ.',
    firstName: 'पहला नाम *',
    lastName: 'अंतिम नाम *',
    mobile: 'मोबाइल नंबर *',
    emailAddress: 'ईमेल पता *',
    sourceCityPlaceholder: 'प्रस्थान शहर (Source City)..',
    destCityPlaceholder: 'गंतव्य शहर (Destination City)..',
    tripOneWay: 'एक तरफ़ा (One Way)',
    tripRoundTrip: 'आना-जाना (Round Trip)',
    tripMultiCity: 'मल्टी सिटी (Multi City)',
    departureDate: 'प्रस्थान तिथि',
    returnDate: 'वापसी तिथि',
    noOfPax: 'यात्रियों की संख्या',
    remarksPlaceholder: 'अतिरिक्त विवरण एवं नोट्स.... *',
    authorizeCheckbox: 'मैं MMS AIR TRAVELS को मुझसे संपर्क करने के लिए अधिकृत करता हूँ।',
    sendEnquiryButton: 'पूछताछ भेजें',
    submittingButton: 'भेजा जा रहा है...',

    serviceFlight: 'फ़्लाइट (Flight)',
    serviceHotel: 'होटल (Hotel)',
    servicePackage: 'टूर पैकेज (Package)',
    serviceVisa: 'वीज़ा (Visa)',
    serviceSightseeing: 'दर्शनीय स्थल (SightSeeing)',
    serviceMisc: 'विविध सेवाएं (Miscellaneous)',
    serviceTransfer: 'ट्रांसफ़र (Transfer)',
    serviceCargo: 'कार्गो (Cargo)',

    enquirySuccessTitle: 'पूछताछ सफलतापूर्वक प्राप्त हुई!',
    enquirySuccessDesc: 'धन्यवाद! आपका आधिकारिक पूछताछ संदर्भ टोकन नंबर है:',
    enquiryRefNumber: 'संदर्भ टोकन',
    connectWhatsApp: 'व्हाट्सएप पर तुरंत संपर्क करें',
    callBookingDesk: 'बुकिंग डेस्क पर कॉल करें',
    printSlip: 'रसीद प्रिंट करें',
    doneAndReturn: 'संपन्न एवं वापस जाएं',

    agencyHotlineTitle: 'सीधी बुकिंग सहायता',
    agencyHotlineDesc: 'लाइव डिस्काउंट दर और सीट आरक्षण के लिए हमारे टिकटिंग अधिकारी को सीधे कॉल या व्हाट्सएप करें।',
    instantQuoteGuarantee: '15 मिनट के भीतर एजेंट का त्वरित उत्तर',
    officeLocationsTitle: 'हमारे कार्यालय एवं शाखाएं'
  }
};
