import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const OrderSuccessPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize Telegram WebApp
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.expand();
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 text-center max-w-md w-full">
        <div className="text-7xl mb-4 animate-bounce-slow">✅</div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Buyurtma Qabul Qilindi!
        </h1>
        <p className="text-gray-600 mb-6">
          Tez orada operatorimiz siz bilan bog'lanadi
        </p>
        
        <div className="bg-gray-50 rounded-2xl p-4 mb-6">
          <div className="flex items-center justify-center gap-2 text-gray-700">
            <span className="text-2xl">🚀</span>
            <span className="font-semibold">Yetkazib berish: 30-40 daqiqa</span>
          </div>
        </div>

        <button
          onClick={() => navigate('/')}
          className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white py-4 rounded-2xl font-bold text-lg hover:shadow-lg transform hover:scale-105 transition-all"
        >
          Bosh sahifa
        </button>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
