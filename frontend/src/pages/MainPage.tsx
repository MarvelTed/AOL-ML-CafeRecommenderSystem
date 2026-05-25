import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MenuCard from '../components/MenuCard';
import AddToCartModal from '../components/AddToCartModal';
import type { MenuItem } from '../types';

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

const CATEGORIES = ['All Products', 'Breakfast', 'Main Course','Desserts', 'Beverages', 'Bakery'];

export default function MainPage() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('All Products');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Omit<MenuItem, 'quantity'> | null>(null);

  const filteredMenu = MOCK_MENU.filter(item => {
    const matchesCategory =
      activeCategory === 'All Products' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase().trim())
      || item.category.toLowerCase().includes(searchTerm.toLowerCase().trim());

    return matchesCategory && (searchTerm ? matchesSearch : true);
  });

  const handleMenuCardClick = (item: MenuItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen font-sans">
      
      {/* Header Section */}
      <header className="flex items-center justify-between p-6 hero-header">
        <div className="flex items-center gap-4">
          <button className="text-white text-2xl font-bold">&lt;&lt;</button>
          <div>
            <h1 className="text-3xl text-white font-serif italic">Marson's</h1>
            <p className="text-sm text-white/80 uppercase tracking-widest">Coffee & Eatery</p>
          </div>
        </div>

        <h2 className="text-4xl text-white font-serif">Menu</h2>

        <div className="flex items-center gap-4">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search..." 
              value={searchTerm}
              onChange={event => setSearchTerm(event.target.value)}
              className="px-4 py-2 rounded-full bg-white/20 text-white placeholder-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-cafe-gold"
            />
          </div>
          <button 
            onClick={() => navigate('/recommendation')}
            className="text-white text-2xl hover:scale-110 transition-transform"
          >
            🛒
          </button>
        </div>
      </header>

      {/* Category Navigation */}
      <nav className="flex justify-center gap-8 mb-8 border-b border-white/20 pb-4 pt-8 hero-selection">
        {CATEGORIES.map(category => (
          <button 
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`text-lg font-medium transition-colors ${
              activeCategory === category 
                ? 'text-white border-b-2 border-white' 
                : 'text-white/60 hover:text-white/90'
            }`}
          >
            {category}
          </button>
        ))}
      </nav>

      {/* Recommender Section Placeholder */}
      <section className="mb-10">
        <h3 className="text-center text-white text-xl font-bold mb-6">What do you wanna eat today?</h3>
      </section>

      {/* Main Menu Grid */}
      <section>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {filteredMenu.length > 0 ? (
            filteredMenu.map(item => (
              <div 
                key={item.id}
                onClick={() => handleMenuCardClick(item)}
                className="cursor-pointer"
              >
                <MenuCard item={item} />
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-white/60 text-lg">No items found</p>
            </div>
          )}
        </div>
      </section>

      <AddToCartModal 
        isOpen={isModalOpen}
        item={selectedItem}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
