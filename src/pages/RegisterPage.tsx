import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signUp } from "@/lib/auth-client";
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

export default function RegisterPage() {
	const navigate = useNavigate();
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setError("");

		if (password !== confirmPassword) {
			setError("Passwords do not match");
			return;
		}

		if (password.length < 8) {
			setError("Password must be at least 8 characters");
			return;
		}

		setIsLoading(true);

		try {
			const result = await signUp.email({
				email,
				password,
				name,
			});

			if (result.error) {
				setError(result.error.message || "Registration failed");
			} else {
				navigate("/");
			}
		} catch (err) {
			setError("An unexpected error occurred");
			console.error("Registration error:", err);
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
					<CardTitle>Create Account</CardTitle>
					<CardDescription>Register for admin access</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit} className="space-y-4">
						{error && (
							<div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-600">
								{error}
							</div>
						)}

						<div className="space-y-2">
							<Label htmlFor="name">Full Name</Label>
							<Input
								id="name"
								type="text"
								placeholder="John Doe"
								value={name}
								onChange={(e) => setName(e.target.value)}
								required
								disabled={isLoading}
							/>
						</div>

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
								minLength={8}
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="confirmPassword">Confirm Password</Label>
							<Input
								id="confirmPassword"
								type="password"
								placeholder="••••••••"
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
								required
								disabled={isLoading}
								minLength={8}
							/>
						</div>

						<Button type="submit" className="w-full" disabled={isLoading}>
							{isLoading ? "Creating account..." : "Create Account"}
						</Button>

						<p className="text-center text-sm text-gray-600">
							Already have an account?{" "}
							<Link to="/login" className="text-purple-600 hover:underline font-medium">
								Sign in here
							</Link>
						</p>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
