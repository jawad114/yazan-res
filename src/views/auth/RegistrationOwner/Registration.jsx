import { useState } from "react";
import axios from "axios";
import "./Registration.css"; // Importieren der CSS-Datei für die Stildefinitionen
import RegistrationForm from "./RegistrationForm";
import registerImage from "../../../assets/register.svg";

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
    axios
      .post("https://yazan-4.onrender.com/register-client", formData)
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
          <h3>Create your account!</h3>
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
