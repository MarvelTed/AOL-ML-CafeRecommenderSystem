import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import MenuCard from '../components/MenuCard';
import AddToCartModal from '../components/AddToCartModal';
import type { MenuItem, RecommendationItem } from '../types';
import knnData from '../data/knn_recommendations.json';

const MOCK_MENU: MenuItem[] = [
  { id: '1', name: 'Bread', price: 18000, imageUrl: '/assets/Bread.png', category: 'Bakery' },
  { id: '2', name: 'Salad', price: 30000, imageUrl: '/assets/Salad.png', category: 'Main Course' },
  { id: '3', name: 'Hot Chocolate', price: 28000, imageUrl: '/assets/Hot-Chocolate.png', category: 'Beverages' },
  { id: '4', name: 'Jam', price: 20000, imageUrl: '/assets/Jam.png', category: 'Breakfast' },
  { id: '5', name: 'Cookies', price: 25000, imageUrl: '/assets/Cookies.png', category: 'Desserts' },
  { id: '6', name: 'Muffin', price: 18000, imageUrl: '/assets/Muffin.png', category: 'Bakery' },
  { id: '7', name: 'Coffee', price: 23000, imageUrl: '/assets/Coffee.png', category: 'Beverages' },
  { id: '8', name: 'Pastry', price: 28000, imageUrl: '/assets/Pastry.png', category: 'Bakery' },
  { id: '9', name: 'Medialuna', price: 32000, imageUrl: '/assets/Medialuna.png', category: 'Bakery' },
  { id: '10', name: 'Tea', price: 20000, imageUrl: '/assets/Tea.png', category: 'Beverages' },
  { id: '11', name: 'Tartine', price: 38000, imageUrl: '/assets/Tartine.png', category: 'Breakfast' },
  { id: '12', name: 'Basket', price: 62000, imageUrl: '/assets/Basket.png', category: 'Main Course' },
  { id: '13', name: 'Mineral Water', price: 10000, imageUrl: '/assets/Mineral-Water.png', category: 'Beverages' },
  { id: '14', name: 'Fudge', price: 32000, imageUrl: '/assets/Fudge.png', category: 'Desserts' },
  { id: '15', name: 'Juice', price: 28000, imageUrl: '/assets/Juice.png', category: 'Beverages' },
  { id: '16', name: 'Victorian Sponge', price: 38000, imageUrl: '/assets/Victorian-Sponge.png', category: 'Desserts' },
  { id: '17', name: 'Frittata', price: 43000, imageUrl: '/assets/Frittata.png', category: 'Breakfast' },
  { id: '18', name: 'Soup', price: 10000, imageUrl: '/assets/Soup.png', category: 'Breakfast' },
  { id: '19', name: 'Smoothies', price: 32000, imageUrl: '/assets/Smoothies.png', category: 'Beverages' },
  { id: '20', name: 'Cake', price: 28000, imageUrl: '/assets/Cake.png', category: 'Desserts' },
  { id: '21', name: 'Coke', price: 15000, imageUrl: '/assets/Coke.png', category: 'Beverages' },
  { id: '22', name: 'Sandwich', price: 28000, imageUrl: '/assets/Sandwich.png', category: 'Breakfast' },
  { id: '23', name: 'Baguette', price: 28000, imageUrl: '/assets/Baguette.png', category: 'Bakery' },
  { id: '24', name: 'Eggs', price: 23000, imageUrl: '/assets/Eggs.png', category: 'Breakfast' },
  { id: '25', name: 'Brownies', price: 30000, imageUrl: '/assets/Brownie.png', category: 'Desserts' },
  { id: '26', name: 'Bread Pudding', price: 15000, imageUrl: '/assets/Bread-Pudding.png', category: 'Desserts' },
  { id: '27', name: 'Bacon', price: 35000, imageUrl: '/assets/Bacon.png', category: 'Breakfast' },
  { id: '28', name: 'Toast', price: 32000, imageUrl: '/assets/Toast.png', category: 'Breakfast' },
  { id: '29', name: 'Scone', price: 24000, imageUrl: '/assets/Scone.png', category: 'Bakery' },
  { id: '30', name: 'Crepes', price: 20000, imageUrl: '/assets/Crepes.png', category: 'Desserts' },
];

