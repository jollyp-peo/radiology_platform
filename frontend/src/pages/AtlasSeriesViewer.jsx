import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

const AtlasSeriesViewer = () => {
	const { id } = useParams();
	const [series, setSeries] = useState(null);
	const [index, setIndex] = useState(0);

	useEffect(() => {
		fetch(`http://127.0.0.1:8000/api/atlas/${id}/`)
			.then((res) => res.json())
			.then(setSeries)
			.catch(console.error);
	}, [id]);

	const next = () =>
		setIndex((i) => Math.min(i + 1, series?.images.length - 1));
	const prev = () => setIndex((i) => Math.max(i - 1, 0));

	const handleScroll = (e) => {
		if (e.deltaY > 0) next();
		else prev();
	};

	if (!series) return <p className="p-4 text-gray-500">Loading series...</p>;

	const isScrollable = ["CT", "MRI"].includes(series.modality);
	const image = isScrollable ? series.images[index] : series.images[0];

	return (
		<div className="min-h-screen p-4 bg-gray-100">
			<Link to="/atlas" className="text-blue-600 underline text-sm">
				← Back to Atlas
			</Link>

			<h2 className="text-2xl font-bold text-center my-4">
				{series.name} ({series.modality})
			</h2>

			<div className="flex flex-col md:flex-row gap-6 justify-center">
				{/* Left */}
				<div
					onWheel={isScrollable ? handleScroll : undefined}
					className="w-full md:w-2/3 flex flex-col items-center"
				>
					<div className="w-full h-[calc(100vh-200px)] overflow-y-auto flex items-center justify-center border rounded bg-white">
						<img
							src={image.image}
							alt={`Slice ${index + 1}`}
							className="max-h-full max-w-full object-contain"
						/>
					</div>

					{/* Only for CT/MRI */}
					{isScrollable && (
						<div className="mt-3 flex gap-4">
							<button
								onClick={prev}
								disabled={index === 0}
								className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
							>
								⬅ Prev
							</button>
							<span className="text-gray-700">
								Slice {index + 1} of {series.images.length}
							</span>
							<button
								onClick={next}
								disabled={index === series.images.length - 1}
								className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
							>
								Next ➡
							</button>
						</div>
					)}
				</div>

				{/* Right */}
				{series.legend_image  && (
					<div className="w-full md:w-1/3">
						<img
							src={series.legend_image}
							alt="Legend"
							className="w-full object-contain border rounded"
						/>
						<p className="text-center text-sm text-gray-600 mt-2">Legend</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default AtlasSeriesViewer;
