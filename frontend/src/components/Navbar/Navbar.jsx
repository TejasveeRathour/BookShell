import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { RxHamburgerMenu } from "react-icons/rx";
import { useSelector, useDispatch } from "react-redux";
import { authActions } from "../../store/auth";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const role = useSelector((state) => state.auth.role);
  const [MobileNav, setMobileNav] = useState("hidden");

  const handleLogout = () => {
    dispatch(authActions.logout());
    dispatch(authActions.changeRole("user"));
    localStorage.clear();
    navigate("/"); // Redirect to homepage after logging out
  };

  const renderLinks1 = () => {
    return (
      <>
        <Link
          to="/"
          className="hover:text-blue-500 transition-all duration-300 text-xl md:text-base"
          onClick={() => setMobileNav("hidden")}
        >
          Home
        </Link>
        <Link
          to="/all-books"
          className="hover:text-blue-500 transition-all duration-300 text-xl md:text-base"
          onClick={() => setMobileNav("hidden")}
        >
          All Books
        </Link>
        {isLoggedIn && (
          <>
            {role === "user" && (
              <Link
                to="/cart"
                className="hover:text-blue-500 transition-all duration-300 text-xl md:text-base"
                onClick={() => setMobileNav("hidden")}
              >
                Cart
              </Link>
            )}
            <Link
              to="/profile"
              className="px-4 py-1 border border-blue-500 rounded hover:bg-white hover:text-zinc-800 transition-all duration-300 text-xl md:text-base"
              onClick={() => setMobileNav("hidden")}
            >
              {role === "admin" ? "Admin Profile" : "Profile"}
            </Link>
          </>
        )}
      </>
    );
  };
  const renderLinks2 = () => {
    return (
      <>
        <Link
          to="/"
          className="text-white text-4xl font-semibold mb-8 hover:text-blue-500 transition-all duration-300"
          onClick={() => setMobileNav("hidden")}
        >
          Home
        </Link>
        <Link
          to="/all-books"
          className="text-white text-4xl font-semibold mb-8 hover:text-blue-500 transition-all duration-300"
          onClick={() => setMobileNav("hidden")}
        >
          All Books
        </Link>
        {isLoggedIn && (
          <>
            {role === "user" && (
              <Link
                to="/cart"
                className="text-white text-4xl font-semibold mb-8 hover:text-blue-500 transition-all duration-300"
                onClick={() => setMobileNav("hidden")}
              >
                Cart
              </Link>
            )}
            <Link
              to="/profile"
              className="text-white text-4xl font-semibold mb-8 hover:text-blue-500 transition-all duration-300"
              onClick={() => setMobileNav("hidden")}
            >
              {role === "admin" ? "Admin Profile" : "Profile"}
            </Link>
          </>
        )}
      </>
    );
  };

  return (
    <>
      <nav className="z-50 relative bg-zinc-800 text-white px-8 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <img
            className="h-10 me-4"
            src="https://cdn-icons-png.flaticon.com/128/10433/10433049.png"
            alt="logo"
          />
          <h1 className="text-2xl font-semibold">BookShell</h1>
        </Link>
        <div className="nav-links-bookshell flex items-center gap-4">
          <div className="hidden md:flex gap-4 items-center">
            {renderLinks1()}
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="px-4 py-1 border border-red-500 rounded hover:bg-red-500 hover:text-white transition-all duration-300 text-xl md:text-base"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-1 border border-blue-500 rounded hover:bg-white hover:text-zinc-800 transition-all duration-300 text-xl md:text-base"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-1 border border-blue-500 rounded hover:bg-white hover:text-zinc-800 transition-all duration-300 text-xl md:text-base"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
          <button
            className="text-white text-2xl hover:text-zinc-400 flex md:hidden"
            onClick={() =>
              setMobileNav(MobileNav === "hidden" ? "block" : "hidden")
            }
          >
            <RxHamburgerMenu />
          </button>
        </div>
      </nav>
      <div
        className={`${MobileNav} bg-zinc-800 h-screen absolute top-0 left-0 w-full z-40 flex flex-col items-center justify-center md:hidden`}
      >
        {renderLinks2()}
        {!isLoggedIn ? (
          <>
            <Link
              to="/login"
              className="px-8 py-2 mb-8 text-2xl font-semibold border border-blue-500 
              rounded text-white hover:bg-white hover:text-zinc-800 transition-all duration-300"
              onClick={() => setMobileNav("hidden")}
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="px-8 py-2 mb-8 text-2xl font-semibold 
              bg-blue-500 hover:text-zinc-800 hover:bg-white rounded"
              onClick={() => setMobileNav("hidden")}
            >
              Sign Up
            </Link>
          </>
        ) : (
          <button
            onClick={handleLogout}
            className="px-8 py-2 mb-8 text-2xl font-semibold border border-red-500 
            rounded text-white hover:bg-red-500 hover:text-white transition-all duration-300"
          >
            Logout
          </button>
        )}
      </div>
    </>
  );
};

export default Navbar;
