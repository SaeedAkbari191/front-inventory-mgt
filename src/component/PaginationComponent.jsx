import React from "react";

const PaginationComponent = ({ currentPage, totalPages, onPageChange }) => {

  if (totalPages === 0) return null;

  return (
    <div className="d-flex justify-content-center align-items-center gap-2 mt-4 flex-wrap">

      {/* PREV */}
      <button
        className="btn btn-sm btn-outline-secondary"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        « Prev
      </button>

      {/* CURRENT PAGE */}
      <span className="px-3 py-1 border rounded bg-light">
        Page {currentPage} of {totalPages}
      </span>

      {/* NEXT */}
      <button
        className="btn btn-sm btn-outline-secondary"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next »
      </button>

    </div>
  );
};

export default PaginationComponent;