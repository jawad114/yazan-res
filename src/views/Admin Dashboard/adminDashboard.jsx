// import React, { useState, useRef,useEffect } from "react";
// import axios from "axios";
// import { Typography, Box, TextField, Button } from "@mui/material";
// import "./AdminDashboard.css"; // Import the CSS file
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import AxiosRequest from "../../Components/AxiosRequest";
// import { useNavigate } from 'react-router-dom';


// const AdminDashboard = () => {
//   const [restaurantName, setRestaurantName] = useState("");
//   const [picture, setPicture] = useState("");
//   const [location, setLocation] = useState("");
//   const navigate = useNavigate();
//   const [menu, setMenu] = useState([
//     { categoryName: "", dishes: [{ name: "", price: "", dishImage: "", description: "", requiredExtras: [{ name: "", price: "" }], optionalExtras: [{ name: "", price: "" }] }] },
//   ]);
//   const [generatedEmail, setGeneratedEmail] = useState("");
//   const [generatedPassword, setGeneratedPassword] = useState("");
//   const formRef = useRef(null);

//   const isAdmin = localStorage.getItem('isAdmin') === 'true';

//   useEffect(() => {
//     if (!isAdmin) {
//         navigate('/forbidden'); // Replace with your target route
//     }
// }, [isAdmin, navigate]);

//   const handleAddCategory = () => {
//     setMenu([
//       ...menu,
//       { categoryName: "", dishes: [{ name: "", price: "", dishImage: "", description: "", requiredExtras: [{ name: "", price: "" }], optionalExtras: [{ name: "", price: "" }] }] },
//     ]);
//   };

//   const handleAddDish = (index) => {
//     const updatedMenu = [...menu];
//     updatedMenu[index].dishes.push({
//       name: "",
//       price: "",
//       dishImage: "",
//       description: "",
//       requiredExtras: [{ name: "", price: "" }],
//       optionalExtras: [{ name: "", price: "" }]
//     });
//     setMenu(updatedMenu);
//   };

//   const handleInputChange = async (categoryIndex, dishIndex, extraType, extraIndex, e) => {
//     if (e && e.target) {
//       const { name, value, files } = e.target;
//       const updatedMenu = [...menu];
//       if (extraType === "requiredExtras" || extraType === "optionalExtras") {
//         updatedMenu[categoryIndex].dishes[dishIndex][extraType][extraIndex][name] = value;
//       } else if (name === "categoryName") {
//         updatedMenu[categoryIndex].categoryName = value;
//       } else if (name === "dishImage" && files.length > 0) {
//         const resizedImage = await resizeImage(files[0], 400, 400);
//         const base64String = await convertToBase64(resizedImage);
//         updatedMenu[categoryIndex].dishes[dishIndex].dishImage = base64String;
//         setMenu(updatedMenu);
//       } else {
//         updatedMenu[categoryIndex].dishes[dishIndex][name] = value;
//       }
//       setMenu(updatedMenu);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!picture) {
//       toast.error("Please select an image for the restaurant");
//       return;
//     }
//     const body = {
//       restaurantName,
//       picture,
//       location,
//     };
//     try {
//       const response = await AxiosRequest.post("/add-restaurant", body);
//       const { generatedEmail, generatedPassword } = response.data;
//       setGeneratedEmail(generatedEmail);
//       setGeneratedPassword(generatedPassword);
//       toast.success("Restaurant added successfully");
//     } catch (error) {
//       if (!toast.isActive("errorToast")) {
//         toast.error(error.response.data.error, { toastId: "errorToast" });
//       }
//     }
//   };

//   const handleGoToRestaurantArea = () => {
//     window.location.replace("/");
//   };

//   const convertToBase64 = (file) => {
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.readAsDataURL(file);
//       reader.onload = () => resolve(reader.result);
//       reader.onerror = (error) => reject(error);
//     });
//   };

//   const resizeImage = (file, maxWidth, maxHeight) => {
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.readAsDataURL(file);
//       reader.onload = (event) => {
//         const img = new Image();
//         img.src = event.target.result;
//         img.onload = () => {
//           const canvas = document.createElement('canvas');
//           const ctx = canvas.getContext('2d');
//           const scaleFactor = Math.min(maxWidth / img.width, maxHeight / img.height);
//           canvas.width = img.width * scaleFactor;
//           canvas.height = img.height * scaleFactor;
//           ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
//           canvas.toBlob((blob) => {
//             resolve(new File([blob], file.name, { type: 'image/jpeg' }));
//           }, 'image/jpeg');
//         };
//       };
//       reader.onerror = (error) => reject(error);
//     });
//   };

//   const toastStyle = {
//     container: "max-w-sm mx-auto",
//     toast: "bg-red-500 text-white font-bold",
//   };

//   return (
//     <Box className="flex flex-col items-center justify-center mt-4">
//       <Typography variant="h4" component="h1" gutterBottom>
//         Add Restaurant
//       </Typography>
//       <form ref={formRef} className="form">
//         <TextField
//           className="form-field"
//           placeholder="Restaurant Name:"
//           type="text"
//           value={restaurantName}
//           onChange={(e) => setRestaurantName(e.target.value)}
//         />
//         <TextField
//           accept="image/*"
//           type="file"
//           onChange={(e) => convertToBase64(e.target.files[0]).then((res) => setPicture(res))}
//           className="form-field"
//         />
//         {picture && (
//           <div className="restaurant-image-preview">
//             <img
//               src={picture}
//               alt="restaurant"
//             />
//           </div>
//         )}
//         <TextField
//           placeholder="Location"
//           type="text"
//           value={location}
//           onChange={(e) => setLocation(e.target.value)}
//           className="form-field"
//         />
//         {generatedEmail && generatedPassword && (
//           <div>
//             <p>Your credentials for Deliver Website</p><br/>
//             <p>Generated Email: {generatedEmail}</p>
//             <p>Generated Password: {generatedPassword}</p>
//           </div>
//         )}
//         <Button
//           className="mt-4 mb-4 bg-[#007bff]"
//           variant="contained"
//           onClick={handleSubmit}
//         >
//           Submit
//         </Button>
//       </form>

