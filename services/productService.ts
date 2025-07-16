

import { Product, Brand, PaginatedResponse } from '../types';

export const mockBrands: Brand[] = [
    { id: '1', name: 'Nike', description: 'Just Do It.' },
    { id: '2', name: 'Adidas', description: 'Impossible is Nothing.' },
    { id: '3', name: 'Puma', description: 'Forever Faster.' },
    { id: '4', name: 'Kappa', description: 'Omini logo.' },
    { id: '5', name: 'Ortuseight', description: 'Indonesian sports brand.' },
];

export const mockProducts: Omit<Product, 'brand'>[] = [
  // Puma Products with correct images
  { id: 'p-1', name: 'Jersey Autentik Kandang AC Milan 25/26 Pria', description: 'Jersey resmi kandang AC Milan musim 2025/2026 untuk pria, dengan detail otentik dan kualitas premium untuk penggemar sejati Rossoneri.', price: 1999000, stock_quantity: 50, brand_id: '3', category: 'jersey', sizes: ['S', 'M', 'L', 'XL'], image_url: 'https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000/global/774949/01/fnd/IDN/fmt/png/AC-Milan-24/25-Authentic-Home-Jersey-Men' },
  { id: 'p-2', name: 'Jersey Kandang Portugal 2025 Pria', description: 'Jersey kandang tim nasional Portugal edisi tahun 2025, cocok untuk mendukung tim favorit dengan gaya sporty.', price: 1199000, stock_quantity: 23, brand_id: '3', category: 'jersey', sizes: ['S', 'M', 'L'], image_url: 'https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_500,h_500/global/779190/01/fnd/IDN/fmt/png/Portugal-2025-Home-Jersey-Men' },
  { id: 'p-3', name: 'Jersey Tandang Portugal 2025 Pria', description: 'Jersey tandang tim nasional Portugal edisi 2025, desain stylish dengan teknologi kenyamanan maksimal.', price: 1199000, stock_quantity: 30, brand_id: '3', category: 'jersey', sizes: ['M', 'L', 'XL'], image_url: 'https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_500,h_500/global/779209/04/fnd/IDN/fmt/png/Portugal-2025-Away-Jersey-Men' },
  { id: 'p-4', name: 'Jersey Pria Borussia Dortmund 24/25 Cup', description: 'Jersey edisi Piala Borussia Dortmund musim 2024/2025 dengan potongan harga spesial, bernuansa hitam-kuning ikonik.', price: 527560, stock_quantity: 43, brand_id: '3', category: 'jersey', sizes: ['L', 'XL', 'XXL'], image_url: 'https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000/global/775680/01/fnd/IDN/fmt/png/Borussia-Dortmund-24/25-Cup-Jersey-Men' },
  { id: 'p-5', name: 'Jersey Tandang Pria AC Milan 24/25', description: 'Jersey tandang resmi AC Milan musim 2024/2025, desain modern dengan teknologi dryCELL untuk kenyamanan optimal.', price: 629475, stock_quantity: 48, brand_id: '3', category: 'jersey', sizes: ['S', 'M', 'L'], image_url: 'https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_500,h_500/global/775015/02/fnd/SEA/fmt/png/AC-Milan-24/25-Away-Jersey-Men' },
  { id: 'p-6', name: 'Jersey Tandang Pria Manchester City 23/24', description: 'Jersey tandang resmi Manchester City musim 2023/2024 dengan desain garis-garis vertikal yang berani berwarna biru dan hijau neon.', price: 629475, stock_quantity: 44, brand_id: '3', category: 'jersey', sizes: ['S', 'M', 'L', 'XL'], image_url: 'https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000/global/775089/02/fnd/IDN/fmt/png/Manchester-City-24/25-Away-Jersey-Youth' },
  { id: 'p-7', name: 'Jersey Tandang Pria Borussia Dortmund 24/25', description: 'Jersey tandang resmi Borussia Dortmund 2024/2025 dengan potongan harga dan desain atletis khas Die Borussen.', price: 539550, stock_quantity: 33, brand_id: '3', category: 'jersey', sizes: ['M', 'L'], image_url: 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcT8-_2avjb-3s88cO635eSMzCsCX51fi59RCcPyoFgtFLtaairl' },
  { id: 'p-8', name: 'Jersey Pra-pertandingan Manchester City Pria', description: 'Jersey pra-pertandingan Manchester City dengan bahan ringan, cocok dipakai sebelum atau saat latihan.', price: 599250, stock_quantity: 41, brand_id: '3', category: 'jersey', sizes: ['S', 'M', 'L', 'XL'], image_url: 'https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000/global/779155/77/fnd/IDN/fmt/png/Manchester-City-Pre-match-Jersey-Men' },
  { id: 'p-9', name: 'Jersey Pra-pertandingan AC Milan Pria', description: 'Jersey pra-pertandingan AC Milan dengan desain dinamis dan bahan elastis untuk pergerakan bebas.', price: 599250, stock_quantity: 22, brand_id: '3', category: 'jersey', sizes: ['S', 'M', 'L'], image_url: 'https://dynamic.zacdn.com/vdN7PbqzsKLjWFaZYTc3KmeYyIA=/filters:quality(70):format(webp)/https://static-my.zacdn.com/p/puma-1919-1688414-1.jpg' },
  { id: 'p-10', name: 'Jersey Latihan Pria Manchester City', description: 'Jersey latihan resmi Manchester City dengan teknologi dryCELL, cocok untuk aktivitas olahraga atau santai.', price: 351560, stock_quantity: 29, brand_id: '3', category: 'jersey', sizes: ['S', 'M', 'L'], image_url: 'https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_500,h_500/global/777521/13/fnd/IDN/fmt/png/Manchester-City-Training-Jersey-Men' },

  // Adidas Products with correct images
  { id: 'a-1', name: 'Arsenal Tiro 24 Training Jersey', description: 'Jersey slim-fit untuk latihan Arsenal, dibuat dengan bahan daur ulang.', price: 600000, stock_quantity: 29, brand_id: '2', category: 'jersey', sizes: ['S', 'M', 'L'], image_url: 'https://www.adidas.co.id/media/catalog/product/cache/a2326ed7dcde4da57fee4197e095ea73/j/f/jf2915_1_apparel_photography_front_center_view_grey.jpg' },
  { id: 'a-2', name: 'AS Roma 24/25 Home Jersey', description: 'Jersey kandang yang terinspirasi dari sejarah AS Roma dan dibuat dengan bahan daur ulang.', price: 1200000, stock_quantity: 53, brand_id: '2', category: 'jersey', sizes: ['S', 'M', 'L', 'XL'], image_url: 'https://www.adidas.co.id/media/catalog/product/cache/a2326ed7dcde4da57fee4197e095ea73/i/t/it6056_1_apparel_photography_front_view_grey.jpg' },
  { id: 'a-3', name: 'FC Bayern 24/25 Away Jersey', description: 'Jersey fan yang terinspirasi dari ikon Bavaria dan dibuat dengan bahan daur ulang.', price: 1200000, stock_quantity: 74, brand_id: '2', category: 'jersey', sizes: ['S', 'M', 'L', 'XL'], image_url: 'https://www.adidas.co.id/media/catalog/product/cache/a2326ed7dcde4da57fee4197e095ea73/i/x/ix3165_1_apparel_photography_front_view_grey.jpg' },
  { id: 'a-4', name: 'Juventus 24/25 Home Jersey', description: 'Jersey Juventus dengan misi menjaga kenyamanan penggemar, dibuat dengan bahan daur ulang.', price: 1200000, stock_quantity: 41, brand_id: '2', category: 'jersey', sizes: ['M', 'L', 'XL'], image_url: 'https://www.adidas.co.id/media/catalog/product/i/t/it6058_2_apparel_photography_front20center20view_grey.jpg' },
  { id: 'a-5', name: 'Manchester United 25/26 Long Sleeve Home Jersey', description: 'Dibuat untuk kenyamanan, jersey kandang Man Utd yang tak lekang oleh waktu ini dihiasi sentuhan gaya Old Trafford.', price: 1200000, stock_quantity: 62, brand_id: '2', category: 'jersey', sizes: ['S', 'M', 'L'], image_url: 'https://www.adidas.co.id/media/catalog/product/cache/da73f7d26ad11f1980ada40c1f6e78fa/i/z/iz3130_2_apparel_photography_front20center20view_grey.jpg' },
  { id: 'a-6', name: 'Newcastle United FC 24/25 Home Jersey', description: 'Jersey kandang yang berani dengan gaya klasik The Magpies, dibuat dengan bahan daur ulang.', price: 1200000, stock_quantity: 98, brand_id: '2', category: 'jersey', sizes: ['M', 'L', 'XL'], image_url: 'https://www.adidas.co.id/media/catalog/product/cache/a2326ed7dcde4da57fee4197e095ea73/j/p/jp3037_1_apparel_photography_front_center_view_grey.jpg' },
  { id: 'a-7', name: 'Real Madrid 25/26 Away Authentic Jersey', description: 'Jersey Real Madrid siap tanding yang memberi penghormatan pada wajah baru Bernabéu.', price: 2000000, stock_quantity: 35, brand_id: '2', category: 'jersey', sizes: ['S', 'M', 'L'], image_url: 'https://www.adidas.co.id/media/catalog/product/cache/da73f7d26ad11f1980ada40c1f6e78fa/i/z/iz1642_2_apparel_photography_front20center20view_grey.jpg' },
  { id: 'a-8', name: 'Real Madrid 25/26 Away Jersey', description: 'Jersey Real Madrid untuk penggemar yang memberi penghormatan pada wajah baru Bernabéu.', price: 1200000, stock_quantity: 86, brand_id: '2', category: 'jersey', sizes: ['S', 'M', 'L', 'XL'], image_url: 'https://www.adidas.co.id/media/catalog/product/cache/a2326ed7dcde4da57fee4197e095ea73/j/j/jj4182_1_apparel_photography_front_center_view_grey.jpg' },
  { id: 'a-9', name: 'Real Madrid 25/26 Home Authentic Jersey', description: 'Hormati markas ikonik Real Madrid dengan jersey adidas berfokus pada performa ini.', price: 2000000, stock_quantity: 77, brand_id: '2', category: 'jersey', sizes: ['S', 'M', 'L'], image_url: 'https://www.adidas.co.id/media/catalog/product/cache/a2326ed7dcde4da57fee4197e095ea73/j/v/jv5918_1_apparel_photography_front_center_view_grey.jpg' },
  { id: 'a-10', name: 'Real Madrid 25/26 Long Sleeve Home Jersey', description: 'Hormati markas ikonik Real Madrid dengan jersey sepak bola yang berfokus pada pendukung ini.', price: 1400000, stock_quantity: 10, brand_id: '2', category: 'jersey', sizes: ['L', 'XL'], image_url: 'https://www.adidas.co.id/media/catalog/product/cache/a2326ed7dcde4da57fee4197e095ea73/j/n/jn8884_1_apparel_photography_front_center_view_grey.jpg' },

  // Ortuseight Products with correct images
  { id: 'o-1', name: 'ORTUSEIGHT X TIMNAS AMPUTASI JERSEY', description: 'Jersey eksklusif untuk mendukung semangat para atlet Tim Nasional Sepak Bola Amputasi Indonesia.', price: 359100, stock_quantity: 0, brand_id: '5', category: 'jersey', sizes: ['S', 'M', 'L'], image_url: 'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcS5XRGaKo1RJd_b6QD16hOyT5MUDG-YrrvmtcN-PIS4wH_ZNREW' },
  { id: 'o-2', name: 'TIGRIS JERSEY WHITE', description: 'Jersey sporty dengan desain simpel dan elegan berwarna putih bersih.', price: 161000, stock_quantity: 60, brand_id: '5', category: 'jersey', sizes: ['S', 'M', 'L', 'XL'], image_url: 'https://s3-ap-southeast-1.amazonaws.com/plugolive/vendor/11465/product/1_1745316843993.jpg' },
  { id: 'o-3', name: 'TIGRIS JERSEY RED', description: 'Jersey sporty dengan dominasi warna merah dan aksen putih yang mencolok.', price: 161000, stock_quantity: 55, brand_id: '5', category: 'jersey', sizes: ['S', 'M', 'L', 'XL'], image_url: 'https://down-id.img.susercontent.com/file/id-11134207-7rbk3-mai9ca8nqg2hbd' },
  { id: 'o-4', name: 'INFINITY JERSEY BLACK', description: 'Jersey bergaya modern dengan nuansa hitam elegan dan aksen grafis abu-abu.', price: 269100, stock_quantity: 70, brand_id: '5', category: 'jersey', sizes: ['M', 'L', 'XL'], image_url: 'https://down-id.img.susercontent.com/file/sg-11134201-7rbnc-lonsklj3x7lze1' },
  { id: 'o-5', name: 'INFINITY JERSEY WHITE', description: 'Jersey dengan warna dasar putih bersih dipadukan aksen emas elegan.', price: 269100, stock_quantity: 65, brand_id: '5', category: 'jersey', sizes: ['S', 'M', 'L'], image_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbM0zp4YHjyNJg4JkbvvONTOa3ysWlVJM_wISQ80J3PQWXbaxH' },
  { id: 'o-6', name: 'HYPERDRIVE RN JERSEY', description: 'Dirancang untuk memberikan kenyamanan maksimal saat berlatih dengan teknologi OrtDry.', price: 179100, stock_quantity: 80, brand_id: '5', category: 'jersey', sizes: ['S', 'M', 'L', 'XL'], image_url: 'https://sportaways.com/media/catalog/product/cache/cd7c6c71a47e90564e17811b95cac4e3/o/r/ortuseight_hyperdrive_rn_jersey_-_ortred_1.jpg' },
  { id: 'o-7', name: 'Hyperfuse 2.1 RN Jersey LS', description: 'Seri terbaru dari Hyperfuse Running Jersey dengan lengan panjang dan teknologi OrtDry.', price: 179100, stock_quantity: 40, brand_id: '5', category: 'jersey', sizes: ['M', 'L', 'XL'], image_url: 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQx6ZfoMuPwkz34jrhQcfeDJskWzNrcqF_0dhdeuabWC62ktFbX' },
  { id: 'o-8', name: 'HYPERBLAST 2.0 RN JERSEY M', description: 'Cocok untuk pria yang aktif berolahraga, dengan teknologi OrtDry dan motif langit.', price: 179100, stock_quantity: 35, brand_id: '5', category: 'jersey', sizes: ['S', 'M', 'L'], image_url: 'https://sportaways.com/media/catalog/product/cache/cd7c6c71a47e90564e17811b95cac4e3/o/r/ortuseight_hyperblast_2.0_rn_jersey_m_-_sage_green_m_1.jpg' },
  { id: 'o-9', name: 'HYPERSONIC 1.3 RN JERSEY M', description: 'Produk yang ringan dengan warna cyan cerah yang dirancang untuk performa tinggi.', price: 179100, stock_quantity: 50, brand_id: '5', category: 'jersey', sizes: ['S', 'M', 'L'], image_url: 'https://images.tokopedia.net/img/cache/700/VqbcmM/2025/1/13/a02789a5-9738-43c3-ab05-9c7bddf26419.png' },
  { id: 'o-10', name: 'HYPERFUSE 2.1 RN JERSEY Ortrange Yellow', description: 'Seri terbaru Hyperfuse Running Jersey dengan lengan panjang dan grafis dua warna.', price: 179100, stock_quantity: 45, brand_id: '5', category: 'jersey', sizes: ['M', 'L', 'XL'], image_url: 'https://sportaways.com/media/catalog/product/cache/cd7c6c71a47e90564e17811b95cac4e3/o/r/ortuseight_hyperfuse_2.1_rn_jersey_-_ortrangeyellow_1.jpg' },

  // Other apparel - Retained for AI Style Advisor
  { id: '101', name: 'Pro-Vent Football Shorts - White', description: 'White professional football shorts with moisture-wicking technology.', price: 350000, stock_quantity: 60, image_url: 'https://picsum.photos/seed/shorts1/600/400', brand_id: '1', sizes: ['S', 'M', 'L', 'XL'], category: 'shorts' },
  { id: '102', name: 'Essential Football Shorts - Black', description: 'Classic black shorts, perfect for training or match day.', price: 320000, stock_quantity: 80, image_url: 'https://picsum.photos/seed/shorts2/600/400', brand_id: '2', sizes: ['S', 'M', 'L', 'XL'], category: 'shorts' },
  { id: '103', name: 'Team Royal Blue Shorts', description: 'Vibrant royal blue shorts to match your team colors.', price: 340000, stock_quantity: 45, image_url: 'https://picsum.photos/seed/shorts3/600/400', brand_id: '2', sizes: ['S', 'M', 'L'], category: 'shorts' },
  { id: '201', name: 'Performance Crew Socks - White', description: 'High-performance white football socks with cushioned support.', price: 150000, stock_quantity: 100, image_url: 'https://picsum.photos/seed/socks1/600/400', brand_id: '1', sizes: ['One Size'], category: 'socks' },
  { id: '202', name: 'Strike Football Socks - Black', description: 'Sleek black football socks with strategic padding.', price: 160000, stock_quantity: 90, image_url: 'https://picsum.photos/seed/socks2/600/400', brand_id: '2', sizes: ['One Size'], category: 'socks' },
  { id: '203', name: 'Team Color Socks - Red', description: 'Classic red socks to complete your kit.', price: 140000, stock_quantity: 120, image_url: 'https://picsum.photos/seed/socks3/600/400', brand_id: '1', sizes: ['One Size'], category: 'socks' },
];

/**
 * Dynamically populates the brand object into a list of products.
 * @param products - The array of products to populate.
 * @returns A new array of products with the brand object included.
 */
const populateBrands = (products: Omit<Product, 'brand'>[]): Product[] => {
    return products.map(p => ({
        ...p,
        brand: mockBrands.find(b => b.id === p.brand_id)
    }));
};


export const getAllProducts = async (filters?: { brand?: string; sortBy?: string; page?: number; limit?: number }): Promise<PaginatedResponse<Product>> => {
  // MOCK IMPLEMENTATION
  console.log('Fetching all products with filters:', filters);
  return new Promise(resolve => setTimeout(() => {
    let products = [...mockProducts];
    if (filters?.brand) {
        products = products.filter(p => p.brand_id === filters.brand);
    }
    // Add sorting/pagination if needed for mock
    const populatedProducts = populateBrands(products);
    resolve({ items: populatedProducts, total: populatedProducts.length, page: filters?.page || 1, limit: filters?.limit || 100 });
  }, 500));
};

export const getProductById = async (productId: string): Promise<Product> => {
  // MOCK IMPLEMENTATION
  console.log('Fetching product by ID:', productId);
  const product = mockProducts.find(p => p.id === productId);
  return new Promise((resolve, reject) => setTimeout(() => {
    if (product) {
        const populatedProduct: Product = {
            ...product,
            brand: mockBrands.find(b => b.id === product.brand_id)
        };
        resolve(populatedProduct);
    }
    else reject(new Error('Product not found'));
  }, 300));
};

export const getBrands = async (): Promise<Brand[]> => {
  // MOCK IMPLEMENTATION
  console.log('Fetching brands');
  return new Promise(resolve => setTimeout(() => resolve(mockBrands), 200));
};