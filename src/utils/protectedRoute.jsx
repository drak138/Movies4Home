import { useContext } from "react";
import { AuthContext } from "../context/authContext";
import { Navigate, Outlet} from "react-router-dom";

export function ProtectedRoute() {
    const { user } = useContext(AuthContext);
    return user ? <Outlet /> : <Navigate to="/signup" replace />;
}

export function GuestRoute() {
    const { user } = useContext(AuthContext);
    return user ? <Navigate to="/" replace /> : <Outlet />;
}