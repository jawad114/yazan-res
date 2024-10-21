// import React, { useState, useRef, useEffect } from "react";
// import { Typography, Box, TextField, Button, Dialog, DialogContent, DialogTitle } from "@mui/material";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import AxiosRequest from "../../Components/AxiosRequest";
// import { useNavigate } from 'react-router-dom';
// import MapModal from "../checkout/Map/MapModal"; // Adjust the path based on your file structure

// const AdminDashboard = () => {
//   const [restaurantName, setRestaurantName] = useState("");
//   const [picture, setPicture] = useState(null);
//   const [coordinates, setCoordinates] = useState({ lat: 31.7683, lng: 35.2137,address:'' });
//   const [location, setLocation] = useState("");
//   const [locationChanged, setLocationChanged] = useState(false);
//   const [isMapOpen, setIsMapOpen] = useState(false);
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


//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if(!locationChanged){
//       toast.error("Please select a location on map");
//       return;
//     }
//     if (!picture) {
//       toast.error("Please select an image for the restaurant");
//       return;
//     }
//     const formData = new FormData();
//     formData.append("restaurantName", restaurantName);
//     formData.append("picture", picture);
//     formData.append("location", location); // Save location as JSON string
//     formData.append("coordinates", JSON.stringify(coordinates)); // Save location as JSON string
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

//   const handleGoToRestaurantArea = () => {
//     window.location.replace("/");
//   };

//   const handleOpenMap = () => {
//     setIsMapOpen(true);
//   };

//   const handleCloseMap = () => {
//     setIsMapOpen(false);
//   };

//   const handleConfirmLocation = (selectedLocation) => {
//     setCoordinates(selectedLocation); // Update location state with selected location
//     setLocationChanged(true); // Update locationChanged state to indicate that the location has been changed
//     setIsMapOpen(false);
//   };

//   return (
//     <div className="bg-white">
//     <Box className="flex flex-col items-center justify-center mt-8 mb-4">
//       <ToastContainer/>
//     <Typography variant="h4" component="h1" gutterBottom>
//       Add Restaurant
//     </Typography>
//     <form ref={formRef} className="w-full max-w-md bg-white" onSubmit={handleSubmit}>
//       <TextField
//         placeholder="Restaurant Name"
//         type="text"
//         fullWidth
//         value={restaurantName}
//         onChange={(e) => setRestaurantName(e.target.value)}
//         className="mb-4"
//       />
//               <TextField
//           placeholder="Location"
//           type="text"
//           value={location}
//           fullWidth
//           onChange={(e) => setLocation(e.target.value)}
//           className="mb-4"
//           />
//       <TextField
//         accept="image/*"
//         type="file"
//         fullWidth
//         onChange={(e) => setPicture(e.target.files[0])}
//         className="mb-4"
//       />
//       {generatedEmail && generatedPassword && (
//         <Box className="mb-4">
//           <Typography variant="body1">
//             Your credentials for the Delivery Website:
//           </Typography>
//           <Typography variant="body2">
//             Generated Email: {generatedEmail}
//           </Typography>
//           <Typography variant="body2">
//             Generated Password: {generatedPassword}
//           </Typography>
//         </Box>
//       )}
//       <div className="flex flex-col items-center justify-center gap-2">
//       <Button
//         variant="contained"
//         color="primary"
//         onClick={handleOpenMap}
//         className="mb-4"
//       >
//         Select Location on Map
//       </Button>
//       <Button
//         variant="contained"
//         color="primary"
//         type="submit"
//         className="mb-4"
//       >
//         Submit
//       </Button>
//       </div>
//     </form>
//     <MapModal
//       open={isMapOpen}
//       onClose={handleCloseMap}
//       location={coordinates}
//       onConfirm={handleConfirmLocation}
//     />
//     <Button
//       variant="contained"
//       color="primary"
//       onClick={handleGoToRestaurantArea}
//       className="mt-4"
//     >
//       Go to Restaurant Area
//     </Button>
//   </Box>
//   </div>
//   );
// };

// export default AdminDashboard;


