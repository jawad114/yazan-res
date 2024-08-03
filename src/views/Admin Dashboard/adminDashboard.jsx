// import React, { useState, useRef } from "react";
// import axios from "axios";
// import { Typography, Box, TextField, Button } from "@mui/material";
// import "./AdminDashboard.css"; // Import the CSS file
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";


// const AdminDashboard = () => {
//   const [restaurantName, setRestaurantName] = useState("");
//   const [picture, setPicture] = useState("");
//   const [location, setLocation] = useState("");
//   const [menu, setMenu] = useState([
//     { categoryName: "", dishes: [{ name: "", price: "", dishImage: "", description: "", requiredExtras: [{ name: "", price: "" }], optionalExtras: [{ name: "", price: "" }] }] },
//   ]);
//   const [generatedEmail, setGeneratedEmail] = useState("");
//   const [generatedPassword, setGeneratedPassword] = useState("");
//   const [message, setMessage] = useState("");
//   const formRef = useRef(null);

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
//         const reader = new FileReader();
//         reader.readAsDataURL(files[0]);
//         reader.onload = () => {
//           updatedMenu[categoryIndex].dishes[dishIndex].dishImage = reader.result;
//           setMenu(updatedMenu);
//         };
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
//       menu,
//     };
//     try {
//       const response = await axios.post("https://yazan-4.onrender.com/add-restaurant", body);
//       const { generatedEmail, generatedPassword } = response.data;
//       setGeneratedEmail(generatedEmail);
//       setGeneratedPassword(generatedPassword);
//       setMessage(`Your credentials for Deliver Website ${generatedEmail}, ${generatedPassword}`);
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

//   const convertToBase64 = (e) => {
//     const reader = new FileReader();
//     reader.readAsDataURL(e.target.files[0]);
//     reader.onload = () => {
//       setPicture(reader.result);
//     };
//     reader.onerror = (error) => {
//       console.log("error", error);
//     };
//   };

//   const toastStyle = {
//     container: "max-w-sm mx-auto",
//     toast: "bg-red-500 text-white font-bold",
//   };

//   return (
//     <Box className="container flex flex-col mt-4">
//         <ToastContainer
//         position="top-right"
//         autoClose={5000}
//         hideProgressBar={false}
//         newestOnTop={false}
//         closeOnClick
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//         style={toastStyle}
//       />
//       <Typography variant="h4" component="h1" gutterBottom>
//         Add Restaurant
//       </Typography>
//       <form ref={formRef} className="form" onSubmit={handleSubmit}>
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
//           onChange={convertToBase64}
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
//         {menu && menu.map((category, index) => (
//           <div
//             key={index}
//             className="category-container"
//           >
//             <TextField
//               key={index}
//               placeholder="Category Name:"
//               type="text"
//               name="categoryName"
//               value={category.categoryName}
//               onChange={(e) => handleInputChange(index, null, null, null, e)}
//               className="form-field"
//             />
//             <Button
//               className="add-dish-btn"
//               variant="contained"
//               onClick={() => handleAddDish(index)}
//             >
//               Add Dish
//             </Button>
//             {category.dishes.map((dish, dishIndex) => (
//               <div
//                 key={dishIndex}
//                 className="dish-container"
//               >
//                 <TextField
//                   placeholder="Dish Name:"
//                   type="text"
//                   value={dish.name}
//                   name="name"
//                   onChange={(e) => handleInputChange(index, dishIndex, null, null, e)}
//                   className="form-field"
//                 />
//                 <TextField
//                   placeholder="Price:"
//                   type="text"
//                   value={dish.price}
//                   name="price"
//                   onChange={(e) => handleInputChange(index, dishIndex, null, null, e)}
//                   className="form-field"
//                 />
//                 <TextField
//                   type="file"
//                   name="dishImage"
//                   onChange={(e) => handleInputChange(index, dishIndex, null, null, e)}
//                   className="form-field"
//                 />
//                 {dish.dishImage && (
//                   <div className="image-preview">
//                     <img
//                       src={dish.dishImage}
//                       alt="dish"
//                     />
//                   </div>
//                 )}
//                 <TextField
//                   placeholder="Dish Description:"
//                   type="text"
//                   value={dish.description}
//                   name="description"
//                   onChange={(e) => handleInputChange(index, dishIndex, null, null, e)}
//                   className="form-field"
//                 />
//                 {dish.requiredExtras.map((extra, extraIndex) => (
//                   <div key={extraIndex} className="extras-container">
//                     <TextField
//                       placeholder="Required Extra Name"
//                       type="text"
//                       value={extra.name}
//                       name="name"
//                       onChange={(e) => handleInputChange(index, dishIndex, "requiredExtras", extraIndex, e)}
//                       className="form-field"
//                     />
//                     <TextField
//                       placeholder="Required Extra Price"
//                       type="text"
//                       value={extra.price}
//                       name="price"
//                       onChange={(e) => handleInputChange(index, dishIndex, "requiredExtras", extraIndex, e)}
//                       className="form-field"
//                     />
//                   </div>
//                 ))}
//                 <Button
//                   className="add-extra-btn"
//                   variant="contained"
//                   onClick={() => {
//                     const updatedMenu = [...menu];
//                     updatedMenu[index].dishes[dishIndex].requiredExtras.push({ name: "", price: "" });
//                     setMenu(updatedMenu);
//                   }}
//                 >
//                   Add Required Extra
//                 </Button>
//                 {dish.optionalExtras.map((extra, extraIndex) => (
//                   <div key={extraIndex} className="extras-container">
//                     <TextField
//                       placeholder="Optional Extra Name"
//                       type="text"
//                       value={extra.name}
//                       name="name"
//                       onChange={(e) => handleInputChange(index, dishIndex, "optionalExtras", extraIndex, e)}
//                       className="form-field"
//                     />
//                     <TextField
//                       placeholder="Optional Extra Price"
//                       type="text"
//                       value={extra.price}
//                       name="price"
//                       onChange={(e) => handleInputChange(index, dishIndex, "optionalExtras", extraIndex, e)}
//                       className="form-field"
//                     />
//                   </div>
//                 ))}
//                 <Button
//                   className="add-extra-btn"
//                   variant="contained"
//                   onClick={() => {
//                     const updatedMenu = [...menu];
//                     updatedMenu[index].dishes[dishIndex].optionalExtras.push({ name: "", price: "" });
//                     setMenu(updatedMenu);
//                   }}
//                 >
//                   Add Optional Extra
//                 </Button>
//               </div>
//             ))}
//           </div>
//         ))}
//         <Button
//           className="add-category-btn"
//           variant="contained"
//           onClick={handleAddCategory}
//         >
//           Add Category
//         </Button>

