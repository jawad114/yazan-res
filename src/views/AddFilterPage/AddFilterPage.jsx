import React, { useEffect, useState } from 'react';
import AxiosRequest from '../../Components/AxiosRequest'; // Update the path as needed
import { Button, Input, Spinner } from '@material-tailwind/react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const AddFilterPage = () => {
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  const navigate = useNavigate();
  
  
  useEffect(() => {
    if (!isAdmin) {
        navigate('/forbidden'); // Replace with your target route
    }
  }, [isAdmin, navigate]);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };


  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
  
    // Validate required fields
    if (!title.trim()) {
      setError('Title is required');
      toast.error('Title is required');
      setLoading(false);
      return;
    }
  
    if (!file) {
      setError('Filter image is required');
      toast.error('Filter image is required');
      setLoading(false);
      return;
    }
  
    const formData = new FormData();
    formData.append('title', title);
    formData.append('filterImage', file);
  
    try {
      const response = await AxiosRequest.post('/addFilter', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setSuccess('Filter added successfully!');
      toast.success('Filter added successfully!');
      setTitle('');
      setFile(null);
    } catch (error) {
      setError('Error adding filter');
      toast.error('Failed to add filter');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg">
      <h1 className="text-4xl font-bold text-center mb-8">Add New Filter</h1>
        <div className="mb-4">
        <label htmlFor="title" className="block mt-4 text-center">Filter Title</label>
          <input
            type="text"
            placeholder="Filter Title"
            value={title}
            onChange={handleTitleChange}
          size={'medium'}
          className="border-2 mt-2 border-black rounded"
          />
        </div>
        <div className="mb-4">
        <label htmlFor="filterImage" className="block mt-4 text-center">Filter Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
           size={'medium'}
          className="border-2 mt-2 border-black rounded"
          />
        </div>
        <div className='flex items-center justify-center'>
        <Button
          type="submit"
          color="blue"
          disabled={loading}
        >
          {loading ? <Spinner className="h-6 w-6 text-white" /> : 'Add Filter'}
        </Button>
        </div>
        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
        {success && <p className="text-green-500 text-center mt-4">{success}</p>}
      </form>
    </div>
  );
};

export default AddFilterPage;
