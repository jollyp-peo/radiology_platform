import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CourseUpload = () => {
  const [title, setTitle] = useState("");
  const [video, setVideo] = useState(null);
  const [pdf, setPdf] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !video) {
      setMessage("Title and video are required.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("video", video);
    if (pdf) formData.append("material", pdf);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/courses/upload/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Course uploaded!");
        setTimeout(() => navigate("/courses"), 1500);
      } else {
        setMessage(`❌ ${data.detail || "Upload failed"}`);
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Upload error");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow mt-6 rounded space-y-6">
      <h2 className="text-2xl font-bold text-center">Upload Course Material</h2>

      {message && <p className="text-center text-red-600">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Course Title *"
          className="w-full p-2 border rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <div>
          <label className="block text-sm font-medium">Video File *</label>
          <input
            type="file"
            accept="video/*"
            onChange={(e) => setVideo(e.target.files[0])}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Supplementary PDF</label>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setPdf(e.target.files[0])}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
        >
          Upload Course
        </button>
      </form>
    </div>
  );
};

export default CourseUpload;
