
import React, {  useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";


const Buy = () => {
  const { courseId } = useParams();
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token;


  const handlePurchase = async () => {
    
    if (!token) {
      
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        // `${import.meta.env.VITE_BACKEND_URL}/api/v1/course/buy/${courseId}`,
        `http://localhost:4001/api/v1/course/buy/${courseId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      toast.success(response.data.message || "Course Purchased Successfully");
      navigate("/purchases");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      if (error.response?.status === 400) {
        toast.error("You Have Already Purchased This Course");
      navigate("/purchases");

        
      } else {
        toast.error(error?.response?.data?.errors);
        console.log(error?.response?.data?.errors);
      }
    }
  };

  return (

    <>
      
         <div className="flex h-screen items-center justify-center">
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-800 duration-300"
            onClick={handlePurchase}
            disabled={loading}
            >
            {loading ? "Processing..." : "Buy Now"}
          </button>
        </div>
            </>
  )
}

export default Buy;
