import React, { useState } from 'react';

const usePagination = (items, customItemsPerPage) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = customItemsPerPage || 10; 
  const totalPages = Math.ceil(items.length / itemsPerPage);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);

  return {
    currentPage,
    totalPages,
    handlePageChange,
    currentItems,
    itemsPerPage,
  };
};

const Pagination = ({ currentPage, totalPages, handlePageChange }) => {
  const maxPagesToShow = 10;
  const pagination = [];

  if (totalPages <= maxPagesToShow) {
    // Show all pages if total pages are less than or equal to maxPagesToShow
    for (let i = 1; i <= totalPages; i++) {
      pagination.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`border border-gray-300 px-3 py-1 mx-1 rounded-md ${
            i === currentPage ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'
          }`}
        >
          {i}
        </button>
      );
    }
  } else {
    // Show limited pages with "..."
    const pagesToLeft = Math.floor(maxPagesToShow / 2);
    const pagesToRight = maxPagesToShow - pagesToLeft - 1;
    let startPage = currentPage - pagesToLeft;
    let endPage = currentPage + pagesToRight;

    if (startPage < 1) {
      // Adjust if startPage is less than 1
      startPage = 1;
      endPage = maxPagesToShow;
    } else if (endPage > totalPages) {
      // Adjust if endPage is greater than totalPages
      endPage = totalPages;
      startPage = totalPages - maxPagesToShow + 1;
    }

    if (startPage > 1) {
      // Add "..." if there are pages to the left
      pagination.push(
        <button key="left-ellipsis" className="border border-gray-300 px-3 py-1 mx-1 rounded-md bg-white text-blue-500">
          ...
        </button>
      );
    }

    for (let i = startPage; i <= endPage; i++) {
      pagination.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`border border-gray-300 px-3 py-1 mx-1 rounded-md ${
            i === currentPage ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'
          }`}
        >
          {i}
        </button>
      );
    }

    if (endPage < totalPages) {
      // Add "..." if there are pages to the right
      pagination.push(
        <button key="right-ellipsis" className="border border-gray-300 px-3 py-1 mx-1 rounded-md bg-white text-blue-500">
          ...
        </button>
      );
    }
  }

  return (
    <div className="text-center mt-4">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`border border-gray-300 px-3 py-1 mx-1 rounded-md bg-white text-blue-500 ${
          currentPage === 1 ? 'hidden' : ''
        }`}
      >
        Previous
      </button>

      {pagination}

      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`border border-gray-300 px-3 py-1 mx-1 rounded-md bg-white text-blue-500 ${
          currentPage === totalPages ? 'hidden' : ''
        }`}
      >
        Next
      </button>
    </div>
  );
};




export { usePagination, Pagination };
