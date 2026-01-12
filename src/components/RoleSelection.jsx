import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RoleCard from './RoleCard';
import { ClientIcon, AgencyIcon, FreelancerIcon } from './Icons';

const RoleSelection = () => {
  const [selectedRole, setSelectedRole] = useState(null);
  const navigate = useNavigate();

  const roles = [
    {
      id: 'client',
      icon: ClientIcon,
      title: "I'm a client",
      description: "I want to manage contracts with service providers.",
      route: '/register/client'
    },
    {
      id: 'agency',
      icon: AgencyIcon,
      title: "I'm an agency",
      description: "My team works with clients.",
      route: '/register/agency'
    },
    {
      id: 'freelancer',
      icon: FreelancerIcon,
      title: "I'm a freelancer",
      description: "I work with clients.",
      route: '/register/freelancer'
    }
  ];

  const handleContinue = () => {
    if (selectedRole) {
      const role = roles.find(r => r.id === selectedRole);
      navigate(role.route, { state: { role: selectedRole } });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md">
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Join as a client or service provider
          </h1>
          <p className="text-gray-600">
            Choose your role to get started with Escon
          </p>
        </div>

        {/* Role Cards Container */}
        <div className="space-y-4 mb-6">
          {roles.map((role) => (
            <RoleCard
              key={role.id}
              icon={role.icon}
              title={role.title}
              description={role.description}
              selected={selectedRole === role.id}
              onClick={() => setSelectedRole(role.id)}
            />
          ))}
        </div>

        {/* Continue Button */}
        <button
          onClick={handleContinue}
          disabled={!selectedRole}
          className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
            selectedRole
              ? 'bg-escon-green hover:bg-escon-green-hover text-black cursor-pointer shadow-md hover:shadow-lg'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          Continue
        </button>

        {/* Back to Sign In Link */}
        <div className="text-center mt-6">
          <button
            onClick={() => navigate('/')}
            className="text-gray-600 hover:text-gray-900 text-sm font-medium"
          >
            Already have an account? <span className="text-escon-green">Sign in</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;
