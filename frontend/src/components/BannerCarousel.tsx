import { useState, useEffect } from 'react';
import axios from 'axios';

interface Banner {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  ctaText?: string;
  ctaLink?: string;
  isActive: boolean;
  order: number;
}

const BannerCarousel = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBanners();
  }, []);

  useEffect(() => {
    if (banners.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [banners.length]);

  const fetchBanners = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await axios.get(`${apiUrl}/banners`);
      const activeBanners = response.data.filter((b: Banner) => b.isActive);
      setBanners(activeBanners);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching banners:', error);
      setLoading(false);
    }
  };

  const handleCTAClick = (banner: Banner) => {
    if (banner.ctaLink) {
      if (banner.ctaLink.startsWith('http')) {
        window.open(banner.ctaLink, '_blank');
      } else {
        window.location.href = banner.ctaLink;
      }
    }
  };

  if (loading) {
    return (
      <div className="relative h-48 bg-gradient-to-r from-gray-200 to-gray-300 rounded-[24px] animate-pulse"></div>
    );
  }

  if (banners.length === 0) {
    return null;
  }

  const currentBanner = banners[currentIndex];

  return (
    <div className="relative h-48 rounded-[24px] overflow-hidden shadow-lg">
      {/* Banner Image */}
      <img
        src={currentBanner.imageUrl}
        alt={currentBanner.title}
        className="w-full h-full object-cover"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-center px-6">
        <h2 className="text-white text-2xl font-bold mb-2 drop-shadow-lg">
          {currentBanner.title}
        </h2>
        <p className="text-white/90 text-sm mb-4 drop-shadow-md">
          {currentBanner.description}
        </p>
        {currentBanner.ctaText && (
          <button
            onClick={() => handleCTAClick(currentBanner)}
            className="bg-[#FF6B35] text-white px-6 py-2.5 rounded-full font-semibold text-sm w-fit hover:bg-[#ff5722] transition-colors shadow-lg"
          >
            {currentBanner.ctaText}
          </button>
        )}
      </div>

      {/* Navigation Dots */}
      {banners.length > 1 && (
        <div className="absolute bottom-4 right-6 flex gap-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex
                  ? 'bg-white w-6'
                  : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BannerCarousel;
