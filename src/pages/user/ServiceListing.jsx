import ProviderCard from '../../components/Cards/ProviderCard';
import { FiSearch, FiFilter, FiMapPin } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getApprovedProvidersAPI } from '../../services/allAPI';


export default function ServiceListing() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';
  
  const [searchTerm, setSearchTerm] = useState(searchParams.get('query') || '');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [providers, setProviders] = useState([]);

  useEffect(() => {
    fetchApprovedProviders();
  }, []);

  const fetchApprovedProviders = async () => {
    try {
      const result = await getApprovedProvidersAPI();
      if (result.status === 200) {
        setProviders(result.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const categories = ['All', 'Cleaning', 'Plumbing', 'Electrical', 'Carpentry', 'Painting', 'Appliances'];

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    if (category === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', category);
    }
    setSearchParams(searchParams);
  };

  // Filter based on search, category and only show Approved ones
  const filteredServices = providers.filter(provider => {
    const matchesCategory = selectedCategory === 'All' || provider.category === selectedCategory;
    const matchesLocation = selectedLocation === 'All' || (provider.address && provider.address.toLowerCase().includes(selectedLocation.toLowerCase()));
    const matchesSearch = provider.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          provider.category.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (provider.about && provider.about.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch && matchesLocation;
  });

  // Extract unique locations from providers
  const uniqueLocations = ['All', ...new Set(providers.map(p => p.address ? p.address.split(',')[0].trim() : '').filter(Boolean))];


  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header & Search */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">Explore Professionals</h1>
            <p className="mt-2 text-gray-600">Find the right professional for your needs.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            {/* Location Select */}
            <div className="relative w-full sm:w-48 flex-shrink-0 group">
               <FiMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-focus-within:text-primary transition-colors" />
               <select
                 value={selectedLocation}
                 onChange={(e) => setSelectedLocation(e.target.value)}
                 className="block w-full pl-11 pr-10 py-3.5 bg-white border border-gray-200 rounded-2xl appearance-none focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-sm font-bold text-gray-700 shadow-sm"
               >
                 {uniqueLocations.map(loc => (
                   <option key={loc} value={loc}>{loc === 'All' ? 'All Locations' : loc}</option>
                 ))}
               </select>
               <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-gray-400">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
               </div>
            </div>

            <div className="w-full md:w-80 relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400 group-focus-within:text-primary transition-colors" />
              </div>
              <input
                type="text"
                className="block w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-2xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-sm font-bold text-gray-700 shadow-sm"
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => {
                  const val = e.target.value;
                  setSearchTerm(val);
                  if (val) searchParams.set('query', val);
                  else searchParams.delete('query');
                  setSearchParams(searchParams, { replace: true });
                }}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Filters Sidebar */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
              <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-100">
                <FiFilter className="text-gray-500" />
                <h3 className="font-semibold text-gray-800">Categories</h3>
              </div>
              
              <div className="space-y-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategorySelect(cat)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedCategory === cat
                        ? 'bg-primary/10 text-primary font-semibold'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Service Grid Array */}
          <div className="flex-1">
            {filteredServices.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredServices.map((provider) => (
                  <ProviderCard key={provider.id} provider={provider} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-10 text-center border border-gray-200">
                <div className="text-gray-400 text-6xl mb-4 flex justify-center">
                  <FiSearch />
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-1">No professionals found</h3>
                <p className="text-gray-500">We couldn't find any professionals matching "{searchTerm}" in {selectedCategory}.</p>
                <button 
                  onClick={() => { setSearchTerm(''); handleCategorySelect('All'); setSelectedLocation('All'); }}
                  className="mt-6 text-primary font-medium hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
