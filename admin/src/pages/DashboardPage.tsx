import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/Layout';

interface OrderStats {
  total: number;
  pending: number;
  preparing: number;
  delivered: number;
  revenue: number;
}

const DashboardPage = () => {
  const [stats, setStats] = useState<OrderStats>({
    total: 0,
    pending: 0,
    preparing: 0,
    delivered: 0,
    revenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    // Real-time updates every 5 seconds
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/orders');
      const orders = response.data.data || [];
      
      setStats({
        total: orders.length,
        pending: orders.filter((o: any) => o.status === 'pending').length,
        preparing: orders.filter((o: any) => o.status === 'preparing').length,
        delivered: orders.filter((o: any) => o.status === 'delivered').length,
        revenue: orders.reduce((sum: number, o: any) => sum + (o.totalAmount || 0), 0)
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching stats:', error);
      setLoading(false);
    }
  };

  const statCards = [
    { title: 'Jami Buyurtmalar', value: stats.total, icon: '📦', color: 'from-blue-500 to-blue-600' },
    { title: 'Kutilmoqda', value: stats.pending, icon: '⏳', color: 'from-yellow-500 to-orange-500' },
    { title: 'Tayyorlanmoqda', value: stats.preparing, icon: '👨‍🍳', color: 'from-purple-500 to-pink-500' },
    { title: 'Yetkazib Berildi', value: stats.delivered, icon: '✅', color: 'from-green-500 to-emerald-500' },
  ];

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-2xl">Yuklanmoqda...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
        <p className="text-gray-600">Real-time statistika va boshqaruv</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-14 h-14 bg-gradient-to-br ${card.color} rounded-2xl flex items-center justify-center text-2xl`}>
                {card.icon}
              </div>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">{card.title}</h3>
            <p className="text-3xl font-bold text-gray-800">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Revenue Card */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl shadow-lg p-8 text-white mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium opacity-90 mb-2">Bugungi Daromad</h3>
            <p className="text-4xl font-bold">{stats.revenue.toLocaleString()} so'm</p>
          </div>
          <div className="text-6xl">💰</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/orders" className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all hover:scale-105">
          <div className="text-4xl mb-4">📋</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Buyurtmalar</h3>
          <p className="text-gray-600">Barcha buyurtmalarni ko'rish va boshqarish</p>
        </Link>

        <Link to="/products" className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all hover:scale-105">
          <div className="text-4xl mb-4">🍔</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Mahsulotlar</h3>
          <p className="text-gray-600">Taomlarni qo'shish va tahrirlash</p>
        </Link>

        <Link to="/analytics" className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all hover:scale-105">
          <div className="text-4xl mb-4">📊</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Analitika</h3>
          <p className="text-gray-600">Daromad va statistika tahlili</p>
        </Link>
      </div>
    </Layout>
  );
};

export default DashboardPage;
