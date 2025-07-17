import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import toast from "react-hot-toast";

const AdminDashboard = () => {
  const [series, setSeries] = useState([]);
  const [toDelete, setToDelete] = useState(null);
  const [lastDeleted, setLastDeleted] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/atlas/")
      .then((res) => res.json())
      .then(setSeries)
      .catch(console.error);
  }, []);

  const confirmDelete = (item) => {
    setToDelete(item);
  };

  const cancelDelete = () => {
    setToDelete(null);
  };

  const handleDelete = async () => {
    const token = localStorage.getItem("token");
    const item = toDelete;
    setToDelete(null);

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/atlas/${item.id}/delete/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        toast.success(`Deleted "${item.name}". Click to undo.`, {
          duration: 5000,
          action: {
            text: "Undo",
            onClick: () => handleUndo(item),
          },
        });

        setLastDeleted(item);
        setSeries((prev) => prev.filter((s) => s.id !== item.id));
      } else {
        toast.error("Failed to delete. Check permissions.");
      }
    } catch (err) {
      toast.error("Error occurred while deleting.");
      console.error(err);
    }
  };

  const handleUndo = async (item) => {
    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("name", item.name);
    formData.append("modality", item.modality);
    formData.append("description", item.description || "");
    if (item.legend_image) {
      const fileBlob = await fetch(item.legend_image).then(res => res.blob());
      formData.append("legend_image", fileBlob, "legend.png");
    }

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/atlas/upload/`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (res.ok) {
        toast.success("Undo successful.");
        const restored = await res.json();
        setSeries((prev) => [restored, ...prev]);
      } else {
        toast.error("Undo failed.");
      }
    } catch (err) {
      toast.error("Undo error.");
      console.error(err);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Admin Dashboard</h1>

      {/* Upload Buttons */}
      <div className="flex justify-center gap-4 mb-10">
        <Link to="/atlas/upload" className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700">Upload Atlas</Link>
        <Link to="/cases/upload" className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700">Upload Case</Link>
        <Link to="/courses/upload" className="bg-purple-600 text-white px-4 py-2 rounded shadow hover:bg-purple-700">Upload Course</Link>
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
                    <img src={item.legend_image} alt="legend" className="w-12 h-12 object-contain" />
                  ) : "—"}
                </td>
                <td className="p-2 border">
                  <Link to={`/atlas/series/${item.id}`} className="text-blue-600 underline">View</Link>
                </td>
                <td className="p-2 border text-red-600 text-center">
                  <button onClick={() => confirmDelete(item)}>
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Confirmation Modal */}
      {toDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
            <p className="mb-4">Are you sure you want to delete <strong>{toDelete.name}</strong>?</p>
            <div className="flex justify-end gap-4">
              <button onClick={cancelDelete} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">Cancel</button>
              <button onClick={handleDelete} className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
