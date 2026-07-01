import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  FiUser, FiMail, FiLock, FiStar, FiEdit2, FiCheck, FiX, FiLoader, 
  FiMessageSquare, FiShield, FiTrash2, FiPhone, FiMapPin, FiLogOut, FiActivity
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import { updateUserProfileAPI, getUserBookingsAPI, deleteReviewAPI } from '../../services/allAPI';
import { BASE_URL } from '../../services/baseUrl';

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [totalBookings, setTotalBookings] = useState(0);
  const navigate = useNavigate();
  
  // Form States
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    profileImage: null
  });
  const [preview, setPreview] = useState("");

  const [myReviews, setMyReviews] = useState([]);
  const [fetchingReviews, setFetchingReviews] = useState(false);

  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setFormData({
        username: parsedUser.username || '',
        email: parsedUser.email || '',
        password: '',
        confirmPassword: '',
        profileImage: null
      });
      if (parsedUser.profileImage) {
         setPreview(`${BASE_URL}/uploads/${parsedUser.profileImage}`);
      }
    }
    fetchBookingData();
  }, []);

  const fetchBookingData = async () => {
    setFetchingReviews(true);
    try {
      const result = await getUserBookingsAPI();
      if (result.status === 200) {
        setTotalBookings(result.data.length);
        const reviews = result.data.filter(b => b.rating > 0);
        setMyReviews(reviews.reverse());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setFetchingReviews(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (formData.password && formData.password !== formData.confirmPassword) {
      return toast.error("Passwords do not match!");
    }

    setLoading(true);
    try {
      const updateData = new FormData();
      updateData.append("username", formData.username);
      updateData.append("email", formData.email);
      if (formData.password) updateData.append("password", formData.password);
      if (formData.profileImage) updateData.append("profileImage", formData.profileImage);

      const result = await updateUserProfileAPI(user._id, updateData);
      if (result.status === 200) {
        toast.success("Profile updated!");
        const updatedUser = result.data;
        setUser(updatedUser);
        sessionStorage.setItem('user', JSON.stringify(updatedUser));
        sessionStorage.setItem('userName', updatedUser.username);
        setIsEditing(false);
        setFormData(prev => ({ ...prev, password: '', confirmPassword: '', profileImage: null }));
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = async (id) => {
    try {
      const result = await deleteReviewAPI(id);
      if (result.status >= 200 && result.status < 300) {
        toast.success("Review deleted successfully");
        fetchBookingData(); // Refresh list
      } else {
        const errorMsg = result.response?.data?.error || result.response?.data || "Failed to delete review";
        toast.error(errorMsg);
      }
    } catch (err) {
      console.error(err);
      toast.error("An unexpected error occurred");
    }
  };


  if (!user) return <div className="p-20 text-center"><FiLoader className="animate-spin inline-block mr-2" /> Loading...</div>;

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            {preview ? (
                <img src={preview} alt="Profile" className="w-20 h-20 rounded-2xl object-cover shadow-sm border border-gray-100" />
            ) : (
                <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center text-primary text-3xl font-bold">
                  {user.username?.charAt(0).toUpperCase()}
                </div>
            )}
            <div>
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">{user.username}</h1>
              <p className="text-gray-500 font-medium">{user.email}</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="bg-gray-50 px-6 py-3 rounded-2xl border border-gray-100 text-center">
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Bookings</p>
               <p className="text-xl font-bold text-gray-900">{totalBookings}</p>
            </div>
          </div>
        </div>

        {/* Profile Details Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
            <h2 className="text-lg font-bold flex items-center gap-2"><FiUser className="text-primary" /> Profile Information</h2>
            {!isEditing ? (
              <button onClick={() => setIsEditing(true)} className="bg-primary/10 text-primary hover:bg-primary hover:text-white px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-widest transition-all flex items-center gap-2">
                <FiEdit2 /> Edit Profile
              </button>
            ) : (
              <button onClick={() => setIsEditing(false)} className="bg-gray-100 text-gray-500 hover:bg-gray-200 px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-widest transition-all flex items-center gap-2">
                <FiX /> Cancel
              </button>
            )}
          </div>
          
          <div className="p-8">
            {!isEditing ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block flex items-center gap-1"><FiUser size={12}/> Username</label>
                  <p className="text-lg font-bold text-gray-900">{user.username}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block flex items-center gap-1"><FiMail size={12}/> Email Address</label>
                  <p className="text-lg font-bold text-gray-900">{user.email}</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="flex justify-center mb-6">
                  <label className="relative cursor-pointer group">
                    {/* {preview ? (
                      <img src={preview} alt="Profile" className="w-24 h-24 rounded-2xl object-cover shadow-sm group-hover:opacity-80 transition-opacity border-2 border-primary" />
                    ) : (
                      <div className="w-24 h-24 bg-primary/10 rounded-2xl flex items-center justify-center text-primary text-3xl font-bold group-hover:bg-primary/20 transition-colors border-2 border-dashed border-primary">
                        <FiUser size={40} />
                      </div>
                    )} */}
                    <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold">
                      Upload
                    </div>
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setFormData({...formData, profileImage: file});
                          setPreview(URL.createObjectURL(file));
                        }
                      }}
                    />
                  </label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Username</label>
                    <input 
                      type="text" 
                      className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-primary font-bold" 
                      value={formData.username}
                      onChange={e => setFormData({...formData, username: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Email</label>
                    <input 
                      type="email" 
                      className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-primary font-bold" 
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>
                <button type="submit" className="bg-primary hover:bg-primary-dark text-white px-10 py-4 rounded-2xl font-bold shadow-xl shadow-primary/20 transition-all flex items-center justify-center gap-2">
                  <FiCheck /> Save Changes
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Security Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gray-50/30">
            <h2 className="text-lg font-bold flex items-center gap-2"><FiShield className="text-primary" /> Security & Password</h2>
          </div>
          <div className="p-8">
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">New Password</label>
                  <div className="relative">
                    <FiLock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="password" 
                      className="w-full pl-12 pr-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-primary font-bold" 
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={e => setFormData({...formData, password: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Confirm New Password</label>
                  <div className="relative">
                    <FiLock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="password" 
                      className="w-full pl-12 pr-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-primary font-bold" 
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
                    />
                  </div>
                </div>
              </div>
              <button type="submit" disabled={!formData.password} className="bg-gray-900 hover:bg-black text-white px-10 py-4 rounded-2xl font-bold shadow-xl shadow-gray-900/10 transition-all disabled:opacity-50">
                Update Password
              </button>
            </form>
          </div>
        </div>

        {/* My Reviews Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gray-50/30">
            <h2 className="text-lg font-bold flex items-center gap-2"><FiMessageSquare className="text-primary" /> My Feedback & Reviews</h2>
          </div>
          <div className="p-8">
            {fetchingReviews ? <div className="text-center py-10"><FiLoader className="animate-spin inline-block text-primary" size={24} /></div> : myReviews.length === 0 ? (
              <div className="text-center py-10 text-gray-500 font-medium">
                You haven't shared any reviews yet. <Link to="/history" className="text-primary font-bold underline underline-offset-4">Browse History</Link>
              </div>
            ) : (
              <div className="space-y-6">
                {myReviews.map(r => (
                  <div key={r._id} className="bg-gray-50/50 p-6 rounded-2xl border border-gray-50 group relative">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="font-black text-gray-900 block">{r.serviceId?.title}</span>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">by {r.providerId?.username}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl shadow-sm border border-gray-50 text-yellow-500 font-black text-sm">
                           {r.rating} <FiStar className="fill-current" />
                        </span>
                        <button 
                          onClick={() => handleDeleteReview(r._id)}
                          className="text-gray-300 hover:text-red-500 transition-colors p-1"
                          title="Delete Review"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-600 font-medium italic text-sm leading-relaxed">"{r.review}"</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
