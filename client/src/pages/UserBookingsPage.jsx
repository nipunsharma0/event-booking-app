import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api/api';
import EventCard from '../components/EventCard';
import { useNotification } from '../context/NotificationContext'; 

const UserBookingsPage = () => {
  const { userId } = useParams();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userName, setUserName] = useState('');
  const { addNotification } = useNotification();

  useEffect(() => {
    const fetchUserBookings = async () => {
      try {
        setLoading(true);
        const { data } = await API.get(`/bookings/user/${userId}`);
        
        if (Array.isArray(data.bookings)) {
          setBookings(data.bookings);
          if (data.length > 0 && data[0].user) {
            setUserName(`${data[0].user.firstName} ${data[0].user.lastName}`);
          }
        } else {
          console.error("Unexpected API response for user bookings:", data);
          addNotification('Received an invalid format for bookings.', 'error');
          setBookings([]);
        }

      } catch (err) {
        if (err.response?.status === 404) {
          setBookings([]);
        } else {
          setError('Failed to fetch user bookings.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchUserBookings();
  }, [userId, addNotification]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><span className="loading loading-lg loading-spinner text-primary"></span></div>;
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Link to="/admin" className="btn btn-ghost mb-4">← Back to Dashboard</Link>
      <h1 className="text-3xl font-bold mb-6">Booking History for {userName || 'User'}</h1>
      
      {error && <div className="alert alert-error">{error}</div>}
      
      {!error && bookings.length === 0 ? (
        <p>This user has no bookings.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {bookings.map((booking) => (
            booking.event ? (
              <EventCard key={booking._id} event={booking.event} />
            ) : null
          ))}
        </div>
      )}
    </div>
  );
};

export default UserBookingsPage;
