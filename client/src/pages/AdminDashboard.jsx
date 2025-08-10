import { useState } from 'react';
import EventManagement from '../components/admin/EventManagement';
import BookingManagement from '../components/admin/BookingManagement'; 
import UserManagement from '../components/admin/UserManagement';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('events');

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

      <div role="tablist" className="tabs tabs-lifted">
        <a 
          role="tab" 
          className={`tab ${activeTab === 'events' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('events')}
        >
          Manage Events
        </a>
        <a 
          role="tab" 
          className={`tab ${activeTab === 'bookings' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('bookings')}
        >
          View All Bookings
        </a>
        <a 
          role="tab" 
          className={`tab ${activeTab === 'users' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          View All Users
        </a>
      </div>

      <div className="mt-8">
        {activeTab === 'events' && <EventManagement />}
        {activeTab === 'bookings' && <BookingManagement />} 
        {activeTab === 'users' && <UserManagement />}
      </div>
    </div>
  );
};

export default AdminDashboard;