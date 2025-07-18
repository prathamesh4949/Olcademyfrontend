import React from 'react';
import PropTypes from 'prop-types';

const Card = ({ 
  children,
  variant = 'default',
  className = '',
  ...props 
}) => {
  const baseClasses = 'rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl';
  
  const variants = {
    default: 'bg-white border border-gray-200',
    product: 'bg-white p-6',
    featured: 'bg-[#f6d110] p-8',
    luxury: 'bg-white shadow-[0_4px_4px_rgba(0,0,0,0.25)]',
  };
  
  const cardClasses = `${baseClasses} ${variants[variant]} ${className}`;
  
  return (
    <div className={cardClasses} {...props}>
      {children}
    </div>
  );
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['default', 'product', 'featured', 'luxury']),
  className: PropTypes.string,
};

export default Card;