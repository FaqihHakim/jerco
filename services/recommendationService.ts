import { User, Order, Product } from '../types';

// Step 1: Create a feature vector for each user based on brand purchases
type UserBrandVector = { [brandId: string]: number };

const createUserBrandVectors = (users: User[], orders: Order[], products: Product[]): Map<string, UserBrandVector> => {
    const userVectors = new Map<string, UserBrandVector>();
    const productMap = new Map(products.map(p => [p.id, p]));

    // Initialize vectors for all users
    users.forEach(user => {
        userVectors.set(user.id, {});
    });

    // Populate vectors with purchase counts
    orders.forEach(order => {
        const vector = userVectors.get(order.user_id);
        if (vector) {
            order.items.forEach(item => {
                const product = productMap.get(item.product_id);
                if (product && product.brand_id) {
                    vector[product.brand_id] = (vector[product.brand_id] || 0) + 1;
                }
            });
        }
    });

    return userVectors;
};

// Step 2: Calculate Euclidean distance between two users' vectors
const calculateEuclideanDistance = (vec1: UserBrandVector, vec2: UserBrandVector): number => {
    const allBrands = new Set([...Object.keys(vec1), ...Object.keys(vec2)]);
    let sumOfSquares = 0;

    allBrands.forEach(brandId => {
        const val1 = vec1[brandId] || 0;
        const val2 = vec2[brandId] || 0;
        sumOfSquares += Math.pow(val1 - val2, 2);
    });

    return Math.sqrt(sumOfSquares);
};

// Step 3: Find the k-nearest neighbors
const findNearestNeighbors = (
    currentUserId: string,
    userVectors: Map<string, UserBrandVector>,
    k: number
): { userId: string; distance: number }[] => {
    const currentUserVector = userVectors.get(currentUserId);
    if (!currentUserVector) return [];

    const distances: { userId: string; distance: number }[] = [];

    userVectors.forEach((vector, userId) => {
        if (userId !== currentUserId) {
            const distance = calculateEuclideanDistance(currentUserVector, vector);
            distances.push({ userId, distance });
        }
    });

    // Sort by distance (ascending) and take the top k
    return distances.sort((a, b) => a.distance - b.distance).slice(0, k);
};


// Main recommendation function
export const getKnnRecommendations = (
    currentUser: User,
    allUsers: User[],
    allOrders: Order[],
    allProducts: Product[],
    options: { k: number; numRecommendations: number }
): Product[] => {
    const { k, numRecommendations } = options;
    const productMap = new Map(allProducts.map(p => [p.id, p]));

    // 1. Create user vectors
    const userVectors = createUserBrandVectors(allUsers, allOrders, allProducts);
    
    // 2. Find nearest neighbors
    const neighbors = findNearestNeighbors(currentUser.id, userVectors, k);
    if (neighbors.length === 0) return [];

    // 3. Gather products from neighbors' purchase history
    const currentUserPurchasedProductIds = new Set(
        allOrders
            .filter(o => o.user_id === currentUser.id)
            .flatMap(o => o.items.map(i => i.product_id))
    );

    const recommendationPool = new Map<string, number>(); // <productId, frequency>

    neighbors.forEach(neighbor => {
        const neighborOrders = allOrders.filter(o => o.user_id === neighbor.userId);
        neighborOrders.forEach(order => {
            order.items.forEach(item => {
                // Only recommend if the current user hasn't bought it
                if (!currentUserPurchasedProductIds.has(item.product_id)) {
                    recommendationPool.set(item.product_id, (recommendationPool.get(item.product_id) || 0) + 1);
                }
            });
        });
    });

    // 4. Sort potential recommendations by frequency and get the top N
    const sortedRecommendations = Array.from(recommendationPool.entries())
        .sort((a, b) => b[1] - a[1]) // Sort by frequency desc
        .slice(0, numRecommendations)
        .map(([productId, _]) => productMap.get(productId))
        .filter((p): p is Product => p !== undefined); // Type guard to filter out undefined

    // If not enough recommendations, fill with top-selling items the user hasn't bought
    if (sortedRecommendations.length < numRecommendations) {
        const topSellers = allProducts
            .filter(p => !currentUserPurchasedProductIds.has(p.id) && !recommendationPool.has(p.id))
            .sort((a,b) => (b.stock_quantity > a.stock_quantity ? -1 : 1)) // Mock top sellers by reversing stock
            .slice(0, numRecommendations - sortedRecommendations.length);
        
        return [...sortedRecommendations, ...topSellers];
    }
    
    return sortedRecommendations;
};
