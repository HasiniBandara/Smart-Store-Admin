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
                <h2 className="flex items-center justify-center text-2xl text-primary font-bold mb-4">Order Details</h2>

                <div className="bg-white rounded-xl shadow p-6">
                    <div className="grid grid-cols-4 font-semibold bg-slate-200 border-b-4 py-2">
                        <p>Order ID</p>
                        <p>Products</p>
                        <p>Quantity</p>
                        <p>Date</p>
                    </div>

                    {orders.map((order) => (
                        <div
                            key={order.id}
                            className="grid grid-cols-4 py-3 border-b-4 text-sm items-start"
                        >
                            {/* Order ID */}
                            <p className="ml-7">{order.id}</p>

                            {/* Products */}
                            <div className="flex flex-col gap-1">
                                {order.products.map((p, i) => (
                                    <p key={i}>{p.name}</p>
                                ))}
                            </div>

                            {/* Quantities */}
                            <div className="flex flex-col gap-1">
                                {order.products.map((p, i) => (
                                    <p key={i}>{p.quantity}</p>
                                ))}
                            </div>

                            {/* Date */}
                            <p>{new Date(order.createdAt).toLocaleString()}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Orders;