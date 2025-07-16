
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Product } from '../types';
import * as productService from '../services/productService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Button from '../components/common/Button';
import ProductCard from '../components/common/ProductCard';
import { DEFAULT_CURRENCY } from '../constants';
import { useCart } from '../contexts/CartContext';
import { Star, Minus, Plus, ShoppingCart, ShieldCheck } from 'lucide-react';

const ProductDetailPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const { addToCart, isLoading: isCartLoading } = useCart();

  useEffect(() => {
    if (!productId) {
      setError('Product ID is missing.');
      setIsLoading(false);
      return;
    }
    const fetchProductData = async () => {
      setIsLoading(true);
      setError(null);
      window.scrollTo(0, 0); // Scroll to top on new product load
      try {
        const fetchedProduct = await productService.getProductById(productId);
        setProduct(fetchedProduct);
        
        // Fetch related products (e.g., from the same brand)
        const { items } = await productService.getAllProducts({ brand: fetchedProduct.brand_id, limit: 5 });
        setRelatedProducts(items.filter(p => p.id !== productId).slice(0, 4));

      } catch (err: any) {
        setError(err.message || 'Failed to load product details.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProductData();
  }, [productId]);
  
  const handleQuantityChange = (change: number) => {
    setQuantity(prev => {
        const newQuantity = prev + change;
        if (newQuantity < 1) return 1;
        if (product && newQuantity > product.stock_quantity) return product.stock_quantity;
        return newQuantity;
    });
  };

  const handleAddToCart = () => {
    if (!product) return;
    const requiresSizeSelection = product.sizes && product.sizes.length > 0;

    if (requiresSizeSelection && !selectedSize) {
        alert('Please select a size.');
        return;
    }

    const sizeToAdd = selectedSize || 'onesize';
    addToCart(product, quantity, sizeToAdd);
    alert(`${quantity} x ${product.name} (Size: ${sizeToAdd}) added to cart!`);
  };

  if (isLoading) return <div className="min-h-[60vh] flex items-center justify-center"><LoadingSpinner message="Loading product..." /></div>;
  if (error) return <div className="text-center text-red-500 py-10">{error}</div>;
  if (!product) return <div className="text-center text-gray-600 py-10">Product not found.</div>;

  const rating = 4.7; // Mock rating
  const requiresSizeSelection = product.sizes && product.sizes.length > 0;

  return (
    <div className="bg-white">
        <div className="container mx-auto px-4 py-8">
            {/* Breadcrumbs */}
            <nav className="text-sm mb-6 text-gray-500">
                <Link to="/home" className="hover:text-black">Home</Link>
                <span className="mx-2">/</span>
                <Link to="/products" className="hover:text-black">Products</Link>
                <span className="mx-2">/</span>
                <span className="text-black font-medium">{product.name}</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Product Image */}
                <div className="aspect-[4/5] bg-gray-100 rounded-xl overflow-hidden">
                    <img 
                        src={product.image_url || `https://picsum.photos/seed/${product.id}/600/750`} 
                        alt={product.name} 
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Product Details */}
                <div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-black mb-2">{product.name}</h1>
                    <div className="flex items-center mb-4">
                        <span className="text-gray-500">by <Link to={`/products?brand=${product.brand_id}`} className="font-medium text-black hover:underline">{product.brand?.name || 'Unknown Brand'}</Link></span>
                        <div className="border-l mx-4 h-4"></div>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-5 h-5 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                            />
                          ))}
                          <span className="ml-2 text-sm text-gray-600">{rating} ({Math.floor(Math.random()*100)} reviews)</span>
                        </div>
                    </div>
                    
                    <p className="text-4xl font-bold text-black mb-4">
                        {DEFAULT_CURRENCY} {product.price.toLocaleString('id-ID')}
                    </p>

                    <p className="text-gray-700 leading-relaxed mb-6">{product.description}</p>
                    
                    {/* Size Selector */}
                    {requiresSizeSelection && (
                        <div className="mb-6">
                            <h3 className="text-sm font-semibold text-gray-800 mb-3">Select Size: <span className="text-red-500">*</span></h3>
                            <div className="flex flex-wrap gap-2">
                                {product.sizes?.map(size => (
                                    <button
                                      key={size}
                                      onClick={() => setSelectedSize(size)}
                                      className={`px-4 py-2 text-sm border rounded-md transition-colors ${
                                        selectedSize === size
                                          ? 'bg-black text-white border-black'
                                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                                      }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    {/* Quantity & Add to Cart */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                        <div className="flex items-center border border-gray-300 rounded-full p-1">
                             <button onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1} className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50">
                                <Minus className="h-4 w-4" />
                            </button>
                            <span className="w-12 text-center font-medium">{quantity}</span>
                            <button onClick={() => handleQuantityChange(1)} disabled={quantity >= product.stock_quantity} className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50">
                                <Plus className="h-4 w-4" />
                            </button>
                        </div>
                        <Button 
                            onClick={handleAddToCart}
                            variant="primary" 
                            size="lg" 
                            className="flex-1"
                            leftIcon={<ShoppingCart size={20}/>}
                            isLoading={isCartLoading}
                            disabled={product.stock_quantity === 0 || (requiresSizeSelection && !selectedSize)}
                            title={
                                product.stock_quantity === 0 ? "Out of stock" :
                                (requiresSizeSelection && !selectedSize) ? "Please select a size" : "Add to cart"
                            }
                        >
                           {product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                        </Button>
                    </div>

                    <div className="flex items-center gap-3 text-sm text-green-600">
                        <ShieldCheck size={18} />
                        <span>100% Original Product Guarantee</span>
                    </div>

                    <p className="text-sm text-gray-500 mt-2">
                      {product.stock_quantity > 0 ? `${product.stock_quantity} items left in stock.` : 'This item is currently out of stock.'}
                    </p>
                </div>
            </div>

            {/* Related Products */}
            {relatedProducts.length > 0 && (
                <section className="mt-16 pt-12 border-t">
                    <h2 className="text-3xl font-bold text-center mb-12">You Might Also Like</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                        {relatedProducts.map(relatedProduct => (
                            <ProductCard key={relatedProduct.id} product={relatedProduct} />
                        ))}
                    </div>
                </section>
            )}
        </div>
    </div>
  );
};

export default ProductDetailPage;
