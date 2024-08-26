import "./Login.css";
import { useState } from "react";
import PersonIcon from '@mui/icons-material/Person';
import { Typography } from "@mui/material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AxiosRequest from "../../../Components/AxiosRequest";
import { Button } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";

const LoginClient = () => {
  const navigate = useNavigate();
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
          if(error.response.data.error === "Verification code is not verified. Please verify your code first.")
          {
            toast.error(<div style={{direction:'rtl'}}>رمز التحقق غير مفعل. يرجى التحقق من رمزك أولاً</div>);
            navigate('/verify',{state:{email:state.email}});
          }
          else {
            toast.error(error.response.data.error);
          }
  });
}

  const toastStyle = {
    container: "max-w-sm mx-auto",
    toast: "bg-red-500 text-white font-bold",
  };


  return (
    <div className="flex items-center justify-center h-full w-full">
      <div className="flex flex-col  bg-white shadow-black shadow-md rounded-lg p-8 mt-[10vh] w-full max-w-md">
        <h3 className="text-2xl font-semibold text-center mb-6">تسجيل دخول المستخدمين</h3>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="form-field flex flex-col">
            <input
              className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              type="email"
              name="email"
              value={state.email}
              onChange={handleInputChange}
              style={{
                textAlign: 'start', // محاذاة النص إلى المركز
                direction: 'rtl',   // تحديد اتجاه الكتابة من اليمين لليسار
              }}
              placeholder="بريدك الإلكتروني"
              required
            />
          </div>
          <div className="form-field flex flex-col">
            <input
              className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              type="password"
              name="password"
              style={{
                textAlign: 'start', // محاذاة النص إلى المركز
                direction: 'rtl',   // تحديد اتجاه الكتابة من اليمين لليسار
              }}
              value={state.password}
              onChange={handleInputChange}
              placeholder="كلمة المرور الخاصة بك"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-300"
          >
            تسجيل الدخول
          </button>
          <div className="text-end mt-4">
            <a href="/forgot-password" className="text-blue-500 hover:underline">نسيت كلمة المرور؟</a>
          </div>
          <div className="flex items-center justify-between mt-4">
            <Button
  size="sm"
  color="green"
  className="text-white cursor-pointer hover:underline mt-2 flex items-center justify-center"
  onClick={() => window.location.replace('/register-client')}
>
  <span className="whitespace-nowrap">إنشاء حساب</span>
  <PersonIcon className="ml-2" />

</Button>
<Typography className="text-sm text-red-500">ليس لديك حساب؟</Typography>

          </div>

        </form>
      </div>
    </div>
  );
  
};

export default LoginClient;
