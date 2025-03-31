import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { getStudentDashboardData } from '../../services/studentService';

const StudentDashboard = () => {
  const dispatch = useDispatch();
  const { studentData, isLoading } = useSelector(state => state.student);
  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    const loadData = async () => {
      try {
        await dispatch(getStudentDashboardData(user.id));
      } catch (err) {
        toast.error('Failed to load student data');
      }
    };
    loadData();
  }, [dispatch, user.id]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Student Dashboard</h2>
      {isLoading ? (
        <p>Loading your data...</p>
      ) : (
        <div className="space-y-6">
          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-lg font-semibold mb-2">Your Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">Student ID</p>
                <p>{studentData.studentId}</p>
              </div>
              <div>
                <p className="text-gray-600">Course</p>
                <p>{studentData.course}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-lg font-semibold mb-2">Fee Summary</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-gray-600">Total Fees</p>
                <p className="text-xl">${studentData.totalFees}</p>
              </div>
              <div>
                <p className="text-gray-600">Paid</p>
                <p className="text-xl text-green-600">${studentData.paidAmount}</p>
              </div>
              <div>
                <p className="text-gray-600">Balance</p>
                <p className="text-xl text-red-600">${studentData.dueAmount}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;