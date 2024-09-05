import React, { useEffect, useState } from "react";
import Loader from "../components/Loader/Loader";
import { AiFillDelete } from "react-icons/ai";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const [Cart, setCart] = useState([]);
  const [Total, setTotal] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState(""); // Default to Razorpay
  const navigate = useNavigate();

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/v1/get-user-cart",
          { headers }
        );
        setCart(response.data.data);
      } catch (error) {
        console.error("Error fetching user cart:", error);
      }
    };
    fetch();
  }, []);

  useEffect(() => {
    if (Cart && Cart.length > 0) {
      let total = 0;
      Cart.forEach((item) => {
        total += item.price;
      });
      setTotal(total);
    }
  }, [Cart]);

  const handleRazorpayPayment = async () => {
    try {
      const { data } = await axios.post(
        "http://localhost:3000/api/v1/create-order",
        { amount: Total }
      );
      console.log(data);
  
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        order_id: data.data.id, // ensure order_id is correctly passed here
        name:"BookShell",
        description: "Thank You for Purchasing the Book",
        handler: async (response) => {
          try {
            console.log("Payment response:", response);
  
            const paymentResult = await axios.post(
              "http://localhost:3000/api/v1/verify-signature",
              { 
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                order: Cart // Pass the order details as well,

              },
              { headers } // Include headers here
            );
            console.log(paymentResult.data);
            alert(paymentResult.data.message);
            if (paymentResult.data.success) {
              navigate("/profile/orderHistory");
            }
          } catch (error) {
            console.error("Error verifying payment:", error);
          }
        },
        theme: {
          color: "#18181B",
        },
      };
  
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Error during Razorpay payment:", error);
    }
  };
  

  const handleCODPayment = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/place-cod-order",
        { order: Cart },
        { headers }
      );
      alert(response.data.message);
      navigate("/profile/orderHistory");
    } catch (error) {
      console.error("Error placing order with COD:", error);
    }
  };

  const handlePlaceOrder = () => {
    if (paymentMethod === "razorpay") {
      handleRazorpayPayment();
    } else if (paymentMethod === "cod") {
      handleCODPayment();
    }
  };

  const deleteItem = async (bookid) => {
    try {
      const response = await axios.put(
        `http://localhost:3000/api/v1/remove-from-cart/${bookid}`,
        {},
        { headers }
      );
      alert(response.data.message);
      setCart(Cart.filter((item) => item._id !== bookid));
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };

  return (
    <div className="bg-zinc-900 px-4 md:px-12 py-8 min-h-screen">
      {!Cart && (
        <div className="w-full h-[100%] flex items-center justify-center">
          <Loader />
        </div>
      )}
      {Cart && Cart.length === 0 && (
        <div className="h-full flex items-center justify-center flex-col text-center">
          <h1 className="text-3xl md:text-5xl font-semibold text-zinc-400">
            Empty Cart
          </h1>
          <img
            src="/empty.png"
            alt="empty cart"
            className="mt-4 md:mt-8 w-3/4 md:w-1/2 lg:w-1/3 object-contain"
          />
        </div>
      )}
      {Cart && Cart.length > 0 && (
        <>
          <h1 className="text-3xl md:text-5xl font-semibold text-zinc-500 mb-8">
            Your Cart
          </h1>
          {Cart.map((item) => (
            <div
              className="w-full mb-6 rounded flex flex-col md:flex-row p-4 bg-zinc-800 justify-between items-center"
              key={item._id}
            >
              <div className="w-full md:w-1/3 h-[20vh] md:h-[15vh] overflow-hidden rounded">
                <img
                  src={item.url}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-full md:w-2/3 md:ml-4 mt-4 md:mt-0">
                <h2 className="text-xl md:text-2xl text-zinc-100 font-semibold">
                  {item.title}
                </h2>
                <p className="text-sm md:text-base text-zinc-300 mt-2">
                  {item.desc.length > 100
                    ? `${item.desc.slice(0, 100)}...`
                    : item.desc}
                </p>
              </div>
              <div className="flex flex-col md:flex-row items-center justify-around mt-4 md:mt-0 w-full">
                <h2 className="text-xl md:text-3xl text-zinc-100 font-semibold">
                  ₹ {item.price}
                </h2>
                <button
                  className="bg-red-100 text-red-700 border border-red-700 rounded p-2 mt-4 md:mt-0"
                  onClick={() => deleteItem(item._id)}
                >
                  <AiFillDelete className="text-xl" />
                </button>
              </div>
            </div>
          ))}
        </>
      )}
      {Cart && Cart.length > 0 && (
        <div className=" mt-4 h-full flex items-center justify-end">
          <div className="p-4 bg-zinc-800 rounded">
            <h1 className="text-3xl text-zinc-200 font-semibold">
              Total Amount
            </h1>
            <div className="mt-3 flex items-center justify-between text-xl text-zinc-200">
              <h2>{Cart.length} books</h2> <h2>₹ {Total}</h2>
            </div>

            {/* Payment Method Selection */}
            <div className="mt-4">
              <h2 className="text-xl text-zinc-200 mb-2">
                Choose Payment Method:
              </h2>
              <label className="block text-zinc-300">
                <input
                  type="radio"
                  value="razorpay"
                  checked={paymentMethod === "razorpay"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />{" "}
                Razorpay
              </label>
              <label className="block text-zinc-300">
                <input
                  type="radio"
                  value="cod"
                  checked={paymentMethod === "cod"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />{" "}
                Cash on Delivery (COD)
              </label>
            </div>

            <div className="w-[100%] mt-3">
              <button
                className="bg-zinc-100 rounded px-4 py-2 flex justify-center w-full font-semibold hover:bg-zinc-200"
                onClick={handlePlaceOrder}
              >
                Place your order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
