import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const isLoggedIn = !!localStorage.getItem("token"); // or use context/auth hook

  return isLoggedIn ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
