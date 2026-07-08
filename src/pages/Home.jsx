import { Link, useNavigate } from 'react-router-dom';
import ProviderCard from '../components/Cards/ProviderCard';
import { FiSearch, FiArrowRight, FiDroplet, FiZap, FiTool, FiEdit2, FiMonitor, FiShield, FiTruck, FiClipboard, FiMail, FiUser, FiMessageSquare, FiSend, FiPhone } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { getApprovedProvidersAPI } from '../services/allAPI';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredProviders, setFeaturedProviders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchApprovedProviders();
  }, []);

  const fetchApprovedProviders = async () => {
    try {
      const result = await getApprovedProvidersAPI();
      if (result.status === 200) {
        setFeaturedProviders(result.data.slice(0, 3));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/services?query=${encodeURIComponent(searchQuery)}`);
    }
  };



  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gray-900 text-white overflow-hidden py-24 sm:py-32">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
            alt="Hero background" 
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/80 to-transparent"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="max-w-2xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              Expert Home Services, <br/> <span className="text-primary">On Demand.</span>
            </h1>
            <p className="text-xl text-gray-300 mb-10 max-w-lg leading-relaxed">
              Find highly rated professionals for cleaning, plumbing, electrical, and more. Browse their profiles and book instantly.
            </p>
            
            <div className="bg-white p-2 rounded-xl flex items-center shadow-2xl max-w-xl focus-within:ring-2 focus-within:ring-primary transition-all">
              <div className="pl-4 text-gray-400">
                <FiSearch size={24} />
              </div>
              <input 
                type="text" 
                placeholder="What type of professional do you need?" 
                className="w-full text-black bg-transparent border-none focus:outline-none px-4 py-3 text-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button 
                onClick={handleSearch}
                className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-lg font-bold transition-colors duration-200 shadow-md"
              >
                Search
              </button>
            </div>
            
            <div className="mt-8 flex flex-wrap gap-4 text-sm text-gray-300 font-medium">
              <span>Popular:</span>
              <Link to="/services?category=Appliances" className="hover:text-white border-b border-transparent hover:border-white transition-colors">AC Repair</Link>
              <Link to="/services?category=Cleaning" className="hover:text-white border-b border-transparent hover:border-white transition-colors">House Cleaning</Link>
              <Link to="/services?category=Electrical" className="hover:text-white border-b border-transparent hover:border-white transition-colors">Electrician</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Browse Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'Cleaning', icon: <FiDroplet size={24} /> },
              { name: 'Plumbing', icon: <FiTool size={24} /> },
              { name: 'Electrical', icon: <FiZap size={24} /> },
              { name: 'Carpentry', icon: <FiClipboard size={24} /> },
              { name: 'Painting', icon: <FiEdit2 size={24} /> },
              { name: 'Appliances', icon: <FiMonitor size={24} /> },
              { name: 'Pest Control', icon: <FiShield size={24} /> },
              // { name: 'Packers', icon: <FiTruck size={24} /> }
            ].map((cat, i) => (
              <Link to={`/services?category=${cat.name}`} key={i} className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md hover:border-primary border border-gray-100 flex flex-col items-center justify-center gap-4 transition-all group">
                <div className="w-16 h-16 bg-blue-50 text-primary rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  {cat.icon}
                </div>
                <h3 className="font-semibold text-gray-800">{cat.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Top Rated Professionals</h2>
              <p className="mt-2 text-gray-500 text-lg">Highly recommended professionals in your area.</p>
            </div>
            <Link to="/services" className="hidden sm:flex items-center gap-2 text-primary font-semibold hover:text-primary-dark transition-colors">
              View all professionals <FiArrowRight />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProviders.map(provider => (
              <ProviderCard key={provider.id} provider={provider} />
            ))}
          </div>
        </div>
      </section>
      {/* Contact Us Section */}
      <section id="contact-us" className="py-20 bg-gray-50 border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Get in Touch</h2>
            <p className="text-lg text-gray-500 mb-8">Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
            
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8 text-gray-600 font-medium">
              <div className="flex items-center justify-center gap-3 bg-white px-6 py-3 rounded-2xl shadow-sm border border-gray-100 w-full sm:w-auto">
                <div className="bg-primary/10 p-2 rounded-xl text-primary">
                  <FiMail size={20} />
                </div>
                <span>support@profixer.com</span>
              </div>
              <div className="flex items-center justify-center gap-3 bg-white px-6 py-3 rounded-2xl shadow-sm border border-gray-100 w-full sm:w-auto">
                <div className="bg-primary/10 p-2 rounded-xl text-primary">
                  <FiPhone size={20} />
                </div>
                <span>+91 9876543210</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-8 md:p-12 border border-gray-100">
            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); alert('Message sent successfully!'); e.target.reset(); }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Full Name</label>
                  <div className="relative">
                    <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" required className="w-full pl-11 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-gray-900" placeholder="John Doe" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Email Address</label>
                  <div className="relative">
                    <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="email" required className="w-full pl-11 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-gray-900" placeholder="john@gmail.com" />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Message</label>
                <div className="relative">
                  <FiMessageSquare className="absolute left-4 top-5 text-gray-400" />
                  <textarea required rows="4" className="w-full pl-11 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-gray-900 resize-none" placeholder="How can we help you?"></textarea>
                </div>
              </div>
              
              <button type="submit" className="w-full py-4 bg-primary hover:bg-primary-dark text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all transform active:scale-95 shadow-xl shadow-primary/20">
                Send Message <FiSend />
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
