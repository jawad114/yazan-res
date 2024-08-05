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
      if (response.data.error === "Invalid password") {
        toast.error("Invalid credentials");
      } else if (response.data.error === "User not found") {
        toast.error("Owner Not Found");
      } else if (response.data.status === "ok") {
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
      if (!toast.isActive("errorToast")) {
        toast.error(error.response.data.error, { toastId: "errorToast" });
      }

    }
  };

  const toastStyle = {
    container: "max-w-sm mx-auto",
    toast: "bg-red-500 text-white font-bold",
  };


  // return (
  //   <div className={styles.container}>
  //     <div className={styles.formContainer}>
  //       <h3 className={styles.formTitle}>Login as Restaurant Owner..</h3>
  //       <form onSubmit={handleSubmit}>
  //         <div className={styles.formField}>
  //           <input
  //             className={styles.inputField}
  //             type="email"
  //             name="email"
  //             value={state.email}
  //             onChange={handleInputChange}
  //             placeholder="Your Email"
  //           />
  //         </div>
  //         <div className={styles.formField}>
  //           <input
  //             className={styles.inputField}
  //             type="password"
  //             name="password"
  //             value={state.password}
  //             onChange={handleInputChange}
  //             placeholder="Your Password"
  //           />
  //         </div>
  //         <button className={styles.submitButton} type="submit">Login</button>
  //         <div className={styles.requestCredentials}>
  //           <Typography>Haven't received your credentials yet?</Typography>
  //           <Typography
  //             className={styles.textBtn}
  //             onClick={() => { window.location.replace('/request-credentials') }}
  //           >
  //             Request Credentials
  //           </Typography>
  //         </div>
  //       </form>
  //     </div>
  //   </div>
  // );
  return (
    <div className="flex items-center justify-center h-full w-full">
      <div className="flex flex-col  bg-white shadow-black shadow-md rounded-lg p-8 mt-[10vh] w-full max-w-md">
        <h3 className="text-2xl font-semibold text-center mb-6">Login as Restaurant Owner</h3>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="form-field flex flex-col">
          <label className="mb-2 text-sm font-medium">Email:</label>
            <input
              className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              type="email"
              name="email"
              value={state.email}
              onChange={handleInputChange}
              placeholder="Your Email"
              required
            />
          </div>
          <div className="form-field flex flex-col">
          <label className="mb-2 text-sm font-medium">Password:</label>
            <input
              className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              type="password"
              name="password"
              value={state.password}
              onChange={handleInputChange}
              placeholder="Your Password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-300"
          >
            Login
          </button>
          <div className="text-center mt-4">
            <Typography className="text-sm">Haven't received your credentials yet?</Typography>
            <Typography
              className="text-blue-500 cursor-pointer hover:underline mt-2"
              onClick={() => window.location.replace('/request-credentials')}
            >
              Request Credentials
            </Typography>
          </div>
        </form>
      </div>
    </div>
  );
  
};

export default LoginOwner;
