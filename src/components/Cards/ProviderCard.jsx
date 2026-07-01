import { Link } from 'react-router-dom';
import { FiStar, FiMapPin, FiBriefcase } from 'react-icons/fi';
import { BASE_URL } from '../../services/baseUrl';

export default function ProviderCard({ provider }) {
  const profileImg = provider.profileImage ? `${BASE_URL}/uploads/${provider.profileImage}` : "https://via.placeholder.com/150";

  return (
    <div className="bg-white rounded-[2rem] shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col h-full group">
      <div className="h-24 bg-gray-50 relative">
        <div className="absolute top-5 right-6 px-3 py-1 bg-white/80 backdrop-blur-sm text-primary rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm border border-gray-100">
          {provider.category}
        </div>
      </div>
      
      <div className="px-6 pb-6 flex-grow flex flex-col items-center text-center -mt-12 relative z-10">
        <div className="w-24 h-24 rounded-full border-4 border-white shadow-md overflow-hidden bg-white mb-3">
          <img 
            src={profileImg} 
            alt={provider.username} 
            className="w-full h-full object-cover"
          />
        </div>
        
        <h3 className="text-xl font-semibold text-gray-900 leading-tight mb-1">{provider.username}</h3>
        <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded text-green-700 text-xs font-medium mb-3">
          <FiStar className="fill-current text-green-500" />
          <span>{provider.rating || "New"}</span>
          <span className="text-green-600 font-normal">({provider.reviewsCount || 0} reviews)</span>
        </div>
        
        <p className="text-gray-500 text-sm mb-4 line-clamp-2">{provider.about}</p>
        
        <div className="mt-auto w-full space-y-4">
          <div className="flex justify-center gap-4 text-sm text-gray-500 font-medium">
            <div className="flex items-center gap-1">
              <FiMapPin className="text-gray-400" />
              <span>{provider.address ? provider.address.split(',')[0] : "Location"}</span>
            </div>
            <div className="flex items-center gap-1">
              <FiBriefcase className="text-gray-400" />
              <span>{provider.experience} Yrs</span>
            </div>
          </div>
          
          <div className="pt-4 border-t border-gray-100 w-full">
            <Link 
              to={`/provider/${provider._id}`}
              className="w-full bg-gray-900 hover:bg-primary text-white py-3.5 rounded-xl text-sm font-bold transition-all duration-300 transform active:scale-95 shadow-sm inline-block"
            >
              VIEW PROFILE
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

