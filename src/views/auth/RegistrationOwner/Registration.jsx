import { useState } from "react";
import axios from "axios";
import "./Registration.css"; // Importieren der CSS-Datei für die Stildefinitionen
import RegistrationForm from "./RegistrationForm";
import registerImage from "../../../assets/register.svg";
import AxiosRequest from "../../../Components/AxiosRequest";

const RegistrationOwner = () => {
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

  const handleSubmit = (event) => {
    event.preventDefault();
    AxiosRequest
      .post("/register-client", formData)
      .then((response) => {
        if (response.data.status === "ok") {
          alert("Registration successful");
          window.location.href = "./";
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="containerReg" style={{}}>
      <div className="grid-containerReg">
        <div className="paperReg">
          <h3>قم بإنشاء حسابك الآن</h3>
          <RegistrationForm
            formData={formData}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
          />
        </div>
        <div className="image-containerReg">
          <img src={registerImage} alt="RegisterReg" className="imgReg" />
        </div>
      </div>
    </div>
  );
};

export default RegistrationOwner;
