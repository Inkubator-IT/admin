import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signIn } from "@/lib/auth-client";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Label from "@/components/ui/Label";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/Card";
import iitLogo from "@/assets/logo-iit.png";

export default function LoginPage() {
	const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setError("");
		setIsLoading(true);

		try {
			const result = await signIn.email({
				email,
				password,
			});

			if (result.error) {
				setError(result.error.message || "Login failed");
			} else {
				navigate("/");
			}
		} catch (err) {
			setError("An unexpected error occurred");
			console.error("Login error:", err);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen grid place-items-center bg-gradient-to-br from-purple-900 via-purple-800 to-orange-500 p-4">
			<Card className="w-full max-w-md">
				<CardHeader className="space-y-4 text-center">
					<img
						src={iitLogo}
						alt="Inkubator IT"
						className="mx-auto h-16 w-auto"
					/>
					<CardTitle>Welcome Back</CardTitle>
					<CardDescription>Sign in to your admin account</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit} className="space-y-4">
						{error && (
							<div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-600">
								{error}
							</div>
						)}

						<div className="space-y-2">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								placeholder="admin@example.com"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
								disabled={isLoading}
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="password">Password</Label>
							<Input
								id="password"
								type="password"
								placeholder="••••••••"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
								disabled={isLoading}
							/>
						</div>

						<Button type="submit" className="w-full" disabled={isLoading}>
							{isLoading ? "Signing in..." : "Sign In"}
						</Button>

						<p className="text-center text-sm text-gray-600">
							Don't have an account?{" "}
							<Link to="/register" className="text-purple-600 hover:underline font-medium">
								Register here
							</Link>
						</p>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
