import React, { useState } from 'react';
import './adminLogin.css'; // Import the CSS file
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AxiosRequest from '../../Components/AxiosRequest';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Check if email and password are provided
    if (!email || !password) {
      toast.error('Please provide both email and password');
      return;
    }

    try {
      const response = await AxiosRequest.post('/admin/login', { email, password });
      if (response.data.status === 'ok') {
        toast.success('Login successful');
        localStorage.setItem('isAdmin', 'true');
        localStorage.setItem('token', response.data.token);
      console.log('Token',response.data.token)
        localStorage.removeItem('isOwner');
        localStorage.removeItem('isClient');
        window.location.replace('/admin-dashboard');
      }
    } 
      catch (error) {
        if (!toast.isActive("errorToast")) {
          toast.error(error.response.data.error, { toastId: "errorToast" });
        }
  
      }
  };

  const toastStyle = {
    container: "max-w-sm mx-auto",
    toast: "bg-red-500 text-white font-bold",
  };

//   return (
//     <div className="flex items-start justify-center h-full w-full">
//       <div className="flex flex-col bg-[#fff] border-1 w-[70vw] p-20 border-[#ccc]">
//         <h2 className="form-title">Admin Login</h2>
//         <form onSubmit={handleSubmit}>
//           <div className="form-field">
//             <label>Email:</label>
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//             />
//           </div>
//           <div className="form-field">
//             <label>Password:</label>
//             <input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//             />
//           </div>
//           <button type="submit" className="submit-button">Login</button>
//         </form>
//       </div>
//     </div>
//   );
// };
return (
  <div className="flex items-center justify-center h-screen w-full bg-gray-100">
    <div className="flex flex-col bg-white shadow-md rounded-lg p-8 w-full max-w-md">
      <h2 className="text-2xl font-semibold text-center mb-6">Admin Login</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="form-field flex flex-col">
          <label className="mb-2 text-sm font-medium">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>
        <div className="form-field flex flex-col">
          <label className="mb-2 text-sm font-medium">Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-300"
        >
          Login
        </button>
      </form>
    </div>
  </div>
);
}
export default AdminLogin;
