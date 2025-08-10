import { useState, useEffect } from 'react';
import API from '../api/api';
import EventCard from '../components/EventCard';
import SearchAndFilter from '../components/SearchAndFilter';
import Pagination from '../components/Pagination';

const HomePage = () => {
  const [data, setData] = useState({ events: [], page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    keyword: '',
    category: '',
    city: '',
    minPrice: '',
    maxPrice: '',
    startDate: '',
    endDate: '',
    pageNumber: 1,
  });

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        Object.keys(filters).forEach(key => {
          if (filters[key]) {
            params.append(key, filters[key]);
          }
        });

        const { data } = await API.get(`/events?${params.toString()}`);
        setData(data);
      } catch (err) {
        setError('Failed to fetch events. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [filters]);

  const handleFilterChange = (newFilters) => {
    setFilters({ ...newFilters, pageNumber: 1 });
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, pageNumber: newPage }));
  };

  return (
    <div className="p-4 lg:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

        <aside className="lg:col-span-1">
          <SearchAndFilter onFilterChange={handleFilterChange} />
        </aside>

        <main className="lg:col-span-4">
          <div className="text-center my-8">
            <h1 className="text-5xl font-bold tracking-tight">Discover Your Next Experience</h1>
            <p className="mt-3 text-lg text-base-content/70">Browse through a curated list of events happening near you.</p>
          </div>
          {loading ? (
            <div className="flex justify-center items-center h-full min-h-[60vh]"><span className="loading loading-lg loading-spinner text-primary"></span></div>
          ) : error ? (
            <div className="alert alert-error">{error}</div>
          ) : data.events.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {data.events.map((event) => (
                  <EventCard key={event._id} event={event} />
                ))}
              </div>
              <Pagination page={data.page} pages={data.pages} onPageChange={handlePageChange} />
            </>
          ) : (
            <div className="text-center p-8 bg-base-200 rounded-lg min-h-[60vh] flex flex-col justify-center">
              <h2 className="text-2xl font-bold">No Events Found</h2>
              <p className="text-base-content/70 mt-2">Try adjusting your filters to find what you're looking for.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default HomePage;