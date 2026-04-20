import { useEffect, useState } from "react";
import { API_BASE_URL } from "../services/api";
import Navbar from "../components/Navbar";
import ProductForm from "../components/ProductForm";

interface Product {
    id: number;
    name: string;
    price: number;
    stock: number;
    category?: {
        name: string;
    };
    image?: string;
}

const Inventory = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [editedProducts, setEditedProducts] = useState<Record<number, Product>>({});
    const [message, setMessage] = useState({ text: "", type: "" });

    const fetchProducts = async () => {
        try {
            setLoading(true);

            const res = await fetch(`${API_BASE_URL}/products`);

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            const data = await res.json();

            // ✅ safety check (prevents .map crash)
            setProducts(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Error fetching products:", err);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleChange = (id: number, field: keyof Product, value: any) => {
        const original = products.find(p => p.id === id)!;
        setEditedProducts((prev) => ({
            ...prev,
            [id]: {
                ...original,       // ← start with full product
                ...prev[id],       // ← keep any previously edited fields
                [field]: value,    // ← apply new change
            },
        }));
    };

    const handleUpdate = async (id: number) => {
        const updated = editedProducts[id];

        console.log("Sending update:", updated);

        if (!updated) return;

        const token = localStorage.getItem("token");

        try {
            const res = await fetch(`${API_BASE_URL}/products/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(updated),
            });


            console.log("Response status:", res.status); // ← add this
            const responseData = await res.json();
            console.log("Response data:", responseData);


            if (!res.ok) throw new Error("Update failed");

            setMessage({ text: "Product updated successfully!", type: "success" });
            fetchProducts();

            setEditedProducts((prev) => {
                const copy = { ...prev };
                delete copy[id];
                return copy;
            });
        } catch (err) {
            console.error("Update failed", err);
            setMessage({ text: "Failed to update product.", type: "error" });
        }
    };

    const handleReset = (id: number) => {
        setEditedProducts((prev) => {
            const copy = { ...prev };
            delete copy[id];
            return copy;
        });
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;

        const token = localStorage.getItem("token");

        try {
            const res = await fetch(`${API_BASE_URL}/products/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) throw new Error("Delete failed");

            setMessage({ text: "Product deleted successfully!", type: "success" });
            fetchProducts();
        } catch (err) {
            console.error("Delete failed", err);
            setMessage({ text: "Failed to delete product.", type: "error" });
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 w-full">
            <Navbar />

            <div className="p-6 grid grid-cols-3 gap-6">

                {/* Product List */}
                <div className="col-span-2 bg-white p-6 rounded-xl shadow">
                    <h2 className="flex items-center justify-center text-2xl text-primary font-bold mb-4">Inventory</h2>

                    {message.text && (
                        <div className={`p-3 rounded-lg text-sm mb-4 text-center ${message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                            {message.text}
                        </div>
                    )}

                    {loading ? (
                        <p>Loading products...</p>
                    ) : products.length === 0 ? (
                        <p>No products found.</p>
                    ) : (
                        products.map((product) => {
                            const edited = editedProducts[product.id] || product;

                            return (
                                <div
                                    key={product.id}
                                    className="flex items-center justify-between border-b py-5 gap-5"
                                >
                                    {/* Image Preview */}
                                    <div className="w-16 h-16 flex-shrink-0 bg-gray-200 rounded overflow-hidden">
                                        {edited.image ? (                                            // <img 
                                            //     src={`${API_BASE_URL}${product.image}`} 
                                            //     alt={product.name} 
                                            //     className="w-full h-full object-cover"
                                            //     onError={(e) => (e.currentTarget.style.display = 'none')}
                                            // />

                                            <img
                                                src={edited.image}
                                                alt={product.name}
                                                className="w-full h-full object-cover"
                                                onError={(e) => (e.currentTarget.style.display = 'none')}


                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400">No img</div>


                                        )}
                                    </div>

                                    <div className="flex flex-col gap-2 flex-1">

                                        {/* Image URL */}
                                        <input
                                            className="border-2 p-1 rounded w-full text-sm bg-slate-50"
                                            placeholder="Image URL"
                                            value={edited.image || ""}
                                            onChange={(e) =>
                                                handleChange(product.id, "image", e.target.value)
                                            }
                                        />

                                        <div className="flex items-center gap-2">
                                            {/* Name */}
                                            <input
                                                className="border-2 p-1 rounded w-auto font-semibold"
                                                value={edited.name}
                                                onChange={(e) =>
                                                    handleChange(product.id, "name", e.target.value)
                                                }
                                            />

                                            {/* Price */}
                                            <input
                                                type="number"
                                                className="border-2 p-1 rounded w-2/3"
                                                value={edited.price}
                                                onChange={(e) =>
                                                    handleChange(product.id, "price", Number(e.target.value))
                                                }
                                            />

                                            {/* Stock */}
                                            <input
                                                type="number"
                                                className="border-2 p-1 rounded w-1/3"
                                                value={edited.stock}
                                                onChange={(e) =>
                                                    handleChange(product.id, "stock", Number(e.target.value))
                                                }
                                            />
                                        </div>
                                    </div>

                                    {/* Buttons */}
                                    <div className="flex text-sm gap-2">
                                        <button
                                            onClick={() => handleUpdate(product.id)}
                                            className="bg-green-500 text-white px-3 py-1 rounded"
                                        >
                                            Update
                                        </button>

                                        <button
                                            onClick={() => handleReset(product.id)}
                                            className="bg-gray-400 text-white px-3 py-1 rounded"
                                        >
                                            Reset
                                        </button>

                                        <button
                                            onClick={() => handleDelete(product.id)}
                                            className="bg-red-500 text-white px-3 py-1 rounded"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Form */}
                <ProductForm onProductAdded={fetchProducts} />
            </div>
        </div >
    );
};

export default Inventory;