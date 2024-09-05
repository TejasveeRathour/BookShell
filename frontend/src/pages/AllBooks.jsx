import React, { useEffect, useState } from "react";
import Loader from "../components/Loader/Loader";
import BookCard from "../components/BookCard/BookCard";
import axios from "axios";

const AllBooks = () => {
  const [Data, setData] = useState([]); // Initialize as an empty array
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/v1/get-all-books"
        );
        setData(response.data.data);
        setLoading(false); // Stop loading when data is fetched
      } catch (error) {
        setError("Failed to fetch books");
        setLoading(false); // Stop loading in case of error
      }
    };

    fetchBooks();
  }, []);

  return (
    <div className="bg-zinc-900 h-auto px-12 py-8">
      <h4 className="text-3xl text-yellow-100">All Books</h4>

      {/* Show loading spinner */}
      {loading && (
        <div className="w-full h-screen flex items-center justify-center">
          <Loader />
        </div>
      )}

      {/* Show error message if fetching fails */}
      {error && <div className="text-red-500 text-center my-8">{error}</div>}

      {/* Render book cards once Data is loaded */}
      <div className="my-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {Data.map((item, i) => (
          <BookCard key={i} data={item} />
        ))}
      </div>
    </div>
  );
};

export default AllBooks;
