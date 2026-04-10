import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { format, subDays } from 'date-fns';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Layout from '../components/Layout';
import { analyticsAPI } from '../services/api';

interface DashboardMetrics {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  completedOrders: number;
  pendingOrders: number;
  cancelledOrders: number;
  topProducts: Array<{
    productName: string;
    totalOrders: number;
    totalQuantity: number;
    totalRevenue: number;
  }>;
  revenueGrowth: number;
  orderGrowth: number;
}

interface TimeSeriesData {
  date: string;
  value: number;
}

const DashboardPage = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [ordersOverTime, setOrdersOverTime] = useState<TimeSeriesData[]>([]);
  const [revenueOverTime, setRevenueOverTime] = useState<TimeSeriesData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState({
    startDate: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd')
  });

  useEffect(() => {
    fetchDashboardData();
  }, [dateRange]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [dashboardRes, ordersRes, revenueRes] = await Promise.all([
        analyticsAPI.getDashboard(dateRange.startDate, dateRange.endDate),
        analyticsAPI.getOrdersOverTime(dateRange.startDate, dateRange.endDate, 'day'),
        analyticsAPI.getRevenueOverTime(dateRange.startDate, dateRange.endDate, 'day')
      ]);

      setMetrics(dashboardRes.data.data || dashboardRes.data);
      setOrdersOverTime(ordersRes.data.data || ordersRes.data);
      setRevenueOverTime(revenueRes.data.data || revenueRes.data);
      setLoading(false);
    } catch (error: any) {
      console.error('Error fetching dashboard data:', error);
      setError(error.response?.data?.message || 'Failed to load dashboard data');
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchDashboardData();
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-2xl">Yuklanmoqda...</div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      </Layout>
    );
  }

  if (!metrics) return null;

  const statCards = [
    { title: 'Jami Buyurtmalar', value: metrics.totalOrders, icon: '📦', color: 'from-blue-500 to-blue-600', growth: metrics.orderGrowth },
    { title: 'Kutilmoqda', value: metrics.pendingOrders, icon: '⏳', color: 'from-yellow-500 to-orange-500' },
    { title: 'Bajarildi', value: metrics.completedOrders, icon: '✅', color: 'from-green-500 to-emerald-500' },
    { title: 'Bekor qilindi', value: metrics.cancelledOrders, icon: '❌', color: 'from-red-500 to-red-600' },
  ];

  return (
    <Layout>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
          <p className="text-gray-600">Real-time statistika va boshqaruv</p>
        </div>
        <div className="flex gap-4 items-center">
          <div className="flex gap-2">
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
              className="px-4 py-2 border rounded-lg"
            />
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
              className="px-4 py-2 border rounded-lg"
            />
          </div>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            🔄 Yangilash
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-14 h-14 bg-gradient-to-br ${card.color} rounded-2xl flex items-center justify-center text-2xl`}>
                {card.icon}
              </div>
              {card.growth !== undefined && (
                <span className={`text-sm font-semibold ${card.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {card.growth >= 0 ? '↑' : '↓'} {Math.abs(card.growth).toFixed(1)}%
                </span>
              )}
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">{card.title}</h3>
            <p className="text-3xl font-bold text-gray-800">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Revenue Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl shadow-lg p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium opacity-90 mb-2">Jami Daromad</h3>
              <p className="text-4xl font-bold">{metrics.totalRevenue.toLocaleString()} so'm</p>
              <span className="text-sm mt-2 inline-block">
                {metrics.revenueGrowth >= 0 ? '↑' : '↓'} {Math.abs(metrics.revenueGrowth).toFixed(1)}% o'sish
              </span>
            </div>
            <div className="text-6xl">💰</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl shadow-lg p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium opacity-90 mb-2">O'rtacha Buyurtma</h3>
              <p className="text-4xl font-bold">{metrics.averageOrderValue.toLocaleString()} so'm</p>
            </div>
            <div className="text-6xl">📊</div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Buyurtmalar dinamikasi</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={ordersOverTime}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} name="Buyurtmalar" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Daromad dinamikasi</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueOverTime}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#10b981" name="Daromad (so'm)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Eng ko'p sotilgan mahsulotlar</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Mahsulot</th>
                <th className="text-right py-3 px-4">Buyurtmalar</th>
                <th className="text-right py-3 px-4">Miqdor</th>
                <th className="text-right py-3 px-4">Daromad</th>
              </tr>
            </thead>
            <tbody>
              {metrics.topProducts.map((product, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{product.productName}</td>
                  <td className="text-right py-3 px-4">{product.totalOrders}</td>
                  <td className="text-right py-3 px-4">{product.totalQuantity}</td>
                  <td className="text-right py-3 px-4 font-semibold">{product.totalRevenue.toLocaleString()} so'm</td>
                </tr>
              ))}
            </tbody>
          </table>
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
