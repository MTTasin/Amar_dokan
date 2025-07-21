import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, Truck, LifeBuoy, CreditCard } from 'lucide-react';

const Footer = () => {
  const { items: allCategories } = useSelector((state) => state.categories);

  const facilities = [
    { icon: <Truck size={30} />, text: 'Free Shipping', subtext: 'On orders over $50' },
    { icon: <LifeBuoy size={30} />, text: '24/7 Support', subtext: 'Dedicated support' },
    { icon: <CreditCard size={30} />, text: 'Secure Payments', subtext: 'SSL Encrypted' },
  ];

  return (
    <footer className="bg-white text-text-secondary border-t border-border-light">
      {/* Facilities Section */}
      <div className="bg-background-light">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {facilities.map((facility, index) => (
                <div key={index} className="flex items-center justify-center gap-4">
                    <div className="text-brand-orange">{facility.icon}</div>
                    <div>
                        <h4 className="font-semibold text-text-primary">{facility.text}</h4>
                        <p className="text-sm">{facility.subtext}</p>
                    </div>
                </div>
            ))}
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-lg font-anton text-text-primary mb-4">THE প্রফেসর</h3>
            <p className="text-sm">Crafting the uniform for the modern intellectual.</p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-base font-semibold text-text-primary mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="hover:text-brand-orange text-sm transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-brand-orange text-sm transition-colors">Contact</Link></li>
              <li><Link to="/faq" className="hover:text-brand-orange text-sm transition-colors">FAQs</Link></li>
            </ul>
          </div>

          {/* Shop Categories */}
          <div>
            <h3 className="text-base font-semibold text-text-primary mb-4">Shop</h3>
            <ul className="space-y-2">
              <li><Link to="/shop" className="hover:text-brand-orange text-sm transition-colors">All Products</Link></li>
              {allCategories.slice(0, 4).map(category => (
                <li key={category.id}>
                  <Link to={`/shop?category=${category.slug}`} className="hover:text-brand-orange text-sm transition-colors">
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Follow Us */}
          <div>
            <h3 className="text-base font-semibold text-text-primary mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-brand-orange transition-colors"><Instagram size={24}/></a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-brand-orange transition-colors"><Facebook size={24}/></a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-brand-orange transition-colors"><Twitter size={24}/></a>
            </div>
          </div>
        </div>

        {/* Copyright & Developer Credit */}
        <div className="border-t border-border-light pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} The প্রফেসর. All Rights Reserved.</p>
          <p className="mt-2">
            Developed with ❤️ by <a href="mailto:m.t.tasin20@gmail.com" className="font-semibold text-brand-orange hover:underline">M.T. Tasin</a>.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
