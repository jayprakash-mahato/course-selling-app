import React, { useEffect, useState } from "react";
import logo from "../../public/symbol.png";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        // `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/signup`,
        "http://localhost:4001/api/v1/user/signup",
        {
          firstName,
          lastName,
          email,
          password,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Signup successful:", response.data);
      toast.success(response.data.message);
      navigate("/login");
    } catch (error) {
      if (error.response) {
        setErrorMessage(error.response.data.errors || "Signup failed!!!");
      }
    }
  };
  return (
    <div className="bg-gradient-to-r from-black to-blue-950 ">
      <div className="h-screen text-white container mx-auto flex items-center justify-center py-6">
        {/* Header */}
        <header className=" absolute top-0 left-0 w-full flex items-center justify-between ">
          {/* LEFT DIV */}
          <div className="flex items-center space-x-2">
            {/* <img src={logo} alt="" className="w-30 h-11 rounded-full" /> */}
            <Link to={"/"}>
              <img src={logo} alt="" className="w-30 h-11 rounded-full" />
            </Link>

            <h1 className="text-2xl text-orange-500 font-bold">TechCourses</h1>
          </div>

          {/* RIGHT DIV  */}
          <div className="space-x-4">
            <Link
              to={"/"}
              className="bg-transparent text-white px-4 py-2 border border-white rounded hover:bg-white hover:text-black font-bold"
            >
              Home
            </Link>
            <Link
              to={"/login"}
              className="bg-transparent text-white px-4 py-2 border border-white rounded hover:bg-white hover:text-black font-bold"
            >
              Login
            </Link>
          </div>
        </header>

        {/* SIGNUP FORM */}

        <div className="bg-gray-900 p-8 rounded-lg shadow-lg w-[500px] mt-20">
          <h2 className="text-2xl font-bold mb-4 text-center">
            welcome to <span className="text-orange-500 ">CourseHeaven</span>
          </h2>
          <p className="text-center text-gray-400 mb-2">
            Just Signup to join Us!
          </p>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="firstname" className="text-gray-400">
                FirstName
              </label>
              <input
                type="text"
                id="firstname"
                onChange={(e) => setFirstName(e.target.value)}
                value={firstName}
                placeholder="Enter Your FirstName"
                className="w-full p-3 rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></input>
            </div>
            <div className="mb-4">
              <label htmlFor="lastname" className="text-gray-400">
                LastName
              </label>
              <input
                type="text"
                id="lastname"
                onChange={(e) => setLastName(e.target.value)}
                value={lastName}
                placeholder="Enter Your LastName"
                className="w-full p-3 rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></input>
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="text-gray-400">
                Email
              </label>
              <input
                type="email"
                id="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                placeholder="xyz@gmail.com"
                className="w-full p-3 rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></input>
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="text-gray-400">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter Your Password"
                  className="w-full p-3 rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></input>
                <span className="absolute right-3 top-3 cursor-pointer text-gray-500">
                  👁️
                </span>
              </div>
            </div>

            {errorMessage && (
              <div className="mb-4 text-red-500 text-center">
                {errorMessage}
              </div>
            )}
            <button
              type="submit"
              className="w-full bg-orange-500 text-white py-3 px-6 rounded-md transition hover:bg-blue-500"
            >
              SignUp
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
