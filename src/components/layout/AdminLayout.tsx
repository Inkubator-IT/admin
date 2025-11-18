import { Outlet, NavLink } from "react-router-dom";
import { FileText, Tag, Settings } from "lucide-react";

const AdminLayout = () => {
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
			</aside>

			<main className="flex-1 overflow-auto">
				<Outlet />
			</main>
		</div>
	);
};

export default AdminLayout;
