import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiLoader } from 'react-icons/fi';

import {
  getAllProvidersAPI,
  updateProviderStatusAPI,
  getAllUsersAPI,
  getAllServicesAdminAPI,
  deleteUserAdminAPI,
  deleteProviderAdminAPI,
  getAllComplaintsAdminAPI,
} from '../../services/allAPI';

import AdminOverview from './AdminOverview';
import AdminProviders from './AdminProviders';
import AdminUsers from './AdminUsers';
import AdminServices from './AdminServices';
import AdminComplaints from './AdminComplaints';

export default function AdminDashboard() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const activeTab = searchParams.get('tab') || 'overview'; // overview | providers | users | services

  const [users, setUsers] = useState([]);
  const [providers, setProviders] = useState([]);
  const [services, setServices] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [providersResult, usersResult, servicesResult, complaintsResult] = await Promise.all([
        getAllProvidersAPI(),
        getAllUsersAPI(),
        getAllServicesAdminAPI(),
        getAllComplaintsAdminAPI(),
      ]);
      if (providersResult.status === 200) setProviders(providersResult.data);
      if (usersResult.status === 200) setUsers(usersResult.data);
      if (servicesResult.status === 200) setServices(servicesResult.data);
      if (complaintsResult.status === 200) setComplaints(complaintsResult.data.reverse());
    } catch (err) {
      console.error(err);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllProviders = async () => {
    const result = await getAllProvidersAPI();
    if (result.status === 200) setProviders(result.data);
  };

  const fetchAllUsers = async () => {
    const result = await getAllUsersAPI();
    if (result.status === 200) setUsers(result.data);
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user account permanently?')) return;
    try {
      const result = await deleteUserAdminAPI(id);
      if (result.status === 200) {
        toast.success('User account deleted successfully');
        fetchAllUsers();
      }
    } catch (err) {
      console.error(err);
      toast.error('Error deleting user account');
    }
  };

  const handleProviderAction = async (id, action) => {
    if (action === 'Remove') {
      if (!window.confirm("Are you sure you want to delete this professional's account permanently? They will no longer be able to log in.")) return;
      try {
        const result = await deleteProviderAdminAPI(id);
        if (result.status === 200) {
          toast.success('Professional account deleted successfully');
          fetchAllProviders();
        }
      } catch (err) {
        console.error(err);
        toast.error('Error deleting account');
      }
      return;
    }

    const newStatus = action === 'Approve' ? 'Approved' : action === 'Reject' ? 'Rejected' : '';
    try {
      const result = await updateProviderStatusAPI(id, { status: newStatus });
      if (result.status === 200) {
        toast.success(`Professional status updated: ${newStatus}`);
        fetchAllProviders();
      }
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <FiLoader className="text-4xl text-primary animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Loading administrative dashboard...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#f8fafc] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 mt-10">

        {activeTab === 'overview' && (
          <AdminOverview users={users} providers={providers} services={services} />
        )}

        {activeTab === 'providers' && (
          <AdminProviders
            providers={providers}
            onAction={handleProviderAction}
            onReview={(provider) => navigate(`/admin/provider/${provider._id}`)}
          />
        )}

        {activeTab === 'users' && (
          <AdminUsers users={users} />
        )}

        {activeTab === 'services' && (
          <AdminServices services={services} />
        )}

        {activeTab === 'complaints' && (
          <AdminComplaints complaints={complaints} />
        )}

      </div>

    </div>
  );
}
