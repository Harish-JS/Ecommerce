import React from "react";
import { useNavigate } from "react-router-dom";

const PaginationButton = ({ page, pageCount, id }) => {
  const navigate = useNavigate();
  const displayPages = 3;
  const generatePages = () => {
    const pages = [];
    if (pageCount <= displayPages) {
      for (let i = 1; i <= pageCount; i++) {
        pages.push(i);
      }
    } else {
      const startPage = Math.min(
        Math.max(1, page - Math.floor(displayPages / 2)),
        pageCount - displayPages + 1
      );
      const endPage = startPage + displayPages - 1;

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (startPage > 1) {
        pages.unshift(1, "...");
      }

      if (endPage < pageCount) {
        pages.push("...", pageCount);
      }
    }

    return pages;
  };

  const changePage = (page) => {
    if (id !== undefined) {
      navigate(`/products${id !== "" ? "/c_id=" + id : ""}/page=${page}`);
    } else {
      navigate(`/categories/page=${page}`);
    }
  };

  return (
    <div className="pagination_btns">
      <button
        className={`btn ${page === 1 ? "disabled" : ""}`}
        disabled={page === 1}
        onClick={() => changePage(page - 1)}
      >
        {"<< "}Prev
      </button>
      <div className="btns">
        {generatePages().map((pageNumber, index) => (
          <button
            key={index}
            className={`btn ${page === pageNumber ? "active" : ""}`}
            onClick={() => changePage(pageNumber !== "..." ? pageNumber : page)}
          >
            {pageNumber}
          </button>
        ))}
      </div>
      <button
        className={`btn ${page === pageCount ? "disabled" : ""}`}
        disabled={page === pageCount}
        onClick={() => changePage(page + 1)}
      >
        Next{" >>"}
      </button>
    </div>
  );
};

export default PaginationButton;