const knnRecommendations: Record<string, string[]> = knnData;

export default function RecommendationPage() {
  const navigate = useNavigate();
  const { cartItems } = useCart();
  const [recommendations, setRecommendations] = useState<RecommendationItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Omit<MenuItem, 'quantity'> | null>(null);

  const normalizeName = (value: string) =>
    value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, ' ')
      .replace(/\s+/g, ' ');

  const singularize = (value: string) => {
    const normalized = value.trim().toLowerCase();
    if (normalized.endsWith('ies')) return normalized.slice(0, -3) + 'y';
    if (normalized.endsWith('s') && !normalized.endsWith('ss')) return normalized.slice(0, -1);
    return normalized;
  };

  const pluralize = (value: string) => {
    const normalized = value.trim().toLowerCase();
    if (normalized.endsWith('y')) return normalized.slice(0, -1) + 'ies';
    if (normalized.endsWith('s')) return normalized;
    return `${normalized}s`;
  };

  const menuMap = new Map(MOCK_MENU.map(item => [normalizeName(item.name), item]));

  const findMenuItemByName = (name: string): MenuItem | undefined => {
    const normalized = normalizeName(name);
    const direct = menuMap.get(normalized);
    if (direct) return direct;

    const singular = singularize(normalized);
    const plural = pluralize(normalized);
    return menuMap.get(singular) || menuMap.get(plural) ||
      MOCK_MENU.find(item => normalizeName(item.name) === normalized);
  };

  const fetchRecommendations = async (selectedNames: string[]) => {
    if (selectedNames.length === 0) {
      setRecommendations([]);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 200));

      let rawMatches: string[] = [];

      selectedNames.forEach(name => {
        let matches = knnRecommendations[name];

        if (!matches) {
          const matchingKey = Object.keys(knnRecommendations).find(
            key => key.toLowerCase() === name.toLowerCase()
          );
          if (matchingKey) {
            matches = knnRecommendations[matchingKey];
          }
        }

        if (matches) {
          rawMatches = [...rawMatches, ...matches];
        }
      });

      const uniqueResults = Array.from(new Set(rawMatches))
        .filter(recName => !selectedNames.includes(recName))
        .slice(0, 10);

      const formattedRecommendations = uniqueResults.map((recName, index) => ({ 
        id: recName, 
        score: 0.99 - (index * 0.01) 
      }));

      setRecommendations(formattedRecommendations);
    } catch (err) {
      setError('An error occurred while generating local recommendations.');
      setRecommendations([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations(cartItems.map(item => item.name));
  }, [cartItems]);

  const handleRecommendationClick = (item: MenuItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen font-sans">
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
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl text-white font-bold">Suggested Items</h2>
            </div>
            <button
              onClick={() => fetchRecommendations(cartItems.map(item => item.name))}
              className="bg-cafe-gold text-white px-4 py-2 rounded-lg font-semibold hover:bg-yellow-600 transition"
            >
              Refresh
            </button>
          </div>

          {isLoading && <p className="text-white/70 mb-4">Loading recommendations…</p>}
          {error && <p className="text-red-400 mb-4">{error}</p>}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {recommendations.length === 0 && !isLoading ? (
              <div className="bg-white/10 border border-white/20 rounded-2xl p-6 text-white/70">
                No recommendations available yet. Add items to your cart and click Refresh.
              </div>
            ) : (
              Array.from(
                new Map(
                  recommendations
                    .map(rec => findMenuItemByName(rec.id))
                    .filter((item): item is MenuItem => Boolean(item))
                    .map(item => [item.id, item])
                ).values()
              ).map(item => (
                <div key={item.id} className="cursor-pointer" onClick={() => handleRecommendationClick(item)}>
                  <MenuCard item={item} />
                </div>
              ))
            )}
          </div>
        </div>

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
