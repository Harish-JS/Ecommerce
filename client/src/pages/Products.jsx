import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import NotFound from "./NotFound";
import ProductTable from "../components/ProductTable";
import axios from "axios";
import PaginationButton from "../components/PaginationButton";
import SearchButtons from "../components/SearchButtons";

const Products = () => {
  const { id, page } = useParams();
  const Id = id?.includes("id") ? +id.match(/\d+/)[0] : "";
  const PAGE = page?.includes("page") ? +page.match(/\d+/)[0] : 1;
  const [products, setProducts] = useState([]);
  const [pageCount, setPageCount] = useState(null);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [categoryNames, setCategoryNames] = useState([]);
  const [searchPage, setSeachPage] = useState(1);
  const [searchPageCount, setSearchPageCount] = useState(null);

  useEffect(() => {
    const fetchCategoryNames = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/category/fetchCategoryNames`
        );
        const data = response.data.data;
        setCategoryNames(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategoryNames();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/product/fetchProducts/${PAGE}/${
            Id !== "" ? Id : 0
          }`
        );
        setProducts([...response.data.data]);
        setPageCount(Math.ceil(response.data.count / 8));
      } catch (err) {
        console.error(err);
      }
    };
    fetchProducts();
  }, [PAGE, Id]);

  useEffect(() => {
    const searchProduct = async () => {
      const searchTerm1 = searchTerm.toLowerCase().trim();
      if (searchTerm1 !== "") {
        try {
          const response = await axios.post(
            `${process.env.REACT_APP_API_URL}/product/searchProducts`,
            { query: searchTerm1 },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          const data = response.data.data.response.docs;
          setSearchResult(data);
          setSearchPageCount(Math.ceil(data.length / 8));
          if (data) {
            const response = await axios.get(
              `${process.env.REACT_APP_API_URL}/product/fetchProducts/1/${data[0]?.category_id}`
            );
            const filteredProducts = data.map((product) => +product.id);
            const newProducts = response.data.data.filter(
              (product) => !filteredProducts.includes(product.product_id)
            );
            setSimilarProducts(newProducts);
          }
        } catch (e) {
          console.error(e);
        }
      }
    };
    searchProduct();
  }, [searchTerm]);

  const changeCategory = (categoryId) => {
    setSearchTerm("");
    navigate(
      `/products${categoryId !== "" ? "/c_id=" + categoryId : ""}/page=1`
    );
  };
  if (PAGE > pageCount && pageCount) {
    return <NotFound />;
  }

  return (
    <>
      <div className="top_bar">
        <Link to="/" className="btn">
          Back
        </Link>
        <div className="row">
          <select onChange={(e) => changeCategory(e.target.value)}>
            <option value="">Show All Products</option>
            {categoryNames.map((category) => (
              <option key={category.category_id} value={category.category_id}>
                {category.category_name}
              </option>
            ))}
          </select>
          <input
            value={searchTerm}
            type="text"
            placeholder="Search"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      {searchTerm ? (
        <>
          {searchResult.length > 0 ? (
            <>
              <ProductTable
                data={searchResult.slice(
                  (searchPage - 1) * 8,
                  searchPage * 8 || searchResult.length
                )}
              />
              <SearchButtons
                page={searchPage}
                setSeachPage={setSeachPage}
                pageCount={searchPageCount}
              />
            </>
          ) : (
            <h1>No Results Found</h1>
          )}
          {similarProducts.length > 0 && (
            <>
              <h1 style={{ margin: "2em 0 1em", fontSize: 21 }}>
                Similar Products
              </h1>
              <ProductTable data={similarProducts} />
            </>
          )}
        </>
      ) : (
        <div className="section">
          <ProductTable data={products} />
          <PaginationButton page={PAGE} id={Id} pageCount={pageCount} />
        </div>
      )}
    </>
  );
};

export default Products;
