import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiArrowLeft, 
  FiPlus, 
  FiDollarSign, 
  FiClock, 
  FiInfo, 
  FiTag 
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import { addServiceAPI } from '../../services/allAPI';

export default function AddService() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [newService, setNewService] = useState({
    title: '',
    price: '',
    duration: '',
    description: ''
  });

  const handleAddService = async (e) => {
    e.preventDefault();
    const providerId = sessionStorage.getItem('userId');
    if (!providerId) {
      toast.error('Session expired. Please login again.');
      navigate('/login');
      return;
    }

    setSaving(true);
    try {
      const result = await addServiceAPI(providerId, newService);
      if (result.status === 200) {
        toast.success('Service added successfully!');
        navigate('/provider/my-services');
      } else {
        toast.error(result.data || 'Failed to add service. Please try again.');
      }
    } catch (err) {
      toast.error('Something went wrong. Please try again.');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-10 flex items-center gap-6">
          <button 
            onClick={() => navigate('/provider/dashboard')}
            className="p-3 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all text-gray-700 hover:text-primary active:scale-95"
          >
            <FiArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-4xl font-bold text-gray-900 leading-none">Add New Service</h1>
            <p className="mt-2 text-gray-700 font-medium text-sm">Expand your business by listing a new professional service</p>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
          <div className="p-10">
            <form onSubmit={handleAddService} className="space-y-8">
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
                      value={newService.title}
                      onChange={(e) => setNewService({...newService, title: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[13px] font-semibold text-gray-700 mb-3 ml-1">PRICE (₹/hr)</label>
                  <div className="relative">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-primary font-bold text-lg">₹</div>
                    <input 
                      type="number"
                      required
                      className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-semibold"
                      placeholder="450"
                      value={newService.price}
                      onChange={(e) => setNewService({...newService, price: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[13px] font-semibold text-gray-700 uppercase mb-3 ml-1">Estimated Duration</label>
                  <div className="relative">
                    <FiClock className="absolute left-5 top-1/2 -translate-y-1/2 text-primary" />
                    <input 
                      type="text"
                      required
                      className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-semibold"
                      placeholder="e.g. 2-3 hours"
                      value={newService.duration}
                      onChange={(e) => setNewService({...newService, duration: e.target.value})}
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
                      value={newService.description}
                      onChange={(e) => setNewService({...newService, description: e.target.value})}
                    ></textarea>
                  </div>
                </div>
              </div>

              <div className="pt-6 flex gap-4">
                <button 
                  type="submit"
                  className="flex-1 bg-primary text-white py-5 rounded-2xl font-semibold text-sm uppercase transition-all shadow-2xl shadow-primary/20 hover:bg-primary-dark transform active:scale-95 flex items-center justify-center gap-2"
                >
                  <FiPlus size={18} /> List Service Now
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
