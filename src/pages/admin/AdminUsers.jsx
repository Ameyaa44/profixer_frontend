import { useState } from 'react';
import { FiX, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import { BASE_URL } from '../../services/baseUrl';

export default function AdminUsers({ users }) {
  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <div className="animate-in fade-in slide-in-from-left-4 duration-500">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Registered Customers</h2>
        <p className="text-gray-500 text-sm font-semibold uppercase tracking-wide">Monitor platform user activity.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50/60">
                <th className="px-6 py-4">Customer Name</th>
                <th className="px-6 py-4">Email Address</th>
                <th className="px-6 py-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map(user => (
                <tr key={user._id} className="hover:bg-gray-50/40 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {user.profileImage ? (
                        <img
                          src={`${BASE_URL}/uploads/${user.profileImage}`}
                          alt=""
                          className="w-10 h-10 rounded-xl object-cover shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-base shrink-0">
                          {user.username.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <p className="font-bold text-gray-900 text-base">{user.username}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-500">{user.email}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => setSelectedUser(user)}
                      className="px-4 py-2 rounded-xl bg-gray-50 text-gray-700 hover:bg-primary hover:text-white transition-all font-bold text-xs uppercase tracking-wider"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-[2rem] w-full max-w-lg shadow-2xl border border-gray-100 overflow-hidden transform transition-all scale-100 duration-300">
            
            {/* Modal Header / Banner */}
            <div className="bg-gradient-to-r from-primary to-accent p-8 text-white relative">
              <button
                onClick={() => setSelectedUser(null)}
                className="absolute top-6 right-6 p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all text-white"
              >
                <FiX size={18} />
              </button>
              
              <div className="flex items-center gap-5 mt-2">
                {selectedUser.profileImage ? (
                  <img
                    src={`${BASE_URL}/uploads/${selectedUser.profileImage}`}
                    alt={selectedUser.username}
                    className="w-20 h-20 rounded-2xl object-cover border-2 border-white/20 shadow-md"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center text-white text-3xl font-black border border-white/10">
                    {selectedUser.username.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-2.5 py-1 rounded-full text-white/90">
                    Customer Account
                  </span>
                  <h3 className="text-2xl font-black mt-2 leading-tight">{selectedUser.username}</h3>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-8 space-y-6">
              
              {/* Info Grid */}
              <div className="grid grid-cols-1 gap-5">
                <div className="bg-gray-50/60 p-4 rounded-2xl border border-gray-100 flex items-start gap-4">
                  <div className="p-2.5 rounded-xl bg-primary/10 text-primary shrink-0">
                    <FiMail size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Email Address</p>
                    <p className="font-bold text-gray-800 text-sm mt-0.5">{selectedUser.email}</p>
                  </div>
                </div>

               

              
              </div>

            </div>

          

          </div>
        </div>
      )}
    </div>
  );
}
