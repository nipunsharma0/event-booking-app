import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import EventDetailsPage from './pages/EventDetailsPage';
import ProfilePage from './pages/ProfilePage';
import ProtectedRoute from './routes/ProtectedRoute';
import AdminDashboard from './pages/AdminDashboard';
import AdminRoute from './routes/AdminRoute';
import UserBookingsPage from './pages/UserBookingsPage';


function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/event/:id" element={<EventDetailsPage />} />

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path='/profile' element={<ProfilePage />}>
            </Route>
          </Route>

          {/* Admin routes */}
          <Route element={<AdminRoute />} >
              <Route path='/admin/*' element={<AdminDashboard /> } />
              <Route path='/admin/user/:userId' element={<UserBookingsPage />} />
          </Route>
        </Routes>
      </main>
    </>
  );
}

export default App;