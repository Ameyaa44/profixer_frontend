import React from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { FiXCircle, FiArrowLeft, FiRefreshCw } from 'react-icons/fi';

export default function Cancel() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f8fafc] py-20 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-red-500/10 border border-gray-100 overflow-hidden text-center p-12">
          <div className="w-24 h-24 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-8">
            <FiXCircle size={48} />
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Payment Cancelled</h1>
          <p className="text-gray-500 text-lg mb-10">
            The payment process was cancelled. No charges were made to your account. You can try booking again or contact support if you face issues.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => navigate(-1)} 
              className="px-10 py-5 bg-primary text-white rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-primary-dark transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2 group"
            >
              <FiRefreshCw className="group-hover:rotate-180 transition-transform duration-500" /> Try Again
            </button>
            <Link 
              to="/" 
              className="px-10 py-5 bg-gray-100 text-gray-600 rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
            >
              <FiArrowLeft /> Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
