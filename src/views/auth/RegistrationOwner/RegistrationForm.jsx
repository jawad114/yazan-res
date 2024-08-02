import PropTypes from "prop-types";

const fields = [
  { name: "firstname", label: "First Name", type: "text" },
  { name: "lastname", label: "Last Name", type: "text" },
  { name: "password", label: "Password", type: "password" },
  { name: "email", label: "Email Address", type: "email" },
];

const RegistrationForm = ({ formData, handleInputChange, handleSubmit }) => {
  return (
    <form style={{ marginTop: '30px' }} onSubmit={handleSubmit}>
      {fields.map((field, index) => (
        <input
          key={index}
          name={field.name}
          placeholder={field.label}
          type={field.type}
          value={formData[field.name]}
          onChange={handleInputChange}
        />
      ))}
      <button type="submit" className="myButtonReg">
        Sign Up
      </button>
    </form>
  );
};

RegistrationForm.propTypes = {
  formData: PropTypes.object.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

export default RegistrationForm;
