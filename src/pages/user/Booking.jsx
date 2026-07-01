import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiCalendar, FiClock, FiCheckCircle, FiAlertCircle, FiStar, FiMapPin, FiEdit3, FiPhone, FiLoader, FiArrowLeft } from 'react-icons/fi';
import clsx from 'clsx';
import { toast } from 'react-toastify';
import { getSingleServiceAPI, createBookingAPI, getProviderDetailsAPI, getBookedSlotsAPI, getValidSlotsAPI, bookingStripeAPI } from '../../services/allAPI';
import { loadStripe } from '@stripe/stripe-js';

export default function Booking() {
  const { serviceId } = useParams();
  const navigate = useNavigate();

  // States
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [service, setService] = useState(null);
  const [provider, setProvider] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [bookedSlots, setBookedSlots] = useState([]);
  const [validSlots, setValidSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);

  useEffect(() => {
    fetchServiceAndProvider();
  }, [serviceId]);

  useEffect(() => {
    if (selectedDate && service) {
      fetchValidSlots();
    }
  }, [selectedDate, service]);

  const fetchValidSlots = async () => {
    setSlotsLoading(true);
    try {
      const dateStr = selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
      const result = await getValidSlotsAPI(service.providerId, service._id, dateStr);
      if (result.status === 200) {
        setValidSlots(result.data);
      }
    } catch (err) {
      console.error("Error fetching valid slots:", err);
      toast.error('Could not fetch available times');
    } finally {
      setSlotsLoading(false);
    }
  };

  // const fetchBookedSlots = async () => {
  //   // Deprecated in favor of fetchValidSlots which handles everything server-side
  // };

  const fetchServiceAndProvider = async () => {
    setLoading(true);
    try {
      const result = await getSingleServiceAPI(serviceId);
      if (result.status === 200) {
        setService(result.data);
        // Fetch provider details to get their name and rating
        const providerResult = await getProviderDetailsAPI(result.data.providerId);
        if (providerResult.status === 200) {
          setProvider(providerResult.data);
        }
      } else {
        toast.error('Service not found');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error fetching service details');
    } finally {
      setLoading(false);
    }
  };

  // Generate next 7 days for the date picker to match provider availability limits
  const generateDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const dates = generateDates();

  // Helper to parse duration string (e.g., "5 hours" or "2-3 hours" -> 5 or 3)
  const parseDuration = (durStr) => {
    if (!durStr) return 1;
    const matches = durStr.match(/\d+/g);
    if (!matches) return 1;
    // Take the maximum number if it's a range like "2-3 hours"
    return Math.max(...matches.map(Number));
  };

  // Slots are now fetched from backend
  const availableSlots = validSlots;

  const handleBooking = async () => {
    if (!selectedDate || !selectedSlot || !address || !phone) {
      toast.error('Please fill in all required details');
      return;
    }

    if (!sessionStorage.getItem('token')) {
        toast.warning('Please login to book a service');
        navigate('/login');
        return;
    }

    setBookingLoading(true);
    try {
      const selectedSlotData = validSlots.find(s => s.time === selectedSlot);
      const bookingData = {
        providerId: service.providerId,
        serviceId: service._id,
        date: selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }),
        timeSlot: selectedSlot,
        endTime: selectedSlotData?.endTime || "",
        location: address,
        price: service.price,
        notes: notes,
        serviceName: service.title
      };

      const result = await bookingStripeAPI(bookingData);
      if (result.status === 200) {
        // Backup session to localStorage for cross-origin redirect recovery
        localStorage.setItem('backup_isLoggedIn', sessionStorage.getItem('isLoggedIn') || '');
        localStorage.setItem('backup_token', sessionStorage.getItem('token') || '');
        localStorage.setItem('backup_user', sessionStorage.getItem('user') || '');
        localStorage.setItem('backup_userName', sessionStorage.getItem('userName') || '');
        localStorage.setItem('backup_userRole', sessionStorage.getItem('userRole') || '');
        
        window.location.href = result.data.url;
      } else {
        toast.error(result.data || 'Failed to initiate payment');
      }
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data || 'Error initiating payment';
      toast.error(errorMsg);
    } finally {
      setBookingLoading(false);
    }
  };

  const formatDateLabel = (date) => {
    const isToday = new Date().toDateString() === date.toDateString();
    if (isToday) return 'Today';
    const isTomorrow = new Date(new Date().setDate(new Date().getDate() + 1)).toDateString() === date.toDateString();
    if (isTomorrow) return 'Tomorrow';
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };



  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <FiLoader className="text-4xl text-primary animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Preparing your booking...</p>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Service not found</h2>
        <button onClick={() => navigate(-1)} className="text-primary font-semibold hover:underline">Go back</button>
      </div>
    );
  }

  const handlePayment=async()=>{
      const stripe=await loadStripe("pk_test_51TUTekBVr6ykizRLiZ7G0He23MDim0Qg7xUd77bIrSP5GckYbLoLKKvpZ3Wfx0uybJT8hIgLaMb6aXeXuLGefYqE00EeJXBIJM")
  }

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-primary font-bold text-sm uppercase tracking-widest mb-6 transition-all group"
        >
          <FiArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Back
        </button>
        <h1 className="text-4xl font-semibold text-gray-900 mb-8">Book Service</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Booking Area */}
          <div className="lg:col-span-2 space-y-6">

            {/* Step 1: Select Date */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <FiCalendar className="text-primary text-xl" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Select Date</h2>
              </div>

              <div className="flex overflow-x-auto pb-4 gap-3 snap-x hide-scrollbar">
                {dates.map((date, idx) => {
                  const isSelected = selectedDate?.toDateString() === date.toDateString();
                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedDate(date)}
                      className={clsx(
                        "snap-start flex-shrink-0 flex flex-col items-center justify-center w-20 h-24 rounded-2xl border-2 transition-all duration-300 transform active:scale-95",
                        isSelected
                          ? "border-primary bg-primary/5 text-primary shadow-lg shadow-primary/10"
                          : "border-gray-50 bg-white hover:border-gray-200 text-gray-400 font-semibold"
                      )}
                    >
                      <span className="text-[10px] uppercase tracking-widest mb-1">{formatDateLabel(date)}</span>
                      <span className="text-2xl font-semibold">{date.getDate()}</span>
                      <span className="text-[10px] mt-1 uppercase font-semibold opacity-60">{date.toLocaleDateString('en-US', { month: 'short' })}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Select Time Slot */}
            <div className=
              "bg-white p-8 rounded-3xl shadow-sm border border-gray-100 transition-all duration-500"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <FiClock className="text-primary text-xl" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Select Time</h2>
              </div>
              <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-4 ml-12">
                This {service.duration} service requires consecutive availability. 
                {selectedSlot && ` Service ends around ${validSlots.find(s => s.time === selectedSlot)?.endTime}`}
              </p>

              {!selectedDate ? (
                <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                  <FiCalendar size={48} className="mb-4 opacity-20" />
                  <p className="font-semibold">Please select a date first</p>
                </div>
              ) : slotsLoading ? (
                <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                  <FiLoader size={48} className="mb-4 animate-spin text-primary" />
                  <p className="font-semibold">Calculating valid times...</p>
                </div>
              ) : availableSlots.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-gray-500 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                  <FiAlertCircle className="text-4xl mb-3 text-orange-400" />
                  <p className="font-bold text-gray-900">No slots match service duration</p>
                  <p className="text-sm text-center px-6 mt-1">
                    This service requires a <b>{service.duration}</b> contiguous block. 
                    The provider's current schedule doesn't have a single window long enough to accommodate this.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {availableSlots.map((slot, idx) => {
                    const isSelected = selectedSlot === slot.time;
                    return (
                      <button
                        key={idx}
                        onClick={() => setSelectedSlot(slot.time)}
                        className={clsx(
                          "py-4 px-2 rounded-xl border-2 transition-all duration-300 flex flex-col justify-center items-center shadow-sm",
                          isSelected
                            ? "bg-primary border-primary text-white shadow-lg shadow-primary/20 transform scale-105"
                            : "bg-white border-gray-50 text-gray-600 hover:border-primary/30"
                        )}
                      >
                        <span className="font-bold text-sm">{slot.time}</span>
                        <span className={clsx("text-[10px] mt-1 opacity-70", isSelected ? "text-white" : "text-gray-400")}>Ends {slot.endTime}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Step 3: Service Details (NEW) */}
            <div className=
              "bg-white p-8 rounded-3xl shadow-sm border border-gray-100 transition-all duration-500"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <FiMapPin className="text-primary text-xl" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Service Details</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-400 uppercase tracking-widest mb-3">Service Address</label>
                  <textarea
                    rows="2"
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium placeholder:text-gray-300"
                    placeholder="Enter full address where service is needed..."
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-400 uppercase tracking-widest mb-3">Contact Number</label>
                  <div className="relative">
                    <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                    <input
                      type="tel"
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium placeholder:text-gray-300"
                      placeholder="e.g. +91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-400 uppercase tracking-widest mb-3">Additional Notes (Optional)</label>
                  <div className="relative">
                    <FiEdit3 className="absolute left-4 top-4 text-gray-300" />
                    <textarea
                      rows="2"
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium placeholder:text-gray-300"
                      placeholder="Any specific instructions?"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 sticky top-24">
              <h2 className="text-xl font-semibold text-gray-800 mb-8 border-b border-gray-50 pb-5">Booking Summary</h2>

              <div className="space-y-4 mb-8">
                <div>
                  <h3 className="font-semibold text-gray-900 text-xl leading-tight mb-2">{service.title}</h3>
                  <div className="flex items-center gap-2">
                      <p className="text-xs font-semibold text-primary px-2 py-0.5 bg-primary/5 rounded-full">
                        {provider ? provider.username : 'Loading...'}
                      </p>
                      {provider && provider.rating && (
                        <div className="flex items-center gap-1 text-[10px] text-orange-400 font-semibold">
                        <FiStar className="fill-current" />
                        <span>{provider.rating}</span>
                      </div>
                      )}
                  </div>
                </div>

                <div className="pt-4 space-y-3">
                  <div className="flex justify-between text-xs py-2 border-b border-gray-50">
                    <span className="text-gray-400 font-semibold uppercase tracking-widest">Duration</span>
                    <span className="font-semibold text-gray-800">{service.duration}</span>
                  </div>

                  <div className="flex justify-between text-xs py-2 border-b border-gray-50">
                    <span className="text-gray-400 font-semibold uppercase tracking-widest">Date</span>
                    <span className="font-semibold text-gray-800">
                      {selectedDate ? selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) : '---'}
                    </span>
                  </div>

                  <div className="flex justify-between text-xs py-2 border-b border-gray-50">
                    <span className="text-gray-400 font-semibold uppercase tracking-widest">Time</span>
                    <span className="font-semibold text-gray-800">
                      {selectedSlot || '---'}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs py-2 border-b border-gray-50">
                    <span className="text-gray-400 font-semibold uppercase tracking-widest">Service Price</span>
                    <span className="font-semibold text-gray-800">₹{service.price}</span>
                  </div>
                </div>

                <div className="flex justify-between items-end pt-8">
                  <div className="flex flex-col">
                    <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">Pay Now</span>
                    <span className="text-primary text-[8px] font-bold uppercase tracking-widest">Booking Fee</span>
                  </div>
                  <span className="text-5xl font-semibold text-gray-900 leading-none">₹100</span>
                </div>
                <p className="mt-4 text-[10px] text-gray-400 font-medium italic text-center">
                  * Amount will be refunded automatically if provider declines
                </p>
              </div>

              <button
                onClick={handleBooking}
                // disabled={bookingLoading}
                className="w-full py-5 rounded-2xl flex justify-center items-center gap-2 font-bold text-lg transition-all transform active:scale-95 bg-primary hover:bg-primary-dark text-white shadow-xl shadow-primary/30 disabled:opacity-70 disabled:cursor-not-allowed">
                   Confirm Booking
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
