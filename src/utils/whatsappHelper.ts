import { Booking, VisaEnquiryFormData } from '../types';
import { CONTACT_NUMBERS } from '../data/contactInfo';

/**
 * Normalizes phone numbers to standard WhatsApp format:
 * Digits only, starting with international country code without '+' or '00'.
 * Defaults to '91' (India) for 10-digit numbers.
 */
export function cleanPhoneForWhatsApp(rawPhone?: string, defaultCountry = '91'): string {
  if (!rawPhone) return '919789357865';
  
  // Remove all non-digits except a leading plus sign
  const trimmed = rawPhone.trim();
  const digitsOnly = trimmed.replace(/\D/g, '');
  
  if (!digitsOnly) return '919789357865';

  // If starts with 00, strip the 00
  if (digitsOnly.startsWith('00')) {
    return digitsOnly.slice(2);
  }

  // If 10 digits (standard Indian mobile like 9840012345), prefix with defaultCountry (91)
  if (digitsOnly.length === 10) {
    return `${defaultCountry}${digitsOnly}`;
  }

  // If 11 digits starting with 0, replace 0 with country code
  if (digitsOnly.length === 11 && digitsOnly.startsWith('0')) {
    return `${defaultCountry}${digitsOnly.slice(1)}`;
  }

  return digitsOnly;
}

/**
 * Builds formatted message for Flight Booking Itinerary Confirmation
 */
export function formatBookingWhatsAppText(booking: Booking, staffNote?: string): string {
  const primaryPax = booking.passengers[0];
  const paxCount = booking.passengers.length;
  const airline = booking.departureFlight.airline;
  const fltNo = booking.departureFlight.flightNumber;
  const fromCode = booking.departureFlight.origin.code;
  const fromCity = booking.departureFlight.origin.city;
  const toCode = booking.departureFlight.destination.code;
  const toCity = booking.departureFlight.destination.city;

  const passengersList = booking.passengers
    .map((p, idx) => `  ${idx + 1}. *${p.title} ${p.firstName} ${p.lastName}* (Seat: ${p.seatNumber || 'Standard'} | Meal: ${p.mealPreference || 'Standard'})`)
    .join('\n');

  const lines = [
    `✈️ *MMS TOURS & TRAVELS - FLIGHT ITINERARY CONFIRMATION*`,
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    `Dear ${primaryPax ? `${primaryPax.title} ${primaryPax.lastName}` : 'Valued Passenger'},`,
    `Thank you for booking with MMS Tours & Travels. Your booking itinerary is confirmed:`,
    ``,
    `📌 *Booking Reference (PNR):* *${booking.pnr}*`,
    `🎫 *E-Ticket Number:* ${booking.eticketNumber}`,
    `⚡ *Booking Status:* ${booking.bookingStatus}`,
    `👥 *Total Passengers:* ${paxCount}`,
    ``,
    `👤 *Passenger Details:*`,
    passengersList,
    ``,
    `🛫 *DEPARTURE FLIGHT DETAILS:*`,
    `• Airline: *${airline}* (${fltNo})`,
    `• Route: *${fromCity} (${fromCode})* ➔ *${toCity} (${toCode})*`,
    `• Date & Time: *${booking.departureFlight.departureDate}* at *${booking.departureFlight.departureTime}*`,
    `• Arrival: *${booking.departureFlight.arrivalDate}* at *${booking.departureFlight.arrivalTime}*`,
    `• Terminal / Gate: *Terminal ${booking.departureFlight.terminalDep}*, *Gate ${booking.departureFlight.gate}*`,
    `• Cabin Class: *${booking.cabinClass.toUpperCase()}*`,
    `• Stops: *${booking.departureFlight.stops === 0 ? 'Non-Stop' : `${booking.departureFlight.stops} Stop(s)`}*`,
  ];

  if (booking.returnFlight) {
    lines.push(
      ``,
      `🛬 *RETURN FLIGHT DETAILS:*`,
      `• Airline: *${booking.returnFlight.airline}* (${booking.returnFlight.flightNumber})`,
      `• Route: *${booking.returnFlight.origin.code}* ➔ *${booking.returnFlight.destination.code}*`,
      `• Date & Time: *${booking.returnFlight.departureDate}* at *${booking.returnFlight.departureTime}*`,
      `• Terminal: *Terminal ${booking.returnFlight.terminalDep}*`
    );
  }

  lines.push(
    ``,
    `💳 *BAGGAGE & PAYMENT:*`,
    `• Check-in Baggage: 2x 23kg Included`,
    `• Cabin Baggage: 1x 7kg Included`,
    `• Total Amount: USD $${booking.totalPriceUSD} (${booking.paymentStatus})`,
    ``,
    `📲 *MOBILE CHECK-IN & BOARDING:*`,
    `Please present your PNR or digital QR Boarding Pass at airport check-in desks and security kiosks.`
  );

  if (staffNote && staffNote.trim()) {
    lines.push(
      ``,
      `📝 *Special Notice / Staff Note:*`,
      staffNote.trim()
    );
  }

  lines.push(
    ``,
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    `📞 *MMS 24x7 Customer Care Desk:*`,
    `• Phone: ${CONTACT_NUMBERS.ticket.formatted}`,
    `• Email: support@mmstravels.com`,
    `• Web: mmstravels.com`,
    `Have a wonderful, safe flight!`
  );

  return lines.join('\n');
}

