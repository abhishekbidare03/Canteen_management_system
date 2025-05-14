"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast, Toaster } from 'react-hot-toast';
import { PhotoIcon, CurrencyDollarIcon, TagIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

const AddFoodItemPage = () => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const router = useRouter();

  // Fetch categories for the dropdown
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/menu/categories');
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        const data = await response.json();
        setCategories(data);
        if (data.length > 0) {
          setCategory(data[0]); // Set default category
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast.error('Could not load categories.');
      }
    };
    fetchCategories();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setErrors(prev => ({ ...prev, image: null })); // Clear image error on new selection
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = 'Product Name is required.';
    if (!category) newErrors.category = 'Category is required.';
    if (!price || isNaN(price) || parseFloat(price) <= 0) newErrors.price = 'Valid Price is required.';
    if (!description.trim()) newErrors.description = 'Description is required.';
    if (!image) newErrors.image = 'Image is required.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please fix the errors in the form.');
      return;
    }

    setIsLoading(true);
    const loadingToastId = toast.loading('Adding new item...');

    const formData = new FormData();
    formData.append('name', name);
    formData.append('category', category);
    formData.append('price', parseFloat(price));
    formData.append('description', description);
    formData.append('image', image);
    // Add isVegetarian later if needed

    try {
      const response = await fetch('/api/chef/food-items', {
        method: 'POST',
        body: formData, // FormData handles multipart/form-data automatically
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to add food item');
      }

      toast.success('Food item added successfully!', { id: loadingToastId });
      // Optionally redirect or clear form
      // router.push('/chef/menu'); // Example redirect
      setName('');
      setCategory(categories.length > 0 ? categories[0] : '');
      setPrice('');
      setDescription('');
      setImage(null);
      setImagePreview(null);
      setErrors({});
      // Reset file input visually (optional)
      if (e.target.image) {
        e.target.image.value = null;
      }

    } catch (error) {
      console.error('Error adding food item:', error);
      toast.error(`Error: ${error.message}`, { id: loadingToastId });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-8 bg-white rounded-lg shadow-md mt-6">
      <Toaster position="top-center" reverseOrder={false} />
      <h1 className="text-3xl font-bold text-gray-900 mb-6 border-b pb-4">Add New Food Item</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Image Upload Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Product Image</label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              {imagePreview ? (
                <Image src={imagePreview} alt="Image preview" width={128} height={128} className="mx-auto h-32 w-32 object-cover rounded-md" />
              ) : (
                <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
              )}
              <div className="flex text-sm text-gray-600 justify-center">
                <label
                  htmlFor="image-upload"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                >
                  <span>Upload a file</span>
                  <input id="image-upload" name="image" type="file" className="sr-only" onChange={handleImageChange} accept="image/*" />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
            </div>
          </div>
          {errors.image && <p className="mt-2 text-sm text-red-600">{errors.image}</p>}
        </div>

        {/* Product Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Product Name</label>
          <div className="mt-1">
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => { setName(e.target.value); setErrors(prev => ({ ...prev, name: null })); }}
              className={`block w-full shadow-sm sm:text-sm rounded-md p-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} focus:ring-indigo-500 focus:border-indigo-500 text-gray-900`}
              placeholder="e.g., Spicy Tuna Roll"
            />
          </div>
          {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Category Dropdown */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
            <select
              id="category"
              value={category}
              onChange={(e) => { setCategory(e.target.value); setErrors(prev => ({ ...prev, category: null })); }}
              className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border ${errors.category ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white text-gray-900`}
            >
              {categories.length === 0 && <option disabled>Loading categories...</option>}
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {errors.category && <p className="mt-2 text-sm text-red-600">{errors.category}</p>}
          </div>

          {/* Price Input */}
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price (₹)</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <CurrencyDollarIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                type="number"
                id="price"
                value={price}
                onChange={(e) => { setPrice(e.target.value); setErrors(prev => ({ ...prev, price: null })); }}
                className={`block w-full pl-10 pr-3 sm:text-sm rounded-md p-2 border ${errors.price ? 'border-red-500' : 'border-gray-300'} focus:ring-indigo-500 focus:border-indigo-500 text-gray-900`}
                placeholder="0.00"
                step="0.01"
                min="0"
              />
            </div>
            {errors.price && <p className="mt-2 text-sm text-red-600">{errors.price}</p>}
          </div>
        </div>

        {/* Description Textarea */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <div className="mt-1">
            <textarea
              id="description"
              rows={4}
              value={description}
              onChange={(e) => { setDescription(e.target.value); setErrors(prev => ({ ...prev, description: null })); }}
              className={`block w-full shadow-sm sm:text-sm rounded-md p-2 border ${errors.description ? 'border-red-500' : 'border-gray-300'} focus:ring-indigo-500 focus:border-indigo-500 text-gray-900`}
              placeholder="Detailed description of the food item..."
            />
          </div>
          {errors.description && <p className="mt-2 text-sm text-red-600">{errors.description}</p>}
        </div>

        {/* Submit Button */}
        <div className="pt-5">
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className={`inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${isLoading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'}`}
            >
              {isLoading ? 'Adding...' : 'Add Product'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddFoodItemPage;