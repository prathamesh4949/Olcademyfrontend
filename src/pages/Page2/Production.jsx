import React from 'react';


const ProductCard = ({ name, price, description, image }) => {
  return (
    <div className="flex flex-col items-center">
      <img
        src={image}
        alt={name}
        className="w-48 h-64 object-cover rounded-lg mb-4"
      />
      <h3 className="text-lg font-semibold text-gray-800 dark:text-[#EDD1D1]">{name}</h3>
      <p className="text-gray-600 dark:text-[#EDD1D1]">${price}</p>
      <p className="text-sm text-gray-500 text-center dark:text-[#f6d110]">{description}</p>
      <button className="mt-2 bg-transparent   text-gray-700 dark:text-[#EDD1D1] px-4 py-2 rounded hover:bg-gray-700 hover:text-white">
        <a href="/product-cart">
          Add to Cart
        </a>
      </button>
    </div>
  );
};

export default ProductCard;