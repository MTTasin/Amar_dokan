import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    fetchHeroSlides,
    createHeroSlide,
    updateHeroSlide,
    deleteHeroSlide,
    clearMutationStatus
} from '../../store/heroSlice';
import Spinner from '../../components/Spinner';
import { Edit, Trash2, PlusCircle } from 'lucide-react';

// --- Form Modal Component ---
const SlideFormModal = ({ slide, onClose, onSave, mutationStatus }) => {
    const [formData, setFormData] = useState({
        title: slide?.title || '',
        subtitle: slide?.subtitle || '',
        button_text: slide?.button_text || 'Shop Now',
        button_link: slide?.button_link || '/shop',
        is_active: slide?.is_active ?? true,
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(slide?.background_image_url || '');

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const slideFormData = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            slideFormData.append(key, value);
        });
        if (imageFile) {
            slideFormData.append('background_image', imageFile);
        }
        onSave(slide?.id, slideFormData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl">
                <h3 className="text-xl font-bold mb-6">{slide ? 'Edit Hero Slide' : 'Add New Hero Slide'}</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-text-secondary">Title</label>
                            <input type="text" name="title" value={formData.title} onChange={handleInputChange} className="mt-1 w-full form-input" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-secondary">Subtitle</label>
                            <input type="text" name="subtitle" value={formData.subtitle} onChange={handleInputChange} className="mt-1 w-full form-input" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-secondary">Button Text</label>
                            <input type="text" name="button_text" value={formData.button_text} onChange={handleInputChange} className="mt-1 w-full form-input" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-secondary">Button Link</label>
                            <input type="text" name="button_link" value={formData.button_link} onChange={handleInputChange} className="mt-1 w-full form-input" required />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-secondary">Background Image</label>
                        <input type="file" onChange={handleImageChange} className="mt-1 w-full" accept="image/*" />
                        {imagePreview && <img src={imagePreview} alt="Preview" className="mt-4 h-32 w-auto rounded-lg object-cover" />}
                    </div>
                    <div>
                        <label className="flex items-center gap-2">
                            <input type="checkbox" name="is_active" checked={formData.is_active} onChange={handleInputChange} />
                            Active
                        </label>
                    </div>
                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-lg">Cancel</button>
                        <button type="submit" disabled={mutationStatus === 'loading'} className="px-4 py-2 bg-brand-orange text-white rounded-lg disabled:bg-gray-400">
                            {mutationStatus === 'loading' ? 'Saving...' : 'Save Slide'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// --- Main List Component ---
const AdminHeroSlides = () => {
    const dispatch = useDispatch();
    const { slides, status, mutationStatus } = useSelector(state => state.hero);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingSlide, setEditingSlide] = useState(null);

    useEffect(() => {
        // Fetch slides if not already loaded
        if (status === 'idle') {
            dispatch(fetchHeroSlides());
        }
    }, [status, dispatch]);
    
    useEffect(() => {
        if (mutationStatus === 'succeeded') {
            setIsFormOpen(false);
            setEditingSlide(null);
            dispatch(clearMutationStatus());
        }
    }, [mutationStatus, dispatch]);

    const handleSave = (slideId, slideFormData) => {
        if (slideId) {
            dispatch(updateHeroSlide({ slideId, slideFormData }));
        } else {
            dispatch(createHeroSlide(slideFormData));
        }
    };

    const handleDelete = (slideId) => {
        if (window.confirm('Are you sure you want to delete this slide?')) {
            dispatch(deleteHeroSlide(slideId));
        }
    };

    if (status === 'loading') return <Spinner />;

    return (
        <div>
            {isFormOpen && (
                <SlideFormModal
                    slide={editingSlide}
                    onClose={() => setIsFormOpen(false)}
                    onSave={handleSave}
                    mutationStatus={mutationStatus}
                />
            )}
            <div className="flex justify-between items-center mb-6 border-b border-border-light pb-4">
                <h2 className="text-2xl font-bold text-text-primary">Manage Hero Carousel</h2>
                <button onClick={() => { setEditingSlide(null); setIsFormOpen(true); }} className="flex items-center gap-2 bg-brand-orange text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-90">
                    <PlusCircle size={20} /> Add Slide
                </button>
            </div>
            <div className="space-y-4">
                {slides.map(slide => (
                    <div key={slide.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                        <div className="flex items-center gap-4">
                            <img src={slide.background_image_url} alt={slide.title} className="w-24 h-16 object-cover rounded-md" />
                            <div>
                                <p className="font-semibold text-text-primary">{slide.title}</p>
                                <p className="text-sm text-text-secondary">{slide.button_link}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${slide.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {slide.is_active ? 'Active' : 'Inactive'}
                            </span>
                            <button onClick={() => { setEditingSlide(slide); setIsFormOpen(true); }} className="text-indigo-600 hover:text-indigo-900"><Edit size={18} /></button>
                            <button onClick={() => handleDelete(slide.id)} className="text-red-600 hover:text-red-900"><Trash2 size={18} /></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminHeroSlides;
