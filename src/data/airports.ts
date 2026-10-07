import { Airport, CurrencyCode, CurrencyConfig } from '../types';

export const POPULAR_AIRPORTS: Airport[] = [
  { code: 'DXB', city: 'Dubai', name: 'Dubai International Airport', country: 'United Arab Emirates', terminal: 'T3', timezone: 'UTC+4' },
  { code: 'LHR', city: 'London', name: 'Heathrow Airport', country: 'United Kingdom', terminal: 'T2 / T5', timezone: 'UTC+1' },
  { code: 'JFK', city: 'New York', name: 'John F. Kennedy International', country: 'United States', terminal: 'T4', timezone: 'UTC-4' },
  { code: 'SIN', city: 'Singapore', name: 'Singapore Changi Airport', country: 'Singapore', terminal: 'T3', timezone: 'UTC+8' },
  { code: 'DOH', city: 'Doha', name: 'Hamad International Airport', country: 'Qatar', terminal: 'T1', timezone: 'UTC+3' },
  { code: 'DEL', city: 'New Delhi', name: 'Indira Gandhi International Airport', country: 'India', terminal: 'T3', timezone: 'UTC+5:30' },
  { code: 'BOM', city: 'Mumbai', name: 'Chhatrapati Shivaji Maharaj International', country: 'India', terminal: 'T2', timezone: 'UTC+5:30' },
  { code: 'MAA', city: 'Chennai', name: 'Chennai International Airport', country: 'India', terminal: 'T4', timezone: 'UTC+5:30' },
  { code: 'KUL', city: 'Kuala Lumpur', name: 'Kuala Lumpur International', country: 'Malaysia', terminal: 'KLIA1', timezone: 'UTC+8' },
  { code: 'BKK', city: 'Bangkok', name: 'Suvarnabhumi Airport', country: 'Thailand', terminal: 'T1', timezone: 'UTC+7' },
  { code: 'JED', city: 'Jeddah', name: 'King Abdulaziz International Airport', country: 'Saudi Arabia', terminal: 'Terminal 1', timezone: 'UTC+3' },
  { code: 'RUH', city: 'Riyadh', name: 'King Khalid International Airport', country: 'Saudi Arabia', terminal: 'T3', timezone: 'UTC+3' },
  { code: 'AUH', city: 'Abu Dhabi', name: 'Zayed International Airport', country: 'United Arab Emirates', terminal: 'Terminal A', timezone: 'UTC+4' },
  { code: 'SYD', city: 'Sydney', name: 'Kingsford Smith Airport', country: 'Australia', terminal: 'T1', timezone: 'UTC+10' },
  { code: 'CDG', city: 'Paris', name: 'Charles de Gaulle Airport', country: 'France', terminal: 'T2E', timezone: 'UTC+2' },
  { code: 'FRA', city: 'Frankfurt', name: 'Frankfurt Airport', country: 'Germany', terminal: 'T1', timezone: 'UTC+2' },
  { code: 'CMB', city: 'Colombo', name: 'Bandaranaike International Airport', country: 'Sri Lanka', terminal: 'T1', timezone: 'UTC+5:30' },
  { code: 'DAC', city: 'Dhaka', name: 'Hazrat Shahjalal International Airport', country: 'Bangladesh', terminal: 'T2', timezone: 'UTC+6' },
  { code: 'KHI', city: 'Karachi', name: 'Jinnah International Airport', country: 'Pakistan', terminal: 'T1', timezone: 'UTC+5' },
  { code: 'IST', city: 'Istanbul', name: 'Istanbul Airport', country: 'Turkey', terminal: 'Main', timezone: 'UTC+3' },
  { code: 'YYZ', city: 'Toronto', name: 'Toronto Pearson International', country: 'Canada', terminal: 'T1', timezone: 'UTC-4' },
  { code: 'BLR', city: 'Bengaluru', name: 'Kempegowda International Airport', country: 'India', terminal: 'T2', timezone: 'UTC+5:30' },
  { code: 'COK', city: 'Kochi', name: 'Cochin International Airport', country: 'India', terminal: 'T3', timezone: 'UTC+5:30' },
  { code: 'TRZ', city: 'Tiruchirappalli', name: 'Tiruchirappalli International Airport', country: 'India', terminal: 'T1', timezone: 'UTC+5:30' },
  { code: 'IXM', city: 'Madurai', name: 'Madurai Airport', country: 'India', terminal: 'T1', timezone: 'UTC+5:30' },
  { code: 'KWI', city: 'Kuwait City', name: 'Kuwait International Airport', country: 'Kuwait', terminal: 'T1', timezone: 'UTC+3' },
  { code: 'TRV', city: 'Trivandrum', name: 'Thiruvananthapuram International', country: 'India', terminal: 'T2', timezone: 'UTC+5:30' },
  { code: 'CCJ', city: 'Kozhikode', name: 'Calicut International Airport', country: 'India', terminal: 'T1', timezone: 'UTC+5:30' }
];

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  USD: { code: 'USD', symbol: '$', rate: 1 },
  AED: { code: 'AED', symbol: 'AED ', rate: 3.67 },
  SAR: { code: 'SAR', symbol: 'SAR ', rate: 3.75 },
  INR: { code: 'INR', symbol: '₹', rate: 86.5 },
  GBP: { code: 'GBP', symbol: '£', rate: 0.78 },
  EUR: { code: 'EUR', symbol: '€', rate: 0.92 }
};

export function formatCurrency(amountInUSD: number, currency: CurrencyCode): string {
  const cfg = CURRENCIES[currency] || CURRENCIES.USD;
  const converted = amountInUSD * cfg.rate;
  return `${cfg.symbol}${Math.round(converted).toLocaleString()}`;
}
