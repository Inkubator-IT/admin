import { createContext, useContext, type ReactNode } from "react";
import { useSession } from "@/lib/auth-client";

interface User {
	id: string;
	name: string;
	email: string;
	emailVerified: boolean;
}

interface AuthContextType {
	user: User | null;
	isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
	const { data, isPending } = useSession();

	return (
		<AuthContext.Provider value={{ user: data?.user ?? null, isLoading: isPending }}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}
