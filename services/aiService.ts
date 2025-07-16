
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { Product } from '../types';

// Helper function to convert file to base64
export const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            // result is "data:mime/type;base64,the_base64_string"
            // We only need the base64 part
            const result = reader.result as string;
            resolve(result.split(',')[1]);
        };
        reader.onerror = error => reject(error);
    });
};

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        jersey: {
            type: Type.OBJECT,
            properties: {
                productId: { type: Type.STRING, description: "The ID of the recommended jersey." },
                justification: { type: Type.STRING, description: "Why this jersey was recommended." }
            },
            required: ["productId", "justification"]
        },
        shorts: {
            type: Type.OBJECT,
            properties: {
                productId: { type: Type.STRING, description: "The ID of the recommended shorts." },
                justification: { type: Type.STRING, description: "Why these shorts were recommended." }
            },
            required: ["productId", "justification"]
        },
        socks: {
            type: Type.OBJECT,
            properties: {
                productId: { type: Type.STRING, description: "The ID of the recommended socks." },
                justification: { type: Type.STRING, description: "Why these socks were recommended." }
            },
            required: ["productId", "justification"]
        }
    },
    required: ["jersey", "shorts", "socks"]
};

export interface StyleRecommendation {
    jersey: { productId: string; justification: string; };
    shorts: { productId: string; justification: string; };
    socks: { productId: string; justification: string; };
}


export const getStyleRecommendation = async (
    base64Image: string,
    mimeType: string,
    allProducts: Product[]
): Promise<StyleRecommendation> => {

    const productCatalog = JSON.stringify(
        allProducts.map(p => ({ 
            id: p.id, 
            name: p.name, 
            description: p.description, 
            category: p.category 
        }))
    );
    
    const imagePart = {
        inlineData: {
            data: base64Image,
            mimeType,
        },
    };

    const textPart = {
        text: `Analyze the person in this image. Based on their appearance (like skin tone, hair color, and general style), recommend a complete football kit (one jersey, one pair of shorts, and one pair of socks) from the provided list of available products. Provide a brief justification for each choice. You must only recommend products from this list where the category matches 'jersey', 'shorts', or 'socks'.

Product Catalog:
${productCatalog}

Return your response ONLY as a JSON object that strictly adheres to the provided schema.`,
    };

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [imagePart, textPart] },
        config: {
            responseMimeType: "application/json",
            responseSchema: responseSchema,
        },
    });
    
    const jsonText = response.text.trim();
    // It should already be JSON because of the responseMimeType and schema
    return JSON.parse(jsonText) as StyleRecommendation;
};
