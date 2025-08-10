import { Link } from 'react-router-dom';
import { IconEdit, IconTrash, IconCalendar, IconDotsVertical } from '@tabler/icons-react';

const EventCard = ({ event, onEdit, onDelete }) => {
  const formattedDate = new Date(event.date).toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  let imageUrl = `https://placehold.co/400x225/1d232a/a6adbb?text=${event.name}`;
  if (event.image) {
    const serverBaseUrl = import.meta.env.VITE_API_URL.replace('/api', '');
    const imagePath = event.image.replace(/\\/g, '/');
    imageUrl = `${serverBaseUrl}/${imagePath}`;
  }

  return (
    <div className="card relative w-full max-w-sm bg-base-100 shadow-lg rounded-lg overflow-hidden group transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:scale-105">
      <Link to={`/event/${event._id}`} className="block cursor-pointer">
        <figure>
          <img 
            src={imageUrl} 
            alt={event.name} 
            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
          />
        </figure>
        <div className="card-body p-5">
          <h2 className="card-title text-xl font-bold truncate">{event.name}</h2>
          <p className="badge badge-neutral mt-1">{event.category}</p>
          <p className="text-base-content/80 mt-2 flex items-center">
            <IconCalendar size={16} className="inline-block mr-2" /> {formattedDate}
          </p>
          <p className="text-lg font-bold text-accent mt-2">₹{event.price}</p>
        </div>
      </Link>
      
      {onEdit && onDelete && (
        <>
          <div className="absolute bottom-4 right-4 dropdown dropdown-top dropdown-end lg:hidden">
            <button tabIndex={0} role="button" className="btn btn-sm btn-square btn-ghost">
              <IconDotsVertical size={20} />
            </button>
            <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-32">
              <li><a onClick={(e) => { e.preventDefault(); onEdit(event); }}><IconEdit size={16} /> Edit</a></li>
              <li><a onClick={(e) => { e.preventDefault(); onDelete(event._id); }}><IconTrash size={16} /> Delete</a></li>
            </ul>
          </div>

          <div className="absolute top-3 right-3 hidden lg:flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
            <button 
              onClick={(e) => { e.preventDefault(); onEdit(event); }} 
              className="btn btn-sm btn-square btn-info shadow-lg"
            >
              <IconEdit size={20} />
            </button>
            <button 
              onClick={(e) => { e.preventDefault(); onDelete(event._id); }} 
              className="btn btn-sm btn-square btn-error shadow-lg"
            >
              <IconTrash size={20} />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default EventCard;
