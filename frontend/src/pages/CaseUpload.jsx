import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authFetch } from "../utils/authFetch";


const CaseUpload = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("General");
  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !files.length) {
      setMessage("Fill all required fields.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    files.forEach((f) => formData.append("files", f));

    try {
      const res = await authFetch("http://127.0.0.1:8000/api/cases/upload/", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Case uploaded!");
        setTimeout(() => navigate("/cases"), 1500);
      } else {
        setMessage(`❌ ${data.detail || "Upload failed"}`);
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Network error");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow mt-6 rounded space-y-6">
      <h2 className="text-2xl font-bold text-center">Upload Clinical Case</h2>

      {message && <p className="text-center text-red-600">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Case Title *"
          className="w-full p-2 border rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          rows={4}
          placeholder="Case Description"
          className="w-full p-2 border rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <select
          className="w-full p-2 border rounded"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="General">General</option>
          <option value="Head">Head</option>
          <option value="Chest">Chest</option>
          <option value="Abdomen">Abdomen</option>
          <option value="Spine">Spine</option>
        </select>

        <input
          type="file"
          multiple
          webkitdirectory=""
          directory=""
          onChange={(e) => setFiles([...e.target.files])}
        />

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Upload Case
        </button>
      </form>
    </div>
  );
};

export default CaseUpload;
