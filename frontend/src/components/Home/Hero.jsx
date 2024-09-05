import React from "react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="lg:h-screen flex flex-col lg:flex-row">
      {/* Text Section */}
      <div className="w-full lg:w-3/6 flex flex-col items-center lg:items-start justify-center p-4 lg:p-8">
        <h1 className="text-4xl lg:text-6xl font-semibold text-yellow-100 text-center lg:text-left">
          Find Your Story in Our BookShell
        </h1>
        <p className="mt-4 text-xl text-zinc-300 text-center lg:text-left">
          Dive into a world of captivating narratives and timeless classics. Our
          curated collection offers something for every reader, from the latest
          bestsellers to hidden gems waiting to be discovered.
        </p>
        <div className="mt-8">
          <Link
            to="/all-books"
            className="text-yellow-100 text-md sm:text-xl md:text-xl lg:text-2xl font-semibold border 
             border-yellow-100 px-10 py-2 hover:bg-zinc-800 rounded-full"
          >
            Explore the BookShell
          </Link>
        </div>
      </div>

      {/* Image Section */}
      <div className="w-full lg:w-3/6 flex items-center justify-center lg:relative lg:overflow-hidden rounded-md">
        <img
          src="./bookshell.png"
          alt="hero"
          className="w-full h-auto object-cover lg:h-full lg:w-full"
        />
      </div>
    </div>
  );
};

export default Hero;
