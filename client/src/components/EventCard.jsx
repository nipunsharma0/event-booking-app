import { Link } from 'react-router-dom';

const EventCard = ({ event }) => {
  // formatting date for better readability
  const eventDate = new Date(event.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="card card-compact w-full bg-base-100 shadow-xl transition-transform duration-300 hover:scale-105">
      <figure>
        {/* will add image source later */}
        <img 
          src={event.image || 'https://placehold.co/400x225/a3e635/000000?text=Evently'} 
          alt={event.name} 
          className="h-56 w-full object-cover"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{event.name}</h2>
        <p className="text-base-content/70">{event.venue.city}, {event.venue.state}</p>
        <p className="font-semibold">{eventDate}</p>
        <div className="card-actions justify-end items-center">
          <span className="text-lg font-bold text-primary">₹{event.price}</span>
          <Link to={`/event/${event._id}`} className="btn btn-secondary">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventCard;