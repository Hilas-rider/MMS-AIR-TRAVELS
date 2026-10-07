import React, { useState } from 'react';
import { 
  X, 
  Share2, 
  Copy, 
  Check, 
  Mail, 
  Send,
  MessageCircle,
  ExternalLink
} from 'lucide-react';
import { trackSocialShare } from '../utils/analytics';

interface SocialShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  url?: string;
  description?: string;
}

export const SocialShareModal: React.FC<SocialShareModalProps> = ({
  isOpen,
  onClose,
  title = "MMS Air Travels & Cargo Service | Luxury Aviation & Travel Concierge",
  url = typeof window !== 'undefined' ? window.location.href : "https://ais-dev-j436qujib4lztsudgi3rie-551004305739.asia-southeast1.run.app",
  description = "Book flights, wholesale group fares, passport seva filings, and live air cargo tracking with MMS Air Travels."
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(`${title} — ${description}`);

  const handleCopy = () => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      trackSocialShare('Copy_Clipboard', url);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const shareOptions = [
    {
      name: 'WhatsApp',
      color: 'bg-emerald-600 hover:bg-emerald-700 text-white',
      icon: <MessageCircle className="w-5 h-5" />,
      action: () => {
        trackSocialShare('WhatsApp', url);
        window.open(`https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`, '_blank');
      }
    },
    {
      name: 'Twitter / X',
      color: 'bg-slate-900 hover:bg-black text-white',
      icon: <span className="font-bold text-base leading-none">𝕏</span>,
      action: () => {
        trackSocialShare('Twitter', url);
        window.open(`https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`, '_blank');
      }
    },
    {
      name: 'Facebook',
      color: 'bg-blue-600 hover:bg-blue-700 text-white',
      icon: <span className="font-bold text-base leading-none">f</span>,
      action: () => {
        trackSocialShare('Facebook', url);
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, '_blank');
      }
    },
    {
      name: 'LinkedIn',
      color: 'bg-sky-700 hover:bg-sky-800 text-white',
      icon: <span className="font-bold text-base leading-none">in</span>,
      action: () => {
        trackSocialShare('LinkedIn', url);
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`, '_blank');
      }
    },
    {
      name: 'Telegram',
      color: 'bg-sky-500 hover:bg-sky-600 text-white',
      icon: <Send className="w-4 h-4" />,
      action: () => {
        trackSocialShare('Telegram', url);
        window.open(`https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`, '_blank');
      }
    },
    {
      name: 'Email',
      color: 'bg-slate-700 hover:bg-slate-800 text-white',
      icon: <Mail className="w-4 h-4" />,
      action: () => {
        trackSocialShare('Email', url);
        window.location.href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodedText}%0A%0A${encodedUrl}`;
      }
    }
  ];

  return (
    <div 
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-6 text-slate-900 space-y-5 animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#006097] flex items-center justify-center">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 id="share-modal-title" className="text-base font-bold text-slate-900">
                Share with Friends & Family
              </h3>
              <p className="text-xs text-slate-500">
                Send flight offers, cargo links, or visa itineraries
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Close share modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Share buttons grid */}
        <div className="grid grid-cols-3 gap-2.5">
          {shareOptions.map((opt) => (
            <button
              key={opt.name}
              onClick={opt.action}
              className={`p-3 rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all transform hover:-translate-y-0.5 cursor-pointer shadow-sm ${opt.color}`}
            >
              {opt.icon}
              <span className="text-[11px] font-semibold">{opt.name}</span>
            </button>
          ))}
        </div>

        {/* Copy Link Input Bar */}
        <div className="space-y-1.5 pt-2">
          <label className="text-xs font-semibold text-slate-600 block">
            Direct Web Link
          </label>
          <div className="flex items-center gap-2 p-1.5 bg-slate-50 rounded-xl border border-slate-200">
            <input 
              type="text" 
              readOnly 
              value={url} 
              className="bg-transparent text-xs text-slate-700 px-2 flex-1 focus:outline-none font-mono select-all"
            />
            <button
              onClick={handleCopy}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                copied 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-[#006097] hover:bg-[#007abd] text-white'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
