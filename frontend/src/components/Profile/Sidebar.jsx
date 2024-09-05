import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowRightFromBracket } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../../store/auth";

const Sidebar = ({ data }) => {
  const dispatch = useDispatch();
  const history = useNavigate();
  const role = useSelector((state) => state.auth.role); // Corrected access to role

  return (
    <div className="bg-zinc-800 p-4 rounded flex flex-col items-center justify-between h-full">
      <div className="flex items-center flex-col justify-center">
        <img
          src={data.avatar}
          alt="User Avatar"
          className="h-24 w-24 rounded-full object-cover"
        />
        <p className="mt-3 text-lg lg:text-xl text-zinc-100 font-semibold">
          {data.username}
        </p>
        <p className="mt-1 text-sm lg:text-base text-zinc-300">{data.email}</p>
        <div className="w-full mt-4 h-[1px] bg-zinc-500"></div>
      </div>

      {/* Sidebar links */}
      {role === "user" && (
        <div className="w-full flex flex-col items-center justify-center mt-6 lg:mt-0">
          <Link
            to="/profile"
            className="text-zinc-100 font-semibold w-full py-2 text-center hover:bg-zinc-900 rounded transition-all duration-300"
          >
            Favourites
          </Link>
          <Link
            to="/profile/orderHistory"
            className="text-zinc-100 font-semibold w-full py-2 mt-4 text-center hover:bg-zinc-900 rounded transition-all duration-300"
          >
            Order History
          </Link>
          <Link
            to="/profile/settings"
            className="text-zinc-100 font-semibold w-full py-2 mt-4 text-center hover:bg-zinc-900 rounded transition-all duration-300"
          >
            Settings
          </Link>
        </div>
      )}

      {/* Admin Profile Section */}
      {role === "admin" && (
        <div className="w-full flex flex-col items-center justify-center mt-6 lg:mt-0">
          <Link
            to="/profile"
            className="text-zinc-100 font-semibold w-full py-2 text-center hover:bg-zinc-900 rounded transition-all duration-300"
          >
            All Orders
          </Link>
          <Link
            to="/profile/add-book"
            className="text-zinc-100 font-semibold w-full py-2 mt-4 text-center hover:bg-zinc-900 rounded transition-all duration-300"
          >
            Add Book
          </Link>
        </div>
      )}

      {/* Logout button */}
      <button
        className="bg-zinc-900 w-5/6 lg:w-full mt-6 lg:mt-0 text-white font-semibold 
        flex items-center justify-center py-2 rounded hover:bg-white hover:text-zinc-900 transition-all duration-300"
        onClick={() => {
          dispatch(authActions.logout());
          dispatch(authActions.changeRole("user"));
          localStorage.clear("id");
          localStorage.clear("token");
          localStorage.clear("role");
          history("/");
        }}
      >
        Log Out
        <FaArrowRightFromBracket className="ml-2" />
      </button>
    </div>
  );
};

export default Sidebar;
