import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../store/authSlice';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    re_password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.auth);
  const { logo_url } = useSelector((state) => state.site.config);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(registerUser(formData));
  };

  const getErrorMessages = () => {
    if (!error) return null;
    if (typeof error === 'string') return <li>{error}</li>;
    if (typeof error === 'object') {
      return Object.entries(error).map(([field, messages]) => {
        const messageText = Array.isArray(messages) ? messages.join(', ') : messages;
        return <li key={field}>{`${field.replace(/_/g, ' ')}: ${messageText}`}</li>;
      });
    }
    return <li>An unexpected error occurred.</li>;
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background-light px-4 py-12">
      <div className="w-full max-w-lg p-8 space-y-8 bg-white rounded-2xl shadow-lg border border-border-light">
        <div className="text-center">
          <Link to="/">
            <img
              src={logo_url || "https://i.imgur.com/K9b2uFj.png"}
              alt="The প্রফেসর Logo"
              className="h-20 w-auto mx-auto mb-4"
            />
          </Link>
          <h2 className="text-3xl font-anton text-text-primary">Create an Account</h2>
          <p className="mt-2 text-text-secondary">Join the inner circle and define your style.</p>
        </div>

        {status === 'succeeded' ? (
          <div className="text-center p-4 bg-green-100 border border-green-300 rounded-lg">
            <h3 className="font-bold text-green-800">Registration Successful!</h3>
            <p className="text-green-700 mt-2">Please check your email to activate your account.</p>
          </div>
        ) : (
          <form className="space-y-6" onSubmit={handleSubmit}>
            <InputField
              name="name"
              type="text"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              icon={<User />}
              required
            />
            <InputField name="email" type="email" placeholder="Email Address" value={formData.email} onChange={handleChange} icon={<Mail />} required />
            <InputField name="password" type={showPassword ? 'text' : 'password'} placeholder="Password" value={formData.password} onChange={handleChange} icon={<Lock />} required>
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-secondary hover:text-text-primary">
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </InputField>
            <InputField name="re_password" type={showConfirmPassword ? 'text' : 'password'} placeholder="Confirm Password" value={formData.re_password} onChange={handleChange} icon={<Lock />} required>
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-secondary hover:text-text-primary">
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </InputField>

            {status === 'failed' && error && (
              <ul className="text-left text-red-700 text-sm list-disc list-inside p-2 bg-red-100 rounded-md">
                {getErrorMessages()}
              </ul>
            )}

            <div>
              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-brand-orange hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-orange disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {status === 'loading' ? 'Creating Account...' : 'Sign Up'}
              </button>
            </div>
          </form>
        )}

        <p className="text-sm text-center text-text-secondary">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-brand-orange hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

const InputField = ({ name, type, placeholder, value, onChange, icon, required = false, children }) => (
  <div className="relative">
    <span className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-secondary">{icon}</span>
    <input
      type={type}
      name={name}
      id={name}
      value={value}
      onChange={onChange}
      className="w-full pl-10 pr-10 py-3 bg-gray-200 border border-border-light rounded-lg text-text-primary focus:ring-2 focus:ring-brand-orange focus:outline-none"
      placeholder={placeholder}
      required={required}
    />
    {children}
  </div>
);

export default RegisterPage;
