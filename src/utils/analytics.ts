/**
 * MMS Air Travels - Privacy-Preserving Client Analytics & Telemetry
 * Integrates with standard dataLayer (Google Analytics 4, Tag Manager) when present,
 * and maintains local event logging for user interaction insights.
 */

export interface AnalyticsEvent {
  category: string;
  action: string;
  label?: string;
  value?: number;
  timestamp: string;
}

const STORAGE_KEY = 'mms_analytics_events';
const CONSENT_KEY = 'mms_cookie_consent';

// Check if user allowed analytics cookies
export function hasAnalyticsConsent(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (!raw) return true; // Default to friendly analytics unless opted out
    const parsed = JSON.parse(raw);
    return parsed.analytics !== false;
  } catch {
    return true;
  }
}

/**
 * Record a page or tab view
 */
export function trackPageView(pageName: string, path: string = window.location.pathname) {
  if (!hasAnalyticsConsent()) return;

  const title = `MMS Air Travels - ${pageName}`;
  
  // Forward to standard GTM/GA4 dataLayer if available
  if (typeof window !== 'undefined') {
    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).dataLayer.push({
      event: 'page_view',
      page_title: title,
      page_location: window.location.href,
      page_path: `${path}#${pageName}`
    });
  }

  logLocalEvent('Navigation', 'View_Tab', pageName);
}

/**
 * Track custom user interactions (booking search, CTA click, inquiry)
 */
export function trackEvent(category: string, action: string, label?: string, value?: number) {
  if (!hasAnalyticsConsent()) return;

  if (typeof window !== 'undefined') {
    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).dataLayer.push({
      event: 'custom_event',
      event_category: category,
      event_action: action,
      event_label: label,
      value: value
    });
  }

  logLocalEvent(category, action, label, value);
}

/**
 * Track flight searches
 */
export function trackFlightSearch(origin: string, destination: string, tripType: string, date: string) {
  trackEvent('Flight_Search', 'Submit', `${origin} -> ${destination} | ${tripType} | ${date}`);
}

/**
 * Track user enquiry submissions
 */
export function trackEnquirySubmission(serviceType: string, details?: string) {
  trackEvent('Enquiry', 'Submit_Success', `${serviceType}: ${details || 'General'}`);
}

/**
 * Track social sharing
 */
export function trackSocialShare(platform: string, url: string) {
  trackEvent('Social_Share', platform, url);
}

function logLocalEvent(category: string, action: string, label?: string, value?: number) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const events: AnalyticsEvent[] = raw ? JSON.parse(raw) : [];
    
    // Keep last 50 events in local storage for diagnostics
    const newEvent: AnalyticsEvent = {
      category,
      action,
      label,
      value,
      timestamp: new Date().toISOString()
    };
    
    events.unshift(newEvent);
    if (events.length > 50) events.pop();
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  } catch (e) {
    // Fail silently in restricted sandbox
  }
}
