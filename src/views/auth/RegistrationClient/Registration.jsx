import { useEffect, useState } from "react";
import AxiosRequest from "../../../Components/AxiosRequest";
import RegistrationForm from "./RegistrationForm";
import registerImage from "../../../assets/register.svg";
import { Link, useNavigate } from 'react-router-dom'; // Import Link from react-router-dom for navigation
import { toast } from "react-toastify";
// import { requestFCMToken } from "../../../Firebase";



const Registration = () => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    password: "",
    email: "",
    phoneNumber:"",
    // fcmToken:null
  });
  // const [isReadyToSubmit, setIsReadyToSubmit] = useState(false);
  const navigate = useNavigate();
  // const [fcmToken, setFcmToken] = useState(null); 


  // const handleRequestToken = async () => {
  //   try {
  //     const token = await requestFCMToken();
  //     if (token) {
  //       setFormData((prevData) => ({
  //         ...prevData,
  //         fcmToken: token
  //       }));
  //       console.log('FCM Token:', token);
  //       // Optionally, send this token to your backend server for storage
  //     }
  //   } catch (error) {
  //     console.error('Error requesting FCM token:', error);
  //   }
  // };

  // const handleInputChange = (event) => {
  //   const { name, value } = event.target;
  //   setFormData({
  //     ...formData,
  //     [name]: value,
  //   });
  // };


  // const handleSubmit = () => {
  //   AxiosRequest
  //     .post("/register-client", formData)
  //     .then((response) => {
  //       if (response.data.status === "ok") {
  //         alert("Registration successful");
  //         // toast.info(<div style={{direction:'rtl'}}>قد تم ارسال رمز الى بريدك الإلكتروني إذا لم يصلك رمز التحقق، يرجى الانتظار لمدة 1 إلى 2 دقيقة حتى يصل إلى بريدك الإلكتروني تأكد من فحص صندوق الوارد</div>,{autoClose:7000});
  //       }
  //       // navigate('/login-client')
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //       alert("Registration failed");
  //     });
  // };

  // const handleFormSubmit = async (event) => {
    // if (event) {
    //   event.preventDefault();
    // }

  //   try {
  //     await handleRequestToken();
  //     const emailExistsResponse = await AxiosRequest.post("/check-email-exists", { email: formData.email });
  //     if (emailExistsResponse.data.exists) {
  //       alert("This email is already registered. Please use a different email.");
  //     } else {
  //       handleSubmit();
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     alert("Error checking email availability");
  //   }
  // };

  // const handleRequestToken = async () => {
  //   try {
  //     const token = await requestFCMToken();
  //     if (token) {
  //       setFcmToken(token); // Set the FCM token in separate state
  //       console.log('FCM Token:', token);
  //     }
  //   } catch (error) {
  //     console.error('Error requesting FCM token:', error);
  //   }
  // };

  // useEffect(() => {
  //   if (fcmToken) {
  //     setFormData((prevData) => ({
  //       ...prevData,
  //       fcmToken: fcmToken,
  //     }));
  //   }

  //   // Check if ready to submit after fcmToken is set
  //   if (isReadyToSubmit && fcmToken) {
  //     handleSubmit(); // Call handleSubmit when conditions are met
  //   }
  // }, [fcmToken, isReadyToSubmit]); 

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await AxiosRequest.post("/register-client", formData);
      if (response.data.status === "ok") {
        alert("Registration successful");
        navigate('/login-client');
      }
    } catch (error) {
      console.error(error);
      alert("Registration failed");
    }
  };

  const handleFormSubmit = async (event) => {
    if (event) {
      event.preventDefault();
    }

    try {
      // Ensure the FCM token request completes before proceeding
      // await handleRequestToken();

      // Check if the email already exists in the backend
      const emailExistsResponse = await AxiosRequest.post("/check-email-exists", { email: formData.email });

      if (emailExistsResponse.data.exists) {
        alert("This email is already registered. Please use a different email.");
      } else {
        // setIsReadyToSubmit(true);
        await handleSubmit();
      }
    } catch (error) {
      console.error(error);
      alert("Error checking email availability");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="max-w-lg w-full bg-white rounded-lg shadow-lg p-8">
        <div className="flex flex-col items-center mb-6">
          <img src={registerImage} alt="Register" className="h-24 mb-4" />
          <h3 className="text-2xl font-semibold mb-4">! قم بإنشاء حسابك الآن بشكل مجاني</h3>
        </div>
        <RegistrationForm
          formData={formData}
          handleInputChange={handleInputChange}
          handleSubmit={handleFormSubmit} // Pass handleFormSubmit instead of handleSubmit
        />
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
          يوجد لدي حساب{' '}
            <Link to="/login-client" className="text-blue-500 hover:underline">
            تسجيل الدخول
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Registration;
