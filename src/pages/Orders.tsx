import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { API_BASE_URL } from "../services/api";

interface Product {
    productId: number;
    name: string;
    quantity: number;
}

interface Order {
    id: number;
    createdAt: string;
    products: Product[];
}

const Orders = () => {
    const [orders, setOrders] = useState<Order[]>([]);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem("token");

            const res = await fetch(`${API_BASE_URL}/orders`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();
            setOrders(data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 w-full">
            <Navbar />

            <div className="p-6 bg-white m-6 rounded-xl shadow">
                <h2 className="font-semibold mb-4">All Orders</h2>

                {orders.map((order) => (
                    <div key={order.id} className="border-b py-4">
                        <p className="font-semibold">
                            Order ID: {order.id}
                        </p>

                        <div className="mt-2">
                            {order.products.map((p, i) => (
                                <p key={i} className="text-sm ml-2">
                                    {p.name} - Qty: {p.quantity}
                                </p>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Orders;