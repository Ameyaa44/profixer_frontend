import { FiAlertTriangle, FiUser, FiBriefcase, FiCalendar } from 'react-icons/fi';

export default function AdminComplaints({ complaints }) {
  return (
    <div className="animate-in fade-in slide-in-from-left-4 duration-500">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Customer Complaints</h2>
        <p className="text-gray-500 text-sm font-semibold uppercase tracking-wide">Monitor platform issues and complaints.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {complaints.length === 0 ? (
          <div className="p-16 text-center">
            <FiAlertTriangle className="mx-auto text-gray-200 mb-4" size={48} />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No complaints filed</h3>
            <p className="text-gray-500 font-medium max-w-sm mx-auto">The platform is running smoothly with zero customer complaints recorded.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50/60">
                  <th className="px-6 py-4">Customer Name</th>
                  <th className="px-6 py-4">Provider Name</th>
                  <th className="px-6 py-4">Complaint Details</th>
                  <th className="px-6 py-4">Date of Complaint</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {complaints.map(complaint => (
                  <tr key={complaint._id} className="hover:bg-gray-50/40 transition-colors">
                    {/* User info */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-base shrink-0 border border-indigo-100/50">
                          {complaint.userId?.username?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-base">{complaint.userId?.username || 'Unknown User'}</p>
                          <p className="text-xs text-gray-400 font-medium">{complaint.userId?.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Provider info */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-base shrink-0 border border-amber-100/50">
                          {complaint.providerId?.username?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-base">{complaint.providerId?.username || 'Unknown Provider'}</p>
                          <p className="text-xs text-gray-400 font-medium">{complaint.providerId?.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Complaint details */}
                    <td className="px-6 py-4 max-w-md">
                      <div>
                        {complaint.bookingId?.serviceId?.title && (
                          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-red-50 text-red-600 border border-red-100 mb-1">
                            {complaint.bookingId.serviceId.title}
                          </span>
                        )}
                        <p className="text-sm font-semibold text-gray-700 bg-gray-50/60 p-3 rounded-xl border border-gray-100/50 italic leading-relaxed">
                          "{complaint.complaintText}"
                        </p>
                      </div>
                    </td>

                    {/* Complaint date */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-sm font-semibold text-gray-500">
                        <FiCalendar className="text-gray-400" />
                        <span>{new Date(complaint.createdAt).toLocaleDateString()}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
