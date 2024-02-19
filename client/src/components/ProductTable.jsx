import React from "react";

const ProductTable = ({ data }) => {
  return (
    <div className="table">
      <table>
        <thead>
          <tr>
            <th>Product Id</th>
            <th>Product Name</th>
            <th>Product Brand</th>
            <th>Category Id</th>
            <th>Category Name</th>
            <th>MRP</th>
            <th>Discounted Price</th>
            <th>Created On</th>
          </tr>
        </thead>
        <tbody>
          {data.map((product) => (
            <tr key={product.product_id || product.id}>
              <td>{product.product_id || product.id}</td>
              <td>{product.product_name}</td>
              <td>{product.product_brand}</td>
              <td>{product.category_id}</td>
              <td>{product.category_name}</td>
              <td>{product.mrp}</td>
              <td>{product.discounted_price}</td>
              <td>{product.created_date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
