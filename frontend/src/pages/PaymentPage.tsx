import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function PaymentPage() {
  const navigate = useNavigate();
  const { cartItems, getTotalPrice, clearCart } = useCart();

  const handlePay = () => {
    alert('💳 Payment Successful! Thank you for your order.');
    clearCart();
    navigate('/');
  };

  const handleBack = () => {
    navigate('/recommendation');
  };

  const totalPrice = getTotalPrice();

  return (
    <div className="min-h-screen font-sans">
      
      {/* Header */}
      <header className="flex items-center justify-between p-6 mb-8 hero-header">
        <button 
          onClick={handleBack}
          className="text-white text-2xl font-bold hover:text-cafe-gold transition"
        >
          ← Back
        </button>
        <h1 className="text-3xl text-white font-serif italic">Payment</h1>
        <div className="w-12" />
      </header>

      <div className="max-w-2xl mx-auto">
        
        {/* Order Summary */}
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 mb-6">
          <h2 className="text-2xl text-white font-bold mb-6">Order Summary</h2>

          {cartItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-white/60 text-lg mb-4">Your cart is empty</p>
              <button
                onClick={() => navigate('/')}
                className="bg-cafe-gold text-white font-bold py-2 px-6 rounded-lg hover:bg-yellow-600 transition"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <>
              {/* Order Items */}
              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                {cartItems.map(item => (
                  <div key={item.id} className="flex justify-between items-center bg-white/5 p-4 rounded-lg">
                    <div>
                      <p className="text-white font-semibold">{item.name}</p>
                      <p className="text-white/60 text-sm">
                        {new Intl.NumberFormat('id-ID', {
                          style: 'currency',
                          currency: 'IDR',
                          minimumFractionDigits: 0,
                        }).format(item.price)} × {item.quantity}
                      </p>
                    </div>
                    <p className="text-white font-bold">
                      {new Intl.NumberFormat('id-ID', {
                        style: 'currency',
                        currency: 'IDR',
                        minimumFractionDigits: 0,
                      }).format(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Divider */}
              <div className="border-t border-white/20 my-6" />

              {/* Total Price */}
              <div className="bg-white/5 p-4 rounded-lg mb-8">
                <div className="flex justify-between items-center">
                  <p className="text-white/80 font-semibold">Total Amount:</p>
                  <p className="text-3xl font-bold text-white">
                    {new Intl.NumberFormat('id-ID', {
                      style: 'currency',
                      currency: 'IDR',
                      minimumFractionDigits: 0,
                    }).format(totalPrice)}
                  </p>
                </div>
              </div>

              {/* Payment Methods (Placeholder) */}
              <div className="mb-8">
                <h3 className="text-lg text-white font-semibold mb-4">Payment Method</h3>
                <div className="space-y-2">
                  <label className="flex items-center bg-white/5 p-4 rounded-lg cursor-pointer hover:bg-white/10 transition">
                    <input type="radio" name="payment" defaultChecked className="w-4 h-4" />
                    <span className="text-white ml-3">Credit Card</span>
                  </label>
                  <label className="flex items-center bg-white/5 p-4 rounded-lg cursor-pointer hover:bg-white/10 transition">
                    <input type="radio" name="payment" className="w-4 h-4" />
                    <span className="text-white ml-3">Debit Card</span>
                  </label>
                  <label className="flex items-center bg-white/5 p-4 rounded-lg cursor-pointer hover:bg-white/10 transition">
                    <input type="radio" name="payment" className="w-4 h-4" />
                    <span className="text-white ml-3">E-Wallet</span>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={handleBack}
                  className="flex-1 bg-gray-600 text-white font-bold py-3 rounded-lg hover:bg-gray-700 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePay}
                  className="flex-1 bg-cafe-gold text-white font-bold py-3 rounded-lg hover:bg-yellow-600 transition flex items-center justify-center gap-2"
                >
                  💳 Pay {new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                    minimumFractionDigits: 0,
                  }).format(totalPrice)}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
