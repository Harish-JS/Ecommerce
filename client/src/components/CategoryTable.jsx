import React from "react";
import { Link } from "react-router-dom";

const CategoryTable = ({ data }) => {
  return (
    <div className="table">
      <table>
        <thead>
          <tr>
            <th>Category Id</th>
            <th>Category Name</th>
            <th>Stock</th>
            <th>Created On</th>
          </tr>
        </thead>
        <tbody>
          {data.map((category) => (
            <tr key={category.category_id}>
              <td>{category.category_id}</td>
              <td>
                <Link to={`/products/c_id=${category.category_id}/page=1`}>
                  {category.category_name}
                </Link>
              </td>
              <td>{category.category_stock}</td>
              <td>{category.created_date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CategoryTable;
