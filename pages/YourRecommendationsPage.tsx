import React, { useEffect, useState } from 'react';
import { Product, User, Order } from '../types';
import * as productService from '../services/productService';
import * as authService from '../services/authService';
import * as orderService from '../services/orderService';
import * as recommendationService from '../services/recommendationService';
import ProductCard from '../components/common/ProductCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

const YourRecommendationsPage: React.FC = () => {
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, token } = useAuth();

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!user || !token) {
        setError("Please log in to see your recommendations.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        // Fetch all data required for the k-NN algorithm
        // In a real app, this logic would be on the backend
        const [allUsers, allOrders, allProducts] = await Promise.all([
            authService.getAllUsers(token),
            orderService.getAllOrders(token),
            productService.getAllProducts({ limit: 200 }).then(res => res.items)
        ]);
        
        const recommendations = recommendationService.getKnnRecommendations(user, allUsers, allOrders, allProducts, { k: 2, numRecommendations: 6 });
        setRecommendedProducts(recommendations);

      } catch (err: any) {
        setError(err.message || 'Failed to load your recommendations.');
        console.error("Recommendation fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRecommendations();
  }, [user, token]);

  return (
    <div className="pb-16">
      <header className="bg-gray-100 py-10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-extrabold text-black">Specially For You, {user?.username}</h1>
          <p className="text-gray-600 mt-2 max-w-2xl mx-auto">Based on your interests and purchase history, we think you'll love these.</p>
        </div>
      </header>
      
      <main className="container mx-auto px-4 pt-12">
         <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-800 text-sm">
            <strong>How this works:</strong> Our k-Nearest Neighbors (k-NN) algorithm finds other users with similar purchase histories to yours. We then recommend products they love that you haven't discovered yet. The more you shop, the better your recommendations become!
         </div>

        {isLoading ? (
          <LoadingSpinner message="Analyzing your preferences..." />
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : recommendedProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {recommendedProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-600 py-10">
            <p className="mb-4">We're still learning your style! Browse and purchase items to get personalized recommendations.</p>
            <Link to="/products" className="text-lg font-semibold text-black bg-white py-2 px-4 rounded-lg shadow-sm border hover:bg-gray-50">
              Explore Products
            </Link>
          </div>
        )}
      </main>
    </div>
  );
};

export default YourRecommendationsPage;