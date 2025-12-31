import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
	children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
	const { user, isLoading } = useAuth();

	if (isLoading) {
		return (
			<div className="min-h-screen grid place-items-center">
				<div className="text-center">
					<div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-purple-600 border-r-transparent" />
					<p className="mt-2 text-sm text-gray-600">Loading...</p>
				</div>
			</div>
		);
	}

	if (!user) {
		return <Navigate to="/login" replace />;
	}

	return <>{children}</>;
}
