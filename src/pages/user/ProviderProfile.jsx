import { useParams, Link, useNavigate } from 'react-router-dom';
import { FiStar, FiMapPin, FiClock, FiCheckCircle, FiShield, FiBriefcase, FiPhone, FiGlobe, FiMessageCircle, FiLoader, FiArrowRight, FiInfo, FiArrowLeft } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { getProviderDetailsAPI, getProviderServicesAPI, getProviderReviewsAPI } from '../../services/allAPI';
import { BASE_URL } from '../../services/baseUrl';

export default function ProviderProfile() {
  const { id } = useParams();
  const [provider, setProvider] = useState(null);
  const [services, setServices] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const providerResult = await getProviderDetailsAPI(id);
      if (providerResult.status === 200) {
        setProvider(providerResult.data);
      }
      
      const servicesResult = await getProviderServicesAPI(id);
      if (servicesResult.status === 200) {
        setServices(servicesResult.data);
      }

      const reviewsResult = await getProviderReviewsAPI(id);
      if (reviewsResult.status === 200) {
        setReviews(reviewsResult.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <FiLoader className="text-4xl text-primary animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Loading professional profile...</p>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Professional profile not found</h2>
        <Link to="/services" className="text-primary font-semibold hover:underline">Back to search</Link>
      </div>
    );
  }


  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      {/* Back Button */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-primary font-bold text-sm uppercase tracking-widest mb-6 transition-all group"
        >
          <FiArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Back
        </button>
      </div>
      {/* Cover Image & Header */}
      <div className="relative h-64 md:h-96 w-full overflow-hidden">
        {/* <img 
          src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
          alt="Provider Cover" 
          className="w-full h-full object-cover"
        /> */}
        <div className="absolute inset-0 bg-gray-300"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10">
        <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-10 flex flex-col md:flex-row gap-8 items-start">
          <div className="flex-shrink-0 -mt-24 md:-mt-20 w-40 h-40 md:w-52 md:h-52 rounded-2xl border-8 border-white shadow-xl overflow-hidden bg-white">
            <img 
              src={provider.profileImage ? `${BASE_URL}/uploads/${provider.profileImage}` : "https://via.placeholder.com/150"} 
              alt={provider.username} 
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="flex-grow pt-2">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-4xl font-semibold text-gray-900">{provider.username}</h1>
                  <div className="bg-blue-500 p-1 rounded-full" title="Verified Professional">
                    <FiCheckCircle className="text-white text-lg" />
                  </div>
                </div>
                <div className="flex items-center gap-2 text-primary font-semibold text-lg mb-4">
                   <FiBriefcase />
                   <span>{provider.category} Expert</span>
                </div>
              </div>

              {sessionStorage.getItem('userId') === provider._id && (
                <div className="flex flex-wrap gap-3">
                  <Link 
                    to="/provider/availability" 
                    className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-2xl font-semibold transition-all shadow-lg shadow-orange-200"
                  >
                    <FiClock />
                    Manage Availability
                  </Link>
                  <Link 
                    to="/provider/profile-edit" 
                    className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-2xl font-semibold transition-all shadow-lg shadow-gray-200"
                  >
                    <FiGlobe />
                    Edit Profile
                  </Link>
                </div>
              )}
            </div>
            
            {/* Stats Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mt-6">
              <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100">
                <div className="flex items-center gap-2 text-orange-600 mb-1">
                  <FiStar className="fill-current" />
                  <span className="font-semibold">Rating</span>
                </div>
                <div className="text-2xl font-semibold text-gray-900">{provider.rating || "New"}</div>
              </div>

              <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
                <div className="flex items-center gap-2 text-blue-600 mb-1">
                  <FiCheckCircle />
                  <span className="font-semibold">Jobs</span>
                </div>
                <div className="text-2xl font-semibold text-gray-900">{provider.reviewsCount || reviews.length}</div>
              </div>

              <div className="bg-green-50 p-4 rounded-2xl border border-green-100">
                <div className="flex items-center gap-2 text-green-600 mb-1">
                  <FiClock />
                  <span className="font-semibold">Experience</span>
                </div>
                <div className="text-2xl font-semibold text-gray-900">{provider.experience} <span className="text-sm font-medium text-gray-500">Years</span></div>
              </div>

              <div className="bg-purple-50 p-4 rounded-2xl border border-purple-100">
                <div className="flex items-center gap-2 text-purple-600 mb-1">
                  <FiMapPin />
                  <span className="font-semibold">Location</span>
                </div>
                <div className="text-md font-semibold text-gray-900 leading-tight">{provider.address ? provider.address.split(',')[0] : "Location"}</div>
              </div>
            </div>
          </div>
        </div>


        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10">

          
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-3">
                <div className="w-2 h-8 bg-primary rounded-full"></div>
                About the Professional
              </h2>
              <p className="text-gray-600 leading-relaxed text-lg mb-8">
                {provider.about}
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-8 border-t border-gray-100 mb-8">
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                  <div className="bg-white p-3 rounded-xl shadow-sm">
                    <FiShield className="text-primary text-xl" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Background Checked</h4>
                    <p className="text-xs text-gray-500 font-medium">Verified identity & clean record</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                  <div className="bg-white p-3 rounded-xl shadow-sm">
                    <FiCheckCircle className="text-green-500 text-xl" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Quality Guaranteed</h4>
                    <p className="text-xs text-gray-500 font-medium">Service backed by guarantee</p>
                  </div>
                </div>
              </div>

              {provider.skills && (
                <div className="pt-8 border-t border-gray-100 mb-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Skills & Expertise</h3>
                  <div className="flex flex-wrap gap-2">
                    {provider.skills.split(',').map((skill, index) => (
                      <span key={index} className="bg-primary/5 text-primary px-4 py-2 rounded-xl text-sm font-bold border border-primary/10 transition-transform hover:scale-105">
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-8 border-t border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FiGlobe className="text-primary" /> Communication
                </h3>
                <p className="text-gray-600 font-medium">Fluent in: <span className="text-gray-900 font-bold">{provider.languages || "English"}</span></p>
              </div>
            </div>

            {/* Services Section */}
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-semibold text-gray-900 mb-8 flex items-center gap-3">
                <div className="w-2 h-8 bg-primary rounded-full"></div>
                My Professional Services
              </h2>
              
              {services.length === 0 ? (
                <div className="text-center py-10">
                  <FiBriefcase size={48} className="mx-auto text-gray-200 mb-4" />
                  <p className="text-gray-400 font-medium">No individual services listed yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {services.map(service => (
                    <div key={service._id} className="group border border-gray-100 rounded-2xl p-6 hover:border-primary/30 hover:bg-primary/[0.01] transition-all flex flex-col sm:flex-row justify-between items-center gap-6 shadow-sm hover:shadow-md">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                           <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded text-[10px] font-bold uppercase tracking-widest">{service.category}</span>
                        </div>
                        <h4 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">{service.title}</h4>
                        <div className="flex items-center gap-4 text-gray-500 text-sm">
                          <span className="flex items-center gap-1"><FiClock size={14} /> {service.duration}</span>
                          <span className="flex items-center gap-1 font-bold text-gray-900"><FiInfo size={14} className="text-gray-400" /> ₹{service.price}/hr</span>
                        </div>
                      </div>
                      <Link 
                        to={`/book/${service._id}`}
                        className="w-full sm:w-auto bg-gray-900 text-white px-8 py-3 rounded-xl font-bold text-sm tracking-wider hover:bg-primary hover:shadow-lg hover:shadow-primary/20 transition-all flex items-center justify-center gap-2"
                      >
                        BOOK <FiArrowRight />
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Reviews Section */}
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-semibold text-gray-900 mb-8 flex items-center gap-3">
                <div className="w-2 h-8 bg-orange-500 rounded-full"></div>
                What Customers Say
              </h2>
              <div className="space-y-6">
                {reviews.length === 0 ? (
                  <p className="text-center text-gray-400 font-medium py-10">No reviews yet for this professional.</p>
                ) : (
                  reviews.map(rev => (
                    <div key={rev._id} className="border-b border-gray-50 pb-6 last:border-0 last:pb-0">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-500 uppercase">
                            {rev.userId?.username?.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900">{rev.userId?.username}</h4>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{rev.serviceId?.title}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <FiStar key={i} size={14} className={i < rev.rating ? "fill-current" : "text-gray-200"} />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-600 italic text-sm bg-gray-50/50 p-4 rounded-2xl border border-gray-50">"{rev.review || "Excellent service!"}"</p>
                      <div className="mt-2 text-[10px] text-gray-300 font-bold uppercase tracking-widest text-right">
                        {new Date(rev.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Contact & Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-8 rounded-3xl shadow-2xl border-4 border-primary/5 sticky top-24 transform transition-all hover:scale-[1.01]">
              
              <div className="text-center mb-8">
                <div className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-semibold uppercase tracking-widest mb-4">
                  Quick Contact
                </div>
                <div className="flex flex-col items-center gap-2">
                   <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center text-primary mb-2">
                      <FiPhone size={32} />
                   </div>
                   <p className="text-2xl font-bold text-gray-900">{provider.phone}</p>
                   <p className="text-sm text-gray-400 font-medium tracking-wide uppercase">Call directly for queries</p>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-green-50/50 text-gray-700 text-sm font-semibold border border-green-100">
                  <FiCheckCircle className="text-green-500 text-xl flex-shrink-0" />
                  <span>Licensed Professional</span>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-blue-50/50 text-gray-700 text-sm font-semibold border border-blue-100">
                  <FiClock className="text-blue-500 text-xl flex-shrink-0" />
                  <span>Verified Availability</span>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                 <p className="text-xs text-gray-500 leading-relaxed italic text-center">
                   "Please browse through my services listed below and select the one that fits your needs to start the booking process."
                 </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
