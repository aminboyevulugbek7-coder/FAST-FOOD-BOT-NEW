import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { useCartStore } from '../store/cartStore';
import { api } from '../utils/api';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, getTotalPrice, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    paymentMethod: 'card',
    comment: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Get Telegram user info if available
      let telegramInfo = null;
      if (window.Telegram?.WebApp) {
        const user = window.Telegram.WebApp.initDataUnsafe?.user;
        if (user) {
          telegramInfo = {
            telegramId: user.id,
            username: user.username
          };
        }
      }

      // Create order via API
      const orderData = {
        items: cartItems,
        totalAmount: getTotalPrice(),
        customerInfo: {
          ...formData,
          ...telegramInfo
        },
        paymentMethod: formData.paymentMethod,
        comment: formData.comment
      };

      const response = await api.createOrder(orderData);

      if (response.success) {
        clearCart();
        
        // Show success message using Telegram
        if (window.Telegram?.WebApp) {
          window.Telegram.WebApp.showAlert('Buyurtmangiz qabul qilindi! ✅');
        }
        
        navigate('/order-success');
      } else {
        throw new Error(response.message || 'Buyurtma yaratilmadi');
      }
    } catch (error: any) {
      console.error('Order error:', error);
      
      // Show error message
      if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.showAlert(error.message || 'Xatolik yuz berdi. Iltimos qaytadan urinib ko\'ring.');
      } else {
        alert(error.message || 'Xatolik yuz berdi!');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-40">
      <Header title="Rasmiylashtirish" showCart={false} />
      
      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        <div className="bg-white rounded-2xl p-4 shadow-md">
          <h3 className="font-bold text-lg mb-4">Yetkazib berish ma'lumotlari</h3>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ism</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                placeholder="Ismingizni kiriting"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                placeholder="+998 90 123 45 67"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Manzil</label>
              <textarea
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all resize-none"
                placeholder="To'liq manzilni kiriting"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">To'lov turi</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, paymentMethod: 'card' })}
                  className={`p-3 rounded-xl font-semibold border-2 transition-all ${
                    formData.paymentMethod === 'card'
                      ? 'border-primary-500 bg-primary-50 text-primary-600'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  💳 Karta
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, paymentMethod: 'cash' })}
                  className={`p-3 rounded-xl font-semibold border-2 transition-all ${
                    formData.paymentMethod === 'cash'
                      ? 'border-primary-500 bg-primary-50 text-primary-600'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  💵 Naqd
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Izoh (ixtiyoriy)</label>
              <textarea
                value={formData.comment}
                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                rows={2}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all resize-none"
                placeholder="Qo'shimcha izoh..."
              />
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-2xl p-4 shadow-md">
          <h3 className="font-bold text-lg mb-4">Buyurtma tafsilotlari</h3>
          <div className="space-y-2">
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-gray-600">{item.name} x{item.quantity}</span>
                <span className="font-semibold">{(item.price * item.quantity).toLocaleString()} so'm</span>
              </div>
            ))}
            <div className="border-t pt-2 mt-2 flex justify-between text-lg font-bold">
              <span>Jami:</span>
              <span className="text-primary-600">{getTotalPrice().toLocaleString()} so'm</span>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || cartItems.length === 0}
          className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white py-4 rounded-2xl font-bold text-lg hover:shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Yuborilmoqda...' : `Buyurtma berish - ${getTotalPrice().toLocaleString()} so'm`}
        </button>
      </form>
    </div>
  );
};

export default CheckoutPage;
