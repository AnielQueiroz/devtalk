import type React from "react";
import { useAuthStore } from "../store/useAuthStore";
// import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ element }: { element: React.ReactNode }) => {
	const { authUser } = useAuthStore();

	if (!authUser) return element;
	
	console.log(element);
	return element;
};

export default ProtectedRoute;
