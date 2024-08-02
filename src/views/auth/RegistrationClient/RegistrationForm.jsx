import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Card, CardContent, TextField, Button, IconButton, InputAdornment } from "@mui/material";
import "./Registration.css";

const fields = [
  { name: "firstname", label: "First Name", type: "text" },
  { name: "lastname", label: "Last Name", type: "text" },
  { name: "email", label: "Email Address", type: "email" },
  { name: "password", label: "Password", type: "password" },
  { name: "confirmPassword", label: "Confirm Password", type: "password" },
];

const RegistrationForm = ({ formData, handleInputChange, handleSubmit }) => {
  const [showPassword, setShowPassword] = useState(false);

  // Function to check if the password is easy to guess
  const isPasswordEasy = () => {
    const passwordStrength = (formData.password);
    return passwordStrength.score < 2;
  };

  // Function to validate form fields
  const validateForm = () => {
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
  };

  // useEffect hook to reset form fields on component mount
  useEffect(() => {
    resetForm();
  }, []); // Empty dependency array to run only on mount

  return (
    <Card className="registration-card">
      <CardContent>
        <form onSubmit={handleFormSubmit}>
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
