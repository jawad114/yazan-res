import "./Login.css";
import axios from "axios";
import { useState } from "react";
import PersonIcon from '@mui/icons-material/Person';
import { ToastContainer,toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AxiosRequest from "../../../Components/AxiosRequest";

const LoginClient = () => {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    AxiosRequest
      .post("/login-client", state)
      .then((data) => {
        console.log(data);

        if (data.data.status) {
          toast.success("Login successful");
          console.log(data.data)
          // Save token to local storage
          const id = localStorage.setItem('id', data.data.userId); // Assuming your token is received as 'token' in response
          localStorage.setItem('token', data.data.token); // Assuming your token is received as 'token' in response
          localStorage.setItem('name', data.data.name);
          localStorage.setItem('isClient', 'true');
          localStorage.removeItem('isAdmin');
          localStorage.removeItem('isOwner');

          console.log('id', id);
          console.log('token', data.data.token); // Assuming your token is received as 'token' in response
          window.location.replace("/");
        }
      })
      .catch((error) => {
       
          if (!toast.isActive("errorToast")) {
            toast.error(error.response.data.error, { toastId: "errorToast" });
          }
  });
}

  const toastStyle = {
    container: "max-w-sm mx-auto",
    toast: "bg-red-500 text-white font-bold",
  };

  return (
    <div>
      <div className="mt-40">
        <div className="containerLo">
          <div className="paperLo">
            <h3 className="mb-3 w-100"> Client Login</h3>
            <form onSubmit={handleSubmit}>
              <div>
                <input
                  type="email"
                  name="email"
                  value={state.email}
                  onChange={handleInputChange}
                  placeholder="Your Email"
                />
              </div>
              <div>
                <input
                  type="password"
                  name="password"
                  value={state.password}
                  onChange={handleInputChange}
                  placeholder="Your Password"
                />
              </div>
              <button type="submit" className="btn-g">
                Login
              </button>
              <div className="d-flex mt-5">
                <div id="account-Register">
                  Dont have an account?
                </div>
                <button className="btn-gs" onClick={() => { window.location.replace("/register-client") }}>
                  <PersonIcon /> Create an account
                </button>
              </div>
              <div className="d-flex mt-5">
                <a href="/forgot-password">Forgot Password?</a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

  );
};

export default LoginClient;
