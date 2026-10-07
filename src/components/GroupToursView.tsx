import React, { useState } from 'react';
import { 
  Users, 
  MapPin, 
  Star, 
  CheckCircle2, 
  Phone, 
  Calendar, 
  ShieldCheck, 
  ArrowRight,
  Filter,
  Check
} from 'lucide-react';
import { GROUP_TOURS } from '../data/toursData';
import { CurrencyCode, TourPackage } from '../types';
import { formatCurrency } from '../data/airports';

interface GroupToursViewProps {
  currency: CurrencyCode;
  packages?: TourPackage[];
  onSelectPackage: (pkg: TourPackage) => void;
  onOpenEnquiry: (serviceType: any, destPreset?: string) => void;
}

export const GroupToursView: React.FC<GroupToursViewProps> = ({
  currency,
  packages,
  onSelectPackage,
  onOpenEnquiry
}) => {
  // Callback form state matching screenshot 5 & 6
  const [cbTitle, setCbTitle] = useState('Mr.');
  const [cbFirstName, setCbFirstName] = useState('');
  const [cbLastName, setCbLastName] = useState('');
  const [cbMobile, setCbMobile] = useState('');
  const [cbEmail, setCbEmail] = useState('');
  const [cbTravelDate, setCbTravelDate] = useState('');
  const [cbGroupCategory, setCbGroupCategory] = useState('Thailand Group Tour');
  const [cbPax, setCbPax] = useState(4);
  const [cbRemarks, setCbRemarks] = useState('');
  const [cbCaptcha, setCbCaptcha] = useState('');
  const [cbSubmitted, setCbSubmitted] = useState(false);

  // Filter state
  const [priceFilter, setPriceFilter] = useState<number>(50000);
  const [destFilter, setDestFilter] = useState<string>('ALL');

  const allGroupTours = packages ? packages.filter(p => p.category === 'Group') : GROUP_TOURS;

  const filteredGroupTours = allGroupTours.filter(g => {
    if (destFilter !== 'ALL' && !g.destination.toLowerCase().includes(destFilter.toLowerCase())) return false;
    if (g.priceINR > priceFilter) return false;
    return true;
  });

  const handleCallbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCbSubmitted(true);
    setTimeout(() => {
      setCbSubmitted(false);
      setCbFirstName('');
      setCbLastName('');
      setCbMobile('');
      setCbEmail('');
      setCbRemarks('');
      setCbCaptcha('');
    }, 5000);
  };

  const getConvertedPrice = (priceINR: number, priceUSD: number) => {
    if (currency === 'INR') return `₹${priceINR.toLocaleString('en-IN')}`;
    return formatCurrency(priceUSD, currency);
  };

  return (
    <div className="space-y-8">
      
      {/* 1. SCENIC HERO BANNER matching screenshot 5 & 6 */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200">
        <div 
          className="relative min-h-[380px] sm:min-h-[460px] flex flex-col items-center justify-center text-center p-6 sm:p-12 bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(15, 23, 42, 0.25), rgba(15, 23, 42, 0.7)), url('https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=1800&q=80')`
          }}
        >
          <div className="space-y-3">
            <span className="inline-block px-3.5 py-1 rounded-full bg-blue-600/90 text-white font-black text-xs uppercase tracking-widest shadow-md">
              FIXED GROUP DEPARTURES WITH TOUR MANAGER
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight drop-shadow-lg">
              Group Tours Tour Packages!
            </h1>
            <p className="text-slate-100 text-xs sm:text-base font-medium max-w-xl mx-auto drop-shadow">
              Travel together with friends, family, or corporate teams. Inclusive of Indian buffet meals, luxury coach travel, and seasoned multilingual tour leaders.
            </p>
            
            <div className="pt-2">
              <button
                onClick={() => {
                  const elem = document.getElementById('groupEnquirySection');
                  elem?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider shadow-xl transition-all cursor-pointer transform hover:scale-105"
              >
                Request Callback
              </button>
            </div>
          </div>

          <div className="absolute bottom-3 left-6 text-[11px] text-slate-300 font-mono">
            Category / Group-Tours
          </div>
        </div>
      </div>

      {/* 2. SIDEBAR FILTER & CALLBACK SECTION matching screenshot 5 & 6 */}
      <div id="groupEnquirySection" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Filter Bar matching screenshot */}
        <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-blue-600" />
              Filter Packages
            </h4>
            <button 
              onClick={() => { setDestFilter('ALL'); setPriceFilter(50000); }}
              className="text-[11px] text-blue-600 font-bold hover:underline"
            >
              Reset
            </button>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Destination</label>
              <select
                value={destFilter}
                onChange={(e) => setDestFilter(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg outline-none bg-white font-medium"
              >
                <option value="ALL">All Destinations</option>
                <option value="Thailand">Thailand (Bangkok & Pattaya)</option>
                <option value="Dubai">Dubai & Abu Dhabi</option>
                <option value="Kashmir">Kashmir (Srinagar & Gulmarg)</option>
              </select>
            </div>

            <div>
              <div className="flex justify-between font-bold text-slate-700 mb-1">
                <span>Max Budget per person:</span>
                <span className="font-mono text-blue-600">₹{priceFilter.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min="20000"
                max="50000"
                step="2000"
                value={priceFilter}
                onChange={(e) => setPriceFilter(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-2 text-[11px] text-slate-600">
              <div className="font-bold text-slate-800">Group Perks Included:</div>
              <div className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-600" /> Dedicated Tour Director</div>
              <div className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-600" /> Guaranteed Indian Chef Meals</div>
              <div className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-600" /> Group Airfare & Hotel Blocked</div>
            </div>
          </div>
        </div>

        {/* Right Form: "We are here to serve you in the best way" matching screenshot */}
        <div className="lg:col-span-8 bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-black text-base text-slate-900">
              We are here to serve you in the best way
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              We would like to understand your plans and assist you with the right strategic advice for best group tour package.
            </p>
          </div>

          {cbSubmitted ? (
            <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <h4 className="font-bold text-sm text-slate-900">Callback Request Registered!</h4>
              <p className="text-xs text-slate-600">
                Our group tour manager will call you shortly at <strong className="text-slate-900">{cbMobile}</strong>.
              </p>
            </div>
          ) : (
            <form onSubmit={handleCallbackSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-12 gap-2">
                <div className="col-span-3 sm:col-span-2">
                  <select
                    value={cbTitle}
                    onChange={(e) => setCbTitle(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg outline-none bg-white font-medium"
                  >
                    <option value="Mr.">Mr.</option>
                    <option value="Mrs.">Mrs.</option>
                    <option value="Ms.">Ms.</option>
                  </select>
                </div>
                <div className="col-span-5 sm:col-span-5">
                  <input
                    type="text"
                    required
                    placeholder="First Name *"
                    value={cbFirstName}
                    onChange={(e) => setCbFirstName(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg outline-none font-medium"
                  />
                </div>
                <div className="col-span-4 sm:col-span-5">
                  <input
                    type="text"
                    required
                    placeholder="Last Name *"
                    value={cbLastName}
                    onChange={(e) => setCbLastName(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg outline-none font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="flex">
                  <span className="inline-flex items-center px-2.5 rounded-l-lg border border-r-0 border-slate-300 bg-slate-100 font-bold text-slate-700">
                    🇮🇳 +91
                  </span>
                  <input
                    type="tel"
                    required
                    placeholder="Mobile *"
                    value={cbMobile}
                    onChange={(e) => setCbMobile(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-r-lg outline-none font-medium"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    required
                    placeholder="Email Id *"
                    value={cbEmail}
                    onChange={(e) => setCbEmail(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg outline-none font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Travel Date</label>
                  <input
                    type="date"
                    required
                    value={cbTravelDate}
                    onChange={(e) => setCbTravelDate(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg outline-none font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Group Tour Package</label>
                  <select
                    value={cbGroupCategory}
                    onChange={(e) => setCbGroupCategory(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white outline-none font-medium"
                  >
                    <option value="Thailand Group Tour">Thailand Group Tour (Bangkok & Pattaya)</option>
                    <option value="Dubai Shopping Festival Special">Dubai Shopping Festival Special</option>
                    <option value="Kashmir Family & Friends Group">Kashmir Family & Friends Group</option>
                    <option value="Custom Corporate Group">Custom Corporate / Association Tour</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-0.5">No of Pax</label>
                  <input
                    type="number"
                    min={2}
                    max={200}
                    required
                    value={cbPax}
                    onChange={(e) => setCbPax(Number(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded-lg outline-none font-medium"
                  />
                </div>
              </div>

              <div>
                <textarea
                  rows={2}
                  placeholder="Remarks..."
                  value={cbRemarks}
                  onChange={(e) => setCbRemarks(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg outline-none font-medium"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Captcha code *"
                    required
                    value={cbCaptcha}
                    onChange={(e) => setCbCaptcha(e.target.value)}
                    className="w-28 p-2 border border-slate-300 rounded-lg outline-none font-medium"
                  />
                  <span className="bg-slate-200 text-slate-800 font-mono font-black px-3 py-1.5 rounded tracking-widest select-none">
                    5 C B F 7
                  </span>
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Send Enquiry
                </button>
              </div>
            </form>
          )}

        </div>

      </div>

      {/* 3. GROUP PACKAGES CARDS */}
      <div className="space-y-4 pt-4">
        <h3 className="text-xl font-black text-slate-900">Featured Group Tour Itineraries</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredGroupTours.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group"
            >
              <div className="relative aspect-16/10 overflow-hidden">
                <img
                  src={pkg.imageUrl}
                  alt={pkg.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 bg-blue-600 text-white text-[11px] font-black px-2.5 py-1 rounded-full">
                  {pkg.duration}
                </div>
                <div className="absolute top-3 right-3 bg-amber-400 text-slate-950 text-[11px] font-black px-2 py-0.5 rounded-md flex items-center gap-1">
                  <Star className="w-3 h-3 fill-slate-950" /> {pkg.rating}
                </div>
              </div>

              <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1 text-xs text-blue-600 font-bold uppercase tracking-wider">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{pkg.destination}</span>
                  </div>
                  <h3 className="font-black text-base text-slate-900 mt-1 leading-snug">
                    {pkg.title}
                  </h3>

                  <div className="mt-3 space-y-1.5">
                    {pkg.highlights.map((hl, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-xs text-slate-600">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate">{hl}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Group Fixed Price</span>
                    <span className="text-lg font-black text-slate-900 font-mono">
                      {getConvertedPrice(pkg.priceINR, pkg.priceUSD)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onSelectPackage(pkg)}
                      className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold"
                    >
                      Plan
                    </button>
                    <button
                      onClick={() => onOpenEnquiry('Package', pkg.title)}
                      className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs"
                    >
                      Join Group
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
