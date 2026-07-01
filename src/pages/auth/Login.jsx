import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { loginAPI } from '../../services/allAPI';
import { FiMail, FiLock, FiLoader, FiArrowRight, FiArrowLeft } from 'react-icons/fi';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Explicitly clear fields on mount to prevent browser persistence
  useEffect(() => {
    setEmail('');
    setPassword('');
    // Also clear any lingering session/local storage that might cause issues
    sessionStorage.removeItem('userEmail');
    sessionStorage.removeItem('userPassword');
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await loginAPI({ email, password });
      
      if(result.status === 200){
          const { user, token, role } = result.data;
          
          sessionStorage.setItem('isLoggedIn', 'true');
          sessionStorage.setItem('userRole', role);
          sessionStorage.setItem('userName', user.username);
          sessionStorage.setItem('userId', user._id);
          sessionStorage.setItem('token', token);
          sessionStorage.setItem('user', JSON.stringify(user));
          
          toast.success(`Welcome back, ${user.username}!`);
          
          // Redirect based on role
          if (role === 'admin') {
              navigate('/admin/dashboard');
          } else if (role === 'provider') {
              navigate('/provider/dashboard');
          } else {
              navigate('/');
          }
      } else {
          toast.error(result.response?.data || "Login failed");
      }
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-white overflow-hidden font-default">
      {/* Left Decoration Side (Marketing) */}
      <div className="hidden lg:flex w-1/2 premium-gradient relative p-16 flex-col justify-between overflow-hidden">
        {/* Animated Orbs */}
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-accent/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />

        <div className="relative z-10">
          <Link to="/" className="text-3xl font-bold text-white flex items-center gap-2">
            <span className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-primary italic">P</span>
            ProFixer
          </Link>
          <h1 className="mt-20 text-6xl font-bold text-white leading-tight">
            Premium <br /> 
            <span className="text-white/70">Home Services</span> <br />
            At Your Doorstep.
          </h1>
          <p className="mt-8 text-white/80 text-xl max-w-md leading-relaxed">
            Connect with certified professionals and experience the future of home maintenance.
          </p>
        </div>

        <div className="relative z-10 flex gap-12 text-white/60">
          <div className="flex flex-col">
            <span className="text-white text-2xl font-bold">10k+</span>
            <span className="text-sm">Verified Providers</span>
          </div>
          <div className="flex flex-col">
            <span className="text-white text-2xl font-bold">50k+</span>
            <span className="text-sm">Happy Customers</span>
          </div>
          <div className="flex flex-col">
            <span className="text-white text-2xl font-bold">4.9/5</span>
            <span className="text-sm">Service Rating</span>
          </div>
        </div>
      </div>

      {/* Right Form Side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-20 bg-gray-50/50">
        <div className="w-full max-w-md space-y-8 relative">
          <div className="lg:hidden mb-8">
            <Link to="/" className="inline-flex items-center gap-2 text-primary font-bold">
              <FiArrowLeft /> Back to Home
            </Link>
          </div>
          <div className="hidden lg:block absolute -top-16 left-0">
             <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary font-bold transition-colors">
                <FiArrowLeft /> Back to Home
             </Link>
          </div>
          <div className="text-center lg:text-left">
            <h2 className="text-4xl font-bold text-gray-900 tracking-tight">Welcome back</h2>
            <p className="mt-3 text-gray-500 text-lg font-medium">Log in to your account</p>
          </div>

          <form className="mt-10 space-y-6" onSubmit={handleSubmit} autoComplete="off">


            <div className="space-y-4">
              <div className="group">
                <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Email Address</label>
                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
                  <input
                    type="email"
                    required
                    autoComplete="off"
                    name="email_login_field"
                    className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-primary transition-all font-medium text-gray-900 shadow-sm"
                    placeholder="john@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="group">
                <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Password</label>
                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
                  <input
                    type="password"
                    required
                    autoComplete="new-password"
                    name="password_login_field"
                    className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-primary transition-all font-medium text-gray-900 shadow-sm"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end">
              <Link to="/forgot-password" title="Recover Password" className="text-sm font-bold text-primary hover:text-primary-dark transition-colors">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full h-14 bg-gray-900 hover:bg-black text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xl shadow-gray-200"
            >
              Log in <FiArrowRight className="ml-1" />
            </button>
          </form>

          <p className="text-center text-gray-600 font-medium pt-4">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary font-bold hover:underline decoration-2 underline-offset-4">Sign up for free</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
