const Pagination = ({ page, pages, onPageChange }) => {
  if (pages <= 1) {
    return null; // Don't render pagination if there's only one page
  }

  return (
    <div className="join mt-12 flex justify-center">
      <button 
        className="join-item btn" 
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
      >
        «
      </button>
      <button className="join-item btn">Page {page} of {pages}</button>
      <button 
        className="join-item btn"
        onClick={() => onPageChange(page + 1)}
        disabled={page === pages}
      >
        »
      </button>
    </div>
  );
};

export default Pagination;