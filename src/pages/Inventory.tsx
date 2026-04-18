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
}

const Inventory = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchProducts = () => {
        setLoading(true);
        fetch(`${API_BASE_URL}/products`)
            .then((res) => res.json())
            .then((data) => {
                setProducts(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching products:", err);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 w-full">
            <Navbar />

            <div className="p-6 grid grid-cols-3 gap-6">

                {/* Product List */}
                <div className="col-span-2 bg-white p-6 rounded-xl shadow">
                    <h2 className="font-semibold mb-4">Inventory</h2>

                    {loading ? (
                        <p>Loading products...</p>
                    ) : products.length === 0 ? (
                        <p>No products found.</p>
                    ) : (
                        products.map((product) => (
                            <div
                                key={product.id}
                                className="flex justify-between border-b py-3"
                            >
                                <div>
                                    <p className="font-medium">{product.name}</p>
                                    {product.category && (
                                        <p className="text-sm text-gray-500">{product.category.name}</p>
                                    )}
                                </div>
                                <p>${product.price}</p>
                                <p className={product.stock === 0 ? "text-red-500" : ""}>
                                    {product.stock === 0 ? "Out of Stock" : `${product.stock} units`}
                                </p>
                            </div>
                        ))
                    )}
                </div>

                {/* Form */}
                <ProductForm onProductAdded={fetchProducts} />
            </div>
        </div>
    );
};

export default Inventory;