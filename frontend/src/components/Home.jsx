import React, { useEffect, useState } from "react";
import logo from "../../public/symbol.png";
import { Link } from "react-router-dom";
import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import toast from "react-hot-toast";

const Home = () => {
  const [courses, setCourses] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState([false]);
  // updated code
  const [isLoggedInAdmin, setIsLoggedInAdmin] = useState([false]);

  useEffect(() => {
    const token = localStorage.getItem("user");
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);
  // updated code
  useEffect(() => {
    const token2 = localStorage.getItem("admin");
    if (token2) {
      setIsLoggedInAdmin(true);
    } else {
      setIsLoggedInAdmin(false);
    }
  }, []);

  const handleLogout = async () => {
    try {
      const response = axios.get(
        // `${import.meta.env.Vite_BACKEND_URL}/user/logout`,
        "http://localhost:4001/api/v1/user/logout",
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

  // updated code
  const handleLogoutAdmin = async () => {
    try {
      const response = axios.get(
        `${import.meta.env.Vite_BACKEND_URL}/admin/logout`,
        {
          withCredentials: true,
        }
      );
      toast.success((await response).data.message);
      localStorage.removeItem("admin");

      setIsLoggedInAdmin(false);
    } catch (error) {
      console.log("Error in Logging out", error);
      toast.error(error.response.data.errors || " Error in Loggin out");
    }
  };

  useEffect(() => {
 
    const fetcCourses = async () => {
      try {
        const response = await axios.get(
          // `${import.meta.env.VITE_BACKEND_URL}/api/v1/course/courses`
        "http://localhost:4001/api/v1/course/courses"
          ,
          // { withCredentials: true }
          {
            Credentials:"include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        console.log(response.data.courses);
        setCourses(response.data.courses);
      } catch (error) {
        console.log("Error in Fetch Courses", error);
      }
    };
    fetcCourses();
  }, []);

  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    initialSlide: 0,
    autoplay: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="bg-gradient-to-r from-black to-blue-950 h-screen">
      <div className="h-screen text-white container mx-auto ">
        {/* Header */}
      <header className="flex flex-col md:flex-row items-center justify-between px-4 py-4 gap-4 md:gap-0">
  {/* LEFT DIV */}
  <div className="flex items-center space-x-2">
    <Link to={"/"}>
      <img src={logo} alt="logo" className="w-10 h-10 rounded-full" />
    </Link>
    <h1 className="text-xl md:text-2xl text-orange-500 font-bold">
      TechCourses
    </h1>
  </div>

  {/* RIGHT DIV */}
  {isLoggedIn || isLoggedInAdmin ? (
    <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
      <button
        onClick={isLoggedIn ? handleLogout : handleLogoutAdmin}
        className="text-sm md:text-base bg-transparent text-white px-4 py-2 border border-white rounded hover:bg-white hover:text-black font-bold"
      >
        Logout
      </button>
      {isLoggedInAdmin && (
        <Link
          to="/admin/Dashboard"
          className="text-sm md:text-base bg-transparent text-white px-4 py-2 border border-white rounded hover:bg-white hover:text-black font-bold"
        >
          Admin Dashboard
        </Link>
      )}
    </div>
  ) : (
    <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
      <Link
        to={"/admin/login"}
        className="text-sm md:text-base bg-transparent text-white px-4 py-2 border border-white rounded hover:bg-white hover:text-black font-bold"
      >
        Admin Login
      </Link>
      <Link
        to={"/login"}
        className="text-sm md:text-base bg-transparent text-white px-4 py-2 border border-white rounded hover:bg-white hover:text-black font-bold"
      >
        Login
      </Link>
      <Link
        to={"/signup"}
        className="text-sm md:text-base bg-transparent text-white px-4 py-2 border border-white rounded hover:bg-white hover:text-black font-bold"
      >
        Signup
      </Link>
    </div>
  )}
</header>


        {/* Main Section */}

        {/* SECTION I */}
        <section className="text-center py-20">
          <div className="marq md:w-1420">
            {/* <marquee
            direction="left"
            // width="145px"
            height="35px"
            scrollamount="12"
            className="bg-green-500 text-red-700 font-bold flex items-center"
          >
            Hello Guys This project is in development phase .Regular Updates
            Will Come Back to Back
          </marquee> */}
          </div>
          <h2 className="text-5xl font-semibold text-orange-500">
            #TechCourses
          </h2>
          <br></br>
          <p className="text-gray-500 ">
            Sharpen Your Skills With Course Crafted By Experts
          </p>

          <div className="space-x-4 mt-8">
            <Link
              to={"/courses"}
              className="bg-green-500 text-white rounded font-semibold hover:bg-white duration-300 hover:text-black py-3 px-6"
            >
              Explore Courses
            </Link>
            <Link
              to={"https://www.youtube.com/@codominginfotech8522"}
              className="bg-white text-black rounded font-semibold hover:bg-green-500 duration-300 hover:text-white py-3 px-6"
            >
              Courses Videos
            </Link>
          </div>
        </section>

        {/* SECTION 2 */}
        <section>
          <Slider {...settings}>
            {courses.map((course) => (
              <div key={course._id} className="p-4">
                <div className="relative flex-shrink-0 w-85 h-20 transition-transform duration-300 transform hover:scale-105">
                  <div className="bg-gray-900 rounded-lg overflow-hidden">
                    <img
                      className="h-32 w-full object-contain"
                      src={course.image.url}
                      alt=""
                    ></img>
                    <div className="p-6 text-center">
                      <h2 className="text-white text-xl font-bold">
                        {course.title}
                      </h2>
                      <Link to={"/courses"} className="mt-4 bg-orange-500 py-2 px-4 rounded-full hover:bg-blue-500 duration-300">
                        Enroll Now
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </section>

        <hr></hr>
        {/* Footer */}
        <footer className="  py-4 bg-gradient-to-r from-black to-blue-950">
          <div className="grid grid-cols-1 md:grid-cols-3">
            {/* LEFT DIV  */}
            <div className="flex flex-col items-center md:items-start">
              <div className="flex items-center space-x-2">
                <img src={logo} alt="" className="w-30 h-11 rounded-full" />
                <h1 className="text-2xl text-orange-500 font-bold">
                  TechCourses
                </h1>
              </div>

              <div className="mt-3 ml-4 md:ml-8">
                <p>Follow Us</p>
                <div className="flex space-x-4">
                  <a href="">
                    <FaFacebook className="hover:text-blue-400 w-7 h-7" />
                  </a>
                  <a href="">
                    <FaInstagram className="hover:text-pink-600 w-7 h-7" />
                  </a>
                  <a href="">
                    <FaTwitter className="hover:text-blue-600 w-7 h-7" />
                  </a>
                </div>
              </div>
            </div>

            {/* CENTER DIV */}
            <div className="flex flex-col items-center">
              <h3 className="text-lg mb-4 font-semibold">Connects</h3>

              <ul className="space-y-2 text-gray-400">
                <li className="hover:text-white cursor-pointer duration-300">
                  Youtube- Learn Coding
                </li>
                <li className="hover:text-white cursor-pointer duration-300">
                  Telegram- Learn Coding
                </li>
                <li className="hover:text-white cursor-pointer duration-300">
                  GitHub- Learn Coding
                </li>
              </ul>
            </div>

            <div className="flex flex-col items-center">
              <h3 className="text-lg mb-4 font-semibold">
                Copyrights &copy; 2025
              </h3>

              <ul className="space-y-2 text-gray-400">
                <li className="hover:text-white cursor-pointer duration-300">
                  Terms & Conditions
                </li>
                <li className="hover:text-white cursor-pointer duration-300">
                  Privacy Policy
                </li>
                <li className="hover:text-white cursor-pointer duration-300">
                  Refund & Cancallation
                </li>
              </ul>
            </div>
          </div>
          <div className="name-div flex justify-center items-center font-bold text-red-500 bg-black ">
            Developed by -Coder-Jay
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Home;
