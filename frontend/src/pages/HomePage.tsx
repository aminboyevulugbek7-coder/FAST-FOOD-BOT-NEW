import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import CategoryCard from '../components/CategoryCard';
import FeaturedProducts from '../components/FeaturedProducts';

const HomePage = () => {
  const navigate = useNavigate();
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    if (window.Telegram?.WebApp) {
      const user = window.Telegram.WebApp.initDataUnsafe?.user;
      if (user) {
        setGreeting(`Salom, ${user.first_name}!`);
      } else {
        setGreeting('Xush kelibsiz!');
      }
    }
  }, []);

  const categories = [
    { id: 1, name: 'Burgerlar', icon: '🍔', color: 'from-orange-400 to-red-500', path: '/menu?category=burgers' },
    { id: 2, name: 'Pitsa', icon: '🍕', color: 'from-yellow-400 to-orange-500', path: '/menu?category=pizza' },
    { id: 3, name: 'Ichimliklar', icon: '🥤', color: 'from-blue-400 to-cyan-500', path: '/menu?category=drinks' },
    { id: 4, name: 'Shirinliklar', icon: '🍦', color: 'from-pink-400 to-purple-500', path: '/menu?category=desserts' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-20">
      <Header title={greeting} showCart={true} />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white p-6 rounded-b-3xl shadow-lg">
        <h2 className="text-2xl font-bold mb-2">Tezkor yetkazib berish 🚀</h2>
        <p className="opacity-90">Eng mazali fast food 30 daqiqada!</p>
      </div>

      {/* Categories */}
      <div className="p-4">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Kategoriyalar</h3>
        <div className="grid grid-cols-2 gap-4">
          {categories.map((category) => (
            <CategoryCard key={category.id} {...category} />
          ))}
        </div>
      </div>

      {/* Featured Products */}
      <FeaturedProducts />

      {/* CTA Button */}
      <div className="fixed bottom-4 left-4 right-4">
        <button
          onClick={() => navigate('/menu')}
          className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
        >
          Buyurtma berish
        </button>
      </div>
    </div>
  );
};

export default HomePage;
