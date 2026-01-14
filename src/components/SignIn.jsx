import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

const SignIn = () => {
  const navigate = useNavigate();
  const { loginWithRedirect } = useAuth0();

  const handleSignIn = () => {
    loginWithRedirect();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">
            <span className="text-gray-900">Es</span>
            <span className="text-escon-green">con</span>
          </h1>
          <p className="text-gray-600">Secure Escrow Service</p>
        </div>

        {/* Sign In Button */}
        <div className="space-y-4">
          <button 
            onClick={handleSignIn}
            className="w-full py-3 bg-escon-green hover:bg-escon-green-hover text-black font-bold rounded-lg transition-all shadow-md hover:shadow-lg"
          >
            Sign In
          </button>
        </div>

        {/* Divider */}
        <div className="my-6 flex items-center">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="px-4 text-sm text-gray-500">OR</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        {/* Sign Up Button */}
        <button
          onClick={() => navigate('/')}
          className="w-full py-3 bg-white border-2 border-gray-300 hover:border-escon-green text-gray-900 font-bold rounded-lg transition-all"
        >
          Create an account
        </button>

        {/* Footer */}
        <p className="text-center text-xs text-gray-500 mt-6">
          By signing up, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default SignIn;
