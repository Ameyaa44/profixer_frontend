import { FiShield } from 'react-icons/fi';

export default function AdminOverview({ users, providers, services }) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-sky-100 group">
          <p className="text-[15px] font-bold text-sky-500 uppercase tracking-widest mb-1">Total Customers</p>
          <h3 className="text-4xl font-bold text-gray-900">{users.length}</h3>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-green-100 group">
          <p className="text-[15px] font-bold text-green-500 uppercase tracking-widest mb-1">Approved Pros</p>
          <h3 className="text-4xl font-bold text-gray-900">{providers.filter(p => p.status === 'Approved').length}</h3>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-orange-100 group">
          <p className="text-[15px] font-bold text-orange-400 uppercase tracking-widest mb-1">Pending Review</p>
          <h3 className="text-4xl font-bold text-gray-900">{providers.filter(p => p.status === 'Pending').length}</h3>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-purple-100 group">
          <p className="text-[15px] font-bold text-purple-500 uppercase tracking-widest mb-1">Total Services</p>
          <h3 className="text-4xl font-bold text-gray-900">{services.length}</h3>
        </div>
      </div>

      <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm text-center">
        <FiShield size={48} className="mx-auto text-primary mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Platform Administration</h2>
        <p className="text-gray-500 max-w-lg mx-auto font-medium">
          Use the navigation above to manage providers, users, and service listings. Monitor pending applications to maintain service quality.
        </p>
      </div>
    </div>
  );
}
