import { useState } from 'react';
import { useCart, type CartItem } from '../context/CartContext';

interface AddToCartModalProps {
  isOpen: boolean;
  item: Omit<CartItem, 'quantity'> | null;
  onClose: () => void;
}

export default function AddToCartModal({ isOpen, item, onClose }: AddToCartModalProps) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  if (!isOpen || !item) return null;

  const handleConfirm = () => {
    addToCart({
      ...item,
      quantity,
    });
    setQuantity(1);
    onClose();
  };

  const handleCancel = () => {
    setQuantity(1);
    onClose();
  };

  const formattedPrice = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(item.price);

  const totalPrice = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(item.price * quantity);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl">
        {/* Close button */}
        <button
          onClick={handleCancel}
          className="float-right text-gray-400 hover:text-gray-600 text-2xl"
        >
          ×
        </button>

        {/* Item image */}
        <div className="w-32 h-32 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-contain p-2"
          />
        </div>

        {/* Item details */}
        <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
          {item.name}
        </h2>
        <p className="text-gray-600 text-center mb-1">{item.category}</p>
        <p className="text-lg font-semibold text-cafe-gold text-center mb-6">
          {formattedPrice}
        </p>

        {/* Quantity selector */}
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            Quantity
          </label>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-10 h-10 rounded-full bg-gray-200 text-gray-800 font-bold hover:bg-gray-300 transition"
            >
              −
            </button>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-16 text-center border border-gray-300 rounded-lg py-2 font-semibold focus:outline-none focus:ring-2 focus:ring-cafe-gold"
            />
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-10 h-10 rounded-full bg-gray-200 text-gray-800 font-bold hover:bg-gray-300 transition"
            >
              +
            </button>
          </div>
        </div>

        {/* Total price */}
        <div className="bg-gray-100 rounded-lg p-3 mb-6 text-center">
          <p className="text-gray-600 text-sm">Total Price</p>
          <p className="text-2xl font-bold text-cafe-gold">{totalPrice}</p>
        </div>

        {/* Action buttons */}
        <div className="flex gap-4">
          <button
            onClick={handleCancel}
            className="flex-1 px-4 py-3 bg-gray-300 text-gray-800 font-semibold rounded-lg hover:bg-gray-400 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 px-4 py-3 bg-cafe-gold text-white font-semibold rounded-lg hover:bg-yellow-600 transition"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
