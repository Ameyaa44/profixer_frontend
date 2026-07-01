import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { registerUserAPI, registerProviderAPI } from '../../services/allAPI';
import { FiUser, FiMail, FiLock, FiBriefcase, FiClock, FiDollarSign, FiPhone, FiInfo, FiLoader, FiCheckCircle, FiArrowLeft, FiCamera, FiGlobe, FiMapPin, FiArrowRight, FiPlus, FiX } from 'react-icons/fi';

const CATEGORIES = ['Cleaning', 'Plumbing', 'Electrical', 'Painting', 'Appliances', 'Carpentry', 'Pest Control'];

export default function Register() {
  const [formData, setFormData] = useState(() => {
    const savedData = sessionStorage.getItem('registerFormData');
    if (savedData) {
        try {
            return JSON.parse(savedData);
        } catch (e) {
            console.error('Error parsing saved form data', e);
        }
    }
    return {
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'user',
        category: '',
        experience: '',
        phone: '',
        about: '',
        languages: '',
        address: '',
        aadhar: '',
        skills: ''
    };
  });
  const [profileImage, setProfileImage] = useState(null);
  const [certifications, setCertifications] = useState(null);
  const [workProof, setWorkProof] = useState(null);
  
  // Reconstruct file names from session storage if they exist
  const [certFileName, setCertFileName] = useState(() => sessionStorage.getItem('registerCertFileName') || '');
  const [workProofFileName, setWorkProofFileName] = useState(() => sessionStorage.getItem('registerWorkProofFileName') || '');

  const [preview, setPreview] = useState(() => sessionStorage.getItem('registerProfileImage') || '');
  const [loading, setLoading] = useState(false);
  const [currentSkill, setCurrentSkill] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (profileImage) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setPreview(base64String);
        try {
            sessionStorage.setItem('registerProfileImage', base64String);
        } catch (e) {
            console.warn('Image too large for sessionStorage');
        }
      };
      reader.readAsDataURL(profileImage);
    }
  }, [profileImage]);

  useEffect(() => {
    if (certifications) {
      const reader = new FileReader();
      reader.onloadend = () => {
        try {
          sessionStorage.setItem('registerCertBase64', reader.result);
          sessionStorage.setItem('registerCertFileName', certifications.name);
          setCertFileName(certifications.name);
        } catch (e) {
          console.warn('Certification too large for sessionStorage');
        }
      };
      reader.readAsDataURL(certifications);
    }
  }, [certifications]);

  useEffect(() => {
    if (workProof) {
      const reader = new FileReader();
      reader.onloadend = () => {
        try {
          sessionStorage.setItem('registerWorkProofBase64', reader.result);
          sessionStorage.setItem('registerWorkProofFileName', workProof.name);
          setWorkProofFileName(workProof.name);
        } catch (e) {
          console.warn('Work proof too large for sessionStorage');
        }
      };
      reader.readAsDataURL(workProof);
    }
  }, [workProof]);

  useEffect(() => {
    sessionStorage.setItem('registerFormData', JSON.stringify(formData));
  }, [formData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (role) => {
    setFormData({ ...formData, role });
  };
  
  const addSkill = () => {
    if (currentSkill.trim()) {
      const skillsArray = formData.skills ? formData.skills.split(',').map(s => s.trim()).filter(s => s) : [];
      if (!skillsArray.includes(currentSkill.trim())) {
        const newSkills = [...skillsArray, currentSkill.trim()].join(', ');
        setFormData({ ...formData, skills: newSkills });
      }
      setCurrentSkill('');
    }
  };

  const removeSkill = (skillToRemove) => {
    const skillsArray = formData.skills.split(',').map(s => s.trim()).filter(s => s);
    const newSkills = skillsArray.filter(s => s !== skillToRemove).join(', ');
    setFormData({ ...formData, skills: newSkills });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }

    setLoading(true);

    try {
      let result;
      if (formData.role === 'user') {
        result = await registerUserAPI({
          username: formData.name, // Mapping 'name' from form to 'username' expected by backend
          email: formData.email,
          password: formData.password,
        });
        
        if (result.status === 200) {
            sessionStorage.removeItem('registerFormData');
            sessionStorage.removeItem('registerProfileImage');
            sessionStorage.removeItem('registerCertBase64');
            sessionStorage.removeItem('registerCertFileName');
            sessionStorage.removeItem('registerWorkProofBase64');
            sessionStorage.removeItem('registerWorkProofFileName');
            toast.success('Account created! Welcome to ProFixer.');
            navigate('/login');
        } else {
            toast.error(result.response?.data || "Registration failed");
        }
      } else {
        // Provider Registration with FormData
        const reqBody = new FormData();
        reqBody.append("username", formData.name);
        reqBody.append("email", formData.email);
        reqBody.append("password", formData.password);
        reqBody.append("category", formData.category);
        reqBody.append("experience", formData.experience);
        reqBody.append("phone", formData.phone);
        reqBody.append("about", formData.about);
        reqBody.append("languages", formData.languages);
        reqBody.append("address", formData.address);
        reqBody.append("aadhar", formData.aadhar);
        reqBody.append("skills", formData.skills);
        
        let finalProfileImage = profileImage;
        if (!finalProfileImage && preview && preview.startsWith('data:image')) {
            // Convert base64 from sessionStorage back to a File object
            const arr = preview.split(',');
            const mime = arr[0].match(/:(.*?);/)[1];
            const bstr = atob(arr[1]);
            let n = bstr.length;
            const u8arr = new Uint8Array(n);
            while(n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }
            finalProfileImage = new File([u8arr], "profile_recovered.jpg", { type: mime });
        }

        if (finalProfileImage) {
          reqBody.append("profileImage", finalProfileImage);
        }

        // Recover Certifications
        let finalCert = certifications;
        const savedCertBase64 = sessionStorage.getItem('registerCertBase64');
        if (!finalCert && savedCertBase64) {
            const arr = savedCertBase64.split(',');
            const mime = arr[0].match(/:(.*?);/)[1];
            const bstr = atob(arr[1]);
            let n = bstr.length;
            const u8arr = new Uint8Array(n);
            while(n--) { u8arr[n] = bstr.charCodeAt(n); }
            finalCert = new File([u8arr], certFileName || "certification.pdf", { type: mime });
        }
        if (finalCert) reqBody.append("certifications", finalCert);

        // Recover Work Proof
        let finalWorkProof = workProof;
        const savedWorkProofBase64 = sessionStorage.getItem('registerWorkProofBase64');
        if (!finalWorkProof && savedWorkProofBase64) {
            const arr = savedWorkProofBase64.split(',');
            const mime = arr[0].match(/:(.*?);/)[1];
            const bstr = atob(arr[1]);
            let n = bstr.length;
            const u8arr = new Uint8Array(n);
            while(n--) { u8arr[n] = bstr.charCodeAt(n); }
            finalWorkProof = new File([u8arr], workProofFileName || "workproof.pdf", { type: mime });
        }
        if (finalWorkProof) reqBody.append("workProof", finalWorkProof);

        const reqHeader = {
          "Content-Type": "multipart/form-data"
        };

        result = await registerProviderAPI(reqBody, reqHeader);

        if (result.status === 200) {
            sessionStorage.removeItem('registerFormData');
            sessionStorage.removeItem('registerProfileImage');
            sessionStorage.removeItem('registerCertBase64');
            sessionStorage.removeItem('registerCertFileName');
            sessionStorage.removeItem('registerWorkProofBase64');
            sessionStorage.removeItem('registerWorkProofFileName');
            toast.success('Professional account created! Welcome aboard.');
            navigate('/login');
        } else {
            toast.error(result.response?.data || "Registration failed");
        }
      }
    } catch (err) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-white overflow-hidden font-default">
      {/* Left Decoration Side (Marketing) */}
      <div className="hidden lg:flex w-1/2 premium-gradient relative p-16 flex-col justify-between overflow-hidden">
        {/* Animated Orbs */}
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-accent/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />

        <div className="relative z-10">
          <Link to="/" className="text-3xl font-bold text-white flex items-center gap-2">
            <span className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-primary italic">P</span>
            ProFixer
          </Link>
          
          <div className={`transition-all duration-500 transform ${formData.role === 'provider' ? '-translate-y-4 opacity-0 hidden' : 'translate-y-0 opacity-100 block'}`}>
              <h1 className="mt-20 text-5xl xl:text-6xl font-bold text-white leading-tight">
                Your Home, <br /> 
                <span className="text-white/70">Expertly Maintained.</span>
              </h1>
              <p className="mt-8 text-white/80 text-xl max-w-md leading-relaxed">
                Join thousands of happy customers and book top-rated professionals for all your home service needs.
              </p>
          </div>

          <div className={`transition-all duration-500 transform ${formData.role === 'user' ? 'translate-y-4 opacity-0 hidden' : 'translate-y-0 opacity-100 block'}`}>
              <h1 className="mt-20 text-5xl xl:text-6xl font-bold text-white leading-tight">
                Grow Your <br /> 
                <span className="text-white/70">Service Business.</span>
              </h1>
              <p className="mt-8 text-white/80 text-xl max-w-md leading-relaxed">
                Partner with ProFixer to reach more customers, manage bookings easily, and increase your earnings.
              </p>
              
              <div className="space-y-4 mt-8">
                {[
                    'Instant job notifications',
                    'Flexible schedule control',
                    'Direct payment gateway',
                    '24/7 Professional support'
                ].map((item) => (
                    <div key={item} className="flex items-center gap-3">
                        <FiCheckCircle className="text-white text-xl flex-shrink-0 drop-shadow-md" />
                        <span className="text-lg font-medium text-white/90 drop-shadow-md">{item}</span>
                    </div>
                ))}
              </div>
          </div>
        </div>

        <div className="relative z-10 flex gap-12 text-white/60 mt-5">
          <div className="flex flex-col">
            <span className="text-white text-2xl font-bold">10k+</span>
            <span className="text-sm">Verified Providers</span>
          </div>
          <div className="flex flex-col">
            <span className="text-white text-2xl font-bold">50k+</span>
            <span className="text-sm">Happy Customers</span>
          </div>
          <div className="flex flex-col">
            <span className="text-white text-2xl font-bold">4.9/5</span>
            <span className="text-sm">Service Rating</span>
          </div>
        </div>
      </div>

      {/* Right Form Side - Scrollable */}
      <div className="w-full lg:w-1/2 flex items-start justify-center p-8 md:p-16 bg-gray-50/50 overflow-y-auto custom-scrollbar h-screen">
        <div className="w-full max-w-xl space-y-8 relative pt-4 pb-10">
          
          <div className="lg:hidden mb-8">
            <Link to="/" className="inline-flex items-center gap-2 text-primary font-bold">
              <FiArrowLeft /> Back to Home
            </Link>
          </div>
          <div className="hidden lg:block absolute -top-8 left-0">
             <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary font-bold transition-colors">
                <FiArrowLeft /> Back to Home
             </Link>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-4">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 tracking-tight">Create Account</h2>
              <p className="mt-2 text-gray-500 text-lg font-medium">Join the ProFixer network</p>
            </div>
            
            {/* Animated Toggle */}
            <div className="p-1.5 bg-gray-200/60 rounded-2xl flex self-start sm:self-end h-14 min-w-[240px] relative shadow-inner">
              <button
                type="button"
                onClick={() => handleRoleChange('user')}
                className={`flex-1 relative z-10 flex items-center justify-center gap-2 text-sm font-bold transition-all duration-300 rounded-xl ${formData.role === 'user' ? 'text-gray-900 drop-shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Customer
              </button>
              <button
                type="button"
                onClick={() => handleRoleChange('provider')}
                className={`flex-1 relative z-10 flex items-center justify-center gap-2 text-sm font-bold transition-all duration-300 rounded-xl ${formData.role === 'provider' ? 'text-gray-900 drop-shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Professional
              </button>
              <div 
                className={`absolute inset-y-1.5 left-1.5 w-[calc(50%-6px)] bg-white rounded-xl shadow-md transition-all duration-500 transform ease-spring ${formData.role === 'provider' ? 'translate-x-full' : 'translate-x-0'}`}
              />
            </div>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit} autoComplete="off">
            
            <div className={`transition-all duration-500 ease-in-out transform ${formData.role === 'provider' ? 'opacity-100 scale-100 block' : 'opacity-0 scale-95 hidden'}`}>
              <div className="flex flex-col items-center justify-center mb-8 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                <label className="cursor-pointer group relative">
                    <div className="w-32 h-32 rounded-[2rem] border-4 border-gray-50 overflow-hidden bg-gray-50 flex items-center justify-center transition-all group-hover:border-primary/50 group-hover:shadow-lg shadow-sm">
                        {preview ? (
                            <img src={preview} alt="Profile Preview" className="w-full h-full object-cover" />
                        ) : (
                            <div className="text-center">
                                <div className="bg-white p-3 rounded-2xl shadow-sm mb-2 mx-auto w-max group-hover:scale-110 transition-transform">
                                   <FiCamera className="text-xl text-primary" />
                                </div>
                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Upload Photo</span>
                            </div>
                        )}
                    </div>
                    <input 
                        type="file" 
                        accept="image/jpeg, image/png, image/jpg"
                        className="hidden" 
                        onChange={e => setProfileImage(e.target.files[0])} 
                    />
                </label>
              </div>
            </div>

            {/* Provider Document Uploads */}
            <div className={`transition-all duration-500 ease-in-out transform flex flex-col md:flex-row gap-4 mb-4 ${formData.role === 'provider' ? 'opacity-100 scale-100 block' : 'opacity-0 scale-95 hidden'}`}>
                <div className="flex-1 bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4 group hover:border-primary/50 transition-all cursor-pointer relative overflow-hidden">
                    <div className="bg-orange-50 p-3 rounded-2xl group-hover:scale-110 transition-transform flex-shrink-0">
                        <FiInfo className="text-orange-500 text-xl" />
                    </div>
                    <div className="flex-grow">
                        <p className="text-sm font-bold text-gray-900">Certifications</p>
                        <p className="text-xs text-gray-500 font-medium truncate w-32 md:w-40">
                            {certifications ? certifications.name : (certFileName || 'PDF Document (Optional)')}
                        </p>
                    </div>
                    <input 
                        type="file" 
                        accept=".pdf"
                        className="absolute inset-0 opacity-0 cursor-pointer" 
                        onChange={e => setCertifications(e.target.files[0])} 
                    />
                </div>
                
                <div className="flex-1 bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4 group hover:border-primary/50 transition-all cursor-pointer relative overflow-hidden">
                    <div className="bg-blue-50 p-3 rounded-2xl group-hover:scale-110 transition-transform flex-shrink-0">
                        <FiBriefcase className="text-blue-500 text-xl" />
                    </div>
                    <div className="flex-grow">
                        <p className="text-sm font-bold text-gray-900">Work Proof</p>
                        <p className="text-xs text-gray-500 font-medium truncate w-32 md:w-40">
                            {workProof ? workProof.name : (workProofFileName || 'PDF Document (Optional)')}
                        </p>
                    </div>
                    <input 
                        type="file" 
                        accept=".pdf"
                        className="absolute inset-0 opacity-0 cursor-pointer" 
                        onChange={e => setWorkProof(e.target.files[0])} 
                    />
                </div>
            </div>

            {/* Common Fields */}
            <div className="space-y-5">
              <div className="group">
                <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Full Name</label>
                <div className="relative">
                  <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
                  <input
                    name="name"
                    type="text"
                    required
                    className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-primary transition-all font-medium text-gray-900 shadow-sm"
                    placeholder="John Doe"
                    autoComplete="off"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="group">
                <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Email Address</label>
                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
                  <input
                    name="email"
                    type="email"
                    required
                    className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-primary transition-all font-medium text-gray-900 shadow-sm"
                    placeholder="john@gmail.com"
                    autoComplete="off"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="group">
                <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Password</label>
                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
                  <input
                    name="password"
                    type="password"
                    required
                    minLength={3}
                    title="Password must be at least 3 characters long"
                    className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-primary transition-all font-medium text-gray-900 shadow-sm"
                    placeholder="••••••••"
                    autoComplete="new-password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="group">
                <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Confirm Password</label>
                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
                  <input
                    name="confirmPassword"
                    type="password"
                    required
                    minLength={3}
                    className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-primary transition-all font-medium text-gray-900 shadow-sm"
                    placeholder="••••••••"
                    autoComplete="new-password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Provider Specific Fields */}
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-5 transition-all duration-500 ease-in-out overflow-hidden ${formData.role === 'provider' ? 'max-h-[1000px] opacity-100 pt-2' : 'max-h-0 opacity-0 m-0 p-0'}`}>
                
                  <div className="group space-y-2">
                    <label className="block text-sm font-bold text-gray-700 ml-1">Service Category</label>
                    <div className="relative font-bold">
                        <FiBriefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10 group-focus-within:text-primary transition-colors" />
                        <select
                        name="category"
                        required={formData.role === 'provider'}
                        className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-primary transition-all font-medium text-gray-900 shadow-sm appearance-none relative z-0 cursor-pointer"
                        value={formData.category}
                        onChange={handleChange}
                        >
                            <option value="">Select Category</option>
                            {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </div>
                  </div>

                  <div className="group space-y-2">
                    <label className="block text-sm font-bold text-gray-700 ml-1">Experience (Years)</label>
                    <div className="relative">
                      <FiClock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
                      <input
                        name="experience"
                        type="number"
                        placeholder="e.g. 5"
                        required={formData.role === 'provider'}
                        className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-primary transition-all font-medium text-gray-900 shadow-sm"
                        value={formData.experience}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="group space-y-2">
                    <label className="block text-sm font-bold text-gray-700 ml-1">Mobile Number</label>
                    <div className="relative">
                      <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
                      <input
                        name="phone"
                        type="tel"
                        placeholder="+91 9876543210"
                        required={formData.role === 'provider'}
                        className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-primary transition-all font-medium text-gray-900 shadow-sm"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="group space-y-2">
                    <label className="block text-sm font-bold text-gray-700 ml-1">Languages Spoken</label>
                    <div className="relative">
                      <FiGlobe className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
                      <input
                        name="languages"
                        type="text"
                        placeholder="e.g. English, Hindi"
                        required={formData.role === 'provider'}
                        className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-primary transition-all font-medium text-gray-900 shadow-sm"
                        value={formData.languages}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="group space-y-2">
                    <label className="block text-sm font-bold text-gray-700 ml-1">Full Address/Location</label>
                    <div className="relative">
                      <FiMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
                      <input
                        name="address"
                        type="text"
                        placeholder="Street, City, State"
                        required={formData.role === 'provider'}
                        className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-primary transition-all font-medium text-gray-900 shadow-sm"
                        value={formData.address}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="group space-y-2">
                    <label className="block text-sm font-bold text-gray-700 ml-1">Aadhar Number</label>
                    <div className="relative">
                      <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
                      <input
                        name="aadhar"
                        type="text"
                        placeholder="12-digit Aadhar"
                        required={formData.role === 'provider'}
                        pattern="[0-9]{12}"
                        minLength={12}
                        maxLength={12}
                        title="Aadhar number must be exactly 12 digits"
                        className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-primary transition-all font-medium text-gray-900 shadow-sm"
                        value={formData.aadhar}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, ''); // strip non-digits
                          setFormData({ ...formData, aadhar: val });
                        }}
                      />
                    </div>
                  </div>

                  <div className="group md:col-span-2 space-y-2">
                    <label className="block text-sm font-bold text-gray-700 ml-1">Key Skills</label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {formData.skills && formData.skills.split(',').map(s => s.trim()).filter(s => s).map((skill, idx) => (
                        <div key={idx} className="bg-primary/10 text-primary px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 border border-primary/20 animate-in zoom-in duration-300">
                          {skill}
                          <button type="button" onClick={() => removeSkill(skill)} className="hover:text-primary-dark">
                            <FiX size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="relative">
                      <FiCheckCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
                      <input
                        type="text"
                        placeholder="Type a skill and click +"
                        className="w-full pl-12 pr-16 py-4 bg-white border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-primary transition-all font-medium text-gray-900 shadow-sm"
                        value={currentSkill}
                        onChange={(e) => setCurrentSkill(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addSkill();
                          }
                        }}
                      />
                      <button 
                        type="button"
                        onClick={addSkill}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center hover:bg-primary-dark transition-all active:scale-90"
                      >
                        <FiPlus />
                      </button>
                    </div>
                  </div>

                  <div className="group md:col-span-2 space-y-2">
                    <label className="block text-sm font-bold text-gray-700 ml-1">Professional Tagline / Bio</label>
                    <div className="relative">
                      <FiInfo className="absolute left-4 top-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                      <textarea
                        name="about"
                        rows="3"
                        placeholder="Briefly describe your expertise..."
                        required={formData.role === 'provider'}
                        className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-primary transition-all font-medium text-gray-900 shadow-sm resize-none"
                        value={formData.about}
                        onChange={handleChange}
                      ></textarea>
                    </div>
                  </div>
            </div>

            <button
              type="submit"
              className="w-full h-14 bg-gray-900 hover:bg-black text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xl shadow-gray-200 mt-8"
            >
              Create Account <FiArrowRight className="ml-1" />
            </button>
          </form>

          <p className="text-center text-gray-600 font-medium pt-6 pb-10">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-bold hover:underline decoration-2 underline-offset-4">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
