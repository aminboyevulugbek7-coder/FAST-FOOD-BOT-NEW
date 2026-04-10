import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import Layout from '../components/Layout';
import { orderAPI } from '../services/api';

interface Order {
  id: string;
  orderNumber: string;
  items: Array<{
    productName: string;
    quantity: number;
    price: number;
    subtotal: number;
  }>;
  totalAmount: number;
  customerInfo: {
    name: string;
    phone: string;
    address: string;
  };
  paymentMethod: string;
  status: string;
  comment?: string;
  statusHistory: Array<{
    status: string;
    timestamp: string;
    note?: string;
  }>;
  createdAt: string;
}

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    search: '',
    startDate: '',
    endDate: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  });
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [statusNote, setStatusNote] = useState('');

  useEffect(() => {
    fetchOrders();
  }, [filters, pagination.page]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params: any = {
        page: pagination.page,
        limit: pagination.limit
      };

      if (filters.status) params.status = filters.status;
      if (filters.search) params.search = filters.search;
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;

      const response = await orderAPI.getAll(params);
      const data = response.data.data || response.data;
      setOrders(data.orders || []);
      setPagination({
        ...pagination,
        total: data.total || 0,
        totalPages: data.totalPages || 1
      });
      setLoading(false);
    } catch (error: any) {
      console.error('Error fetching orders:', error);
      setError(error.response?.data?.message || 'Failed to load orders');
      setLoading(false);
    }
  };

  const handleViewDetails = async (order: Order) => {
    try {
      const response = await orderAPI.getById(order.id);
      setSelectedOrder(response.data.data || response.data);
      setShowDetailsModal(true);
    } catch (error: any) {
      console.error('Error fetching order details:', error);
      alert(error.response?.data?.message || 'Failed to load order details');
    }
  };

  const handleStatusUpdate = async (newStatus: string) => {
    if (!selectedOrder) return;

    try {
      setUpdatingStatus(true);
      await orderAPI.updateStatus(selectedOrder.id, newStatus, statusNote);
      setStatusNote('');
      
      // Refresh order details
      const response = await orderAPI.getById(selectedOrder.id);
      setSelectedOrder(response.data.data || response.data);
      
      // Refresh orders list
      fetchOrders();
    } catch (error: any) {
      console.error('Error updating status:', error);
      alert(error.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-700',
      confirmed: 'bg-blue-100 text-blue-700',
      preparing: 'bg-purple-100 text-purple-700',
      delivering: 'bg-indigo-100 text-indigo-700',
      completed: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: 'Kutilmoqda',
      confirmed: 'Tasdiqlandi',
      preparing: 'Tayyorlanmoqda',
      delivering: 'Yetkazilmoqda',
      completed: 'Bajarildi',
      cancelled: 'Bekor qilindi'
    };
    return labels[status] || status;
  };

  const getAvailableStatuses = (currentStatus: string) => {
    const transitions: Record<string, string[]> = {
      pending: ['confirmed', 'cancelled'],
      confirmed: ['preparing', 'cancelled'],
      preparing: ['delivering', 'cancelled'],
      delivering: ['completed', 'cancelled'],
      completed: [],
      cancelled: []
    };
    return transitions[currentStatus] || [];
  };

  if (loading && orders.length === 0) {
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
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Buyurtmalar</h1>
        <p className="text-gray-600">Barcha buyurtmalarni real-time rejimida ko'rish va boshqarish</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 mb-6">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Qidirish (buyurtma raqami, mijoz)..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Barcha holatlar</option>
            <option value="pending">Kutilmoqda</option>
            <option value="confirmed">Tasdiqlandi</option>
            <option value="preparing">Tayyorlanmoqda</option>
            <option value="delivering">Yetkazilmoqda</option>
            <option value="completed">Bajarildi</option>
            <option value="cancelled">Bekor qilindi</option>
          </select>

          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Boshlanish sanasi"
          />

          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Tugash sanasi"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Buyurtma №</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Mijoz</th>
                <th className="text-right py-4 px-6 font-semibold text-gray-700">Summa</th>
                <th className="text-center py-4 px-6 font-semibold text-gray-700">Holat</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Sana</th>
                <th className="text-center py-4 px-6 font-semibold text-gray-700">Amallar</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-t hover:bg-gray-50">
                  <td className="py-4 px-6 font-semibold text-blue-600">
                    {order.orderNumber}
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-semibold text-gray-800">{order.customerInfo.name}</div>
                    <div className="text-sm text-gray-500">{order.customerInfo.phone}</div>
                  </td>
                  <td className="py-4 px-6 text-right font-semibold text-gray-800">
                    {order.totalAmount.toLocaleString()} so'm
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                      {getStatusLabel(order.status)}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-gray-600">
                    {format(new Date(order.createdAt), 'dd.MM.yyyy HH:mm')}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => handleViewDetails(order)}
                        className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-semibold"
                      >
                        Ko'rish
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="border-t p-4 flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Jami: {pagination.total} ta buyurtma
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                disabled={pagination.page === 1}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Oldingi
              </button>
              <span className="px-4 py-2">
                {pagination.page} / {pagination.totalPages}
              </span>
              <button
                onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                disabled={pagination.page === pagination.totalPages}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Keyingi
              </button>
            </div>
          </div>
        )}
      </div>

      {orders.length === 0 && !loading && (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center mt-6">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Buyurtmalar yo'q</h3>
          <p className="text-gray-600">Hozircha buyurtmalar mavjud emas</p>
        </div>
      )}

      {/* Order Details Modal */}
      {showDetailsModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Buyurtma {selectedOrder.orderNumber}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {format(new Date(selectedOrder.createdAt), 'dd.MM.yyyy HH:mm')}
                </p>
              </div>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Customer Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-3">Mijoz ma'lumotlari</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ism:</span>
                    <span className="font-semibold">{selectedOrder.customerInfo.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Telefon:</span>
                    <span className="font-semibold">{selectedOrder.customerInfo.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Manzil:</span>
                    <span className="font-semibold text-right">{selectedOrder.customerInfo.address}</span>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Buyurtma tarkibi</h3>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Mahsulot</th>
                        <th className="text-center py-3 px-4 font-semibold text-gray-700">Miqdor</th>
                        <th className="text-right py-3 px-4 font-semibold text-gray-700">Narx</th>
                        <th className="text-right py-3 px-4 font-semibold text-gray-700">Jami</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.items.map((item, index) => (
                        <tr key={index} className="border-t">
                          <td className="py-3 px-4">{item.productName}</td>
                          <td className="text-center py-3 px-4">{item.quantity}</td>
                          <td className="text-right py-3 px-4">{item.price.toLocaleString()} so'm</td>
                          <td className="text-right py-3 px-4 font-semibold">{item.subtotal.toLocaleString()} so'm</td>
                        </tr>
                      ))}
                      <tr className="border-t bg-gray-50">
                        <td colSpan={3} className="py-3 px-4 font-semibold text-right">Jami:</td>
                        <td className="py-3 px-4 font-bold text-right text-lg">
                          {selectedOrder.totalAmount.toLocaleString()} so'm
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Payment Method */}
              <div className="flex justify-between items-center bg-gray-50 rounded-lg p-4">
                <span className="text-gray-600">To'lov usuli:</span>
                <span className="font-semibold">{selectedOrder.paymentMethod}</span>
              </div>

              {/* Comment */}
              {selectedOrder.comment && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">Izoh:</h3>
                  <p className="text-gray-700">{selectedOrder.comment}</p>
                </div>
              )}

              {/* Status History */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Holat tarixi</h3>
                <div className="space-y-3">
                  {selectedOrder.statusHistory.map((history, index) => (
                    <div key={index} className="flex gap-4 items-start">
                      <div className="w-3 h-3 bg-blue-600 rounded-full mt-1.5"></div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(history.status)}`}>
                            {getStatusLabel(history.status)}
                          </span>
                          <span className="text-sm text-gray-500">
                            {format(new Date(history.timestamp), 'dd.MM.yyyy HH:mm')}
                          </span>
                        </div>
                        {history.note && (
                          <p className="text-sm text-gray-600 mt-2">{history.note}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Update */}
              {getAvailableStatuses(selectedOrder.status).length > 0 && (
                <div className="border-t pt-6">
                  <h3 className="font-semibold text-gray-800 mb-3">Holatni yangilash</h3>
                  <div className="space-y-3">
                    <textarea
                      value={statusNote}
                      onChange={(e) => setStatusNote(e.target.value)}
                      placeholder="Izoh (ixtiyoriy)"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={2}
                    />
                    <div className="flex gap-2">
                      {getAvailableStatuses(selectedOrder.status).map((status) => (
                        <button
                          key={status}
                          onClick={() => handleStatusUpdate(status)}
                          disabled={updatingStatus}
                          className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50 ${
                            status === 'cancelled'
                              ? 'bg-red-600 text-white hover:bg-red-700'
                              : 'bg-blue-600 text-white hover:bg-blue-700'
                          }`}
                        >
                          {updatingStatus ? 'Yangilanmoqda...' : getStatusLabel(status)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default OrdersPage;
