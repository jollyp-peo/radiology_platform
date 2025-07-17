import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authFetch } from "../utils/authFetch";

const AtlasUpload = () => {
	const [name, setName] = useState("");
	const [modality, setModality] = useState("CT");
	const [description, setDescription] = useState("");
	const [files, setFiles] = useState([]);
	const [legend, setLegend] = useState(null);
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState("");

	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!name || !modality || files.length === 0) {
			setMessage("Please fill all required fields.");
			return;
		}

		const formData = new FormData();
		formData.append("name", name);
		formData.append("modality", modality);
		formData.append("description", description);
		if (legend) formData.append("legend_image", legend);
		for (let file of files) {
			formData.append("files", file);
		}

		setLoading(true);
		try {
			const res = await authFetch("http://localhost:8000/api/atlas/upload/", {
				method: "POST",			
				body: formData,
			});

			const data = await res.json();
			if (res.ok) {
				setMessage(`✅ Upload successful! Series ID: ${data.series_id}`);
				setTimeout(() => navigate("/atlas"), 1500);
			} else {
				setMessage(`❌ ${data.detail || "Upload failed"}`);
			}
		} catch (err) {
			console.error(err);
			setMessage("Upload failed. Check console.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="max-w-3xl mx-auto p-6 bg-white shadow rounded mt-6 space-y-6">
			<h2 className="text-2xl font-bold text-center">
				Upload Atlas Series (Admin)
			</h2>

			{message && <p className="text-center text-red-600">{message}</p>}

			<form onSubmit={handleSubmit} className="space-y-4">
				<div>
					<label className="block text-sm font-medium">Series Name *</label>
					<input
						type="text"
						className="w-full border p-2 rounded"
						value={name}
						onChange={(e) => setName(e.target.value)}
						required
					/>
				</div>

				<div>
					<label className="block text-sm font-medium">Modality *</label>
					<select
						className="w-full border p-2 rounded"
						value={modality}
						onChange={(e) => setModality(e.target.value)}
					>
						<option value="CT">CT</option>
						<option value="MRI">MRI</option>
						<option value="X-ray">X-ray</option>
					</select>
				</div>

				<div>
					<label className="block text-sm font-medium">Description</label>
					<textarea
						className="w-full border p-2 rounded"
						rows="3"
						value={description}
						onChange={(e) => setDescription(e.target.value)}
					/>
				</div>

				<div>
					<label className="block text-sm font-medium">Legend Image</label>
					<input
						type="file"
						accept="image/*"
						onChange={(e) => setLegend(e.target.files[0])}
					/>
				</div>

				<div>
					<label className="block text-sm font-medium">
						DICOM / PNG / JPG Files *
					</label>
					<input
						type="file"
						multiple
						webkitdirectory=""
						directory=""
						onChange={(e) => setFiles(Array.from(e.target.files))}
					/>
				</div>

				<button
					type="submit"
					disabled={loading}
					className="bg-blue-600 text-white px-6 py-2 rounded w-full disabled:opacity-50"
				>
					{loading ? "Uploading..." : "Upload Series"}
				</button>
			</form>
		</div>
	);
};

export default AtlasUpload;
