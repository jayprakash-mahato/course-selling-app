import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaCircleUser } from "react-icons/fa6";
import { RiHome2Fill } from "react-icons/ri";
import { FaDiscourse } from "react-icons/fa";
import { FaDownload } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { IoLogIn, IoLogOut } from "react-icons/io5";
import { FiSearch } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../public/symbol.png";

const Purchases = () => {
  const [purchases, setPurchase] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState([false]);
  const [errorMessage, setErrorMessage] = useState(true);

  console.log("purchases:", purchases);

  useEffect(() => {
    const token = localStorage.getItem("user");
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  // fetch course
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user.token;

    const fetchPurchases = async () => {
      if (!token) {
        setErrorMessage("Please Login To Purchase The Courses");
        // navigate("/login");
        return;
      }

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/purchases`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
        setPurchase(response.data.courseData);
      } catch (error) {
        setErrorMessage("Failed to fetch purchase data");
      }
    };
    fetchPurchases();
  }, []);

  const handleLogout = async () => {
    try {
      const response = axios.get(
        `${import.meta.env.Vite_BACKEND_URL}/user/logout`,
        {
          withCredentials: true,
        }
      );
      toast.success((await response).data.message);
      localStorage.removeItem("user");

      setIsLoggedIn(false);
    } catch (error) {
      console.log("Error in Logging out", error);
      toast.error(error.response.data.errors || " Error in Loggin out");
    }
  };

  return (
    <div className="flex h-screen">
      {/* SIDE BAR */}
      <div className="w-64 bg-gray-100 p-5">
        <nav>
          <ul>
            <li className="mb-4">
              <Link to="/" className="flex items-center ">
                <RiHome2Fill className="mr-2"></RiHome2Fill>
                Home
              </Link>
            </li>

            <li className="mb-4">
              <Link to="/courses" className="flex items-center ">
                <FaDiscourse className="mr-2"></FaDiscourse>
                Courses
              </Link>
            </li>

            <li className="mb-4">
              <a href="#" className="flex items-center text-blue-500">
                <FaDownload className="mr-2"></FaDownload>
                Purchases
              </a>
            </li>

            <li className="mb-4">
              <Link to="/settings" className="flex items-center ">
                <IoMdSettings className="mr-2"></IoMdSettings>
                Setting
              </Link>
            </li>

            <li>
              {isLoggedIn ? (
                <a
                  href="/"
                  className="flex items-center"
                  onClick={handleLogout}
                >
                  <IoLogOut className="mr-2"></IoLogOut>
                  Logout
                </a>
              ) : (
                <Link to="/login" className="flex items-center">
                  <IoLogIn className="mr-2"></IoLogIn>
                  Login
                </Link>
              )}
            </li>
          </ul>
        </nav>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 p-8 bg-gray-50">
        <h2 className="text-lg font-semibold mb-6"> My Purchases</h2>

        {/* ERROR MESSAGE */}
        {errorMessage && (
          <div className="text-red-500 text-center mb-4">{errorMessage}</div>
        )}

        {/* RENDER PURCHASES */}

        {purchases.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:geid-cols-4 gap-6">
            {purchases.map((purchases, index) => (
              <div
                key={index}
                className="bg-white rounded-larrg shadow-md p-6 md-6"
              >
                <div className="flex flex-col items-center space-y-4">
                  {/* IMAGE TAG */}
                  <img
                    src={
                      purchases.image?.url || "https://via.placeholder.com/200"
                    }
                    alt={purchases.title}
                  ></img>
                  <div className="text-center">
                    <h3 className="text-lg font-bold"> {purchases.title}</h3>
                    <p className="text-gray-500">
                      {purchases.description.length > 100
                        ? `${purchases.description.slice(0, 100)}...`
                        : purchases.description}
                    </p>
                    <span className="text-green-700 font-semibold text-sm">
                      ${purchases.price} only
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500"> You have No Purchase Yet.</p>
        )}
      </div>
    </div>
  );
};

export default Purchases;
