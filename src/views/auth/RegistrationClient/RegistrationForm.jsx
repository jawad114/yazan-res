import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Card, CardContent, TextField, Button, IconButton, InputAdornment } from "@mui/material";
import "./Registration.css";
import {
  Checkbox,
  Typography
} from "@material-tailwind/react";

const fields = [
  { name: "firstname", label: "First Name", type: "text" },
  { name: "lastname", label: "Last Name", type: "text" },
  { name: "email", label: "Email Address", type: "email" },
  { name: "password", label: "Password", type: "password" },
  { name: "confirmPassword", label: "Confirm Password", type: "password" },
];

const RegistrationForm = ({ formData, handleInputChange, handleSubmit }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false); // State for checkbox


  // Function to check if the password is easy to guess
  const isPasswordEasy = () => {
    const passwordStrength = (formData.password);
    return passwordStrength.score < 2;
  };

  // Function to validate form fields
  const validateForm = () => {
    if (!isChecked) {
      alert("Please agree to the Privacy Policy before registering.");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return false;
    }
    if (isPasswordEasy()) {
      alert("Your password is easy to guess. Please choose a stronger password.");
      return false;
    }
    return true;
  };

  // Function to handle form submission
  const handleFormSubmit = (event) => {
    if (event) {
      event.preventDefault();
    }
    if (validateForm()) {
      handleSubmit();
      resetForm(); // Reset form after submission
    }
  };

  // Function to reset form fields
  const resetForm = () => {
    const emptyFormData = Object.fromEntries(Object.keys(formData).map(key => [key, ""]));
    handleInputChange({ target: { name: "", value: "" } }); // Clear controlled components
    setIsChecked(false);
  };

  // useEffect hook to reset form fields on component mount
  useEffect(() => {
    resetForm();
  }, []); // Empty dependency array to run only on mount

  return (
    <Card className="registration-card">
      <CardContent>
        <form onSubmit={handleFormSubmit} >
          {fields.map((field, index) => {
            if (field.type === "password") {
              return (
                <TextField
                  key={index}
                  className="form-input"
                  name={field.name}
                  label={field.label}
                  type={showPassword ? "text" : "password"}
                  value={formData[field.name]}
                  onChange={handleInputChange}
                  required
                  fullWidth
                  margin="normal"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)}>
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              );
            } else {
              return (
                <TextField
                  key={index}
                  className="form-input"
                  name={field.name}
                  label={field.label}
                  type={field.type}
                  value={formData[field.name]}
                  onChange={handleInputChange}
                  required
                  fullWidth
                  margin="normal"
                />
              );
            }
          })}
    <div className="flex !flex-row items-center justify-between space-x-2">
    <Checkbox
    checked={isChecked} // Bind state to Checkbox
    onChange={(e) => setIsChecked(e.target.checked)}
          label={
            <Typography
              variant="small"
              color="gray"
              className="flex items-center mt-[2vh] md:mt-[2.2vh] font-normal"
              >
              I agree to the
              <a
                href="/privacy-policy"
                className="font-medium transition-colors hover:text-gray-900"
              >
                &nbsp;Privacy Policy
              </a>
            </Typography>
          }
          containerProps={{ className: "-ml-2.5" }}
        />
        </div>
          <Button type="submit" variant="contained" className="submit-btn">
            Sign Up
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

RegistrationForm.propTypes = {
  formData: PropTypes.object.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

export default RegistrationForm;