import React, { useState, useRef, useEffect } from "react";
import { Typography, Card, CardContent, TextField, Button, CardActions } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AxiosRequest from "../../Components/AxiosRequest";
import { useNavigate } from 'react-router-dom';
import MapModal from "../checkout/Map/MapModal"; // Adjust the path based on your file structure

const AdminDashboard = () => {
  const [restaurantName, setRestaurantName] = useState("");
  const [picture, setPicture] = useState(null);
  const [coordinates, setCoordinates] = useState({ lat: 31.7683, lng: 35.2137, address: '' });
  const [location, setLocation] = useState("");
  const [locationChanged, setLocationChanged] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const navigate = useNavigate();
  const [menu, setMenu] = useState([
    {
      categoryName: "",
      dishes: [{ name: "", price: "", dishImage: "", description: "", requiredExtras: [{ name: "", price: "" }], optionalExtras: [{ name: "", price: "" }] }],
    },
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!restaurantName){
     toast.error('Please enter a name for the marketplace');
     return;
    }
    if(!location){
    toast.error('Please enter a location for the marketplace')
    return;
    }
    if (!locationChanged) {
      toast.error("Please select a location on map");
      return;
    }
    if (!picture) {
      toast.error("Please select an image for the marketplace");
      return;
    }
    const formData = new FormData();
    formData.append("restaurantName", restaurantName);
    formData.append("picture", picture);
    formData.append("location", location);
    formData.append("coordinates", JSON.stringify(coordinates));
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
      setRestaurantName('');
      setLocation('');
      setPicture(null);
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
    setCoordinates(selectedLocation);
    setLocationChanged(true);
    setIsMapOpen(false);
  };

  return (
    <div className="bg-white">
    <div className="flex justify-center items-center min-h-screen">
      <Card className="max-w-md w-full p-4 mt-4" sx={{
    boxShadow: 6, 
    borderRadius: 2, 
    margin: 'auto', 
  }}>
        <ToastContainer />
        <CardContent>
          <Typography variant="h4" component="h1" className="text-center font-semibold mb-4 text-gray-800">
            Add Market Place
          </Typography>
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
            <TextField
              label="Market Place Name"
              type="text"
              fullWidth
              variant="outlined"
              value={restaurantName}
              onChange={(e) => setRestaurantName(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-input:focus': {
                  outline: 'none', // Removes the focus ring
                  boxShadow: 'none',
                },
              }}
            />
            <TextField
              label="Location"
              type="text"
              fullWidth
              variant="outlined"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-input:focus': {
                  outline: 'none', // Removes the focus ring
                  boxShadow: 'none',
                },
              }}
            />
            <TextField
              accept="image/*"
              type="file"
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              onChange={(e) => setPicture(e.target.files[0])}
              sx={{
                '& .MuiOutlinedInput-input:focus': {
                  outline: 'none', // Removes the focus ring
                  boxShadow: 'none',
                },
              }}
            />
            {generatedEmail && generatedPassword && (
              <div className="p-4 bg-gray-50 rounded-md border border-gray-200">
                <Typography variant="body1" className="font-medium text-black mb-2">
                  Generated credentials for the Market Place:
                </Typography>
                <Typography variant="body2" className="text-black">Generated Email: {generatedEmail}</Typography>
                <Typography variant="body2" className="text-black">Generated Password: {generatedPassword}</Typography>
              </div>
            )}
            <CardActions className="flex flex-col justify-center gap-4">
              <Button variant="contained" color="primary" onClick={handleOpenMap} style={{ minWidth: '150px' }}>
                Select Location on Map
              </Button>
              <Button variant="contained" color="success" type="submit" style={{ minWidth: '150px' }}>
                Submit
              </Button>
            </CardActions>
          </form>
        </CardContent>
        <CardActions className="flex justify-center">
          <Button variant="contained" color="secondary" onClick={handleGoToRestaurantArea} style={{ minWidth: '150px' }}>
            Go to MarketPlace Area
          </Button>
        </CardActions>
      </Card>
      <MapModal open={isMapOpen} onClose={handleCloseMap} location={coordinates} onConfirm={handleConfirmLocation} />
    </div>
    </div>
  );
};

export default AdminDashboard;
