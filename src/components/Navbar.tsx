// components/Navbar.tsx
import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <div className="w-full bg-white shadow px-20 py-6 flex justify-between items-center">
            <h1 className="text-xl font-bold text-primary">c & C Admin</h1>

            <div className="flex gap-6">
                <Link to="/" className="text-primary font-semibold">
                    Inventory
                </Link>
                <Link to="/orders" className="text-primary font-semibold">
                    Orders
                </Link>
            </div>
        </div>
    );
};

export default Navbar;