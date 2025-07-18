import React from 'react';
import PropTypes from 'prop-types';

const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'medium', 
  disabled = false, 
  type = 'button',
  className = '',
  ...props 
}) => {
  const baseClasses = 'font-alata transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer';
  
  const variants = {
    primary: 'bg-[#79300f] text-white hover:bg-[#5a2209] focus:ring-[#79300f]',
    secondary: 'bg-transparent text-[#79300f] border-b-4 border-[#79300f] hover:bg-[#79300f] hover:text-white',
    outline: 'border border-[#79300f] text-[#79300f] hover:bg-[#79300f] hover:text-white',
  };
  
  const sizes = {
    small: 'px-3 py-1 text-[16px]',
    medium: 'px-4 py-2 text-[20px] leading-[28px]',
    large: 'px-6 py-3 text-[24px]',
  };
  
  const buttonClasses = `${baseClasses} ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`;
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={buttonClasses}
      {...props}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  variant: PropTypes.oneOf(['primary', 'secondary', 'outline']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  disabled: PropTypes.bool,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  className: PropTypes.string,
};

export default Button;