// import React, { useState, useRef, useEffect } from "react";
// import { Typography, Box, TextField, Button } from "@mui/material";
// import "./AdminDashboard.css"; // Import the CSS file
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import AxiosRequest from "../../Components/AxiosRequest";
// import { useNavigate } from 'react-router-dom';

// const AdminDashboard = () => {
//   const [restaurantName, setRestaurantName] = useState("");
//   const [picture, setPicture] = useState(null);
  // const [location, setLocation] = useState("");
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
//   }, [isAdmin, navigate]);

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

//   const handleInputChange = (categoryIndex, dishIndex, extraType, extraIndex, e) => {
//     if (e && e.target) {
//       const { name, value, files } = e.target;
//       const updatedMenu = [...menu];
//       if (extraType === "requiredExtras" || extraType === "optionalExtras") {
//         updatedMenu[categoryIndex].dishes[dishIndex][extraType][extraIndex][name] = value;
//       } else if (name === "categoryName") {
//         updatedMenu[categoryIndex].categoryName = value;
//       } else if (name === "dishImage" && files.length > 0) {
//         updatedMenu[categoryIndex].dishes[dishIndex].dishImage = files[0];
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
//     const formData = new FormData();
//     formData.append("restaurantName", restaurantName);
//     formData.append("picture", picture);
//     formData.append("location", location);
//     formData.append("menu", JSON.stringify(menu));

//     try {
//       const response = await AxiosRequest.post("/add-restaurant", formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data'
//         }
//       });
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

  // const handleGoToRestaurantArea = () => {
  //   window.location.replace("/");
  // };

//   const toastStyle = {
//     container: "max-w-sm mx-auto",
//     toast: "bg-red-500 text-white font-bold",
//   };

//   return (
    // <Box className="flex flex-col items-center justify-center mt-4">
    //   <Typography variant="h4" component="h1" gutterBottom>
    //     Add Restaurant
    //   </Typography>
    //   <form ref={formRef} className="form" onSubmit={handleSubmit}>
    //     <TextField
    //       className="form-field"
    //       placeholder="Restaurant Name:"
    //       type="text"
    //       value={restaurantName}
    //       onChange={(e) => setRestaurantName(e.target.value)}
    //     />
    //     <TextField
    //       accept="image/*"
    //       type="file"
    //       onChange={(e) => setPicture(e.target.files[0])}
    //       className="form-field"
    //     />
    //     {picture && (
    //       <div className="restaurant-image-preview">
    //         <img
    //           src={URL.createObjectURL(picture)}
    //           alt="restaurant"
    //         />
    //       </div>
    //     )}
        // <TextField
        //   placeholder="Location"
        //   type="text"
        //   value={location}
        //   onChange={(e) => setLocation(e.target.value)}
        //   className="form-field"
        // />
    //     {generatedEmail && generatedPassword && (
    //       <div>
    //         <p>Your credentials for Deliver Website</p><br/>
    //         <p>Generated Email: {generatedEmail}</p>
    //         <p>Generated Password: {generatedPassword}</p>
    //       </div>
    //     )}
    //     <Button
    //       className="mt-4 mb-4 bg-[#007bff]"
    //       variant="contained"
    //       type="submit"
    //     >
    //       Submit
    //     </Button>
    //   </form>

    //   <Button
    //     className="mt-4 mb-4"
    //     variant="contained"
    //     onClick={handleGoToRestaurantArea}
    //   >
    //     GO TO RESTAURANT AREA
    //   </Button>
    // </Box>
//   );
// };

// export default AdminDashboard;


import React, { useState, useRef, useEffect } from "react";
import { Typography, Box, TextField, Button, Dialog, DialogContent, DialogTitle } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AxiosRequest from "../../Components/AxiosRequest";
import { useNavigate } from 'react-router-dom';
import MapModal from "../checkout/Map/MapModal"; // Adjust the path based on your file structure

