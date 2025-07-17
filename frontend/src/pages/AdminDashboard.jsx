import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaTrash } from "react-icons/fa";

const AdminDashboard = () => {
  const [series, setSeries] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/atlas/")
      .then((res) => res.json())
      .then(setSeries)
      .catch(console.error);
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this series?");
    if (!confirmDelete) return;

    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/atlas/${id}/delete/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setSeries((prev) => prev.filter((item) => item.id !== id));
      } else {
        alert("Failed to delete. Make sure you're authorized.");
      }
    } catch (err) {
      console.error("Error deleting series:", err);
      alert("An error occurred while deleting.");
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Admin Dashboard</h1>

      {/* Upload Buttons */}
      <div className="flex justify-center gap-4 mb-10">
        <Link
          to="/atlas/upload"
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
        >
          Upload Atlas
        </Link>
        <Link
          to="/cases/upload"
          className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700"
        >
          Upload Case
        </Link>
        <Link
          to="/courses/upload"
          className="bg-purple-600 text-white px-4 py-2 rounded shadow hover:bg-purple-700"
        >
          Upload Course
        </Link>
      </div>

      {/* Atlas Table */}
      <h2 className="text-xl font-semibold mb-4">Uploaded Atlas Series</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-2 border">#</th>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Modality</th>
              <th className="p-2 border">Slices</th>
              <th className="p-2 border">Legend</th>
              <th className="p-2 border">View</th>
              <th className="p-2 border">Delete</th>
            </tr>
          </thead>
          <tbody>
            {series.map((item, index) => (
              <tr key={item.id} className="border-b hover:bg-gray-50">
                <td className="p-2 border">{index + 1}</td>
                <td className="p-2 border">{item.name}</td>
                <td className="p-2 border">{item.modality}</td>
                <td className="p-2 border">{item.images?.length || 0}</td>
                <td className="p-2 border">
                  {item.legend_image ? (
                    <img
                      src={item.legend_image}
                      alt="legend"
                      className="w-12 h-12 object-contain"
                    />
                  ) : (
                    "—"
                  )}
                </td>
                <td className="p-2 border">
                  <Link
                    to={`/atlas/series/${item.id}`}
                    className="text-blue-600 underline"
                  >
                    View
                  </Link>
                </td>
                <td className="p-2 border text-red-600 text-center">
                  <button onClick={() => handleDelete(item.id)}>
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
