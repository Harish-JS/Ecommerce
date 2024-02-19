import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <>
      <h1 className="heading">Home</h1>
      <div className="home_btns">
        <Link className="btn" to="/categories/page=1">
          Categories
        </Link>
        <Link className="btn" to="/products/page=1">
          Products
        </Link>
      </div>
    </>
  );
};

export default Home;
