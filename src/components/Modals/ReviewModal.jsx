import { useState, useEffect } from 'react';
import { FiX, FiStar, FiSend, FiLoader, FiTrash2 } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { submitReviewAPI, deleteReviewAPI } from '../../services/allAPI';

export default function ReviewModal({ booking, onClose, onSuccess }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [review, setReview] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (booking) {
      setRating(booking.rating || 0);
      setReview(booking.review || '');
    } else {
      setRating(0);
      setReview('');
    }
  }, [booking]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete your review and rating for this booking?")) return;
    setLoading(true);
    try {
      const result = await deleteReviewAPI(booking._id);
      if (result.status === 200) {
        toast.success('Review deleted successfully');
        onSuccess();
        onClose();
      } else {
        toast.error('Failed to delete review');
      }
    } catch (err) {
      console.error("Delete review error:", err);
      toast.error('Error deleting review');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    setLoading(true);
    try {
      const result = await submitReviewAPI(booking._id, { rating, review });
      console.log("Review Result:", result);
      
      if (result.status === 200) {
        toast.success(booking.rating ? 'Review updated successfully!' : 'Thank you for your review!');
        onSuccess();
        onClose();
      } else {
        // Axios error objects usually store the response in result.response
        const backendError = result.response?.data;
        const status = result.response?.status || result.status;
        
        if (backendError) {
          toast.error(typeof backendError === 'string' ? backendError : JSON.stringify(backendError));
        } else if (status === 401) {
          toast.error("Session expired. Please login again.");
        } else {
          toast.error(`Error (${status || 'Unknown'}): Please try again later.`);
        }
      }
    } catch (err) {
      console.error("Review UI Error:", err);
      toast.error('An unexpected error occurred in the browser.');
    } finally {
      setLoading(false);
    }
  };

  if (!booking) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-[2rem] w-full max-w-md overflow-hidden shadow-2xl transform transition-all animate-in fade-in zoom-in duration-300">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{booking.rating ? 'Edit Review' : 'Rate Service'}</h2>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mt-1">{booking.serviceId?.title}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors shadow-sm">
            <FiX size={20} className="text-gray-400" />
          </button>
        </div>

        <div className="p-8">
          <div className="text-center mb-8">
            <p className="text-gray-600 font-medium mb-4">How was your experience with <span className="text-primary font-bold">{booking.providerId?.username}</span>?</p>
            
            {/* Star Rating */}
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="transition-all duration-200 transform hover:scale-125 focus:outline-none"
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                  onClick={() => setRating(star)}
                >
                  <FiStar
                    size={40}
                    className={`${
                      star <= (hover || rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-200'
                    } transition-colors`}
                  />
                </button>
              ))}
            </div>
            <p className="text-sm font-bold text-yellow-500 mt-3 h-5">
              {rating === 1 && 'Poor'}
              {rating === 2 && 'Fair'}
              {rating === 3 && 'Good'}
              {rating === 4 && 'Very Good'}
              {rating === 5 && 'Excellent!'}
            </p>
          </div>

          <div className="mb-8">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 ml-1">Write a Review (Optional)</label>
            <textarea
              rows="4"
              className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium placeholder:text-gray-300 resize-none"
              placeholder="Tell us what you liked or what could be improved..."
              value={review}
              onChange={(e) => setReview(e.target.value)}
            ></textarea>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-4 bg-primary hover:bg-primary-dark text-white rounded-2xl font-bold text-sm uppercase tracking-widest transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2 transform active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
            >
              {loading ? <FiLoader className="animate-spin" /> : <FiSend />}
              {booking.rating ? 'UPDATE REVIEW' : 'SUBMIT REVIEW'}
            </button>

            {booking.rating > 0 && (
              <button
                onClick={handleDelete}
                disabled={loading}
                className="w-full py-4 border border-red-200 text-red-500 hover:bg-red-50 rounded-2xl font-bold text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2 transform active:scale-95 disabled:opacity-50"
              >
                {loading ? <FiLoader className="animate-spin" /> : <FiTrash2 size={16} />}
                DELETE REVIEW
              </button>
            )}
          </div>

          
        </div>
      </div>
    </div>
  );
}
