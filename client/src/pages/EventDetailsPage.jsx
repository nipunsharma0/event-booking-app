import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import API from '../api/api';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

const EventDetailsPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { addNotification } = useNotification();
  const navigate = useNavigate();
  const location = useLocation();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [seats, setSeats] = useState(1);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const { data } = await API.get(`/events/${id}`);
        setEvent(data.event);
      } catch (err) {
        setError('Failed to fetch event details.');
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  const handleBooking = async (e) => {
    e.preventDefault();
    
    if (!user) {
      localStorage.setItem('redirectPath', location.pathname);
      navigate('/login');
      return;
    }

    try {
      const bookingData = { eventId: id, seatsBooked: Number(seats) };
      await API.post('/bookings', bookingData);
      addNotification(`Successfully booked ${seats} seat(s)!`, 'success');
      const { data } = await API.get(`/events/${id}`);
      setEvent(data.event);
    } catch (err) {
      addNotification(err.response?.data?.message || 'Booking failed.', 'error');
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen"><span className="loading loading-lg loading-spinner text-primary"></span></div>;
  if (error) return <div className="alert alert-error mt-4">{error}</div>;
  if (!event) return <div className="text-center mt-10">Event not found.</div>;

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="card lg:card-side bg-base-100 shadow-xl">
        <figure className="lg:w-1/2">
          <img src={event.image || 'https://placehold.co/600x400/a3e635/000000?text=Evently'} alt={event.name} className="w-full h-full object-cover" />
        </figure>
        <div className="card-body lg:w-1/2 flex flex-col">
          <div className="flex-grow">
            <h1 className="card-title text-4xl font-bold">{event.name}</h1>
            <p className="badge badge-secondary my-2">{event.category}</p>
            <p className="mt-4">{event.description}</p>
            <div className="divider"></div>
            <div className="space-y-2">
              <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              <p><strong>Venue:</strong> {event.venue.street}, {event.venue.city}, {event.venue.state}</p>
              <p><strong>Price:</strong> <span className="font-bold text-lg">₹{event.price}</span> per seat</p>
              <p><strong>Seats Available:</strong> {event.maxSeats - event.bookedSeats}</p>
            </div>
          </div>

          <div className="card-actions justify-end mt-6">
            <form onSubmit={handleBooking} className="w-full">
              <div className="form-control">
                <label className="label"><span className="label-text">Number of Seats</span></label>
                <input
                  type="number"
                  min="1"
                  max={event.maxSeats - event.bookedSeats}
                  value={seats}
                  onChange={(e) => setSeats(e.target.value)}
                  className="input input-bordered input-primary w-full"
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary w-full mt-4">
                {user ? 'Book Now' : 'Login to Book'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsPage;