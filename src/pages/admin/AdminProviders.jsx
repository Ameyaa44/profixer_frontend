import { FiCheck, FiTrash2 } from 'react-icons/fi';
import { useState } from 'react';
import { BASE_URL } from '../../services/baseUrl';

export default function AdminProviders({ providers, onAction, onReview }) {
  const [providerFilter, setProviderFilter] = useState('all');

  const filteredProviders = providers.filter(p => {
    if (p.status === 'Deleted') return false;
    if (providerFilter === 'all') return true;
    return p.status.toLowerCase() === providerFilter.toLowerCase();
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Professional Network</h2>
          <p className="text-gray-500 text-sm font-semibold uppercase tracking-wide">Review and manage professional access.</p>
        </div>
        <div className="flex items-center gap-1 bg-white border border-gray-100 p-1 rounded-xl shadow-sm">
          <button
            onClick={() => setProviderFilter('all')}
            className={`px-4 py-2 rounded-lg text-[11px] font-bold tracking-widest transition-all ${providerFilter === 'all' ? 'bg-gray-900 text-white shadow-md' : 'text-gray-600 hover:text-gray-900'}`}
          >
            ALL
          </button>
          <button
            onClick={() => setProviderFilter('pending')}
            className={`px-4 py-2 rounded-lg text-[11px] font-bold tracking-widest transition-all ${providerFilter === 'pending' ? 'bg-orange-500 text-white shadow-md' : 'text-gray-600 hover:text-orange-500'}`}
          >
            PENDING
          </button>
          <button
            onClick={() => setProviderFilter('approved')}
            className={`px-4 py-2 rounded-lg text-[11px] font-bold tracking-widest transition-all ${providerFilter === 'approved' ? 'bg-green-600 text-white shadow-md' : 'text-gray-600 hover:text-green-600'}`}
          >
            APPROVED
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredProviders.length === 0 ? (
          <div className="col-span-full py-20 text-center">
            <p className="text-gray-400 font-semibold uppercase tracking-widest">No professionals found</p>
          </div>
        ) : (
          filteredProviders.map(provider => (
            <div key={provider._id} className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden group hover:shadow-2xl transition-all duration-500">
              <div className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative">
                    <img
                      src={provider.profileImage ? `${BASE_URL}/uploads/${provider.profileImage}` : 'https://via.placeholder.com/150'}
                      alt=""
                      className="w-20 h-20 rounded-2xl object-cover"
                    />
                    <div className={`absolute -bottom-2 -right-2 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center ${provider.status === 'Approved' ? 'bg-green-500' : 'bg-orange-500'}`}>
                      <FiCheck size={12} className="text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 text-xl leading-tight">{provider.username}</h3>
                    <p className="text-[11px] text-primary font-bold mt-1 uppercase tracking-widest">{provider.category}</p>
                  </div>
                </div>

                <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Experience</p>
                  <p className="text-lg font-bold text-gray-900">{provider.experience} Yrs</p>
                </div>
                <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Status</p>
                  <p className={`text-lg font-bold ${provider.status === 'Approved' ? 'text-green-600' : 'text-orange-500'}`}>{provider.status}</p>
                </div>

                <div className="flex gap-3 pt-6 border-t border-gray-50">
                  {provider.status === 'Pending' ? (
                    <button
                      onClick={() => onReview(provider)}
                      className="flex-1 bg-primary hover:bg-primary-dark text-white text-xs font-bold tracking-widest py-4 rounded-2xl transition-all shadow-xl shadow-primary/20"
                    >
                      REVIEW APPLICATION
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => onReview(provider)}
                        className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-600 text-[10px] font-bold tracking-widest py-4 rounded-2xl transition-all uppercase"
                      >
                        VIEW DETAILS
                      </button>
                      <button
                        onClick={() => onAction(provider._id, 'Remove')}
                        className="w-14 bg-red-50 hover:bg-red-500 hover:text-white text-red-500 rounded-2xl flex items-center justify-center transition-all shadow-sm"
                      >
                        <FiTrash2 size={20} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
