import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiCheckCircle, 
  FiXCircle, 
  FiClock, 
  FiStar, 
  FiEdit, 
  FiInbox, 
  FiCalendar, 
  FiCheckSquare, 
  FiPlus, 
  FiList,
  FiEye,
  FiLoader,
  FiMapPin,
  FiAlertTriangle
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import clsx from 'clsx';
import { getProviderBookingsAPI, updateBookingStatusAPI, getProviderDetailsAPI, getProviderReviewsAPI, getProviderComplaintsAPI } from '../../services/allAPI';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('requests');
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEarnings: 0,
    completedJobs: 0,
    pendingRequests: 0,
    rating: 0
  });

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (!user || !user._id) {
        setLoading(false);
        return;
    }

    try {
      // 1. Fetch Bookings
      const result = await getProviderBookingsAPI();
      if (result.status === 200) {
        setBookings(result.data.reverse());
        
        // 2. Fetch Provider Stats & Rating
        const provResult = await getProviderDetailsAPI(user._id);
        if (provResult.status === 200) {
          calculateStats(result.data, provResult.data.rating);
        } else {
          calculateStats(result.data);
        }
      }

      // 3. Fetch Reviews
      const reviewsResult = await getProviderReviewsAPI(user._id);
      if (reviewsResult.status === 200) {
        setReviews(reviewsResult.data.reverse());
      }

      // 4. Fetch Complaints
      const complaintsResult = await getProviderComplaintsAPI();
      if (complaintsResult.status === 200) {
        setComplaints(complaintsResult.data.reverse());
      }

    } catch (err) {
      console.error(err);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data, realRating = 0) => {
    const completed = data.filter(b => b.status === 'Completed');
    const pending = data.filter(b => b.status === 'Pending');
    const earnings = completed.reduce((acc, curr) => acc + (Number(curr.price) || 0), 0);
    
    setStats({
      totalEarnings: earnings,
      completedJobs: completed.length,
      pendingRequests: pending.length,
      rating: realRating || 0 // Fallback to 4.8 if no reviews yet
    });
  };


  const handleAction = async (id, action) => {
    let status = '';
    if (action === 'Accept') status = 'Accepted';
    if (action === 'Reject') status = 'Rejected';
    if (action === 'Complete') status = 'WorkCompleted';

    try {
      const result = await updateBookingStatusAPI(id, { status });
      if (result.status === 200) {
        toast.success(`Booking ${status.toLowerCase()} successfully`);
        fetchBookings(); // Refresh data
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to update booking status');
    }
  };

  const filteredBookings = bookings.filter(b => {
  if (activeTab === 'requests') return b.status === 'Pending';
  if (activeTab === 'upcoming') return b.status === 'Accepted';
  if (activeTab === 'completed') return b.status === 'WorkCompleted' || b.status === 'Completed';
  if (activeTab === 'canceled') return b.status === 'Cancelled';
  return false;
});

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <FiLoader className="text-4xl text-primary animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#f8fafc] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Provider Dashboard</h1>
            <p className="mt-3 text-gray-500 font-medium">Manage your professional workflow and track your growth.</p>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-5 group hover:border-green-100 transition-colors">
            <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center flex-shrink-0 text-green-500 group-hover:bg-green-500 group-hover:text-white transition-all duration-300 font-bold text-2xl">
              ₹
            </div>
            <div>
              <p className="text-[12px] text-gray-500 font-semibold uppercase  mb-1">Total Earnings</p>
              <h3 className="text-3xl font-bold text-gray-900 tracking-tighter">₹{stats.totalEarnings}</h3>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-5 group hover:border-blue-100 transition-colors">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center flex-shrink-0 text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300">
              <FiCheckCircle size={24} />
            </div>
            <div>
              <p className="text-[12px] text-gray-500 font-semibold uppercase  mb-1">Completed Jobs</p>
              <h3 className="text-3xl font-bold text-gray-900 tracking-tighter">{stats.completedJobs}</h3>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-5 group hover:border-orange-100 transition-colors">
            <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center flex-shrink-0 text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-all duration-300">
              <FiClock size={24} />
            </div>
            <div>
              <p className="text-[12px] text-gray-500 font-bold uppercase  mb-1">New Requests</p>
              <h3 className="text-3xl font-bold text-gray-900 tracking-tighter">{stats.pendingRequests}</h3>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-5 group hover:border-yellow-100 transition-colors">
            <div className="w-14 h-14 rounded-2xl bg-yellow-50 flex items-center justify-center flex-shrink-0 text-yellow-500 group-hover:bg-yellow-500 group-hover:text-white transition-all duration-300">
              <FiStar size={24} />
            </div>
            <div>
              <p className="text-[12px] text-gray-500 font-bold uppercase  mb-1">Avg Rating</p>
              <h3 className="text-3xl font-bold text-gray-900 tracking-tighter">{stats.rating}</h3>
            </div>
          </div>
        </div>

        {/* Tabbed Navigation */}
        <div className="flex flex-col sm:flex-row justify-center items-start sm:items-center gap-6 mb-8">
          <button 
            onClick={() => setActiveTab('requests')}
            className={clsx(
              "flex-1 sm:flex-none px-6 py-3 rounded-xl text-[12px] font-bold uppercase  transition-all flex items-center justify-center gap-2 whitespace-nowrap",
              activeTab === 'requests' ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20" : "text-gray-500 hover:text-gray-900"
            )}
          >
            <FiInbox /> REQUESTS
          </button>
          <button 
            onClick={() => setActiveTab('upcoming')}
            className={clsx(
              "flex-1 sm:flex-none px-6 py-3 rounded-xl text-[12px] font-bold uppercase  transition-all flex items-center justify-center gap-2 whitespace-nowrap",
              activeTab === 'upcoming' ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-gray-500 hover:text-gray-900"
            )}
          >
            <FiCalendar /> UPCOMING
          </button>
          <button 
            onClick={() => setActiveTab('completed')}
            className={clsx(
              "flex-1 sm:flex-none px-6 py-3 rounded-xl text-[12px] font-bold uppercase  transition-all flex items-center justify-center gap-2 whitespace-nowrap",
              activeTab === 'completed' ? "bg-green-600 text-white shadow-lg shadow-green-600/20" : "text-gray-500 hover:text-gray-900"
            )}
          >
            <FiCheckSquare /> COMPLETED
          </button>
          <button 
            onClick={() => setActiveTab('canceled')}
            className={clsx(
              "flex-1 sm:flex-none px-6 py-3 rounded-xl text-[12px] font-bold uppercase  transition-all flex items-center justify-center gap-2 whitespace-nowrap",
              activeTab === 'canceled' ? "bg-red-600 text-white shadow-lg shadow-red-600/20" : "text-gray-500 hover:text-gray-900"
            )}
          >
            <FiXCircle /> CANCELED
          </button>
          <button 
            onClick={() => setActiveTab('reviews')}
            className={clsx(
              "flex-1 sm:flex-none px-6 py-3 rounded-xl text-[12px] font-bold uppercase  transition-all flex items-center justify-center gap-2 whitespace-nowrap",
              activeTab === 'reviews' ? "bg-yellow-500 text-white shadow-lg shadow-yellow-500/20" : "text-gray-500 hover:text-gray-900"
            )}
          >
            <FiStar /> REVIEWS
          </button>
          <button 
            onClick={() => setActiveTab('complaints')}
            className={clsx(
              "flex-1 sm:flex-none px-6 py-3 rounded-xl text-[12px] font-bold uppercase  transition-all flex items-center justify-center gap-2 whitespace-nowrap",
              activeTab === 'complaints' ? "bg-red-500 text-white shadow-lg shadow-red-500/20" : "text-gray-500 hover:text-gray-900"
            )}
          >
            <FiAlertTriangle /> COMPLAINTS
          </button>
        </div>

        {/* Bookings Display */}
        {activeTab === 'complaints' ? (
          <div className="space-y-6">
            {complaints.length === 0 ? (
               <div className="bg-white rounded-[2rem] p-20 text-center border border-gray-50 shadow-sm">
                <div className="text-gray-100 text-9xl mb-6 flex justify-center animate-pulse">
                  <FiAlertTriangle />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">No complaints filed</h3>
                <p className="text-gray-500 font-medium max-w-sm mx-auto">
                  You have a clean record! No users have filed complaints against your services.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {complaints.map(complaint => (
                  <div key={complaint._id} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center font-bold text-lg border border-red-100">
                          {complaint.userId?.username?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900">{complaint.userId?.username}</h4>
                          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{new Date(complaint.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 bg-red-50 px-3 py-1.5 rounded-xl border border-red-100 text-red-600 font-bold text-xs uppercase">
                        COMPLAINT
                      </div>
                    </div>
                    <div className="mb-4">
                       <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Related Service</span>
                       <p className="text-sm font-bold text-gray-700">{complaint.bookingId?.serviceId?.title || 'General Service'}</p>
                       <span className="text-[11px] text-gray-400 font-medium block mt-0.5">Booking Date: {complaint.bookingId?.date}</span>
                    </div>
                    <p className="text-gray-600 font-medium bg-red-50/30 p-4 rounded-2xl border border-red-100/50 leading-relaxed italic">
                      "{complaint.complaintText}"
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : activeTab === 'reviews' ? (
          <div className="space-y-6">
            {reviews.length === 0 ? (
               <div className="bg-white rounded-[2rem] p-20 text-center border border-gray-50 shadow-sm">
                <div className="text-gray-100 text-9xl mb-6 flex justify-center">
                  <FiStar />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">No reviews yet</h3>
                <p className="text-gray-500 font-medium max-w-sm mx-auto">
                  Once users complete bookings and leave feedback, their ratings and comments will appear here.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reviews.map(review => (
                  <div key={review._id} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-bold text-lg">
                          {review.userId?.username?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900">{review.userId?.username}</h4>
                          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{new Date(review.reviewDate || review.updatedAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1.5 rounded-xl border border-yellow-100 text-yellow-600 font-bold">
                        {review.rating} <FiStar className="fill-current" size={14} />
                      </div>
                    </div>
                    <div className="mb-4">
                       <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Service Provided</span>
                       <p className="text-sm font-bold text-gray-700">{review.serviceId?.title}</p>
                    </div>
                    <p className="text-gray-600 font-medium italic leading-relaxed">
                      "{review.review || "Excellent service!"}"
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="bg-white rounded-[2rem] p-20 text-center border border-gray-50 shadow-sm">
            <div className="text-gray-100 text-9xl mb-6 flex justify-center">
              {activeTab === 'requests' ? <FiInbox /> : activeTab === 'upcoming' ? <FiCalendar /> : activeTab === 'canceled' ? <FiXCircle /> : <FiCheckSquare />}
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">No bookings found</h3>
            <p className="text-gray-500 font-medium max-w-sm mx-auto">
              {activeTab === 'requests' ? "You don't have any new service requests at the moment." : 
               activeTab === 'upcoming' ? "Your schedule is clear. New accepted jobs will appear here." : 
               activeTab === 'canceled' ? "You don't have any canceled bookings at the moment." :
               "You haven't completed any jobs in this category yet."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredBookings.map(req => (
              <div key={req._id} className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col group hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500">
                <div className="p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`px-2 py-0.5 rounded text-[12px] font-semibold uppercase  border ${
                          req.status === 'Pending' ? 'bg-orange-50 text-orange-600 border-orange-100' : 
                          req.status === 'Accepted' ? 'bg-primary/5 text-primary border-primary/10' : 
                          req.status === 'WorkCompleted' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                          'bg-green-50 text-green-600 border-green-100'
                        }`}>
                          {req.status}
                        </span>
                        <span className="text-[13px] font-semibold text-gray-500 uppercase ">#{req._id.slice(-6).toUpperCase()}</span>
                      </div>
                      <h3 className="text-2xl font-semibold text-gray-900 leading-none mb-2">{req.serviceId?.title}</h3>
                      <p className="text-sm text-gray-500 font-semibold uppercase ">{req.userId?.username}</p>
                    </div>
                    <div className="bg-gray-50 px-4 py-2 rounded-2xl border border-gray-100">
                      <span className="text-2xl font-bold text-gray-900 tracking-tighter">₹{req.price}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                    <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-50">
                      <span className="block text-[13px] font-semibold text-gray-500 uppercase  mb-1">Service Schedule</span>
                      <span className="font-semibold text-gray-800 text-[15px]">{req.date}</span>
                    </div>
                    <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-50">
                      <span className="block text-[13px] font-semibold text-gray-500 uppercase  mb-1">Time Slot</span>
                      <span className="font-semibold text-gray-800 text-[15px]">{req.timeSlot} Session</span>
                    </div>
                    <div className="col-span-1 sm:col-span-2 bg-gray-50/50 p-4 rounded-2xl border border-gray-50">
                      <span className="block text-[10px] font-semibold text-gray-500 uppercase  mb-1 flex items-center gap-1"><FiMapPin /> Service Location</span>
                      <span className="font-semibold text-gray-800 text-[15px]">{req.location}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-6 border-t border-gray-50 mt-auto">
                    {req.status === 'Pending' && (
                      <>
                        <button 
                          onClick={() => handleAction(req._id, 'Accept')}
                          className="flex-1 bg-primary hover:bg-primary-dark text-white py-4 rounded-2xl font-semibold text-sm uppercase  transition-all shadow-xl shadow-primary/20 transform active:scale-95 flex items-center justify-center gap-2"
                        >
                          <FiCheckCircle size={18} /> ACCEPT
                        </button>
                        <button 
                          onClick={() => handleAction(req._id, 'Reject')}
                          className="px-6 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white py-4 rounded-2xl font-semibold text-xs uppercase  transition-all transform active:scale-95 flex items-center justify-center gap-2"
                        >
                          <FiXCircle size={18} />
                        </button>
                      </>
                    )}

                    {req.status === 'Accepted' && (
                      <div className="w-full flex flex-col gap-3">
                        <button 
                          onClick={() => handleAction(req._id, 'Complete')}
                          className="w-full py-4 rounded-2xl font-semibold text-sm uppercase transition-all shadow-xl flex items-center justify-center gap-2 transform active:scale-95 bg-green-500 hover:bg-green-600 text-white shadow-green-500/20"
                        >
                          <FiCheckSquare size={18} /> MARK AS COMPLETED
                        </button>
                      </div>
                    )}

                    {req.status === 'WorkCompleted' && (
                      <div className="w-full py-4 bg-blue-50 text-blue-500 rounded-2xl font-semibold text-[13px] uppercase  flex items-center justify-center gap-2 border border-blue-100">
                        WAITING FOR USER CONFIRMATION
                      </div>
                    )}

                    {req.status === 'Completed' && (
                      <div className="w-full py-4 bg-gray-100 text-gray-500 rounded-2xl font-semibold text-[13px] uppercase  flex items-center justify-center gap-2">
                        JOB COMPLETED & CONFIRMED
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    // </div>
  );
}
