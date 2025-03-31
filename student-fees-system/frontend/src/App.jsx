import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store/store';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Layout Components
import MainLayout from './components/layout/MainLayout';

// Pages
import LoginPage from './components/auth/LoginPage';
import AdminDashboard from './components/dashboard/AdminDashboard';
import StudentDashboard from './components/dashboard/StudentDashboard';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router>
          <ToastContainer position="top-right" autoClose={5000} />
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <MainLayout>
                  <AdminDashboard />
                </MainLayout>
              </ProtectedRoute>
            } />

            {/* Student Routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <MainLayout>
                  <StudentDashboard />
                </MainLayout>
              </ProtectedRoute>
            } />
          </Routes>
        </Router>
      </PersistGate>
    </Provider>
  );
}

export default App;