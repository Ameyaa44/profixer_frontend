import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { FiCheckCircle, FiArrowRight, FiLoader, FiCalendar, FiMapPin, FiClock } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { confirmPaymentAPI } from '../../services/allAPI';

export default function Success() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    verifyPayment();
  }, []);

  const verifyPayment = async () => {
    try {
      const result = await confirmPaymentAPI({});
      if (result.status === 200) {
        setBooking(result.data);
        toast.success("Payment Successful!");
      } else {
        toast.error("Payment verification failed");
        navigate(`/payment-cancel`);
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred during verification");
      navigate(`/payment-cancel`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8fafc]">
        <FiLoader className="text-5xl text-primary animate-spin mb-6" />
        <h2 className="text-2xl font-bold text-gray-900">Verifying Payment...</h2>
        <p className="text-gray-500 mt-2">Please do not close this window</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] py-20 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-primary/10 border border-gray-100 overflow-hidden text-center p-12">
          <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
            <FiCheckCircle size={48} />
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Payment Confirmed!</h1>
          <p className="text-gray-500 text-lg mb-10">
            Thank you for your payment. Your booking has been successfully confirmed and the professional has been notified.
          </p>

          {booking && (
            <div className="bg-gray-50 rounded-3xl p-8 mb-10 text-left border border-gray-100">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Booking Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm">
                    <FiCalendar />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Date</p>
                    <p className="font-bold text-gray-900">{booking.date}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm">
                    <FiClock />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Time Slot</p>
                    <p className="font-bold text-gray-900">{booking.timeSlot}</p>
                  </div>
                </div>

                {booking.endTime && (
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm">
                      <FiClock />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Est. Completion</p>
                      <p className="font-bold text-gray-900">{booking.endTime}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-4 md:col-span-2">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm">
                    <FiMapPin />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Location</p>
                    <p className="font-bold text-gray-900">{booking.location}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/history" 
              className="px-10 py-5 bg-primary text-white rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-primary-dark transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2 group"
            >
              View Bookings <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              to="/" 
              className="px-10 py-5 bg-gray-100 text-gray-600 rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-gray-200 transition-all flex items-center justify-center"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
