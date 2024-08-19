import axios from "axios";
import { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import styles from "./Login.module.css";
import { ToastContainer,toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AxiosRequest from "../../../Components/AxiosRequest";
import { useNavigate } from "react-router-dom";

const LoginOwner = () => {
  const [state, setState] = useState({
    password: "",
    email: "",
  });
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setState({
      ...state,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await AxiosRequest.post("/login-owner", state);
        if (response.data.status === "ok") {
        localStorage.setItem("resName", response.data.resName);
        localStorage.setItem("resId", response.data.restaurantId);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("name", response.data.name);
        toast.success("Login successful");
        localStorage.setItem('isOwner', 'true');
        localStorage.removeItem('isClient');
        localStorage.removeItem('isAdmin');
        navigate(`/owner`);
      }
    } catch (error) {
      if (error.response.data.error === "Invalid password") {
        toast.error("Invalid credentials");
      } else if (error.response.data.error === "User not found") {
        toast.error("Owner Not Found");
      }else if(error.response.data.error === "Please set your personal email first."){
        toast.error("Please set your personal email first.");
        navigate('/owner-email-update', { state: { email:state.email } });
      }
      else {
        toast.error(error.response.data.error, { toastId: "errorToast" });
      }

    }
  };

  const toastStyle = {
    container: "max-w-sm mx-auto",
    toast: "bg-red-500 text-white font-bold",
  };



  return (
    <div className="flex items-center justify-center h-full w-full">
      <div className="flex flex-col  bg-white shadow-black shadow-md rounded-lg p-8 mt-[10vh] mb-4 w-full max-w-md">
        <h3 className="text-2xl font-semibold text-center mb-6">تسجيل الدخول للشركاء</h3>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="form-field flex flex-col">
          <label className="mb-2 text-sm text-end font-medium">:البريد الالكتروني</label>
            <input
              className="p-2 border rounded focus:outline-none  focus:ring-2 focus:ring-blue-400"
              type="email"
              name="email"
              value={state.email}
              style={{
                textAlign: 'start', // محاذاة النص إلى المركز
                direction: 'rtl',   // تحديد اتجاه الكتابة من اليمين لليسار
              }}
              onChange={handleInputChange}
              placeholder="البريد الالكتروني"
              required
            />
          </div>
          <div className="form-field flex flex-col">
          <label className="mb-2 text-sm text-end font-medium">:كلمة المرور</label>
            <input
              className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              type="password"
              name="password"
              style={{
                textAlign: 'start', // محاذاة النص إلى المركز
                direction: 'rtl',   // تحديد اتجاه الكتابة من اليمين لليسار
              }}
              value={state.password}
              onChange={handleInputChange}
              placeholder="كلمة المرور"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-300"
          >
            تسجيل الدخول
          </button>
          <div className="text-end">
            <a href="/forgot-password-owner" className="text-blue-500 hover:underline">نسيت كلمة المرور؟</a>
          </div>
          <div className="text-center gap-2">
            <Typography className="text-sm">لم تستلم بيانات الدخول؟</Typography>
            <Typography
              className="text-blue-500 cursor-pointer hover:underline"
              onClick={() => window.location.replace('/request-credentials')}
            >
              اطلب بيانات الدخول
            </Typography>
          </div>
        </form>
      </div>
    </div>
  );
  
};

export default LoginOwner;
