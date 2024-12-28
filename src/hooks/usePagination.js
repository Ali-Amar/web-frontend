import { useState } from 'react';

const usePagination = (data, itemsPerPage) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate total pages
  const totalPages = Math.ceil(data.length / itemsPerPage);

  // Get current page data
  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  };

  // Change page
  const goToPage = (page) => {
    setCurrentPage(page);
  };

  // Next page
  const nextPage = () => {
    setCurrentPage((prevPage) => (prevPage === totalPages ? prevPage : prevPage + 1));
  };

  // Previous page
  const prevPage = () => {
    setCurrentPage((prevPage) => (prevPage === 1 ? prevPage : prevPage - 1));
  };

  return {
    currentPage,
    totalPages,
    getCurrentPageData,
    goToPage,
    nextPage,
    prevPage,
  };
};

export default usePagination;