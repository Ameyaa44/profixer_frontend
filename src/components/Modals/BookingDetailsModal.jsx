import { Link } from 'react-router-dom';
import { FiCalendar, FiClock, FiMapPin, FiX } from 'react-icons/fi';

export default function BookingDetailsModal({ booking, onClose, onCancel, getStatusBadge }) {
  if (!booking) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative z-10 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 className="text-xl font-bold text-gray-900">Booking Details</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 bg-white hover:bg-gray-100 p-2 rounded-full transition-colors"
          >
            <FiX size={20} />
          </button>
        </div>
        
        {/* Body */}
        <div className="p-6 overflow-y-auto">
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-widest">Booking ID: #{booking._id.slice(-6).toUpperCase()}</div>
              <h4 className="text-2xl font-bold text-gray-900 leading-tight">{booking.serviceId?.title}</h4>
            </div>
            <span className={getStatusBadge(booking.status)}>{booking.status}</span>
          </div>
          
          <div className="space-y-6">
            {/* Provider Info */}
            <div className="bg-primary/[0.03] p-4 rounded-xl border border-primary/10">
              <h5 className="text-[10px] font-bold text-primary uppercase tracking-widest mb-2">Professional</h5>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                  {booking.providerId?.username?.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-gray-900">{booking.providerId?.username}</div>
                  <Link to={`/provider/${booking.providerId?._id}`} className="text-primary text-xs font-semibold hover:underline">
                    View Professional Profile
                  </Link>
                </div>
              </div>
            </div>

            {/* Schedule Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="border border-gray-100 p-4 rounded-xl bg-gray-50/50">
                <div className="flex items-center gap-2 text-gray-400 mb-1">
                  <FiCalendar size={14} /> <span className="text-[10px] font-bold uppercase tracking-widest">Date</span>
                </div>
                <div className="font-bold text-gray-800 text-sm">
                  {booking.date}
                </div>
              </div>
              <div className="border border-gray-100 p-4 rounded-xl bg-gray-50/50">
                <div className="flex items-center gap-2 text-gray-400 mb-1">
                  <FiClock size={14} /> <span className="text-[10px] font-bold uppercase tracking-widest">Schedule</span>
                </div>
                <div className="font-bold text-gray-800 text-sm">
                  {booking.timeSlot}
                </div>
                {booking.endTime && (
                  <div className="text-sm text-gray-500 font-medium mt-2 pt-2 border-t border-gray-100">
                    Estimated End: {booking.endTime}
                  </div>
                )}
              </div>
            </div>

            {/* Location */}
            <div className="border border-gray-100 p-4 rounded-xl bg-gray-50/50">
              <div className="flex items-center gap-2 text-gray-400 mb-1">
                <FiMapPin size={14} /> <span className="text-[10px] font-bold uppercase tracking-widest">Service Location</span>
              </div>
              <div className="font-bold text-gray-800 text-sm">
                {booking.location}
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="border-t border-dashed border-gray-200 pt-4 mt-6">
              <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Payment Summary</h5>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-500 font-medium">Service Fee</span>
                <span className="font-bold text-gray-900">${booking.price}</span>
              </div>
              <div className="flex justify-between text-sm mb-3">
                <span className="text-gray-500 font-medium">Platform Fee</span>
                <span className="font-bold text-gray-900">$0</span>
              </div>
              <div className="flex justify-between items-center mt-2 pt-4 border-t border-gray-100">
                <span className="font-bold text-gray-900">Total Amount</span>
                <span className="text-3xl font-bold text-primary tracking-tighter">${booking.price}</span>
              </div>
              <p className="text-[10px] text-gray-400 font-medium text-center mt-4 italic">To be paid directly to the professional after service completion.</p>
            </div>
          </div>
        </div>
        
        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex gap-3 justify-end">
          {(booking.status === 'Pending' || booking.status === 'Accepted') && (
            <button 
              onClick={() => {
                onCancel(booking._id);
              }}
              className="px-6 py-2.5 rounded-xl font-bold bg-white border border-red-200 text-red-600 hover:bg-red-50 transition-colors shadow-sm text-xs tracking-widest uppercase"
            >
              Cancel Booking
            </button>
          )}
        </div>
        
      </div>
    </div>
  );
}
