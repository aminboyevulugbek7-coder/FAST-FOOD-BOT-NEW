import { Router, Request, Response } from 'express';

const router = Router();

// Mock products data (in real app, this would be from database)
const products = [
  { id: 1, name: 'Cheeseburger', price: 25000, category: 'burgers', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400' },
  { id: 2, name: 'Chicken Burger', price: 23000, category: 'burgers', image: 'https://images.unsplash.com/photo-1615297928064-24977384d0f9?w=400' },
  { id: 3, name: 'Pepperoni Pizza', price: 45000, category: 'pizza', image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400' },
  { id: 4, name: 'Coca Cola', price: 8000, category: 'drinks', image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400' },
  { id: 5, name: 'Ice Cream', price: 12000, category: 'desserts', image: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=400' },
];

// Get all products
router.get('/', (req: Request, res: Response) => {
  try {
    const { category } = req.query;
    
    let filteredProducts = products;
    if (category) {
      filteredProducts = products.filter(p => p.category === category);
    }

    res.json({
      success: true,
      data: filteredProducts
    });
  } catch (error: any) {
    console.error('❌ Error fetching products:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get product by ID
router.get('/:id', (req: Request, res: Response) => {
  try {
    const product = products.find(p => p.id === parseInt(req.params.id));
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Mahsulot topilmadi'
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error: any) {
    console.error('❌ Error fetching product:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

export default router;
