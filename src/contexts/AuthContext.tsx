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

	// TODO: REMOVE BYPASS WHEN BACKEND AUTH IS READY
	const isBypassed = localStorage.getItem("admin_token") === "dev_token";

	const user = isBypassed 
		? { id: "dev-id", name: "Dev Admin", email: "admin@iit.dev", emailVerified: true } 
		: (data?.user ?? null);
	
	const isLoading = isBypassed ? false : isPending;

	return (
		<AuthContext.Provider
			value={{ user, isLoading }}
		>
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
