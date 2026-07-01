export default function AdminServices({ services }) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Service Inventory</h2>
        <p className="text-gray-500 text-sm font-semibold uppercase tracking-wide">Moderate professional service listings.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map(service => (
          <div key={service._id} className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col group hover:shadow-xl transition-all">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h4 className="text-xl font-bold text-gray-900 leading-tight">{service.title}</h4>
                <p className="text-xs text-gray-400 font-medium mt-1">By: {service.providerEmail}</p>
              </div>
            </div>
            <div className="mt-auto flex justify-between items-center pt-6 border-t border-gray-50">
              <span className="text-gray-400 font-bold text-xs uppercase tracking-widest">{service.duration}</span>
              <span className="text-2xl font-bold text-gray-900">₹{service.price}/hr</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
