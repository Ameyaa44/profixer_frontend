import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiCalendar, FiClock, FiMapPin, FiX, FiLoader, FiCheckCircle, FiChevronRight, FiFilter, FiStar, FiUser
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import clsx from 'clsx';
import { getUserBookingsAPI, updateBookingStatusAPI } from '../../services/allAPI';
import BookingDetailsModal from '../../components/Modals/BookingDetailsModal';
import ReviewModal from '../../components/Modals/ReviewModal';
import ComplaintModal from '../../components/Modals/ComplaintModal';

export default function BookingHistory() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [reviewBooking, setReviewBooking] = useState(null);
  const [complaintBooking, setComplaintBooking] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const result = await getUserBookingsAPI();
      if (result.status === 200) {
        setBookings(result.data.reverse()); // Show latest first
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load booking history');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      const result = await updateBookingStatusAPI(bookingId, { status: 'Cancelled' });
      if (result.status === 200) {
        toast.warning('Booking cancelled');
        fetchBookings();
      }
    } catch (err) {
      console.error(err);
      toast.error('Error cancelling booking');
    }
  };

  const handleConfirmCompletion = async (bookingId) => {
    try {
      const result = await updateBookingStatusAPI(bookingId, { status: 'Completed' });
      if (result.status === 200) {
        toast.success('Confirmed! Please leave a review.');
        // Find the booking that was just completed and open review modal
        const completedBooking = bookings.find(b => b._id === bookingId);
        if (completedBooking) {
          setReviewBooking({ ...completedBooking, status: 'Completed' });
        }
        fetchBookings();
      }
    } catch (err) {
      console.error(err);
      toast.error('Error confirming completion');
    }
  };

  const getStatusStyle = (status) => {
    const map = {
      'Pending': 'text-amber-600 bg-amber-50',
      'Accepted': 'text-blue-600 bg-blue-50',
      'WorkCompleted': 'text-green-600 bg-green-50',
      'Completed': 'text-green-600 bg-green-50',
      'Cancelled': 'text-gray-500 bg-gray-50',
      'Rejected': 'text-red-600 bg-red-50'
    };
    return map[status] || 'text-gray-500 bg-gray-50';
  };

  const filteredBookings = activeFilter === 'All' 
    ? bookings 
    : bookings.filter(b => b.status === activeFilter);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <FiLoader className="animate-spin text-primary text-3xl" />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4">
      <div className="max-w-5xl mx-auto">
        
        {/* Page Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Booking History</h1>
            <p className="text-gray-500 font-medium">Keep track of your service appointments</p>
          </div>
          <div className="flex bg-white p-1 rounded-xl shadow-sm border border-gray-100 overflow-x-auto whitespace-nowrap">
            {['All', 'Pending', 'Accepted', 'Completed', 'Cancelled'].map(filter => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={clsx(
                  "px-4 py-2 rounded-lg text-xs font-bold transition-all",
                  activeFilter === filter ? "bg-gray-900 text-white shadow-md" : "text-gray-500 hover:bg-gray-50"
                )}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {filteredBookings.length === 0 ? (
          <div className="bg-white rounded-2xl p-16 text-center shadow-sm border border-gray-100">
            <FiCalendar className="mx-auto text-gray-200 mb-4" size={48} />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No bookings found</h3>
            <p className="text-gray-500 mb-8">You haven't scheduled any services in this category yet.</p>
            <Link to="/services" className="bg-primary text-white px-8 py-3 rounded-xl font-bold inline-block">
              Book a Service
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <div 
                key={booking._id} 
                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col md:flex-row"
              >
                {/* Date/Status Pillar */}
               <div className={clsx(
                "w-full md:w-2 px-0 py-1",
                booking.status === 'Completed' ? "bg-green-400" :
                booking.status === 'Cancelled' ? "bg-gray-300" :
                booking.status === 'Rejected' ? "bg-red-500" :
                booking.status === 'Accepted' ? "bg-blue-500" :
                booking.status === 'WorkCompleted' ? "bg-green-600" :
                booking.status === 'Pending' ? "bg-amber-500" : "bg-gray-300"
              )}></div>

                <div className="p-5 flex-1 flex flex-col md:flex-row items-center gap-6">
                  {/* Service Info */}
                  <div className="flex-1 w-full">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={clsx("px-2 py-0.5 rounded text-[10px] font-bold uppercase", getStatusStyle(booking.status))}>
                        {booking.status}
                      </span>
                      <span className="text-xs text-gray-400 font-bold">• {booking._id.slice(-6).toUpperCase()}</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{booking.serviceId?.title}</h3>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500 font-medium">
                      <div className="flex items-center gap-1"><FiCalendar className="text-gray-400" /> {booking.date}</div>
                      <div className="flex items-center gap-1">
                        <FiClock className="text-gray-500" /> {booking.timeSlot} 
                        {booking.endTime && <span className="text-gray-500">- Ends {booking.endTime}</span>}
                      </div>
                      <div className="flex items-center gap-1"><FiUser className="text-gray-400" /> {booking.providerId?.username}</div>
                    </div>

                    {/* Display submitted rating and review */}
                    {booking.status === 'Completed' && booking.rating > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-100 flex flex-col gap-1 w-full">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Your Rating:</span>
                          <div className="flex items-center text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                              <FiStar 
                                key={i} 
                                size={14} 
                                className={clsx(i < booking.rating ? "fill-current text-yellow-400" : "text-gray-200")} 
                              />
                            ))}
                          </div>
                          <span className="text-xs font-bold text-yellow-600">({booking.rating}/5)</span>
                        </div>
                        {booking.review && (
                          <p className="text-sm text-gray-600 italic mt-1 bg-gray-50/50 p-2 rounded-lg border border-gray-100/50">"{booking.review}"</p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Price Info */}
                  <div className="text-right hidden md:block">
                    <p className="text-xs text-gray-400 font-bold uppercase mb-1">Total Paid</p>
                    <p className="text-xl font-black text-gray-900">${booking.price}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 w-full md:w-auto">
                    {booking.status === 'WorkCompleted' && (
                      <button
                        onClick={() => handleConfirmCompletion(booking._id)}
                        className="flex-1 md:flex-none bg-green-500 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-green-600 flex items-center justify-center gap-2"
                      >
                        <FiCheckCircle /> Confirm
                      </button>
                    )}

                    {(booking.status === 'Completed' || booking.status === 'Cancelled' || booking.status === 'Rejected') && (
                      <Link
                        to={`/book/${booking.serviceId?._id}`}
                        className="flex-1 md:flex-none bg-primary text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-primary-dark transition-colors flex items-center justify-center gap-2"
                      >
                        Book Again
                      </Link>
                    )}

                    {booking.status === 'Completed' && (!booking.rating || booking.rating === 0) && (
                      <button
                        onClick={() => setReviewBooking(booking)}
                        className="flex-1 md:flex-none border-2 border-primary text-primary px-4 py-2 rounded-xl text-xs font-bold hover:bg-primary hover:text-white transition-colors"
                      >
                        Rate Service
                      </button>
                    )}

                    {booking.status === 'Completed' && booking.rating > 0 && (
                      <button
                        onClick={() => setReviewBooking(booking)}
                        className="flex-1 md:flex-none border border-gray-300 text-gray-700 px-4 py-2 rounded-xl text-xs font-bold hover:bg-gray-50 transition-colors"
                      >
                        Edit Review
                      </button>
                    )}

                    {(booking.status === 'Pending' || booking.status === 'Accepted') && (
                      <button
                        onClick={() => handleCancelBooking(booking._id)}
                        className="flex-1 md:flex-none bg-red-50 text-red-500 px-5 py-3 rounded-xl text-m font-bold hover:bg-red-500 hover:text-white transition-colors"
                      >
                        Cancel
                      </button>
                    )}

                    <button
                      onClick={() => setComplaintBooking(booking)}
                      className="flex-1 md:flex-none bg-red-50 text-red-600 border border-red-100 hover:bg-red-600 hover:text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors"
                    >
                      File Complaint
                    </button>

                    <button
                      onClick={() => setSelectedBooking(booking)}
                      className="bg-gray-900 text-white p-2.5 rounded-xl hover:bg-primary transition-colors flex items-center justify-center"
                      title="View Details"
                    >
                      <FiChevronRight size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <BookingDetailsModal 
        booking={selectedBooking} 
        onClose={() => setSelectedBooking(null)} 
        onCancel={(id) => {
          handleCancelBooking(id);
          setSelectedBooking(null);
        }} 
        getStatusBadge={(status) => `px-2 py-0.5 rounded text-[10px] font-bold uppercase ${getStatusStyle(status)}`} 
      />

      <ReviewModal 
        booking={reviewBooking} 
        onClose={() => setReviewBooking(null)} 
        onSuccess={fetchBookings} 
      />

      <ComplaintModal
        booking={complaintBooking}
        onClose={() => setComplaintBooking(null)}
        onSuccess={() => {
          setComplaintBooking(null);
          toast.success('Complaint filed! View it in My Complaints.');
        }}
      />
    </div>
  );
}
