// src/pages/MainPage.tsx
import { useState } from 'react';
import MenuCard from './components/MenuCard';
import type { MenuItem } from './types';

// Mock data to test the layout
const MOCK_MENU: MenuItem[] = [
  { id: '1', name: 'Bread', price: 18000, imageUrl: '/assets/bread.png', category: 'Bakery' },
  { id: '2', name: 'Salad', price: 30000, imageUrl: '/assets/salad.png', category: 'Main Course' },
  { id: '3', name: 'Hot Chocolate', price: 28000, imageUrl: '/assets/hot-choco.png', category: 'Beverage' },
  { id: '4', name: 'Jam', price: 20000, imageUrl: '/assets/jam.png', category: 'Breakfast' },
  { id: '5', name: 'Cookies', price: 25000, imageUrl: '/assets/cookies.png', category: 'Desserts' },
  { id: '6', name: 'Muffin', price: 18000, imageUrl: '/assets/muffin.png', category: 'Bakery' },
  { id: '7', name: 'Coffee', price: 23000, imageUrl: '/assets/coffee.png', category: 'Beverage' },
  { id: '8', name: 'Pastry', price: 28000, imageUrl: '/assets/pastry.png', category: 'Bakery' },
];

const CATEGORIES = ['All Products', 'Bakery', 'Desserts', 'Main Course', 'Breakfast'];

export default function App() {
  const [activeCategory, setActiveCategory] = useState('All Products');
  
  // Here is where you will eventually fetch your ML recommendations
  const recommendedItems = MOCK_MENU.slice(0, 3); 

  return (
    <div className="min-h-screen p-6 font-sans">
      
      {/* Header Section */}
      <header className="flex items-center justify-between mb-8">
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
              className="px-4 py-2 rounded-full bg-white/20 text-white placeholder-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-cafe-gold"
            />
          </div>
          <button className="text-white text-2xl">🛒</button>
        </div>
      </header>

      {/* Category Navigation */}
      <nav className="flex justify-center gap-8 mb-8 border-b border-white/20 pb-4">
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
        {/* We will build out the horizontal carousel here later */}
      </section>

      {/* Main Menu Grid */}
      <section>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {MOCK_MENU.map(item => (
            <MenuCard key={item.id} item={item} />
          ))}
        </div>
      </section>

    </div>
  );
}