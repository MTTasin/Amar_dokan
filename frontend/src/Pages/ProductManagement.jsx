import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import useAxios from './../useAxios'; // Assuming useAxios is in the same directory or correctly imported
import Loader from './../Components/Loader/Loader'; // Assuming Loader is correctly imported
import axios from 'axios';
import { toast } from 'react-toastify'; // Assuming react-toastify is set up

// Custom Confirmation Modal Component
const ConfirmationModal = ({ isOpen, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
      <div className="relative p-8 border w-full max-w-md shadow-lg rounded-md bg-white">
        <h3 className="text-xl font-bold mb-4">Confirm Action</h3>
        <p className="mb-6">{message}</p>
        <div className="flex justify-end space-x-2">
          <button
            onClick={onConfirm}
            className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md"
          >
            Confirm
          </button>
          <button
            onClick={onCancel}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-md"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};


export default function ProductManagement() {
  // Redux state for user information
  const { userInfo, user } = useSelector((state) => state.auth);

  // Custom hook to fetch products from the API
  const { response: products, loading, error } = useAxios(`${process.env.VITE_API_BASE_URL}/products/`);

  // State to manage the list of products displayed
  const [productList, setProductList] = useState([]);
  // State to control the visibility of the add/edit product modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  // State to hold the product being edited (null for new product)
  const [currentProduct, setCurrentProduct] = useState(null);
  // State for form data, initialized with default empty values
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    discountPercentage: '',
    rating: '',
    stock: '',
    tags: '', // Stored as string, parsed to JSON
    brand: '',
    sku: '',
    weight: '',
    dimensions: '', // Stored as string, parsed to JSON
    warrantyInformation: '',
    shippingInformation: '',
    availabilityStatus: '',
    reviews: '', // Stored as string, parsed to JSON
    images: [], // Changed to array for multiple files
    thumbnail: null,
  });

  // State for delete confirmation modal
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [productToDeleteId, setProductToDeleteId] = useState(null);

  // Effect to update productList when products from useAxios change
  useEffect(() => {
    if (Array.isArray(products)) {
      setProductList(products);
    } else if (products && Array.isArray(products.data)) {
      setProductList(products.data);
    } else {
      setProductList([]);
    }
  }, [products]);

  // Handle changes in form input fields
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'images') {
      setFormData({ ...formData, [name]: Array.from(files) });
    } else if (files) {
      setFormData({ ...formData, [name]: files[0] });
    } else if (name === 'tags' || name === 'dimensions') {
      setFormData({ ...formData, [name]: value });
    } else if (name === 'reviews') {
      try {
        setFormData({ ...formData, [name]: JSON.parse(value) });
      } catch (err) {
        setFormData({ ...formData, [name]: value });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Open the add/edit product modal
  const handleOpenModal = (product = null) => {
    setCurrentProduct(product);
    if (product) {
      // Populate form with existing product data for editing
      setFormData({
        title: product.title || '',
        description: product.description || '',
        category: product.category || '',
        price: product.price || '',
        discountPercentage: product.discountPercentage || '',
        rating: product.rating || '',
        stock: product.stock || '',
        // Stringify JSON fields for display in textarea
        tags: Array.isArray(product.tags) ? product.tags.join(', ') : '',
        brand: product.brand || '',
        sku: product.sku || '',
        weight: product.weight || '',
        dimensions: product.dimensions ? Object.entries(product.dimensions).map(([key, value]) => `${key}:${value}`).join(', ') : '',
        warrantyInformation: product.warrantyInformation || '',
        shippingInformation: product.shippingInformation || '',
        availabilityStatus: product.availabilityStatus || '',
        reviews: product.reviews ? JSON.stringify(product.reviews) : '',
        images: [], // Images are not pre-filled for security/complexity reasons
        thumbnail: null, // Thumbnail is not pre-filled
      });
    } else {
      // Reset form for adding a new product
      setFormData({
        title: '',
        description: '',
        category: '',
        price: '',
        discountPercentage: '',
        rating: '',
        stock: '',
        tags: '',
        brand: '',
        sku: '',
        weight: '',
        dimensions: '',
        warrantyInformation: '',
        shippingInformation: '',
        availabilityStatus: '',
        reviews: '',
        images: [],
        thumbnail: null,
      });
    }
    setIsModalOpen(true);
  };

  // Close the add/edit product modal and reset form
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentProduct(null);
    setFormData({
      title: '',
      description: '',
      category: '',
      price: '',
      discountPercentage: '',
      rating: '',
      stock: '',
      tags: '',
      brand: '',
      sku: '',
      weight: '',
      dimensions: '',
      warrantyInformation: '',
      shippingInformation: '',
      availabilityStatus: '',
      reviews: '',
      images: [],
      thumbnail: null,
    });
  };

  // Handle form submission for adding or updating a product
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create FormData object to send files and other data
    const data = new FormData();
    for (const key in formData) {
      if (formData[key] !== null && formData[key] !== '') {
        if (key === 'images') {
          formData[key].forEach((file) => {
            data.append('images', file);
          });
        } else if (key === 'tags') {
          const tagsArray = formData[key].split(',').map(tag => tag.trim()).filter(tag => tag !== '');
          data.append(key, JSON.stringify(tagsArray));
        } else if (key === 'dimensions') {
          const dimensionsObject = {};
          formData[key].split(',').forEach(dim => {
            const [k, v] = dim.split(':').map(s => s.trim());
            if (k && v) {
              dimensionsObject[k] = isNaN(Number(v)) ? v : Number(v);
            }
          });
          data.append(key, JSON.stringify(dimensionsObject));
        } else if (key === 'reviews') {
          const reviewsArray = formData[key].split(',').map(review => review.trim()).filter(review => review !== '');
          data.append(key, JSON.stringify(reviewsArray));
        } else {
          data.append(key, formData[key]);
        }
      }
    }

    // Check if API base URL is defined
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    if (!apiBaseUrl) {
      toast.error('API Base URL is not defined. Please set VITE_API_BASE_URL in your environment variables.');
      console.error('VITE_API_BASE_URL is undefined.');
      return;
    }

    try {
      let res;
      if (currentProduct) {
        // Update existing product
        res = await axios.patch(`${apiBaseUrl}/products/${currentProduct.id}/`, data, {
          headers: {
            Authorization: `JWT ${user.access}`,
            'Content-Type': 'multipart/form-data', // Important for file uploads
          },
        });
        // Update product in the list
        setProductList(productList.map((p) => (p.id === res.data.id ? res.data : p)));
        toast.success('Product updated successfully!');
      } else {
        // Add new product
        res = await axios.post(`${apiBaseUrl}/products/`, data, {
          headers: {
            Authorization: `JWT ${user.access}`,
            'Content-Type': 'multipart/form-data', // Important for file uploads
          },
        });
        // Add new product to the list
        setProductList([...productList, res.data]);
        toast.success('Product added successfully!');
      }
      handleCloseModal(); // Close modal on success
    } catch (err) {
      toast.error('Failed to save product.');
      console.error('Save product error:', err.response ? err.response.data : err);
    }
  };

  // Open confirmation modal for deletion
  const confirmDelete = (productId) => {
    setProductToDeleteId(productId);
    setIsConfirmModalOpen(true);
  };

  // Handle product deletion after confirmation
  const handleDelete = async () => {
    setIsConfirmModalOpen(false); // Close confirmation modal

    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    if (!apiBaseUrl) {
      toast.error('API Base URL is not defined. Please set VITE_API_BASE_URL in your environment variables.');
      console.error('VITE_API_BASE_URL is undefined.');
      return;
    }

    try {
      await axios.delete(`${apiBaseUrl}/products/${productToDeleteId}/`, {
        headers: {
          Authorization: `JWT ${user.access}`,
        },
      });
      // Remove deleted product from the list
      setProductList(productList.filter((p) => p.id !== productToDeleteId));
      toast.success('Product deleted successfully!');
    } catch (err) {
      toast.error('Failed to delete product.');
      console.error('Delete product error:', err);
    } finally {
      setProductToDeleteId(null); // Clear product to delete ID
    }
  };

  // Render access denied message if user is not staff or superuser
  if (!userInfo.is_staff && !userInfo.is_superuser) {
    return <div className="text-red-500 p-6">Access Denied: Staff or Superuser privilege required.</div>;
  }

  // Render loader while products are loading
  if (loading) {
    return <Loader />;
  }

  // Render error message if product loading fails
  if (error) {
    return <div className="text-red-500 p-6">Error loading products: {error.message}</div>;
  }

  return (
    <React.Fragment> {/* Changed from <> to React.Fragment */}
      <div className="p-6 bg-white rounded-lg shadow-md font-inter"> {/* Added font-inter */}
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Product Management</h2>

        {/* Button to open add new product modal */}
        <button
          onClick={() => handleOpenModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md mb-4"
        >
          Add New Product
        </button>

        {/* Add/Edit Product Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
            <div className="relative p-8 border w-full max-w-3xl shadow-lg rounded-md bg-white max-h-[90vh] overflow-y-auto">
              <h3 className="text-2xl font-bold mb-4">{currentProduct ? 'Edit Product' : 'Add Product'}</h3>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Product Title */}
                <input type="text" name="title" placeholder="Title" value={formData.title} onChange={handleChange} className="p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500" required />
                {/* Product Category */}
                <input type="text" name="category" placeholder="Category" value={formData.category} onChange={handleChange} className="p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500" required />
                {/* Product Price */}
                <input type="number" name="price" placeholder="Price" value={formData.price} onChange={handleChange} className="p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500" step="0.01" required />
                {/* Discount Percentage */}
                <input type="number" name="discountPercentage" placeholder="Discount Percentage" value={formData.discountPercentage} onChange={handleChange} className="p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500" step="0.01" />
                {/* Rating */}
                <input type="number" name="rating" placeholder="Rating" value={formData.rating} onChange={handleChange} className="p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500" step="0.01" />
                {/* Stock */}
                <input type="number" name="stock" placeholder="Stock" value={formData.stock} onChange={handleChange} className="p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500" required />
                {/* Brand */}
                <input type="text" name="brand" placeholder="Brand" value={formData.brand} onChange={handleChange} className="p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500" />
                {/* SKU */}
                <input type="text" name="sku" placeholder="SKU" value={formData.sku} onChange={handleChange} className="p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500" required />
                {/* Weight */}
                <input type="number" name="weight" placeholder="Weight" value={formData.weight} onChange={handleChange} className="p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500" step="0.01" />
                {/* Warranty Information */}
                <input type="text" name="warrantyInformation" placeholder="Warranty Information" value={formData.warrantyInformation} onChange={handleChange} className="p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500" />
                {/* Shipping Information */}
                <input type="text" name="shippingInformation" placeholder="Shipping Information" value={formData.shippingInformation} onChange={handleChange} className="p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500" />
                {/* Availability Status */}
                <input type="text" name="availabilityStatus" placeholder="Availability Status" value={formData.availabilityStatus} onChange={handleChange} className="p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500" />
                {/* Description */}
                <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} className="p-2 border rounded-md col-span-full focus:ring-blue-500 focus:border-blue-500" rows="3" required></textarea>
                {/* Tags (JSON array input) */}
                <textarea name="tags" placeholder='Tags (comma-separated, e.g., tag1, tag2, tag3)' value={formData.tags} onChange={handleChange} className="p-2 border rounded-md col-span-full focus:ring-blue-500 focus:border-blue-500" rows="2"></textarea>
                
                <textarea name="dimensions" placeholder='Dimensions (comma-separated, e.g., width:10, height:20, length:30)' value={formData.dimensions} onChange={handleChange} className="p-2 border rounded-md col-span-full focus:ring-blue-500 focus:border-blue-500" rows="2"></textarea>
                {/* Reviews (comma-separated input) */}
                <textarea name="reviews" placeholder='Reviews (JSON array, e.g., [{"name": "John Doe", "rating": 4.5, "comment": "Great product!"}])' value={formData.reviews} onChange={handleChange} className="p-2 border rounded-md col-span-full focus:ring-blue-500 focus:border-blue-500" rows="2"></textarea>

                {/* Thumbnail Image Upload */}
                <div className="col-span-full">
                  <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700 mb-1">Thumbnail Image</label>
                  <input type="file" id="thumbnail" name="thumbnail" onChange={handleChange} className="mt-1 p-2 border rounded-md w-full file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                </div>
                {/* Product Images Upload */}
                <div className="col-span-full">
                  <label htmlFor="images" className="block text-sm font-medium text-gray-700 mb-1">Product Images</label>
                  <input type="file" id="images" name="images" onChange={handleChange} className="mt-1 p-2 border rounded-md w-full file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" multiple />
                </div>

                {/* Form Action Buttons */}
                <div className="col-span-full flex justify-end space-x-2 mt-4">
                  <button type="submit" className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md transition duration-200">
                    {currentProduct ? 'Update Product' : 'Add Product'}
                  </button>
                  <button type="button" onClick={handleCloseModal} className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-md transition duration-200">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Products Table */}
        <div className="overflow-x-auto rounded-lg shadow-sm border border-gray-200">
          <table className="min-w-full bg-white divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {productList.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 transition duration-150 ease-in-out">
                  <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-900">{p.id}</td>
                  <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-900">{p.title}</td>
                  <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-900">{p.category}</td>
                  <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-900">${p.price}</td>
                  <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-900">{p.stock}</td>
                  <td className="py-3 px-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => handleOpenModal(p)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded-md text-sm mr-2 transition duration-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => confirmDelete(p.id)}
                      className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-md text-sm transition duration-200"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal for Delete */}
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        message="Are you sure you want to delete this product? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setIsConfirmModalOpen(false)}
      />
    </React.Fragment> // Changed from </> to React.Fragment
  );
}
