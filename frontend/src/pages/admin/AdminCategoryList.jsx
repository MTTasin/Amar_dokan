import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
    fetchCategories, 
    createCategory, 
    updateCategory, 
    deleteCategory,
    clearMutationStatus
} from '../../store/categoriesSlice';
import Spinner from '../../components/Spinner';
import { Edit, Trash2, PlusCircle } from 'lucide-react';

const AdminCategoryList = () => {
    const dispatch = useDispatch();
    const { items: categories, status, mutationStatus, mutationError } = useSelector(state => state.categories);

    // State for the form (for both creating and editing)
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentCategory, setCurrentCategory] = useState(null);
    const [formData, setFormData] = useState({ name: '' });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');

    useEffect(() => {
        dispatch(clearMutationStatus());
    }, [dispatch]);

    useEffect(() => {
        if (mutationStatus === 'succeeded') {
            closeForm();
        }
    }, [mutationStatus]);

    const openFormForCreate = () => {
        setIsEditMode(false);
        setCurrentCategory(null);
        setFormData({ name: '' });
        setImageFile(null);
        setImagePreview('');
        setIsFormOpen(true);
    };

    const openFormForEdit = (category) => {
        setIsEditMode(true);
        setCurrentCategory(category);
        setFormData({ name: category.name });
        setImageFile(null);
        setImagePreview(category.image_url || '');
        setIsFormOpen(true);
    };

    const closeForm = () => {
        setIsFormOpen(false);
        dispatch(clearMutationStatus());
    };

    const handleDelete = (categoryId) => {
        if (window.confirm('Are you sure you want to delete this category? This might affect existing products.')) {
            dispatch(deleteCategory(categoryId));
        }
    };

    // NEW: Handler for the featured toggle switch
    const handleFeatureToggle = (category) => {
        const categoryFormData = new FormData();
        categoryFormData.append('name', category.name); // Name is required by the serializer
        categoryFormData.append('is_featured', !category.is_featured);
        // We don't need to send the image again for a simple toggle
        dispatch(updateCategory({ categoryId: category.id, categoryFormData }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const categoryFormData = new FormData();
        categoryFormData.append('name', formData.name);
        if (imageFile) {
            categoryFormData.append('image', imageFile);
        }
        // Also send the featured status from the form if editing
        if (isEditMode && currentCategory) {
            categoryFormData.append('is_featured', currentCategory.is_featured);
        }

        if (isEditMode) {
            dispatch(updateCategory({ categoryId: currentCategory.id, categoryFormData }));
        } else {
            dispatch(createCategory(categoryFormData));
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    if (status === 'loading') {
        return <div className="flex justify-center py-10"><Spinner /></div>;
    }

    return (
        <div>
            {isFormOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
                        <h3 className="text-xl font-bold mb-6">{isEditMode ? 'Edit Category' : 'Add New Category'}</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-text-secondary">Category Name</label>
                                <input 
                                    type="text" 
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="mt-1 w-full form-input" 
                                    required 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-secondary">Category Image (Optional)</label>
                                <input type="file" onChange={handleImageChange} className="mt-1 w-full" accept="image/*" />
                                {imagePreview && <img src={imagePreview} alt="Preview" className="mt-4 h-24 w-auto rounded-lg" />}
                            </div>
                            {mutationStatus === 'failed' && <p className="text-red-500 text-sm">Error: {mutationError}</p>}
                            <div className="flex justify-end gap-4 pt-4">
                                <button type="button" onClick={closeForm} className="px-4 py-2 bg-gray-200 rounded-lg">Cancel</button>
                                <button type="submit" disabled={mutationStatus === 'loading'} className="px-4 py-2 bg-brand-orange text-white rounded-lg disabled:bg-gray-400">
                                    {mutationStatus === 'loading' ? 'Saving...' : 'Save'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="flex justify-between items-center mb-6 border-b border-border-light pb-4">
                <h2 className="text-2xl font-bold text-text-primary">Manage Categories</h2>
                <button
                    onClick={openFormForCreate}
                    className="flex items-center gap-2 bg-brand-orange text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-90 transition-colors"
                >
                    <PlusCircle size={20} />
                    Add Category
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Category</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Featured</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {categories.map(category => (
                            <tr key={category.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10">
                                            <img className="h-10 w-10 rounded-lg object-cover bg-gray-100" src={category.image_url || 'https://placehold.co/100x100/EFEFEF/333?text=No+Img'} alt={category.name} />
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-text-primary">{category.name}</div>
                                        </div>
                                    </div>
                                </td>
                                {/* NEW: Featured Toggle Switch */}
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <label htmlFor={`featured-${category.id}`} className="flex items-center cursor-pointer">
                                        <div className="relative">
                                            <input 
                                                type="checkbox" 
                                                id={`featured-${category.id}`} 
                                                className="sr-only" 
                                                checked={category.is_featured}
                                                onChange={() => handleFeatureToggle(category)}
                                            />
                                            <div className="block bg-gray-200 w-10 h-6 rounded-full"></div>
                                            <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${category.is_featured ? 'translate-x-4 !bg-brand-orange' : ''}`}></div>
                                        </div>
                                    </label>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => openFormForEdit(category)} className="text-indigo-600 hover:text-indigo-900 mr-4">
                                        <Edit size={18} />
                                    </button>
                                    <button onClick={() => handleDelete(category.id)} className="text-red-600 hover:text-red-900">
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminCategoryList;
