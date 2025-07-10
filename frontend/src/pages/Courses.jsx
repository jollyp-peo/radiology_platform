import { useEffect, useState } from "react";

const Courses = () => {
  const [allCourses, setAllCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/courses/")
      .then((res) => res.json())
      .then((data) => {
        setAllCourses(data);
        setFilteredCourses(data);
      });
  }, []);

  useEffect(() => {
    const result = allCourses.filter((course) =>
      course.title.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredCourses(result);
  }, [query, allCourses]);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <h2 className="text-3xl font-bold text-center">Educational Courses</h2>

      <div className="flex justify-center">
        <input
          type="text"
          placeholder="Search courses..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border px-4 py-2 rounded w-full sm:w-96"
        />
      </div>

      {filteredCourses.length === 0 ? (
        <p className="text-center text-gray-500">No matching courses found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white shadow p-4 rounded hover:shadow-lg"
            >
              <h3 className="text-lg font-semibold">{course.title}</h3>
              <p className="text-sm text-gray-500 mt-1">{course.created_at}</p>

              {course.video && (
                <video
                  src={course.video}
                  controls
                  className="w-full mt-3 rounded"
                />
              )}

              {course.material && (
                <a
                  href={course.material}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block mt-3 text-blue-600 underline"
                >
                  View PDF
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
