/**
 * MMS Air Travels & Cargo - Unified Inquiry Reference Number Generator & Utilities
 * Generates official, human-readable, tracking-ready Reference Numbers for Customer & Admin.
 */

export type InquiryServicePrefix = 
  | 'Flight' 
  | 'GroupFare' 
  | 'Visa' 
  | 'Passport'
  | 'Package' 
  | 'Hotel'
  | 'Cargo' 
  | 'Contact' 
  | 'Miscellaneous'
  | string;

/**
 * Generates an 8-digit numeric Case ID (e.g. 84920173)
 */
export function generate8DigitCaseId(): string {
  return String(Math.floor(10000000 + Math.random() * 90000000));
}

/**
 * Generates an official 8-digit PNR / Booking Reference (e.g. MMS-84920173)
 */
export function generate8DigitPnr(): string {
  const digits = Math.floor(10000000 + Math.random() * 90000000);
  return `MMS-${digits}`;
}

export function generateInquiryReference(serviceType: InquiryServicePrefix = 'Flight'): string {
  let prefix = 'INQ';
  const norm = (serviceType || '').toLowerCase();

  if (norm.includes('flight')) {
    prefix = 'FLT';
  } else if (norm.includes('group')) {
    prefix = 'GRP';
  } else if (norm.includes('visa')) {
    prefix = 'VSA';
  } else if (norm.includes('passport')) {
    prefix = 'PSP';
  } else if (norm.includes('package') || norm.includes('tour')) {
    prefix = 'PKG';
  } else if (norm.includes('cargo') || norm.includes('freight')) {
    prefix = 'CRG';
  } else if (norm.includes('contact') || norm.includes('message')) {
    prefix = 'CNT';
  } else if (norm.includes('hotel')) {
    prefix = 'HTL';
  } else if (norm.includes('attestation') || norm.includes('apostille')) {
    prefix = 'ATT';
  } else if (norm.includes('transfer') || norm.includes('cab')) {
    prefix = 'TRF';
  }

  // 8-digit random integer (10000000 - 99999999) as requested
  const code = Math.floor(10000000 + Math.random() * 90000000);
  return `MMS-${prefix}-${code}`;
}

/**
 * Robust copy helper with document.execCommand fallback for iframe sandboxes
 */
export async function copyTextToClipboard(text: string): Promise<boolean> {
  if (!text) return false;
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Continue to fallback
  }

  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch (err) {
    console.error('Failed to copy text', err);
    return false;
  }
}
