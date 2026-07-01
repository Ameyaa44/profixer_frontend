import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { FiGrid, FiUser, FiLogOut, FiMenu, FiX, FiUsers, FiActivity, FiBriefcase, FiList, FiAlertTriangle } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import LogoImg from '../assets/logo.png';
import clsx from 'clsx';

export default function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  
  const userName = sessionStorage.getItem('userName') || 'Administrator';
  const activeTab = searchParams.get('tab') || 'overview';

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const handleLogout = () => {
    sessionStorage.clear();
    sessionStorage.clear();
    toast.info('Logged out successfully');
    navigate('/login');
  };

  const adminLinks = [
    { name: 'Overview', tab: 'overview', icon: <FiActivity /> },
    { name: 'Providers', tab: 'providers', icon: <FiBriefcase /> },
    { name: 'Users', tab: 'users', icon: <FiUsers /> },
    { name: 'Services', tab: 'services', icon: <FiList /> },
    { name: 'Complaints', tab: 'complaints', icon: <FiAlertTriangle /> },
  ];

  const handleTabClick = (tab) => {
    setSearchParams({ tab });
    if (location.pathname !== '/admin/dashboard') {
      navigate(`/admin/dashboard?tab=${tab}`);
    }
  };

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
          <Link to="/admin/dashboard" className="flex items-center gap-3 group">
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
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                    <FiUser size={20} />
                </div>
                <div className="overflow-hidden">
                    <p className="text-sm font-bold text-gray-900 truncate">{userName}</p>
                </div>
            </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar px-4 space-y-2 pb-6">
            <p className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 mt-2">Admin Menu</p>
            {adminLinks.map((link) => {
                const isActive = activeTab === link.tab && location.pathname === '/admin/dashboard';
                return (
                    <button
                        key={link.name}
                        onClick={() => handleTabClick(link.tab)}
                        className={clsx(
                            "w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-semibold text-sm transition-all",
                            isActive ? "bg-primary text-white shadow-md shadow-primary/20" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                        )}
                    >
                        <span className={clsx("text-lg", isActive ? "text-white" : "text-gray-400")}>{link.icon}</span>
                        {link.name}
                    </button>
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