//       <Button
//         className="mt-4 mb-4"
//         variant="contained"
//         onClick={handleGoToRestaurantArea}
//       >
//         GO TO RESTAURANT AREA
//       </Button>
//     </Box>
//   );
// };

// export default AdminDashboard;


import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Typography, Box, TextField, Button } from "@mui/material";
import "./AdminDashboard.css"; // Import the CSS file
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AxiosRequest from "../../Components/AxiosRequest";
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [restaurantName, setRestaurantName] = useState("");
  const [picture, setPicture] = useState(null);
  const [location, setLocation] = useState("");
  const navigate = useNavigate();
  const [menu, setMenu] = useState([
    { categoryName: "", dishes: [{ name: "", price: "", dishImage: "", description: "", requiredExtras: [{ name: "", price: "" }], optionalExtras: [{ name: "", price: "" }] }] },
  ]);
  const [generatedEmail, setGeneratedEmail] = useState("");
  const [generatedPassword, setGeneratedPassword] = useState("");
  const formRef = useRef(null);

  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  useEffect(() => {
    if (!isAdmin) {
        navigate('/forbidden'); // Replace with your target route
    }
  }, [isAdmin, navigate]);

  const handleAddCategory = () => {
    setMenu([
      ...menu,
      { categoryName: "", dishes: [{ name: "", price: "", dishImage: "", description: "", requiredExtras: [{ name: "", price: "" }], optionalExtras: [{ name: "", price: "" }] }] },
    ]);
  };

  const handleAddDish = (index) => {
    const updatedMenu = [...menu];
    updatedMenu[index].dishes.push({
      name: "",
      price: "",
      dishImage: "",
      description: "",
      requiredExtras: [{ name: "", price: "" }],
      optionalExtras: [{ name: "", price: "" }]
    });
    setMenu(updatedMenu);
  };

  const handleInputChange = (categoryIndex, dishIndex, extraType, extraIndex, e) => {
    if (e && e.target) {
      const { name, value, files } = e.target;
      const updatedMenu = [...menu];
      if (extraType === "requiredExtras" || extraType === "optionalExtras") {
        updatedMenu[categoryIndex].dishes[dishIndex][extraType][extraIndex][name] = value;
      } else if (name === "categoryName") {
        updatedMenu[categoryIndex].categoryName = value;
      } else if (name === "dishImage" && files.length > 0) {
        updatedMenu[categoryIndex].dishes[dishIndex].dishImage = files[0];
      } else {
        updatedMenu[categoryIndex].dishes[dishIndex][name] = value;
      }
      setMenu(updatedMenu);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!picture) {
      toast.error("Please select an image for the restaurant");
      return;
    }
    const formData = new FormData();
    formData.append("restaurantName", restaurantName);
    formData.append("picture", picture);
    formData.append("location", location);
    formData.append("menu", JSON.stringify(menu));

    try {
      const response = await AxiosRequest.post("/add-restaurant", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      const { generatedEmail, generatedPassword } = response.data;
      setGeneratedEmail(generatedEmail);
      setGeneratedPassword(generatedPassword);
      toast.success("Restaurant added successfully");
    } catch (error) {
      if (!toast.isActive("errorToast")) {
        toast.error(error.response.data.error, { toastId: "errorToast" });
      }
    }
  };

  const handleGoToRestaurantArea = () => {
    window.location.replace("/");
  };

  const toastStyle = {
    container: "max-w-sm mx-auto",
    toast: "bg-red-500 text-white font-bold",
  };

  return (
    <Box className="flex flex-col items-center justify-center mt-4">
      <Typography variant="h4" component="h1" gutterBottom>
        Add Restaurant
      </Typography>
      <form ref={formRef} className="form" onSubmit={handleSubmit}>
        <TextField
          className="form-field"
          placeholder="Restaurant Name:"
          type="text"
          value={restaurantName}
          onChange={(e) => setRestaurantName(e.target.value)}
        />
        <TextField
          accept="image/*"
          type="file"
          onChange={(e) => setPicture(e.target.files[0])}
          className="form-field"
        />
        {picture && (
          <div className="restaurant-image-preview">
            <img
              src={URL.createObjectURL(picture)}
              alt="restaurant"
            />
          </div>
        )}
        <TextField
          placeholder="Location"
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="form-field"
        />
        {generatedEmail && generatedPassword && (
          <div>
            <p>Your credentials for Deliver Website</p><br/>
            <p>Generated Email: {generatedEmail}</p>
            <p>Generated Password: {generatedPassword}</p>
          </div>
        )}
        <Button
          className="mt-4 mb-4 bg-[#007bff]"
          variant="contained"
          type="submit"
        >
          Submit
        </Button>
      </form>

      <Button
        className="mt-4 mb-4"
        variant="contained"
        onClick={handleGoToRestaurantArea}
      >
        GO TO RESTAURANT AREA
      </Button>
    </Box>
  );
};

export default AdminDashboard;

