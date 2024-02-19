import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import CategoryTable from "../components/CategoryTable";
import NotFound from "../pages/NotFound";
import PaginationButton from "../components/PaginationButton";

const Categories = () => {
  const { page } = useParams();
  const PAGE = page?.includes("page") ? +page.match(/\d+/)[0] : 1;
  const [categories, setCategories] = useState([]);
  const [pageCount, setPageCount] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/category/fetchCategories/${PAGE}`
        );
        setCategories(response.data.data);
        setPageCount(Math.ceil(response.data.count / 8));
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategories();
  }, [PAGE]);
  if (PAGE > pageCount && pageCount) {
    return <NotFound />;
  }

  return (
    <>
      <div className="top_bar">
        <Link to="/" className="btn">
          Back
        </Link>
      </div>
      <div className="section">
        <CategoryTable data={categories} />
        <PaginationButton page={PAGE} pageCount={pageCount} />
      </div>
    </>
  );
};

export default Categories;
