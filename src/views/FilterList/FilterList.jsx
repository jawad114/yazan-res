import React, { useState, useEffect } from 'react';
import { Button, Input, Spinner,Card,CardBody,CardFooter } from '@material-tailwind/react';
import {Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import AxiosRequest from '../../Components/AxiosRequest'; // Ensure this path is correct
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';


const FilterList = () => {
  const [filter, setFilter] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null); // Changed to null
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newImage, setNewImage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const response = await AxiosRequest.get('/allFilters');
        setFilter(response.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchFilters();
  }, []);

  const handleEdit = (image) => {
    setSelectedImage(image);
    setNewTitle(image.title);
    setNewUrl(image.url);
    setOpenEditDialog(true);
  };

  const handleDelete = async (id) => {
    try {
      await AxiosRequest.delete(`/filter/${id}`);
      setFilter((prevFilters) => prevFilters.filter((filter) => filter._id !== id));
      toast.success('Deleted successfully');
    } catch (error) {
      setError('Error deleting filter');
      toast.error('Failed to delete filter');
    }
  };

  const handleAddFilter = () => {
    navigate('/add-filter');
  };

  const handleImageUpload = (file) => {
    setNewImage(file);
  };

  const handleEditSubmit = async () => {
    const formData = new FormData();
    formData.append('title', newTitle);
    if (newImage) {
      formData.append('filterImage', newImage);
    }

    try {
      if (selectedImage) { // Added check for selectedImage
        await AxiosRequest.put(`/filter/${selectedImage._id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        // Refresh the slider images list after successful edit
        const response = await AxiosRequest.get('/allFilters');
        setFilter(response.data);
        setOpenEditDialog(false);
        toast.success('Updated Successfully');
      }
    } catch (error) {
      setError('Error updating filter');
      toast.error('Error updating filter');
      console.error('Error:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F6F1EE] font-poppins">
        <Spinner className="h-12 w-12 text-black" />
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold text-center mb-8">All Filters</h1>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      {filter.length === 0 ? (
        <div className="flex flex-col items-center">
          <p className="text-lg font-semibold text-gray-600 mb-4">No filters found</p>
          <Button color="blue" onClick={handleAddFilter}>
            Add Filter
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filter.map((image) => (
              <Card key={image._id} className="w-full bg-white shadow-lg rounded-lg overflow-hidden">
                <a href={image.url} target="_blank" rel="noopener noreferrer">
                <img
                  src={image.imageUrl}
                  alt='Image'
                  className="h-48 w-full object-cover"
                />
                </a>
                <CardBody className="p-4">
                  <h3 className="text-xl font-semibold text-center mb-2">{image.title}</h3>
                </CardBody>
                <CardFooter className="flex justify-between p-4">
                  <Button
                    color="blue"
                    onClick={() => handleEdit(image)}
                  >
                    Edit
                  </Button>
                  <Button
                    color="red"
                    onClick={() => handleDelete(image._id)}
                  >
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          <div className="mt-8 flex justify-center">
            <Button color="blue" onClick={handleAddFilter}>
              Add New Filter
            </Button>
          </div>
        </>
      )}

      {/* Edit Dialog */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Edit Filter</DialogTitle>
        <DialogContent className='space-y-6'>
          <DialogContentText>
            To update this filter, please modify the title or upload a new image and click save.
          </DialogContentText>
          <label htmlFor="title" className="block mt-4 text-center">Filter Title</label>
          <input
            type="text"
            label="Title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            size={'medium'}
            className="border-2 mt-2 border-black rounded"
          />
        <label htmlFor="carouselImage" className="block mt-4 text-center">Filter Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageUpload(e.target.files[0])}
            size={'medium'}
            className="border-2 mt-2 border-black rounded"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)} color="blue">
            Cancel
          </Button>
          <Button onClick={handleEditSubmit} color="blue">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default FilterList;
