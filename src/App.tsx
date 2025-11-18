import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminLayout from "@/components/layout/AdminLayout";
import { BlogListPage, BlogCreatePage, BlogEditPage, TagsPage } from "@/pages";

function App() {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<AdminLayout />}>
					<Route index element={<BlogListPage />} />
					<Route path="blogs" element={<BlogListPage />} />
					<Route path="blogs/create" element={<BlogCreatePage />} />
					<Route path="blogs/:id/edit" element={<BlogEditPage />} />
					<Route path="tags" element={<TagsPage />} />
				</Route>
			</Routes>
		</Router>
	);
}

export default App;
