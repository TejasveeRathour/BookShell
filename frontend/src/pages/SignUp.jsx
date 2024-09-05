import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const SignUp = () => {
  const [Values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    address: "",
  });

  const navigate = useNavigate();

  const change = (e) => {
    const { name, value } = e.target;
    setValues({ ...Values, [name]: value });
  };

  const submit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    try {
      if (
        Values.username === "" ||
        Values.email === "" ||
        Values.password === "" ||
        Values.address === ""
      ) {
        alert("All fields are required");
      } else {
        const response = await axios.post(
          "http://localhost:3000/api/v1/sign-up",
          Values
        );
        alert(response.data.message);
        navigate("/Login");
      }
    } catch (err) {
      console.log(err);
      alert(err.response.data.message);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 flex items-center justify-center py-4 px-2">
      <div className="bg-zinc-800 p-6 rounded-lg w-full max-w-lg sm:max-w-md md:max-w-lg lg:max-w-xl">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-yellow-100 text-center">
          Sign Up
        </h2>

        <form className="mt-6 space-y-4" onSubmit={submit}>
          {/* Username */}
          <div>
            <label className="block text-zinc-300 text-sm sm:text-base font-medium">
              Username
            </label>
            <input
              type="text"
              className="w-full mt-2 p-2 bg-zinc-700 text-yellow-100 border border-zinc-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-200"
              placeholder="Enter your username"
              name="username"
              required
              value={Values.username}
              onChange={change}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-zinc-300 text-sm sm:text-base font-medium">
              Email
            </label>
            <input
              type="email"
              className="w-full mt-2 p-2 bg-zinc-700 text-yellow-100 border border-zinc-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-200"
              placeholder="Enter your email"
              name="email"
              required
              value={Values.email}
              onChange={change}
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-zinc-300 text-sm sm:text-base font-medium">
              Password
            </label>
            <input
              type="password"
              className="w-full mt-2 p-2 bg-zinc-700 text-yellow-100 border border-zinc-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-200"
              placeholder="Enter your password"
              name="password"
              required
              value={Values.password}
              onChange={change}
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-zinc-300 text-sm sm:text-base font-medium">
              Address
            </label>
            <textarea
              className="w-full mt-2 p-2 bg-zinc-700 text-yellow-100 border border-zinc-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-200"
              placeholder="Enter your address"
              rows="4"
              name="address"
              required
              value={Values.address}
              onChange={change}
            ></textarea>
          </div>

          {/* Submit Button */}
          <div className="mt-6">
            <button
              type="submit"
              className="w-full py-2 bg-yellow-100 text-zinc-900 font-semibold rounded-md hover:bg-yellow-200 focus:outline-none"
            >
              Sign Up
            </button>
          </div>
        </form>

        {/* Already signed up message */}
        <div className="mt-4 text-center">
          <p className="text-zinc-300 text-sm">
            Already have an account?{" "}
            <Link to="/Login" className="text-yellow-100 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
