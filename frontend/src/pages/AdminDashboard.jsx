import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AtlasTable from "../components/AtlasTable";
import CoursesTable from "../components/CoursesTable";
import CasesTable from "../components/CasesTable";
import { authFetch } from "../utils/authFetch";

const AdminDashboard = () => {
  const [series, setSeries] = useState([]);
  const [courses, setCourses] = useState([]);
  const [cases, setCases] = useState([]);

  useEffect(() => {
    authFetch("http://127.0.0.1:8000/api/atlas/")
      .then((res) => res.json())
      .then((data) => {
        console.log("Atlas data:", data);
        setSeries(data);
      })
      .catch(console.error);

    authFetch("http://127.0.0.1:8000/api/courses/")
      .then((res) => res.json())
      .then(setCourses)
      .catch(console.error);

    authFetch("http://127.0.0.1:8000/api/cases/")
      .then((res) => res.json())
      .then(setCases)
      .catch(console.error);
  }, []);

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
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Uploaded Atlas Series</h2>
        <AtlasTable series={series} setSeries={setSeries} />
      </section>

      {/* Cases Table */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Uploaded Cases</h2>
        <CasesTable cases={cases} setCases={setCases} />
      </section>

      {/* Courses Table */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Uploaded Courses</h2>
        <CoursesTable courses={courses} setCourses={setCourses} />
      </section>
    </div>
  );
};

export default AdminDashboard;
