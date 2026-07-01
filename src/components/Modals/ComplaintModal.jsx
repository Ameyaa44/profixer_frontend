import { useState, useEffect } from 'react';
import { FiX, FiSend, FiLoader, FiAlertTriangle } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { createComplaintAPI } from '../../services/allAPI';

export default function ComplaintModal({ booking, onClose, onSuccess }) {
  const [complaintText, setComplaintText] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setComplaintText('');
  }, [booking]);

  const handleSubmit = async () => {
    if (!complaintText.trim()) {
      toast.error('Please enter details of your complaint');
      return;
    }

    setLoading(true);
    try {
      const result = await createComplaintAPI({
        bookingId: booking._id,
        complaintText: complaintText.trim()
      });

      if (result.status === 200) {
        toast.warning('Complaint registered successfully. Admin will review it shortly.');
        if (onSuccess) onSuccess();
        onClose();
      } else {
        const backendError = result.response?.data;
        const status = result.response?.status || result.status;
        toast.error(backendError || `Error (${status}): Failed to submit complaint.`);
      }
    } catch (err) {
      console.error("Complaint Submit Error:", err);
      toast.error('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  if (!booking) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-[2rem] w-full max-w-md overflow-hidden shadow-2xl transform transition-all animate-in fade-in zoom-in duration-300">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-red-50/50">
          <div className="flex items-center gap-2">
            <FiAlertTriangle className="text-red-500 text-xl" />
            <div>
              <h2 className="text-xl font-bold text-gray-900">File Complaint</h2>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mt-1">{booking.serviceId?.title}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors shadow-sm">
            <FiX size={20} className="text-gray-400" />
          </button>
        </div>

        <div className="p-8">
          <div className="mb-6">
            <p className="text-gray-600 text-sm font-medium mb-2">
              You are lodging a complaint about the provider: <span className="text-red-600 font-bold">{booking.providerId?.username}</span>
            </p>
            <p className="text-xs text-gray-400 bg-gray-50 p-3 rounded-xl border border-gray-100 italic">
              Please describe the issue clearly. Our administrators will review the case details and take appropriate action.
            </p>
          </div>

          <div className="mb-8">
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Complaint Details</label>
            <textarea
              rows="5"
              className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all font-medium placeholder:text-gray-300 resize-none text-sm text-gray-700"
              placeholder="Provide exact details of the incident, issue, or poor service..."
              value={complaintText}
              onChange={(e) => setComplaintText(e.target.value)}
            ></textarea>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-4 border-2 border-gray-200 text-gray-500 hover:bg-gray-50 rounded-2xl font-bold text-sm uppercase transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-2 py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-bold text-sm uppercase tracking-widest transition-all shadow-xl shadow-red-600/20 flex items-center justify-center gap-2 transform active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
            >
              {loading ? <FiLoader className="animate-spin" /> : <FiSend />}
              SUBMIT COMPLAINT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
