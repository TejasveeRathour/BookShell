import axios from "axios";
import React from "react";
import { Link } from "react-router-dom";

const BookCard = ({ data, favourite }) => {
  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
    bookid: data._id,
  };

  const handleRemoveBook = async () => {
    const response = await axios.put(
      "http://localhost:3000/api/v1/remove-book-from-favourite",
      {},
      { headers }
    );
    alert(response.data.message);
  };

  return (
    <div className="bg-zinc-800 rounded p-4 flex flex-col">
      <Link to={`/view-book-details/${data._id}`}>
        <div className="bg-zinc-800 rounded p-4">
          <div className="bg-zinc-900 rounded flex items-center justify-center">
            <img src={data.url} alt={data.title} className="h-[25vh] object-contain" />
          </div>
          <div className="mt-4">
            <h2 className="text-xl text-zinc-200 font-semibold truncate">{data.title}</h2>
            <p className="mt-2 text-zinc-400 font-semibold truncate">by {data.author}</p>
            <p className="mt-2 text-zinc-200 font-semibold text-xl">₹ {data.price}</p>
          </div>
        </div>
      </Link>
      {favourite && (
        <div className="flex justify-center mt-4">
          <button
            className="bg-yellow-50 px-4 py-2 text-sm md:text-base rounded border border-yellow-500 
                       text-yellow-500 hover:bg-yellow-500 hover:text-white transition-all duration-300
                       w-full sm:w-auto text-center"
            onClick={handleRemoveBook}
          >
            Remove From Favourite
          </button>
        </div>
      )}
    </div>
  );
};

export default BookCard;
