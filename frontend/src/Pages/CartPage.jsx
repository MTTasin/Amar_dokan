import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { addItemToCart, removeItemFromCart, clearCart } from '../store/cartSlice';
import { Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';

const CartPage = () => {
  const dispatch = useDispatch();
  const { items: cartItems, totalAmount } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const CartItem = ({ item }) => (
    <div className="flex items-center justify-between p-4 border-b border-border-light">
      <div className="flex items-center gap-4">
        <img src={item.image} alt={item.name} className="w-20 h-24 object-cover rounded-md" />
        <div>
          <Link to={`/products/${item.id}`} className="font-semibold text-text-primary hover:text-brand-orange transition-colors">{item.name}</Link>
          <p className="text-text-secondary text-sm">${item.price.toFixed(2)}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center border border-border-light rounded-md">
          <button 
            onClick={() => dispatch(removeItemFromCart(item.id))}
            className="p-2 text-text-secondary hover:text-brand-orange"
          >
            <Minus size={16} />
          </button>
          <span className="px-4 text-text-primary font-semibold">{item.quantity}</span>
          <button 
            onClick={() => dispatch(addItemToCart(item))}
            className="p-2 text-text-secondary hover:text-brand-orange"
          >
            <Plus size={16} />
          </button>
        </div>
        <p className="font-bold text-text-primary w-24 text-right">${item.totalPrice.toFixed(2)}</p>
      </div>
    </div>
  );

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 text-center py-20">
        <ShoppingBag className="mx-auto h-24 w-24 text-text-secondary" />
        <h1 className="mt-8 text-4xl font-anton text-text-primary">Your Cart is Empty</h1>
        <p className="mt-4 text-text-secondary">Looks like you haven't added anything to your cart yet.</p>
        <Link 
          to="/shop" 
          className="mt-8 inline-block bg-brand-orange text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-opacity-90 transition-all duration-300"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-anton text-center text-text-primary mb-8">Shopping Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md border border-border-light">
          {cartItems.map(item => <CartItem key={item.id} item={item} />)}
          <div className="p-4 flex justify-end">
            <button 
              onClick={() => dispatch(clearCart())}
              className="flex items-center gap-2 text-sm text-text-secondary hover:text-red-500 transition-colors"
            >
              <Trash2 size={16} /> Clear Cart
            </button>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg p-6 sticky top-28 shadow-md border border-border-light">
            <h2 className="text-2xl font-semibold text-text-primary border-b border-border-light pb-4 mb-4">Order Summary</h2>
            <div className="flex justify-between text-text-secondary mb-2">
              <span>Subtotal</span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-text-secondary mb-4">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="flex justify-between text-text-primary font-bold text-xl border-t border-border-light pt-4 mt-4">
              <span>Total</span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>
            
            {/* UPDATED: Changed to a Link that navigates to the new checkout page */}
            <Link 
              to={isAuthenticated ? "/checkout" : "/login"}
              className="w-full text-center block mt-6 bg-brand-orange text-white font-bold py-3 rounded-lg text-lg hover:bg-opacity-90 transition-all"
            >
              {isAuthenticated ? 'Proceed to Checkout' : 'Login to Checkout'}
            </Link>

          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
