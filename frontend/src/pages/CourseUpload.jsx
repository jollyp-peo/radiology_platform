import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authFetch } from "../utils/authFetch";

const CourseUpload = () => {
  const [type, setType] = useState("Video");
  const [title, setTitle] = useState("");
  const [video, setVideo] = useState(null);
  const [presentation, setPresentation] = useState(null);
  const [meetLink, setMeetLink] = useState("");
  const [recordedLink, setRecordedLink] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title) {
      setMessage("Title is required.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("type", type);

    if (type === "Video") {
      if (!video) {
        setMessage("Video file is required.");
        return;
      }
      formData.append("video", video);
    } else if (type === "Lecture") {
      if (meetLink) formData.append("meet_link", meetLink);
      if (recordedLink) formData.append("recorded_link", recordedLink);
    } else if (type === "Presentation") {
      if (!presentation) {
        setMessage("Presentation file is required.");
        return;
      }
      formData.append("material", presentation);
    }

    try {
      const res = await authFetch("http://127.0.0.1:8000/api/courses/upload/", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Course uploaded!");
        setTimeout(() => navigate(`/courses?type=${type}`), 1500);
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
        {/* Course Type Selector */}
        <div>
          <label className="block mb-1 font-medium">Type *</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="Video">Video</option>
            <option value="Lecture">Lecture</option>
            <option value="Presentation">Presentation</option>
          </select>
        </div>

        {/* Title */}
        <input
          type="text"
          placeholder="Course Title *"
          className="w-full p-2 border rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        {/* Conditionally Rendered Inputs */}
        {type === "Video" && (
          <div>
            <label className="block text-sm font-medium mb-1">Video File *</label>
            <label
              htmlFor="video"
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-700"
            >
              Choose Video
            </label>
            <input
              id="video"
              type="file"
              accept="video/*"
              onChange={(e) => setVideo(e.target.files[0])}
              className="hidden"
              required
            />
            {video && (
              <p className="mt-2 text-sm text-gray-600">Selected: {video.name}</p>
            )}
          </div>
        )}

        {type === "Lecture" && (
          <>
            <input
              type="url"
              placeholder="Live Class Link (Zoom, Meet, etc)"
              className="w-full p-2 border rounded"
              value={meetLink}
              onChange={(e) => setMeetLink(e.target.value)}
            />
            <input
              type="url"
              placeholder="Recorded Video Link (optional)"
              className="w-full p-2 border rounded"
              value={recordedLink}
              onChange={(e) => setRecordedLink(e.target.value)}
            />
          </>
        )}

        {type === "Presentation" && (
          <div>
            <label className="block text-sm font-medium mb-1">Upload .ppt or .pptx *</label>
            <label
              htmlFor="presentation"
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-700"
                >
              Choose File
            </label>
            <input
              id="presentation"
              type="file"
              accept=".ppt,.pptx"
              onChange={(e) => setPresentation(e.target.files[0])}
              required
              className="hidden"
            />
            {presentation && (
              <p className="mt-2 text-sm text-gray-600">
                Selected: {presentation.name}
              </p>
            )}
        </div>
      )}

        {/* Submit */}
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
