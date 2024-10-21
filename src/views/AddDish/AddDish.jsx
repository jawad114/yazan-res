import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, TextField, Typography } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AxiosRequest from "../../Components/AxiosRequest";

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
  const [dishImage, setDishImage] = useState(null); // Change to null
  const [description, setDescription] = useState("");
  const [requiredExtras, setRequiredExtras] = useState([{ name: "", price: "" }]);
  const [optionalExtras, setOptionalExtras] = useState([{ name: "", price: "" }]);
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  const isOwner = localStorage.getItem('isOwner') === 'true';
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdmin && !isOwner) {
        navigate('/forbidden'); // Replace with your target route
    }
}, [isAdmin, isOwner, navigate]);

  const handleAddDish = async () => {
    if (!name || !price || !dishImage ) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Create FormData to send the file along with other data
    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price);
    formData.append('description', description);
    formData.append('dishImage', dishImage); // Append the file
    formData.append('extras', JSON.stringify({ requiredExtras, optionalExtras }));

    try {
      const response = await AxiosRequest.post(`/restaurant/${resName}/category/${categoryName}/add-dish`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      toast.success('Item added successfully');
      setTimeout(()=>{
        navigate(-1);
      },2000);
      // window.location.replace(`/categories/${resName}/${categoryName}`);
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
      toast.error("Invalid image format. Please upload a JPG/JPEG, PNG, or WEBP compressed image.");
      return;
    }
  
    try {
      const resizedImage = await resizeImage(file, 400, 400); // Resize image to 400x400 (adjust as needed)
      setDishImage(resizedImage); // Set the resized image file
    } catch (error) {
      console.error('Error resizing image:', error);
      toast.error('Failed to upload image');
    }
  };

  const toastStyle = {
    container: "max-w-sm mx-auto",
    toast: "bg-red-500 !text-black",
  };

  return (
    <div>
    <div className="max-w-xl flex flex-col mx-auto mt-8 p-6 bg-white shadow-lg mb-4 rounded-lg">
    <form>
      <Typography className="text-center" variant="h5" gutterBottom>
      اضف منتج
      </Typography>
      <label htmlFor="dishImage" className="block mt-4 text-end">اضف صورة المنتج</label>
      <input 
        id='dishImage' 
        type="file" 
        style={{direction:'rtl'}}
        onChange={(e) => handleImageUpload(e.target.files[0])} 
        className="w-full h-[10vh] mt-2 p-2 rounded-lg border border-gray-300" 
      />
      {dishImage && <img className="mt-2" src={URL.createObjectURL(dishImage)} alt="Dish" style={{ maxWidth: '100px', maxHeight: '100px' }} />}

      <label htmlFor="name" className="block mt-4 text-end">اسم المنتج</label>
      <input 
        id="name" 
        type="text" 
        value={name} 
        onChange={(e) => setName(e.target.value)} 
        placeholder="اسم المنتج" 
        style={{direction:'rtl'}}
        className="w-full p-2 mt-2 rounded-lg border border-gray-300" 
      />

      <label htmlFor="price" className="block mt-4 text-end">سعر المنتج</label>
      <input 
        id="price" 
        type="number" 
        value={price} 
        onChange={(e) => setPrice(e.target.value)} 
        placeholder="سعر المنتج" 
        style={{direction:'rtl'}}
        className="w-full p-2 mt-2 rounded-lg border border-gray-300" 
      />

      <label htmlFor="description" className="block mt-4 text-end">وصف المنتج</label>
      <TextField 
        id="description" 
        type="text" 
        value={description} 
        onChange={(e) => setDescription(e.target.value)} 
        placeholder="وصف المنتج" 
        style={{direction:'rtl'}}
        className="w-full  mt-2 rounded-lg border border-gray-300" 
        rows={4} 
      />

      <Typography variant="subtitle1" className="text-end !font-bold mt-4">قم بزيادة اضافات اجبارية في حال توفرها</Typography>
      {requiredExtras.map((extra, index) => (
        <div key={index}>
          <label htmlFor={`requiredExtraName${index}`} className="block mt-4 text-end">اسم الآضافة الاجبارية</label>
          <input 
            id={`requiredExtraName${index}`} 
            type="text" 
            value={extra.name} 
            onChange={(e) => {
              const newExtras = [...requiredExtras];
              newExtras[index].name = e.target.value;
              setRequiredExtras(newExtras);
            }} 
            style={{direction:'rtl'}}
            placeholder="اسم الآضافة الاجبارية" 
            className="w-full p-2 mt-2 rounded-lg border border-gray-300" 
          />

          <label htmlFor={`requiredExtraPrice${index}`} className="block mt-4 text-end">سعر الآضافة الآجبارية</label>
          <input 
            id={`requiredExtraPrice${index}`} 
            type="number" 
            value={extra.price} 
            onChange={(e) => {
              const newExtras = [...requiredExtras];
              newExtras[index].price = e.target.value;
              setRequiredExtras(newExtras);
            }} 
            style={{direction:'rtl'}}
            placeholder="سعر الآضافة الآجبارية" 
            className="w-full p-2 mt-2 rounded-lg border border-gray-300" 
          />
        </div>
      ))}
      <div className="flex items-center justify-end">
      <Button onClick={() => setRequiredExtras([...requiredExtras, { name: "", price: "" }])} className="mt-4 mb-4">أضف خيارًا إضافيًا اجباري بحال توفره</Button>
      </div>
      <Typography variant="subtitle1" className="text-end !font-bold mt-2">قم بزيادة اضافات اختيارية بحال توفرها</Typography>
      {optionalExtras.map((extra, index) => (
        <div key={index}>
          <label htmlFor={`optionalExtraName${index}`} className="block mt-4 text-end">اسم الآضافة الاختيارية</label>
          <input 
            id={`optionalExtraName${index}`} 
            type="text" 
            value={extra.name} 
            style={{direction:'rtl'}}
            onChange={(e) => {
              const newExtras = [...optionalExtras];
              newExtras[index].name = e.target.value;
              setOptionalExtras(newExtras);
            }} 
            placeholder="اسم الآضافة الاختيارية" 
            className="w-full p-2 mt-2 rounded-lg border border-gray-300" 
          />

          <label htmlFor={`optionalExtraPrice${index}`} className="block mt-4 text-end">سعر الآضافة الاختيارية</label>
          <input 
            id={`optionalExtraPrice${index}`} 
            type="number" 
            value={extra.price} 
            style={{direction:'rtl'}}
            onChange={(e) => {
              const newExtras = [...optionalExtras];
              newExtras[index].price = e.target.value;
              setOptionalExtras(newExtras);
            }} 
            placeholder="سعر الآضافة الاختيارية" 
            className="w-full p-2 mt-2 rounded-lg border border-gray-300" 
          />
        </div>
      ))}
            <div className="flex items-center justify-end">
      <Button onClick={() => setOptionalExtras([...optionalExtras, { name: "", price: "" }])} className="mt-4 mb-4">أضف خيارًا إضافيًا</Button>
           </div>
           <div className="flex items-center justify-center">
      <Button onClick={handleAddDish} className="mt-8" variant="contained">اضف المنتج</Button>
      </div>
      <ToastContainer className={toastStyle.container} toastClassName={toastStyle.toast} />
      </form>
    </div>
    </div>
  );
};

export default AddDish;

