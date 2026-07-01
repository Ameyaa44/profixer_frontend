import { FiPlus, FiTrash2, FiSave, FiAlertCircle, FiLoader, FiCheck, FiClock, FiCopy } from 'react-icons/fi';
import clsx from 'clsx';
import { toast } from 'react-toastify';
import { getProviderDetailsAPI, updateProviderProfileAPI } from '../../services/allAPI';
import { useState, useEffect } from 'react';

export default function ManageAvailability() {
  // Generate the next 7 days to show actual dates
  const generateDays = () => {
    const days = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const dayName = d.toLocaleDateString('en-US', { weekday: 'long' });
      const dateString = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      days.push({ key: dayName, label: `${dayName}, ${dateString}` });
    }
    return days;
  };

  const dynamicDays = generateDays();
  const daysOfWeekKeys = dynamicDays.map(d => d.key);
  
  // Generate time options from 6 AM to 10 PM in 30-minute intervals
  const timeOptions = [];
  for (let i = 6; i <= 22; i++) {
    timeOptions.push(`${i.toString().padStart(2, '0')}:00`);
    if (i !== 22) timeOptions.push(`${i.toString().padStart(2, '0')}:30`);
  }

  const defaultHours = { start: '08:00', end: '18:00' };

  const [availability, setAvailability] = useState({
    Monday: { isWorkingDay: true, ...defaultHours },
    Tuesday: { isWorkingDay: true, ...defaultHours },
    Wednesday: { isWorkingDay: true, ...defaultHours },
    Thursday: { isWorkingDay: true, ...defaultHours },
    Friday: { isWorkingDay: true, ...defaultHours },
    Saturday: { isWorkingDay: false, ...defaultHours },
    Sunday: { isWorkingDay: false, ...defaultHours },
  });

  const [activeDay, setActiveDay] = useState(dynamicDays[0].key);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchAvailability();
  }, []);

  const fetchAvailability = async () => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (!user || !user._id) return;

    setLoading(true);
    try {
      const result = await getProviderDetailsAPI(user._id);
      if (result.status === 200 && result.data.availability) {
        const backendData = result.data.availability;
        const uiData = {};
        daysOfWeekKeys.forEach(day => {
          const slots = backendData[day]?.slots || [];
          uiData[day] = {
            isWorkingDay: backendData[day]?.isWorkingDay ?? false,
            start: slots.length > 0 ? slots[0].start : defaultHours.start,
            end: slots.length > 0 ? slots[0].end : defaultHours.end,
          };
        });
        setAvailability(uiData);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load availability');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleWorkDay = (day) => {
    setAvailability(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        isWorkingDay: !prev[day].isWorkingDay
      }
    }));
  };

  const handleTimeChange = (day, field, value) => {
    setAvailability(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value
      }
    }));
  };

  const copyToAll = () => {
    const currentDayConfig = availability[activeDay];
    setAvailability(prev => {
      const next = { ...prev };
      daysOfWeekKeys.forEach(day => {
        if (day !== activeDay) {
          next[day] = { ...currentDayConfig };
        }
      });
      return next;
    });
    toast.success(`Copied ${activeDay} availability to all days`);
  };

  const handleSave = async () => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (!user || !user._id) {
      toast.error('Session expired. Please log in again.');
      return;
    }

    // Validate that end time is after start time
    for (const day of daysOfWeekKeys) {
      if (availability[day].isWorkingDay) {
        const start = parseInt(availability[day].start.replace(':', ''));
        const end = parseInt(availability[day].end.replace(':', ''));
        if (start >= end) {
          toast.error(`Invalid time range on ${day}. End time must be after start time.`);
          setActiveDay(day);
          return;
        }
      }
    }

    setSaving(true);
    try {
      const backendData = {};
      daysOfWeekKeys.forEach(day => {
        backendData[day] = {
          isWorkingDay: availability[day].isWorkingDay,
          slots: availability[day].isWorkingDay ? [{ start: availability[day].start, end: availability[day].end }] : []
        };
      });

      const formData = new FormData();
      formData.append('availability', JSON.stringify(backendData));
      
      const result = await updateProviderProfileAPI(user._id, formData);

      if (result.status === 200) {
        toast.success('Availability updated successfully!');
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        toast.error(`Save failed: ${result?.response?.data || result?.message || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Save error:', err);
      toast.error('Failed to save availability');
    } finally {
      setSaving(false);
    }
  };

  const formatTime = (time) => {
    const [h, m] = time.split(':');
    const hour = parseInt(h);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${m} ${ampm}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <FiLoader className="text-4xl text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Availability</h1>
          <p className="text-gray-500">Set your daily working hours for bookings.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={copyToAll}
            className="flex items-center gap-2 bg-white border border-gray-200 text-gray-600 px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-gray-50 transition-all shadow-sm"
          >
            <FiCopy /> Copy to All Days
          </button>
          <button 
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all shadow-xl shadow-primary/20 disabled:opacity-70"
          >
            {saving ? <FiLoader className="animate-spin" /> : <FiSave />} Save Changes
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Days Sidebar */}
        <div className="lg:col-span-3 space-y-2">
          {dynamicDays.map(({ key: dayKey, label: dayLabel }) => (
            <button
              key={dayKey}
              onClick={() => setActiveDay(dayKey)}
              className={clsx(
                "w-full text-left px-5 py-4 rounded-2xl flex items-center justify-between transition-all group",
                activeDay === dayKey 
                  ? "bg-white shadow-md border-2 border-primary/20" 
                  : "bg-transparent hover:bg-gray-100 border-2 border-transparent"
              )}
            >
              <span className={clsx("font-bold text-sm tracking-wider", activeDay === dayKey ? "text-primary" : "text-gray-500")}>
                {dayLabel}
              </span>
              <div className={clsx(
                "h-2 w-2 rounded-full",
                availability[dayKey].isWorkingDay ? "bg-green-500" : "bg-gray-300"
              )}></div>
            </button>
          ))}
        </div>

        {/* Configuration Area */}
        <div className="lg:col-span-9">
          <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8 min-h-[500px]">
            <div className="flex justify-between items-center mb-8 pb-6 border-b border-gray-100">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{activeDay}</h2>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
                  Working Hours
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <span className={clsx("text-xs font-bold uppercase tracking-widest", availability[activeDay].isWorkingDay ? "text-green-500" : "text-gray-400")}>
                  {availability[activeDay].isWorkingDay ? 'Accepting Bookings' : 'Day Off'}
                </span>
                <button 
                  onClick={() => handleToggleWorkDay(activeDay)}
                  className={clsx(
                    "w-14 h-8 rounded-full relative transition-all duration-300",
                    availability[activeDay].isWorkingDay ? "bg-green-500" : "bg-gray-200"
                  )}
                >
                  <div className={clsx(
                    "absolute top-1 bg-white w-6 h-6 rounded-full shadow-md transition-all duration-300",
                    availability[activeDay].isWorkingDay ? "left-7" : "left-1"
                  )}></div>
                </button>
              </div>
            </div>

            {availability[activeDay].isWorkingDay ? (
              <div className="animate-in fade-in duration-500">
                <div className="flex flex-col sm:flex-row gap-6 items-center bg-gray-50 p-8 rounded-2xl border border-gray-100">
                  <div className="w-full flex-1">
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Start Time</label>
                    <div className="relative">
                      <FiClock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <select 
                        value={availability[activeDay].start}
                        onChange={(e) => handleTimeChange(activeDay, 'start', e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-xl font-bold text-gray-800 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 appearance-none"
                      >
                        {timeOptions.map(time => (
                          <option key={`start-${time}`} value={time}>{formatTime(time)}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="hidden sm:block text-gray-300 font-bold mt-6">-</div>
                  
                  <div className="w-full flex-1">
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">End Time</label>
                    <div className="relative">
                      <FiClock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <select 
                        value={availability[activeDay].end}
                        onChange={(e) => handleTimeChange(activeDay, 'end', e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-xl font-bold text-gray-800 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 appearance-none"
                      >
                        {timeOptions.map(time => (
                          <option key={`end-${time}`} value={time}>{formatTime(time)}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                
                <div className="mt-10 p-6 bg-blue-50 rounded-2xl border border-blue-100 flex items-start gap-4">
                  <FiAlertCircle className="text-blue-500 mt-1 flex-shrink-0" size={20} />
                  <div>
                    <h4 className="text-blue-900 font-bold text-sm mb-1 uppercase tracking-wider">How scheduling works</h4>
                    <p className="text-blue-700 text-sm font-medium leading-relaxed">
                      You are defining your overall working window (e.g., 8:00 AM to 6:00 PM). The system will automatically generate available booking slots within this window based on the duration of the services you offer. It ensures that a job's <b>start time + duration + 1-hour break</b> never exceeds your specified end time.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="bg-gray-50 p-8 rounded-full mb-6">
                  <FiAlertCircle className="text-gray-200 text-6xl" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">You're taking {activeDay} off</h3>
                <p className="text-gray-500 font-medium max-w-sm">
                  Switch the toggle above to "Accepting Bookings" if you want to define working hours for this day.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
