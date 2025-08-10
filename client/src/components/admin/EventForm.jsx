import { useState, useEffect } from 'react';
import API from '../../api/api';
import { useNotification } from '../../context/NotificationContext';
import { IconCalendar, IconMapPin, IconCurrencyRupee, IconUsers } from '@tabler/icons-react';

const EventForm = ({ eventToEdit, onFormSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Music',
    date: '',
    venue: { street: '', city: '', state: '', zipCode: '' },
    price: 0,
    maxSeats: 1,
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const { addNotification } = useNotification();

  useEffect(() => {
    if (eventToEdit) {
      setFormData({
        ...eventToEdit,
        date: new Date(eventToEdit.date).toISOString().slice(0, 16),
      });
      if (eventToEdit.image) {
        setImagePreview(eventToEdit.image);
      }
    }
  }, [eventToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleVenueChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      venue: { ...prev.venue, [name]: value },
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const submissionData = new FormData();
    Object.keys(formData).forEach(key => {
      if (key === 'venue') {
        Object.keys(formData.venue).forEach(venueKey => {
          submissionData.append(`venue[${venueKey}]`, formData.venue[venueKey]);
        });
      } else {
        submissionData.append(key, formData[key]);
      }
    });

    if (image) {
      submissionData.append('image', image);
    }

    try {
      if (eventToEdit) {
        await API.put(`/events/${eventToEdit._id}`, submissionData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        addNotification('Event updated successfully!', 'success');
      } else {
        await API.post('/events', submissionData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        addNotification('Event created successfully!', 'success');
      }
      onFormSubmit();
    } catch (error) {
      const errorMsg = error.response?.data?.errors?.[0]?.message || 'An error occurred.';
      addNotification(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 p-4 max-h-[70vh] overflow-y-auto pr-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <input type="text" name="name" placeholder="Event Name" value={formData.name} onChange={handleChange} className="input input-bordered w-full text-lg" required />
          <textarea name="description" placeholder="Event Description" value={formData.description} onChange={handleChange} className="textarea textarea-bordered h-48 w-full" required></textarea>
        </div>
        <div className="space-y-2">
          <select name="category" value={formData.category} onChange={handleChange} className="select select-bordered w-full" required>
            <option disabled>Category</option>
            <option>Music</option>
            <option>Sports</option>
            <option>Technology</option>
            <option>Arts</option>
            <option>Food & Drink</option>
            <option>Other</option>
          </select>
          <div className="w-full h-48 bg-base-200 rounded-lg flex items-center justify-center border-2 border-dashed">
            {imagePreview ? (
              <img src={imagePreview} alt="Event preview" className="w-full h-full object-cover rounded-lg" />
            ) : (
              <p className="text-base-content/50">Image Preview</p>
            )}
          </div>
          <input type="file" name="image" onChange={handleImageChange} className="file-input file-input-bordered w-full" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="form-control">
          <label className="label flex items-center gap-2"><IconMapPin size={16} /><span>City</span></label>
          <input type="text" name="city" placeholder="e.g., Pune" value={formData.venue.city} onChange={handleVenueChange} className="input input-bordered" required />
        </div>
        <div className="form-control">
          <label className="label flex items-center gap-2"><IconCalendar size={16} /><span>Date & Time</span></label>
          <input type="datetime-local" name="date" value={formData.date} onChange={handleChange} className="input input-bordered" required />
        </div>
        <div className="form-control">
          <label className="label flex items-center gap-2"><IconCurrencyRupee size={16} /><span>Price (₹)</span></label>
          <input type="number" name="price" value={formData.price} onChange={handleChange} className="input input-bordered" required min="0" />
        </div>
        <div className="form-control">
          <label className="label flex items-center gap-2"><IconUsers size={16} /><span>Max Seats</span></label>
          <input type="number" name="maxSeats" value={formData.maxSeats} onChange={handleChange} className="input input-bordered" required min="1" />
        </div>
      </div>
      
      <div className="collapse bg-base-200">
        <input type="checkbox" /> 
        <div className="collapse-title font-medium">
          Full Venue Address (Street, State, Zip)
        </div>
        <div className="collapse-content">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <input type="text" name="street" placeholder="Street" value={formData.venue.street} onChange={handleVenueChange} className="input input-bordered" required />
            <input type="text" name="state" placeholder="State" value={formData.venue.state} onChange={handleVenueChange} className="input input-bordered" required />
            <input type="text" name="zipCode" placeholder="Zip Code" value={formData.venue.zipCode} onChange={handleVenueChange} className="input input-bordered" required />
          </div>
        </div>
      </div>

      <button type="submit" className="btn btn-primary w-full mt-6" disabled={loading}>
        {loading ? <span className="loading loading-spinner"></span> : (eventToEdit ? 'Update Event' : 'Create Event')}
      </button>
    </form>
  );
};

export default EventForm;