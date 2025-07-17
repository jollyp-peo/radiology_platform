import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const Courses = () => {
  const [allCourses, setAllCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [query, setQuery] = useState("");

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
        (typeFilter === "Lectures" && course.meet_link) ||
        (typeFilter === "Lectures" && course.recorded_link) ||
        (typeFilter === "Presentations" &&
          (course.material?.endsWith(".ppt") || course.material?.endsWith(".pptx")));

      return matchesQuery && matchesType;
    });

    setFilteredCourses(result);
  }, [query, allCourses, typeFilter]);

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
      {filteredCourses.length === 0 ? (
        <p className="text-center text-gray-500">No matching courses found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div key={course.id} className="bg-white shadow p-4 rounded hover:shadow-lg">
              {course.video && (
                <video src={course.video} controls className="w-full mt-3 rounded" />
              )}
              <h3 className="text-lg font-semibold">{course.title}</h3>
              <p className="text-sm text-gray-500 mt-1">{course.created_at}</p>

              {course.meet_link ? course.meet_link && (
                <a
                  href={course.meet_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block mt-3 text-blue-600 underline"
                >
                  Join Lecture
                </a>
              ): course.recorded_link && (
                <a
                  href={course.recorded_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block mt-3 text-blue-600 underline"
                >
                  Watch Recorded Lecture
                </a>
              )}

              {(course.material?.endsWith(".ppt") || course.material?.endsWith(".pptx")) && (
                <a
                  href={course.material}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block mt-3 text-blue-600 underline"
                >
                  View Presentation
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Courses;
