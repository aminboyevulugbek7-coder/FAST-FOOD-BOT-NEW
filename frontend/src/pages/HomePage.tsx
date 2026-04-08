import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
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
    { 
      id: 1, 
      name: 'Burgerlar', 
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=400&fit=crop',
      path: '/menu?category=burgers' 
    },
    { 
      id: 2, 
      name: 'Pitsa', 
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=400&fit=crop',
      path: '/menu?category=pizza' 
    },
    { 
      id: 3, 
      name: 'Ichimliklar', 
      image: 'https://images.unsplash.com/photo-1546173159-315724a31696?w=400&h=400&fit=crop',
      path: '/menu?category=drinks' 
    },
    { 
      id: 4, 
      name: 'Shirinliklar', 
      image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=400&fit=crop',
      path: '/menu?category=desserts' 
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      <Header title={greeting} showCart={true} />
      
      {/* Search Bar */}
      <div className="px-5 pt-6 pb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Qidiruv..."
            className="w-full bg-white rounded-2xl pl-12 pr-4 py-4 text-gray-700 placeholder-gray-400 shadow-sm border border-gray-100 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20"
          />
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Promo Banner */}
      <div className="px-5 pb-6">
        <div className="bg-gradient-to-r from-[#FF6B35] to-[#FF8C42] rounded-3xl p-6 relative overflow-hidden shadow-lg">
          <div className="relative z-10">
            <p className="text-white/90 text-sm font-medium mb-1">FIRST50 promokodidan foydalaning</p>
            <h2 className="text-white text-2xl font-bold mb-1">Birinchi buyurtmaga</h2>
            <h2 className="text-white text-2xl font-bold mb-4">50% chegirma!</h2>
            <button className="bg-black text-white px-6 py-2.5 rounded-full text-sm font-semibold">
              Buyurtma berish
            </button>
          </div>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-6xl opacity-20">
            🍔
          </div>
        </div>
      </div>

      {/* Categories - Circular Icons */}
      <div className="px-5 pb-6">
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => navigate(category.path)}
              className="flex-shrink-0 flex flex-col items-center gap-2 group"
            >
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#FF6B35] to-[#FF8C42] p-0.5 shadow-lg group-hover:shadow-xl transition-all">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                  <img 
                    src={category.image} 
                    alt={category.name}
                    className="w-16 h-16 object-cover rounded-full"
                  />
                </div>
              </div>
              <span className="text-xs font-semibold text-gray-700">{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Featured Products */}
      <div className="px-5 pb-28">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Ommabop taomlar</h2>
          <button className="text-[#FF6B35] text-sm font-semibold">Barchasi</button>
        </div>
        <FeaturedProducts />
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-5 py-3 shadow-lg">
        <div className="flex items-center justify-around">
          <button className="flex flex-col items-center gap-1 text-[#FF6B35]">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            <span className="text-xs font-medium">Bosh sahifa</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-gray-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="text-xs font-medium">Qidiruv</span>
          </button>
          <button 
            onClick={() => navigate('/cart')}
            className="flex flex-col items-center gap-1 text-gray-400"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="text-xs font-medium">Savat</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-gray-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-xs font-medium">Profil</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
