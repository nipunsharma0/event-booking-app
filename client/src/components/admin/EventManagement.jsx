import { useState, useEffect } from 'react';
import API from '../../api/api';
import { useNotification } from '../../context/NotificationContext';
import EventForm from './EventForm';
import EventCard from '../EventCard';

const EventManagement = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eventToEdit, setEventToEdit] = useState(null);
  const { addNotification } = useNotification();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    if (loading) {
        try {
            const { data } = await API.get('/events');
            setEvents(data);
        } catch (error) {
            addNotification('Failed to fetch events', 'error');
        } finally {
            setLoading(false);
        }
    } else {
        const { data } = await API.get('/events');
        setEvents(data);
    }
  };

  const openModal = (event = null) => {
    setEventToEdit(event);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEventToEdit(null);
  };

  const handleFormSubmit = () => {
    closeModal();
    fetchEvents();
  };

  const handleDelete = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      let isDeleted = false;
      try {
        await API.delete(`/events/${eventId}`);
        isDeleted = true; 
      } catch (error) {
        addNotification('Failed to delete event', 'error');
      }

      if (isDeleted) {
        addNotification('Event deleted successfully', 'success');
        fetchEvents();
      }
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><span className="loading loading-lg loading-spinner text-primary"></span></div>;
  }

  return (
    <div>
      <div className="flex justify-end mb-6">
        <button onClick={() => openModal()} className="btn btn-primary">Create New Event</button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {events.map((event) => (
          <EventCard 
            key={event._id} 
            event={event} 
            onEdit={openModal} 
            onDelete={handleDelete} 
          />
        ))}
      </div>

      {isModalOpen && (
        <dialog id="event_modal" className="modal modal-open">
          <div className="modal-box w-11/12 max-w-3xl">
            <h3 className="font-bold text-lg mb-4">{eventToEdit ? 'Edit Event' : 'Create New Event'}</h3>
            <EventForm eventToEdit={eventToEdit} onFormSubmit={handleFormSubmit} />
            <div className="modal-action mt-4">
              <button onClick={closeModal} className="btn">Close</button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default EventManagement;
