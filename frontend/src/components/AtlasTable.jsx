import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import { authFetch } from "../utils/authFetch";
import toast from "react-hot-toast";

const AtlasTable = ({ series, setSeries }) => {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortAsc, setSortAsc] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [toDelete, setToDelete] = useState(null);

  const perPage = 50;

  const filtered = useMemo(() => {
    return series
      .filter((item) =>
        (item.name || "").toLowerCase().includes(search.toLowerCase())
      )
      .sort((a, b) => {
        const aVal = (a[sortBy] || "").toString().toLowerCase();
        const bVal = (b[sortBy] || "").toString().toLowerCase();
        if (aVal < bVal) return sortAsc ? -1 : 1;
        if (aVal > bVal) return sortAsc ? 1 : -1;
        return 0;
      });
  }, [search, sortBy, sortAsc, series]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortBy(field);
      setSortAsc(true);
    }
  };

  const handleDelete = async () => {
    if (!toDelete) return;

    try {
      const res = await authFetch(`http://127.0.0.1:8000/api/atlas/${toDelete.id}/delete/`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success(`Deleted "${toDelete.name}"`);
        setSeries((prev) => prev.filter((s) => s.id !== toDelete.id));
        setToDelete(null);
      } else {
        const data = await res.json();
        toast.error(data.detail || "Failed to delete");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error while deleting");
    }
  };

  return (
    <div>
      {/* Top controls */}
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm">Total Series: {filtered.length}</p>
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-1 rounded"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto border rounded">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-gray-200 text-gray-800 font-medium border-b">
            <tr>
              <th className="p-2 border cursor-pointer" onClick={() => handleSort("id")}>#</th>
              <th className="p-2 border cursor-pointer" onClick={() => handleSort("name")}>Name</th>
              <th className="p-2 border cursor-pointer" onClick={() => handleSort("modality")}>Modality</th>
              <th className="p-2 border">Slices</th>
              <th className="p-2 border">View</th>
              <th className="p-2 border">Delete</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((item, index) => (
              <tr key={item.id} className="hover:bg-gray-50 border-b">
                <td className="p-2 border">{(currentPage - 1) * perPage + index + 1}</td>
                <td className="p-2 border">{item.name}</td>
                <td className="p-2 border">{item.modality}</td>
                <td className="p-2 border">{item.images?.length || 0}</td>
                <td className="p-2 border">
                  <Link to={`/atlas/series/${item.id}`} className="text-blue-600 underline">View</Link>
                </td>
                <td className="p-2 border text-center text-red-600">
                  <button onClick={() => setToDelete(item)}>
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-2 mt-4 text-sm">
        <button
          className="px-3 py-1 rounded bg-gray-200"
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
        >
          Prev
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            className={`px-3 py-1 rounded ${
              currentPage === i + 1 ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
        <button
          className="px-3 py-1 rounded bg-gray-200"
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

      {/* Confirmation Modal */}
      {toDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
            <p className="mb-4">
              Are you sure you want to delete <strong>{toDelete.name}</strong>?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setToDelete(null)}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
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

export default AtlasTable;
