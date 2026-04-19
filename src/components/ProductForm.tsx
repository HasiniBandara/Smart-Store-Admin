import { useState, useEffect } from "react";
import { API_BASE_URL } from "../services/api";

interface Category {
    id: number;
    name: string;
}

interface ProductFormProps {
    onProductAdded: () => void;
}

const ProductForm = ({ onProductAdded }: ProductFormProps) => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [stock, setStock] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetch(`${API_BASE_URL}/categories`)
            .then((res) => res.json())
            .then((data) => setCategories(data))
            .catch((err) => console.error("Error fetching categories:", err));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        const newProduct = {
            name,
            price: parseFloat(price),
            stock: parseInt(stock),
            categoryId: parseInt(categoryId),
        };

        try {
            const response = await fetch(`${API_BASE_URL}/products`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newProduct),
            });

            if (response.ok) {
                setMessage("Product added successfully!");
                setName("");
                setPrice("");
                setStock("");
                setCategoryId("");
                onProductAdded(); // Refresh the list
            } else {
                const errorData = await response.json().catch(() => ({}));
                setMessage(errorData.message || "Failed to add product.");
            }
        } catch (error) {
            console.error("Error adding product:", error);
            setMessage("An error occurred.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow w-full max-w-md h-fit">
            <h2 className="font-semibold mb-4 flex items-center justify-center text-lg text-primary">Add Product</h2>

            {message && (
                <p className={`mb-4 text-sm ${message.includes("success") ? "text-green-500" : "text-red-500"}`}>
                    {message}
                </p>
            )}

            <input
                type="text"
                placeholder="Product Name"
                className="w-full border p-2 mb-3 rounded"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
            />

            {/* Image input - placeholder for now */}
            <input type="file"
                className="w-full border p-2 mb-3 rounded"
                disabled
            />
            <p className="text-xs text-gray-400 mb-3 -mt-2 italic">Image upload coming soon</p>

            <select
                className="w-full border p-2 mb-3 rounded"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                required
            >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                        {cat.name}
                    </option>
                ))}
            </select>

            <input
                type="number"
                placeholder="Price"
                className="w-full border p-2 mb-3 rounded"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
            />

            <input
                type="number"
                placeholder="Stock"
                className="w-full border p-2 mb-3 rounded"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                required
            />

            <button
                type="submit"
                className="w-full bg-primary text-white py-2 rounded-lg disabled:bg-gray-400"
                disabled={loading}
            >
                {loading ? "Adding..." : "Add Product"}
            </button>
        </form>
    );
};

export default ProductForm;