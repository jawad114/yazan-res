import React from "react";
import 'bootstrap/dist/css/bootstrap.css';
import { Link } from "react-router-dom";
const NotFound = () => {
  return (
    <div className="d-flex justify-content-center align-items-center not-found main">
      <div className="main-container d-flex align-items-center justify-content-between">
        <div>
          <h1 className="mb-4">404</h1>
          <p className="mb-5">
            Sorry we couldn't find the page you're looking for
          </p>
          <Link to="/" className="btn-global">
            back to homepage
          </Link>
        </div>
        <div className="img-container">
          <img

            style={{height:"20rem"}}
            src="https://user-images.githubusercontent.com/43953425/166269493-acd08ccb-4df3-4474-95c7-ad1034d3c070.svg"
            alt="Page not found"
          />
        </div>
      </div>
    </div>
  );
};

export default NotFound;
