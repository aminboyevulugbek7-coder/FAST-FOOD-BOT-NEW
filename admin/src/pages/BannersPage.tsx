import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { bannerAPI } from '../services/api';

interface Banner {
  id: string;
  title: string;
  imageUrl: string;
  linkUrl?: string;
  order: number;
  isActive: boolean;
  createdAt: string;
}

const BannersPage = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    imageUrl: '',
    linkUrl: ''
  });

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const response = await bannerAPI.getAll();
      const data = response.data.data || response.data;
      setBanners(data || []);
    } catch (error) {
      console.error('Failed to fetch banners:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingBanner) {
        await bannerAPI.update(editingBanner.id, formData);
      } else {
        await bannerAPI.create(formData);
      }
      setShowModal(false);
      setFormData({ title: '', imageUrl: '', linkUrl: '' });
      setEditingBanner(null);
      fetchBanners();
    } catch (error) {
      console.error('Failed to save banner:', error);
      alert('Banner saqlanmadi. Iltimos qayta urinib ko\'ring.');
    }
  };

  const handleEdit = (banner: Banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title,
      imageUrl: banner.imageUrl,
      linkUrl: banner.linkUrl || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bannerni o\'chirmoqchimisiz?')) return;
    try {
      await bannerAPI.delete(id);
      fetchBanners();
    } catch (error) {
      console.error('Failed to delete banner:', error);
      alert('Banner o\'chirilmadi. Iltimos qayta urinib ko\'ring.');
    }
  };

  const toggleStatus = async (id: string, isActive: boolean) => {
    try {
      await bannerAPI.update(id, { isActive: !isActive });
      fetchBanners();
    } catch (error) {
      console.error('Failed to toggle status:', error);
    }
  };

  return (
    <Layout>
      <div>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Bannerlar</h1>
            <p className="text-gray-600">Reklama bannerlarini boshqarish</p>
          </div>
          <button
            onClick={() => {
              setEditingBanner(null);
              setFormData({ title: '', imageUrl: '', linkUrl: '' });
              setShowModal(true);
            }}
            className="bg-[#FF6B35] text-white px-6 py-3 rounded-xl hover:bg-[#ff5722] transition-colors font-medium"
          >
            + Yangi Banner
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B35]"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {banners.map((banner) => (
              <div key={banner.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/3 h-48 overflow-hidden">
                    <img
                      src={banner.imageUrl}
                      alt={banner.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800 mb-1">{banner.title}</h3>
                        {banner.linkUrl && (
                          <a href={banner.linkUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                            {banner.linkUrl}
                          </a>
                        )}
                      </div>
                      <button
                        onClick={() => toggleStatus(banner.id, banner.isActive)}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          banner.isActive
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {banner.isActive ? 'Faol' : 'Nofaol'}
                      </button>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(banner)}
                        className="bg-blue-50 text-blue-600 px-4 py-2 rounded-xl hover:bg-blue-100 transition-colors font-medium"
                      >
                        Tahrirlash
                      </button>
                      <button
                        onClick={() => handleDelete(banner.id)}
                        className="bg-red-50 text-red-600 px-4 py-2 rounded-xl hover:bg-red-100 transition-colors font-medium"
                      >
                        O'chirish
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && banners.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
            <div className="text-6xl mb-4">🎨</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Bannerlar yo'q</h3>
            <p className="text-gray-600 mb-6">Birinchi bannerni yarating</p>
            <button
              onClick={() => setShowModal(true)}
              className="bg-[#FF6B35] text-white px-6 py-3 rounded-xl hover:bg-[#ff5722] transition-colors font-medium"
            >
              + Yangi Banner
            </button>
          </div>
        )}

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                {editingBanner ? 'Bannerni tahrirlash' : 'Yangi banner'}
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Banner nomi *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                    placeholder="Masalan: Yangi chegirma"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rasm URL *
                  </label>
                  <input
                    type="url"
                    required
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                    placeholder="https://example.com/banner.jpg"
                  />
                  {formData.imageUrl && (
                    <img
                      src={formData.imageUrl}
                      alt="Preview"
                      className="mt-3 w-full h-32 object-cover rounded-xl"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/800x200?text=Invalid+Image';
                      }}
                    />
                  )}
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Link URL (ixtiyoriy)
                  </label>
                  <input
                    type="url"
                    value={formData.linkUrl}
                    onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                    placeholder="https://example.com/promo"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingBanner(null);
                      setFormData({ title: '', imageUrl: '', linkUrl: '' });
                    }}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                  >
                    Bekor qilish
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-[#FF6B35] text-white px-6 py-3 rounded-xl hover:bg-[#ff5722] transition-colors font-medium"
                  >
                    {editingBanner ? 'Saqlash' : 'Yaratish'}
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

export default BannersPage;
