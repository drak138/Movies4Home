import { useContext} from "react";
import { AuthContext } from "../context/authContext";
import { Navigate, Outlet} from "react-router-dom";

export function ProtectedRoute() {
    const { user } = useContext(AuthContext);
    if(user!==null){
    return user ? <Outlet /> : <Navigate to="/signup"/>;
    }
}

export function GuestRoute() {
    const { user } = useContext(AuthContext);
    if(user!==null){
    return user ? <Navigate to="/"/> : <Outlet />;
    }
}