// import React, { useState,useEffect } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import AxiosRequest from '../../../Components/AxiosRequest';

// export default function AddCategory() {
//   const { resName } = useParams();
//   const isAdmin = localStorage.getItem('isAdmin') === 'true';
//   const isOwner = localStorage.getItem('isOwner') === 'true';
//   const navigate = useNavigate();
//   const [menu, setMenu] = useState([
//     { categoryName: "", categoryImage: "",
//     //  dishes: [{ name: "", price: "", dishImage: "", description: "", requiredExtras: [{ name: "", price: "" }], optionalExtras: [{ name: "", price: "" }] }] 
//     },
//   ]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (!isAdmin && !isOwner) {
//         navigate('/forbidden'); // Replace with your target route
//     }
// }, [isAdmin, isOwner, navigate]);

//   const convertToBase64 = (file) => {
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.readAsDataURL(file);
//       reader.onload = () => resolve(reader.result);
//       reader.onerror = (error) => reject(error);
//     });
//   };

//   const handleAddCategory = () => {
//     setMenu([...menu, {
//       categoryName: "",
//       categoryImage: "",
//       // dishes: [{ name: "", price: "", dishImage: "", description: "", requiredExtras: [{ name: "", price: "" }], optionalExtras: [{ name: "", price: "" }] }]
//     }]);
//   };

//   const handleRemoveCategory = (index) => {
//     const updatedMenu = [...menu];
//     updatedMenu.splice(index, 1);
//     setMenu(updatedMenu);
//   };

//   // const handleAddDish = (categoryIndex) => {
//   //   const updatedMenu = [...menu];
//   //   updatedMenu[categoryIndex].dishes.push({
//   //     name: '',
//   //     price: '',
//   //     dishImage: '',
//   //     description: '',
//   //     requiredExtras: [{ name: '', price: '' }],
//   //     optionalExtras: [{ name: '', price: '' }]
//   //   });
//   //   setMenu(updatedMenu);
//   // };

//   // const handleRemoveDish = (categoryIndex, dishIndex) => {
//   //   const updatedMenu = [...menu];
//   //   updatedMenu[categoryIndex].dishes.splice(dishIndex, 1);
//   //   setMenu(updatedMenu);
//   // };

//   const handleInputChange = (categoryIndex, dishIndex, field, value) => {
//     const updatedMenu = [...menu];
//     if (field === 'categoryName' || field === 'categoryImage') {
//       updatedMenu[categoryIndex][field] = value;
//     } else {
//       updatedMenu[categoryIndex].dishes[dishIndex][field] = value;
//     }
//     setMenu(updatedMenu);
//   };

//   // const handleExtrasChange = (categoryIndex, dishIndex, extrasType, extraIndex, field, value) => {
//   //   const updatedMenu = [...menu];
//   //   updatedMenu[categoryIndex].dishes[dishIndex][extrasType][extraIndex][field] = value;
//   //   setMenu(updatedMenu);
//   // };

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

//   const handleImageUpload = async (categoryIndex, file) => {
//     try {
//       if (!['image/jpeg', 'image/png', 'image/webp', 'image/jpg'].includes(file.type)) {
//         toast.error('Invalid image format. Please upload a JPG/JPEG, PNG, WEBP compressed image');
//         return;
//       }

//       const resizedImage = await resizeImage(file, 400, 400);
//       const base64String = await convertToBase64(resizedImage);

//         handleInputChange(categoryIndex, 0, 'categoryImage', base64String);
//     } catch (error) {
//       console.error('Error resizing image:', error);
//       toast.error('Failed to upload image');
//     }
//   };

