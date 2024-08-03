import axios from "axios";
import { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import styles from "./Login.module.css";
import { ToastContainer,toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AxiosRequest from "../../../Components/AxiosRequest";


const LoginOwner = () => {
  const [state, setState] = useState({
    password: "",
    email: "",
  });

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
        window.location.replace(`/owner/${response.data.resName}`);
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


  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <h3 className={styles.formTitle}>Login as Restaurant Owner..</h3>
        <form onSubmit={handleSubmit}>
          <div className={styles.formField}>
            <input
              className={styles.inputField}
              type="email"
              name="email"
              value={state.email}
              onChange={handleInputChange}
              placeholder="Your Email"
            />
          </div>
          <div className={styles.formField}>
            <input
              className={styles.inputField}
              type="password"
              name="password"
              value={state.password}
              onChange={handleInputChange}
              placeholder="Your Password"
            />
          </div>
          <button className={styles.submitButton} type="submit">Login</button>
          <div className={styles.requestCredentials}>
            <Typography>Haven't received your credentials yet?</Typography>
            <Typography
              className={styles.textBtn}
              onClick={() => { window.location.replace('/request-credentials') }}
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