//         {generatedEmail && generatedPassword && (
//           <div>
//             <p>Generated Email: {generatedEmail}</p>
//             <p>Generated Password: {generatedPassword}</p>
//           </div>
//         )}
//         <Button
//           className="mt-4 mb-4 submit-btn"
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


import React, { useState, useRef } from "react";
import axios from "axios";
import { Typography, Box, TextField, Button } from "@mui/material";
import "./AdminDashboard.css"; // Import the CSS file
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AxiosRequest from "../../Components/AxiosRequest";

const AdminDashboard = () => {
  const [restaurantName, setRestaurantName] = useState("");
  const [picture, setPicture] = useState("");
  const [location, setLocation] = useState("");
  const [menu, setMenu] = useState([
    { categoryName: "", dishes: [{ name: "", price: "", dishImage: "", description: "", requiredExtras: [{ name: "", price: "" }], optionalExtras: [{ name: "", price: "" }] }] },
  ]);
  const [generatedEmail, setGeneratedEmail] = useState("");
  const [generatedPassword, setGeneratedPassword] = useState("");
  const formRef = useRef(null);

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

  const handleInputChange = async (categoryIndex, dishIndex, extraType, extraIndex, e) => {
    if (e && e.target) {
      const { name, value, files } = e.target;
      const updatedMenu = [...menu];
      if (extraType === "requiredExtras" || extraType === "optionalExtras") {
        updatedMenu[categoryIndex].dishes[dishIndex][extraType][extraIndex][name] = value;
      } else if (name === "categoryName") {
        updatedMenu[categoryIndex].categoryName = value;
      } else if (name === "dishImage" && files.length > 0) {
        const resizedImage = await resizeImage(files[0], 400, 400);
        const base64String = await convertToBase64(resizedImage);
        updatedMenu[categoryIndex].dishes[dishIndex].dishImage = base64String;
        setMenu(updatedMenu);
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
    const body = {
      restaurantName,
      picture,
      location,
      menu,
    };
    try {
      const response = await AxiosRequest.post("/add-restaurant", body);
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

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const resizeImage = (file, maxWidth, maxHeight) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          const scaleFactor = Math.min(maxWidth / img.width, maxHeight / img.height);
          canvas.width = img.width * scaleFactor;
          canvas.height = img.height * scaleFactor;
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          canvas.toBlob((blob) => {
            resolve(new File([blob], file.name, { type: 'image/jpeg' }));
          }, 'image/jpeg');
        };
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const toastStyle = {
    container: "max-w-sm mx-auto",
    toast: "bg-red-500 text-white font-bold",
  };

  return (
    <Box className="container flex flex-col mt-4">
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
          onChange={(e) => convertToBase64(e.target.files[0]).then((res) => setPicture(res))}
          className="form-field"
        />
        {picture && (
          <div className="restaurant-image-preview">
            <img
              src={picture}
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
        {menu && menu.map((category, index) => (
          <div
            key={index}
            className="category-container"
          >
            <TextField
              key={index}
              placeholder="Category Name:"
              type="text"
              name="categoryName"
              value={category.categoryName}
              onChange={(e) => handleInputChange(index, null, null, null, e)}
              className="form-field"
            />
            <Button
              className="add-dish-btn"
              variant="contained"
              onClick={() => handleAddDish(index)}
            >
              Add Dish
            </Button>
            {category.dishes.map((dish, dishIndex) => (
              <div
                key={dishIndex}
                className="dish-container"
              >
                <TextField
                  placeholder="Dish Name:"
                  type="text"
                  value={dish.name}
                  name="name"
                  onChange={(e) => handleInputChange(index, dishIndex, null, null, e)}
                  className="form-field"
                />
                <TextField
                  placeholder="Price:"
                  type="text"
                  value={dish.price}
                  name="price"
                  onChange={(e) => handleInputChange(index, dishIndex, null, null, e)}
                  className="form-field"
                />
                <TextField
                  type="file"
                  name="dishImage"
                  onChange={(e) => handleInputChange(index, dishIndex, null, null, e)}
                  className="form-field"
                />
                {dish.dishImage && (
                  <div className="image-preview">
                    <img
                      src={dish.dishImage}
                      alt="dish"
                    />
                  </div>
                )}
                <TextField
                  placeholder="Dish Description:"
                  type="text"
                  value={dish.description}
                  name="description"
                  onChange={(e) => handleInputChange(index, dishIndex, null, null, e)}
                  className="form-field"
                />
                {dish.requiredExtras.map((extra, extraIndex) => (
                  <div key={extraIndex} className="extras-container">
                    <TextField
                      placeholder="Required Extra Name"
                      type="text"
                      value={extra.name}
                      name="name"
                      onChange={(e) => handleInputChange(index, dishIndex, "requiredExtras", extraIndex, e)}
                      className="form-field"
                    />
                    <TextField
                      placeholder="Required Extra Price"
                      type="text"
                      value={extra.price}
                      name="price"
                      onChange={(e) => handleInputChange(index, dishIndex, "requiredExtras", extraIndex, e)}
                      className="form-field"
                    />
                  </div>
                ))}
                <Button
                  className="add-extra-btn"
                  variant="contained"
                  onClick={() => {
                    const updatedMenu = [...menu];
                    updatedMenu[index].dishes[dishIndex].requiredExtras.push({ name: "", price: "" });
                    setMenu(updatedMenu);
                  }}
                >
                  Add Required Extra
                </Button>
                {dish.optionalExtras.map((extra, extraIndex) => (
                  <div key={extraIndex} className="extras-container">
                    <TextField
                      placeholder="Optional Extra Name"
                      type="text"
                      value={extra.name}
                      name="name"
                      onChange={(e) => handleInputChange(index, dishIndex, "optionalExtras", extraIndex, e)}
                      className="form-field"
                    />
                    <TextField
                      placeholder="Optional Extra Price"
                      type="text"
                      value={extra.price}
                      name="price"
                      onChange={(e) => handleInputChange(index, dishIndex, "optionalExtras", extraIndex, e)}
                      className="form-field"
                    />
                  </div>
                ))}
                <Button
                  className="add-extra-btn"
                  variant="contained"
                  onClick={() => {
                    const updatedMenu = [...menu];
                    updatedMenu[index].dishes[dishIndex].optionalExtras.push({ name: "", price: "" });
                    setMenu(updatedMenu);
                  }}
                >
                  Add Optional Extra
                </Button>
              </div>
            ))}
          </div>
        ))}
        <Button
          className="add-category-btn"
          variant="contained"
          onClick={handleAddCategory}
        >
          Add Category
        </Button>

        {generatedEmail && generatedPassword && (
          <div>
            <p>Your credentials for Deliver Website</p><br/>
            <p>Generated Email: {generatedEmail}</p>
            <p>Generated Password: {generatedPassword}</p>
          </div>
        )}
        <Button
          className="mt-4 mb-4 submit-btn"
          variant="contained"
          onClick={handleSubmit}
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
