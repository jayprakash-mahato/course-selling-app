import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import { Toaster } from "react-hot-toast";
import Courses from "./components/Courses";
import Buy from "./components/Buy";
import Purchases from "./components/Purchases";
import AdminSignup from "./admin/AdminSignup";
import AdminLogin from "./admin/AdminLogin";
import Dashboard from "./admin/Dashboard";
import CourseCreate from "./admin/CourseCreate";
import UpdateCourse from "./admin/UpdateCourse";
import OurCourses from "./admin/OurCourses";


export const App = () => {

  const user = JSON.parse(localStorage.getItem("user"));
  const admin = JSON.parse(localStorage.getItem("admin"));
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home></Home>}></Route>
        <Route path="/login" element={<Login></Login>}></Route>
        <Route path="/signup" element={<Signup></Signup>}></Route>

        {/* OTHER ROUTES */}
        <Route path="/courses" element={<Courses></Courses>}></Route>
        <Route path="/buy/:courseId" element={<Buy></Buy>}></Route>
        <Route path="/purchases" element={user?<Purchases></Purchases>:<Navigate to={"/login"}></Navigate>}></Route>

        {/* ADMIN ROUTES */}
        <Route
          path="/admin/signup"
          element={<AdminSignup></AdminSignup>}
        ></Route>
        <Route path="/admin/login" element={<AdminLogin></AdminLogin>}></Route>
        <Route
          path="/admin/dashboard"
          element={admin?<Dashboard></Dashboard>:<Navigate to={"/admin/login"}></Navigate>}
        ></Route>
        <Route
          path="/admin/create-course"
          element={<CourseCreate></CourseCreate>}
        ></Route>
        <Route path="/admin/update-course/:id" element={<UpdateCourse></UpdateCourse>}></Route>
        <Route path="/admin/Our-Courses" element={<OurCourses></OurCourses>}></Route>
      </Routes>
      <Toaster />
    </div>
  );
};

export default App;
