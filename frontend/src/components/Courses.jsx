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

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState([false]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  console.log("courses:", courses);

  useEffect(() => {
    const token = localStorage.getItem("user");
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const handleLogout = async () => {
    try {
      const response = axios.get(
        // `${import.meta.env.Vite_BACKEND_URL}/user/logout`,
        "http://localhost:4001/api/v1/user/logout",
        {
          withCredentials: true,
        },
      );
      toast.success((await response).data.message);
      localStorage.removeItem("user");

      setIsLoggedIn(false);
    } catch (error) {
      console.log("Error in Logging out", error);
      toast.error(error.response.data.errors || " Error in Loggin out");
    }
  };

  useEffect(() => {
    const fetcCourses = async () => {
      try {
        const response = await axios.get(
          // `${import.meta.env.VITE_BACKEND_URL}/api/v1/course/courses`,
          "http://localhost:4001/api/v1/course/courses",
          { withCredentials: true },
        );
        console.log(response.data.courses);
        setCourses(response.data.courses);
        setLoading(false);
      } catch (error) {
        console.log("Error in Fetch Courses", error);
      }
    };
    fetcCourses();
  }, []);

  return (
    <div className="flex">
      {/* Sidebar */}

      <aside className="w-64 bg-gray-100 h-screen p-5 fixed">
        <div className="flex items-center mb-10">
          <img
            src={logo}
            alt="profile"
            className="rounded-full h-12 w-12"
          ></img>
        </div>

        <nav>
          <ul>
            <li className="mb-4">
              <a href="/" className="flex items-center ">
                <span className="material-icons mr-2">
                  <RiHome2Fill></RiHome2Fill>
                </span>{" "}
                Home
              </a>
            </li>
            <li className="mb-4">
              <a href="#" className="flex items-center text-blue-500">
                <span className="material-icons mr-2">
                  <FaDiscourse></FaDiscourse>
                </span>{" "}
                Courses
              </a>
            </li>
            <li className="mb-4">
              <a href="/purchases" className="flex items-center ">
                <span className="material-icons mr-2">
                  <FaDownload></FaDownload>
                </span>{" "}
                Purchases
              </a>
            </li>
            <li className="mb-4">
              <a href="/" className="flex items-center ">
                <span className="material-icons mr-2">
                  <IoMdSettings></IoMdSettings>
                </span>{" "}
                Setting
              </a>
            </li>
            <li>
              {isLoggedIn ? (
                <a
                  href="/"
                  className="flex items-center"
                  onClick={handleLogout}
                >
                  <span className="material-icons mr-2">
                    <IoLogOut></IoLogOut>
                  </span>{" "}
                  Logout
                </a>
              ) : (
                <>
                  <a
                    href="/login"
                    className="flex items-center"
                    onClick={handleLogout}
                  >
                    <span className="material-icons mr-2">
                      <IoLogIn></IoLogIn>
                    </span>{" "}
                    Login
                  </a>
                </>
              )}
            </li>
          </ul>
        </nav>
      </aside>

      {/* main Content  */}

      <main className="ml-[15%] w-[85%] h-screen bg-white p-10">
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-xl font-bold"> Courses </h1>
          <div className="flex items-center space-x-3">
            <div className="flex items-center">
              <input
                type="text"
                placeholder="type here to search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border border-gray-300 rounded-l-full px-4 py-2 focus:outline-none"
              ></input>
              <button className="h-10 border border-gray-300 rounded-r-full px-4 py-2 flex items-center justify-center">
                <FiSearch className="text-xl text-gray-600"></FiSearch>
              </button>
            </div>
            <div>
              <FaCircleUser className="text-4xl text-blue-600"></FaCircleUser>
            </div>
          </div>
        </header>

        {/* Vertically Scrollable Couses Section */}

        <div className="overflow-y-auto h-[75vh]">
          {loading ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : courses.filter((course) =>
              course.title.toLowerCase().includes(searchQuery.toLowerCase()),
            ).length === 0 ? (
            <p className="text-center text-gray-500">
              {" "}
              {searchQuery
                ? "No courses found matching your search"
                : "No course Posted Yet By Admin"}
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
              {courses
                .filter((course) =>
                  course.title
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()),
                )
                .map((course) => (
                  <div
                    key={course._id}
                    className="border border-grey-200 rounded-lg p-4 shadow-sm"
                  >
                    <img
                      src={course.image.url}
                      alt={course.title}
                      className="rounded mb-4"
                    ></img>
                    <h2 className="font-bold text-lg mb-2">{course.title}</h2>
                    <p className="text-gray-600 mb-4">
                      {course.description.length > 100
                        ? `${course.description.slice(0, 100)}...`
                        : course.description}
                    </p>
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-bold text-xl">
                        ₹{course.price}{" "}
                        <span className="text-gray-500 line-through">5999</span>
                      </span>
                      <span className="text-green-600">20% off</span>
                    </div>

                    {/* BUY PAGE */}
                    <Link
                      to={`/buy/${course._id}`}
                      className="bg-orange-500 w-full text-white px-4 py-2 rounded-lg hover:bg-blue-900 duration-300"
                    >
                      Buy Now
                    </Link>
                  </div>
                ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Courses;
