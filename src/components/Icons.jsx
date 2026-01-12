import React from 'react';
import { FaUserTie, FaUsers, FaLaptopCode } from 'react-icons/fa';

// Client Icon
export const ClientIcon = () => (
  <div className="w-12 h-12 bg-escon-green/10 rounded-xl flex items-center justify-center">
    <FaUserTie className="w-6 h-6 text-escon-green" />
  </div>
);

// Agency Icon
export const AgencyIcon = () => (
  <div className="w-12 h-12 bg-escon-green/10 rounded-xl flex items-center justify-center">
    <FaUsers className="w-6 h-6 text-escon-green" />
  </div>
);

// Freelancer Icon
export const FreelancerIcon = () => (
  <div className="w-12 h-12 bg-escon-green/10 rounded-xl flex items-center justify-center">
    <FaLaptopCode className="w-6 h-6 text-escon-green" />
  </div>
);

// Radio Button Component
export const RadioButton = ({ selected }) => (
  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
    selected ? 'border-escon-green' : 'border-gray-300'
  }`}>
    {selected && (
      <div className="w-3.5 h-3.5 rounded-full bg-escon-green"></div>
    )}
  </div>
);
