import { useState, useEffect } from 'react';
import API from '../api/api';
import EventCard from '../components/EventCard';

const HomePage = () => {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAndCategorizeEvents = async () => {
      try {
        setLoading(true);
        const { data } = await API.get('/events');
        
        if (Array.isArray(data)) {
          const now = new Date();
          const upcoming = [];
          const past = [];

          data.forEach(event => {
            if (new Date(event.date) >= now) {
              upcoming.push(event);
            } else {
              past.push(event);
            }
          });

          setUpcomingEvents(upcoming);
          setPastEvents(past);
        } else {
          setError('Received an invalid format for events.');
        }
      } catch (err) {
        setError('Failed to fetch events. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAndCategorizeEvents();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><span className="loading loading-lg loading-spinner text-primary"></span></div>;
  }

  if (error) {
    return <div className="alert alert-error mt-4">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      
      {/* Upcoming Events Section */}
      <div className="my-8">
        <h1 className="text-4xl font-bold mb-6 text-center md:text-left">Upcoming Events</h1>
        {upcomingEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
            {upcomingEvents.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-base-200 rounded-lg">
            <p>No upcoming events found. Please check back later!</p>
          </div>
        )}
      </div>
      
      {/* Past Events Section */}
      <div className="my-12">
        <h2 className="text-3xl font-bold mb-6 text-center md:text-left">Past Events</h2>
        {pastEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
            {pastEvents.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-base-200 rounded-lg">
            <p>No past events to show.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;