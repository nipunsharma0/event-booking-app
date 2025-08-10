import { useState, useEffect } from 'react';
import API from '../../api/api';
import { useNotification } from '../../context/NotificationContext';
import EventForm from './EventForm';
import EventCard from '../EventCard';
import Pagination from '../Pagination'; 

const EventManagement = () => {
  const [data, setData] = useState({ events: [], page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eventToEdit, setEventToEdit] = useState(null);
  const [pageNumber, setPageNumber] = useState(1); 
  const { addNotification } = useNotification();

  useEffect(() => {
    fetchEvents();
  }, [pageNumber]); 

  const fetchEvents = async () => {
    try {
      if (!loading) setLoading(true);
      const { data } = await API.get(`/events?pageNumber=${pageNumber}`);
      
      if (data && Array.isArray(data.events)) {
        setData(data);
      } else {
        setData({ events: [], page: 1, pages: 1 });
      }
    } catch (error) {
      addNotification('Failed to fetch events', 'error');
    } finally {
      setLoading(false);
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
    if (pageNumber !== 1) {
      setPageNumber(1);
    } else {
      fetchEvents();
    }
  };

  const handleDelete = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await API.delete(`/events/${eventId}`);
        addNotification('Event deleted successfully', 'success');
        fetchEvents();
      } catch (error) {
        addNotification('Failed to delete event', 'error');
      }
    }
  };

  if (loading && data.events.length === 0) {
    return <div className="flex justify-center items-center h-screen"><span className="loading loading-lg loading-spinner text-primary"></span></div>;
  }

  return (
    <div>
      <div className="flex justify-end mb-6">
        <button onClick={() => openModal()} className="btn btn-primary">Create New Event</button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {data.events.map((event) => (
          <EventCard 
            key={event._id} 
            event={event} 
            onEdit={openModal} 
            onDelete={handleDelete} 
          />
        ))}
      </div>

      <Pagination page={data.page} pages={data.pages} onPageChange={setPageNumber} />

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