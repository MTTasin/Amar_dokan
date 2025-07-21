// pages/LoginPage.jsx

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../store/authSlice';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated, status, error } = useSelector((state) => state.auth);
  const { logo_url } = useSelector((state) => state.site.config);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log("Attempting login with:", { email, password }); // Keep for debugging if needed
    dispatch(loginUser({ email, password }));
  };
  
  const getErrorMessage = () => {
    if (!error) return null;
    if (typeof error === 'string') return error;
    if (error.detail) return error.detail;
    if (typeof error === 'object') {
        return JSON.stringify(error, null, 2); 
    }
    return 'An unknown error occurred.';
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background-light px-4">
      {/* Changed bg-neutral-900 to bg-white, added shadow and border */}
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-lg border border-border-light">
        <div className="text-center">
            <Link to="/">
                <img 
                  src={logo_url || "https://i.imgur.com/K9b2uFj.png"} 
                  alt="The প্রফেসর Logo" 
                  className="h-20 w-auto mx-auto mb-4" 
                />
            </Link>
          {/* Changed text-white to text-text-primary */}
          <h2 className="text-3xl font-anton text-text-primary">Welcome Back</h2>
          <p className="mt-2 text-text-secondary">Sign in to continue to your account.</p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="relative">
            {/* Changed text-gray-500 to text-text-secondary */}
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-secondary" />
            <input
              type="email"
              name="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-3 py-3 bg-gray-200 border border-border-light rounded-lg text-text-primary focus:ring-2 focus:ring-brand-orange focus:outline-none"
              placeholder="Email address"
              required
            />
          </div>
          {/* Password Input */}
          <div className="relative">
            {/* Changed text-gray-500 to text-text-secondary */}
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-secondary" />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-10 py-3 bg-gray-200 border border-border-light rounded-lg text-text-primary focus:ring-2 focus:ring-brand-orange focus:outline-none"
              placeholder="Password"
              required
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-secondary hover:text-text-primary"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {/* Error Message */}
          {status === 'failed' && error && (
            <div className="text-center text-red-700 text-sm p-2 bg-red-100 rounded-md">
                {getErrorMessage()}
            </div>
          )}
          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-brand-orange hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-orange disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {status === 'loading' ? 'Signing In...' : 'Sign In'}
            </button>
          </div>
        </form>
        {/* Changed text-gray-400 to text-text-secondary */}
        <p className="text-sm text-center text-text-secondary">
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-brand-orange hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
