import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { FaTimes } from 'react-icons/fa';

const AuthGate = ({ isOpen, onClose, onSubmit, contractData }) => {
  const { loginWithRedirect } = useAuth0();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    country: ''
  });
  const [showForm, setShowForm] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSignUp = () => {
    setShowForm(true);
  };

  const handleSignIn = () => {
    // Store contract data for post-auth submission
    localStorage.setItem('pendingSubmission', JSON.stringify({
      contractData,
      timestamp: Date.now()
    }));
    
    loginWithRedirect({
      appState: { returnTo: '/dashboard' }
    });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    
    const selectedRole = localStorage.getItem('selectedRole') || 'client';
    
    // Store both registration and contract data
    localStorage.setItem('pendingSubmission', JSON.stringify({
      registrationData: {
        ...formData,
        role: selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)
      },
      contractData,
      timestamp: Date.now()
    }));
    
    // Redirect to Auth0 for authentication
    loginWithRedirect({
      appState: { returnTo: '/dashboard' }
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <FaTimes size={20} />
        </button>

        {!showForm ? (
          <>
            {/* Logo/Brand */}
            <div className="text-center mb-6">
              <h1 className="text-4xl font-bold mb-2">
                <span className="text-gray-900">Es</span>
                <span className="text-escon-green">con</span>
              </h1>
              <p className="text-gray-600 text-sm">Secure Escrow Service</p>
            </div>

            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Almost there!
              </h2>
              <p className="text-gray-600">
                Create an account to submit your contract
              </p>
            </div>

            {/* Sign Up Button */}
            <button
              onClick={handleSignUp}
              className="w-full py-3 bg-escon-green hover:bg-escon-green-hover text-black font-bold rounded-lg transition-all shadow-md hover:shadow-lg mb-4"
            >
              Sign Up
            </button>

            {/* Divider */}
            <div className="my-6 flex items-center">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="px-4 text-sm text-gray-500">OR</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>

            {/* Sign In Button */}
            <button
              onClick={handleSignIn}
              className="w-full py-3 bg-white border-2 border-gray-300 hover:border-escon-green text-gray-900 font-bold rounded-lg transition-all"
            >
              Sign In
            </button>

            {/* Footer */}
            <p className="text-center text-xs text-gray-500 mt-6">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
          </>
        ) : (
          <>
            {/* Registration Form */}
            <div className="text-center mb-6">
              <h1 className="text-4xl font-bold mb-2">
                <span className="text-gray-900">Es</span>
                <span className="text-escon-green">con</span>
              </h1>
              <p className="text-gray-600 text-sm">Secure Escrow Service</p>
            </div>

            <div className="mb-6">
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-600 hover:text-gray-900 mb-4 flex items-center"
              >
                ← Back
              </button>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Tell us about yourself
              </h2>
              <p className="text-gray-600 text-sm">
                We'll create your account after authentication
              </p>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-escon-green focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-escon-green focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Country *
                </label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-escon-green focus:border-transparent"
                >
                  <option value="">Select your country</option>
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Canada">Canada</option>
                  <option value="Australia">Australia</option>
                  <option value="Germany">Germany</option>
                  <option value="France">France</option>
                  <option value="India">India</option>
                  <option value="China">China</option>
                  <option value="Japan">Japan</option>
                  <option value="Brazil">Brazil</option>
                  <option value="Mexico">Mexico</option>
                  <option value="Spain">Spain</option>
                  <option value="Italy">Italy</option>
                  <option value="Netherlands">Netherlands</option>
                  <option value="Sweden">Sweden</option>
                  <option value="Switzerland">Switzerland</option>
                  <option value="Singapore">Singapore</option>
                  <option value="South Africa">South Africa</option>
                  <option value="Nigeria">Nigeria</option>
                  <option value="Kenya">Kenya</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-escon-green hover:bg-escon-green-hover text-black font-bold rounded-lg transition-all shadow-md hover:shadow-lg"
              >
                Continue to Authentication
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthGate;
