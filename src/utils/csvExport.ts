import { Booking, FlightInquiry } from '../types';

/**
 * Escapes a cell value for standard CSV formatting (RFC 4180)
 */
function escapeCSV(val: any): string {
  if (val === null || val === undefined) return '""';
  const str = String(val);
  // Replace quotes with double-quotes and wrap in quotes
  return `"${str.replace(/"/g, '""')}"`;
}

/**
 * Triggers a client-side download of a CSV file using a Blob
 */
export function downloadCSV(csvContent: string, fileName: string): void {
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export Bookings list to CSV
 */
export function exportBookingsToCSV(bookings: Booking[], fileName = `MMS_Air_Bookings_${new Date().toISOString().slice(0, 10)}.csv`): void {
  const headers = [
    'Booking Reference (PNR)',
    'E-Ticket Number',
    'Booking Status',
    'Payment Status',
    'Passenger Name',
    'Passenger Type',
    'Contact Email',
    'Contact Phone',
    'Airline',
    'Flight Number',
    'Origin Code',
    'Origin City',
    'Destination Code',
    'Destination City',
    'Departure Date',
    'Departure Time',
    'Arrival Date',
    'Arrival Time',
    'Cabin Class',
    'Seat Number',
    'Meal Preference',
    'Paid Amount',
    'Currency',
    'Payment Method',
    'Travel Insurance',
    'Priority Boarding',
    'Lounge Access',
    'Booked On'
  ];

  const rows = bookings.map(b => {
    const p0 = b.passengers && b.passengers[0];
    const paxName = p0 ? `${p0.title || ''} ${p0.firstName || ''} ${p0.lastName || ''}`.trim() : 'Guest';
    const dep = b.departureFlight;

    return [
      escapeCSV(b.pnr),
      escapeCSV(b.eticketNumber),
      escapeCSV(b.bookingStatus),
      escapeCSV(b.paymentStatus),
      escapeCSV(paxName),
      escapeCSV(p0?.type || 'adult'),
      escapeCSV(b.contactEmail),
      escapeCSV(b.contactPhone),
      escapeCSV(dep?.airline || ''),
      escapeCSV(dep?.flightNumber || ''),
      escapeCSV(dep?.origin?.code || ''),
      escapeCSV(dep?.origin?.city || ''),
      escapeCSV(dep?.destination?.code || ''),
      escapeCSV(dep?.destination?.city || ''),
      escapeCSV(dep?.departureDate || ''),
      escapeCSV(dep?.departureTime || ''),
      escapeCSV(dep?.arrivalDate || ''),
      escapeCSV(dep?.arrivalTime || ''),
      escapeCSV(b.cabinClass || dep?.cabinClass || 'economy'),
      escapeCSV(p0?.seatNumber || 'Unassigned'),
      escapeCSV(p0?.mealPreference || 'Standard'),
      escapeCSV(b.paidAmount),
      escapeCSV(b.currency),
      escapeCSV(b.paymentMethod || ''),
      escapeCSV(b.addOns?.travelInsurance ? 'YES' : 'NO'),
      escapeCSV(b.addOns?.priorityBoarding ? 'YES' : 'NO'),
      escapeCSV(b.addOns?.loungeAccess ? 'YES' : 'NO'),
      escapeCSV(b.createdAt ? new Date(b.createdAt).toLocaleString() : '')
    ].join(',');
  });

  const csvContent = [headers.join(','), ...rows].join('\r\n');
  downloadCSV(csvContent, fileName);
}

/**
 * Export Inquiries list to CSV
 */
export function exportInquiriesToCSV(inquiries: FlightInquiry[], fileName = `MMS_Customer_Inquiries_${new Date().toISOString().slice(0, 10)}.csv`): void {
  const headers = [
    'Reference / Token',
    'Case ID',
    'Service Type',
    'Status',
    'Customer Name',
    'Phone',
    'WhatsApp',
    'Email',
    'Route / Service Summary',
    'Trip Type',
    'Departure Date',
    'Return Date',
    'Adults',
    'Children',
    'Infants',
    'Quoted Price (USD)',
    'Assigned Staff',
    'Assigned Branch',
    'Customer Notes',
    'Admin Notes',
    'Created Date'
  ];

  const rows = inquiries.map(inq => {
    return [
      escapeCSV(inq.token || inq.referenceNumber || inq.id),
      escapeCSV(inq.caseId || ''),
      escapeCSV(inq.serviceType || 'Flight'),
      escapeCSV(inq.status),
      escapeCSV(inq.leadPassenger?.fullName || ''),
      escapeCSV(inq.leadPassenger?.phone || ''),
      escapeCSV(inq.leadPassenger?.whatsapp || ''),
      escapeCSV(inq.leadPassenger?.email || ''),
      escapeCSV(inq.routeSummary || inq.serviceName || ''),
      escapeCSV(inq.tripType || ''),
      escapeCSV(inq.departureDate || inq.flight?.departureDate || ''),
      escapeCSV(inq.returnDate || ''),
      escapeCSV(inq.passengers?.adults ?? 1),
      escapeCSV(inq.passengers?.children ?? 0),
      escapeCSV(inq.passengers?.infants ?? 0),
      escapeCSV(inq.quotedPriceUSD ?? ''),
      escapeCSV(inq.assignedStaffName || 'Unassigned'),
      escapeCSV(inq.assignedBranch || 'Adirampattinam HQ'),
      escapeCSV(inq.notes || ''),
      escapeCSV(inq.adminNotes || ''),
      escapeCSV(inq.createdAt ? new Date(inq.createdAt).toLocaleString() : '')
    ].join(',');
  });

  const csvContent = [headers.join(','), ...rows].join('\r\n');
  downloadCSV(csvContent, fileName);
}
