import React from 'react';
import { RadioButton } from './Icons';

const RoleCard = ({ icon: Icon, title, description, selected, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-4 p-5 bg-white rounded-xl border-2 cursor-pointer transition-all hover:shadow-md ${
        selected ? 'border-escon-green shadow-lg' : 'border-gray-200'
      }`}
    >
      <div className="flex-shrink-0">
        <Icon />
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-bold text-gray-900 mb-1">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <div className="flex-shrink-0">
        <RadioButton selected={selected} />
      </div>
    </div>
  );
};

export default RoleCard;