/**
 * Builds direct WhatsApp URL to send flight confirmation to passenger or staff
 */
export function getBookingWhatsAppUrl(booking: Booking, customPhone?: string, staffNote?: string): string {
  const targetPhone = customPhone || booking.contactPhone || CONTACT_NUMBERS.ticket.number;
  const cleanPhone = cleanPhoneForWhatsApp(targetPhone);
  const message = formatBookingWhatsAppText(booking, staffNote);
  return `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(message)}`;
}

/**
 * Builds formatted message for Visa Enquiry Form Submission
 */
export function formatVisaEnquiryWhatsAppText(visa: VisaEnquiryFormData, staffNote?: string): string {
  const ref = visa.referenceNumber || `MMS-VISA-${Date.now().toString().slice(-8)}`;
  const dateStr = visa.createdAt || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

  const lines = [
    `🛂 *MMS TOURS & TRAVELS - VISA ENQUIRY SUBMISSION*`,
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    `📌 *Enquiry Reference:* *${ref}*`,
    `📅 *Submission Date:* ${dateStr}`,
    `⚡ *Status:* ${visa.status || 'RECEIVED / UNDER VERIFICATION'}`,
    ``,
    `🌍 *VISA REQUIREMENTS:*`,
    `• Destination Country: *${visa.destinationCountry}*`,
    `• Visa Type: *${visa.visaType}*`,
    `• Duration: *${visa.duration}*`,
    `• Entry Type: *${visa.entryType} Entry*`,
    `• Number of Applicants: *${visa.numberOfApplicants}*`,
    `• Estimated B2B Charges: *${visa.charges}*`,
    ``,
    `👤 *PRIMARY APPLICANT DETAILS (AS IN PASSPORT):*`,
    `• Given Name: *${visa.givenName}*`,
    `• Surname: *${visa.surname}*`,
    `• Gender: ${visa.gender} | Age: ${visa.age}`,
    `• Date of Birth: ${visa.dateOfBirth}`,
    `• Nationality: *${visa.nationality}*`,
    `• Place of Birth: ${visa.placeOfBirth}`,
    `• Dual Nationality: ${visa.holdingDualNationality}`,
    `• Marital Status: ${visa.maritalStatus}`,
    `• Employment Status: *${visa.employment}*`,
    `• 3-Year ITR Filed: *${visa.have3YearsItr}*`,
    ``,
    `📍 *RESIDENCE & CONTACT:*`,
    `• Mobile Number: *${visa.mobileNumber}*`,
    `• Email ID: *${visa.emailId}*`,
    `• Address: ${visa.address}`,
    `• City: ${visa.city}, PIN: ${visa.pinCode}, Country: ${visa.country}`,
    ``,
    `📁 *VERIFIED DOCUMENTS ATTACHED:*`,
    `• Passport 1st Page: ${visa.passportFirstPageFile ? `✅ ${visa.passportFirstPageFile}` : 'Pending Upload'}`,
    `• Passport Last Page: ${visa.passportLastPageFile ? `✅ ${visa.passportLastPageFile}` : 'Pending Upload'}`,
    `• PAN Card: ${visa.panCardFile ? `✅ ${visa.panCardFile}` : 'Pending Upload'}`,
    `• White Background Photo: ${visa.photoWhiteBgFile ? `✅ ${visa.photoWhiteBgFile}` : 'Pending Upload'}`,
    `• Ticket Copy: ${visa.ticketCopyFile ? `✅ ${visa.ticketCopyFile}` : 'Optional / Not Provided'}`,
  ];

  if (visa.remark && visa.remark.trim()) {
    lines.push(
      ``,
      `📝 *Client Remarks:*`,
      visa.remark.trim()
    );
  }

  if (staffNote && staffNote.trim()) {
    lines.push(
      ``,
      `💼 *Operational Desk Note:*`,
      staffNote.trim()
    );
  }

  lines.push(
    ``,
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    `✨ *MMS Global Visa Processing Desk*`,
    `• Visa Helpline: ${CONTACT_NUMBERS.visa.formatted}`,
    `• WhatsApp Support: ${CONTACT_NUMBERS.services.formatted}`,
    `Note: B2B charges are subject to embassy regulation updates.`
  );

  return lines.join('\n');
}

/**
 * Builds direct WhatsApp URL for Visa Enquiry
 * If targetPhone is omitted, sends to the applicant's mobile number,
 * or MMS Visa Desk (+91 93845 67442).
 */
export function getVisaEnquiryWhatsAppUrl(visa: VisaEnquiryFormData, targetPhone?: string, staffNote?: string): string {
  const chosenPhone = targetPhone || visa.mobileNumber || CONTACT_NUMBERS.visa.number;
  const cleanPhone = cleanPhoneForWhatsApp(chosenPhone);
  const message = formatVisaEnquiryWhatsAppText(visa, staffNote);
  return `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(message)}`;
}

/**
 * Safely opens a WhatsApp URL in a new window/tab
 */
export function openWhatsAppLink(url: string): void {
  try {
    const newWin = window.open(url, '_blank', 'noopener,noreferrer');
    if (!newWin) {
      window.location.href = url;
    }
  } catch (err) {
    window.location.href = url;
  }
}
