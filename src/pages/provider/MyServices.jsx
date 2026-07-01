import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiPlus, FiEdit, FiTrash2, FiList, FiClock, FiLoader } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { getProviderServicesAPI, deleteServiceAPI } from '../../services/allAPI';

export default function MyServices() {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    const providerId = sessionStorage.getItem('userId');
    if (!providerId) {
      navigate('/login');
      return;
    }
    setLoading(true);
    try {
      const result = await getProviderServicesAPI(providerId);
      if (result.status === 200) {
        setServices(result.data);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        const result = await deleteServiceAPI(id);
        if (result.status === 200) {
          toast.success('Service deleted successfully');
          fetchServices(); // Refresh the list
        } else {
          toast.error('Failed to delete service');
        }
      } catch (err) {
        console.error(err);
        toast.error('Error deleting service');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8fafc]">
        <FiLoader className="text-4xl text-primary animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Loading your services...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#f8fafc] min-h-screen py-12 font-default">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Page Header */}
        <div className="mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate('/provider/dashboard')}
              className="p-3 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all text-gray-400 hover:text-primary active:scale-95"
            >
              <FiArrowLeft size={24} />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 ">My Services</h1>
              <p className="mt-2 text-gray-500 font-medium text-sm">Manage your listed services visible to customers</p>
            </div>
          </div>
          <Link
            to="/provider/add-service"
            className="bg-primary text-white px-6 py-4 rounded-2xl hover:bg-primary-dark font-semibold text-xs uppercase transition-all shadow-xl shadow-primary/20 flex items-center gap-2 transform active:scale-95"
          >
            <FiPlus size={18} /> Add New Service
          </Link>
        </div>

        {/* Services Grid */}
        {services.length === 0 ? (
          <div className="bg-white rounded-[2.5rem] p-24 text-center border border-gray-100 shadow-sm">
            <div className="text-gray-100 text-9xl mb-6 flex justify-center text-primary/10"><FiList /></div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">No services listed yet</h3>
            <p className="text-gray-400 font-medium max-w-sm mx-auto mb-8">
              Start listing your professional services to attract customers and grow your business.
            </p>
            <Link
              to="/provider/add-service"
              className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-2xl font-semibold text-xs uppercase shadow-xl shadow-primary/20 hover:bg-primary-dark transition-all transform active:scale-95"
            >
              <FiPlus /> List Your First Service
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {services.map(service => (
              <div
                key={service._id}
                className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden group hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300"
              >
                <div className="p-7">
                  {/* Category */}
                  {/* <div className="flex justify-between items-center mb-5">
                    <span className="bg-primary/5 text-primary px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest">
                       {service.category}
                    </span>
                  </div> */}

                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-2 min-h-[56px] line-clamp-2">{service.title}</h3>
                  
                  {/* Description Snippet */}
                  <p className="text-sm text-gray-500 mb-6 line-clamp-2 min-h-[40px]">
                    {service.description || "No description provided for this service."}
                  </p>

                  {/* Stats - Refined to prevent text breaking */}
                  <div className="space-y-3 mb-6">
                    <div className="bg-gray-50/80 p-4 rounded-2xl flex items-center justify-between group-hover:bg-primary/[0.02] transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-sm text-primary flex-shrink-0">
                           ₹
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Price</p>
                          {/* <p className="text-sm font-bold text-gray-800">Starting from</p> */}
                        </div>
                      </div>
                      <span className="text-xl font-black text-primary">₹{service.price}/hr</span>
                    </div>

                    <div className="bg-gray-50/80 p-4 rounded-2xl flex items-center justify-between group-hover:bg-primary/[0.02] transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-sm text-primary flex-shrink-0">
                           <FiClock size={18} />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Duration</p>
                          <p className="text-sm font-bold text-gray-800">Est. Time</p>
                        </div>
                      </div>
                      <span className="text-lg font-bold text-gray-900 whitespace-nowrap">{service.duration}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-5 border-t border-gray-50">
                    <Link
                      to={`/provider/edit-service/${service._id}`}
                      className="flex-1 bg-white hover:bg-gray-50 text-gray-700 text-[12px] font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 border border-gray-200 shadow-sm"
                    >
                      <FiEdit size={14} /> EDIT
                    </Link>
                    <button
                      onClick={() => handleDelete(service._id)}
                      className="w-12 bg-red-50 hover:bg-red-500 hover:text-white text-red-500 rounded-xl flex items-center justify-center transition-all border border-red-100 shadow-sm group"
                      title="Remove Service"
                    >
                      <FiTrash2 size={16} className="group-hover:scale-110 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
