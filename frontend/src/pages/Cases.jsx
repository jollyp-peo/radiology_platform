import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Cases = () => {
	const [allCases, setAllCases] = useState([]);
	const [filteredCases, setFilteredCases] = useState([]);
	const [query, setQuery] = useState("");
	const [category, setCategory] = useState("All");

	useEffect(() => {
		fetch("http://127.0.0.1:8000/api/cases/")
			.then((res) => res.json())
			.then((data) => {
				setAllCases(data);
				setFilteredCases(data);
			});
	}, []);

	useEffect(() => {
		let result = allCases;

		if (category !== "All") {
			result = result.filter((c) => c.category === category);
		}

		if (query.trim()) {
			result = result.filter((c) =>
				c.title.toLowerCase().includes(query.toLowerCase())
			);
		}

		setFilteredCases(result);
	}, [query, category, allCases]);

	return (
		<div className="max-w-6xl mx-auto p-6 space-y-6">
			<h2 className="text-3xl font-bold text-center">Clinical Cases</h2>

			{/* Search and Filter */}
			<div className="flex flex-wrap justify-center gap-4">
				<input
					type="text"
					placeholder="Search by title..."
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					className="border px-4 py-2 rounded w-full sm:w-64"
				/>

				<select
					value={category}
					onChange={(e) => setCategory(e.target.value)}
					className="border px-4 py-2 rounded"
				>
					<option value="All">All Categories</option>
					<option value="Head">Head</option>
					<option value="Chest">Chest</option>
					<option value="Abdomen">Abdomen</option>
					<option value="Spine">Spine</option>
				</select>
			</div>

			{/* Case Grid */}
			{filteredCases.length === 0 ? (
				<p className="text-center text-gray-500">No matching cases found.</p>
			) : (
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
					{filteredCases.map((item) => (
						<div
							key={item.id}
							className="bg-white shadow-md p-4 rounded hover:shadow-lg transition"
						>
							{item.thumbnail && (
								<img
									src={item.thumbnail}
									alt={item.title}
									className="w-full h-48 object-cover rounded"
								/>
							)}
							<h3 className="mt-3 text-lg font-semibold">{item.title}</h3>
							<p className="text-sm text-gray-500">{item.category}</p>
							<p className="text-sm mt-1 line-clamp-3">{item.description}</p>

							<Link
								to={`/cases/view/${item.id}`}
								className="text-blue-600 underline"
							>
								<button className="mt-3 bg-blue-600 text-white px-4 py-2 rounded">
									View Case
								</button>
							</Link>
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default Cases;
