import { useEffect, useState } from 'react';
import { format, subDays } from 'date-fns';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
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

const AnalyticsPage = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [ordersOverTime, setOrdersOverTime] = useState<TimeSeriesData[]>([]);
  const [revenueOverTime, setRevenueOverTime] = useState<TimeSeriesData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState({
    startDate: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd')
  });
  const [groupBy, setGroupBy] = useState<'day' | 'week' | 'month'>('day');

  useEffect(() => {
    fetchAnalyticsData();
  }, [dateRange, groupBy]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [dashboardRes, ordersRes, revenueRes] = await Promise.all([
        analyticsAPI.getDashboard(dateRange.startDate, dateRange.endDate),
        analyticsAPI.getOrdersOverTime(dateRange.startDate, dateRange.endDate, groupBy),
        analyticsAPI.getRevenueOverTime(dateRange.startDate, dateRange.endDate, groupBy)
      ]);

      setMetrics(dashboardRes.data);
      setOrdersOverTime(ordersRes.data);
      setRevenueOverTime(revenueRes.data);
      setLoading(false);
    } catch (error: any) {
      console.error('Error fetching analytics data:', error);
      setError(error.response?.data?.message || 'Failed to load analytics data');
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    if (!metrics) return;

    const csvData = [
      ['Metrika', 'Qiymat'],
      ['Jami buyurtmalar', metrics.totalOrders],
      ['Jami daromad', metrics.totalRevenue],
      ['O\'rtacha buyurtma', metrics.averageOrderValue],
      ['Bajarilgan', metrics.completedOrders],
      ['Kutilmoqda', metrics.pendingOrders],
      ['Bekor qilingan', metrics.cancelledOrders],
      [''],
      ['Eng ko\'p sotilgan mahsulotlar'],
      ['Mahsulot', 'Buyurtmalar', 'Miqdor', 'Daromad'],
      ...metrics.topProducts.map(p => [p.productName, p.totalOrders, p.totalQuantity, p.totalRevenue])
    ];

    const csv = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${dateRange.startDate}-${dateRange.endDate}.csv`;
    a.click();
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

  const statusData = [
    { name: 'Bajarildi', value: metrics.completedOrders, color: '#10b981' },
    { name: 'Kutilmoqda', value: metrics.pendingOrders, color: '#f59e0b' },
    { name: 'Bekor qilindi', value: metrics.cancelledOrders, color: '#ef4444' }
  ];

  return (
    <Layout>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Analitika</h1>
          <p className="text-gray-600">Daromad va statistika tahlili</p>
        </div>
        <button
          onClick={exportToCSV}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
        >
          📥 CSV Yuklab olish
        </button>
      </div>

      {/* Date Range and Grouping */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="date"
            value={dateRange.startDate}
            onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input
            type="date"
            value={dateRange.endDate}
            onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <select
            value={groupBy}
            onChange={(e) => setGroupBy(e.target.value as 'day' | 'week' | 'month')}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="day">Kunlik</option>
            <option value="week">Haftalik</option>
            <option value="month">Oylik</option>
          </select>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-2xl">
              📦
            </div>
            <span className={`text-sm font-semibold ${metrics.orderGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {metrics.orderGrowth >= 0 ? '↑' : '↓'} {Math.abs(metrics.orderGrowth).toFixed(1)}%
            </span>
          </div>
          <h3 className="text-gray-600 text-sm font-medium mb-1">Jami Buyurtmalar</h3>
          <p className="text-3xl font-bold text-gray-800">{metrics.totalOrders}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center text-2xl">
              💰
            </div>
            <span className={`text-sm font-semibold ${metrics.revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {metrics.revenueGrowth >= 0 ? '↑' : '↓'} {Math.abs(metrics.revenueGrowth).toFixed(1)}%
            </span>
          </div>
          <h3 className="text-gray-600 text-sm font-medium mb-1">Jami Daromad</h3>
          <p className="text-3xl font-bold text-gray-800">{metrics.totalRevenue.toLocaleString()} so'm</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center text-2xl mb-4">
            📊
          </div>
          <h3 className="text-gray-600 text-sm font-medium mb-1">O'rtacha Buyurtma</h3>
          <p className="text-3xl font-bold text-gray-800">{metrics.averageOrderValue.toLocaleString()} so'm</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center text-2xl mb-4">
            ✅
          </div>
          <h3 className="text-gray-600 text-sm font-medium mb-1">Bajarilgan</h3>
          <p className="text-3xl font-bold text-gray-800">{metrics.completedOrders}</p>
        </div>
      </div>

      {/* Charts Row 1 */}
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

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Buyurtmalar holati</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Eng ko'p sotilgan mahsulotlar</h3>
          <div className="space-y-3">
            {metrics.topProducts.slice(0, 5).map((product, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">{product.productName}</div>
                    <div className="text-sm text-gray-500">{product.totalQuantity} dona</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-800">{product.totalRevenue.toLocaleString()} so'm</div>
                  <div className="text-sm text-gray-500">{product.totalOrders} buyurtma</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Products Table */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Barcha mahsulotlar statistikasi</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">№</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Mahsulot</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Buyurtmalar</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Miqdor</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Daromad</th>
              </tr>
            </thead>
            <tbody>
              {metrics.topProducts.map((product, index) => (
                <tr key={index} className="border-t hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-600">{index + 1}</td>
                  <td className="py-3 px-4 font-semibold text-gray-800">{product.productName}</td>
                  <td className="text-right py-3 px-4 text-gray-600">{product.totalOrders}</td>
                  <td className="text-right py-3 px-4 text-gray-600">{product.totalQuantity}</td>
                  <td className="text-right py-3 px-4 font-semibold text-gray-800">
                    {product.totalRevenue.toLocaleString()} so'm
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default AnalyticsPage;
