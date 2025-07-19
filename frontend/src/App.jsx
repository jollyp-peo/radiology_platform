import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Atlas from "./pages/Atlas";
import Cases from "./pages/Cases";
import Courses from "./pages/Courses";
import Ebooks from "./pages/Ebooks";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MainLayout from "./layouts/MainLayout";
import AtlasSeriesViewer from "./pages/AtlasSeriesViewer";
import AtlasUpload from "./pages/AtlasUpload";
import AdminDashboard from "./pages/AdminDashboard";
import CaseUpload from "./pages/CaseUpload";
import CourseUpload from "./pages/CourseUpload";
import CaseViewer from "./pages/CaseViewer";
import EbookUpload from "./pages/EbookUpload";

import Quiz from "./pages/Quiz";

function App() {
	return (
		<MainLayout>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/login" element={<Login />} />
				<Route path="/register" element={<Register />} />

				{/* Protected Routes */}
				<Route
					path="/atlas"
					element={
						<ProtectedRoute>
							<Atlas />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/cases"
					element={
						<ProtectedRoute>
							<Cases />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/courses"
					element={
						<ProtectedRoute>
							<Courses />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/ebooks"
					element={
						<ProtectedRoute>
							<Ebooks />
						</ProtectedRoute>
					}
				/>

				<Route
					path="/atlas/series/:id"
					element={
						<ProtectedRoute>
							<AtlasSeriesViewer />
						</ProtectedRoute>
					}
				/>

				<Route
					path="/atlas/upload"
					element={
						<ProtectedRoute>
							<AtlasUpload />
						</ProtectedRoute>
					}
				/>

				<Route
					path="/admin"
					element={
						<ProtectedRoute>
							<AdminDashboard />
						</ProtectedRoute>
					}
				/>

				<Route
					path="/cases/upload"
					element={
						<ProtectedRoute>
							<CaseUpload />
						</ProtectedRoute>
					}
				/>

				<Route
					path="/cases/view/:id"
					element={
						<ProtectedRoute>
							<CaseViewer />
						</ProtectedRoute>
					}
				/>

				<Route
					path="/courses/upload"
					element={
						<ProtectedRoute>
							<CourseUpload />
						</ProtectedRoute>
					}
				/>

				<Route
					path="/ebooks/upload"
					element={
						<ProtectedRoute>
							<EbookUpload />
						</ProtectedRoute>
					}
				/>

				<Route
					path="/quiz"
					element={
						<ProtectedRoute>
							<Quiz />
						</ProtectedRoute>
					}
				/>
			</Routes>
		</MainLayout>
	);
}

export default App;
