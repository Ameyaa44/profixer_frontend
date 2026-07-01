import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiSave, 
  FiUpload, 
  FiArrowLeft, 
  FiImage, 
  FiUser, 
  FiMail, 
  FiLock, 
  FiBriefcase, 
  FiClock, 
  FiPhone, 
  FiInfo,
  FiGlobe,
  FiMapPin,
  FiCheckCircle,
  FiX,
  FiPlus,
  FiFileText
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import { getProviderDetailsAPI, updateProviderProfileAPI } from '../../services/allAPI';
import { BASE_URL } from '../../services/baseUrl';

const CATEGORIES = ['Cleaning', 'Plumbing', 'Electrical', 'Painting', 'Appliances', 'Carpentry', 'Pest Control'];

export default function EditProfile() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    category: '',
    experience: '',
    about: '',
    languages: '',
    address: '',
    aadhar: '',
    skills: '',
    password: '',
    confirmPassword: '',
    avatarUrl: '',
    certifications: '',
    workProof: ''
  });

  const [certificationFile, setCertificationFile] = useState(null);
  const [workProofFile, setWorkProofFile] = useState(null);
  const [skillInput, setSkillInput] = useState('');

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    const userId = sessionStorage.getItem('userId');
    if (!userId) {
        navigate('/login');
        return;
    }
    try {
        const result = await getProviderDetailsAPI(userId);
        if(result.status === 200) {
            const data = result.data;
            setFormData({
                name: data.username || '',
                email: data.email || '',
                phone: data.phone || '',
                category: data.category || '',
                experience: data.experience || '',
                about: data.about || '',
                languages: data.languages || '',
                address: data.address || '',
                aadhar: data.aadhar || '',
                skills: data.skills || '',
                password: '',
                confirmPassword: '',
                avatarUrl: data.profileImage ? `${BASE_URL}/uploads/${data.profileImage}` : '',
                certifications: data.certifications || '',
                workProof: data.workProof || ''
            });
        }
    } catch(err) {
        toast.error("Failed to load profile data");
    } finally {
        setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, avatarUrl: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const userId = sessionStorage.getItem('userId');
    if (!userId) {
      toast.error('Session expired. Please login again.');
      navigate('/login');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address (e.g. name@example.com)');
      return;
    }

    // Validate phone — exactly 10 digits
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.phone)) {
      toast.error('Phone number must be exactly 10 digits (e.g. 9876543210)');
      return;
    }

    // Validate experience - must be positive
    if (Number(formData.experience) < 0) {
      toast.error('Experience cannot be negative');
      return;
    }

    setSaving(true);
    try {
      const data = new FormData();
      data.append('username', formData.name);
      data.append('email', formData.email);
      data.append('phone', formData.phone);
      data.append('category', formData.category);
      data.append('experience', formData.experience);
      data.append('about', formData.about);
      data.append('languages', formData.languages);
      data.append('address', formData.address);
      data.append('aadhar', formData.aadhar);
      data.append('skills', formData.skills);
      if (imageFile) {
        data.append('profileImage', imageFile);
      }
      if (certificationFile) {
        data.append('certifications', certificationFile);
      }
      if (workProofFile) {
        data.append('workProof', workProofFile);
      }

      // Check if password change is intended
      if (formData.password) {
        if (formData.password !== formData.confirmPassword) {
          toast.error("Passwords do not match!");
          setSaving(false);
          return;
        }
        data.append('password', formData.password);
      }

      const result = await updateProviderProfileAPI(userId, data);
      if (result.status === 200) {
        toast.success('Profile updated successfully!');
        sessionStorage.setItem('userName', result.data.username);
        navigate('/provider/profile');
      } else {
        toast.error(result.data || 'Failed to update profile.');
      }
    } catch (err) {
      toast.error('Something went wrong. Please try again.');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading profile...</div>;
  }

  return (
    <div className="bg-[#f8fafc] min-h-screen py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div className="flex items-center gap-6">
            <button 
                type="button"
                onClick={() => navigate('/provider/dashboard')}
                className="p-3 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all text-gray-500 hover:text-primary active:scale-95"
            >
                <FiArrowLeft size={24} />
            </button>
            <div>
                <h1 className="text-3xl font-bold text-gray-900 leading-none">Edit Profile</h1>
                <p className="mt-2 text-gray-500 font-medium text-sm">Update your professional identity and service details</p>
            </div>
          </div>
          <button 
            form="profile-form"
            type="submit"
            className="bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-2xl font-semibold text-xs uppercase tracking-widest transition-all shadow-xl shadow-primary/20 flex items-center gap-3 transform active:scale-95"
          >
            <FiSave size={20} /> Save Changes
          </button>
        </div>

        <form id="profile-form" onSubmit={handleSave} className="space-y-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Sidebar: Photo */}
            <div className="lg:col-span-1 space-y-10">
                <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 flex flex-col items-center">
                    <div className="flex items-center gap-2 mb-8 self-start">
                        <FiImage className="text-primary" />
                        <h3 className="text-[12px] font-bold text-gray-700 uppercase tracking-widest">Profile Photo</h3>
                    </div>

                    <div className="relative group mb-8">
                        <div className="w-48 h-48 rounded-[3rem] overflow-hidden border-8 border-gray-50 bg-gray-50 shadow-inner relative transition-transform duration-500 group-hover:scale-105">
                            {formData.avatarUrl ? (
                                <img src={formData.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-200">
                                    <FiUser size={80} />
                                </div>
                            )}
                        </div>
                        <button 
                            type="button"
                            onClick={() => fileInputRef.current.click()}
                            className="absolute -bottom-4 -right-4 bg-primary text-white p-5 rounded-[1.5rem] shadow-2xl shadow-primary/40 hover:scale-110 active:scale-95 transition-transform border-4 border-white"
                        >
                            <FiUpload size={24} />
                        </button>
                    </div>

                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        accept="image/jpeg, image/png, image/jpg"
                        className="hidden"
                    />

                    {/* <button 
                        type="button" 
                        onClick={() => fileInputRef.current.click()}
                        className="w-full bg-gray-50 text-gray-500 py-3 rounded-2xl font-semibold text-[12px] uppercase tracking-widest hover:bg-gray-100 hover:text-gray-900 transition-all"
                    >
                        Browse Gallery
                    </button> */}
                </div>
            </div>

            {/* Main Content: Info & Professional Details */}
            <div className="lg:col-span-2 space-y-10">
                {/* Identity Information */}
                <div className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100">
                    <div className="flex items-center gap-2 mb-10">
                        <FiUser className="text-primary" />
                        <h3 className="text-[13px] font-bold text-gray-700 uppercase tracking-widest">Identity Information</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label className="block text-[12px] font-semibold text-gray-500 uppercase tracking-widest mb-3 ml-1">Full Name</label>
                            <div className="relative">
                                <FiUser className="absolute left-5 top-1/2 -translate-y-1/2 text-primary" />
                                <input
                                    name="name"
                                    type="text"
                                    required
                                    className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-semibold"
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        
                        <div>
                            <label className="block text-[12px] font-semibold text-gray-500 uppercase tracking-widest mb-3 ml-1">Email Address</label>
                            <div className="relative">
                                <FiMail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    name="email"
                                    type="email"
                                    readOnly
                                    className="w-full pl-14 pr-20 py-4 bg-gray-100 border border-gray-200 rounded-2xl font-semibold text-gray-500 cursor-not-allowed"
                                    value={formData.email}
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Locked</span>
                            </div>
                            <p className="text-[11px] text-gray-400 mt-1.5 ml-1">Email address cannot be changed after registration.</p>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-[12px] font-semibold text-gray-500 uppercase tracking-widest mb-3 ml-1">Phone Number</label>
                            <div className="relative">
                                <FiPhone className="absolute left-5 top-1/2 -translate-y-1/2 text-primary" />
                                <input
                                    name="phone"
                                    type="tel"
                                    required
                                    maxLength={10}
                                    inputMode="numeric"
                                    pattern="[0-9]{10}"
                                    className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-semibold"
                                    value={formData.phone}
                                    onChange={(e) => {
                                        const val = e.target.value.replace(/\D/g, '');
                                        setFormData({ ...formData, phone: val });
                                    }}
                                    placeholder="10-digit mobile number"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Professional Details */}
                <div className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100">
                    <div className="flex items-center gap-2 mb-10">
                        <FiBriefcase className="text-primary" />
                        <h3 className="text-[13px] font-bold text-gray-700 uppercase tracking-widest">Professional details</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* <div>
                            <label className="block text-[12px] font-semibold text-gray-500 uppercase tracking-widest mb-3 ml-1">Service Category</label>
                            <div className="relative">
                                <FiBriefcase className="absolute left-5 top-1/2 -translate-y-1/2 text-primary" />
                                <select
                                    name="category"
                                    readOnly
                                    className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-semibold appearance-none"
                                    value={formData.category}
                                    onChange={handleChange}
                                >
                                    <option value="">Select Category</option>
                                    {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                </select>
                            </div>
                        </div> */}

                        <div>
                            <label className="block text-[12px] font-semibold text-gray-500 uppercase tracking-widest mb-3 ml-1">Experience (Years)</label>
                            <div className="relative">
                                <FiClock className="absolute left-5 top-1/2 -translate-y-1/2 text-primary" />
                                <input
                                    name="experience"
                                    type="number"
                                    required
                                    className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-semibold"
                                    value={formData.experience}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>



                        <div>
                            <label className="block text-[12px] font-semibold text-gray-500 uppercase tracking-widest mb-3 ml-1">Languages</label>
                            <div className="relative">
                                <FiGlobe className="absolute left-5 top-1/2 -translate-y-1/2 text-primary" />
                                <input
                                    name="languages"
                                    type="text"
                                    className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-semibold"
                                    value={formData.languages}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[12px] font-semibold text-gray-500 uppercase tracking-widest mb-3 ml-1">Full Address</label>
                            <div className="relative">
                                <FiMapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-primary" />
                                <input
                                    name="address"
                                    type="text"
                                    className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-semibold"
                                    value={formData.address}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[12px] font-semibold text-gray-500 uppercase tracking-widest mb-3 ml-1">Aadhar Number</label>
                            <div className="relative">
                                <FiLock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    name="aadhar"
                                    type="text"
                                    readOnly
                                    className="w-full pl-14 pr-20 py-4 bg-gray-100 border border-gray-200 rounded-2xl font-semibold text-gray-500 cursor-not-allowed"
                                    value={formData.aadhar || 'Not provided'}
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Locked</span>
                            </div>
                            <p className="text-[11px] text-gray-400 mt-1.5 ml-1">Aadhar number cannot be changed after registration.</p>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-[12px] font-semibold text-gray-500 uppercase tracking-widest mb-3 ml-1">Skills & Expertise</label>
                            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 transition-all focus-within:ring-2 focus-within:ring-primary/20">
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {formData.skills && formData.skills.split(',').filter(s => s.trim()).map((skill, index) => (
                                        <span key={index} className="bg-primary/10 text-primary px-3 py-1.5 rounded-xl text-sm font-bold flex items-center gap-2 animate-in fade-in zoom-in duration-300">
                                            {skill.trim()}
                                            <button 
                                                type="button" 
                                                onClick={() => {
                                                    const newSkills = formData.skills.split(',').filter((_, i) => i !== index).join(',');
                                                    setFormData({ ...formData, skills: newSkills });
                                                }}
                                                className="hover:text-red-500 transition-colors"
                                            >
                                                <FiX size={14} />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                                <div className="relative">
                                    <FiCheckCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" />
                                    <input
                                        type="text"
                                        placeholder="Add a skill (e.g. Pipe Repair) and press Enter"
                                        className="w-full pl-12 pr-12 py-3 bg-white border border-gray-100 rounded-xl focus:outline-none font-semibold text-sm"
                                        value={skillInput}
                                        onChange={(e) => setSkillInput(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                if (skillInput.trim()) {
                                                    const currentSkills = formData.skills ? formData.skills.split(',').map(s => s.trim()) : [];
                                                    if (!currentSkills.includes(skillInput.trim())) {
                                                        const newSkills = [...currentSkills, skillInput.trim()].join(',');
                                                        setFormData({ ...formData, skills: newSkills });
                                                    }
                                                    setSkillInput('');
                                                }
                                            }
                                        }}
                                    />
                                    <button 
                                        type="button"
                                        onClick={() => {
                                            if (skillInput.trim()) {
                                                const currentSkills = formData.skills ? formData.skills.split(',').map(s => s.trim()) : [];
                                                if (!currentSkills.includes(skillInput.trim())) {
                                                    const newSkills = [...currentSkills, skillInput.trim()].join(',');
                                                    setFormData({ ...formData, skills: newSkills });
                                                }
                                                setSkillInput('');
                                            }
                                        }}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 bg-primary text-white p-2 rounded-lg hover:bg-primary-dark transition-colors"
                                    >
                                        <FiPlus size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-[12px] font-semibold text-gray-500 uppercase tracking-widest mb-3 ml-1">Professional About / Tagline</label>
                            <div className="relative">
                                <FiInfo className="absolute left-5 top-5 text-primary" />
                                <textarea
                                    name="about"
                                    rows="4"
                                    required
                                    className="w-full pl-14 pr-10 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-semibold resize-none"
                                    placeholder="Tell potential customers about your expertise..."
                                    value={formData.about}
                                    onChange={handleChange}
                                ></textarea>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Documents & Verification */}
                <div className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100">
                    <div className="flex items-center gap-2 mb-10">
                        <FiFileText className="text-primary" />
                        <h3 className="text-[13px] font-bold text-gray-700 uppercase tracking-widest">Documents & Verification</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label className="block text-[12px] font-semibold text-gray-500 uppercase tracking-widest mb-3 ml-1">Certifications (PDF/Image)</label>
                            <div className="group relative bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-6 flex flex-col items-center justify-center hover:border-primary/50 transition-all cursor-pointer overflow-hidden">
                                <input 
                                    type="file" 
                                    className="absolute inset-0 opacity-0 cursor-pointer" 
                                    accept=".pdf,image/*"
                                    onChange={(e) => setCertificationFile(e.target.files[0])}
                                />
                                {certificationFile ? (
                                    <div className="flex items-center gap-3 text-primary font-bold">
                                        <FiCheckCircle size={24} />
                                        <span className="text-sm truncate max-w-[150px]">{certificationFile.name}</span>
                                    </div>
                                ) : (
                                    <>
                                        <FiUpload className="text-gray-300 mb-2 group-hover:text-primary transition-colors" size={32} />
                                        <p className="text-[11px] text-gray-500 font-bold uppercase tracking-widest">
                                            {formData.certifications ? 'Update Certification' : 'Upload Certification'}
                                        </p>
                                    </>
                                )}
                            </div>
                            {formData.certifications && !certificationFile && (
                                <p className="text-[10px] text-primary font-bold mt-2 flex items-center gap-1">
                                    <FiCheckCircle /> Current file: {formData.certifications.split('-').pop()}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-[12px] font-semibold text-gray-500 uppercase tracking-widest mb-3 ml-1">Work Proof (PDF/Image)</label>
                            <div className="group relative bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-6 flex flex-col items-center justify-center hover:border-primary/50 transition-all cursor-pointer overflow-hidden">
                                <input 
                                    type="file" 
                                    className="absolute inset-0 opacity-0 cursor-pointer" 
                                    accept=".pdf,image/*"
                                    onChange={(e) => setWorkProofFile(e.target.files[0])}
                                />
                                {workProofFile ? (
                                    <div className="flex items-center gap-3 text-primary font-bold">
                                        <FiCheckCircle size={24} />
                                        <span className="text-sm truncate max-w-[150px]">{workProofFile.name}</span>
                                    </div>
                                ) : (
                                    <>
                                        <FiUpload className="text-gray-300 mb-2 group-hover:text-primary transition-colors" size={32} />
                                        <p className="text-[11px] text-gray-500 font-bold uppercase tracking-widest">
                                            {formData.workProof ? 'Update Work Proof' : 'Upload Work Proof'}
                                        </p>
                                    </>
                                )}
                            </div>
                            {formData.workProof && !workProofFile && (
                                <p className="text-[10px] text-primary font-bold mt-2 flex items-center gap-1">
                                    <FiCheckCircle /> Current file: {formData.workProof.split('-').pop()}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Security Section */}
                <div className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100">
                    <div className="flex items-center gap-2 mb-10">
                        <FiLock className="text-primary" />
                        <h3 className="text-[13px] font-bold text-gray-700 uppercase tracking-widest">Security & Password</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label className="block text-[12px] font-semibold text-gray-500 uppercase tracking-widest mb-3 ml-1">New Password</label>
                            <div className="relative">
                                <FiLock className="absolute left-5 top-1/2 -translate-y-1/2 text-primary" />
                                <input
                                    name="password"
                                    type="password"
                                    className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-semibold"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[12px] font-semibold text-gray-500 uppercase tracking-widest mb-3 ml-1">Confirm New Password</label>
                            <div className="relative">
                                <FiLock className="absolute left-5 top-1/2 -translate-y-1/2 text-primary" />
                                <input
                                    name="confirmPassword"
                                    type="password"
                                    className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-semibold"
                                    placeholder="••••••••"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>
                    <p className="text-[11px] text-gray-400 mt-6 ml-1 flex items-center gap-2 italic">
                        <FiInfo /> Leave both fields blank if you don't want to change your password.
                    </p>
                </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
