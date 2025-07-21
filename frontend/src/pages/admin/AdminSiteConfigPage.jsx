import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateSiteConfig, clearUpdateStatus } from '../../store/siteSlice';
import Spinner from '../../components/Spinner';

const AdminSiteConfigPage = () => {
    const dispatch = useDispatch();
    const { config, status, updateStatus, updateError } = useSelector(state => state.site);

    const [formData, setFormData] = useState({});
    const [logoFile, setLogoFile] = useState(null);
    const [logoPreview, setLogoPreview] = useState('');
    const [aboutImageFile, setAboutImageFile] = useState(null);
    const [aboutImagePreview, setAboutImagePreview] = useState('');

    useEffect(() => {
        if (config) {
            setFormData({
                site_name: config.site_name || '',
                about_title: config.about_title || '',
                about_story: config.about_story || '',
                about_mission: config.about_mission || '',
                contact_email: config.contact_email || '',
                contact_phone: config.contact_phone || '',
                contact_address: config.contact_address || '',
                brand_video_url: config.brand_video_url || '', // Add new field to state
            });
            setLogoPreview(config.logo_url || '');
            setAboutImagePreview(config.about_image_url || '');
        }
    }, [config]);

    useEffect(() => {
        return () => {
            dispatch(clearUpdateStatus());
        };
    }, [dispatch]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setLogoFile(file);
            setLogoPreview(URL.createObjectURL(file));
        }
    };

    const handleAboutImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAboutImageFile(file);
            setAboutImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const configFormData = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            configFormData.append(key, value);
        });
        if (logoFile) {
            configFormData.append('logo', logoFile);
        }
        if (aboutImageFile) {
            configFormData.append('about_image', aboutImageFile);
        }
        dispatch(updateSiteConfig(configFormData));
    };

    if (status === 'loading') {
        return <Spinner />;
    }

    return (
        <div>
            <div className="mb-6 border-b border-border-light pb-4">
                <h2 className="text-2xl font-bold text-text-primary">Site Configuration</h2>
                <p className="text-sm text-text-secondary mt-1">Update general site settings, branding, and content.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* General Settings */}
                <div className="p-6 border border-border-light rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">General</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-text-secondary">Site Name</label>
                            <input type="text" name="site_name" value={formData.site_name} onChange={handleInputChange} className="mt-1 w-full form-input" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-secondary">Logo</label>
                            <input type="file" name="logo" onChange={handleLogoChange} className="mt-1 w-full" accept="image/*" />
                            {logoPreview && <img src={logoPreview} alt="Logo Preview" className="mt-4 h-16 w-auto bg-gray-100 p-2 rounded-lg" />}
                        </div>
                        {/* NEW: Input for Brand Video URL */}
                        <div>
                            <label className="block text-sm font-medium text-text-secondary">Brand Video URL</label>
                            <input type="url" name="brand_video_url" value={formData.brand_video_url} onChange={handleInputChange} placeholder="https://www.youtube.com/watch?v=..." className="mt-1 w-full form-input" />
                        </div>
                    </div>
                </div>

                {/* About Page Content */}
                <div className="p-6 border border-border-light rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">About Page Content</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-text-secondary">About Title</label>
                            <input type="text" name="about_title" value={formData.about_title} onChange={handleInputChange} className="mt-1 w-full form-input" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-secondary">About Story</label>
                            <textarea name="about_story" value={formData.about_story} onChange={handleInputChange} rows="5" className="mt-1 w-full form-input"></textarea>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-secondary">About Mission</label>
                            <textarea name="about_mission" value={formData.about_mission} onChange={handleInputChange} rows="3" className="mt-1 w-full form-input"></textarea>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-secondary">About Page Image</label>
                            <input type="file" name="about_image" onChange={handleAboutImageChange} className="mt-1 w-full" accept="image/*" />
                            {aboutImagePreview && <img src={aboutImagePreview} alt="About Preview" className="mt-4 h-32 w-auto rounded-lg" />}
                        </div>
                    </div>
                </div>
                
                {/* Contact Info */}
                <div className="p-6 border border-border-light rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-text-secondary">Contact Email</label>
                            <input type="email" name="contact_email" value={formData.contact_email} onChange={handleInputChange} className="mt-1 w-full form-input" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-secondary">Contact Phone</label>
                            <input type="text" name="contact_phone" value={formData.contact_phone} onChange={handleInputChange} className="mt-1 w-full form-input" />
                        </div>
                    </div>
                    <div className="mt-4">
                        <label className="block text-sm font-medium text-text-secondary">Contact Address</label>
                        <input type="text" name="contact_address" value={formData.contact_address} onChange={handleInputChange} className="mt-1 w-full form-input" />
                    </div>
                </div>

                {/* Submission */}
                <div className="pt-4">
                    {updateStatus === 'succeeded' && <p className="text-green-600 mb-4">Configuration saved successfully!</p>}
                    {updateStatus === 'failed' && <p className="text-red-500 mb-4">Error: {updateError}</p>}
                    <button type="submit" disabled={updateStatus === 'loading'} className="bg-brand-orange text-white font-bold py-3 px-6 rounded-lg hover:bg-opacity-90 transition-colors disabled:bg-gray-400">
                        {updateStatus === 'loading' ? 'Saving...' : 'Save Configuration'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AdminSiteConfigPage;
