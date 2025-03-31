import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { getDashboardStats } from '../../services/dashboardService';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { stats, isLoading } = useSelector(state => state.dashboard);

  useEffect(() => {
    const loadData = async () => {
      try {
        await dispatch(getDashboardStats());
      } catch (err) {
        toast.error('Failed to load dashboard data');
      }
    };
    loadData();
  }, [dispatch]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-lg font-semibold">Total Students</h3>
            <p className="text-2xl">{stats.totalStudents}</p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-lg font-semibold">Total Fees</h3>
            <p className="text-2xl">{stats.totalFees}</p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-lg font-semibold">Total Payments</h3>
            <p className="text-2xl">{stats.totalPayments}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;