import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { FileText, Tag, Settings, LogOut, User, Briefcase, Layers } from "lucide-react";
import { signOut } from "@/lib/auth-client";
import { useAuth } from "@/contexts/AuthContext";

const AdminLayout = () => {
	const navigate = useNavigate();
	const { user } = useAuth();

	const handleLogout = async () => {
		await signOut();
		navigate("/login");
	};

	const userName = user?.name || user?.email || "Admin";
	const userEmail = user?.email || "";

	return (
		<div className="h-screen bg-gray-50 flex">
			<aside className="w-64 bg-white shadow-sm border-r h-screen flex flex-col">
				<div className="p-6">
					<div className="w-full">
						<img
							src="/iit-logo.png"
							alt="Inkubator IT"
							className="w-full h-auto object-contain"
						/>
					</div>
				</div>

				<nav className="px-4 pb-4 flex-1">
					<ul className="space-y-2">
						<li>
							<NavLink
								to="/blogs"
								className={({ isActive }) =>
									`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
										isActive
											? "bg-purple-100 text-purple-700"
											: "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
									}`
								}
							>
								<FileText className="w-4 h-4" />
								Blogs
							</NavLink>
						</li>
						<li>
							<NavLink
								to="/projects"
								className={({ isActive }) =>
									`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
										isActive
											? "bg-purple-100 text-purple-700"
											: "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
									}`
								}
							>
								<Briefcase className="w-4 h-4" />
								Projects
							</NavLink>
						</li>
						<li>
							<NavLink
								to="/tech-stack"
								className={({ isActive }) =>
									`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
										isActive
											? "bg-purple-100 text-purple-700"
											: "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
									}`
								}
							>
								<Layers className="w-4 h-4" />
								Tech Stack
							</NavLink>
						</li>
						<li>
							<NavLink
								to="/tags"
								className={({ isActive }) =>
									`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
										isActive
											? "bg-purple-100 text-purple-700"
											: "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
									}`
								}
							>
								<Tag className="w-4 h-4" />
								Tags
							</NavLink>
						</li>
						<li>
							<NavLink
								to="/settings"
								className={({ isActive }) =>
									`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
										isActive
											? "bg-purple-100 text-purple-700"
											: "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
									}`
								}
							>
								<Settings className="w-4 h-4" />
								Settings
							</NavLink>
						</li>
					</ul>
				</nav>

				<div className="px-4 pb-4 border-t pt-4">
					<div className="flex items-center gap-3 px-3 py-2 mb-2">
						<User className="w-4 h-4 text-gray-600" />
						<div className="flex-1 min-w-0">
							<p className="text-sm font-medium text-gray-900 truncate">
								{userName}
							</p>
							<p className="text-xs text-gray-500 truncate">{userEmail}</p>
						</div>
					</div>
					<button
						type="button"
						onClick={handleLogout}
						className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 w-full transition-colors"
					>
						<LogOut className="w-4 h-4" />
						Logout
					</button>
				</div>
			</aside>

			<main className="flex-1 overflow-auto">
				<Outlet />
			</main>
		</div>
	);
};

export default AdminLayout;
