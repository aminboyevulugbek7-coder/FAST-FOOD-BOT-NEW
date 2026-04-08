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
    <div className="min-h-screen bg-white pb-28">
      <Header title={greeting} showCart={true} />
      
      {/* Hero Section - Minimalist */}
      <div className="px-6 pt-8 pb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-3">
          Tezkor yetkazib berish
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Eng mazali fast food 30 daqiqada eshigingizda
        </p>
        
        {/* Stats - Clean */}
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-gray-700 font-medium">Tez yetkazish</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            <span className="text-gray-700 font-medium">Sifatli ovqat</span>
          </div>
        </div>
      </div>

      {/* Categories - Minimalist Grid */}
      <div className="px-6 mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Kategoriyalar</h2>
        <div className="grid grid-cols-2 gap-4">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => navigate(category.path)}
              className="bg-gray-50 hover:bg-gray-100 active:bg-gray-200 rounded-3xl p-8 transition-all duration-200 border border-gray-100 hover:border-orange-200 group"
            >
              <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-200">
                {category.icon}
              </div>
              <h3 className="font-semibold text-gray-900 text-lg">{category.name}</h3>
            </button>
          ))}
        </div>
      </div>

      {/* Featured Products - Clean */}
      <div className="px-6 mb-24">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Ommabop</h2>
        <FeaturedProducts />
      </div>

      {/* CTA Button - Minimalist */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-100">
        <button
          onClick={() => navigate('/menu')}
          className="w-full bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white py-5 rounded-2xl font-bold text-lg transition-colors duration-200 shadow-lg shadow-orange-500/20"
        >
          Buyurtma berish
        </button>
      </div>
    </div>
  );
};

export default HomePage;
