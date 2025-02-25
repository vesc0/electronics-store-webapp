"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaSpinner } from 'react-icons/fa';
import { useCart } from '../context/CartContext';

interface Product {
  _id: string;
  name: string;
  category: string;
  price: number;
  imageUrl: string;
}

interface ProductCardProps extends Product {
  hideImage?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  _id,
  name,
  category,
  price,
  imageUrl,
  hideImage = false,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const { addToCart } = useCart();
  const router = useRouter();

  const handleAddToCart = () => {
    setIsAdding(true);
    setTimeout(() => {
      addToCart({ _id, name, price, quantity: 1, image: imageUrl });
      setIsAdding(false);
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 1000);
    }, 1000);
  };

  const navigateToDetails = () => {
    router.push(`/product-details?id=${_id}`);
  };

  return (
    <div className="flex flex-col items-center p-4 border rounded-lg shadow-md hover:border-black">
      {!hideImage && (
        <img
          src={imageUrl}
          alt={name}
          className="w-32 h-32 object-contain mb-2 cursor-pointer"
          onClick={navigateToDetails}
        />
      )}
      <h2
        className="text-lg font-bold mb-1 truncate text-center cursor-pointer"
        onClick={navigateToDetails}
      >
        {name}
      </h2>
      <p className="text-gray-600 mb-1 text-center">{category}</p>
      <p className="text-black-600 font-bold mb-2 text-center">${price}</p>
      <button
        onClick={handleAddToCart}
        disabled={isAdding || isAdded}
        className={`bg-gray-800 text-white px-6 py-2 rounded-lg flex items-center justify-center hover:bg-gray-500 transition-colors ${
          (isAdding || isAdded) && 'opacity-50 cursor-not-allowed'
        }`}
      >
        {isAdding ? (
          <FaSpinner className="animate-spin" />
        ) : isAdded ? (
          'Added!'
        ) : (
          'Add to Cart'
        )}
      </button>
    </div>
  );
};

export default ProductCard;