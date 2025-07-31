import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

const categories = [
  { name: "Grocery", icon: "🛒", route: "/category/grocery" },
  { name: "Mobiles", icon: "📱", route: "/category/mobiles" },
  { name: "Fashion", icon: "👗", route: "/category/fashion" },
  { name: "Electronics", icon: "💻", route: "/category/electronics" },
  { name: "Home & Furniture", icon: "🛋️", route: "/category/home-furniture" },
  { name: "Appliances", icon: "🔌", route: "/category/appliances" },
  { name: "Flight Bookings", icon: "✈️", route: "/category/flight-bookings" },
  {
    name: "Beauty, Toys & More",
    icon: "🧸",
    route: "/category/beauty-toys-more",
  },
  { name: "Two Wheelers", icon: "🏍️", route: "/category/two-wheelers" },
];

const userMenu = [
  { label: "My Profile", icon: "👤", route: "/profile" },
  { label: "SuperCoin Zone", icon: "⚡", route: "/supercoin" },
  { label: "Flipkart Plus Zone", icon: "⭐", route: "/plus" },
  { label: "Orders", icon: "📦", route: "/orders" },
  { label: "Wishlist (4)", icon: "🤍", route: "/wishlist" },
  { label: "Coupons", icon: "🏷️", route: "/coupons" },
  { label: "Gift Cards", icon: "💳", route: "/giftcards" },
  { label: "Notifications", icon: "🔔", route: "/notifications" },
  { label: "Logout", icon: "🚪", route: "/logout" },
];

const Navbar = () => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const userMenuTimeout = useRef();
  const navigate = useNavigate();

  // Handlers to keep dropdown open when hovering over either button or menu
  const handleUserMenuEnter = () => {
    clearTimeout(userMenuTimeout.current);
    setUserMenuOpen(true);
  };
  const handleUserMenuLeave = () => {
    userMenuTimeout.current = setTimeout(() => setUserMenuOpen(false), 100);
  };

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    setUserMenuOpen(false);
    navigate("/login");
    window.location.reload(); // Force full reload to clear all state
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/search?q=${encodeURIComponent(search.trim())}`);
    }
  };

  return (
    <nav className="w-full bg-white shadow-sm font-sans">
      <div className="flex items-center px-8 pt-2 pb-0 justify-between">
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-extrabold text-blue-600">
              Flipkart
            </span>
            <span className="text-xs text-gray-500 ml-2">
              Explore <span className="text-yellow-400 font-bold">Plus</span>{" "}
              <span className="text-yellow-400 text-sm">★</span>
            </span>
          </Link>
        </div>
        <form className="flex-1 mx-8 relative" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search for Products, Brands and More"
            className="w-full px-4 py-2 rounded-md border border-gray-200 text-base bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-200 pr-12"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            type="submit"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center justify-center w-7 h-7 text-blue-600 hover:text-blue-800 text-xl p-0 m-0"
            aria-label="Search"
          >
            <span role="img" aria-label="search">
              🔍
            </span>
          </button>
        </form>
        <div className="flex items-center gap-6">
          <Link
            to="/cart"
            className="relative font-medium cursor-pointer flex items-center"
          >
            <span className="text-xl mr-1">🛒</span> Cart
            <span className="absolute -top-2 -right-4 bg-red-500 text-white rounded-full px-2 text-xs">
              1
            </span>
          </Link>
          <Link to="/seller" className="font-medium cursor-pointer">
            Become a Seller
          </Link>
          <div
            className="relative font-medium cursor-pointer select-none"
            onMouseEnter={handleUserMenuEnter}
            onMouseLeave={handleUserMenuLeave}
            tabIndex={0}
            onFocus={handleUserMenuEnter}
            onBlur={handleUserMenuLeave}
          >
            <span className="flex items-center gap-1">
              <span className="text-lg">👤</span>
              <span className="text-blue-700">Anshul</span>
              <span className="text-xs">▼</span>
            </span>
            {userMenuOpen && (
              <div
                className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 z-50 animate-fade-in"
                onMouseEnter={handleUserMenuEnter}
                onMouseLeave={handleUserMenuLeave}
              >
                <ul className="py-2">
                  {userMenu.map((item, idx) => (
                    <li key={idx}>
                      {item.route === "/logout" ? (
                        <button
                          onClick={handleLogout}
                          className="w-full text-left flex items-center gap-3 px-4 py-2 hover:bg-gray-100 text-gray-800 text-base transition-colors"
                        >
                          <span className="text-lg">{item.icon}</span>
                          <span>{item.label}</span>
                        </button>
                      ) : (
                        <Link
                          to={item.route}
                          className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 text-gray-800 text-base transition-colors"
                        >
                          <span className="text-lg">{item.icon}</span>
                          <span>{item.label}</span>
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className="text-2xl cursor-pointer">⋮</div>
        </div>
      </div>
      <div className="flex justify-around items-end py-4 border-b border-gray-100 bg-white">
        {categories.map((cat) => (
          <Link
            to={cat.route}
            className="flex flex-col items-center min-w-[80px] cursor-pointer hover:text-blue-600 transition-colors"
            key={cat.name}
          >
            <div className="text-3xl mb-1">{cat.icon}</div>
            <div className="text-sm font-medium text-gray-800 hover:text-blue-600">
              {cat.name}
            </div>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
