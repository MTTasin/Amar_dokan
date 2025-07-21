import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
    createProduct, 
    updateProduct, 
    fetchProductById, 
    deleteProductImage,
    clearMutationStatus, 
    clearSelectedProduct 
} from '../../store/productsSlice';
import Spinner from '../../components/Spinner';
import { ArrowLeft, Trash2 } from 'lucide-react';

const AdminProductForm = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const isEditMode = Boolean(productId);

    const { details: productToEdit, status: productStatus } = useSelector(state => state.products.selectedProduct);
    const { mutationStatus, mutationError } = useSelector(state => state.products);
    const { items: categories } = useSelector(state => state.categories);
    const { colors, sizes } = useSelector(state => state.filters);

    // Form state
    const [formData, setFormData] = useState({
        name: '', description: '', price: '', stock_quantity: '',
        category_id: '', tag: '', is_available: true, is_featured: false,
        video_url: '', color_ids: [], size_ids: [],
    });
    const [mainImageFile, setMainImageFile] = useState(null);
    const [mainImagePreview, setMainImagePreview] = useState('');
    const [galleryImageFiles, setGalleryImageFiles] = useState([]);
    const [galleryImagePreviews, setGalleryImagePreviews] = useState([]);

    useEffect(() => {
        if (isEditMode) {
            dispatch(fetchProductById(productId));
        }
        return () => {
            dispatch(clearSelectedProduct());
            dispatch(clearMutationStatus());
        };
    }, [productId, dispatch, isEditMode]);

    useEffect(() => {
        if (isEditMode && productToEdit) {
            setFormData({
                name: productToEdit.name || '',
                description: productToEdit.description || '',
                price: productToEdit.price || '',
                stock_quantity: productToEdit.stock_quantity || '',
                category_id: productToEdit.category?.id || '',
                tag: productToEdit.tag || '',
                is_available: productToEdit.is_available,
                is_featured: productToEdit.is_featured,
                video_url: productToEdit.video_url || '',
                color_ids: productToEdit.colors?.map(c => c.id) || [],
                size_ids: productToEdit.sizes?.map(s => s.id) || [],
            });
            setMainImagePreview(productToEdit.image_url);
        }
    }, [isEditMode, productToEdit]);

    useEffect(() => {
        if (mutationStatus === 'succeeded') {
            navigate('/admin/products');
        }
    }, [mutationStatus, navigate]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleMultiSelectChange = (e, field) => {
        const { value, checked } = e.target;
        const id = parseInt(value, 10);
        setFormData(prev => {
            const currentIds = prev[field];
            return { ...prev, [field]: checked ? [...currentIds, id] : currentIds.filter(i => i !== id) };
        });
    };

    const handleMainImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setMainImageFile(file);
            setMainImagePreview(URL.createObjectURL(file));
        }
    };

    // UPDATED: This function now appends new files instead of replacing them.
    const handleGalleryImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            setGalleryImageFiles(prevFiles => [...prevFiles, ...files]);
            const newPreviews = files.map(file => URL.createObjectURL(file));
            setGalleryImagePreviews(prevPreviews => [...prevPreviews, ...newPreviews]);
        }
    };
    
    // NEW: Function to remove a newly selected gallery image from the preview list.
    const handleRemoveGalleryPreview = (indexToRemove) => {
        setGalleryImageFiles(prevFiles => prevFiles.filter((_, index) => index !== indexToRemove));
        setGalleryImagePreviews(prevPreviews => prevPreviews.filter((_, index) => index !== indexToRemove));
    };

    const handleDeleteGalleryImage = (imageId) => {
        if (window.confirm('Are you sure you want to delete this image?')) {
            dispatch(deleteProductImage({ productId, imageId }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const productFormData = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (Array.isArray(value)) {
                value.forEach(id => productFormData.append(key, id));
            } else {
                productFormData.append(key, value);
            }
        });

        if (mainImageFile) {
            productFormData.append('image', mainImageFile);
        }
        if (galleryImageFiles.length > 0) {
            galleryImageFiles.forEach(file => {
                productFormData.append('uploaded_images', file);
            });
        }

        if (isEditMode) {
            dispatch(updateProduct({ productId, productFormData }));
        } else {
            dispatch(createProduct(productFormData));
        }
    };
    
    if (isEditMode && productStatus === 'loading') return <Spinner />;

    return (
        <div>
            <Link to="/admin/products" className="flex items-center gap-2 text-sm text-text-secondary hover:text-brand-orange mb-6">
                <ArrowLeft size={18} /> Back to Product List
            </Link>
            <h2 className="text-2xl font-bold text-text-primary mb-6">{isEditMode ? 'Edit Product' : 'Add New Product'}</h2>
            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Text Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-text-secondary">Name</label>
                        <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="mt-1 w-full form-input" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-secondary">Price ($)</label>
                        <input type="number" name="price" value={formData.price} onChange={handleInputChange} className="mt-1 w-full form-input" step="0.01" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-secondary">Stock Quantity</label>
                        <input type="number" name="stock_quantity" value={formData.stock_quantity} onChange={handleInputChange} className="mt-1 w-full form-input" required />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-text-secondary">Category</label>
                        <select name="category_id" value={formData.category_id} onChange={handleInputChange} className="mt-1 w-full form-input" required>
                            <option value="">Select a category</option>
                            {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                        </select>
                    </div>
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-text-secondary">Description</label>
                    <textarea name="description" value={formData.description} onChange={handleInputChange} rows="5" className="mt-1 w-full form-input"></textarea>
                </div>

                {/* Main Image Upload */}
                <div>
                    <label className="block text-sm font-medium text-text-secondary">Main Product Image</label>
                    <input type="file" name="image" onChange={handleMainImageChange} className="mt-1 w-full" accept="image/*" />
                    {mainImagePreview && <img src={mainImagePreview} alt="Preview" className="mt-4 h-40 w-auto rounded-lg" />}
                </div>

                {/* Gallery Image Management */}
                <div>
                    <label className="block text-sm font-medium text-text-secondary">Gallery Images</label>
                    {isEditMode && productToEdit?.images?.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-4">
                            {productToEdit.images.map(image => (
                                <div key={image.id} className="relative">
                                    <img src={image.image} alt="Gallery item" className="h-24 w-24 object-cover rounded-lg" />
                                    <button type="button" onClick={() => handleDeleteGalleryImage(image.id)} className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1 transform translate-x-1/2 -translate-y-1/2">
                                        <Trash2 size={12} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                    <input type="file" name="gallery_images" onChange={handleGalleryImageChange} className="mt-4 w-full" accept="image/*" multiple />
                    {galleryImagePreviews.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-4">
                            {galleryImagePreviews.map((preview, index) => (
                                <div key={index} className="relative">
                                    <img src={preview} alt="New gallery preview" className="h-24 w-24 object-cover rounded-lg" />
                                    {/* NEW: Button to remove a newly selected image before upload */}
                                    <button type="button" onClick={() => handleRemoveGalleryPreview(index)} className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1 transform translate-x-1/2 -translate-y-1/2">
                                        <Trash2 size={12} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                
                {/* Multi-Select Checkboxes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-text-secondary">Colors</label>
                        <div className="mt-2 p-4 border border-border-light rounded-lg max-h-40 overflow-y-auto space-y-2">
                            {colors.items.map(color => (
                                <label key={color.id} className="flex items-center gap-2">
                                    <input type="checkbox" value={color.id} checked={formData.color_ids.includes(color.id)} onChange={(e) => handleMultiSelectChange(e, 'color_ids')} />
                                    {color.name}
                                </label>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-secondary">Sizes</label>
                         <div className="mt-2 p-4 border border-border-light rounded-lg max-h-40 overflow-y-auto space-y-2">
                            {sizes.items.map(size => (
                                <label key={size.id} className="flex items-center gap-2">
                                    <input type="checkbox" value={size.id} checked={formData.size_ids.includes(size.id)} onChange={(e) => handleMultiSelectChange(e, 'size_ids')} />
                                    {size.name}
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Other Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-text-secondary">Tag</label>
                        <select name="tag" value={formData.tag} onChange={handleInputChange} className="mt-1 w-full form-input">
                            <option value="">None</option>
                            <option value="new">New</option>
                            <option value="hot">Hot</option>
                            <option value="special">Special</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-secondary">Video URL (Optional)</label>
                        <input type="url" name="video_url" value={formData.video_url} onChange={handleInputChange} className="mt-1 w-full form-input" />
                    </div>
                </div>

                {/* Booleans */}
                <div className="flex items-center gap-8">
                    <label className="flex items-center gap-2">
                        <input type="checkbox" name="is_available" checked={formData.is_available} onChange={handleInputChange} />
                        Available for sale
                    </label>
                    <label className="flex items-center gap-2">
                        <input type="checkbox" name="is_featured" checked={formData.is_featured} onChange={handleInputChange} />
                        Featured product
                    </label>
                </div>

                <div className="pt-4 border-t border-border-light">
                    {mutationStatus === 'failed' && <p className="text-red-500 mb-4">Error: {mutationError}</p>}
                    <button type="submit" disabled={mutationStatus === 'loading'} className="bg-brand-orange text-white font-bold py-3 px-6 rounded-lg hover:bg-opacity-90 transition-colors disabled:bg-gray-400">
                        {mutationStatus === 'loading' ? 'Saving...' : (isEditMode ? 'Update Product' : 'Create Product')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AdminProductForm;
