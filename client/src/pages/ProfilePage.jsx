import { useState, useEffect } from 'react';
import API from '../api/api';
import { useAuth } from '../context/AuthContext';
import EventCard from '../components/EventCard';

const ProfilePage = () => {
  const { user } = useAuth();
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [pastBookings, setPastBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAndCategorizeBookings = async () => {
      try {
        setLoading(true);
        const { data } = await API.get('/bookings/mybookings');
        
        console.log("api response:", data);

        const bookingsArray = Array.isArray(data) ? data : (data && Array.isArray(data.bookings)) ? data.bookings : null;

        if (bookingsArray) {
          const now = new Date();
          const upcoming = [];
          const past = [];

          bookingsArray.forEach(booking => {
            if (booking.event && new Date(booking.event.date) >= now) {
              upcoming.push(booking);
            } else {
              past.push(booking);
            }
          });

          setUpcomingBookings(upcoming);
          setPastBookings(past);
        } else {
          setError('Received an invalid format for your bookings.');
        }
      } catch (err) {
        if (err.response?.status === 404) {
          setUpcomingBookings([]);
          setPastBookings([]);
        } else {
          setError('Failed to fetch your bookings.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAndCategorizeBookings();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><span className="loading loading-lg loading-spinner text-primary"></span></div>;
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="text-center md:text-left">
        <h1 className="text-4xl font-bold">My Profile</h1>
        <p className="text-lg mt-2 text-base-content/70">Welcome back, {user?.firstName}!</p>
      </div>

      {error && <div className="alert alert-error mt-8">{error}</div>}

      {/* Upcoming Bookings Section */}
      <div className="mt-12">
        <h2 className="text-3xl font-bold mb-6">Upcoming Bookings</h2>
        {upcomingBookings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {upcomingBookings.map(booking => (
              booking.event && <EventCard key={booking._id} event={booking.event} />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-base-200 rounded-lg">
            <p>You have no upcoming events. <a href="/" className="link link-primary">Explore events now!</a></p>
          </div>
        )}
      </div>

      {/* Past Bookings Section */}
      <div className="mt-12">
        <h2 className="text-3xl font-bold mb-6">Past Bookings</h2>
        {pastBookings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pastBookings.map(booking => (
              booking.event && <EventCard key={booking._id} event={booking.event} />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-base-200 rounded-lg">
            <p>You have no past event bookings.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;