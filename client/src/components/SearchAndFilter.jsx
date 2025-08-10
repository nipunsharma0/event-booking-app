import { useState } from 'react';
import { IconSearch } from '@tabler/icons-react';

const SearchAndFilter = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    keyword: '',
    category: '',
    city: '',
    minPrice: '',
    maxPrice: '',
    startDate: '',
    endDate: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    onFilterChange(filters);
  };

  return (
    <div className="bg-base-100 p-6 rounded-lg shadow-md">
      <form onSubmit={handleSearch} className="flex flex-col gap-4">
        {/* Search */}
        <div className="form-control">
          <label className="label"><span className="label-text font-semibold">Search by Name</span></label>
          <div className="join">
            <input
              type="text"
              name="keyword"
              placeholder="Search events..."
              className="input input-bordered join-item w-full"
              value={filters.keyword}
              onChange={handleInputChange}
            />
            <button type="submit" className="btn btn-primary join-item"><IconSearch size={20} /></button>
          </div>
        </div>

        <div className="divider"></div>

        <div className="form-control">
          <label className="label"><span className="label-text font-semibold">Category</span></label>
          <select name="category" value={filters.category} onChange={handleInputChange} className="select select-bordered">
            <option value="">All</option>
            <option>Music</option>
            <option>Sports</option>
            <option>Technology</option>
            <option>Arts</option>
            <option>Food & Drink</option>
            <option>Other</option>
          </select>
        </div>
        
        <div className="form-control">
          <label className="label"><span className="label-text font-semibold">City</span></label>
          <input type="text" name="city" placeholder="e.g., Pune" className="input input-bordered" value={filters.city} onChange={handleInputChange} />
        </div>

        <div className="form-control">
          <label className="label"><span className="label-text font-semibold">Price Range (₹)</span></label>
          <div className="flex gap-2">
            <input type="number" name="minPrice" placeholder="Min" className="input input-bordered w-1/2" value={filters.minPrice} onChange={handleInputChange} />
            <input type="number" name="maxPrice" placeholder="Max" className="input input-bordered w-1/2" value={filters.maxPrice} onChange={handleInputChange} />
          </div>
        </div>

        <div className="form-control">
          <label className="label"><span className="label-text font-semibold">Date Range</span></label>
          <div className="flex flex-col gap-2">
            <input type="date" name="startDate" className="input input-bordered" value={filters.startDate} onChange={handleInputChange} />
            <input type="date" name="endDate" className="input input-bordered" value={filters.endDate} onChange={handleInputChange} />
          </div>
        </div>

        <button type="submit" className="btn btn-secondary w-full mt-4">Apply Filters</button>
      </form>
    </div>
  );
};

export default SearchAndFilter;