// src/services/api.ts
export const API_BASE_URL = "https://smart-store-backend-production.up.railway.app";

export const getProducts = async () => {
    const res = await fetch(`${API_BASE_URL}/products`);
    if (!res.ok) throw new Error("Failed to fetch products");
    return res.json();
};

