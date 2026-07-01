import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  FiArrowLeft, FiBriefcase, FiShield, FiX, FiCheck, FiTrash2, 
  FiLoader, FiMail, FiPhone, FiStar, FiCalendar, FiCheckCircle, FiActivity
} from 'react-icons/fi';
import { BASE_URL } from '../../services/baseUrl';
import { 
  getProviderDetailsAPI, 
  getAllServicesAdminAPI, 
  getProviderReviewsAPI, 
  getProviderBookingsForAdminAPI, 
  updateProviderStatusAPI, 
  deleteProviderAdminAPI 
} from '../../services/allAPI';

export default function AdminProviderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [provider, setProvider] = useState(null);
  const [services, setServices] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchProviderAllData();
  }, [id]);

  const fetchProviderAllData = async () => {
    setLoading(true);
    try {
      // 1. Fetch provider profile details
      const providerRes = await getProviderDetailsAPI(id);
      if (providerRes.status !== 200) {
        toast.error('Failed to load professional details');
        navigate('/admin/dashboard?tab=providers');
        return;
      }
      const providerData = providerRes.data;
      setProvider(providerData);

      // 2. Fetch all services, reviews, and bookings in parallel
      const [servicesRes, reviewsRes, bookingsRes] = await Promise.all([
        getAllServicesAdminAPI(),
        getProviderReviewsAPI(id),
        getProviderBookingsForAdminAPI(id)
      ]);

      if (servicesRes.status === 200) {
        // Filter services offered by this provider
        const filteredServices = servicesRes.data.filter(s => s.providerEmail === providerData.email);
        setServices(filteredServices);
      }

      if (reviewsRes.status === 200) {
        setReviews(reviewsRes.data);
      }

      if (bookingsRes.status === 200) {
        setBookings(bookingsRes.data);
      }
    } catch (err) {
      console.error(err);
      toast.error('Error fetching professional dashboard metrics');
    } finally {
      setLoading(false);
    }
  };

  const handleProviderAction = async (action) => {
    if (action === 'Remove') {
      if (!window.confirm("Are you sure you want to delete this professional's account permanently? They will no longer be able to log in.")) return;
      
      setActionLoading(true);
      try {
        const result = await deleteProviderAdminAPI(id);
        if (result.status === 200) {
          toast.success('Professional account deleted successfully');
          navigate('/admin/dashboard?tab=providers');
        } else {
          toast.error('Failed to delete professional account');
        }
      } catch (err) {
        console.error(err);
        toast.error('Error deleting account');
      } finally {
        setActionLoading(false);
      }
      return;
    }

    const newStatus = action === 'Approve' ? 'Approved' : action === 'Reject' ? 'Rejected' : '';
    setActionLoading(true);
    try {
      const result = await updateProviderStatusAPI(id, { status: newStatus });
      if (result.status === 200) {
        toast.success(`Professional status updated: ${newStatus}`);
        fetchProviderAllData();
      } else {
        toast.error('Failed to update status');
      }
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8fafc]">
        <FiLoader className="text-4xl text-primary animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Loading professional profile & metrics...</p>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8fafc] p-6 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Professional Not Found</h2>
        <p className="text-gray-500 mb-6">The requested professional account could not be retrieved.</p>
        <Link to="/admin/dashboard?tab=providers" className="bg-primary text-white px-6 py-3 rounded-xl font-bold">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  // Calculate statistics
  const totalWorks = bookings.length;
  const completedWorks = bookings.filter(b => b.status === 'Completed' || b.status === 'WorkCompleted').length;
  const cancelledWorks = bookings.filter(b => b.status === 'Cancelled').length;

  return (
    <div className="bg-[#f8fafc] min-h-screen py-10 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Back Link & Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <Link 
              to="/admin/dashboard?tab=providers" 
              className="inline-flex items-center gap-2 text-sm text-primary font-bold hover:text-primary-dark transition-colors mb-3 uppercase tracking-wider"
            >
              <FiArrowLeft size={16} /> Back to Dashboard
            </Link>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Professional Insights</h1>
            <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider mt-1">Verification, Performance Metrics & Reviews</p>
          </div>

          <div className="flex items-center gap-3">
            <span className={`px-4 py-2 rounded-2xl text-xs font-bold uppercase tracking-widest ${
              provider.status === 'Approved' ? 'bg-green-50 text-green-600 border border-green-200' :
              provider.status === 'Rejected' ? 'bg-red-50 text-red-500 border border-red-200' :
              'bg-amber-50 text-amber-600 border border-amber-200'
            }`}>
              Status: {provider.status}
            </span>
          </div>
        </div>

        {/* Dashboard Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          
          <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm flex items-center gap-5">
            <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-primary">
              <FiActivity size={24} />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Total Requests</p>
              <h3 className="text-2xl font-black text-gray-900">{totalWorks}</h3>
            </div>
          </div>

          <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm flex items-center gap-5">
            <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center text-green-600">
              <FiCheckCircle size={24} />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Completed Works</p>
              <h3 className="text-2xl font-black text-green-600">{completedWorks}</h3>
            </div>
          </div>

          <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm flex items-center gap-5">
            <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center text-red-500">
              <FiX size={24} />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Cancelled Works</p>
              <h3 className="text-2xl font-black text-red-500">{cancelledWorks}</h3>
            </div>
          </div>

          <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm flex items-center gap-5">
            <div className="w-14 h-14 bg-yellow-50 rounded-2xl flex items-center justify-center text-yellow-500">
              <FiStar size={24} className="fill-current" />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Average Rating</p>
              <h3 className="text-2xl font-black text-gray-900">{provider.rating || 'New'} <span className="text-xs text-gray-400 font-bold">({provider.reviewsCount || 0})</span></h3>
            </div>
          </div>

        </div>

        {/* Profile Content Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left / Main Profile Details Column */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Professional Summary */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8 md:p-10">
              <div className="flex flex-col sm:flex-row gap-8 items-start mb-8">
                <img 
                  src={provider.profileImage ? `${BASE_URL}/uploads/${provider.profileImage}` : 'https://via.placeholder.com/150'} 
                  alt="" 
                  className="w-36 h-36 md:w-44 md:h-44 rounded-3xl object-cover shadow-lg border-4 border-white"
                />
                <div className="flex-1 space-y-4">
                  <div>
                    <h2 className="text-3xl font-black text-gray-900 leading-tight">{provider.username}</h2>
                    <p className="text-xs text-primary font-bold uppercase tracking-widest mt-1.5 flex items-center gap-2">
                      <FiBriefcase /> {provider.category} Expert
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-50">
                    <div className="flex items-center gap-2.5 text-sm text-gray-600 font-semibold">
                      <FiMail className="text-gray-400" /> {provider.email}
                    </div>
                    <div className="flex items-center gap-2.5 text-sm text-gray-600 font-semibold">
                      <FiPhone className="text-gray-400" /> {provider.phone}
                    </div>
                    <div className="flex items-center gap-2.5 text-sm text-gray-600 font-semibold">
                      <FiCalendar className="text-gray-400" /> {provider.experience} Years Experience
                    </div>
                  </div>
                </div>
              </div>

              {/* Bio Statement */}
              <div className="bg-[#f8fafc] rounded-3xl p-6 border border-gray-100">
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Professional Statement</h4>
                <p className="text-gray-600 font-medium leading-relaxed">{provider.about || "No statement provided."}</p>
              </div>
            </div>

            {/* Verification Documents & Location */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8 md:p-10">
              <h3 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-50 pb-4">Compliance Documents & Identity</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Verification Files</h4>
                  
                  {provider.certifications ? (
                    <a 
                      href={`${BASE_URL}/uploads/${provider.certifications}`} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-primary/30 transition-all group"
                    >
                      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm text-primary group-hover:bg-primary group-hover:text-white transition-all">
                        <FiShield size={20} />
                      </div>
                      <div>
                        <span className="block text-sm font-bold text-gray-700">Certification File</span>
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Click to view document</span>
                      </div>
                    </a>
                  ) : (
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 opacity-60">
                      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-gray-400">
                        <FiX size={20} />
                      </div>
                      <div>
                        <span className="block text-sm font-bold text-gray-400">No Certification</span>
                        <span className="text-[10px] text-gray-400 font-bold">Not provided</span>
                      </div>
                    </div>
                  )}

                  {provider.workProof ? (
                    <a 
                      href={`${BASE_URL}/uploads/${provider.workProof}`} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-primary/30 transition-all group"
                    >
                      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm text-primary group-hover:bg-primary group-hover:text-white transition-all">
                        <FiBriefcase size={20} />
                      </div>
                      <div>
                        <span className="block text-sm font-bold text-gray-700">Work Experience Proof</span>
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Click to view document</span>
                      </div>
                    </a>
                  ) : (
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 opacity-60">
                      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-gray-400">
                        <FiX size={20} />
                      </div>
                      <div>
                        <span className="block text-sm font-bold text-gray-400">No Work Proof</span>
                        <span className="text-[10px] text-gray-400 font-bold">Not provided</span>
                      </div>
                    </div>
                  )}

                </div>

                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Identity & Address</h4>
                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Aadhar Number</p>
                    <p className="text-sm font-bold text-gray-700 tracking-widest">{provider.aadhar || '•••• •••• ••••'}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Registered Address</p>
                    <p className="text-xs font-bold text-gray-700 leading-relaxed">{provider.address || 'No address registered.'}</p>
                  </div>
                </div>

              </div>

            </div>

            {/* Offered Services */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8 md:p-10">
              <h3 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-50 pb-4">Listed Services</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {services.length > 0 ? (
                  services.map(service => (
                    <div key={service._id} className="p-5 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col justify-between hover:border-primary/30 transition-all">
                      <div>
                        <h5 className="text-sm font-bold text-gray-900 leading-snug">{service.title}</h5>
                        <span className="inline-block text-[9px] bg-indigo-50 text-primary px-2 py-0.5 rounded font-bold uppercase tracking-wider mt-1.5">{service.category}</span>
                      </div>
                      <div className="mt-5 flex justify-between items-center pt-3 border-t border-gray-100">
                        <span className="text-[10px] font-bold text-gray-500 uppercase">{service.duration}</span>
                        <span className="text-lg font-black text-gray-900">₹{service.price}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full p-12 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200 text-center">
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">No services offered currently</p>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Right Column: Ratings and Reviews List */}
          <div className="space-y-8">
            
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8 flex flex-col h-[700px]">
              <h3 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-50 pb-4">
                Ratings & Reviews ({reviews.length})
              </h3>
              
              <div className="flex-1 overflow-y-auto pr-1 space-y-4 custom-scrollbar">
                {reviews.length > 0 ? (
                  reviews.map((rev) => (
                    <div key={rev._id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-3">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <p className="text-xs font-bold text-gray-900">{rev.userId?.username || 'Client'}</p>
                          <p className="text-[10px] text-gray-400 font-semibold">{new Date(rev.reviewDate || rev.updatedAt).toLocaleDateString()}</p>
                        </div>
                        <div className="flex items-center text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <FiStar 
                              key={i} 
                              size={12} 
                              className={i < rev.rating ? "fill-current" : "text-gray-200"} 
                            />
                          ))}
                        </div>
                      </div>
                      
                      {rev.serviceId && (
                        <p className="text-[10px] bg-white border border-gray-100 text-gray-500 px-2 py-0.5 rounded-md font-bold uppercase tracking-wide inline-block">
                          {rev.serviceId.title}
                        </p>
                      )}
                      
                      <p className="text-xs text-gray-600 italic font-medium leading-relaxed">
                        "{rev.review || 'No written comments left.'}"
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 opacity-60">
                    <FiStar size={36} className="text-gray-300 mb-2" />
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">No reviews received yet</p>
                  </div>
                )}
              </div>
            </div>

            {/* Admin Management Actions Panel */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8 space-y-4">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50 pb-2">Administrative Actions</h4>
              
              {provider.status === 'Pending' ? (
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => handleProviderAction('Approve')}
                    disabled={actionLoading}
                    className="w-full py-4 rounded-2xl bg-primary hover:bg-primary-dark text-white font-bold text-xs tracking-widest uppercase shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 transform active:scale-95 disabled:opacity-50"
                  >
                    {actionLoading ? <FiLoader className="animate-spin" /> : <FiCheck />} APPROVE PROFESSIONAL
                  </button>
                  <button
                    onClick={() => handleProviderAction('Reject')}
                    disabled={actionLoading}
                    className="w-full py-4 rounded-2xl border-2 border-red-50 text-red-500 font-bold text-xs tracking-widest uppercase hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {actionLoading ? <FiLoader className="animate-spin" /> : <FiX />} REJECT APPLICATION
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <button
                    onClick={() => handleProviderAction('Remove')}
                    disabled={actionLoading}
                    className="w-full py-4 rounded-2xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white font-bold text-xs tracking-widest uppercase transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {actionLoading ? <FiLoader className="animate-spin" /> : <FiTrash2 />} DELETE ACCOUNT
                  </button>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