//   const handleSubmit = async () => {
//     setLoading(true);
//     console.log('Menu', menu);
//     const hasMissingFields = menu.some((category) =>
//       !category.categoryName || !category.categoryImage 
//   //   || category.dishes.some((dish) =>
//   //       !dish.name || !dish.price || !dish.dishImage || !dish.description
//   // )
//     );
//     console.log('hasMissingFields', hasMissingFields);
//     if (hasMissingFields) {
//       toast.error("Please fill in all required fields");
//       setLoading(false);
//       return;
//     }
//     try {
//       const response = await AxiosRequest.post(`/add-menu-to-restaurant/${resName}`, { menu });
//       toast.success(response.data.message);
//       window.location.replace(`/categories/${resName}`)
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
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
//       <h1 className="text-2xl font-bold">Add Category</h1>
//       <div className="mt-6">
//         {menu.map((category, categoryIndex) => (
//           <div key={categoryIndex} className="mt-6 p-4 border border-gray-200 rounded">
//             <label className="block">Category Name:</label>
//             <input className="mt-1 block w-full" type="text" value={category.categoryName} onChange={(e) => handleInputChange(categoryIndex, 0, 'categoryName', e.target.value)} />
//             <label className="block">Category Image:</label>
//             <input className="mt-1 block w-full" type="file" onChange={(e) => handleImageUpload(categoryIndex, e.target.files[0])} />
//             {category.categoryImage && <img className="mt-2" src={category.categoryImage} alt="Category" style={{ maxWidth: '100px', maxHeight: '100px' }} />}
//               {/* {category.dishes.map((dish, dishIndex) => (
//               <div key={dishIndex} className="mt-6 p-4 border border-gray-200 rounded">
//                 <label className="block">Dish Name:</label>
//                 <input className="mt-1 block w-full" type="text" value={dish.name} onChange={(e) => handleInputChange(categoryIndex, dishIndex, 'name', e.target.value)} />
//                 <label className="block mt-2">Price:</label>
//                 <input className="mt-1 block w-full" type="text" value={dish.price} onChange={(e) => handleInputChange(categoryIndex, dishIndex, 'price', e.target.value)} />
//                 <label className="block mt-2">Description:</label>
//                 <textarea className="mt-1 block w-full" value={dish.description} onChange={(e) => handleInputChange(categoryIndex, dishIndex, 'description', e.target.value)} />
//                 <label className="block mt-2">Optional Extras:</label>
//                 {dish.optionalExtras.map((extra, extraIndex) => (
//                   <div key={extraIndex} className="flex items-center mt-1">
//                     <input className="mr-2" type="text" value={extra.name} onChange={(e) => handleExtrasChange(categoryIndex, dishIndex, 'optionalExtras', extraIndex, 'name', e.target.value)} placeholder="Name" />
//                     <input className="mr-2" type="text" value={extra.price} onChange={(e) => handleExtrasChange(categoryIndex, dishIndex, 'optionalExtras', extraIndex, 'price', e.target.value)} placeholder="Price" />
//                   </div>
//                 ))}
//                 <label className="block mt-2">Required Extras:</label>
//                 {dish.requiredExtras.map((extra, extraIndex) => (
//                   <div key={extraIndex} className="flex items-center mt-1">
//                     <input className="mr-2" type="text" value={extra.name} onChange={(e) => handleExtrasChange(categoryIndex, dishIndex, 'requiredExtras', extraIndex, 'name', e.target.value)} placeholder="Name" />
//                     <input className="mr-2" type="text" value={extra.price} onChange={(e) => handleExtrasChange(categoryIndex, dishIndex, 'requiredExtras', extraIndex, 'price', e.target.value)} placeholder="Price" />
//                   </div>
//                 ))}
//                 <button className="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={() => handleRemoveDish(categoryIndex, dishIndex)}>Remove Dish</button>
//                 <label className="block mt-2">Dish Image:</label>
//                 <input className="mt-1 block w-full" type="file" onChange={(e) => handleImageUpload(categoryIndex, dishIndex,'dish', e.target.files[0])} />
//                 {dish.dishImage && <img className="mt-2" src={dish.dishImage} alt="Dish" style={{ maxWidth: '100px', maxHeight: '100px' }} />}
//               </div>
//             ))} */}
//             <div className='flex flex-col items-center justify-center'>
//             {/* <button className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => handleAddDish(categoryIndex)}>Add Dish</button> */}
//             <button className="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={() => handleRemoveCategory(categoryIndex)}>Remove Category</button>
//             </div>
//           </div>
//         ))}
//             <div className='flex flex-col items-center justify-center'>
//         <button className="mt-6 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" onClick={handleAddCategory}>Add Category</button>
//         <button className="mt-6 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" onClick={handleSubmit} disabled={loading}>Submit</button>
//         </div>
//       </div>
//     </div>
//   );
// }


import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AxiosRequest from '../../../Components/AxiosRequest';

export default function AddCategory() {
  const { resName } = useParams();
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  const isOwner = localStorage.getItem('isOwner') === 'true';
  const navigate = useNavigate();
  const [menu, setMenu] = useState([
    { categoryName: "", categoryImage: null },
  ]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAdmin && !isOwner) {
      navigate('/forbidden'); // Replace with your target route
    }
  }, [isAdmin, isOwner, navigate]);

  const handleAddCategory = () => {
    setMenu([...menu, { categoryName: "", categoryImage: null }]);
  };

  const handleRemoveCategory = (index) => {
    const updatedMenu = [...menu];
    updatedMenu.splice(index, 1);
    setMenu(updatedMenu);
  };

  const handleInputChange = (categoryIndex, field, value) => {
    const updatedMenu = [...menu];
    updatedMenu[categoryIndex][field] = value;
    setMenu(updatedMenu);
  };

  const handleImageUpload = (categoryIndex, file) => {
    const updatedMenu = [...menu];
    updatedMenu[categoryIndex].categoryImage = file;
    setMenu(updatedMenu);
  };

  const handleSubmit = async () => {
    setLoading(true);

    // Convert menu to form-data
    const formData = new FormData();
    formData.append('menu', JSON.stringify(menu)); // Serialize the menu array to a JSON string

    // Append each image to the FormData
    menu.forEach((category) => {
      if (category.categoryImage) {
        formData.append('categoryImages', category.categoryImage);
      }
    });

    try {
      const response = await AxiosRequest.post(`/add-menu-to-restaurant/${resName}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      console.log('Menu submission response:', response.data);
      toast.success(response.data.message);
      window.location.replace(`/categories/${resName}`);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("An error occurred");
      }
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold">Add Category</h1>
      <div className="mt-6">
        {menu.map((category, categoryIndex) => (
          <div key={categoryIndex} className="mt-6 p-4 border border-gray-200 rounded">
            <label className="block">Category Name:</label>
            <input
              className="mt-1 block w-full"
              type="text"
              value={category.categoryName}
              onChange={(e) => handleInputChange(categoryIndex, 'categoryName', e.target.value)}
            />
            <label className="block">Category Image:</label>
            <input
              className="mt-1 block w-full"
              type="file"
              onChange={(e) => handleImageUpload(categoryIndex, e.target.files[0])}
            />
            {category.categoryImage && <img className="mt-2" src={URL.createObjectURL(category.categoryImage)} alt="Category" style={{ maxWidth: '100px', maxHeight: '100px' }} />}
            <div className='flex flex-col items-center justify-center'>
              <button
                className="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => handleRemoveCategory(categoryIndex)}
              >
                Remove Category
              </button>
            </div>
          </div>
        ))}
        <div className='flex flex-col items-center justify-center'>
          <button
            className="mt-6 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleAddCategory}
          >
            Add Category
          </button>
          <button
            className="mt-6 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleSubmit}
            disabled={loading}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
