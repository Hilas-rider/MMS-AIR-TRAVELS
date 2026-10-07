import React, { useState, useEffect } from 'react';
import { MessageSquare, Phone, Copy, Check, Send, AlertCircle, Sparkles, X } from 'lucide-react';
import { Booking, VisaEnquiryFormData } from '../types';
import { 
  formatBookingWhatsAppText, 
  getBookingWhatsAppUrl, 
  formatVisaEnquiryWhatsAppText, 
  getVisaEnquiryWhatsAppUrl, 
  openWhatsAppLink,
  cleanPhoneForWhatsApp 
} from '../utils/whatsappHelper';

interface WhatsAppDispatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking?: Booking;
  visaData?: VisaEnquiryFormData;
  defaultPhone?: string;
  recipientLabel?: string;
  onSuccessToast?: (msg: string) => void;
}

export const WhatsAppDispatchModal: React.FC<WhatsAppDispatchModalProps> = ({
  isOpen,
  onClose,
  booking,
  visaData,
  defaultPhone = '',
  recipientLabel = 'Passenger Phone Number',
  onSuccessToast
}) => {
  const initialPhone = defaultPhone || booking?.contactPhone || visaData?.mobileNumber || '';
  const [phoneNumber, setPhoneNumber] = useState(initialPhone);
  const [staffNote, setStaffNote] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setPhoneNumber(defaultPhone || booking?.contactPhone || visaData?.mobileNumber || '');
      setStaffNote('');
    }
  }, [isOpen, defaultPhone, booking, visaData]);

  if (!isOpen) return null;

  // Determine current preview text
  const previewText = booking 
    ? formatBookingWhatsAppText(booking, staffNote)
    : visaData 
      ? formatVisaEnquiryWhatsAppText(visaData, staffNote) 
      : '';

  const cleanPhone = cleanPhoneForWhatsApp(phoneNumber);

  const handleSend = () => {
    let url = '';
    if (booking) {
      url = getBookingWhatsAppUrl(booking, phoneNumber, staffNote);
    } else if (visaData) {
      url = getVisaEnquiryWhatsAppUrl(visaData, phoneNumber, staffNote);
    }

    if (url) {
      openWhatsAppLink(url);
      if (onSuccessToast) {
        onSuccessToast(`Opening WhatsApp for +${cleanPhone}...`);
      }
      onClose();
    }
  };

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(previewText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    if (onSuccessToast) {
      onSuccessToast('Itinerary message copied to clipboard!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-emerald-600 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-200 block">
                AUTOMATED WHATSAPP DISPATCH
              </span>
              <h3 className="font-extrabold text-base text-white">
                {booking ? `Send Flight Itinerary (PNR: ${booking.pnr})` : 'Send Visa Enquiry Confirmation'}
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-emerald-700/60 hover:bg-emerald-700 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {/* Target Phone Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                <span>{recipientLabel}</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                WhatsApp API format: {cleanPhone ? `+${cleanPhone}` : 'Required'}
              </span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="e.g. +91 94431 82910 or 9876543210"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
              />
            </div>
            <p className="text-[10px] text-slate-500">
              * The message will be dispatched directly to this WhatsApp contact. 10-digit Indian numbers are automatically formatted with +91 country code.
            </p>
          </div>

          {/* Optional Staff / Dispatcher Note */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">
              Custom Agent Note (Optional)
            </label>
            <input
              type="text"
              value={staffNote}
              onChange={(e) => setStaffNote(e.target.value)}
              placeholder="e.g. Please arrive 3 hours before departure for international flights."
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Message Preview */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span>Automated WhatsApp Message Preview:</span>
              <button
                type="button"
                onClick={handleCopyMessage}
                className="text-emerald-700 hover:text-emerald-800 flex items-center gap-1 text-[11px] font-semibold"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied!' : 'Copy Text'}</span>
              </button>
            </div>
            <div className="bg-slate-900 text-slate-100 rounded-2xl p-4 font-mono text-[11px] max-h-48 overflow-y-auto whitespace-pre-wrap leading-relaxed border border-slate-800 selection:bg-emerald-500 selection:text-white">
              {previewText}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSend}
            disabled={!phoneNumber.trim()}
            className="flex-1 max-w-xs py-2.5 px-5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>Open WhatsApp & Send</span>
          </button>
        </div>
      </div>
    </div>
  );
};
