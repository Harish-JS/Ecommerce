import React from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <>
      <h1 style={{ fontSize: 40 }}>404</h1>
      <h1>Page Not found</h1>
      <button className="btn" onClick={() => navigate(-1)}>
        Back
      </button>
    </>
  );
};

export default NotFound;
