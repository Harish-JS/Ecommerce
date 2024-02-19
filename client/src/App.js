import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Categories from "./pages/Categories";
import Products from "./pages/Products";
import NotFound from "./pages/NotFound";

const App = () => {
  const [isChecked, setChecked] = useState(() => {
    const checkbox = JSON.parse(localStorage.getItem("checkbox"));
    return checkbox || false;
  });

  const handleCheckboxChange = () => {
    setChecked(!isChecked);
    localStorage.setItem("checkbox", !isChecked);
  };

  return (
    <div className={`${isChecked ? "alpha_container" : "container"}`}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/categories/:page?" element={<Categories />} />
        <Route path="/products/:page?" element={<Products />} />
        <Route path="/products/:id?/:page?" element={<Products />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <input
        className="styler"
        type="checkbox"
        checked={isChecked}
        onChange={handleCheckboxChange}
      />
    </div>
  );
};

export default App;
