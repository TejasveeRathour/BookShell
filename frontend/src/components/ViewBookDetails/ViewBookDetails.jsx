import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Loader from "../Loader/Loader";
import { GrLanguage } from "react-icons/gr";
import { FaHeart, FaShoppingCart, FaEdit } from "react-icons/fa";
import { MdOutlineDelete } from "react-icons/md";
import { useSelector } from "react-redux";
import AllOrders from "../../pages/AllOrders";

const ViewBookDetails = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const role = useSelector((state) => state.auth.role);

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        if (id === null) {
          alert("This book is Unavailable Currently");
          navigate("/profile/orderHistory");
          return;
        }
        const response = await axios.get(
          `http://localhost:3000/api/v1/get-book-by-id/${id}`
        );
        console.log("response: ", response);
        if (!response.data.data) {
          alert("This book is Unavailable Currently");
          navigate("/unavailable");
        }
        setData(response.data.data);
        setLoading(false);
      } catch (error) {
        setError("Failed to fetch book details");
        setLoading(false);
      }
    };
    fetchBookDetails();
  }, [id]);

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
    bookid: id,
  };
  const handleFavourite = async () => {
    const response = await axios.put(
      "http://localhost:3000/api/v1/add-book-to-favourite",
      {},
      { headers }
    );
    alert(response.data.message);
  };

  const handleCart = async () => {
    const response = await axios.put(
      "http://localhost:3000/api/v1/add-to-cart",
      {},
      { headers }
    );
    alert(response.data.message);
  };

  const deleteBook = async () => {
    const response = await axios.delete(
      "http://localhost:3000/api/v1/delete-book",
      { headers }
    );
    alert(response.data.message);
    navigate("/all-books");
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div className="text-red-500 text-center mt-4">{error}</div>;
  }

  return (
    <div className="px-4 lg:px-12 py-8 bg-zinc-900 flex flex-col lg:flex-row gap-8 lg:gap-12">
      {/* Image Section */}
      <div className="bg-zinc-800 rounded-lg p-6 w-full lg:w-1/2 flex flex-col items-center">
        <img
          src={data?.url}
          alt={data?.title}
          className="h-64 lg:h-[70vh] object-contain mb-6"
        />
        <div className="flex justify-center gap-4">
          {isLoggedIn && role === "user" && (
            <>
              <button
                className="bg-red-500 text-white rounded-full text-2xl p-4 hover:bg-red-600 transition-all"
                onClick={handleFavourite}
              >
                <FaHeart />
              </button>
              <button
                className="bg-green-500 text-white rounded-full text-2xl p-4 hover:bg-green-600 transition-all"
                onClick={handleCart}
              >
                <FaShoppingCart />
              </button>
            </>
          )}
          {isLoggedIn && role === "admin" && (
            <>
              <Link
                to={`/updateBook/${id}`}
                className="bg-yellow-500 text-white rounded-full text-2xl p-4 hover:bg-yellow-600 transition-all"
              >
                <FaEdit />
              </Link>
              <button
                className="bg-red-500 text-white rounded-full text-2xl p-4 hover:bg-red-600 transition-all"
                onClick={deleteBook}
              >
                <MdOutlineDelete />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Details Section */}
      <div className="bg-zinc-800 rounded-lg p-6 w-full lg:w-1/2">
        <h1 className="text-3xl lg:text-4xl text-white font-bold mb-4">
          {data?.title}
        </h1>
        <p className="text-xl text-zinc-400 mb-2">by {data?.author}</p>
        <p className="text-lg text-zinc-300 mb-6">{data?.desc}</p>
        <div className="flex items-center text-lg text-zinc-400 mb-6">
          <GrLanguage className="mr-2" /> {data?.language}
        </div>
        <p className="text-2xl lg:text-3xl text-white font-semibold">
          Price: ₹ {data?.price}
        </p>
      </div>
    </div>
  );
};

export default ViewBookDetails;
