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
    <div>
    <div className="max-w-xl flex flex-col mx-auto mt-8 p-6 bg-white shadow-lg mb-4 rounded-lg">
      <h1 className="text-2xl text-center font-bold">اضف فئة</h1>
      <div className="mt-6">
        {menu.map((category, categoryIndex) => (
          <div key={categoryIndex} className="mt-6 p-4 border border-gray-200 rounded">
            <label className="block" style={{direction:'rtl'}}>سجل اسم الفئة:</label>
            <input
              className="mt-1 block w-full"
              type="text"
              value={category.categoryName}
              style={{direction:'rtl'}}
              onChange={(e) => handleInputChange(categoryIndex, 'categoryName', e.target.value)}
            />
            <label className="block" style={{direction:'rtl'}}>قم بتحميل صورة الفئة:</label>
            <input
              className="mt-1 block w-full"
              type="file"
              style={{direction:'rtl'}}
              onChange={(e) => handleImageUpload(categoryIndex, e.target.files[0])}
            />
            {category.categoryImage && <img className="mt-2" src={URL.createObjectURL(category.categoryImage)} alt="Category" style={{ maxWidth: '100px', maxHeight: '100px' }} />}
            <div className='flex flex-col items-center justify-center'>
              <button
                className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => handleRemoveCategory(categoryIndex)}
              >
                احذف تصنيف
              </button>
            </div>
          </div>
        ))}
        <div className='flex flex-col items-center justify-center'>
          <button
            className="mt-6 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleAddCategory}
          >
            اضف فئات
          </button>
          <button
            className="mt-6 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleSubmit}
            disabled={loading}
          >
            حفط
          </button>
        </div>
      </div>
    </div>
    </div>
  );
}
