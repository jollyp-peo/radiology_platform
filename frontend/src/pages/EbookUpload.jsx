
import { useState } from "react";
import { authFetch } from "../utils/authFetch";
import toast from "react-hot-toast";
import { Navigate, useNavigate } from "react-router-dom";

const EbookUpload = () => {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  
  const navigate = useNavigate();

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!title || !file) return toast.error("Title and PDF are required");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("pdf", file);

    setUploading(true);
    try {
      const res = await authFetch("http://127.0.0.1:8000/api/ebooks/upload/", {
        method: "POST",
        body: formData,
      });
      
      if (res.ok) {
        toast.success("Ebook uploaded successfully!");
        setTitle("");
        setFile(null);
        navigate("/ebooks")
      } else {
        const data = await res.json();
        toast.error(data.detail || "Upload failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Upload eBook (PDF)</h2>
      <form onSubmit={handleUpload} className="space-y-4">
        <div>
          <label className="block font-medium">Title</label>
          <input
            type="text"
            className="w-full border p-2 rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block font-medium">PDF File</label>
          <input
            type="file"
            accept="application/pdf"
            className="w-full"
            onChange={(e) => setFile(e.target.files[0])}
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </form>
    </div>
  );
};

export default EbookUpload;
