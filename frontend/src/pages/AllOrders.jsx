import axios from "axios";
import React, { useEffect, useState } from "react";
import Loader from "../components/Loader/Loader";
import { FaCheck, FaUserLarge } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { IoOpenOutline } from "react-icons/io5";
import SeeUserData from "./SeeUserData";

const AllOrders = () => {
  const [AllOrders, setAllOrders] = useState([]);
  const [Options, setOptions] = useState(-1);
  const [Values, setValues] = useState({ status: "Order Placed" });
  const [userDiv, setuserDiv] = useState("hidden");
  const [userDivData, setuserDivData] = useState();
  const [Money, setMoney] = useState(0);

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/v1/get-all-orders",
          { headers }
        );
        setAllOrders(response.data.data);
        const data = response.data.data;
        let totalMoney = 0;
        console.log("Data: ", data);
        for (const order of data) {
          if (
            (order.paymentMethod === "COD" && order.status === "Delivered") ||
            (order.paymentMethod === "Online" && order.status !== "Canceled")
          ) {
            totalMoney += order.book.price; // Assuming 'money' is the field in the order data
          }
        }

        setMoney(totalMoney);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
    fetch();
  }, [AllOrders]);

  const change = (e) => {
    const { value } = e.target;
    setValues({ status: value });
  };

  const submitChanges = async (i) => {
    const id = AllOrders[i]._id;
    const response = await axios.put(
      `http://localhost:3000/api/v1/update-status/${id}`,
      Values,
      { headers }
    );
    alert(response.data.message);
  };

  return (
    <>
      {!AllOrders && !AllOrders.length && (
        <div className="h-[100%] flex items-center justify-center">
          <Loader />
        </div>
      )}
      {AllOrders && AllOrders.length > 0 && (
        <div className="h-[100%] p-0 md:p-4 text-zinc-100">
          <h1 className="text-3xl md:text-5xl font-semibold text-zinc-500 mb-8">
            All Orders
          </h1>

          {/* Total Money Section */}
          <div className="bg-green-500 text-black p-4 rounded mb-4">
            <h2 className="text-xl font-bold">Total Money Collected: ₹ {Money}</h2>
          </div>

          <div className="mt-4 bg-zinc-800 w-full rounded py-2 px-4 flex gap-2 mb-2">
            <div className="w-[3%]">
              <h1 className="text-center">Sr.</h1>
            </div>
            <div className="w-[40%] md:w-[22%]">
              <h1>Books</h1>
            </div>
            <div className="w-0 md:w-[45%] hidden md:block">
              <h1>Author</h1>
            </div>
            <div className="w-[17%] md:w-[9%]">
              <h1>Price</h1>
            </div>
            <div className="w-[30%] md:w-[16%]">
              <h1>Status</h1>
            </div>
            <div className="w-0 md:w-[8%] hidden md:block">
              <h1 className="">Mode</h1>
            </div>
            <div className="w-[10%] md:w-[5%]">
              <h1>
                <FaUserLarge />
              </h1>
            </div>
          </div>

          {AllOrders &&
            AllOrders.map((items, i) => (
              <div
                className="bg-zinc-800 w-full rounded py-2 px-4 flex gap-2 hover:bg-zinc-900 
              hover:cursor-pointer transition-all duration-300 mb-2"
                key={i}
              >
                <div className="w-[3%]">
                  <h1 className="text-center">{i + 1}</h1>
                </div>
                <div className="w-[40%] md:w-[22%]">
                  <Link
                    to={`/view-book-details/${items.book.id}`}
                    className="hover:text-blue-300"
                  >
                    {items.book.title}
                  </Link>
                </div>
                <div className="w-0 md:w-[45%] hidden md:block">
                  <h1 className="">{items.book.author} ...</h1>
                </div>
                <div className="w-[17%] md:w-[9%]">
                  <h1 className="">₹ {items.book.price}</h1>
                </div>
                <div className="w-[30%] md:w-[16%]">
                  <h1 className="font-semibold">
                    <button
                      className=" hover:scale-105 transition-all duration-300"
                      onClick={() => setOptions(i)}
                    >
                      {items.status === "Order Placed" ? (
                        <div className="text-yellow-500">{items.status}</div>
                      ) : items.status === "Canceled" ? (
                        <div className="text-red-500">{items.status}</div>
                      ) : (
                        <div className="text-green-500">{items.status}</div>
                      )}
                    </button>
                    <div
                      className={`${
                        Options === i ? "block" : "hidden"
                      } flex mt-4`}
                    >
                      <select
                        name="status"
                        id=""
                        className="bg-gray-800"
                        onChange={change}
                        value={Values.status}
                      >
                        {[
                          "Order Placed",
                          "Out for delivery",
                          "Delivered",
                          "Canceled",
                        ].map((items, i) => (
                          <option value={items} key={i}>
                            {items}
                          </option>
                        ))}
                      </select>
                      <button
                        className="text-green-500 hover:text-pink-600 mx-2"
                        onClick={() => {
                          setOptions(-1);
                          submitChanges(i);
                        }}
                      >
                        <FaCheck />
                      </button>
                    </div>
                  </h1>
                </div>
                <div className="w-0 md:w-[8%] hidden md:block">
                <h1 className="text-sm text-zinc-400">{items.paymentMethod}</h1>
              </div>
                <div className="w-[10%] md:w-[5%]">
                  <button
                    className="text-xl hover:text-orange-500"
                    onClick={() => {
                      setuserDiv("fixed");
                      setuserDivData(items.user);
                    }}
                  >
                    <IoOpenOutline />
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}

      {userDivData && (
        <SeeUserData
          userDivData={userDivData}
          userDiv={userDiv}
          setuserDiv={setuserDiv}
        />
      )}
    </>
  );
};

export default AllOrders;
