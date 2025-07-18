import { useState, useMemo } from "react";
import { FaTrash } from "react-icons/fa";
import toast from "react-hot-toast";
import { authFetch } from "../utils/authFetch";

const CoursesTable = ({ courses, setCourses }) => {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [toDelete, setToDelete] = useState(null);
  const perPage = 50;

  const filtered = useMemo(() => {
    return courses.filter(
      (c) =>
        c.title.toLowerCase().includes(search.toLowerCase()) &&
        (typeFilter === "All" || c.type === typeFilter)
    );
  }, [search, typeFilter, courses]);

  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);
  const totalPages = Math.ceil(filtered.length / perPage);

  const confirmDelete = async () => {
    if (!toDelete) return;

    try {
      const res = await authFetch(`http://127.0.0.1:8000/api/courses/${toDelete.id}/delete/`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Course deleted");
        setCourses((prev) => prev.filter((c) => c.id !== toDelete.id));
        setToDelete(null);
      } else {
        toast.error("Failed to delete");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error deleting course");
    }
  };

  return (
    <div>
      {/* Filter/Search */}
      <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
        <p className="text-sm">Total Courses: {filtered.length}</p>
        <input
          type="text"
          placeholder="Search by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-1 rounded"
        />
        <select
          className="border p-1 rounded"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="All">All Types</option>
          <option value="Video">Video</option>
          <option value="Lecture">Lecture</option>
          <option value="Presentation">Presentation</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border rounded">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-gray-200 text-gray-800 border-b">
            <tr>
              <th className="p-2 border">#</th>
              <th className="p-2 border">Title</th>
              <th className="p-2 border">Type</th>
              <th className="p-2 border">Link</th>
              <th className="p-2 border text-center">Delete</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((c, i) => (
              <tr key={c.id} className="border-b hover:bg-gray-50">
                <td className="p-2 border">{(currentPage - 1) * perPage + i + 1}</td>
                <td className="p-2 border">{c.title}</td>
                <td className="p-2 border">{c.type}</td>
                <td className="p-2 border space-y-1">
                  {c.type === "Video" && c.video && (
                    <a
                      href={c.video}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline block"
                    >
                      Watch Video
                    </a>
                  )}
                  {c.type === "Presentation" && c.material && (
                    <a
                      href={c.material}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 underline block"
                    >
                      View Slides
                    </a>
                  )}
                  {c.type === "Lecture" && c.meet_link && (
                    <a
                      href={c.meet_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-600 underline block"
                    >
                      Join Live
                    </a>
                  )}
                  {c.type === "Lecture" && c.recorded_link && (
                    <a
                      href={c.recorded_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-600 underline block"
                    >
                      Watch Recorded
                    </a>
                  )}
                </td>
                <td className="p-2 border text-center text-red-600">
                  <button onClick={() => setToDelete(c)}>
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-4 gap-2 text-sm">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-gray-200 rounded"
        >
          Prev
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 rounded ${
              currentPage === i + 1 ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-gray-200 rounded"
        >
          Next
        </button>
      </div>

      {/* Confirmation Modal */}
      {toDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-xl">
            <h2 className="text-lg font-semibold mb-4">Confirm Deletion</h2>
            <p className="mb-4">
              Are you sure you want to delete <strong>{toDelete.title}</strong>?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setToDelete(null)}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoursesTable;
