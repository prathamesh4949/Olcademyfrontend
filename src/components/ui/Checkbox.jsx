import React from 'react';
import PropTypes from 'prop-types';

const Checkbox = ({ 
  checked = false,
  onChange,
  disabled = false,
  label = '',
  className = '',
  ...props 
}) => {
  const baseClasses = 'w-[18px] h-[18px] bg-[#f6d110] border-2 border-[#62470e] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#79300f] transition-all duration-200 rounded-sm';
  
  const checkboxClasses = `${baseClasses} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`;
  
  return (
    <div className="flex items-center space-x-2">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className={checkboxClasses}
        {...props}
      />
      {label && (
        <label className="text-[16px] font-joan text-[#79300f] leading-[20px] cursor-pointer">
          {label}
        </label>
      )}
    </div>
  );
};

Checkbox.propTypes = {
  checked: PropTypes.bool,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  label: PropTypes.string,
  className: PropTypes.string,
};

export default Checkbox;