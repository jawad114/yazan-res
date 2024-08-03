// import React, { useState } from "react";
// import axios from "axios";
// import { useParams } from "react-router-dom";
// import { Button, TextField, Typography } from "@mui/material";
// import { ToastContainer,toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const convertToBase64 = (file) => {
//   return new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.readAsDataURL(file);
//     reader.onload = () => resolve(reader.result);
//     reader.onerror = (error) => reject(error);
//   });
// };

// const AddDish = () => {
//   const { resName, categoryName } = useParams();
//   const [name, setName] = useState("");
//   const [price, setPrice] = useState("");
//   const [dishImage, setDishImage] = useState("");
//   const [description, setDescription] = useState("");
//   const [requiredExtras, setRequiredExtras] = useState([{ name: "", price: "" }]);
//   const [optionalExtras, setOptionalExtras] = useState([{ name: "", price: "" }]);

//   const handleAddDish = async () => {
//     if (!name || !price || !dishImage || !description || requiredExtras.some(extra => !extra.name || !extra.price) ) {
//       toast.error("Please fill in all required fields");
//       return;
//     }
//     try {
//       const response = await axios.post(`https://yazan-4.onrender.com/restaurant/${resName}/category/${categoryName}/add-dish`, {
//         name,
//         price,
//         dishImage,
//         description,
//         extras: { requiredExtras, optionalExtras }
//       });
//       console.log(response.data);
//       toast.success('Dish added successfully');
//       window.location.replace(`/categories/${resName}/${categoryName}`)
//     } catch (error) {
//       if (error.response && error.response.data && error.response.data.error) {
//         if (!toast.isActive("errorToast")) {
//           toast.error(error.response.data.error, { toastId: "errorToast" });
//         }
//       } else {
//         if (!toast.isActive("errorToast")) {
//           toast.error("An error occurred", { toastId: "errorToast" });
//         }
//       }
//     }
//   };

//   const handleImageUpload = async (file) => {
//     try {
//       const base64String = await convertToBase64(file);
//       setDishImage(base64String);
//     } catch (error) {
//       console.error('Error converting image to base64:', error);
//       toast.error('Failed to upload image');
//     }
//   };

//   const toastStyle = {
//     container: "max-w-sm mx-auto",
//     toast: "bg-red-500 text-white font-bold",
//   };


//   return (
//     <div className="flex flex-col p-4 md:p-8">
//        <ToastContainer
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
//       <Typography variant="h5" gutterBottom>
//         Add Dish
//       </Typography>
//       <label htmlFor="dishImage" className="block mt-4">Dish Image</label>
//       <input id='dishImage' type="file" onChange={(e) => handleImageUpload(e.target.files[0])} className="w-full h-[10vh] mt-2 p-2 rounded-lg border border-gray-300" />
//       {dishImage && <img className="mt-2" src={dishImage} alt="Dish" style={{ maxWidth: '100px', maxHeight: '100px' }} />}

//       <label htmlFor="name" className="block mt-4">Name</label>
//       <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="w-full p-2 mt-2 rounded-lg border border-gray-300" />

//       <label htmlFor="price" className="block mt-4">Price</label>
//       <input id="price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price" className="w-full p-2 mt-2 rounded-lg border border-gray-300" />

//       <label htmlFor="description" className="block mt-4">Description</label>
//       <TextField id="description" type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" className="w-full  mt-2 rounded-lg border border-gray-300" rows={4} />

//       <Typography variant="subtitle1">Required Extras</Typography>
//       {requiredExtras.map((extra, index) => (
//         <div key={index}>
//           <label htmlFor={`requiredExtraName${index}`} className="block mt-4">Name</label>
//           <input id={`requiredExtraName${index}`} type="text" value={extra.name} onChange={(e) => {
//             const newExtras = [...requiredExtras];
//             newExtras[index].name = e.target.value;
//             setRequiredExtras(newExtras);
//           }} placeholder="Name" className="w-full p-2 mt-2 rounded-lg border border-gray-300" />

//           <label htmlFor={`requiredExtraPrice${index}`} className="block mt-4">Price</label>
//           <input id={`requiredExtraPrice${index}`} type="number" value={extra.price} onChange={(e) => {
//             const newExtras = [...requiredExtras];
//             newExtras[index].price = e.target.value;
//             setRequiredExtras(newExtras);
//           }} placeholder="Price" className="w-full p-2 mt-2 rounded-lg border border-gray-300" />
//         </div>
//       ))}
//       <Button onClick={() => setRequiredExtras([...requiredExtras, { name: "", price: "" }])} className="mt-4">Add Required Extra</Button>

//       <Typography variant="subtitle1" className="mt-8">Optional Extras</Typography>
//       {optionalExtras.map((extra, index) => (
//         <div key={index}>
//           <label htmlFor={`optionalExtraName${index}`} className="block mt-4">Name</label>
//           <input id={`optionalExtraName${index}`} type="text" value={extra.name} onChange={(e) => {
//             const newExtras = [...optionalExtras];
//             newExtras[index].name = e.target.value;
//             setOptionalExtras(newExtras);
//           }} placeholder="Name" className="w-full p-2 mt-2 rounded-lg border border-gray-300" />

//           <label htmlFor={`optionalExtraPrice${index}`} className="block mt-4">Price</label>
//           <input id={`optionalExtraPrice${index}`} type="number" value={extra.price} onChange={(e) => {
//             const newExtras = [...optionalExtras];
//             newExtras[index].price = e.target.value;
//             setOptionalExtras(newExtras);
//           }} placeholder="Price" className="w-full p-2 mt-2 rounded-lg border border-gray-300" />
//         </div>
//       ))}
//       <Button onClick={() => setOptionalExtras([...optionalExtras, { name: "", price: "" }])} className="mt-4">Add Optional Extra</Button>

