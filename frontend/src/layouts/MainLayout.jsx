import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

const MainLayout = ({ children }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const renderNavLinks = () => (
    <>
      <Link to="/" className="hover:text-blue-200">Home</Link>
      <Link to="/atlas" className="hover:text-blue-200">Atlas</Link>
      <Link to="/cases" className="hover:text-blue-200">Cases</Link>
      <Link to="/courses" className="hover:text-blue-200">Courses</Link>
      <Link to="/ebooks" className="hover:text-blue-200">eBooks</Link>
      <Link to="/quiz" className="hover:text-blue-200">Quiz</Link>

      {user ? (
        <>
          <button onClick={handleLogout} className="hover:text-red-200">Logout</button>
        </>
      ) : (
        <>
          <Link to="/login" className="hover:text-blue-200">Login</Link>
          <Link to="/register" className="hover:text-blue-200">Register</Link>
        </>
      )}
    </>
  );

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      <nav className="bg-blue-700 text-white px-4 py-3 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold">RadAtlas</Link>

          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d={
                  menuOpen
                    ? "M6 18L18 6M6 6l12 12"
                    : "M4 6h16M4 12h16M4 18h16"
                }
              />
            </svg>
          </button>

          <div className="hidden md:flex items-center gap-6 text-sm">
            {renderNavLinks()}
            {user?.role === "admin" && (
              <button
                onClick={() => navigate("/admin")}
                className="ml-4 text-yellow-300 hover:text-yellow-200"
              >
                Admin Panel
              </button>
            )}
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden mt-2 space-y-2 px-4 text-sm">
            {renderNavLinks()}
            {user?.role === "admin" && (
              <button
                onClick={() => {
                  navigate("/admin/dashboard");
                  setMenuOpen(false);
                }}
                className="block text-yellow-300 hover:text-yellow-200"
              >
                Admin Panel
              </button>
            )}
          </div>
        )}
      </nav>

      <main className="p-4 max-w-7xl mx-auto">{children}</main>
    </div>
  );
};

export default MainLayout;
