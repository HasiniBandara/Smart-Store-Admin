import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    return (
        <div className="w-full bg-white shadow px-20 py-6 flex justify-between items-center">
            <h1 className="text-xl font-bold text-primary font-logo text-3xl">c & C Admin</h1>

            <div className="flex items-center gap-8">
                <div className="flex gap-6">
                    <Link to="/" className="text-primary font-semibold hover:text-[#8e1034] transition-colors">
                        Inventory
                    </Link>
                    <Link to="/orders" className="text-primary font-semibold hover:text-[#8e1034] transition-colors">
                        Orders
                    </Link>
                </div>

                <button
                    onClick={handleLogout}
                    className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#8e1034] transition-all active:scale-95"
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Navbar;