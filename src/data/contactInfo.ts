// Central Contact Information for MMS Air Travels & Cargo Service
// Locations: Adirampattinam & Madukkur
// Contact Numbers:
// General Inquiry: 9500567442
// Ticket Booking: 9500977442
// Visa: 9384567442
// Other Services: 6369012360
//
// Madukkur Branch Numbers: 9500567442, 9500977442, 6369012360
// Adirampattinam Branch Numbers: 9500567442, 9384567442, 6369012360

export const CONTACT_NUMBERS = {
  general: {
    raw: '9500567442',
    number: '9500567442',
    formatted: '+91 95005 67442',
    tel: 'tel:9500567442',
    whatsapp: 'https://wa.me/919500567442',
    label: 'General Inquiry'
  },
  ticket: {
    raw: '9500977442',
    number: '9500977442',
    formatted: '+91 95009 77442',
    tel: 'tel:9500977442',
    whatsapp: 'https://wa.me/919500977442',
    label: 'Flight Ticket Booking'
  },
  visa: {
    raw: '9384567442',
    number: '9384567442',
    formatted: '+91 93845 67442',
    tel: 'tel:9384567442',
    whatsapp: 'https://wa.me/919384567442',
    label: 'Visa Assistance'
  },
  services: {
    raw: '6369012360',
    number: '6369012360',
    formatted: '+91 63690 12360',
    tel: 'tel:6369012360',
    whatsapp: 'https://wa.me/916369012360',
    label: 'Other Services'
  }
} as const;

export const LOCATIONS = {
  madukkur: {
    name: 'Madukkur Branch',
    shortName: 'Madukkur',
    address: 'No 2, Sun Garden, One Way Road, Madukkur - 614903',
    landmark: 'Sun Garden, One Way Road',
    hours: 'Mon - Sun: 9:00 AM - 9:30 PM',
    timings: 'Mon - Sun: 9:00 AM - 9:30 PM',
    phoneNumbers: ['9500567442', '9500977442', '6369012360'] as const,
    formattedNumbers: ['+91 95005 67442', '+91 95009 77442', '+91 63690 12360'] as const,
    generalPhone: '+91 95005 67442',
    ticketPhone: '+91 95009 77442',
    servicesPhone: '+91 63690 12360',
    whatsapp: 'https://wa.me/919500567442',
    mapsUrl: 'https://maps.google.com/?q=No+2+Sun+Garden+One+Way+Road+Madukkur+614903',
    mapUrl: 'https://maps.google.com/?q=No+2+Sun+Garden+One+Way+Road+Madukkur+614903'
  },
  adirampattinam: {
    name: 'Adirampattinam Branch',
    shortName: 'Adirampattinam',
    address: 'No 2/4 Near Mekka Masjid, Sethu Road, Adirampattinam - 614701',
    landmark: 'Near Mekka Masjid, Sethu Road',
    hours: 'Mon - Sun: 9:00 AM - 10:00 PM',
    timings: 'Mon - Sun: 9:00 AM - 10:00 PM',
    phoneNumbers: ['9500567442', '9384567442', '6369012360'] as const,
    formattedNumbers: ['+91 95005 67442', '+91 93845 67442', '+91 63690 12360'] as const,
    generalPhone: '+91 95005 67442',
    ticketPhone: '+91 93845 67442',
    servicesPhone: '+91 63690 12360',
    whatsapp: 'https://wa.me/919500567442',
    mapsUrl: 'https://www.google.com/maps/place/MMS+Air+Travels/@10.3376636,79.3859568,19.5z/data=!4m9!1m2!2m1!1sNo+2%2F4+Near+Mekka+Masjid+Sethu+Road+Adirampattinam+614701!3m5!1s0x3afffdf4b93713f5:0x5a2bc23403d4b44!8m2!3d10.3376073!4d79.3862033!16s%2Fg%2F11zxfd2fw4?entry=ttu&g_ep=EgoyMDI2MDkxMy4wIKXMDSoASAFQAw%3D%3D',
    mapUrl: 'https://www.google.com/maps/place/MMS+Air+Travels/@10.3376636,79.3859568,19.5z/data=!4m9!1m2!2m1!1sNo+2%2F4+Near+Mekka+Masjid+Sethu+Road+Adirampattinam+614701!3m5!1s0x3afffdf4b93713f5:0x5a2bc23403d4b44!8m2!3d10.3376073!4d79.3862033!16s%2Fg%2F11zxfd2fw4?entry=ttu&g_ep=EgoyMDI2MDkxMy4wIKXMDSoASAFQAw%3D%3D',
    coordinates: {
      lat: 10.3376073,
      lng: 79.3862033
    }
  }
} as const;

export const OFFICIAL_EMAILS = {
  general: 'mmsairtravels@gmail.com',
  cargo: 'mmsairtravelsandcargoservice@gmail.com',
  booking: 'mmsairtravels.booking@gmail.com'
} as const;
