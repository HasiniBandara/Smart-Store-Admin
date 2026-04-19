// src/services/api.ts
// export const API_BASE_URL = "https://smart-store-backend-production.up.railway.app";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:3000";


export const getProducts = async () => {
    const res = await fetch(`${API_BASE_URL}/products`);
    if (!res.ok) throw new Error("Failed to fetch products");
    return res.json();
};

