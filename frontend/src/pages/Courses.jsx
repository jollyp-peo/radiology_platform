import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import CourseCard from "../components/CourseCard";

const Courses = () => {
  const [allCourses, setAllCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 6;

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialType = queryParams.get("type") || "Videos";
  const [typeFilter, setTypeFilter] = useState(initialType);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/courses/")
      .then((res) => res.json())
      .then((data) => {
        setAllCourses(data);
        setFilteredCourses(data);
      });
  }, []);

  useEffect(() => {
    const result = allCourses.filter((course) => {
      const matchesQuery = course.title.toLowerCase().includes(query.toLowerCase());

      const matchesType =
        (typeFilter === "Videos" && course.video) ||
        (typeFilter === "Lectures" && (course.meet_link || course.recorded_link)) ||
        (typeFilter === "Presentations" &&
          (course.material?.endsWith(".ppt") || course.material?.endsWith(".pptx")));

      return matchesQuery && matchesType;
    });

    setFilteredCourses(result);
    setCurrentPage(1);
  }, [query, allCourses, typeFilter]);

  const totalPages = Math.ceil(filteredCourses.length / perPage);
  const paginatedCourses = filteredCourses.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <h2 className="text-3xl font-bold text-center">Educational Courses</h2>

      {/* Search Box */}
      <div className="flex justify-center">
        <input
          type="text"
          placeholder="Search courses..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border px-4 py-2 rounded w-full sm:w-96"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap justify-center gap-4 text-sm font-medium">
        {["Videos", "Lectures", "Presentations"].map((type) => (
          <button
            key={type}
            className={`px-4 py-2 rounded-full ${
              typeFilter === type
                ? "bg-blue-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
            onClick={() => setTypeFilter(type)}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Results */}
      {paginatedCourses.length === 0 ? (
        <p className="text-center text-gray-500">No matching courses found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {paginatedCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 text-sm mt-4">
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
      )}
    </div>
  );
};

export default Courses;
