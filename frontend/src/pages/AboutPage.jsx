import React from 'react';
import { useSelector } from 'react-redux';
import { Mail, Phone, MapPin, Linkedin, Twitter } from 'lucide-react';
import Spinner from '../components/Spinner.jsx';

// FIXED: Fully defined the TeamMemberCard component
const TeamMemberCard = ({ name, role, imageUrl, socialLinks }) => (
    <div className="text-center">
        <img 
            src={imageUrl} 
            alt={`Portrait of ${name}`}
            className="w-40 h-40 mx-auto rounded-full object-cover shadow-lg mb-4"
        />
        <h4 className="text-xl font-semibold text-text-primary">{name}</h4>
        <p className="text-brand-orange">{role}</p>
        <div className="flex justify-center space-x-4 mt-3">
            <a href={socialLinks.twitter} className="text-text-secondary hover:text-brand-orange"><Twitter /></a>
            <a href={socialLinks.linkedin} className="text-text-secondary hover:text-brand-orange"><Linkedin /></a>
        </div>
    </div>
);

// Helper to get YouTube embed URL (can be moved to a utils file)
const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;
    try {
        const urlObj = new URL(url);
        const videoId = urlObj.searchParams.get('v');
        return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    } catch (error) {
        return null;
    }
};

// --- Main AboutPage Component ---

const AboutPage = () => {
    const { config, status } = useSelector((state) => state.site);
    const embedUrl = getYouTubeEmbedUrl(config.brand_video_url);

    const team = [
        { name: 'John Doe', role: 'Founder & CEO', imageUrl: 'https://placehold.co/400x400/EFEFEF/333?text=JD', socialLinks: { twitter: '#', linkedin: '#' } },
        { name: 'Jane Smith', role: 'Lead Designer', imageUrl: 'https://placehold.co/400x400/EFEFEF/333?text=JS', socialLinks: { twitter: '#', linkedin: '#' } },
        { name: 'Sam Wilson', role: 'Head of Marketing', imageUrl: 'https://placehold.co/400x400/EFEFEF/333?text=SW', socialLinks: { twitter: '#', linkedin: '#' } },
    ];

    if (status === 'loading') {
        return <div className="min-h-screen flex items-center justify-center"><Spinner /></div>;
    }

    return (
        <div className="bg-background-light">
            {/* --- Hero Section --- */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <div className="order-2 md:order-1">
                        <h1 className="text-4xl md:text-5xl font-anton uppercase text-text-primary mb-6">
                            {config.about_title || "Who is The প্রফেসর?"}
                        </h1>
                        <div className="prose max-w-none text-text-secondary leading-relaxed space-y-4 whitespace-pre-wrap">
                            <p>{config.about_story || "Our story..."}</p>
                        </div>
                    </div>
                    <div className="order-1 md:order-2">
                        <img 
                            src={config.about_image_url || "https://placehold.co/600x600/F36523/1a1a1a?text=The+Brand+Story"} 
                            alt="The প্রফেসর Brand Aesthetic" 
                            className="rounded-lg shadow-2xl w-full h-auto object-cover" 
                        />
                    </div>
                </div>
            </div>

            {/* --- Mission Statement Section --- */}
            <div className="bg-white py-20">
                <div className="text-center max-w-3xl mx-auto px-4">
                    <h2 className="text-3xl font-anton text-brand-orange mb-4">Our Mission</h2>
                    <p className="text-text-secondary text-lg leading-relaxed whitespace-pre-wrap">
                        {config.about_mission || "Our mission..."}
                    </p>
                </div>
            </div>

            {/* --- Team Section --- */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <h2 className="text-4xl font-anton text-center text-text-primary mb-12">Meet Our Team</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-12">
                    {team.map(member => <TeamMemberCard key={member.name} {...member} />)}
                </div>
            </div>

            {/* --- Video Section --- */}
            <div className="bg-gray-800 py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
                    <h2 className="text-4xl font-anton">A GLIMPSE BEHIND THE SEAMS</h2>
                    <p className="mt-4 max-w-2xl mx-auto">Discover the process and dedication that define our brand.</p>
                    <div className="mt-8">
                        <div className="aspect-video max-w-3xl mx-auto bg-black rounded-lg shadow-lg">
                            {embedUrl ? (
                                <iframe
                                    width="100%"
                                    height="100%"
                                    src={embedUrl}
                                    title="YouTube video player"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    className="rounded-lg"
                                ></iframe>
                            ) : (
                                <div className="flex items-center justify-center h-full">
                                    <p className="text-gray-400">Video not available.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* --- Physical Store Section --- */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <h2 className="text-4xl font-anton text-center text-text-primary mb-12">Visit Our Flagship Store</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div>
                        <div className="aspect-video bg-gray-300 rounded-lg shadow-md">
                            <iframe 
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.086438997744!2d144.9537353153167!3d-37.81720997975189!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642af0f11fd81%3A0x5045675218ce7e0!2sMelbourne%20VIC%2C%20Australia!5e0!3m2!1sen!2sus!4v1627000000000!5m2!1sen!2sus"
                                width="100%" 
                                height="100%" 
                                style={{ border: 0 }}
                                allowFullScreen="" 
                                loading="lazy"
                                title="Store Location"
                                className="rounded-lg"
                            ></iframe>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-start gap-4">
                            <MapPin className="text-brand-orange mt-1 flex-shrink-0" size={24} />
                            <div>
                                <h4 className="font-semibold text-text-primary">Address</h4>
                                <p>{config.contact_address || "123 Style Avenue, Fashion City, 54321"}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <Phone className="text-brand-orange mt-1 flex-shrink-0" size={24} />
                            <div>
                                <h4 className="font-semibold text-text-primary">Phone</h4>
                                <p>{config.contact_phone || "+1 (234) 567-890"}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <Mail className="text-brand-orange mt-1 flex-shrink-0" size={24} />
                            <div>
                                <h4 className="font-semibold text-text-primary">Email</h4>
                                <a href={`mailto:${config.contact_email}`} className="hover:text-brand-orange">{config.contact_email || "contact@theprofesor.com"}</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

TeamMemberCard.defaultProps = { socialLinks: {} };
export default AboutPage;
