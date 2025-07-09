
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Input: React.FC<InputProps> = ({ label, id, className = '', ...props }) => {
  return (
    <div>
      {label && <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-2">{label}</label>}
      <input
        id={id}
        className={`w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none transition ${className}`}
        {...props}
      />
    </div>
  );
};

export default Input;
