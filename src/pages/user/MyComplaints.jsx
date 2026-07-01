import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiCalendar, FiUser, FiLoader, FiAlertTriangle, FiArrowLeft } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { getUserComplaintsAPI, deleteComplaintAPI } from '../../services/allAPI';

export default function MyComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const result = await getUserComplaintsAPI();
      if (result.status === 200) {
        setComplaints(result.data.reverse());
      }
    } catch (err) {
      console.error("Failed to load complaints:", err);
      toast.error('Failed to load complaints');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComplaint = async (id) => {
    if (!window.confirm("Are you sure you want to withdraw this complaint?")) return;
    try {
      const result = await deleteComplaintAPI(id);
      if (result.status === 200) {
        toast.success('Complaint withdrawn successfully');
        fetchComplaints();
      } else {
        toast.error('Failed to withdraw complaint');
      }
    } catch (err) {
      console.error("Delete complaint error:", err);
      toast.error('Error deleting complaint');
    }
  };

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

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <Link to="/history" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary font-medium mb-3 transition-colors">
              <FiArrowLeft size={14} /> Back to Bookings
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">My Complaints</h1>
            <p className="text-gray-500 font-medium">Track and manage your filed complaints</p>
          </div>

        </div>

        {/* Content */}
        {complaints.length === 0 ? (
          <div className="bg-white rounded-2xl p-16 text-center shadow-sm border border-gray-100">
            <FiAlertTriangle className="mx-auto text-gray-200 mb-4" size={48} />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No complaints filed</h3>
            <p className="text-gray-500 mb-8">You haven't filed any complaints against providers on the platform.</p>
            <Link to="/history" className="bg-primary text-white px-8 py-3 rounded-xl font-bold inline-block hover:bg-primary-dark transition-colors">
              View Bookings
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {complaints.map((complaint) => (
              <div 
                key={complaint._id} 
                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col md:flex-row p-6 gap-6 items-center"
              >
                <div className="w-full md:w-1 self-stretch bg-red-500 rounded-lg shrink-0"></div>
                
                <div className="flex-1 w-full">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-red-50 text-red-600 border border-red-100">
                          Complaint Filed
                        </span>
                        <span className="text-xs text-gray-400 font-bold">• {complaint._id.slice(-6).toUpperCase()}</span>
                      </div>

                      <h3 className="text-lg font-bold text-gray-900 mb-1">
                        Complaint against: <span className="text-primary">{complaint.providerId?.username || 'Unknown Provider'}</span>
                      </h3>
                    </div>
                    
                    <button
                      onClick={() => handleDeleteComplaint(complaint._id)}
                      className="bg-red-50 hover:bg-red-500 text-red-500 hover:text-white px-4 py-2 rounded-xl text-xs font-bold transition-all transform active:scale-95 whitespace-nowrap shrink-0 border border-red-100"
                    >
                      Withdraw Complaint
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500 font-medium mb-3">
                    <div className="flex items-center gap-1">
                      <FiCalendar className="text-gray-400" /> Date Filed: {new Date(complaint.createdAt).toLocaleDateString()}
                    </div>
                    {complaint.bookingId?.serviceId?.title && (
                      <div className="flex items-center gap-1">
                        <FiUser className="text-gray-400" /> Service: {complaint.bookingId.serviceId.title}
                      </div>
                    )}
                  </div>

                  <div className="bg-red-50/50 p-4 rounded-xl border border-red-100/50">
                    <p className="text-sm font-semibold text-gray-700 italic">"{complaint.complaintText}"</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
