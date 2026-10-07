import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Upload, 
  CheckCircle2, 
  MessageSquare, 
  Send, 
  Printer, 
  Download, 
  AlertCircle,
  Copy,
  Check,
  ShieldCheck,
  Globe,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { VisaEnquiryFormData } from '../types';
import { 
  getVisaEnquiryWhatsAppUrl, 
  formatVisaEnquiryWhatsAppText, 
  openWhatsAppLink 
} from '../utils/whatsappHelper';
import { CONTACT_NUMBERS } from '../data/contactInfo';
import { insertVisaEnquiryToSupabase, isSupabaseConfigured } from '../lib/supabase';

interface VisaEnquiryFormProps {
  initialCountry?: string;
  initialVisaType?: 'Tourist' | 'Business';
  onSubmitSuccess?: (data: VisaEnquiryFormData) => void;
  className?: string;
}

export const VisaEnquiryForm: React.FC<VisaEnquiryFormProps> = ({
  initialCountry = '',
  initialVisaType = 'Tourist',
  onSubmitSuccess,
  className = ''
}) => {
  // Form State matching image.png exactly
  const [visaType, setVisaType] = useState<'Tourist' | 'Business'>(initialVisaType);
  const [destinationCountry, setDestinationCountry] = useState(initialCountry || '');
  const [duration, setDuration] = useState('');
  const [entryType, setEntryType] = useState<'Single' | 'Multiple'>('Single');
  const [numberOfApplicants, setNumberOfApplicants] = useState<number>(1);

  const [mobileNumber, setMobileNumber] = useState('');
  const [emailId, setEmailId] = useState('');

  const [surname, setSurname] = useState('');
  const [givenName, setGivenName] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [age, setAge] = useState<string>('');

  const [nationality, setNationality] = useState('Indian');
  const [placeOfBirth, setPlaceOfBirth] = useState('');
  const [holdingDualNationality, setHoldingDualNationality] = useState<'Yes' | 'No'>('No');
  const [maritalStatus, setMaritalStatus] = useState<'Single' | 'Married' | 'Divorced' | 'Widowed'>('Single');
  const [employment, setEmployment] = useState<'Salaried' | 'Self-Employed' | 'Business' | 'Student' | 'Retired' | 'Unemployed'>('Salaried');

  const [have3YearsItr, setHave3YearsItr] = useState<'Yes' | 'No'>('No');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [country, setCountry] = useState('India');

  // Document file names (mocked from file inputs)
  const [passportFirstPage, setPassportFirstPage] = useState<string>('');
  const [passportLastPage, setPassportLastPage] = useState<string>('');
  const [panCard, setPanCard] = useState<string>('');
  const [photoWhiteBg, setPhotoWhiteBg] = useState<string>('');
  const [ticketCopy, setTicketCopy] = useState<string>('');

  const [remark, setRemark] = useState('');
  const [charges, setCharges] = useState('₹3,500');

  // Submission state
  const [submittedData, setSubmittedData] = useState<VisaEnquiryFormData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedRef, setCopiedRef] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Auto-calculate age from date of birth
  useEffect(() => {
    if (!dateOfBirth) return;
    const dob = new Date(dateOfBirth);
    if (!isNaN(dob.getTime())) {
      const today = new Date();
      let calcAge = today.getFullYear() - dob.getFullYear();
      const m = today.getMonth() - dob.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
        calcAge--;
      }
      if (calcAge >= 0) {
        setAge(calcAge.toString());
      }
    }
  }, [dateOfBirth]);

  // Update dynamic charges based on country, visa type, entry type & applicants
  useEffect(() => {
    let baseRate = 3500;
    const dest = destinationCountry.toLowerCase();
    if (dest.includes('dubai') || dest.includes('uae')) baseRate = 6200;
    else if (dest.includes('saudi') || dest.includes('umrah')) baseRate = 8900;
    else if (dest.includes('singapore')) baseRate = 3200;
    else if (dest.includes('malaysia')) baseRate = 2800;
    else if (dest.includes('thailand')) baseRate = 3400;
    else if (dest.includes('uk') || dest.includes('kingdom')) baseRate = 12500;
    else if (dest.includes('schengen') || dest.includes('europe')) baseRate = 11800;
    else if (dest.includes('usa') || dest.includes('america')) baseRate = 16500;
    else if (dest.includes('canada')) baseRate = 15200;
    else if (dest.includes('australia')) baseRate = 14200;
    else if (dest.includes('qatar') || dest.includes('oman')) baseRate = 4800;

    if (visaType === 'Business') baseRate = Math.round(baseRate * 1.35);
    if (entryType === 'Multiple') baseRate = Math.round(baseRate * 1.5);
    if (duration.includes('90') || duration.includes('6 Months')) baseRate = Math.round(baseRate * 1.4);
    if (duration.includes('1 Year') || duration.includes('2 Years')) baseRate = Math.round(baseRate * 2.1);

    const count = Math.max(1, numberOfApplicants || 1);
    const total = baseRate * count;
    setCharges(`₹${total.toLocaleString('en-IN')}`);
  }, [destinationCountry, visaType, duration, entryType, numberOfApplicants]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setter: (name: string) => void) => {
    if (e.target.files && e.target.files[0]) {
      setter(e.target.files[0].name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const ref = `MMS-VISA-${Math.floor(10000000 + Math.random() * 90000000)}`;

    const formData: VisaEnquiryFormData = {
      id: `visa-enq-${Date.now()}`,
      referenceNumber: ref,
      visaType,
      destinationCountry: destinationCountry || 'Not Specified',
      duration: duration || '30 Days Standard',
      entryType,
      numberOfApplicants,
      mobileNumber: mobileNumber.trim() || '+91 97893 57865',
      emailId: emailId.trim() || 'applicant@example.com',
      surname: surname.trim() || 'Surname',
      givenName: givenName.trim() || 'Applicant',
      gender,
      dateOfBirth: dateOfBirth || '1995-01-01',
      age: age || '29',
      nationality,
      placeOfBirth: placeOfBirth.trim() || 'City of Birth',
      holdingDualNationality,
      maritalStatus,
      employment,
      have3YearsItr,
      address: address.trim() || 'Residential Address',
      city: city.trim() || 'City',
      pinCode: pinCode.trim() || '600001',
      country,
      passportFirstPageFile: passportFirstPage || 'passport_front_scan.pdf',
      passportLastPageFile: passportLastPage || 'passport_back_scan.pdf',
      panCardFile: panCard || 'pancard_copy.jpg',
      photoWhiteBgFile: photoWhiteBg || 'white_bg_photo.jpg',
      ticketCopyFile: ticketCopy || undefined,
      remark,
      charges,
      createdAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      status: 'RECEIVED'
    };

    // Asynchronously sync to Supabase PostgreSQL database if configured
    if (isSupabaseConfigured()) {
      insertVisaEnquiryToSupabase(formData).catch(err => {
        console.warn('Supabase sync warning:', err);
      });
    }

    // Save to local storage cache for offline reliability
    try {
      const stored = localStorage.getItem('mms_visa_enquiries');
      const list = stored ? JSON.parse(stored) : [];
      list.unshift(formData);
      localStorage.setItem('mms_visa_enquiries', JSON.stringify(list.slice(0, 50)));
    } catch (e) {
      console.warn('Local storage save warning:', e);
    }

    setTimeout(() => {
      setSubmittedData(formData);
      setIsSubmitting(false);
      showToast(`Visa enquiry ${ref} successfully submitted!`);
      if (onSubmitSuccess) {
        onSubmitSuccess(formData);
      }
    }, 400);
  };

  const handleSendWhatsApp = (targetPhone?: string) => {
    if (!submittedData) return;
    const url = getVisaEnquiryWhatsAppUrl(submittedData, targetPhone);
    openWhatsAppLink(url);
    showToast(`Dispatching enquiry confirmation on WhatsApp...`);
  };

  const handleCopyRef = (ref?: string) => {
    if (!ref) return;
    navigator.clipboard.writeText(ref);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
    showToast(`Reference ${ref} copied!`);
  };

  return (
    <div className={`bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden ${className}`}>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-semibold animate-slideUp">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Red Bar - faithfully matching screenshot */}
      <div className="h-1.5 bg-[#b91c1c] w-full" />

      {/* Header matching screenshot */}
      <div className="p-4 sm:p-6 border-b border-slate-100">
        <h2 className="text-sm font-black uppercase tracking-wider text-slate-800">
          VISA ENQUIRY FORM
        </h2>
        <h3 className="text-xl sm:text-2xl font-black text-center text-slate-900 mt-2">
          Now Get your Visa With best B2B Rates!!
        </h3>
        <p className="text-center text-xs text-slate-500 mt-1">
          Complete embassy checklist verification, express appointment booking, and instant automated WhatsApp confirmation.
        </p>
      </div>

      {submittedData ? (
        /* Confirmation State */
        <div className="p-6 sm:p-8 space-y-6 animate-fadeIn">
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h4 className="text-xl font-black text-emerald-900">
              Visa Enquiry Received Successfully!
            </h4>
            <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-emerald-200 shadow-xs">
              <span className="text-xs text-slate-500 font-bold">Enquiry Ref:</span>
              <span className="font-mono text-base font-black text-slate-900">
                {submittedData.referenceNumber}
              </span>
              <button
                type="button"
                onClick={() => handleCopyRef(submittedData.referenceNumber)}
                className="text-slate-400 hover:text-slate-900 p-1"
                title="Copy Reference"
              >
                {copiedRef ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-xs text-slate-600 max-w-lg mx-auto">
              Our accredited Visa Counselor is verifying your documents for <strong>{submittedData.destinationCountry} ({submittedData.visaType})</strong>. Estimated B2B rate: <strong className="text-slate-900 font-mono">{submittedData.charges}</strong>.
            </p>
          </div>

          {/* WhatsApp Direct Notification Strip */}
          <div className="bg-slate-900 text-white p-5 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-left">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center shrink-0">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-black tracking-widest text-emerald-400 block">
                  WHATSAPP API AUTOMATED CONFIRMATION
                </span>
                <p className="text-xs font-bold text-slate-100">
                  Send full itinerary & document acknowledgement to registered phone:
                </p>
                <span className="text-xs font-mono text-emerald-300 font-bold">
                  {submittedData.mobileNumber}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <button
                type="button"
                onClick={() => handleSendWhatsApp(submittedData.mobileNumber)}
                className="flex-1 md:flex-initial px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md"
              >
                <Send className="w-4 h-4" />
                <span>Send to Applicant WhatsApp</span>
              </button>
              <button
                type="button"
                onClick={() => handleSendWhatsApp(CONTACT_NUMBERS.services.tel)}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
                title="Forward to MMS Visa Desk"
              >
                <span>Desk Copy</span>
              </button>
            </div>
          </div>

          {/* Quick Summary Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
            <div>
              <span className="text-slate-400 text-[10px] font-bold uppercase block">Applicant</span>
              <span className="font-extrabold text-slate-900">{submittedData.givenName} {submittedData.surname}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] font-bold uppercase block">Country</span>
              <span className="font-extrabold text-slate-900">{submittedData.destinationCountry}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] font-bold uppercase block">Duration & Type</span>
              <span className="font-extrabold text-slate-900">{submittedData.duration} • {submittedData.entryType}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] font-bold uppercase block">Total Charges</span>
              <span className="font-extrabold text-emerald-700 font-mono">{submittedData.charges}</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => setSubmittedData(null)}
              className="px-6 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold transition-colors"
            >
              Submit Another Visa Enquiry
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              <span>Print Acknowledgement</span>
            </button>
          </div>
        </div>
      ) : (
        /* Form Inputs faithfully structured according to image.png */
        <form onSubmit={handleSubmit} className="p-4 sm:p-7 space-y-5">
          {/* Row 1: Visa Type, Destination Country, Duration, Entry Type, Number of Applicants */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
            {/* Visa Type (Radio) */}
            <div className="md:col-span-3 space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                Visa Type
              </label>
              <div className="flex items-center gap-4 text-xs font-semibold text-slate-800 pt-1">
                <label className="inline-flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="visaType"
                    value="Tourist"
                    checked={visaType === 'Tourist'}
                    onChange={() => setVisaType('Tourist')}
                    className="accent-[#b91c1c] w-4 h-4"
                  />
                  <span>Tourist</span>
                </label>
                <label className="inline-flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="visaType"
                    value="Business"
                    checked={visaType === 'Business'}
                    onChange={() => setVisaType('Business')}
                    className="accent-[#b91c1c] w-4 h-4"
                  />
                  <span>Business</span>
                </label>
              </div>
            </div>

            {/* Destination Country (Select) */}
            <div className="md:col-span-3 space-y-1">
              <label className="text-xs font-bold text-slate-700 block">
                Destination Country
              </label>
              <select
                value={destinationCountry}
                onChange={(e) => setDestinationCountry(e.target.value)}
                required
                className="w-full h-9 px-3 bg-white border border-slate-300 rounded-md text-xs text-slate-800 focus:outline-none focus:border-[#b91c1c] focus:ring-1 focus:ring-[#b91c1c]"
              >
                <option value="">-Select-</option>
                <option value="United Arab Emirates (Dubai)">United Arab Emirates (Dubai)</option>
                <option value="Saudi Arabia (Umrah / Tourist)">Saudi Arabia (Umrah / Tourist)</option>
                <option value="Singapore">Singapore</option>
                <option value="Malaysia">Malaysia</option>
                <option value="Thailand">Thailand</option>
                <option value="Qatar">Qatar</option>
                <option value="Oman">Oman</option>
                <option value="Kuwait">Kuwait</option>
                <option value="United Kingdom (UK)">United Kingdom (UK)</option>
                <option value="Schengen (Europe)">Schengen (Europe)</option>
                <option value="United States (USA)">United States (USA)</option>
                <option value="Canada">Canada</option>
                <option value="Australia">Australia</option>
                <option value="Indonesia / Bali">Indonesia / Bali</option>
                <option value="Egypt">Egypt</option>
                <option value="Other Country">Other Country</option>
              </select>
            </div>

            {/* Duration (Select) */}
            <div className="md:col-span-2 space-y-1">
              <label className="text-xs font-bold text-slate-700 block">
                Duration
              </label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full h-9 px-3 bg-white border border-slate-300 rounded-md text-xs text-slate-800 focus:outline-none focus:border-[#b91c1c] focus:ring-1 focus:ring-[#b91c1c]"
              >
                <option value="">-Select-</option>
                <option value="14 Days">14 Days</option>
                <option value="30 Days">30 Days</option>
                <option value="60 Days">60 Days</option>
                <option value="90 Days">90 Days</option>
                <option value="6 Months">6 Months</option>
                <option value="1 Year">1 Year</option>
                <option value="2 Years">2 Years</option>
                <option value="5 Years">5 Years</option>
              </select>
            </div>

            {/* Entry Type (Radio) */}
            <div className="md:col-span-2 space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                Entry Type
              </label>
              <div className="flex items-center gap-3 text-xs font-semibold text-slate-800 pt-1">
                <label className="inline-flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="entryType"
                    value="Single"
                    checked={entryType === 'Single'}
                    onChange={() => setEntryType('Single')}
                    className="accent-[#b91c1c] w-4 h-4"
                  />
                  <span>Single</span>
                </label>
                <label className="inline-flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="entryType"
                    value="Multiple"
                    checked={entryType === 'Multiple'}
                    onChange={() => setEntryType('Multiple')}
                    className="accent-[#b91c1c] w-4 h-4"
                  />
                  <span>Multiple</span>
                </label>
              </div>
            </div>

            {/* Number of Applicants (Input) */}
            <div className="md:col-span-2 space-y-1">
              <label className="text-xs font-bold text-slate-700 block">
                Number of Applicants
              </label>
              <input
                type="number"
                min="1"
                max="50"
                value={numberOfApplicants}
                onChange={(e) => setNumberOfApplicants(parseInt(e.target.value) || 1)}
                className="w-full h-9 px-3 bg-white border border-slate-300 rounded-md text-xs text-slate-800 focus:outline-none focus:border-[#b91c1c] focus:ring-1 focus:ring-[#b91c1c]"
              />
            </div>
          </div>

          {/* Row 2: Mobile Number, Email ID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">
                Mobile Number
              </label>
              <input
                type="tel"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                placeholder="Enter 10-digit mobile or international number"
                required
                className="w-full h-9 px-3 bg-white border border-slate-300 rounded-md text-xs text-slate-800 focus:outline-none focus:border-[#b91c1c] focus:ring-1 focus:ring-[#b91c1c]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">
                Email ID
              </label>
              <input
                type="email"
                value={emailId}
                onChange={(e) => setEmailId(e.target.value)}
                placeholder="applicant@example.com"
                required
                className="w-full h-9 px-3 bg-white border border-slate-300 rounded-md text-xs text-slate-800 focus:outline-none focus:border-[#b91c1c] focus:ring-1 focus:ring-[#b91c1c]"
              />
            </div>
          </div>

          {/* Row 3: Surname(As in Passport), Given Name(As in Passport), Gender, Date Of Birth, Age */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block truncate">
                Surname(As in Passport)
              </label>
              <input
                type="text"
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                placeholder="SURNAME"
                required
                className="w-full h-9 px-3 bg-white border border-slate-300 rounded-md text-xs uppercase text-slate-800 focus:outline-none focus:border-[#b91c1c] focus:ring-1 focus:ring-[#b91c1c]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block truncate">
                Given Name(As in Passport)
              </label>
              <input
                type="text"
                value={givenName}
                onChange={(e) => setGivenName(e.target.value)}
                placeholder="GIVEN NAME"
                required
                className="w-full h-9 px-3 bg-white border border-slate-300 rounded-md text-xs uppercase text-slate-800 focus:outline-none focus:border-[#b91c1c] focus:ring-1 focus:ring-[#b91c1c]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">
                Gender
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                className="w-full h-9 px-3 bg-white border border-slate-300 rounded-md text-xs text-slate-800 focus:outline-none focus:border-[#b91c1c] focus:ring-1 focus:ring-[#b91c1c]"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">
                Date Of Birth
              </label>
              <input
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                required
                className="w-full h-9 px-3 bg-white border border-slate-300 rounded-md text-xs text-slate-800 focus:outline-none focus:border-[#b91c1c] focus:ring-1 focus:ring-[#b91c1c]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">
                Age
              </label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="Age"
                className="w-full h-9 px-3 bg-white border border-slate-300 rounded-md text-xs text-slate-800 focus:outline-none focus:border-[#b91c1c] focus:ring-1 focus:ring-[#b91c1c]"
              />
            </div>
          </div>

          {/* Row 4: Nationality, Place of Birth, Holding dual nationality?, Marital Status, Employment */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 items-end">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">
                Nationality
              </label>
              <select
                value={nationality}
                onChange={(e) => setNationality(e.target.value)}
                className="w-full h-9 px-3 bg-white border border-slate-300 rounded-md text-xs text-slate-800 focus:outline-none focus:border-[#b91c1c] focus:ring-1 focus:ring-[#b91c1c]"
              >
                <option value="">-Select-</option>
                <option value="Indian">Indian</option>
                <option value="Emirati">Emirati</option>
                <option value="Saudi">Saudi</option>
                <option value="Omani">Omani</option>
                <option value="Qatari">Qatari</option>
                <option value="Singaporean">Singaporean</option>
                <option value="Malaysian">Malaysian</option>
                <option value="British">British</option>
                <option value="American">American</option>
                <option value="Canadian">Canadian</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">
                Place of Birth
              </label>
              <input
                type="text"
                value={placeOfBirth}
                onChange={(e) => setPlaceOfBirth(e.target.value)}
                placeholder="City / State"
                className="w-full h-9 px-3 bg-white border border-slate-300 rounded-md text-xs text-slate-800 focus:outline-none focus:border-[#b91c1c] focus:ring-1 focus:ring-[#b91c1c]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block truncate">
                Holding dual nationality?
              </label>
              <div className="flex items-center gap-3 text-xs font-semibold text-slate-800 pt-1">
                <label className="inline-flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="dualNat"
                    value="Yes"
                    checked={holdingDualNationality === 'Yes'}
                    onChange={() => setHoldingDualNationality('Yes')}
                    className="accent-[#b91c1c] w-4 h-4"
                  />
                  <span>Yes</span>
                </label>
                <label className="inline-flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="dualNat"
                    value="No"
                    checked={holdingDualNationality === 'No'}
                    onChange={() => setHoldingDualNationality('No')}
                    className="accent-[#b91c1c] w-4 h-4"
                  />
                  <span>No</span>
                </label>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">
                Marital Status
              </label>
              <select
                value={maritalStatus}
                onChange={(e) => setMaritalStatus(e.target.value as any)}
                className="w-full h-9 px-3 bg-white border border-slate-300 rounded-md text-xs text-slate-800 focus:outline-none focus:border-[#b91c1c] focus:ring-1 focus:ring-[#b91c1c]"
              >
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Divorced">Divorced</option>
                <option value="Widowed">Widowed</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">
                Employment
              </label>
              <select
                value={employment}
                onChange={(e) => setEmployment(e.target.value as any)}
                className="w-full h-9 px-3 bg-white border border-slate-300 rounded-md text-xs text-slate-800 focus:outline-none focus:border-[#b91c1c] focus:ring-1 focus:ring-[#b91c1c]"
              >
                <option value="Salaried">Salaried</option>
                <option value="Self-Employed">Self-Employed</option>
                <option value="Business">Business</option>
                <option value="Student">Student</option>
                <option value="Retired">Retired</option>
                <option value="Unemployed">Unemployed</option>
              </select>
            </div>
          </div>

          {/* Row 5: I have 3 Years of ITR, Address, City, Pin Code, Country */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 items-end">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                I have 3 Years of ITR
              </label>
              <div className="flex items-center gap-3 text-xs font-semibold text-slate-800 pt-1">
                <label className="inline-flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="itr"
                    value="Yes"
                    checked={have3YearsItr === 'Yes'}
                    onChange={() => setHave3YearsItr('Yes')}
                    className="accent-[#b91c1c] w-4 h-4"
                  />
                  <span>Yes</span>
                </label>
                <label className="inline-flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="itr"
                    value="No"
                    checked={have3YearsItr === 'No'}
                    onChange={() => setHave3YearsItr('No')}
                    className="accent-[#b91c1c] w-4 h-4"
                  />
                  <span>No</span>
                </label>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">
                Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Street address"
                className="w-full h-9 px-3 bg-white border border-slate-300 rounded-md text-xs text-slate-800 focus:outline-none focus:border-[#b91c1c] focus:ring-1 focus:ring-[#b91c1c]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">
                City
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City"
                className="w-full h-9 px-3 bg-white border border-slate-300 rounded-md text-xs text-slate-800 focus:outline-none focus:border-[#b91c1c] focus:ring-1 focus:ring-[#b91c1c]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">
                Pin Code
              </label>
              <input
                type="text"
                value={pinCode}
                onChange={(e) => setPinCode(e.target.value)}
                placeholder="PIN"
                className="w-full h-9 px-3 bg-white border border-slate-300 rounded-md text-xs text-slate-800 focus:outline-none focus:border-[#b91c1c] focus:ring-1 focus:ring-[#b91c1c]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">
                Country
              </label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full h-9 px-3 bg-white border border-slate-300 rounded-md text-xs text-slate-800 focus:outline-none focus:border-[#b91c1c] focus:ring-1 focus:ring-[#b91c1c]"
              >
                <option value="">-Select-</option>
                <option value="India">India</option>
                <option value="United Arab Emirates">United Arab Emirates</option>
                <option value="Saudi Arabia">Saudi Arabia</option>
                <option value="Oman">Oman</option>
                <option value="Qatar">Qatar</option>
                <option value="Singapore">Singapore</option>
                <option value="Malaysia">Malaysia</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Row 6: Document Uploads - matching screenshot: PassPort 1st Page*, PassPort Last Page*, PAN Card *, Photo(in White Background)*, Ticket Copy(Optional) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 pt-2">
            {/* PassPort 1st Page* */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block truncate">
                PassPort 1st Page*
              </label>
              <div className="border border-slate-300 rounded-md p-1.5 bg-slate-50 text-[11px] flex items-center justify-between">
                <input
                  type="file"
                  id="passportFirst"
                  onChange={(e) => handleFileChange(e, setPassportFirstPage)}
                  className="hidden"
                />
                <label
                  htmlFor="passportFirst"
                  className="px-2.5 py-1 bg-white border border-slate-300 rounded text-slate-700 font-semibold cursor-pointer hover:bg-slate-100 text-[11px] shrink-0"
                >
                  Choose Files
                </label>
                <span className="text-slate-500 truncate ml-2 text-[10px]">
                  {passportFirstPage || 'No file chosen'}
                </span>
              </div>
            </div>

            {/* PassPort Last Page* */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block truncate">
                PassPort Last Page*
              </label>
              <div className="border border-slate-300 rounded-md p-1.5 bg-slate-50 text-[11px] flex items-center justify-between">
                <input
                  type="file"
                  id="passportLast"
                  onChange={(e) => handleFileChange(e, setPassportLastPage)}
                  className="hidden"
                />
                <label
                  htmlFor="passportLast"
                  className="px-2.5 py-1 bg-white border border-slate-300 rounded text-slate-700 font-semibold cursor-pointer hover:bg-slate-100 text-[11px] shrink-0"
                >
                  Choose Files
                </label>
                <span className="text-slate-500 truncate ml-2 text-[10px]">
                  {passportLastPage || 'No file chosen'}
                </span>
              </div>
            </div>

            {/* PAN Card * */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block truncate">
                PAN Card *
              </label>
              <div className="border border-slate-300 rounded-md p-1.5 bg-slate-50 text-[11px] flex items-center justify-between">
                <input
                  type="file"
                  id="panCardInput"
                  onChange={(e) => handleFileChange(e, setPanCard)}
                  className="hidden"
                />
                <label
                  htmlFor="panCardInput"
                  className="px-2.5 py-1 bg-white border border-slate-300 rounded text-slate-700 font-semibold cursor-pointer hover:bg-slate-100 text-[11px] shrink-0"
                >
                  Choose Files
                </label>
                <span className="text-slate-500 truncate ml-2 text-[10px]">
                  {panCard || 'No file chosen'}
                </span>
              </div>
            </div>

            {/* Photo(in White Background)* */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block truncate">
                Photo(in White Background)*
              </label>
              <div className="border border-slate-300 rounded-md p-1.5 bg-slate-50 text-[11px] flex items-center justify-between">
                <input
                  type="file"
                  id="photoBgInput"
                  onChange={(e) => handleFileChange(e, setPhotoWhiteBg)}
                  className="hidden"
                />
                <label
                  htmlFor="photoBgInput"
                  className="px-2.5 py-1 bg-white border border-slate-300 rounded text-slate-700 font-semibold cursor-pointer hover:bg-slate-100 text-[11px] shrink-0"
                >
                  Choose Files
                </label>
                <span className="text-slate-500 truncate ml-2 text-[10px]">
                  {photoWhiteBg || 'No file chosen'}
                </span>
              </div>
            </div>

            {/* Ticket Copy(Optional) */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block truncate">
                Ticket Copy(Optional)
              </label>
              <div className="border border-slate-300 rounded-md p-1.5 bg-slate-50 text-[11px] flex items-center justify-between">
                <input
                  type="file"
                  id="ticketCopyInput"
                  onChange={(e) => handleFileChange(e, setTicketCopy)}
                  className="hidden"
                />
                <label
                  htmlFor="ticketCopyInput"
                  className="px-2.5 py-1 bg-white border border-slate-300 rounded text-slate-700 font-semibold cursor-pointer hover:bg-slate-100 text-[11px] shrink-0"
                >
                  Choose Files
                </label>
                <span className="text-slate-500 truncate ml-2 text-[10px]">
                  {ticketCopy || 'No file chosen'}
                </span>
              </div>
            </div>
          </div>

          {/* Row 7: Remark and Charges* */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-8 space-y-1">
              <label className="text-xs font-bold text-slate-700 block">
                Remark
              </label>
              <input
                type="text"
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                placeholder="Any special remarks or travel dates"
                className="w-full h-9 px-3 bg-white border border-slate-300 rounded-md text-xs text-slate-800 focus:outline-none focus:border-[#b91c1c] focus:ring-1 focus:ring-[#b91c1c]"
              />
            </div>

            <div className="md:col-span-4 space-y-1">
              <label className="text-xs font-bold text-slate-700 block">
                Charges*
              </label>
              <input
                type="text"
                value={charges}
                readOnly
                className="w-full h-9 px-3 bg-slate-100 border border-slate-300 rounded-md text-xs font-mono font-black text-slate-900 focus:outline-none cursor-not-allowed"
              />
            </div>
          </div>

          {/* Submit Button Section - Red SUBMIT button matching image.png */}
          <div className="pt-4 flex flex-col items-center justify-center space-y-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-36 py-2.5 px-6 bg-[#b91c1c] hover:bg-[#991b1b] text-white text-xs font-black uppercase tracking-wider rounded transition-colors shadow-sm cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'SUBMITTING...' : 'SUBMIT'}
            </button>

            {/* Note text matching screenshot */}
            <div className="text-center text-[11px] text-slate-600 font-medium space-y-0.5 pt-2">
              <p>Note * - Charges are subject to change prior Notice. Additional Documents may be required on case to case basis.</p>
              <p>* - Charges starts from.</p>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};
