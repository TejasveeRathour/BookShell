import React, { useEffect, useState } from "react";
import Sidebar from "../components/Profile/Sidebar";
import { Outlet } from "react-router-dom";
import axios from "axios";
import Loader from "../components/Loader/Loader";

const Profile = () => {
  const [profile, setProfile] = useState(null);

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/v1/get-user-information",
          { headers }
        );
        setProfile(response.data);
      } catch (error) {
        console.error("Error fetching user information:", error);
      }
    };
    fetch();
  }, []);

  return (
    <div className="bg-zinc-900 px-4 md:px-8 lg:px-12 flex flex-col md:flex-row py-8 gap-4 text-white min-h-screen">
      {!profile && (
        <div className="w-full flex items-center justify-center">
          <Loader />
        </div>
      )}
      {profile && (
        <>
          <div className="w-full md:w-1/4 lg:w-1/6">
            <Sidebar data={profile} />
          </div>
          <div className="w-full md:w-3/4 lg:w-5/6">
            <Outlet />
          </div>
        </>
      )}
    </div>
  );
};

export default Profile;
