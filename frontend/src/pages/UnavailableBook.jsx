import React from "react";

const UnavailableBook = () => {
  return (
    <div className="bg-zinc-900 min-h-screen flex items-center justify-center p-4">
      <div className="bg-zinc-800 p-6 rounded-lg shadow-lg max-w-md mx-auto text-center">
        <h1 className="text-3xl md:text-5xl font-semibold text-red-500 mb-4">
          Book Unavailable
        </h1>
        <p className="text-lg md:text-xl text-zinc-300 mb-4">
          We're sorry, but the book you're looking for is currently unavailable.
        </p>
        <img
          src="/unavailable.png" // Replace with the path to your "unavailable" image
          alt="Unavailable"
          className="w-full h-auto mb-4 object-contain"
        />
        <a
          href="/"
          className="bg-zinc-100 text-zinc-800 rounded px-4 py-2 font-semibold hover:bg-zinc-200 transition-colors"
        >
          Go Back to Home
        </a>
      </div>
    </div>
  );
};

export default UnavailableBook;
