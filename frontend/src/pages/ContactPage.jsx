import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Mail, Phone, MapPin, Clock, ChevronDown } from 'lucide-react';
import Spinner from '../components/Spinner.jsx';

// --- Sub-components for ContactPage ---

const FaqItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-border-light py-4">
            <button
                className="w-full flex justify-between items-center text-left"
                onClick={() => setIsOpen(!isOpen)}
            >
                <h4 className="font-semibold text-text-primary">{question}</h4>
                <ChevronDown size={20} className={`transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="mt-3 text-text-secondary">
                    <p>{answer}</p>
                </div>
            )}
        </div>
    );
};

// --- Main ContactPage Component ---

const ContactPage = () => {
    const { config, status } = useSelector((state) => state.site);

    const faqs = [
        { q: 'What are your shipping options?', a: 'We offer standard and express shipping. Standard shipping takes 5-7 business days, while express takes 2-3 business days. All orders over $50 qualify for free standard shipping.' },
        { q: 'How can I track my order?', a: 'Once your order has shipped, you will receive an email with a tracking number and a link to the carrier\'s website.' },
        { q: 'What is your return policy?', a: 'We accept returns within 30 days of purchase for a full refund or exchange. Items must be in their original condition with tags attached. Please visit our returns portal to initiate a return.' },
        { q: 'Do you ship internationally?', a: 'Yes, we ship to most countries worldwide. International shipping rates and times vary by destination.' },
    ];

    if (status === 'loading') {
        return <div className="min-h-screen flex items-center justify-center"><Spinner /></div>;
    }

    return (
        <div className="bg-background-light">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-anton uppercase text-text-primary tracking-wider">Contact Us</h1>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-text-secondary">
                        We're here to help. Reach out to us with any questions or feedback.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* --- Contact Form --- */}
                    <div className="bg-white p-8 rounded-lg shadow-md border border-border-light">
                        <h2 className="text-2xl font-bold mb-6 text-text-primary">Send us a Message</h2>
                        <form className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-text-secondary">Full Name</label>
                                <input type="text" id="name" name="name" className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-border-light rounded-md focus:outline-none focus:ring-brand-orange focus:border-brand-orange" />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-text-secondary">Email Address</label>
                                <input type="email" id="email" name="email" className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-border-light rounded-md focus:outline-none focus:ring-brand-orange focus:border-brand-orange" />
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-text-secondary">Message</label>
                                <textarea id="message" name="message" rows="5" className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-border-light rounded-md focus:outline-none focus:ring-brand-orange focus:border-brand-orange"></textarea>
                            </div>
                            <div>
                                <button type="submit" className="w-full bg-brand-orange text-white font-bold py-3 px-4 rounded-lg hover:bg-opacity-90 transition-colors">
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* --- Contact Info --- */}
                    <div className="space-y-8">
                        <div className="bg-white p-8 rounded-lg shadow-md border border-border-light space-y-6">
                            <h3 className="text-xl font-semibold text-text-primary">Contact Information</h3>
                            <div className="flex items-start gap-4">
                                <MapPin className="text-brand-orange mt-1 flex-shrink-0" size={20} />
                                <div>
                                    <h4 className="font-semibold text-text-primary">Address</h4>
                                    <p className="text-text-secondary">{config.contact_address || "123 Style Avenue, Fashion City, 54321"}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <Phone className="text-brand-orange mt-1 flex-shrink-0" size={20} />
                                <div>
                                    <h4 className="font-semibold text-text-primary">Phone</h4>
                                    <p className="text-text-secondary">{config.contact_phone || "+1 (234) 567-890"}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <Mail className="text-brand-orange mt-1 flex-shrink-0" size={20} />
                                <div>
                                    <h4 className="font-semibold text-text-primary">Email</h4>
                                    <a href={`mailto:${config.contact_email}`} className="text-text-secondary hover:text-brand-orange">{config.contact_email || "contact@theprofesor.com"}</a>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <Clock className="text-brand-orange mt-1 flex-shrink-0" size={20} />
                                <div>
                                    <h4 className="font-semibold text-text-primary">Working Hours</h4>
                                    <p className="text-text-secondary">Monday - Friday: 9:00 AM - 6:00 PM</p>
                                    <p className="text-text-secondary">Saturday: 10:00 AM - 4:00 PM</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-8 rounded-lg shadow-md border border-border-light">
                            <h3 className="text-xl font-semibold text-text-primary mb-4">Frequently Asked Questions</h3>
                            <div>
                                {faqs.map(faq => <FaqItem key={faq.q} question={faq.q} answer={faq.a} />)}
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- Map Section --- */}
                <div className="mt-16">
                    <div className="aspect-w-16 aspect-h-9 bg-gray-300 rounded-lg shadow-md overflow-hidden">
                        <iframe 
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.086438997744!2d144.9537353153167!3d-37.81720997975189!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642af0f11fd81%3A0x5045675218ce7e0!2sMelbourne%20VIC%2C%20Australia!5e0!3m2!1sen!2sus!4v1627000000000!5m2!1sen!2sus"
                            width="100%" 
                            height="450" 
                            style={{ border: 0 }}
                            allowFullScreen="" 
                            loading="lazy"
                            title="Store Location"
                        ></iframe>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
