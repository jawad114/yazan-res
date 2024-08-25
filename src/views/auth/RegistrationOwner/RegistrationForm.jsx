import PropTypes from "prop-types";

const fields = [
  { name: "firstname", label: "الاسم", type: "text" },
  { name: "lastname", label: "اسم العائلة", type: "text" },
  { name: "password", label: "انشاء كلمة مرور", type: "password" },
  { name: "email", label: "يرجى إدخال عنوان بريد إلكتروني صحيح", type: "email" },
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
      اضعط للتسجيل
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
