import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiArrowLeft, FiCheckCircle, FiLoader } from 'react-icons/fi';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 font-default">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl animate-float" />
      </div>

      <div className="relative z-10 w-full max-w-md bg-white p-10 md:p-12 rounded-[40px] shadow-2xl shadow-gray-200/50 border border-gray-100">
        <div className="mb-6">
            <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary font-bold transition-colors">
              <FiArrowLeft /> Back to Home
            </Link>
        </div>
        {!submitted ? (
          <>
            <div className="text-center mb-10">
              <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <FiMail className="text-3xl text-primary" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Forgot Password?</h2>
              <p className="mt-3 text-gray-500 font-medium leading-relaxed">
                No worries, we'll send you reset instructions.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Email Address</label>
                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    required
                    className="w-full pl-11 pr-4 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-6 text-white bg-gray-900 hover:bg-black rounded-2xl font-bold flex items-center justify-center gap-2 transition-all transform active:scale-95 disabled:opacity-70 shadow-xl shadow-gray-200"
              >
                {loading ? <FiLoader className="animate-spin text-xl" /> : 'Reset Password'}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-4">
            <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8">
              <FiCheckCircle className="text-5xl text-green-500" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Check your email</h2>
            <p className="mt-4 text-gray-500 font-medium leading-relaxed">
              We've sent password recovery instructions to <br />
              <span className="text-gray-900 font-bold">{email}</span>
            </p>
            <button
               onClick={() => setSubmitted(false)}
               className="mt-10 text-primary font-bold hover:underline"
            >
                Didn't receive email? Try again
            </button>
          </div>
        )}

        <div className="mt-12 text-center">
          <Link to="/login" className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-black transition-colors">
            <FiArrowLeft /> Back to log in
          </Link>
        </div>
      </div>
    </div>
  );
}
