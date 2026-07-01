import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiStar, FiMapPin, FiClock,FiCheckCircle, FiShield, FiBriefcase, FiPhone, FiGlobe, FiSettings, FiLoader, FiEdit3, FiMail, FiUser } from 'react-icons/fi';
import { getProviderDetailsAPI } from '../../services/allAPI';
import { BASE_URL } from '../../services/baseUrl';

export default function ProviderMyProfile() {
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyDetails();
  }, []);

  const fetchMyDetails = async () => {
    const userId = sessionStorage.getItem('userId');
    if (!userId) {
        setLoading(false);
        return;
    }
    
    try {
      const result = await getProviderDetailsAPI(userId);
      if (result.status === 200) {
        setProvider(result.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center">
        <FiLoader className="text-4xl text-primary animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Loading profile...</p>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Profile not found</h2>
        <Link to="/login" className="text-primary font-semibold hover:underline">Please login again</Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-10 font-default">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Section */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-gray-50 shadow-sm flex-shrink-0 bg-gray-100">
              <img 
                src={provider.profileImage ? `${BASE_URL}/uploads/${provider.profileImage}` : "https://via.placeholder.com/150"} 
                alt={provider.username} 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{provider.username}</h1>
                {provider.status === 'Approved' && (
                  <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 mt-1">
                    <FiCheckCircle size={14} />
                    Verified
                  </div>
                )}
              </div>
              <p className="text-gray-500 font-medium text-lg flex items-center gap-2">
                <FiBriefcase className="text-primary" /> {provider.category} Professional
              </p>
              {provider.address && (
                <p className="text-sm text-gray-400 mt-2 flex items-center gap-1">
                  <FiMapPin /> {provider.address.split(',')[0]}
                </p>
              )}
            </div>
          </div>
          
          {/* <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto mt-4 sm:mt-0">
            <Link 
              to="/provider/availability" 
              className="flex justify-center items-center gap-2 bg-white border border-gray-200 text-gray-700 px-5 py-2.5 rounded-xl font-semibold hover:bg-gray-50 transition-colors text-sm"
            >
              <FiClock /> Availability
            </Link>
            <Link 
              to="/provider/profile-edit" 
              className="flex justify-center items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-primary-dark transition-colors text-sm shadow-sm"
            >
              <FiEdit3 /> Edit Profile
            </Link>
          </div> */}
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Rating</p>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-gray-900">{provider.rating || "New"}</span>
              {provider.rating && <FiStar className="text-orange-400 fill-current" />}
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Jobs Done</p>
            <p className="text-2xl font-bold text-gray-900">0</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Experience</p>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-gray-900">{provider.experience || "0"}</span>
              <span className="text-sm font-semibold text-gray-500">Years</span>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Status</p>
            <p className={`text-lg font-bold ${provider.status === 'Approved' ? 'text-green-600' : 'text-orange-500'}`}>
              {provider.status || 'Pending'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Details */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FiUser className="text-primary" /> About Me
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {provider.about || "No bio provided. Update your profile to tell customers about your expertise."}
              </p>

              {provider.skills && (
                <div className="mt-8 pt-8 border-t border-gray-50">
                  <h3 className="text-sm font-bold text-gray-900 mb-4">Skills & Expertise</h3>
                  <div className="flex flex-wrap gap-2">
                    {provider.skills.split(',').map((skill, index) => (
                      <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg text-sm font-medium">
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 pt-8 border-t border-gray-50">
                <div>
                  <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-1">
                    <FiShield className="text-primary" /> Verification
                  </h4>
                  <p className="text-sm text-gray-600">
                    Aadhar: <span className="font-semibold">{provider.aadhar ? `Ending in ${provider.aadhar.slice(-4)}` : "Pending"}</span>
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-1">
                    <FiGlobe className="text-primary" /> Languages
                  </h4>
                  <p className="text-sm text-gray-600">{provider.languages || "English"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Contact Details */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Contact Info</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <FiPhone className="text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm font-bold text-gray-900">{provider.phone || "Not provided"}</p>
                    <p className="text-xs text-gray-500">Mobile</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FiMail className="text-gray-400 mt-1" />
                  <div className="overflow-hidden">
                    <p className="text-sm font-bold text-gray-900 truncate" title={provider.email}>{provider.email}</p>
                    <p className="text-xs text-gray-500">Email Address</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Documents */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Documents</h3>
              <div className="space-y-3">
                {provider.certifications ? (
                  <a href={`${BASE_URL}/uploads/${provider.certifications}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-200">
                    <div className="flex items-center gap-2">
                      <FiCheckCircle className="text-green-500" />
                      <span className="text-sm font-semibold text-gray-700">Certifications</span>
                    </div>
                    <span className="text-xs font-bold text-primary">View</span>
                  </a>
                ) : (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-400">
                    <FiCheckCircle />
                    <span className="text-sm font-medium">No Certifications</span>
                  </div>
                )}

                {provider.workProof ? (
                  <a href={`${BASE_URL}/uploads/${provider.workProof}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-200">
                    <div className="flex items-center gap-2">
                      <FiBriefcase className="text-blue-500" />
                      <span className="text-sm font-semibold text-gray-700">Work Proof</span>
                    </div>
                    <span className="text-xs font-bold text-primary">View</span>
                  </a>
                ) : (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-400">
                    <FiBriefcase />
                    <span className="text-sm font-medium">No Work Proof</span>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