const AdminDashboard = () => {
  const [restaurantName, setRestaurantName] = useState("");
  const [picture, setPicture] = useState(null);
  const [coordinates, setCoordinates] = useState({ lat: 31.7683, lng: 35.2137,address:'' });
  const [location, setLocation] = useState("");
  const [locationChanged, setLocationChanged] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
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
    if(!locationChanged){
      toast.error("Please select a location on map");
      return;
    }
    if (!picture) {
      toast.error("Please select an image for the restaurant");
      return;
    }
    const formData = new FormData();
    formData.append("restaurantName", restaurantName);
    formData.append("picture", picture);
    formData.append("location", location); // Save location as JSON string
    formData.append("coordinates", JSON.stringify(coordinates)); // Save location as JSON string
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

  const handleOpenMap = () => {
    setIsMapOpen(true);
  };

  const handleCloseMap = () => {
    setIsMapOpen(false);
  };

  const handleConfirmLocation = (selectedLocation) => {
    setCoordinates(selectedLocation); // Update location state with selected location
    setLocationChanged(true); // Update locationChanged state to indicate that the location has been changed
    setIsMapOpen(false);
  };

  return (
    // <Box className="flex flex-col items-center justify-center mt-4">
    //   <Typography variant="h4" component="h1" gutterBottom>
    //     Add Restaurant
    //   </Typography>
    //   <form ref={formRef} className="form" onSubmit={handleSubmit}>
    //     <TextField
    //       className="form-field"
    //       placeholder="Restaurant Name:"
    //       type="text"
    //       value={restaurantName}
    //       onChange={(e) => setRestaurantName(e.target.value)}
    //     />
    //     <TextField
    //       accept="image/*"
    //       type="file"
    //       onChange={(e) => setPicture(e.target.files[0])}
    //       className="form-field"
    //     />
    //     <TextField
    //       className="form-field"
    //       placeholder="Location"
    //       type="text"
    //       value={location.address}
    //       onClick={handleOpenMap} // Open the map modal on click
    //       readOnly
    //     />
        // <Button variant="contained" color="primary" onClick={handleOpenMap}>
        //   Select Location on Map
        // </Button>
    //     <Button type="submit" variant="contained" color="primary">
    //       Add Restaurant
    //     </Button>
    //   </form>
    //   <ToastContainer />
    // </Box>
    <div className="bg-white">
    <Box className="flex flex-col items-center justify-center mt-8 mb-4">
      <ToastContainer/>
    <Typography variant="h4" component="h1" gutterBottom>
      Add Restaurant
    </Typography>
    <form ref={formRef} className="w-full max-w-md bg-white" onSubmit={handleSubmit}>
      <TextField
        placeholder="Restaurant Name"
        type="text"
        fullWidth
        value={restaurantName}
        onChange={(e) => setRestaurantName(e.target.value)}
        className="mb-4"
      />
              <TextField
          placeholder="Location"
          type="text"
          value={location}
          fullWidth
          onChange={(e) => setLocation(e.target.value)}
          className="mb-4"
          />
      <TextField
        accept="image/*"
        type="file"
        fullWidth
        onChange={(e) => setPicture(e.target.files[0])}
        className="mb-4"
      />
      {/* {picture && (
        <Box className="flex justify-center mb-4">
          <img
            src={URL.createObjectURL(picture)}
            alt="restaurant"
            className="max-w-xs rounded-lg"
          />
        </Box>
      )} */}
      {generatedEmail && generatedPassword && (
        <Box className="mb-4">
          <Typography variant="body1">
            Your credentials for the Delivery Website:
          </Typography>
          <Typography variant="body2">
            Generated Email: {generatedEmail}
          </Typography>
          <Typography variant="body2">
            Generated Password: {generatedPassword}
          </Typography>
        </Box>
      )}
      <div className="flex flex-col items-center justify-center gap-2">
      <Button
        variant="contained"
        color="primary"
        onClick={handleOpenMap}
        className="mb-4"
      >
        Select Location on Map
      </Button>
      <Button
        variant="contained"
        color="primary"
        type="submit"
        className="mb-4"
      >
        Submit
      </Button>
      </div>
    </form>
    <MapModal
      open={isMapOpen}
      onClose={handleCloseMap}
      location={coordinates}
      onConfirm={handleConfirmLocation}
    />
    <Button
      variant="contained"
      color="primary"
      onClick={handleGoToRestaurantArea}
      className="mt-4"
    >
      Go to Restaurant Area
    </Button>
  </Box>
  </div>
  );
};

export default AdminDashboard;

