import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Booking, VisaEnquiryFormData, FlightInquiry } from '../types';

// Read client environment variables
const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.trim();
const SUPABASE_ANON_KEY = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined)?.trim();

let supabaseInstance: SupabaseClient | null = null;

/**
 * Returns true if both VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are present
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(
    SUPABASE_URL && 
    SUPABASE_ANON_KEY && 
    SUPABASE_URL.startsWith('http') && 
    !SUPABASE_URL.includes('your-project-id') &&
    SUPABASE_ANON_KEY.length > 20
  );
}

/**
 * Gets or initializes the Supabase client singleton
 */
export function getSupabaseClient(): SupabaseClient | null {
  if (!isSupabaseConfigured()) {
    return null;
  }

  if (!supabaseInstance && SUPABASE_URL && SUPABASE_ANON_KEY) {
    try {
      supabaseInstance = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: {
          persistSession: true,
          autoRefreshToken: true
        }
      });
    } catch (err) {
      console.warn('[Supabase] Failed to initialize Supabase client:', err);
      supabaseInstance = null;
    }
  }

  return supabaseInstance;
}

/**
 * Returns sanitized config status for UI indicators
 */
export function getSupabaseConfigStatus(): {
  isConfigured: boolean;
  projectUrl: string | null;
} {
  const configured = isSupabaseConfigured();
  return {
    isConfigured: configured,
    projectUrl: configured && SUPABASE_URL ? SUPABASE_URL.replace(/https:\/\/(.*?)\.supabase\.co.*/, '$1.supabase.co') : null
  };
}

/**
 * Tests live connection to Supabase database
 */
export async function testSupabaseConnection(): Promise<{ success: boolean; message: string }> {
  const client = getSupabaseClient();
  if (!client) {
    return {
      success: false,
      message: 'Supabase credentials (VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY) not configured.'
    };
  }

  try {
    const { error } = await client
      .from('fares')
      .select('id', { count: 'exact', head: true });

    if (error) {
      // Table might not exist yet if schema wasn't run
      if (error.code === '42P01') {
        return {
          success: false,
          message: 'Connected to Supabase project, but tables are missing. Please run supabase-schema.sql in your Supabase SQL Editor.'
        };
      }
      return {
        success: false,
        message: `Supabase error: ${error.message} (${error.code || 'unknown'})`
      };
    }

    return {
      success: true,
      message: 'Successfully connected to Supabase PostgreSQL database!'
    };
  } catch (err: any) {
    return {
      success: false,
      message: `Connection failed: ${err.message || 'Unknown network error'}`
    };
  }
}

/**
 * Inserts a Visa Enquiry into Supabase
 */
export async function insertVisaEnquiryToSupabase(data: VisaEnquiryFormData): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const payload = {
      reference_number: data.referenceNumber,
      visa_type: data.visaType,
      destination_country: data.destinationCountry,
      duration: data.duration,
      entry_type: data.entryType,
      number_of_applicants: data.numberOfApplicants,
      mobile_number: data.mobileNumber,
      email_id: data.emailId,
      surname: data.surname,
      given_name: data.givenName,
      gender: data.gender,
      date_of_birth: data.dateOfBirth,
      age: data.age?.toString(),
      nationality: data.nationality,
      place_of_birth: data.placeOfBirth,
      holding_dual_nationality: data.holdingDualNationality,
      marital_status: data.maritalStatus,
      employment: data.employment,
      have_3_years_itr: data.have3YearsItr,
      address: data.address,
      city: data.city,
      pin_code: data.pinCode,
      country: data.country,
      passport_first_page_file: data.passportFirstPageFile,
      passport_last_page_file: data.passportLastPageFile,
      pan_card_file: data.panCardFile,
      photo_white_bg_file: data.photoWhiteBgFile,
      ticket_copy_file: data.ticketCopyFile,
      remark: data.remark,
      charges: data.charges,
      status: data.status || 'RECEIVED'
    };

    const { error } = await client
      .from('visa_enquiries')
      .insert([payload]);

    if (error) {
      console.warn('[Supabase] Visa insert error:', error.message);
      return false;
    }

    return true;
  } catch (err) {
    console.warn('[Supabase] Failed to persist visa enquiry:', err);
    return false;
  }
}

