import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiMenu, FiX, FiUser, FiChevronDown, FiLogOut, FiAlertCircle, FiBookOpen } from 'react-icons/fi';
import { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import LogoImg from '../assets/logo.png';

export default function UserNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('User Profile');
  const [userRole, setUserRole] = useState('');

  const syncAuth = () => {
    const logged = sessionStorage.getItem('isLoggedIn') === 'true';
    const role = sessionStorage.getItem('userRole') || '';
    const name = sessionStorage.getItem('userName') || 'User Profile';
    
    setIsLoggedIn(logged);
    setUserRole(role);
    setUserName(name);
  };

  useEffect(() => {
    syncAuth();
    setIsDropdownOpen(false);
    setIsOpen(false);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    sessionStorage.clear();
    sessionStorage.clear();
    syncAuth();
    toast.info('Logged out successfully');
    navigate('/login');
    setIsOpen(false);
  };

  return ( 
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-11 h-11 overflow-hidden rounded-xl bg-gray-50 flex items-center justify-center p-1.5 border border-indigo-100 group-hover:border-primary/50 transition-all shadow-sm group-hover:shadow-md group-hover:scale-105 transform duration-300">
                <img src={LogoImg} alt="ProFixer Logo" className="w-full h-full object-contain" />
              </div>
              <span className="text-3xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent tracking-tighter transition-all duration-300 group-hover:brightness-110">
                ProFixer
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            {(!isLoggedIn || userRole === 'user') && (
              <>
                <Link to="/" className="text-gray-600 hover:text-primary transition-colors font-medium">Home</Link>
                <a href="/#contact-us" className="text-gray-600 hover:text-primary transition-colors font-medium">Contact Us</a>
                <Link to="/services" className="text-gray-600 hover:text-primary transition-colors font-medium">Services</Link>
              </>
            )}
            {isLoggedIn && userRole === 'user' && (
              <Link to="/history" className="text-gray-600 hover:text-primary transition-colors font-medium">My Bookings</Link>
            )}
            
            {isLoggedIn ? (
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-3 ml-4 bg-gray-50 py-1.5 px-4 rounded-full border border-primary/20 shadow-sm transition-all hover:bg-white hover:border-primary/40 group active:scale-95"
                >
                  <div className="bg-primary/10 p-1.5 rounded-full group-hover:bg-primary/20 transition-colors">
                    <FiUser className="text-primary text-sm" />
                  </div>
                  <span className="text-sm font-bold text-gray-800">{userName}</span>
                  <FiChevronDown className={`text-gray-400 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 py-3 z-50 animate-in fade-in zoom-in-95 duration-200">
                    <div className="space-y-1">
                      {userRole === 'user' && (
                        <>
                          <Link to="/user/profile" className="flex items-center gap-3 px-5 py-3 text-sm font-semibold text-gray-600 hover:text-primary hover:bg-primary/5 transition-all">
                            <FiUser className="text-lg" /> My Profile
                          </Link>
                          <Link to="/my-complaints" className="flex items-center gap-3 px-5 py-3 text-sm font-semibold text-gray-600 hover:text-red-500 hover:bg-red-50/60 transition-all">
                            <FiAlertCircle className="text-lg text-red-400" /> My Complaints
                          </Link>
                          <div className="h-[1px] bg-gray-100 mx-4 my-1" />
                        </>
                      )}
                      <button onClick={handleLogout} className="w-full flex items-center gap-3 px-5 py-3 text-sm font-semibold text-red-500 hover:bg-red-50 transition-all">
                        <FiLogOut className="text-lg" /> Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="bg-primary text-white px-6 py-2 rounded-full text-sm font-bold hover:bg-primary-dark transition-all shadow-md shadow-primary/20">
                Login
              </Link>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-500 hover:text-primary focus:outline-none">
              {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
            {(!isLoggedIn || userRole === 'user') && (
              <>
                <Link to="/" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50 rounded-md">Home</Link>
                <Link to="/services" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50 rounded-md">Services</Link>
                <a href="/#contact-us" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50 rounded-md">Contact Us</a>
              </>
            )}
            {isLoggedIn && userRole === 'user' && (
              <Link to="/history" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50 rounded-md">My Bookings</Link>
            )}
            
            <div className="border-t border-gray-200 pt-4 pb-2">
              {isLoggedIn ? (
                <>
                  <div className="flex items-center px-4">
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                        <FiUser className="text-gray-500" />
                      </div>
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-bold leading-none text-gray-800">{userName}</div>
                      <div className="text-sm font-medium leading-none text-gray-500 mt-1.5">Verified Member</div>
                    </div>
                  </div>
                  <div className="mt-3 px-2 space-y-1">
                    {userRole === 'user' && (
                      <>
                        <Link to="/user/profile" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50 flex items-center gap-3">
                          <FiUser /> My Profile
                        </Link>
                        <Link to="/my-complaints" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-red-500 hover:bg-red-50 flex items-center gap-3">
                          <FiAlertCircle className="text-red-400" /> My Complaints
                        </Link>
                      </>
                    )}
                    <div className="h-[1px] bg-gray-100 my-2"></div>
                    <button onClick={handleLogout} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:text-red-800 hover:bg-red-50 flex items-center gap-3">
                      <FiLogOut /> Logout
                    </button>
                  </div>
                </>
              ) : (
                <div className="px-5 pb-3">
                  <Link to="/login" onClick={() => setIsOpen(false)} className="block text-center w-full bg-primary text-white py-3 rounded-xl font-bold">
                    Login / Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
