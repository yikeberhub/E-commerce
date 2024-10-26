import React from "react";

function PageNotFound() {
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-blue-300 to-purple-300 text-white text-center">
      <div>
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <h2 className="text-3xl mb-2">Page Not Found</h2>
        <p className="mb-6">
          Oops! It looks like the page you're looking for doesn't exist.
        </p>
        <a
          href="/"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded shadow-lg transition duration-300"
        >
          Go Back to Home
        </a>
      </div>
    </div>
  );
}

export default PageNotFound;
