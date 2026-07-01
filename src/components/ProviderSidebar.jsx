import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiGrid, FiUser, FiSettings, FiLayout, FiCalendar, FiLogOut, FiMenu, FiX, FiEye } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import LogoImg from '../assets/logo.png';
import clsx from 'clsx';
import { getProviderDetailsAPI } from '../services/allAPI';
import { BASE_URL } from '../services/baseUrl';

export default function ProviderSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [providerDetails, setProviderDetails] = useState(null);
  
  const userName = sessionStorage.getItem('userName') || 'Professional';

  useEffect(() => {
    setIsOpen(false);

    const fetchMyDetails = async () => {
      const userId = sessionStorage.getItem('userId');
      if (userId) {
        try {
          const result = await getProviderDetailsAPI(userId);
          if (result.status === 200) {
            setProviderDetails(result.data);
          }
        } catch (err) {
          console.error(err);
        }
      }
    };
    fetchMyDetails();
  }, [location]);

  const handleLogout = () => {
    sessionStorage.clear();
    sessionStorage.clear();
    toast.info('Logged out successfully');
    navigate('/login');
  };

  const providerLinks = [
    { name: 'Dashboard', path: '/provider/dashboard', icon: <FiGrid /> },
    { name: 'View Profile', path: `/provider/${sessionStorage.getItem('userId')}`, icon: <FiEye /> },
    { name: 'Edit Profile', path: '/provider/profile-edit', icon: <FiSettings /> },
    { name: 'My Services', path: '/provider/my-services', icon: <FiLayout /> },
    { name: 'Availability', path: '/provider/availability', icon: <FiCalendar /> },
  ];

  return (
    <>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-[60] bg-white p-3 rounded-xl shadow-lg border border-gray-100 text-gray-700 hover:text-primary transition-colors"
      >
        {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {isOpen && (
        <div className="md:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-[40]" onClick={() => setIsOpen(false)} />
      )}

      <aside className={clsx(
        "fixed inset-y-0 left-0 z-[50] w-64 bg-white border-r border-gray-100 shadow-sm flex flex-col transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        <div className="h-24 flex items-center px-8 border-b border-gray-50">
          <Link to="/provider/dashboard" className="flex items-center gap-3 group">
            <div className="w-10 h-10 overflow-hidden rounded-xl bg-gray-50 flex items-center justify-center p-1 border border-indigo-100 group-hover:border-primary/50 transition-all">
              <img src={LogoImg} alt="ProFixer Logo" className="w-full h-full object-contain" />
            </div>
            <span className="text-2xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent tracking-tighter">
              ProFixer
            </span>
          </Link>
        </div>

        <div className="p-6">
            <div className="bg-gray-50 rounded-2xl p-4 flex items-center gap-3 border border-gray-100">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                    {providerDetails?.profileImage ? (
                        <img src={`${BASE_URL}/uploads/${providerDetails.profileImage}`} alt={userName} className="w-full h-full object-cover" />
                    ) : (
                        <FiUser size={20} />
                    )}
                </div>
                <div className="overflow-hidden">
                    <p className="text-sm font-bold text-gray-900 truncate">{providerDetails?.username || userName}</p>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest truncate">{providerDetails?.category || 'Provider'}</p>
                </div>
            </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar px-4 space-y-2 pb-6">
            {providerLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                    <Link
                        key={link.name}
                        to={link.path}
                        className={clsx(
                            "flex items-center gap-3 px-4 py-3.5 rounded-2xl font-semibold text-sm transition-all",
                            isActive ? "bg-primary text-white shadow-md shadow-primary/20" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                        )}
                    >
                        <span className={clsx("text-lg", isActive ? "text-white" : "text-gray-400")}>{link.icon}</span>
                        {link.name}
                    </Link>
                );
            })}
        </div>

        <div className="p-6 border-t border-gray-50">
            <button 
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 bg-red-50 hover:bg-red-500 text-red-600 hover:text-white py-3.5 rounded-2xl font-bold text-sm transition-colors group"
            >
                <FiLogOut className="text-lg group-hover:scale-110 transition-transform" /> Logout
            </button>
        </div>
      </aside>
    </>
  );
}
