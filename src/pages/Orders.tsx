// pages/Orders.tsx
import Navbar from "../components/Navbar";

const Orders = () => {
    const orders = [
        { id: 1, customer: "John", total: 50, status: "Pending" },
        { id: 2, customer: "Anna", total: 80, status: "Completed" },
    ];

    return (
        <div className="min-h-screen bg-gray-100 w-full">
            <Navbar />

            <div className="p-6 bg-white m-6 rounded-xl shadow">
                <h2 className="font-semibold mb-4">Orders</h2>

                {orders.map((o) => (
                    <div
                        key={o.id}
                        className="flex justify-between border-b py-3"
                    >
                        <p>{o.customer}</p>
                        <p>${o.total}</p>
                        <p>{o.status}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Orders;