//       <Button onClick={handleAddDish} className="mt-8">Add Dish</Button>
//     </div>
//   );
// };

// export default AddDish;


import React, { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Button, TextField, Typography } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AxiosRequest from "../../Components/AxiosRequest";

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

const AddDish = () => {
  const { resName, categoryName } = useParams();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [dishImage, setDishImage] = useState("");
  const [description, setDescription] = useState("");
  const [requiredExtras, setRequiredExtras] = useState([{ name: "", price: "" }]);
  const [optionalExtras, setOptionalExtras] = useState([{ name: "", price: "" }]);

  const handleAddDish = async () => {
    if (!name || !price || !dishImage || !description || requiredExtras.some(extra => !extra.name || !extra.price)) {
      toast.error("Please fill in all required fields");
      return;
    }
    try {
      const response = await AxiosRequest.post(`/restaurant/${resName}/category/${categoryName}/add-dish`, {
        name,
        price,
        dishImage,
        description,
        extras: { requiredExtras, optionalExtras }
      });
      console.log(response.data);
      toast.success('Dish added successfully');
      window.location.replace(`/categories/${resName}/${categoryName}`)
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        if (!toast.isActive("errorToast")) {
          toast.error(error.response.data.error, { toastId: "errorToast" });
        }
      } else {
        if (!toast.isActive("errorToast")) {
          toast.error("An error occurred", { toastId: "errorToast" });
        }
      }
    }
  };

  const handleImageUpload = async (file) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg']; // Add more types as needed
    if (!allowedTypes.includes(file.type)) {
      toast.error("Invalid image format.Please upload a JPG/JPEG, PNG, WEBP compressed image");
      return;
    }
  
    try {
      const resizedImage = await resizeImage(file, 400, 400); // Resize image to 100x100 (adjust as needed)
      const base64String = await convertToBase64(resizedImage);
      setDishImage(base64String);
    } catch (error) {
      console.error('Error converting image to base64:', error);
      toast.error('Failed to upload image');
    }
  };
  

  const toastStyle = {
    container: "max-w-sm mx-auto",
    toast: "bg-red-500 text-white font-bold",
  };

  return (
    <div className="flex flex-col p-4 md:p-8">
      <Typography variant="h5" gutterBottom>
        Add Dish
      </Typography>
      <label htmlFor="dishImage" className="block mt-4">Dish Image</label>
      <input id='dishImage' type="file" onChange={(e) => handleImageUpload(e.target.files[0])} className="w-full h-[10vh] mt-2 p-2 rounded-lg border border-gray-300" />
      {dishImage && <img className="mt-2" src={dishImage} alt="Dish" style={{ maxWidth: '100px', maxHeight: '100px' }} />}

      <label htmlFor="name" className="block mt-4">Name</label>
      <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="w-full p-2 mt-2 rounded-lg border border-gray-300" />

      <label htmlFor="price" className="block mt-4">Price</label>
      <input id="price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price" className="w-full p-2 mt-2 rounded-lg border border-gray-300" />

      <label htmlFor="description" className="block mt-4">Description</label>
      <TextField id="description" type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" className="w-full  mt-2 rounded-lg border border-gray-300" rows={4} />

      <Typography variant="subtitle1">Required Extras</Typography>
      {requiredExtras.map((extra, index) => (
        <div key={index}>
          <label htmlFor={`requiredExtraName${index}`} className="block mt-4">Name</label>
          <input id={`requiredExtraName${index}`} type="text" value={extra.name} onChange={(e) => {
            const newExtras = [...requiredExtras];
            newExtras[index].name = e.target.value;
            setRequiredExtras(newExtras);
          }} placeholder="Name" className="w-full p-2 mt-2 rounded-lg border border-gray-300" />

          <label htmlFor={`requiredExtraPrice${index}`} className="block mt-4">Price</label>
          <input id={`requiredExtraPrice${index}`} type="number" value={extra.price} onChange={(e) => {
            const newExtras = [...requiredExtras];
            newExtras[index].price = e.target.value;
            setRequiredExtras(newExtras);
          }} placeholder="Price" className="w-full p-2 mt-2 rounded-lg border border-gray-300" />
        </div>
      ))}
      <Button onClick={() => setRequiredExtras([...requiredExtras, { name: "", price: "" }])} className="mt-4">Add Required Extra</Button>

      <Typography variant="subtitle1" className="mt-8">Optional Extras</Typography>
      {optionalExtras.map((extra, index) => (
        <div key={index}>
          <label htmlFor={`optionalExtraName${index}`} className="block mt-4">Name</label>
          <input id={`optionalExtraName${index}`} type="text" value={extra.name} onChange={(e) => {
            const newExtras = [...optionalExtras];
            newExtras[index].name = e.target.value;
            setOptionalExtras(newExtras);
          }} placeholder="Name" className="w-full p-2 mt-2 rounded-lg border border-gray-300" />

          <label htmlFor={`optionalExtraPrice${index}`} className="block mt-4">Price</label>
          <input id={`optionalExtraPrice${index}`} type="number" value={extra.price} onChange={(e) => {
            const newExtras = [...optionalExtras];
            newExtras[index].price = e.target.value;
            setOptionalExtras(newExtras);
          }} placeholder="Price" className="w-full p-2 mt-2 rounded-lg border border-gray-300" />
        </div>
      ))}
      <Button onClick={() => setOptionalExtras([...optionalExtras, { name: "", price: "" }])} className="mt-4">Add Optional Extra</Button>

      <Button onClick={handleAddDish} className="mt-8">Add Dish</Button>
    </div>
  );
};

export default AddDish;
