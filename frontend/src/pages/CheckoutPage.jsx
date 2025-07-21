import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { createOrder, resetCreateStatus } from '../store/ordersSlice';
import { clearCart } from '../store/cartSlice';
import Spinner from '../components/Spinner';

const CheckoutPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { items: cartItems, totalAmount } = useSelector(state => state.cart);
    const { createStatus, createError } = useSelector(state => state.orders);
    const { user } = useSelector(state => state.auth);

    const [formData, setFormData] = useState({
        shipping_address: '',
        city: '',
        postal_code: '',
        card_number: '',
        expiry_date: '',
        cvc: '',
    });

    useEffect(() => {
        // If the order is created successfully, clear the cart and redirect
        if (createStatus === 'succeeded') {
            dispatch(clearCart());
            dispatch(resetCreateStatus());
            navigate('/dashboard/orders');
        }
        // Cleanup on unmount
        return () => dispatch(resetCreateStatus());
    }, [createStatus, dispatch, navigate]);

    // Redirect if cart is empty
    useEffect(() => {
        if (cartItems.length === 0 && createStatus !== 'loading') {
            navigate('/cart');
        }
    }, [cartItems, navigate, createStatus]);


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const orderData = {
            shipping_address: formData.shipping_address,
            city: formData.city,
            postal_code: formData.postal_code,
            cart: cartItems.map(item => ({
                product_id: item.id,
                quantity: item.quantity,
            })),
        };
        dispatch(createOrder(orderData));
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-4xl font-anton text-center text-text-primary mb-12">Checkout</h1>
            
            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
                {/* Shipping & Payment Details */}
                <div className="lg:col-span-2 bg-white p-8 rounded-lg shadow-md border border-border-light space-y-8">
                    {/* Shipping Address */}
                    <section>
                        <h2 className="text-2xl font-semibold text-text-primary mb-6">Shipping Address</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="sm:col-span-2">
                                <label className="block text-sm font-medium text-text-secondary">Full Name</label>
                                <input type="text" defaultValue={user?.name} className="mt-1 w-full form-input bg-gray-100" readOnly />
                            </div>
                            <div className="sm:col-span-2">
                                <label className="block text-sm font-medium text-text-secondary">Street Address</label>
                                <input type="text" name="shipping_address" value={formData.shipping_address} onChange={handleInputChange} className="mt-1 w-full form-input" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-secondary">City</label>
                                <input type="text" name="city" value={formData.city} onChange={handleInputChange} className="mt-1 w-full form-input" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-secondary">Postal Code</label>
                                <input type="text" name="postal_code" value={formData.postal_code} onChange={handleInputChange} className="mt-1 w-full form-input" required />
                            </div>
                        </div>
                    </section>

                    {/* Mock Payment Details */}
                    <section>
                        <h2 className="text-2xl font-semibold text-text-primary mb-6">Payment Details</h2>
                        <p className="text-sm text-text-secondary mb-4">This is a mock payment form. Do not enter real credit card details.</p>
                        <div className="space-y-6">
                             <div>
                                <label className="block text-sm font-medium text-text-secondary">Card Number</label>
                                <input type="text" name="card_number" value={formData.card_number} onChange={handleInputChange} placeholder="4242 4242 4242 4242" className="mt-1 w-full form-input" required />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-text-secondary">Expiry Date</label>
                                    <input type="text" name="expiry_date" value={formData.expiry_date} onChange={handleInputChange} placeholder="MM/YY" className="mt-1 w-full form-input" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-text-secondary">CVC</label>
                                    <input type="text" name="cvc" value={formData.cvc} onChange={handleInputChange} placeholder="123" className="mt-1 w-full form-input" required />
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg p-6 sticky top-28 shadow-md border border-border-light">
                        <h2 className="text-2xl font-semibold text-text-primary border-b border-border-light pb-4 mb-4">Your Order</h2>
                        <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
                            {cartItems.map(item => (
                                <div key={item.id} className="flex justify-between items-center text-sm">
                                    <span className="text-text-primary">{item.name} &times; {item.quantity}</span>
                                    <span className="font-medium text-text-secondary">${item.totalPrice.toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between text-text-primary font-bold text-xl border-t border-border-light pt-4 mt-4">
                            <span>Total</span>
                            <span>${totalAmount.toFixed(2)}</span>
                        </div>
                        {createError && <p className="text-red-500 text-sm mt-4">Error: {createError}</p>}
                        <button 
                            type="submit"
                            disabled={createStatus === 'loading'}
                            className="w-full text-center block mt-6 bg-brand-orange text-white font-bold py-3 rounded-lg text-lg hover:bg-opacity-90 transition-all disabled:bg-gray-400"
                        >
                            {createStatus === 'loading' ? <Spinner /> : `Place Order ($${totalAmount.toFixed(2)})`}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default CheckoutPage;
