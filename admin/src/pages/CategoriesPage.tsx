import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../services/api';

interface Category {
  id: string;
  name: string;
  description?: string;
  imageUrl: string;
  productCount: number;
  isActive: boolean;
  createdAt: string;
}

const CategoriesPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    imageUrl: ''
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await api.get('/categories');
      setCategories(response.data.data || response.data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await api.put(`/categories/${editingCategory.id}`, formData);
      } else {
        await api.post('/categories', formData);
      }
      setShowModal(false);
      setFormData({ name: '', description: '', imageUrl: '' });
      setEditingCategory(null);
      fetchCategories();
    } catch (error: any) {
      console.error('Failed to save category:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Kategoriya saqlanmadi';
      alert(`Xato: ${errorMessage}\n\nIltimos qayta login qiling yoki qayta urinib ko'ring.`);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      imageUrl: category.imageUrl
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Kategoriyani o\'chirmoqchimisiz?')) return;
    try {
      await api.delete(`/categories/${id}`);
      fetchCategories();
    } catch (error) {
      console.error('Failed to delete category:', error);
      alert('Kategoriya o\'chirilmadi. Iltimos qayta urinib ko\'ring.');
    }
  };

  const toggleStatus = async (id: string, isActive: boolean) => {
    try {
      await api.put(`/categories/${id}`, { isActive: !isActive });
      fetchCategories();
    } catch (error) {
      console.error('Failed to toggle status:', error);
    }
  };

  return (
    <Layout>
      <div>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Kategoriyalar</h1>
            <p className="text-gray-600">Mahsulot kategoriyalarini boshqarish</p>
          </div>
          <button
            onClick={() => {
              setEditingCategory(null);
              setFormData({ name: '', description: '', imageUrl: '' });
              setShowModal(true);
            }}
            className="bg-[#FF6B35] text-white px-6 py-3 rounded-xl hover:bg-[#ff5722] transition-colors font-medium"
          >
            + Yangi Kategoriya
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B35]"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <div key={category.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="h-48 overflow-hidden">
                  <img
                    src={category.imageUrl}
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-1">{category.name}</h3>
                      <p className="text-sm text-gray-500">{category.productCount} mahsulot</p>
                    </div>
                    <button
                      onClick={() => toggleStatus(category.id, category.isActive)}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        category.isActive
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {category.isActive ? 'Faol' : 'Nofaol'}
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(category)}
                      className="flex-1 bg-blue-50 text-blue-600 px-4 py-2 rounded-xl hover:bg-blue-100 transition-colors font-medium"
                    >
                      Tahrirlash
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="flex-1 bg-red-50 text-red-600 px-4 py-2 rounded-xl hover:bg-red-100 transition-colors font-medium"
                    >
                      O'chirish
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && categories.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
            <div className="text-6xl mb-4">📂</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Kategoriyalar yo'q</h3>
            <p className="text-gray-600 mb-6">Birinchi kategoriyani yarating</p>
            <button
              onClick={() => setShowModal(true)}
              className="bg-[#FF6B35] text-white px-6 py-3 rounded-xl hover:bg-[#ff5722] transition-colors font-medium"
            >
              + Yangi Kategoriya
            </button>
          </div>
        )}

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                {editingCategory ? 'Kategoriyani tahrirlash' : 'Yangi kategoriya'}
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kategoriya nomi *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                    placeholder="Masalan: Burgerlar"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tavsif *
                  </label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                    placeholder="Kategoriya haqida qisqacha ma'lumot (kamida 10 belgi)"
                    rows={3}
                    minLength={10}
                    maxLength={500}
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rasm URL *
                  </label>
                  <input
                    type="url"
                    required
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                    placeholder="https://example.com/image.jpg"
                  />
                  {formData.imageUrl && (
                    <img
                      src={formData.imageUrl}
                      alt="Preview"
                      className="mt-3 w-full h-32 object-cover rounded-xl"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/400x200?text=Invalid+Image';
                      }}
                    />
                  )}
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingCategory(null);
                      setFormData({ name: '', description: '', imageUrl: '' });
                    }}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                  >
                    Bekor qilish
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-[#FF6B35] text-white px-6 py-3 rounded-xl hover:bg-[#ff5722] transition-colors font-medium"
                  >
                    {editingCategory ? 'Saqlash' : 'Yaratish'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CategoriesPage;
