import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  FiArrowLeft, 
  FiClock, 
  FiInfo, 
  FiTag,
  FiSave,
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import { getSingleServiceAPI, updateServiceAPI } from '../../services/allAPI';

export default function EditService() {
  const navigate = useNavigate();
  const { serviceId } = useParams();

  const [serviceData, setServiceData] = useState({
    title: '',
    price: '',
    duration: '',
    description: ''
  });

  useEffect(() => {
    fetchServiceDetails();
  }, [serviceId]);

  const fetchServiceDetails = async () => {
    try {
      const result = await getSingleServiceAPI(serviceId);
      if (result.status === 200) {
        setServiceData({
          title: result.data.title,
          price: result.data.price,
          duration: result.data.duration,
          description: result.data.description
        });
      } else {
        toast.error('Failed to load service details');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error loading service');
    }
  };

  const handleUpdateService = async (e) => {
    e.preventDefault();
    try {
      const result = await updateServiceAPI(serviceId, serviceData);
      if (result.status === 200) {
        toast.success('Service updated successfully!');
        navigate('/provider/my-services');
      } else {
        toast.error(result.data || 'Failed to update service');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error updating service');
    }
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen py-12 font-default">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-10 flex items-center gap-6">
          <button 
            onClick={() => navigate('/provider/my-services')}
            className="p-3 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all text-gray-700 hover:text-primary active:scale-95"
          >
            <FiArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-4xl font-bold text-gray-900 leading-none">Edit Service</h1>
            <p className="mt-2 text-gray-700 font-medium text-sm">Refine your service details for optimal customer conversion</p>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
          <div className="p-10">
            <form onSubmit={handleUpdateService} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="md:col-span-2">
                  <label className="block text-[13px] font-semibold text-gray-700 uppercase mb-3 ml-1">Service Title</label>
                  <div className="relative">
                    <FiTag className="absolute left-5 top-1/2 -translate-y-1/2 text-primary" />
                    <input 
                      type="text"
                      required
                      className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-semibold"
                      placeholder="e.g. Master Pipe Repair"
                      value={serviceData.title}
                      onChange={(e) => setServiceData({...serviceData, title: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[13px] font-semibold text-gray-700 mb-3 ml-1">PRICE (₹/hr)</label>
                  <div className="relative">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-primary font-bold text-lg">₹</div>
                    <input 
                      type="text"
                      required
                      inputMode="numeric"
                      className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-semibold"
                      placeholder="450"
                      value={serviceData.price}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (/^\d*$/.test(val)) {
                          setServiceData({...serviceData, price: val});
                        }
                      }}
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[13px] font-semibold text-gray-700 uppercase mb-3 ml-1">Estimated Duration</label>
                  <div className="relative">
                    <FiClock className="absolute left-5 top-1/2 -translate-y-1/2 text-primary" />
                    <input 
                      type="text"
                      required
                      className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-semibold"
                      placeholder="e.g. 2-3 hours"
                      value={serviceData.duration}
                      onChange={(e) => setServiceData({...serviceData, duration: e.target.value})}
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[13px] font-semibold text-gray-700 uppercase mb-3 ml-1">Service Description</label>
                  <div className="relative">
                    <FiInfo className="absolute left-5 top-5 text-primary" />
                    <textarea 
                      required
                      rows="3"
                      className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-semibold resize-none"
                      placeholder="Describe what's included in this service..."
                      value={serviceData.description}
                      onChange={(e) => setServiceData({...serviceData, description: e.target.value})}
                    ></textarea>
                  </div>
                </div>
              </div>

              <div className="pt-6 flex gap-4">
                <button 
                  type="submit"
                  className="flex-1 bg-primary text-white py-5 rounded-2xl font-semibold text-sm uppercase transition-all shadow-2xl shadow-primary/20 hover:bg-primary-dark transform active:scale-95 flex items-center justify-center gap-2"
                >
                  <FiSave size={18} /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
