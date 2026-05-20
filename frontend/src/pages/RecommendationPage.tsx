import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import AddToCartModal from '../components/AddToCartModal';
import type { MenuItem } from '../types';

const MOCK_MENU: MenuItem[] = [
  { id: '1', name: 'Bread', price: 18000, imageUrl: '../src/assets/Bread.png', category: 'Bakery' },
  { id: '2', name: 'Salad', price: 30000, imageUrl: '../src/assets/Salad.png', category: 'Main Course' },
  { id: '3', name: 'Hot Chocolate', price: 28000, imageUrl: '../src/assets/Hot-Chocolate.png', category: 'Beverages' },
  { id: '4', name: 'Jam', price: 20000, imageUrl: '../src/assets/Jam.png', category: 'Breakfast' },
  { id: '5', name: 'Cookies', price: 25000, imageUrl: '../src/assets/Cookies.png', category: 'Desserts' },
  { id: '6', name: 'Muffin', price: 18000, imageUrl: '../src/assets/Muffin.png', category: 'Bakery' },
  { id: '7', name: 'Coffee', price: 23000, imageUrl: '../src/assets/Coffee.png', category: 'Beverages' },
  { id: '8', name: 'Pastry', price: 28000, imageUrl: '../src/assets/Pastry.png', category: 'Bakery' },
];

export default function RecommendationPage() {
  const navigate = useNavigate();
  const { cartItems } = useCart();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Omit<MenuItem, 'quantity'> | null>(null);

  const handleRecommendationClick = (item: MenuItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen font-sans">
      
      {/* Header */}
      <header className="flex items-center justify-between p-6 mb-8 hero-header">
        <button 
          onClick={() => navigate('/')}
          className="text-white text-2xl font-bold hover:text-cafe-gold transition"
        >
          ← Back
        </button>
        <h1 className="text-3xl text-white font-serif italic">Recommendations</h1>
        <div className="w-12" />
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        
        {/* Recommended Items */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl text-white font-bold mb-6">Suggested Items</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {MOCK_MENU.map(item => (
              <div 
                key={item.id}
                onClick={() => handleRecommendationClick(item)}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-4 cursor-pointer hover:bg-white/20 transition border border-white/20"
              >
                <div className="w-full h-24 bg-white/10 rounded-lg mb-3 flex items-center justify-center">
                  <img 
                    src={item.imageUrl} 
                    alt={item.name}
                    className="w-full h-full object-contain p-2"
                  />
                </div>
                <h3 className="text-white font-semibold text-sm mb-1">{item.name}</h3>
                <p className="text-white/60 text-xs mb-2">{item.category}</p>
                <p className="text-white/80 font-semibold text-sm">
                  {new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                    minimumFractionDigits: 0,
                  }).format(item.price)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Cart Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 sticky top-6">
            <h2 className="text-xl text-white font-bold mb-6">Your Cart</h2>
            
            {cartItems.length === 0 ? (
              <p className="text-white/60 text-center py-8">Your cart is empty</p>
            ) : (
              <>
                <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                  {cartItems.map(item => (
                    <div key={item.id} className="flex justify-between items-start bg-white/5 p-3 rounded-lg">
                      <div className="flex-1">
                        <p className="text-white font-semibold text-sm">{item.name}</p>
                        <p className="text-white/60 text-xs">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-white/80 font-semibold text-sm">
                        {new Intl.NumberFormat('id-ID', {
                          style: 'currency',
                          currency: 'IDR',
                          minimumFractionDigits: 0,
                        }).format(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => navigate('/payment')}
                  className="w-full bg-cafe-gold text-white font-bold py-3 rounded-lg hover:bg-yellow-600 transition"
                >
                  Proceed to Payment
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <AddToCartModal 
        isOpen={isModalOpen}
        item={selectedItem}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