/**
 * Inserts or updates a Flight Booking in Supabase
 */
export async function insertBookingToSupabase(booking: Booking): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const primaryPax = booking.passengers[0];
    const customerName = primaryPax ? `${primaryPax.firstName} ${primaryPax.lastName}` : 'Valued Passenger';

    const payload = {
      id: booking.id,
      pnr: booking.pnr,
      eticket_number: booking.eticketNumber,
      trip_type: booking.tripType,
      cabin_class: booking.cabinClass,
      fare_tier: booking.fareTier,
      customer_name: customerName,
      contact_email: booking.contactEmail,
      contact_phone: booking.contactPhone,
      airline: booking.departureFlight.airline,
      flight_number: booking.departureFlight.flightNumber,
      origin_code: booking.departureFlight.origin.code,
      origin_city: booking.departureFlight.origin.city,
      origin_name: booking.departureFlight.origin.name,
      dest_code: booking.departureFlight.destination.code,
      dest_city: booking.departureFlight.destination.city,
      dest_name: booking.departureFlight.destination.name,
      departure_date: booking.departureFlight.departureDate,
      departure_time: booking.departureFlight.departureTime,
      arrival_date: booking.departureFlight.arrivalDate,
      arrival_time: booking.departureFlight.arrivalTime,
      terminal_dep: booking.departureFlight.terminalDep,
      terminal_arr: booking.departureFlight.terminalArr,
      gate: booking.departureFlight.gate,
      flight_status: booking.departureFlight.status,
      passengers: booking.passengers,
      add_ons: booking.addOns,
      total_price_usd: booking.totalPriceUSD,
      paid_amount: booking.paidAmount,
      currency: booking.currency,
      payment_method: booking.paymentMethod,
      payment_status: booking.paymentStatus,
      booking_status: booking.bookingStatus,
      qr_payload: booking.pnr
    };

    const { error } = await client
      .from('bookings')
      .upsert([payload], { onConflict: 'pnr' });

    if (error) {
      console.warn('[Supabase] Booking upsert error:', error.message);
      return false;
    }

    return true;
  } catch (err) {
    console.warn('[Supabase] Failed to persist booking:', err);
    return false;
  }
}

/**
 * Inserts a general flight inquiry into Supabase
 */
export async function insertFlightInquiryToSupabase(inquiry: FlightInquiry): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const paxCount = (inquiry.passengers?.adults || 1) + 
                     (inquiry.passengers?.children || 0) + 
                     (inquiry.passengers?.infants || 0);

    const payload = {
      token: inquiry.token || inquiry.referenceNumber,
      reference_number: inquiry.referenceNumber || inquiry.token,
      service_type: inquiry.serviceType || 'Flight',
      customer_name: inquiry.leadPassenger?.fullName || 'Valued Customer',
      phone: inquiry.leadPassenger?.phone || '',
      email: inquiry.leadPassenger?.email || '',
      origin: inquiry.flight?.origin?.code || 'TRZ',
      destination: inquiry.flight?.destination?.code || 'DXB',
      travel_date: inquiry.departureDate || inquiry.flight?.departureDate || '',
      passengers: paxCount,
      cabin_class: inquiry.flight?.cabinClass || 'Economy',
      budget: inquiry.quotedPriceUSD || 0,
      status: inquiry.status || 'New',
      notes: inquiry.notes || inquiry.routeSummary || ''
    };

    const { error } = await client
      .from('flight_inquiries')
      .insert([payload]);

    if (error) {
      console.warn('[Supabase] Inquiry insert error:', error.message);
      return false;
    }

    return true;
  } catch (err) {
    console.warn('[Supabase] Failed to persist inquiry:', err);
    return false;
  }
}
