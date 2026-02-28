import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminLayout from "@/components/layout/AdminLayout";
import {
	BlogListPage,
	BlogCreatePage,
	BlogEditPage,
	TagsPage,
	ProjectListPage,
	ProjectCreatePage,
	ProjectEditPage,
	TechStackListPage,
	TechStackCreatePage,
	TechStackEditPage,
	TestimonialListPage,
	TestimonialCreatePage,
	TestimonialEditPage,
	LoginPage,
	// RegisterPage, // Keep this commented out if you aren't using it yet
} from "@/pages";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

function App() {
	return (
		<Router>
			<Routes>
				<Route path="/login" element={<LoginPage />} />
				{/* <Route path="/register" element={<RegisterPage />} /> */}

				<Route
					path="/"
					element={
						<ProtectedRoute>
							<AdminLayout />
						</ProtectedRoute>
					}
				>
					<Route index element={<BlogListPage />} />
					<Route path="blogs" element={<BlogListPage />} />
					<Route path="blogs/create" element={<BlogCreatePage />} />
					<Route path="blogs/:id/edit" element={<BlogEditPage />} />
					<Route path="tags" element={<TagsPage />} />
					<Route path="projects" element={<ProjectListPage />} />
					<Route path="projects/create" element={<ProjectCreatePage />} />
					<Route path="projects/:id/edit" element={<ProjectEditPage />} />
					<Route path="tech-stack" element={<TechStackListPage />} />
					<Route path="tech-stack/create" element={<TechStackCreatePage />} />
					<Route path="tech-stack/:id/edit" element={<TechStackEditPage />} />
					<Route path="testimonials" element={<TestimonialListPage />} />
					<Route path="testimonials/create" element={<TestimonialCreatePage />} />
					<Route path="testimonials/:id/edit" element={<TestimonialEditPage />} />
				</Route>
			</Routes>
		</Router>
	);
}

export default App;
