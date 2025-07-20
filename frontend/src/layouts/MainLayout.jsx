import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import logo from "../assets/evercare-logo-removebg.png";

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
			<Link to="/" className="hover:text-blue-200 block md:inline">
				Home
			</Link>
			<Link to="/atlas" className="hover:text-blue-200 block md:inline">
				Atlas
			</Link>
			<Link to="/cases" className="hover:text-blue-200 block md:inline">
				Cases
			</Link>
			<Link to="/courses" className="hover:text-blue-200 block md:inline">
				Courses
			</Link>
			<Link to="/ebooks" className="hover:text-blue-200 block md:inline">
				eBooks
			</Link>
			<Link to="/quiz" className="hover:text-blue-200 block md:inline">
				Quiz
			</Link>

			{user ? (
				<button
					onClick={handleLogout}
					className="hover:text-red-200 block md:inline"
				>
					Logout
				</button>
			) : (
				<>
					<Link to="/login" className="hover:text-blue-200 block md:inline">
						Login
					</Link>
					<Link to="/register" className="hover:text-blue-200 block md:inline">
						Register
					</Link>
				</>
			)}
		</>
	);

	return (
		<div className="min-h-screen bg-gray-100 text-gray-800">
			<nav className="bg-purple-950 text-white px-4 py-3 shadow-md">
				<div className="max-w-7xl mx-auto flex justify-between items-center">
					{/* Logo with image and text */}
					<Link to="/" className="flex items-center gap-2">
						<div className="relative h-12 w-50 overflow-hidden">
							<img
								src={logo}
								alt="Logo"
								className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-30 object-contain"
							/>
						</div>
					</Link>

					{/* Hamburger menu */}
					<button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden">
						<svg
							className="w-6 h-6"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d={
									menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"
								}
							/>
						</svg>
					</button>

					{/* Desktop links */}
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

				{/* Mobile links (column layout) */}
				{menuOpen && (
					<div className="md:hidden mt-3 flex flex-col gap-2 px-4 text-sm">
						{renderNavLinks()}
						{user?.role === "admin" && (
							<button
								onClick={() => {
									navigate("/admin/dashboard");
									setMenuOpen(false);
								}}
								className="text-yellow-300 hover:text-yellow-200 text-left"
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
