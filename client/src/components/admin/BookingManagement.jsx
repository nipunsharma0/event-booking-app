import { useState, useEffect } from 'react';
import API from '../../api/api';
import { useNotification } from '../../context/NotificationContext';

const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addNotification } = useNotification();

  useEffect(() => {
    const fetchAllBookings = async () => {
      try {
        setLoading(true);
        const { data } = await API.get('/bookings');
        
        const bookingsArray = Array.isArray(data) ? data : data.bookings;

        if (Array.isArray(bookingsArray)) {
          setBookings(bookingsArray);
        } else {
          console.error("Unexpected API response for all bookings:", data);
          addNotification('Received an invalid format for bookings.', 'error');
          setBookings([]);
        }

      } catch (error) {
        addNotification('Failed to fetch bookings', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchAllBookings();
  }, []);

  if (loading) {
    return <span className="loading loading-lg loading-spinner text-primary"></span>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="table w-full">
        <thead>
          <tr>
            <th>User</th>
            <th>Email</th>
            <th>Event Name</th>
            <th>Seats</th>
            <th>Total Price</th>
            <th>Booking Date</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking._id}>
              <td>{booking.user?.firstName || 'N/A'} {booking.user?.lastName}</td>
              <td>{booking.user?.email || 'N/A'}</td>
              <td>{booking.event?.name || 'Deleted Event'}</td>
              <td>{booking.seatsBooked}</td>
              <td>₹{booking.totalPrice}</td>
              <td>{new Date(booking.createdAt).toLocaleDateString('en-GB')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookingManagement;