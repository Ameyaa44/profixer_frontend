import { useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// --- Session Restore for Stripe Cross-Origin Redirects ---
if (localStorage.getItem('backup_isLoggedIn')) {
  const isPaymentReturn = window.location.pathname === '/payment-success' || window.location.pathname === '/payment-cancel';

  if (!sessionStorage.getItem('isLoggedIn') && isPaymentReturn) {
    sessionStorage.setItem('isLoggedIn', localStorage.getItem('backup_isLoggedIn'));
    sessionStorage.setItem('token', localStorage.getItem('backup_token'));
    sessionStorage.setItem('user', localStorage.getItem('backup_user'));
    sessionStorage.setItem('userName', localStorage.getItem('backup_userName'));
    sessionStorage.setItem('userRole', localStorage.getItem('backup_userRole'));
  }
  
  localStorage.removeItem('backup_isLoggedIn');
  localStorage.removeItem('backup_token');
  localStorage.removeItem('backup_user');
  localStorage.removeItem('backup_userName');
  localStorage.removeItem('backup_userRole');
}
// ---------------------------------------------------------

import UserNavbar from './components/UserNavbar';
import ProviderSidebar from './components/ProviderSidebar';
import AdminSidebar from './components/AdminSidebar';
import Footer from './components/Footer';
import Preloader from './components/Preloader';
import ScrollToTop from './components/ScrollToTop';

// Pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ServiceListing from './pages/user/ServiceListing';
import ProviderProfile from './pages/user/ProviderProfile';
import Booking from './pages/user/Booking';
import BookingHistory from './pages/user/BookingHistory';
import MyComplaints from './pages/user/MyComplaints';

import ProviderDashboard from './pages/provider/ProviderDashboard';
import ManageAvailability from './pages/provider/ManageAvailability';
import EditProfile from './pages/provider/EditProfile';
import AddService from './pages/provider/AddService';
import MyServices from './pages/provider/MyServices';
import EditService from './pages/provider/EditService';
import ProviderMyProfile from './pages/provider/ProviderMyProfile';

import UserProfile from './pages/user/UserProfile';
import Success from './pages/user/Success';
import Cancel from './pages/user/Cancel';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProviderDetails from './pages/admin/AdminProviderDetails';

const ProtectedRoute = ({ children }) => {
  const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
  return isLoggedIn ? children : <Navigate to="/login" replace />;
};

function App() {
  const location = useLocation();

  // Block keyboard navigation and interaction
  useEffect(() => {
    const handleKeydown = (e) => {
      // 1. Always allow system/developer shortcuts
      if (e.ctrlKey || e.altKey || e.metaKey || (e.key && e.key.startsWith('F'))) {
        return;
      }

      const isInput = e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable;

      // 2. If it's an input, ALLOW the Space key (' ') so people can type
      // Also allow Enter in TEXTAREAs for multi-line notes
      if (isInput && e.key === ' ') return;
      if (e.target.tagName === 'TEXTAREA' && e.key === 'Enter') return;

      // 3. Define "Control" keys to block globally
      const controlKeys = [
        'Enter', 'Tab', ' ', 
        'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 
        'PageUp', 'PageDown', 'Home', 'End'
      ];

      if (controlKeys.includes(e.key)) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }

      // 4. For all other keys (letters, numbers, etc.), block them if NOT in an input
      if (!isInput) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    window.addEventListener('keydown', handleKeydown, { capture: true });
    return () => window.removeEventListener('keydown', handleKeydown, { capture: true });
  }, []);
  const isAuthPage = ['/login', '/register', '/forgot-password'].includes(location.pathname);
  const dashboardPaths = ['/provider/dashboard', '/provider/profile', '/provider/availability', '/provider/profile-edit', '/provider/add-service', '/provider/edit-service', '/provider/my-services'];
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isProviderRoute = dashboardPaths.some(path => location.pathname.startsWith(path));
  const isDashboardRoute = isProviderRoute || isAdminRoute;

  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      {location.pathname !== '/payment-success' && location.pathname !== '/payment-cancel' && <Preloader />}
      
      {!isAuthPage && !isDashboardRoute && <UserNavbar />}
      {isProviderRoute && <ProviderSidebar />}
      {isAdminRoute && <AdminSidebar />}
      
      {/* Main Content Wrapper with dynamic padding for sidebar */}
      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${isDashboardRoute ? 'md:pl-64' : ''}`}>
        <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/services" element={<ServiceListing />} />
              <Route path="/book/:serviceId" element={<ProtectedRoute><Booking /></ProtectedRoute>} />
              <Route path="/history" element={<ProtectedRoute><BookingHistory /></ProtectedRoute>} />
              <Route path="/my-complaints" element={<ProtectedRoute><MyComplaints /></ProtectedRoute>} />
              <Route path="/user/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
              <Route path="/payment-success" element={<ProtectedRoute><Success /></ProtectedRoute>} />
              <Route path="/payment-cancel" element={<ProtectedRoute><Cancel /></ProtectedRoute>} />

              <Route path="/provider/dashboard" element={<ProtectedRoute><ProviderDashboard /></ProtectedRoute>} />
              <Route path="/provider/profile" element={<ProtectedRoute><ProviderMyProfile /></ProtectedRoute>} />
              <Route path="/provider/availability" element={<ProtectedRoute><ManageAvailability /></ProtectedRoute>} />
              <Route path="/provider/profile-edit" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
              <Route path="/provider/add-service" element={<ProtectedRoute><AddService /></ProtectedRoute>} />
              <Route path="/provider/edit-service/:serviceId" element={<ProtectedRoute><EditService /></ProtectedRoute>} />
              <Route path="/provider/my-services" element={<ProtectedRoute><MyServices /></ProtectedRoute>} />
              <Route path="/provider/:id" element={<ProtectedRoute><ProviderProfile /></ProtectedRoute>} />

              <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
              <Route path="/admin/provider/:id" element={<ProtectedRoute><AdminProviderDetails /></ProtectedRoute>} />
            </Routes>
        </main>
        
        {/* Hide footer on Dashboard routes for a cleaner app feel */}
        {!isAuthPage && !isDashboardRoute && <Footer />}
      </div>
      
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

export default App;
