import React from "react";

const PaginationComponent = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const changePage = (page) => {
    if (page < 1 || page > totalPages) return;
    if (page === currentPage) return;
    onPageChange(page);
  };

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav className="d-flex justify-content-center mt-4">
      <ul className="pagination custom-pagination">

        {/* PREV */}
        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
          <button
            className="page-link"
            onClick={() => changePage(currentPage - 1)}
          >
            &laquo;
          </button>
        </li>

        {/* NUMBERS */}
        {pageNumbers.map((number) => (
          <li
            key={number}
            className={`page-item ${currentPage === number ? "active" : ""}`}
          >
            <button
              className="page-link"
              onClick={() => changePage(number)}
            >
              {number}
            </button>
          </li>
        ))}

        {/* NEXT */}
        <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
          <button
            className="page-link"
            onClick={() => changePage(currentPage + 1)}
          >
            &raquo;
          </button>
        </li>

      </ul>
    </nav>
  );
};

export default PaginationComponent;