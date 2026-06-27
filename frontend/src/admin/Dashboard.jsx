import axios from "axios";
import React from "react";
import toast from "react-hot-toast";
import { GrUserAdmin } from "react-icons/gr";
import { Link } from "react-router-dom";


const Dashboard = () => {
  const handleLogout = async () => {
    try {
      const response = await axios.get(
        // `${import.meta.env.VITE_BACKEND_URL}/api/v1/admin/logout`,
        "http://localhost:4001/api/v1/admin/logout",
        {
          withCredentials: true,
        }
      );
      toast.success(response.data.message);
      localStorage.removeItem("admin");
    } catch (error) {
      console.log("Error in Logging out", error);
      toast.error(error.response.data.errors || " Error in Loggin out");
    }
  };
  return (
    <div className="flex h-screen">
      <div className="w-64 bg-gray-100 p-5">
        <div className="  mb-10">
          <GrUserAdmin className=" w-10 h-10 ml-20" />
          <h2 className="text-lg font-semibold mt-5 ml-10">I am Admin</h2>
        </div>

        <nav className="flex flex-col space-y-4">
          <Link to="/admin/our-courses">
            <button className="w-full bg-green-700 hover:bg-green-600 text-white py-2 rounded">
              Our Courses
            </button>
          </Link>
          <Link to="/admin/signup">
            <button className="w-full bg-green-700 hover:bg-green-600 text-white py-2 rounded">
              Admin SignUP create new
            </button>
          </Link>
          <Link to="/admin/create-course">
            <button className="w-full bg-orange-500 hover:bg-blue-600 text-white py-2 rounded">
              Create Course
            </button>
          </Link>
          <Link to="/">
            <button className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded">
              Home
            </button>
          </Link>
          <Link to="/admin/login">
            <button
              onClick={handleLogout}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded"
            >
              Logout
            </button>
          </Link>
        </nav>
      </div>

      <div className="flex h-screen items-center justify-center ml-[40%]">
        Welcome!!!
      </div>
    </div>
  );
};

export default Dashboard;
