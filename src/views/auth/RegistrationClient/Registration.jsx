import { useState } from "react";
import axios from "axios";
import RegistrationForm from "./RegistrationForm";
import registerImage from "../../../assets/register.svg";
import AxiosRequest from "../../../Components/AxiosRequest";

const Registration = () => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    password: "",
    email: "",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = () => {
    AxiosRequest
      .post("/register-client", formData)
      .then((response) => {
        if (response.data.status === "ok") {
          alert("Registration successful");
        }
        window.location.replace('/verify');
      })
      .catch((error) => {
        console.error(error);
        alert("Registration failed");
      });
  };

  const handleFormSubmit = async (event) => {
    if (event) {
      event.preventDefault();
    }

    try {
      const emailExistsResponse = await axios.post("https://yazan-4.onrender.com/check-email-exists", { email: formData.email });
      if (emailExistsResponse.data.exists) {
        alert("This email is already registered. Please use a different email.");
      } else {
        handleSubmit();
      }
    } catch (error) {
      console.error(error);
      alert("Error checking email availability");
    }
  };

  return (
    <div className="p-5">
      <div>
        <div>
          <h3 className="mb-5">Create your account!</h3>
          <RegistrationForm
            formData={formData}
            handleInputChange={handleInputChange}
            handleSubmit={handleFormSubmit} // Pass handleFormSubmit instead of handleSubmit
          />
        </div>
      </div>
    </div>
  );
};

export default Registration;
