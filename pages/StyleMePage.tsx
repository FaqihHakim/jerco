
import React, { useState, useCallback } from 'react';
import { Product } from '../types';
import * as aiService from '../services/aiService';
import * as productService from '../services/productService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Button from '../components/common/Button';
import ProductCard from '../components/common/ProductCard';
import { UploadCloud, X, Sparkles, AlertCircle } from 'lucide-react';

// Define the response type based on what the AI service returns
interface RecommendationResult {
    jersey: { product: Product; justification: string; };
    shorts: { product: Product; justification: string; };
    socks: { product: Product; justification: string; };
}

const StyleMePage: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<RecommendationResult | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            setResult(null);
            setError(null);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(selectedFile);
        }
    };

    const clearFile = () => {
        setFile(null);
        setPreview(null);
        setResult(null);
        setError(null);
    };

    const handleStyleAnalysis = async () => {
        if (!file) {
            setError('Please upload a photo first.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            const base64Image = await aiService.fileToBase64(file);
            const { items: allProducts } = await productService.getAllProducts({ limit: 100 });
            
            const recommendation = await aiService.getStyleRecommendation(base64Image, file.type, allProducts);

            const findProduct = (id: string) => allProducts.find(p => p.id === id);
            
            const jersey = findProduct(recommendation.jersey.productId);
            const shorts = findProduct(recommendation.shorts.productId);
            const socks = findProduct(recommendation.socks.productId);

            if (!jersey || !shorts || !socks) {
                throw new Error("AI recommended products that don't exist in our catalog. Please try again.");
            }

            setResult({
                jersey: { product: jersey, justification: recommendation.jersey.justification },
                shorts: { product: shorts, justification: recommendation.shorts.justification },
                socks: { product: socks, justification: recommendation.socks.justification },
            });

        } catch (err: any) {
            console.error("Style Analysis Error:", err);
            setError(err.message || 'An unexpected error occurred while analyzing your style. Please try another photo.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="pb-16 bg-white">
            <header className="bg-gradient-to-r from-blue-50 to-purple-50 py-12">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl font-extrabold text-black flex items-center justify-center gap-3">
                        <Sparkles className="text-purple-500" />
                        AI Style Advisor
                    </h1>
                    <p className="text-gray-600 mt-2 max-w-2xl mx-auto">Upload a photo of yourself and let our AI create the perfect jersey kit for you.</p>
                </div>
            </header>

            <main className="container mx-auto px-4 pt-12">
                <div className="max-w-4xl mx-auto">
                    {!result && (
                         <div className="bg-gray-50 p-8 rounded-xl border-2 border-dashed border-gray-300 text-center">
                            {!preview ? (
                                <>
                                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gray-200 mb-4">
                                        <UploadCloud className="h-8 w-8 text-gray-500" />
                                    </div>
                                    <h2 className="text-xl font-semibold mb-2">Upload Your Photo</h2>
                                    <p className="text-gray-500 mb-4">Drag and drop or click to upload (JPG, PNG).</p>
                                    <input type="file" id="file-upload" className="hidden" accept="image/png, image/jpeg" onChange={handleFileChange} />
                                    <Button onClick={() => document.getElementById('file-upload')?.click()} variant="outline">
                                        Select File
                                    </Button>
                                </>
                            ) : (
                                <div className="relative inline-block">
                                    <img src={preview} alt="Preview" className="max-h-80 rounded-lg shadow-md mx-auto" />
                                    <button
                                        onClick={clearFile}
                                        className="absolute -top-3 -right-3 bg-white p-2 rounded-full shadow-lg text-red-500 hover:bg-red-50"
                                        aria-label="Remove photo"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                   

                    <div className="mt-6 text-center">
                         <Button
                            onClick={handleStyleAnalysis}
                            variant="primary"
                            size="lg"
                            disabled={!file || isLoading}
                            isLoading={isLoading}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 text-white !rounded-lg"
                        >
                            {isLoading ? 'Analyzing Your Style...' : 'Get My AI Recommendation'}
                        </Button>
                    </div>

                    {error && (
                        <div className="mt-8 p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-3">
                           <AlertCircle />
                           <div>
                            <h3 className="font-semibold">Analysis Failed</h3>
                            <p className="text-sm">{error}</p>
                           </div>
                        </div>
                    )}

                    {result && (
                        <div className="mt-12">
                            <h2 className="text-3xl font-bold text-center mb-10">Your AI-Curated Kit</h2>
                            <div className="space-y-10">
                                {Object.entries(result).map(([key, value]) => (
                                    <div key={key} className="flex flex-col md:flex-row items-center gap-6 p-6 bg-gray-50 rounded-xl border">
                                        <div className="w-full md:w-1/3">
                                            <ProductCard product={value.product} />
                                        </div>
                                        <div className="w-full md:w-2/3">
                                            <h3 className="text-2xl font-bold capitalize">{key}</h3>
                                            <p className="mt-2 text-gray-700 italic">"{value.justification}"</p>
                                            <p className="mt-4 text-sm text-gray-500">- AI Stylist</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-10 text-center">
                                <Button onClick={clearFile} variant="outline" size="lg">Try Another Photo</Button>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default StyleMePage;
